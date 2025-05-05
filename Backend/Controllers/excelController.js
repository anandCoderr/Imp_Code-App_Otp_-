import excelModel from "../Module/ExcelModel.js";
import Product from "../Module/productModel.js";

import xlsx from "xlsx";
import fs from "fs";
import { errorHelper, successHelper } from "../Helper/globalHelper.js";

import { fileURLToPath } from "url"; 
import path from "path";


// Define __dirname manually if using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const excelCont = async (req, res) => {
  const { file } = req;

  try {
    if (!file) {
      return errorHelper(res, { message: "No file uploaded", status: 400 });
    }

    // Read the uploaded Excel file
    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
      defval: null, // Ensures empty cells are treated as null instead of undefined
    });

    if (jsonData.length === 0) {
      return errorHelper(res, { message: "Excel sheet is empty", status: 400 });
    }

    // Define required columns
    const requiredColumns = ["Title", "Description", "Images", "Category"];

    // Check for missing data
    const missingRows = [];

    jsonData.forEach((row, index) => {
      const missingColumns = [];

      for (const column of requiredColumns) {
        if (!row[column]) {
          missingColumns.push(column); // Store missing column name
        }
      }

      if (missingColumns.length > 0) {
        missingRows.push({
          row: index + 2, // Adjust row number for Excel (1-based index + header row)
          missingColumns: missingColumns,
        });
      }
    });

    console.log("missing Rows :--->",missingRows);

    if (missingRows.length > 0) {
      return res.status(400).json({
        message: "Missing data detected",
        details: missingRows,
        status: 400,
      });
    }

    // Insert data into MongoDB
    const updatedVal = await excelModel.insertMany(jsonData, { ordered: false });

    if (!updatedVal || updatedVal.length === 0) {
      return errorHelper(res, {
        message: "No valid records were inserted",
        status: 500,
      });
    }

    return successHelper(
      res,
      { message: "File uploaded successfully", data: updatedVal },
      200
    );
  } catch (err) {
    console.error("Database insertion error:", err);
    return errorHelper(res, err);
  } finally {
    try {
      if (file?.path) {
        fs.unlinkSync(file.path);
      }
    } catch (unlinkErr) {
      console.error("Error deleting file:", unlinkErr);
    }
  }
};



// const getInExcel = async (req, res) => {
//   try {
//     const excelData = await excelModel.find({});
//     if (!excelData || excelData.length === 0) {
//       return errorHelper(res, { message: "No data found", status: 404 });
//     }

//     // Convert JSON data to Excel format
//     const worksheet = xlsx.utils.json_to_sheet(excelData);
//     const workbook = xlsx.utils.book_new();
//     xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");

//     // Generate Excel file as a buffer (in-memory)
//     const excelBuffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

//     // Convert buffer to base64
//     const fileBase64 = excelBuffer.toString("base64");

//     // Send response with download link (base64 encoded)
//     return successHelper(res, {
//       message: "Here is your data",
//       downloadLink: `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${fileBase64}`,
//     }, 200);

//   } catch (err) {
//     console.error("Excel export error:", err);
//     return errorHelper(res, err);
//   }
// };




// const getInExcel = async (req, res) => {
//   try {
//     const excelData = await excelModel.find({});
//     if (!excelData || excelData.length === 0) {
//       return errorHelper(res, { message: "No data found", status: 404 });
//     }

//     // Convert JSON data to Excel format
//     const worksheet = xlsx.utils.json_to_sheet(excelData);
//     const workbook = xlsx.utils.book_new();
//     xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");

//     // Generate Excel file as a buffer (in-memory)
//     const excelBuffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

//     // Convert buffer to base64
//     const fileBase64 = excelBuffer.toString("base64");

//     // Send response with download link (base64 encoded)
//     return successHelper(res, {
//       message: "Here is your data",
//       downloadLink: `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${fileBase64}`,
//     }, 200);

//   } catch (err) {
//     console.error("Excel export error:", err);
//     return errorHelper(res, err);
//   }
// };


// const getInExcel = async (req, res) => {
//   try {
//     const excelData = await excelModel.find({});
//     if (!excelData || excelData.length === 0) {
//       return res.status(404).json({ message: "No data found" });
//     }

