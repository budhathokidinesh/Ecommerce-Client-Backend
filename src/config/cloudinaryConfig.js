import { v2 as cloudinary } from "cloudinary";

// Ensure the required environment variables are set
if (
  !process.env.CLOUD_NAME ||
  !process.env.API_KEY ||
  !process.env.API_SECRET
) {
  throw new Error(
    "Cloudinary configuration missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment."
  );
}

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Upload a local file to Cloudinary and return the public URL
const uploadMediaToCloudinary = async (filepath) => {
  try {
    const result = await cloudinary.uploader.upload(filepath, {
      resource_type: "auto",
    });
    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Error while uploading media to Cloudinary.");
  }
};

const deleteMediaFromCloudinary = async (publicId) => {
  try {
    // Step 1: Try deleting the media as an image first
    let result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });

    // Step 2: Check the result of the deletion

    if (result.result === "ok" || result.result === "deleted") {
      return true;
    } else if (result.result === "not found") {
      console.warn(
        `Media with publicId ${publicId} was not found in Cloudinary`
      );
      return false;
    } else {
      console.error("Unexpected Cloudinary deletion result:", result);
      throw new Error(`Cloudinary deletion failed: ${result.result}`);
    }
  } catch (error) {
    console.error("Cloudinary deletion error:", error.message || error);
    throw new Error("Error while deleting media from Cloudinary.");
  }
};

export { cloudinary, uploadMediaToCloudinary, deleteMediaFromCloudinary };
