import "dotenv/config";

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

import { logger } from "./logger.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

async function uploadOnCloudinary(localFilePath) {
  try {
    if (!localFilePath) {
      logger.warn("Cloudinary upload skipped: no local file path");
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath);

    logger.info("File uploaded to Cloudinary", {
      publicId: response.public_id,
      resourceType: response.resource_type,
    });

    return response;
  } catch (error) {
    logger.error("Cloudinary upload failed", {
      error: error.message,
      stack: error.stack,
    });

    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
}

export { uploadOnCloudinary };
