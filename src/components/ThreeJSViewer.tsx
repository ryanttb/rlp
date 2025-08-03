'use client';

import { FC, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { storageService } from '@/lib/storage';

interface ThreeJSViewerProps {
  fileUrl: string;
  fileType: 'stl' | 'obj' | '3mf' | 'ply' | 'fbx' | 'dae';
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
}

const ThreeJSViewer: FC<ThreeJSViewerProps> = ({ fileUrl, fileType, dimensions }) => {
  // dimensions prop available for future use: {width, height, depth}
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const mountElement = mountRef.current;
    if (!mountElement) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountElement.clientWidth / mountElement.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountElement.clientWidth, mountElement.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountElement.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(-10, -10, -5);
    scene.add(pointLight);

    // Grid helper
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI;
    controlsRef.current = controls;

    // Load model based on file type
    loadModel(fileUrl, fileType, dimensions);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (renderer && scene && camera) {
        controls.update();
        renderer.render(scene, camera);
      }
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (mountElement && camera && renderer) {
        camera.aspect = mountElement.clientWidth / mountElement.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mountElement.clientWidth, mountElement.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountElement && renderer) {
        mountElement.removeChild(renderer.domElement);
      }
      controls?.dispose();
      renderer?.dispose();
    };
  }, [fileUrl, fileType, dimensions]);

  const loadModel = async (url: string, type: string, dimensions: { width: number, height: number, depth: number }) => {
    try {
      setLoading(true);
      setError(null);

      // Remove existing model
      if (modelRef.current && sceneRef.current) {
        sceneRef.current.remove(modelRef.current);
      }

      // Handle Firebase Storage URLs (CORS fix)
      let finalUrl = url;
      let fileData: ArrayBuffer | null = null;
      
      if (url.includes('firebasestorage.googleapis.com')) {
        try {
          // Extract the file path from the Firebase Storage URL
          const urlParts = url.split('/o/');
          if (urlParts.length > 1) {
            const filePath = decodeURIComponent(urlParts[1].split('?')[0]);
            console.log('Extracted file path:', filePath);
            
            // Try to get file data directly (bypasses CORS)
            try {
              fileData = await storageService.getFileData(filePath);
              console.log('Got file data as ArrayBuffer, size:', fileData.byteLength);
            } catch (dataError) {
              console.warn('Could not get file data, trying URL approach:', dataError);
              // Fallback to URL approach
              try {
                finalUrl = await storageService.getFreshDownloadURL(filePath);
                console.log('Got fresh download URL:', finalUrl);
              } catch (urlError) {
                console.warn('URL approach failed, trying with params:', urlError);
                finalUrl = await storageService.getDownloadURLWithParams(filePath);
                console.log('Got download URL with params:', finalUrl);
              }
            }
          }
        } catch (urlError) {
          console.warn('Could not get fresh download URL, using original:', urlError);
          // Keep the original URL as fallback
        }
      }

      let geometry: THREE.BufferGeometry | null = null;
      let material: THREE.Material | null = null;

      switch (type) {
        case 'stl':
          const stlLoader = new STLLoader();
          if (fileData) {
            // Use file data directly (bypasses CORS)
            console.log('Loading STL from ArrayBuffer data');
            geometry = stlLoader.parse(fileData);
          } else {
            // Fallback to URL loading
            console.log('Loading STL from URL');
            geometry = await new Promise<THREE.BufferGeometry>((resolve, reject) => {
              stlLoader.load(
                finalUrl, 
                resolve, 
                (progress) => {
                  console.log('STL loading progress:', progress);
                }, 
                (error) => {
                  console.error('STL loading error:', error);
                  reject(new Error(`Failed to load STL file: ${error instanceof Error ? error.message : 'CORS or network error'}`));
                }
              );
            });
          }
          material = new THREE.MeshPhongMaterial({ 
            color: 0x156289, 
            emissive: 0x072534, 
            side: THREE.DoubleSide,
            flatShading: true 
          });
          break;

        case 'obj':
          const objLoader = new OBJLoader();
          if (fileData) {
            // Use file data directly (bypasses CORS)
            console.log('Loading OBJ from ArrayBuffer data');
            const text = new TextDecoder().decode(fileData);
            modelRef.current = objLoader.parse(text);
          } else {
            // Fallback to URL loading
            console.log('Loading OBJ from URL');
            const objGroup = await new Promise<THREE.Group>((resolve, reject) => {
              objLoader.load(finalUrl, resolve, undefined, reject);
            });
            modelRef.current = objGroup;
          }
          break;

        case 'ply':
          const plyLoader = new PLYLoader();
          geometry = await new Promise<THREE.BufferGeometry>((resolve, reject) => {
            plyLoader.load(finalUrl, resolve, undefined, reject);
          });
          material = new THREE.MeshStandardMaterial({ 
            color: 0x156289,
            side: THREE.DoubleSide 
          });
          break;

        case 'fbx':
          const fbxLoader = new FBXLoader();
          const fbxGroup = await new Promise<THREE.Group>((resolve, reject) => {
            fbxLoader.load(finalUrl, resolve, undefined, reject);
          });
          modelRef.current = fbxGroup;
          break;

        case 'dae':
          const colladaLoader = new ColladaLoader();
          const colladaScene = await new Promise<{ scene: THREE.Scene }>((resolve, reject) => {
            colladaLoader.load(finalUrl, resolve, undefined, reject);
          });
          modelRef.current = colladaScene.scene;
          break;

        case '3mf':
          // 3MF files are typically handled by specialized loaders
          // For now, we'll show a placeholder
          setError('3MF format support coming soon');
          setLoading(false);
          return;

        default:
          setError(`Unsupported file type: ${type}`);
          setLoading(false);
          return;
      }

      // Calculate model dimensions
      if (modelRef.current) {
        const box = new THREE.Box3().setFromObject(modelRef.current);
        const size = box.getSize(new THREE.Vector3());
        
        // Store dimensions
        dimensions.width = size.x;
        dimensions.height = size.y;
        dimensions.depth = size.z;
      }

      // Create mesh if we have geometry and material
      if (geometry && material) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        modelRef.current = mesh;
      }

      // Add model to scene
      if (modelRef.current && sceneRef.current) {
        sceneRef.current.add(modelRef.current);
        
        // Center and scale the model
        const box = new THREE.Box3().setFromObject(modelRef.current);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Center the model
        modelRef.current.position.sub(center);
        
        // Scale to fit in view
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        modelRef.current.scale.setScalar(scale);
        
        // Adjust camera position
        if (cameraRef.current) {
          cameraRef.current.position.set(3, 3, 3);
          cameraRef.current.lookAt(0, 0, 0);
        }
      }

      setLoading(false);
    } catch (err) {
      console.error('Error loading model:', err);
      setError(`Failed to load model: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading 3D model...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg z-10">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-red-600 dark:text-red-400 mb-2">Error Loading Model</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{error}</p>
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              <p>Supported formats: STL, OBJ, PLY, FBX, DAE</p>
              <p>File type: {fileType.toUpperCase()}</p>
            </div>
          </div>
        </div>
      )}
      
      <div 
        ref={mountRef} 
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ minHeight: '400px' }}
      />
      
      {/* Controls Info */}
      {!loading && !error && (
        <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs p-2 rounded">
          <div>🖱️ Left: Rotate | 🖱️ Right: Pan | 🖱️ Wheel: Zoom</div>
        </div>
      )}
    </div>
  );
};

export default ThreeJSViewer; 