// Initialize Three.js scene
// Note: animateDrone and initializeProductCardAnimations are now global functions
// defined in animations.js and called directly below.

const initScene = () => {
  // Create scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0F172A);
  
  // Create camera
  const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
  );
  camera.position.z = 5;

  // Create renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('scene-container').appendChild(renderer.domElement);

  // Add lights
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // Create drone model (simplified)
  const createDrone = () => {
    const drone = new THREE.Group();
    
    // Body
    const bodyGeometry = new THREE.BoxGeometry(1, 0.3, 1);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x333333,
      specular: 0x111111,
      shininess: 30
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    drone.add(body);

    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
    const armMaterial = new THREE.MeshPhongMaterial({ color: 0x555555 });
    
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const arm = new THREE.Mesh(armGeometry, armMaterial);
      arm.rotation.z = Math.PI/2;
      arm.position.x = Math.cos(angle) * 0.8;
      arm.position.y = Math.sin(angle) * 0.8;
      drone.add(arm);
      
      // Propellers
      const propellerGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 16);
      const propellerMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x06B6D4,
        transparent: true,
        opacity: 0.8
      });
      const propeller = new THREE.Mesh(propellerGeometry, propellerMaterial);
      propeller.position.x = Math.cos(angle) * 1.2;
      propeller.position.y = Math.sin(angle) * 1.2;
      propeller.position.z = 0.1;
      drone.add(propeller);
    }

    return drone;
  };

  const drone = createDrone();
  scene.add(drone);

  // Start anime.js drone rotation
  animateDrone(drone);

  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);
    
    // Drone rotation is now handled by anime.js in animations.js
    
    // Rotate propellers
    drone.children.forEach((child, index) => {
      if (index > 0 && index < 5) { // Propellers
        child.rotation.z += 0.2;
      }
    });

    renderer.render(scene, camera);
  };

  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate();
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initScene();
  
  // Sample product data
  const products = [
    { name: "Autonomous Drone", category: "UAV", description: "AI-powered navigation" },
    { name: "Industrial Arm", category: "Robotics", description: "Precision manufacturing" },
    { name: "Inspection Bot", category: "Robotics", description: "Hazardous environment ready" }
  ];

  // Render product grid
  const productGrid = document.getElementById('product-grid');
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <h3>${product.name}</h3>
      <p class="category">${product.category}</p>
      <p>${product.description}</p>
    `;
    productGrid.appendChild(card);
  });

  // Initialize animations for the newly created product cards
  if (typeof initializeProductCardAnimations === 'function') {
    initializeProductCardAnimations();
  } else {
    console.error("initializeProductCardAnimations function not found. Check animations.js.");
  }
});