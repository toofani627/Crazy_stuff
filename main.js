import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/RGBELoader.js';
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/RenderPass.js';
import { RGBShiftShader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/shaders/RGBShiftShader.js';
import { ShaderPass } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/ShaderPass.js';
import gsap from 'https://cdn.skypack.dev/gsap@3.12.2';

// Scene setup
const scene = new THREE.Scene();
// scene.background = new THREE.Color('green'); // Dark gray background

const camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 0;
camera.position.z = 200;
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#canvas'),
    antialias: false // Disabled antialiasing for better performance
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(1); // Reduced pixel ratio for better performance
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = false; // Disabled shadows for better performance

// Post processing setup
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.uniforms['amount'].value = 0.002;
rgbShiftPass.uniforms['angle'].value = 0.5;
composer.addPass(rgbShiftPass);

// Load HDRI environment map
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

const rgbeLoader = new RGBELoader();
rgbeLoader.setDataType(THREE.HalfFloatType);

// Try loading the HDRI
console.log('Attempting to load HDRI...');
rgbeLoader.load(
    'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/golden_gate_hills_2k.hdr',
    function(texture) {
        console.log('HDRI loaded successfully');
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        scene.environment = envMap;
        // scene.background = envMap;
        texture.dispose();
        pmremGenerator.dispose();
    },
    function(xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function(error) {
        console.error('Error loading HDRI:', error);
        scene.background = new THREE.Color(0x111111);
        scene.environment = new THREE.Color(0x111111);
    }
);

// Load GLTF model
const loader = new GLTFLoader();
let model;

console.log('Starting model load...');
loader.load(
    '/scene.gltf', // Updated path to point to public directory
    function (gltf) {
        console.log('Model loaded successfully');
        model = gltf.scene;
        scene.add(model);
        
        // Center and scale the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Position model at center and move it down
        model.position.set(-center.x, -center.y  -5, -center.z - 0.006); // Moved down by 2 units
        
        // Scale model to fit view - decreased scale for more zoomed out view
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 5 / maxDim; // Decreased from 8 to 5 for more zoomed out view
        model.scale.set(scale, scale, scale);
        
        console.log('Model positioned and scaled');
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error('An error occurred loading the model:', error);
    }
);

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Position camera further back for more zoomed out view
camera.position.z = 4; // Increased from 2.5 to 4

window.addEventListener('mousemove', (event) => {
    if (model) {
        const x = (event.clientX / window.innerWidth - 0.5) * 2; // range [-1, 1]
        const y = (event.clientY / window.innerHeight - 0.5) * 2; // range [-1, 1]

        const maxRotationX = Math.PI * 0.05; // limit X rotation (up/down)
        const maxRotationY = Math.PI * 0.25; // limit Y rotation (left/right)

        gsap.to(model.rotation, {
            x: -y * maxRotationX,
            y: x * maxRotationY,
            duration: 0.9,
            ease: "power2.out"
        });

        // Update pointer position with GSAP
        const pointer = document.querySelector('.pointer');
        gsap.to(pointer, {
            left: event.clientX,
            top: event.clientY,
            duration: .6,
            ease: "power4.out",
            smoothOrigin: true
        });
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Render with post processing
    composer.render();
}

// Start animation
animate();

// Debug information
console.log('Three.js version:', THREE.REVISION);
console.log('Renderer:', renderer.info.render);
console.log('Scene objects:', scene.children.length);

// Animate the h1 element
gsap.from('#h1', {
    opacity: 0,
    y: 100,
    duration: 1.5,
    ease: "power4.out",
    delay: 0.5
});