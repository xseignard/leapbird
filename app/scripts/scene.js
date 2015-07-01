'use strict';

import THREE from 'three';
import threeOrbitControls from 'three-orbit-controls';

var OrbitControls = threeOrbitControls(THREE);

class Scene {
	constructor(options) {
		options = options || {};
		this.scene = new THREE.Scene();
		this.height = window.innerHeight;
		this.width = window.innerWidth;
		// camera stuff
		let fieldOfView = options.fieldOfView || 60;
		let aspectRatio = this.width / this.height;
		let nearPlane = options.nearPlane || 1;
		let farPlane = options.farPlane || 2000;
		this.camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
		this.camera.position.z = 1000;
		this.camera.position.y = 300;
		this.camera.lookAt(new THREE.Vector3(0,0,0));
		// renderer stuff
		this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true });
		this.renderer.setSize(this.width, this.height);
		this.renderer.shadowMapEnabled = true;
		// controls stuff
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		// attach the scene to the DOM
		let container = document.getElementById(options.container || 'world');
		container.appendChild(this.renderer.domElement);
		// handle window resize
		window.addEventListener('resize', this.onWindowResize, false);
	}

	// handle resizing
	onWindowResize() {
		this.height = window.innerHeight;
		this.width = window.innerWidth;
		this.renderer.setSize(this.width, this.height);
		this.camera.aspect = this.width / this.height;
		this.camera.updateProjectionMatrix();
	}

	// shorthand to THREE.scene().add()
	add(object) {
		this.scene.add(object);
	}

	// shorthand to THREE.WebGLRenderer().render()
	render() {
		this.renderer.render(this.scene, this.camera);
	}
}

export default Scene;
