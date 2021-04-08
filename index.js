import * as THREE from './node_modules/three/build/three.module.js';
import {OBJLoader} from './node_modules/three/examples/jsm/loaders/OBJLoader';
import {OrbitControls} from './node_modules/three/examples/jsm/controls/OrbitControls.js';
let isclicked = false
let clickTime
const scene = new THREE.Scene();
var raycaster, mouse = { x : 0, y : 0 };
const fov = 60;
const aspect = 2;  
const near = 0.1;
const far = 200;
var selectedObj;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
function main() {
  const canvas = document.getElementById("c");
  const renderer = new THREE.WebGLRenderer({canvas});
  
  camera.position.y = 60
  scene.background = new THREE.Color('black');
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();
  {
    const size = 50;
    const divisions = 20;
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
 
  const pickPosition = {x: 0, y: 0};
  clearPickPosition();

  function render(time) {
    time *= 1;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
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
      isclicked = false;
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
        if(object.type == "Group"){
          let individuals = object.children
          for(var x = 0; x < individuals.length; x++){
            scene.add(individuals[x])
          }
        }else{
          scene.add( object );
        }
        console.log(scene.children);
        console.log(object);
      }
      r.readAsText(currentFile)
    }
    
});


document.getElementById("c").addEventListener( 'click', raycast, false );
raycaster = new THREE.Raycaster();

function raycast ( e ) {
  if(isclicked == true){
    var smallestDist;
    var smallestDist1;

      mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
  
      raycaster.setFromCamera( mouse, camera );    
  
      var intersects = raycaster.intersectObjects( scene.children, true );
      if(selectedObj != undefined){
        selectedObj.material.color.set(Math.random() + 0xEEEEEE)
      }
      for ( var i = 0; i < intersects.length; i++ ) {
        for ( var i = 0; i < intersects.length; i++ ) {
          if(intersects[i].object.name == "Grid"){
          }else{
            if(smallestDist == undefined){
              smallestDist1 = intersects[i];
            }else if(smallestDist > intersects[i].distance){
              smallestDist1 = intersects[i]
            }
          }
        }
      }
      mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
  
      raycaster.setFromCamera( mouse, camera );    
  
      var intersects = raycaster.intersectObjects( scene.children );
      for ( var i = 0; i < intersects.length; i++ ) {
        if(intersects[i].object.name == "Grid"){
        }else{
          console.log(intersects[i])
          if(smallestDist == undefined){
            smallestDist = intersects[i];
          }else if(smallestDist > intersects[i].distance){
            smallestDist = intersects[i]
          }
        }
      }

      if(smallestDist || smallestDist1){
        if(smallestDist && smallestDist1){
            if(smallestDist.distance > smallestDist1.distance){
              selectedObj = smallestDist1.object
            }else{
              selectedObj = smallestDist.object
            }
        }else if(smallestDist){
            selectedObj = smallestDist.object
        }else if(smallestDist1){
            selectedObj = smallestDist1.object
        }
        selectedObj.material.color.set(Math.random() + 0x35ff03)
      }else{
        if(selectedObj){
          selectedObj.material.color.set(Math.random() + 0xEEEEEE)
          selectedObj = undefined
        }

      }
      console.log(selectedObj)
      isclicked = false;

    }
  }

  document.getElementById("objMove").addEventListener("click", objMoveBtn)
  function objMoveBtn(){
    let c = selectedObj
    if(c) {
      console.log("Selected object: " + selectedObj.name)
    }
  }