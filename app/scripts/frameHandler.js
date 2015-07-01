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
					let leftThumbPos = leftHand.thumb.stabilizedTipPosition;
					let leftPinkyPos = leftHand.pinky.stabilizedTipPosition;

					let rightThumbPos = rightHand.thumb.stabilizedTipPosition;
					let rightPinkyPos = rightHand.pinky.stabilizedTipPosition;

					_this.emit('pos', { lt: leftThumbPos, lp: leftPinkyPos, rt: rightThumbPos, rp: rightPinkyPos });
				}
			}
		});
	}
}

export default FrameHandler;
