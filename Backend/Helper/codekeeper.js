

import AWS from 'aws-sdk';
import { removeBackground } from '@imgly/background-removal-node';
import path from 'path';
import fs from 'fs';
import getColors from 'get-image-colors';
import { fileURLToPath } from 'url';
import { errorHelper, successHelper } from '../Helper/globalHelper.js';



// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const removeImageBackground = async (req, res) => {
    let localInputPath, localOutputPath;

    try {
        console.log('Remove bg API calling');

        // AWS Configuration
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
            region: process.env.AWS_REGION,
        });

        const s3 = new AWS.S3();

        console.log("req.file:====>", req.file);

        // Check if file is uploaded
        if (!req.file) {
            return errorHelper(res, { message: 'No image file uploaded.', status: 422 });
        }

        // File paths
        localInputPath = req.file.path; // Path where multer saved the file
        console.log('File saved at:', localInputPath);

        // Remove background using the file path
        let resultBlob;
        try {
            console.log("removeBackground console running");
            resultBlob = await removeBackground(localInputPath);
        } catch (error) {
            console.error('Error removing background:', error);
            return errorHelper(res, { message: 'Failed to remove background.', status: 500 });
        }

        // Convert Blob to Buffer
        const resultArrayBuffer = await resultBlob.arrayBuffer();
        const resultBuffer = Buffer.from(resultArrayBuffer);

        console.log("Save processed image to local file console");

        // Save processed image to local file
        const fileName = path.basename(localInputPath, path.extname(localInputPath)) + ".png"; // Ensure PNG format
        const uploadsDir = path.dirname(localInputPath);
        localOutputPath = path.join(uploadsDir, `processed-${fileName}`);
        fs.writeFileSync(localOutputPath, resultBuffer);

        console.log('Processed file saved at:', localOutputPath);

        // Validate Processed Image
        if (!fs.existsSync(localOutputPath) || fs.statSync(localOutputPath).size === 0) {
            return errorHelper(res, { message: 'Processed image file is invalid or empty.', status: 400 });
        }

        // Upload to AWS S3
        const s3Params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `processed/${fileName}`,
            Body: resultBuffer,
            ContentType: 'image/png', // PNG format
        };

        const s3Response = await s3.upload(s3Params).promise();

        console.log("------------ Uploading to S3 has passed ------------");

        // Extract dominant color from the processed image
        const colors = await getColors(localOutputPath, { count: 1 }).catch((err) => {
            console.error('Error extracting colors:', err);
            return null;
        });

        if (!colors || colors.length === 0) {
            return errorHelper(res, { message: 'Failed to extract colors from image.', status: 400 });
        }

        const dominantColorHEX = colors[0].hex();
        console.log('Dominant Color:', dominantColorHEX);

        return successHelper(
            res,
            'Image processed and uploaded successfully!',
            200,
            { s3Url: s3Response.Location, colors: dominantColorHEX }
        );

    } catch (error) {
        console.error('Error:', error);
        return errorHelper(res, { message: 'Internal server error.', status: 500 });

    } finally {
        // Clean up local files
        if (localInputPath && fs.existsSync(localInputPath)) fs.unlinkSync(localInputPath);
        if (localOutputPath && fs.existsSync(localOutputPath)) fs.unlinkSync(localOutputPath);
    }
};


export default removeImageBackground
