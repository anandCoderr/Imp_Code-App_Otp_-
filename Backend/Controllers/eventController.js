import eventModel from "../Module/eventModel.js";
import {
  errorHelper,
  successHelper,
  newValidatorHelper,
} from "../Helper/globalHelper.js";

// const setEvent=async(req,res)=>{

//     const image=req.file || req.files;

//     const {title,description,category,status,startDate,endDate}=req.body;
//     try{

//     const rules={
//         title:`required|string`,
//         description:`required|string`,
//         category:`required|string|in:Cricket,Football,Basketball`,
//         status:`required|string|in:ongoing,expired`,
//         startDate:`required|date`,
//         endDate:`required|date`,
//     };

//     const validatorRes=await newValidatorHelper(req.body,rules);

//     if(!validatorRes.success){
//         return errorHelper(res,{message:validatorRes.errors,status:400});
//     }

//     if(!image)
//     {
//         return errorHelper(res,{message:"Image is required",status:400});
//     }

//     const eventData=new eventModel({image,title,description,category,status,startDate,endDate});

//     await eventData.save();

//     return successHelper(res,"Event Created Successfully",200,eventData);
// }
// catch(err){

//     return errorHelper(res,err);
// }

// };

const setEvent = async (req, res) => {
  try {
    const { title, description, category, status, startDate, endDate } =
      req.body;
    const images = req.files || [];

    // Validation rules
    const rules = {
      title: `required|string`,
      description: `required|string`,
      category: `required|string|in:Cricket,Football,Basketball`,
      status: `required|string|in:ongoing,expired`,
      startDate: `required|date`,
      endDate: `required|date`,
    };

    // Validate input data
    const validatorRes = await newValidatorHelper(req.body, rules);
    if (!validatorRes.success) {
      return errorHelper(res, { message: validatorRes.errors, status: 400 });
    }

    // Ensure at least one image is provided
    if (images.length === 0) {
      return errorHelper(res, {
        message: "At least one image is required",
        status: 400,
      });
    }

    // Convert image files into an array of objects matching the schema
    const imageArray = images.map((file) => ({
      name: file.filename || file.originalname,
    }));

    console.log("imageArray :====> ", imageArray);

    // Save event
    const eventData = new eventModel({
      title,
      description,
      category,
      status,
      startDate,
      endDate,
      image: imageArray,
    });
    await eventData.save();

    return successHelper(res, "Event Created Successfully", 200, eventData);
  } catch (err) {
    return errorHelper(res, err);
  }
};

// ----------------update event

const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const images = req.files
      ? req.files.map((file) => ({ name: file.filename }))
      : [];
    const {
      title,
      description,
      category,
      status,
      startDate,
      endDate,
      oldImageIds,
    } = req.body;

    const rules = {
      title: "required|string",
      description: "required|string",
      category: "required|string|in:Cricket,Football,Basketball",
      status: "required|string|in:ongoing,expired",
      startDate: "required|date",
      endDate: "required|date",
    };

    const validatorRes = await newValidatorHelper(req.body, rules);
    if (!validatorRes.success) {
      return errorHelper(res, { message: validatorRes.errors, status: 400 });
    }

    let newOldImageIds;

    if (oldImageIds === undefined || oldImageIds.length === 0) {
      newOldImageIds = [];
    } else {
      newOldImageIds = oldImageIds;
    }

    // Convert start and end date to Date objects
    const formattedStartDate = new Date(startDate);
    const formattedEndDate = new Date(endDate);

    const gettingEventDetails = await eventModel.findById(eventId);
    if (!gettingEventDetails) {
      return errorHelper(res, { message: "Event not found", status: 404 });
    }

    // Filter out old images
    // const safeImgs = gettingEventDetails.image.filter(img => !oldImageIds.includes(img._id.toString()));

    const safeImgs = gettingEventDetails.image.filter(
      (img) => !newOldImageIds.includes(img._id.toString())
    );

    gettingEventDetails.title = title;
    gettingEventDetails.description = description;
    gettingEventDetails.category = category;
    gettingEventDetails.status = status;
    gettingEventDetails.startDate = formattedStartDate;
    gettingEventDetails.endDate = formattedEndDate;

    if (images.length > 0) {
      gettingEventDetails.image = [...safeImgs, ...images];
    } else {
      gettingEventDetails.image = safeImgs;
    }

    await gettingEventDetails.save();
    return successHelper(res, "Event Updated Successfully", 200);
  } catch (err) {
    return errorHelper(res, err);
  }
};

// -------------------delete event

const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const itemDeleted = await eventModel.findByIdAndDelete(eventId);

    if (!itemDeleted) {
      return errorHelper(res, { message: "No Event Found", status: 404 });
    }

    return successHelper(res, "Event Deleted Successfully", 200);
  } catch (err) {
    return errorHelper(res, err);
  }
};

const getEvents = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;

    let filter = {};

    if (status) {
      filter.status = status;
    }

    if (startDate && endDate) {
      filter.startDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const allEvents = await eventModel.find(filter);

    return successHelper(res, "All Events", 200, allEvents);
  } catch (err) {
    return errorHelper(res, err);
  }
};


 

// {
//   $and: [
//     { startDate: { $gte: formattedStartDate } },
//     { startDate: { $lte: formattedEndDate } }
//   ]
// }
// ------- code is like : startDate: { $gte: formattedStartDate, $lte: formattedEndDate }

export { setEvent, updateEvent, deleteEvent, getEvents };
