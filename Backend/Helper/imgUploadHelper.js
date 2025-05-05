import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Manually define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up storage with the correct folder
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploadedImages')); // Store files in "uploadedImages"
    },
    filename: function (req, file, cb) {
        console.log("file arr====>",file);

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname);
        cb(null, `product-${uniqueSuffix}${extension}`);
    }
});

const upload = multer({ storage });

export default upload;





