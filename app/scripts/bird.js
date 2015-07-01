import THREE from 'three';
import TweenMax from 'gsap';


class Bird {
	constructor(options) {
		options = options || {};
		this.bodyColor = options.bodyColor || 0xffeb3b;

		// mesh group
		this.threeGroup = new THREE.Group();

		// materials
		this.bodyMaterial = new THREE.MeshLambertMaterial ({
			color: this.bodyColor,
			shading:THREE.FlatShading
		});
		this.beakMaterial = new THREE.MeshLambertMaterial ({
			color: 'red',
			shading:THREE.FlatShading
		});
		this.eyeMaterial = new THREE.MeshLambertMaterial ({
			color: 'white',
			shading:THREE.FlatShading
		});
		this.pupilMaterial = new THREE.MeshLambertMaterial ({
			color: 'black',
			shading:THREE.FlatShading
		});

		// body
		let bodyGeom = new THREE.CylinderGeometry(40, 70, 200, 4);
		this.bodyMesh = new THREE.Mesh(bodyGeom, this.bodyMaterial);
		this.bodyMesh.position.y = 70;
		this.threeGroup.add(this.bodyMesh);

		// beak (4 sides pyramid geometry)
		let beakGeom = new THREE.CylinderGeometry(0, 20, 20, 4);
		this.beakMesh = new THREE.Mesh(beakGeom, this.beakMaterial);
		this.beakMesh.position.z = 65;
		this.beakMesh.position.y = 120;
		this.beakMesh.rotation.x = Math.PI/2;
		this.threeGroup.add(this.beakMesh);

		// eyes
		let eyeGeom = new THREE.BoxGeometry(40, 40, 5);
		// right eye
		this.rightEyeMesh = new THREE.Mesh(eyeGeom, this.eyeMaterial);
		this.rightEyeMesh.position.x = 35;
		this.rightEyeMesh.position.y = 160;
		this.rightEyeMesh.position.z = 35;
		this.threeGroup.add(this.rightEyeMesh);
		// left eye
		this.leftEyeMesh = new THREE.Mesh(eyeGeom, this.eyeMaterial);
		this.leftEyeMesh.position.x = -35;
		this.leftEyeMesh.position.y = 160;
		this.leftEyeMesh.position.z = 35;
		this.threeGroup.add(this.leftEyeMesh);

		// pupils
		let pupilGeom = new THREE.BoxGeometry(10, 10, 5);
		// right pupil
		this.rightPupilMesh = new THREE.Mesh(pupilGeom, this.pupilMaterial);
		this.rightPupilMesh.position.x = 25;
		this.rightPupilMesh.position.y = 150;
		this.rightPupilMesh.position.z = 40;
		this.threeGroup.add(this.rightPupilMesh);
		// left pupil
		this.leftPupilMesh = new THREE.Mesh(pupilGeom, this.pupilMaterial);
		this.leftPupilMesh.position.x = -25;
		this.leftPupilMesh.position.y = 150;
		this.leftPupilMesh.position.z = 40;
		this.threeGroup.add(this.leftPupilMesh);

		// wings
		let wingLength = 120;
		// left wing
		let rightWingGeom = new THREE.BoxGeometry(wingLength, 5, wingLength);
		rightWingGeom.applyMatrix(new THREE.Matrix4().makeTranslation(wingLength/2, 0, 0));
		this.rightWingMesh = new THREE.Mesh(rightWingGeom, this.bodyMaterial);
		this.rightWingMesh.position.x = 35;
		this.rightWingMesh.position.y = 80;
		this.rightWingMesh.position.z = 0;
		this.threeGroup.add(this.rightWingMesh);
		// right wing
		let leftWingeom = new THREE.BoxGeometry(wingLength, 5, wingLength);
		leftWingeom.applyMatrix(new THREE.Matrix4().makeTranslation(-wingLength/2, 0, 0));
		this.leftWingMesh = new THREE.Mesh(leftWingeom, this.bodyMaterial);
		this.leftWingMesh.position.x = -35;
		this.leftWingMesh.position.y = 80;
		this.leftWingMesh.position.z = 0;
		this.threeGroup.add(this.leftWingMesh);
	}

	blink() {
		TweenMax.to(this.leftPupilMesh.scale, 0.3, { y:0.1, ease: Power2.easeInOut, repeat: 1, yoyo: true });
		TweenMax.to(this.rightPupilMesh.scale, 0.3, { y:0.1, ease: Power2.easeInOut, repeat: 1, yoyo: true });
	}
}

export default Bird;
