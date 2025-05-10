import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const deleteFromCloudinary = async (imageUrl: string) => {
  try {
    // Extract public_id from the Cloudinary URL
    const urlParts = imageUrl.split('/');
    const lastPart = urlParts[urlParts.length - 1];
    const publicId = lastPart.split('.')[0];
    
    // Get the folder path if it exists
    const folderPath = urlParts.slice(-2, -1)[0];
    const fullPublicId = folderPath ? `${folderPath}/${publicId}` : publicId;
    
    console.log("Attempting to delete:", fullPublicId);
    
    const result = await cloudinary.uploader.destroy(fullPublicId);
    console.log("Delete result:", result);
    
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
  }
};

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

export const uploadToCloudinary = async (file: File): Promise<CloudinaryUploadResult> => {
  try {
    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${base64String}`;

    // Upload to Cloudinary using the SDK
    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        {
          folder: "tenant-profiles",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          resolve(result as CloudinaryUploadResult);
        }
      );
    });

    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};