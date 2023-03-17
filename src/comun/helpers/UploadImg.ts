import { unlinkSync } from 'fs';
import { v2 as cloudinary } from 'cloudinary';

const configCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME || '',
    api_key: process.env.API_KEY || '',
    api_secret: process.env.API_SECRET || '',
  });

  return cloudinary;
};

export const subirImagenACloudinary = async (file) => {
  try {
    const cloudinary = configCloudinary();

    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
    );
    // console.log(file.path);
    unlinkSync(file.path);
    return {
      secure_url,
      public_id,
    };
  } catch (error: any) {
    console.log('error en subirImagenACloudinary', error.message);
  }
};

export const eliminarImagenCloudinary = async (public_id: string) => {
  try {
    const cloudinary = configCloudinary();

    await cloudinary.uploader.destroy(public_id);
  } catch (error: any) {
    console.log('error en eliminarImagenCloudinary', error.message);
  }
};
