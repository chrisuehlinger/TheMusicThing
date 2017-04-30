var analyserNode = context.createAnalyser();
analyserNode.fftSize = 32;


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
mydiv.appendChild( renderer.domElement );

var geometry = new THREE.SphereGeometry(1,8,8);
var cubes = [];
for(var i = 0; i < 8; i++){
  var material = new THREE.MeshBasicMaterial( { color: 'hsl(' + ((i*360/15)+180) + ',70%,50%)', wireframe:true, opacity: 0.5, transparent: true } );
  var cube = new THREE.Mesh( geometry, material );
  cubes.push(cube);
  scene.add( cube );
}

camera.position.z = 3;

var size = 1;

window.onresize = function (){
  renderer.setSize( window.innerWidth, window.innerHeight );
}

var render = function () {
  requestAnimationFrame( render );

  var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);
  analyserNode.getByteFrequencyData(freqByteData);
  //console.log(freqByteData);
  for(var i = 0; i < 8; i++){
    var cube = cubes[i];
    var size = freqByteData[i] / 100;
    cube.scale.set(size, size, size);
    cube.rotation.x += rate / 10;
    cube.rotation.y += rate / 10;
  }

  renderer.render(scene, camera);
};

render();
console.log('HEYO');
