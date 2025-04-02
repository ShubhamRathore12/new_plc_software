// "use client";
// import { useEffect, useRef, useState } from "react";
// import * as THREE from "three";

// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// const Dashboard3D = () => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => setLoading(false), 1000);
//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     if (!loading && canvasRef.current) {
//       const canvas = canvasRef.current;
//       const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
//       const scene = new THREE.Scene();
//       const camera = new THREE.PerspectiveCamera(
//         75,
//         canvas.clientWidth / canvas.clientHeight,
//         0.1,
//         1000
//       );
//       camera.position.z = 2;

//       renderer.setSize(canvas.clientWidth, canvas.clientHeight);
//       renderer.setClearColor(0xffffff, 1); // Set the background color to white

//       // Lighting
//       const ambientLight = new THREE.AmbientLight(0xffffff, 1);
//       scene.add(ambientLight);

//       // GLTFLoader to load the 3D model
//       const loader = new GLTFLoader();
//       loader.load(
//         "/models/image.gltf", // Path to the .gltf file in the public folder (ensure correct path)
//         (gltf: any) => {
//           const model = gltf.scene;
//           scene.add(model);
//           model.scale.set(0.5, 0.5, 0.5); // Optional: Adjust model scale
//         },
//         undefined,
//         (error: any) => {
//           console.error("Error loading .gltf model:", error);
//         }
//       );

//       // OrbitControls
      

//       const handleResize = () => {
//         const width = canvas.clientWidth;
//         const height = canvas.clientHeight;
//         renderer.setSize(width, height);
//         camera.aspect = width / height;
//         camera.updateProjectionMatrix();
//       };
//       window.addEventListener("resize", handleResize);

//       const animate = () => {
//         renderer.render(scene, camera);
//         requestAnimationFrame(animate);
//       };
//       animate();

//       return () => {
//         window.removeEventListener("resize", handleResize);
//         renderer.dispose();
//       };
//     }
//   }, [loading]);

//   return (
//     <div className="relative w-full h-full">
//       {loading ? (
//         <div className="absolute inset-0 flex items-center h-full justify-center bg-blue-50/50 dark:bg-gray-800/50 rounded-lg">
//           <div className="flex flex-col items-center">
//             <div className="h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
//             <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
//               Loading 3D view...
//             </span>
//           </div>
//         </div>
//       ) : (
//         <canvas ref={canvasRef} className="w-full h-full rounded-lg" />
//       )}
//     </div>
//   );
// };

// export default Dashboard3D;
