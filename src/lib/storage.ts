import { Storage } from '@google-cloud/storage';

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const bucketName = process.env.CLOUD_STORAGE_BUCKET || 'default-bucket';
const bucket = storage.bucket(bucketName);

export interface UploadResult {
  url: string;
  filename: string;
}

export const uploadFile = async (
  file: Buffer,
  filename: string,
  contentType: string
): Promise<UploadResult> => {
  const blob = bucket.file(filename);
  
  await blob.save(file, {
    metadata: {
      contentType,
    },
    resumable: false,
  });

  // Make the file publicly readable
  await blob.makePublic();

  const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
  
  return {
    url: publicUrl,
    filename,
  };
};

export const deleteFile = async (filename: string): Promise<void> => {
  const blob = bucket.file(filename);
  await blob.delete();
};

export const getSignedUrl = async (
  filename: string,
  action: 'read' | 'write' = 'read',
  expiresIn: number = 3600
): Promise<string> => {
  const blob = bucket.file(filename);
  
  const [url] = await blob.getSignedUrl({
    version: 'v4',
    action,
    expires: Date.now() + expiresIn * 1000,
  });
  
  return url;
};

export default storage; 