import { Category } from '@/types/models';

export const defaultCategories: Omit<Category, 'id' | 'createdAt'>[] = [
  {
    name: 'Mechanical Parts',
    description: 'Gears, bearings, brackets, and mechanical components',
    color: '#3B82F6',
    icon: '⚙️',
  },
  {
    name: 'Art & Sculptures',
    description: 'Decorative items, figurines, and artistic pieces',
    color: '#8B5CF6',
    icon: '🎨',
  },
  {
    name: 'Household Items',
    description: 'Everyday objects, organizers, and home accessories',
    color: '#10B981',
    icon: '🏠',
  },
  {
    name: 'Tools & Equipment',
    description: 'Custom tools, jigs, and workshop equipment',
    color: '#F59E0B',
    icon: '🔧',
  },
  {
    name: 'Prototypes',
    description: 'Product prototypes and concept models',
    color: '#EF4444',
    icon: '🧪',
  },
  {
    name: 'Educational',
    description: 'Learning models, teaching aids, and educational tools',
    color: '#06B6D4',
    icon: '📚',
  },
  {
    name: 'Replacement Parts',
    description: 'Spare parts and replacement components',
    color: '#6B7280',
    icon: '🔧',
  },
  {
    name: 'Custom Designs',
    description: 'Personalized and custom-designed objects',
    color: '#EC4899',
    icon: '✨',
  },
];

export const fileTypeOptions = [
  { value: 'stl', label: 'STL', description: 'Stereolithography format' },
  { value: 'obj', label: 'OBJ', description: 'Wavefront OBJ format' },
  { value: '3mf', label: '3MF', description: '3D Manufacturing Format' },
  { value: 'ply', label: 'PLY', description: 'Stanford Polygon Library' },
  { value: 'fbx', label: 'FBX', description: 'Autodesk FBX format' },
  { value: 'dae', label: 'DAE', description: 'COLLADA format' },
];

export const materialOptions = [
  { value: 'pla', label: 'PLA', description: 'Polylactic Acid' },
  { value: 'abs', label: 'ABS', description: 'Acrylonitrile Butadiene Styrene' },
  { value: 'petg', label: 'PETG', description: 'Polyethylene Terephthalate Glycol' },
  { value: 'tpu', label: 'TPU', description: 'Thermoplastic Polyurethane' },
  { value: 'resin', label: 'Resin', description: 'UV-curable resin' },
  { value: 'metal', label: 'Metal', description: 'Metal filaments' },
];

export const layerHeightOptions = [
  { value: 0.1, label: '0.1mm', description: 'High quality' },
  { value: 0.15, label: '0.15mm', description: 'Standard quality' },
  { value: 0.2, label: '0.2mm', description: 'Fast print' },
  { value: 0.25, label: '0.25mm', description: 'Draft quality' },
  { value: 0.3, label: '0.3mm', description: 'Very fast' },
];

export const infillOptions = [
  { value: 10, label: '10%', description: 'Lightweight' },
  { value: 20, label: '20%', description: 'Standard' },
  { value: 30, label: '30%', description: 'Balanced' },
  { value: 50, label: '50%', description: 'Strong' },
  { value: 80, label: '80%', description: 'Very strong' },
  { value: 100, label: '100%', description: 'Solid' },
]; 