import THREE from 'three';
import threeOrbitControls from 'three-orbit-controls';
import Bird from './bird.js';
import FrameHandler from './frameHandler.js';

//THREEJS RELATED VARIABLES

var scene,
	camera,
	controls,
	fieldOfView,
	aspectRatio,
	nearPlane,
	farPlane,
	shadowLight,
	backLight,
	light,
	renderer,
	container,
	OrbitControls = threeOrbitControls(THREE);

//SCENE
var floor, bird;

//SCREEN VARIABLES

var HEIGHT,
	WIDTH,
	windowHalfX,
	windowHalfY,
	mousePos = {x:0,y:0};


//INIT THREE JS, SCREEN AND MOUSE EVENTS

function init(){
	scene = new THREE.Scene();
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	aspectRatio = WIDTH / HEIGHT;
	fieldOfView = 60;
	nearPlane = 1;
	farPlane = 2000;
	camera = new THREE.PerspectiveCamera(
		fieldOfView,
		aspectRatio,
		nearPlane,
		farPlane);
	camera.position.z = 1000;
	camera.position.y = 300;
	camera.lookAt(new THREE.Vector3(0,0,0));
	renderer = new THREE.WebGLRenderer({alpha: true, antialias: true });
	renderer.setSize(WIDTH, HEIGHT);
	renderer.shadowMapEnabled = true;

	container = document.getElementById('world');
	container.appendChild(renderer.domElement);

	windowHalfX = WIDTH / 2;
	windowHalfY = HEIGHT / 2;

	window.addEventListener('resize', onWindowResize, false);
	document.addEventListener('click', handleMouseClick, false);
	document.addEventListener('mousemove', handleMouseMove, false);
	document.addEventListener('touchstart', handleTouchStart, false);
	document.addEventListener('touchend', handleTouchEnd, false);
	document.addEventListener('touchmove',handleTouchMove, false);

	controls = new OrbitControls(camera, renderer.domElement);
}

function onWindowResize() {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	windowHalfX = WIDTH / 2;
	windowHalfY = HEIGHT / 2;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}

function handleMouseClick() {
	if (bird && bird.blink) bird.blink();
}

function handleMouseMove(event) {
	mousePos = {x:event.clientX, y:event.clientY};
}

function handleTouchStart(event) {
	if (event.touches.length > 1) {
		event.preventDefault();
		mousePos = {x:event.touches[0].pageX, y:event.touches[0].pageY};
	}
}

function handleTouchEnd(event) {
		mousePos = {x:windowHalfX, y:windowHalfY};
}

function handleTouchMove(event) {
	if (event.touches.length == 1) {
		event.preventDefault();
		mousePos = {x:event.touches[0].pageX, y:event.touches[0].pageY};
	}
}

function createLights() {
	light = new THREE.HemisphereLight(0xffffff, 0xffffff, .5)

	shadowLight = new THREE.DirectionalLight(0xffffff, .8);
	shadowLight.position.set(200, 200, 200);
	shadowLight.castShadow = true;
	shadowLight.shadowDarkness = .2;

	backLight = new THREE.DirectionalLight(0xffffff, .4);
	backLight.position.set(-100, 200, 50);
	backLight.shadowDarkness = .1;
	backLight.castShadow = true;

	scene.add(backLight);
	scene.add(light);
	scene.add(shadowLight);
}

function createFloor(){
	floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000,1000), new THREE.MeshBasicMaterial({color: 0xfff9c4}));
	floor.rotation.x = -Math.PI/2;
	floor.position.y = -33;
	floor.receiveShadow = true;
	scene.add(floor);
}

function createBird(){
	bird = new Bird();
	bird.threeGroup.position.x = 0;
	scene.add(bird.threeGroup);
}

var leftAngle, rightAngle, up = new THREE.Vector3(0, 1, 0);

function startTracking() {
	var frameHandler = new FrameHandler();
	frameHandler.on('pos', function(pos) {
		var left = new THREE.Vector3(pos.lt['0'], pos.lt['1'], pos.lt['2']);
		left.sub(new THREE.Vector3(pos.lp['0'], pos.lp['1'], pos.lp['2'])).normalize();
		leftAngle = left.angleTo(up);
		var right = new THREE.Vector3(pos.rt['0'], pos.rt['1'], pos.rt['2']);
		right.sub(new THREE.Vector3(pos.rp['0'], pos.rp['1'], pos.rp['2'])).normalize();
		rightAngle = right.angleTo(up);
		console.log(leftAngle, rightAngle);
	});
}

var canBlink = true;

function loop(ts){
	var timedAngle = Math.sin(ts/500);
	//bird.rightWingMesh.rotation.z = timedAngle;
	//bird.leftWingMesh.rotation.z = - timedAngle;
	bird.rightWingMesh.rotation.z = 3 * Math.PI / 2 + rightAngle  || timedAngle;
	bird.leftWingMesh.rotation.z = Math.PI / 2 - leftAngle || -timedAngle;
	if (Math.random() > 0.95 && canBlink) {
		canBlink = false;
		bird.blink();
		setTimeout(function() {
			canBlink = true;
		}, Math.max(Math.ceil(Math.random()*6000), 1000));
	}
	render();
	requestAnimationFrame(loop);
}

function render(){
	renderer.render(scene, camera);
}


init();
createLights();
createFloor();
createBird();
startTracking();
loop();

