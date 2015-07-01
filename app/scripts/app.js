'use strict';

import THREE from 'three';
import Scene from './scene.js';
import Bird from './bird.js';
import FrameHandler from './frameHandler.js';

// scene
var scene, bird, frameHandler;

function init() {
	scene = new Scene();
	document.addEventListener('click', handleMouseClick, false);
	document.addEventListener('touchend', handleTouchEnd, false);
}

function handleMouseClick() {
	if (bird && bird.blink) bird.blink();
}

function handleTouchEnd() {
	if (bird && bird.blink) bird.blink();
}

function createLights() {
	let light = new THREE.HemisphereLight(0xffffff, 0xffffff, .5)

	let shadowLight = new THREE.DirectionalLight(0xffffff, .8);
	shadowLight.position.set(200, 200, 200);
	shadowLight.castShadow = true;
	shadowLight.shadowDarkness = .2;

	let backLight = new THREE.DirectionalLight(0xffffff, .4);
	backLight.position.set(-100, 200, 50);
	backLight.shadowDarkness = .1;
	backLight.castShadow = true;

	scene.add(backLight);
	scene.add(light);
	scene.add(shadowLight);
}

function createFloor(){
	let floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000,1000), new THREE.MeshBasicMaterial({color: 0xfff9c4}));
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
	frameHandler = new FrameHandler();
	frameHandler.on('pos', function(pos) {
		leftAngle = pos.leftAngle;
		rightAngle = pos.rightAngle;
	});
}

var canBlink = true;

function loop(ts){
	var timedAngle = Math.sin(ts/500);
	bird.rightWingMesh.rotation.z = 3 * Math.PI / 2 + rightAngle  || timedAngle;
	bird.leftWingMesh.rotation.z = Math.PI / 2 - leftAngle || -timedAngle;
	if (Math.random() > 0.95 && canBlink) {
		canBlink = false;
		bird.blink();
		setTimeout(function() {
			canBlink = true;
		}, Math.max(Math.ceil(Math.random()*6000), 1000));
	}
	scene.render();
	requestAnimationFrame(loop);
}

init();
createLights();
createFloor();
createBird();
startTracking();
loop();

