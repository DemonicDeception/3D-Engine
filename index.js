import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
import {OBJLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/loaders/OBJLoader.js';
import {OrbitControls} from './node_modules/three/examples/jsm/controls/OrbitControls.js';
let isclicked = false
let clickTime
const scene = new THREE.Scene();
var raycaster, mouse = { x : 0, y : 0 };
const fov = 60;
const aspect = 2;  
const near = 0.1;
const far = 200;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
function main() {
  const canvas = document.getElementById("c");
  const renderer = new THREE.WebGLRenderer({canvas});
  
  //camera.position.z = 60
  camera.position.y = 60
  scene.background = new THREE.Color('black');
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();
  {
    const size = 500;
    const divisions = 200;
    const gridHelper = new THREE.GridHelper( size, divisions );
    gridHelper.name = "Grid"
    scene.add( gridHelper );
  }
  {
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const cube = new THREE.Mesh(geometry);
    cube.material.color.set(Math.random() + 0xEEEEEE)

    scene.add(cube);
  }
  const cameraPole = new THREE.Object3D();
  scene.add(cameraPole);
  cameraPole.add(camera);

  {
    const color = 0xFFFFFF;
    const intensity = 0.5;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    camera.add(light);
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  // class PickHelper {
  //   constructor() {
  //     this.raycaster = new THREE.Raycaster();
  //     this.pickedObject = null;
  //     this.pickedObjectSavedColor = null;
  //   }
  //   pick(normalizedPosition, scene, camera, time) {
  //     if(isclicked == true){
  //     this.raycaster.setFromCamera(normalizedPosition, camera);
  //     const intersectedObjects = this.raycaster.intersectObjects(scene.children);
  //     console.log(intersectedObjects)
  //     if (intersectedObjects.length != 0) {
  //       let Objname = intersectedObjects[0].object.name
  //       if(Objname == "Arrow1" || Objname == "Arrow2" || Objname == "Arrow3" || Objname == "Arrow4" || Objname == "Arrow5"){
  //         console.log(" ")
  //       }
  //       if(intersectedObjects[0].object.name == "Grid" || intersectedObjects[0].object.name == "GridHelper"){
  //         if(this.pickedObject != null && this.pickedObject != undefined){
  //           this.pickedObject.material.color.set(Math.random() + 0xEEEEEE)
  //           this.pickedObjectSavedColor = 0
  //           this.pickedObject = undefined
  //           arrowHandling("remove")
  //           isclicked = false
  //         }
  //       }else{
  //         if(this.pickedObjectSavedColor == null || this.pickedObjectSavedColor == 0){
  //           this.pickedObject = intersectedObjects[0].object;
  //           this.pickedObjectSavedColor = intersectedObjects[0].object.material.color
  //           arrowHandling("add")
  //           isclicked = false
  //         }
  //         this.pickedObject.material.color.set(Math.random() + 0x0FFF00)
  //       }
  //     }else{
  //       if(this.pickedObject && this.pickedObjectSavedColor){
  //         this.pickedObject.material.color.set(Math.random() + 0xEEEEEE)
  //         this.pickedObjectSavedColor = 0
  //         this.pickedObject = undefined
  //         arrowHandling("remove")
  //         isclicked = false

  //       }
  //     }
  //   }
  //   }
  // }
 
  const pickPosition = {x: 0, y: 0};
  //const pickHelper = new PickHelper();
  clearPickPosition();

  function render(time) {
    time *= 1;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    //pickHelper.pick(pickPosition, scene, camera, time);


    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  function getCanvasRelativePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * canvas.width  / rect.width,
      y: (event.clientY - rect.top ) * canvas.height / rect.height,
    };
  }

  function setPickPosition(event) {
    let today = new Date();
    let mili1 = today.getMilliseconds()
    let mili2 = clickTime.getMilliseconds()
    let mili = mili1 - mili2
    if(mili < 200 && mili > 0){
      console.log(mili)
      isclicked = true
      const pos = getCanvasRelativePosition(event);
      pickPosition.x = (pos.x / canvas.width ) *  2 - 1;
      pickPosition.y = (pos.y / canvas.height) * -2 + 1;
    }else{
      
    }
    
}

  function clearPickPosition() {
    pickPosition.x = -100000;
    pickPosition.y = -100000;
  }
  function onMouseDown(){
    let today = new Date();
    clickTime = today
  }
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mouseup", setPickPosition)


  function arrowHandling(action){
    var i;
    let dir = new THREE.Vector3(-90, 0, 0 );
    dir.normalize();
    const origin = new THREE.Vector3( 0, 0, 0 );
    const length = 3;
    const hex = 0xffff00;
    if(action == "add"){
      for(i = 0; i <= 6; i++){
        const arrow = new THREE.ArrowHelper( dir, origin, length, hex );
        arrow.name = "Arrow" + i.toString()
        if(i < 2){
          dir.x += 90
        }else if(i < 4){
          dir.x = 0
          if(i == 3){
            dir.y = 90
          }else{
            dir.y = -90
          }
        }else if(i < 6){
          dir.y = 0
          if(i == 4){
            dir.z = 90
          }else{
            dir.z = -90
            console.log(scene)
          }
        }
        scene.add( arrow );
      }
    }else{
      for(i = 0; i <= 6; i++){
        let arrow = scene.getObjectByName("Arrow" + i.toString());
        if(arrow){
          scene.remove( arrow );
        }
      }
    }
  }
  
}
main(); 














const fileSelector = document.getElementById('myFile');
console.log(fileSelector)
fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files;
    console.log(fileList);
    let currentFile = event.target.files[0];
    console.log(currentFile);
    
    if(currentFile){
      var r = new FileReader();
      r.onload = function(e) {
        var contents = e.target.result;
        let loader = new OBJLoader();
        const object = loader.parse( contents );
        console.log(object);
        scene.add( object );
      }
      r.readAsText(currentFile)
    }
    
});


document.getElementById("c").addEventListener( 'click', raycast, false );
raycaster = new THREE.Raycaster();

function raycast ( e ) {
      mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
  
      raycaster.setFromCamera( mouse, camera );    
  
      var intersects = raycaster.intersectObjects( scene.children, true );
  
      for ( var i = 0; i < intersects.length; i++ ) {
          console.log( intersects[ i ] ); 
      }
      mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
  
      raycaster.setFromCamera( mouse, camera );    
  
      var intersects = raycaster.intersectObjects( scene.children );
      for ( var i = 0; i < intersects.length; i++ ) {
          console.log( intersects[ i ] ); 
      }
  
  }