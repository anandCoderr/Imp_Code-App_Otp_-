// import multer from 'multer';

// // Use memory storage instead of disk storage
// const storage = multer.memoryStorage();

// // Multer configuration to handle image upload in memory
// const uploadAny = multer({ storage });

// export default uploadAny;


// ---------------------second code




// import multer from 'multer';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Define __dirname in ES module
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Set up storage for all file types
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(__dirname, '../uploads')); // Store all files in "uploads"
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//         const extension = path.extname(file.originalname);
//         cb(null, `file-${uniqueSuffix}${extension}`);
//     }
// });

// // Multer configuration (no file type restrictions)
// const uploadAny = multer({ storage });

// export default uploadAny;





//---------original multer code-------------------------------- 


import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up storage for all file types
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads')); // Store all files in "uploads"
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname);
        cb(null, `file-${uniqueSuffix}${extension}`);
    }
});


// Multer configuration (no file type restrictions)
const uploadAny = multer({ storage });

export default uploadAny;
