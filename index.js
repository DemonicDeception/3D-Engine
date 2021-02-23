var lesson10 = {
    scene: null, camera: null, renderer: null,
    container: null, controls: null,
    clock: null, stats: null,
    plane: null, selection: null, offset: new THREE.Vector3(), objects: [],
    raycaster: new THREE.Raycaster(),
    init: function() {
      // Create main scene
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0xcce0ff, 0.0003);
      var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
      // Prepare perspective camera
      var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 1, FAR = 1000;
      this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
      this.scene.add(this.camera);
      this.camera.position.set(100, 0, 0);
      this.camera.lookAt(new THREE.Vector3(0,0,0));
      // Prepare webgl renderer
      this.renderer = new THREE.WebGLRenderer({ antialias:true });
      this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
      this.renderer.setClearColor(this.scene.fog.color);
      // Prepare container
      this.container = document.createElement('div');
      document.body.appendChild(this.container);
      this.container.appendChild(this.renderer.domElement);
      // Events
      THREEx.WindowResize(this.renderer, this.camera);
      document.addEventListener('mousedown', this.onDocumentMouseDown, false);
      document.addEventListener('mousemove', this.onDocumentMouseMove, false);
      document.addEventListener('mouseup', this.onDocumentMouseUp, false);
      // Prepare Orbit controls
      this.controls = new THREE.OrbitControls(this.camera);
      this.controls.target = new THREE.Vector3(0, 0, 0);
      this.controls.maxDistance = 150;
      // Prepare clock
      this.clock = new THREE.Clock();
      // Prepare stats
      this.stats = new Stats();
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.left = '50px';
      this.stats.domElement.style.bottom = '50px';
      this.stats.domElement.style.zIndex = 1;
      this.container.appendChild( this.stats.domElement );
      // Add lights
      this.scene.add( new THREE.AmbientLight(0x444444));
      var dirLight = new THREE.DirectionalLight(0xffffff);
      dirLight.position.set(200, 200, 1000).normalize();
      this.camera.add(dirLight);
      this.camera.add(dirLight.target);
    },
    addSkybox: function() {
    },
    onDocumentMouseDown: function (event) {
    },
    onDocumentMouseMove: function (event) {
    },
    onDocumentMouseUp: function (event) {
    }
  };
  // Animate the scene
  function animate() {
    requestAnimationFrame(animate);
    render();
    update();
  }
  // Update controls and stats
  function update() {
    var delta = lesson10.clock.getDelta();
    lesson10.controls.update(delta);
    lesson10.stats.update();
  }
  // Render the scene
  function render() {
    if (lesson10.renderer) {
      lesson10.renderer.render(lesson10.scene, lesson10.camera);
    }
  }
  // Initialize lesson on page load
  function initializeLesson() {
    lesson10.init();
    animate();
  }
  if (window.addEventListener)
    window.addEventListener('load', initializeLesson, false);
  else if (window.attachEvent)
    window.attachEvent('onload', initializeLesson);
  else window.onload = initializeLesson;
  
  sbVertexShader = [
    "varying vec3 vWorldPosition;",
    "void main() {",
    "  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
    "  vWorldPosition = worldPosition.xyz;",
    "  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    "}",
    ].join("\n");
    sbFragmentShader = [
    "uniform vec3 topColor;",
    "uniform vec3 bottomColor;",
    "uniform float offset;",
    "uniform float exponent;",
    "varying vec3 vWorldPosition;",
    "void main() {",
    "  float h = normalize( vWorldPosition + offset ).y;",
    "  gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( h, exponent ), 0.0 ) ), 1.0 );",
    "}",
    ].join("\n");
    // Add 100 random objects (spheres)
  var object, material, radius;
  var objGeometry = new THREE.SphereGeometry(1, 24, 24);
  for (var i = 0; i < 50; i++) {
    material = new THREE.MeshPhongMaterial({color: Math.random() * 0xffffff});
    material.transparent = true;
    object = new THREE.Mesh(objGeometry.clone(), material);
    this.objects.push(object);
    radius = Math.random() * 4 + 2;
    object.scale.x = radius;
    object.scale.y = radius;
    object.scale.z = radius;
    object.position.x = Math.random() * 50 - 25;
    object.position.y = Math.random() * 50 - 25;
    object.position.z = Math.random() * 50 - 25;
    this.scene.add(object);
}
// Plane, that helps to determinate an intersection position
this.plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(500, 500, 8, 8), new THREE.MeshBasicMaterial({color: 0xffffff}));
this.plane.visible = false;
this.scene.add(this.plane);

onDocumentMouseDown: function (event) {
  // Get mouse position
  var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  // Get 3D vector from 3D mouse position using 'unproject' function
  var vector = new THREE.Vector3(mouseX, mouseY, 1);
  vector.unproject(lesson10.camera);
  // Set the raycaster position
  lesson10.raycaster.set( lesson10.camera.position, vector.sub( lesson10.camera.position ).normalize() );
  // Find all intersected objects
  var intersects = lesson10.raycaster.intersectObjects(lesson10.objects);
  if (intersects.length > 0) {
    // Disable the controls
    lesson10.controls.enabled = false;
    // Set the selection - first intersected object
    lesson10.selection = intersects[0].object;
    // Calculate the offset
    var intersects = lesson10.raycaster.intersectObject(lesson10.plane);
    lesson10.offset.copy(intersects[0].point).sub(lesson10.plane.position);
  }
}


  