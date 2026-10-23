import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary server-side
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/**
 * Uploads a buffer or base64 data string to Cloudinary
 */
export async function uploadToCloudinary(
  fileUri: string,
  folder: string = "gymwebsite"
): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      fileUri,
      {
        folder,
        resource_type: "image",
        quality: "auto",
        fetch_format: "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("No upload result returned"));
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );
  });
}
