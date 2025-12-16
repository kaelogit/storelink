import imageCompression from 'browser-image-compression';

export const compressImage = async (file: File) => {
  const options = {
    maxSizeMB: 0.3,          // Max size: 300KB
    maxWidthOrHeight: 1080,  // Max width/height: 1080px (Standard HD)
    useWebWorker: true,      // Runs faster
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Image compression failed:", error);
    return file; // If it fails, return original file so upload doesn't break
  }
};