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

export interface Printer {
  id: string;
  name: string;
  type: 'Levity' | 'Print as a Service';
  status: 'online' | 'offline' | 'maintenance' | 'printing';
  location?: string;
  description?: string;
  capabilities?: {
    maxBuildVolume?: {
      width: number;
      height: number;
      depth: number;
    };
    supportedMaterials?: string[];
    layerHeightRange?: {
      min: number;
      max: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface PrintJob {
  id: string;
  modelId: string;
  printerId: string;
  status: 'queued' | 'preparing' | 'printing' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  estimatedDuration?: number; // in minutes
  actualDuration?: number; // in minutes
  progress?: number; // 0-100
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  printSettings: {
    layerHeight: number;
    infill: number;
    support: boolean;
    material: string;
    temperature?: number;
    bedTemperature?: number;
  };
  notes?: string;
} 