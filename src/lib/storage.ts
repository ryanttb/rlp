import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from './firebase';
import { UploadProgress } from '@/types/models';

export const storageService = {
  // Upload a 3D model file with progress tracking
  async uploadModelFile(
    file: File,
    userId: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<{ url: string; path: string }> {
    try {
      // Create a unique file path
      const timestamp = Date.now();
      const fileName = `${userId}/${timestamp}_${file.name}`;
      const storageRef = ref(storage, `models/${fileName}`);

      // Start upload with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress?.({
              progress,
              status: 'uploading',
              message: `Uploading ${file.name}...`,
            });
          },
          (error) => {
            onProgress?.({
              progress: 0,
              status: 'error',
              message: `Upload failed: ${error.message}`,
            });
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              onProgress?.({
                progress: 100,
                status: 'complete',
                message: 'Upload complete!',
              });
              resolve({
                url: downloadURL,
                path: uploadTask.snapshot.ref.fullPath,
              });
            } catch (error) {
              onProgress?.({
                progress: 0,
                status: 'error',
                message: 'Failed to get download URL',
              });
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Upload a thumbnail image
  async uploadThumbnail(
    file: File,
    userId: string,
    modelId: string
  ): Promise<string> {
    try {
      const fileName = `${userId}/${modelId}/thumbnail_${Date.now()}.jpg`;
      const storageRef = ref(storage, `thumbnails/${fileName}`);
      
      const snapshot = await uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      throw error;
    }
  },

  // Delete a file from storage
  async deleteFile(filePath: string): Promise<void> {
    try {
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  // Get file size and basic metadata
  getFileMetadata(file: File) {
    return {
      size: file.size,
      type: file.type,
      name: file.name,
      lastModified: file.lastModified,
    };
  },

  // Validate file type
  validateFileType(file: File): boolean {
    const allowedTypes = [
      'model/stl',
      'model/obj',
      'model/3mf',
      'model/ply',
      'model/fbx',
      'model/dae',
      'application/octet-stream', // Some 3D files might have this type
    ];
    
    const allowedExtensions = ['.stl', '.obj', '.3mf', '.ply', '.fbx', '.dae'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    return allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension);
  },

  // Get file type from extension
  getFileTypeFromExtension(fileName: string): string {
    const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.') + 1);
    const typeMap: { [key: string]: string } = {
      stl: 'stl',
      obj: 'obj',
      '3mf': '3mf',
      ply: 'ply',
      fbx: 'fbx',
      dae: 'dae',
    };
    return typeMap[extension] || 'unknown';
  },

  // Format file size for display
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Get a fresh download URL for a file (handles CORS issues)
  async getFreshDownloadURL(filePath: string): Promise<string> {
    try {
      const fileRef = ref(storage, filePath);
      const downloadURL = await getDownloadURL(fileRef);
      return downloadURL;
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw error;
    }
  },

  // Alternative method to get download URL with custom parameters
  async getDownloadURLWithParams(filePath: string): Promise<string> {
    try {
      const fileRef = ref(storage, filePath);
      // Force a new download URL with different parameters
      const downloadURL = await getDownloadURL(fileRef);
      // Add a timestamp to force cache refresh
      const separator = downloadURL.includes('?') ? '&' : '?';
      return `${downloadURL}${separator}t=${Date.now()}`;
    } catch (error) {
      console.error('Error getting download URL with params:', error);
      throw error;
    }
  },

  // Get file data as ArrayBuffer (bypasses CORS)
  async getFileData(filePath: string): Promise<ArrayBuffer> {
    try {
      console.log('Getting file data via API for path:', filePath);
      
      // Use our Next.js API route (server-side, no CORS issues)
      const response = await fetch(`/api/model-data?path=${encodeURIComponent(filePath)}`);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      console.log('Successfully got file data via API, size:', arrayBuffer.byteLength);
      return arrayBuffer;
    } catch (error) {
      console.error('Error getting file data:', error);
      throw error;
    }
  },
}; 