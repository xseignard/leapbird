'use strict';

import Leap from 'leapjs';
import * as plugin from 'leapjs-plugins';
import EventEmitter from 'events';

class FrameHandler extends EventEmitter {
	constructor(options) {
		options = options || {};
		super();
		this.controller = new Leap.Controller({enableGestures: true});
		this.controller.use('screenPosition');
		this.controller.connect();
		this.controller.setBackground(true);
		let _this = this;
		this.controller.on('frame', function(frame){
			if (frame.hands.length === 2) {
				let leftHand, rightHand;
				switch (frame.hands[0].type) {
					case 'left': leftHand = frame.hands[0]; break;
					case 'right': rightHand = frame.hands[0]; break;
				}
				switch (frame.hands[1].type) {
					case 'left': leftHand = frame.hands[1]; break;
					case 'right': rightHand = frame.hands[1]; break;
				}
				if (leftHand && rightHand) {
					// normalized up vector
					let up = Leap.vec3.set({}, 0, 1, 0);
					// compute angle made by the vector between thumb and pinky tips and the up vector
					// right
					let leftThumbPos = leftHand.thumb.stabilizedTipPosition;
					let leftPinkyPos = leftHand.pinky.stabilizedTipPosition;
					let left = Leap.vec3.sub({}, leftThumbPos, leftPinkyPos);
					left = Leap.vec3.normalize({}, left);
					let leftAngle = Math.acos(Leap.vec3.dot(left, up));
					// left
					let rightThumbPos = rightHand.thumb.stabilizedTipPosition;
					let rightPinkyPos = rightHand.pinky.stabilizedTipPosition;
					let right = Leap.vec3.sub({}, rightThumbPos, rightPinkyPos);
					right = Leap.vec3.normalize({}, right);
					let rightAngle = Math.acos(Leap.vec3.dot(right, up));
					// emit angles
					_this.emit('pos', { leftAngle: leftAngle, rightAngle: rightAngle });
				}
			}
		});
	}
}

export default FrameHandler;
