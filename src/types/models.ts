export interface Model {
  id: string;
  name: string;
  description?: string;
  category: string;
  tags: string[];
  fileUrl: string;
  fileSize: number;
  fileType: 'stl' | 'obj' | '3mf' | 'ply' | 'fbx' | 'dae';
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  thumbnailUrl?: string;
  printSettings?: {
    layerHeight: number;
    infill: number;
    support: boolean;
    material: string;
  };
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  createdAt: Date;
}

export interface UploadProgress {
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  message?: string;
}

export interface ModelFilters {
  category?: string;
  tags?: string[];
  fileType?: string[];
  status?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
} 