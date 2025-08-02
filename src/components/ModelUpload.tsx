'use client';

import { FC, useState, useCallback, useRef, useMemo } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { modelService } from '@/lib/firestore';
import { Model, UploadProgress } from '@/types/models';

interface ModelUploadProps {
  onUploadComplete?: (model: Model) => void;
  onUploadError?: (error: string) => void;
}

const ModelUpload: FC<ModelUploadProps> = ({ onUploadComplete, onUploadError }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedFileTypes = useMemo(() => ['stl', 'obj', '3mf', 'ply', 'fbx', 'dae'], []);
  const maxFileSize = 100 * 1024 * 1024; // 100MB

  const handleFileUpload = useCallback(async (file: File) => {
    const validateFile = (file: File): string | null => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      if (!extension || !allowedFileTypes.includes(extension)) {
        return `File type not supported. Allowed types: ${allowedFileTypes.join(', ')}`;
      }
      
      if (file.size > maxFileSize) {
        return `File size too large. Maximum size: ${Math.round(maxFileSize / 1024 / 1024)}MB`;
      }
      
      return null;
    };

    const validationError = validateFile(file);
    if (validationError) {
      onUploadError?.(validationError);
      return;
    }

    setIsUploading(true);
    setUploadProgress({ progress: 0, status: 'uploading', message: 'Starting upload...' });

    try {
      // Create a unique filename
      const timestamp = Date.now();
      const filename = `models/${timestamp}_${file.name}`;
      
      // Upload to Firebase Storage
      const storageRef = ref(storage, filename);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress({
            progress: Math.round(progress),
            status: 'uploading',
            message: `Uploading... ${Math.round(progress)}%`
          });
        },
        (error) => {
          console.error('Upload error:', error);
          setUploadProgress({ progress: 0, status: 'error', message: 'Upload failed' });
          onUploadError?.(error.message);
          setIsUploading(false);
        },
        async () => {
          setUploadProgress({ progress: 100, status: 'processing', message: 'Processing model...' });
          
          try {
            // Get download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            // Create model record in Firestore
            const modelData = {
              name: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
              description: '',
              category: 'uncategorized',
              tags: [],
              fileUrl: downloadURL,
              fileSize: file.size,
              fileType: file.name.split('.').pop()?.toLowerCase() as Model['fileType'],
              dimensions: { width: 0, height: 0, depth: 0 }, // Will be calculated later
              userId: 'demo-user', // Replace with actual user ID
              status: 'ready' as const,
            };

            const modelId = await modelService.createModel(modelData);
            
            setUploadProgress({ progress: 100, status: 'complete', message: 'Upload complete!' });
            
            // Call callback with the created model
            const createdModel: Model = {
              id: modelId,
              ...modelData,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            
            onUploadComplete?.(createdModel);
            
            // Reset after a delay
            setTimeout(() => {
              setUploadProgress(null);
              setIsUploading(false);
            }, 2000);
            
          } catch (error) {
            console.error('Error creating model record:', error);
            setUploadProgress({ progress: 0, status: 'error', message: 'Failed to save model data' });
            onUploadError?.('Failed to save model data');
            setIsUploading(false);
          }
        }
      );
    } catch (error) {
      console.error('Upload error:', error);
      setUploadProgress({ progress: 0, status: 'error', message: 'Upload failed' });
      onUploadError?.('Upload failed');
      setIsUploading(false);
    }
  }, [onUploadComplete, onUploadError, maxFileSize, allowedFileTypes]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleClick = useCallback(() => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  }, [isUploading]);

  return (
    <div className="w-full">
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
          }
          ${isUploading ? 'pointer-events-none opacity-75' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".stl,.obj,.3mf,.ply,.fbx,.dae"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
        
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl text-white">
              {isUploading ? '⏳' : '📁'}
            </span>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {isUploading ? 'Uploading...' : 'Upload 3D Model'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {isUploading 
                ? 'Please wait while we process your file'
                : 'Drag and drop your 3D model file here, or click to browse'
              }
            </p>
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Supported formats: STL, OBJ, 3MF, PLY, FBX, DAE</p>
            <p>Maximum file size: 100MB</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {uploadProgress && (
        <div className="mt-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-300">
              {uploadProgress.message}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {uploadProgress.progress}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`
                h-2 rounded-full transition-all duration-300
                ${uploadProgress.status === 'error' 
                  ? 'bg-red-500' 
                  : uploadProgress.status === 'complete'
                  ? 'bg-green-500'
                  : 'bg-blue-500'
                }
              `}
              style={{ width: `${uploadProgress.progress}%` }}
            />
          </div>
          
          {uploadProgress.status === 'error' && (
            <p className="text-red-600 dark:text-red-400 text-sm">
              {uploadProgress.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ModelUpload; 