//     // Convert JSON data to Excel format
//     const worksheet = xlsx.utils.json_to_sheet(excelData);
//     const workbook = xlsx.utils.book_new();
//     xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");

//     // Set response headers for file download
//     res.setHeader("Content-Disposition", "attachment; filename=data.xlsx");
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );

//     // Generate Excel file and send as response
//     const excelBuffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });
//     res.send(excelBuffer);

//   } catch (err) {
//     console.error("Excel export error:", err);
//     res.status(500).json({ message: "Internal Server Error", error: err.message });
//   }
// };

const getInExcel = async (req, res) => {
  try {
    const products = await Product.find({}, "title description price"); // Select specific fields

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    // Convert MongoDB data to plain JavaScript objects
    const productData = products.map(({ title, description, price }) => ({
      Title: title,
      Description: description,
      Price: price,
    }));

    // Convert JSON to Excel format
    const worksheet = xlsx.utils.json_to_sheet(productData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Products");

    // Set response headers for file download
    res.setHeader("Content-Disposition", "attachment; filename=products.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // Generate Excel file and send as response
    const excelBuffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });
    res.send(excelBuffer);

  } catch (err) {
    console.error("Excel export error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};


export { excelCont, getInExcel };
// const getInExcel=async(req,res)=>{
//   try {
//     const excelData = await excelModel.find({});
//     if (!excelData || excelData.length === 0) {
//       return errorHelper(res, { message: "No data found", status: 404 });
//     }

//     const worksheet = xlsx.utils.json_to_sheet(excelData);
//     const workbook = xlsx.utils.book_new();
//     xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  
//     const filePath = path.join(__dirname, "output.xlsx");
//     xlsx.writeFile(workbook, filePath);
  
//     return res.download(filePath, "data.xlsx", (err) => {
//       if (err) {
//         console.error("Error downloading file:", err);
//         res.status(500).send("Error downloading file");
//       }
//       fs.unlinkSync(filePath); // Delete file after download
//     });
//   }
  


//     // return successHelper(res, { message: "Data fetched successfully", data: excelData }, 200);
//   catch (err) {
//     console.error("Database retrieval error:", err);
//     return errorHelper(res, err);
//   }
// }






// ---------------------------------

// import excelModel from "../Module/ExcelModel.js";
// import xlsx from "xlsx";
// import fs from "fs";
// import { errorHelper, successHelper } from "../Helper/globalHelper.js";

// const excelCont = async (req, res) => {
//   const { file } = req;

//   try {
//     if (!file) {
//       return errorHelper(res, { message: "No file uploaded", status: 400 });
//     }

//     // Read the uploaded Excel file
//     const workbook = xlsx.readFile(file.path);
//     const sheetName = workbook.SheetNames[0];
//     const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
//       defval: null, // Ensures empty cells are treated as null instead of undefined
//     });

//     if (jsonData.length === 0) {
//       return errorHelper(res, { message: "Excel sheet is empty", status: 400 });
//     }

//     // Define required columns
//     const requiredColumns = ["Title", "Description", "Images","Category"]; // Will hold row name which we wanted to check for empty data

//     // Check for missing data
//     const missingRows = [];
//     jsonData.forEach((row, index) => {
//       for (const column of requiredColumns) {
//         if (!row[column]) {
//           missingRows.push(index + 2); // Adding 2 to match Excel row numbers (1-based index + header row)
//           break;
//         }
//       }
//     });

//     if (missingRows.length > 0) {
//       return errorHelper(res, {
//         message: `Missing data in rows: ${missingRows.join(", ")}`,
//         status: 400,
//       });
//     }

//     // Insert data into MongoDB
//     const updatedVal = await excelModel.insertMany(jsonData, { ordered: false });

//     if (!updatedVal || updatedVal.length === 0) {
//       return errorHelper(res, {
//         message: "No valid records were inserted",
//         status: 500,
//       });
//     }

//     return successHelper(
//       res,
//       { message: "File uploaded successfully", data: updatedVal },
//       200
//     );
//   } catch (err) {
//     console.error("Database insertion error:", err);
//     return errorHelper(res, err);
//   } finally {
//     try {
//       if (file?.path) {
//         fs.unlinkSync(file.path);
//       }
//     } catch (unlinkErr) {
//       console.error("Error deleting file:", unlinkErr);
//     }
//   }
// };

// export { excelCont };


