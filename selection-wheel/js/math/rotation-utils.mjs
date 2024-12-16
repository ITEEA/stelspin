//////////////////
// Requirements //
//////////////////

//////////////////



////////////////////////
// Internal.Utilities //
////////////////////////

function wrapAngle (angle) {
	const FULL = 2 * Math.PI;
	const HALF = 1 * Math.PI;

	/*/ end const /*/

	if (angle < -HALF) {
		return angle - Math.floor(angle / FULL) * FULL;
	}

	if (angle > +HALF) {
		return angle - Math.ceil(angle / FULL) * FULL;
	}

	/*/ end logic /*/

	return angle;
}

////////////////////////



////////////////////////
// Module.Declaration //
////////////////////////

class $RotationAccumulator {
	/////////////////
	// Constructor //
	/////////////////

	constructor () {
		this.__value = 0;
		this.__delta = 0;

		return this;
	}

	/////////////////



	//////////////////////
	// External.Getters //
	//////////////////////

	get_value () { return this.__value; }
	get_delta () { return this.__delta; }

	//////////////////////

	//////////////////////
	// External.Setters //
	//////////////////////

	set_value (value) { this.__value = value; return this; }
	set_delta (value) { this.__delta = value; return this; }

	//////////////////////



	//////////////////////
	// External.Methods //
	//////////////////////


	rezero () {
		let value = this.get_value();

		/*/ end setup /*/

		this.set_delta(value);

		return this;
	}

	update (angle) {
		this.set_value(angle);

		return this;
	}

	joined () {
		let value = this.get_value();
		let delta = this.get_delta();

		/*/ end setup /*/

		return wrapAngle(value - delta);
	}



	magnitude () {
		let joined = this.joined();

		/*/ end setup /*/

		return Math.abs(joined);
	}

	translate (source) {
		return source + this.joined();

// stupid.
// 1: 		/*/ end setup /*/
// 1: 
// 1: 		let difference_cw = wrapAngle(target) - wrapAngle(source);
// 1: 		let difference_cc = wrapAngle(source) - wrapAngle(target) + 360;
// 1: 
// 1: 		let distance_cw = Math.abs(difference_cw);
// 1: 		let distance_cc = Math.abs(difference_cc);
// 1: 
// 1: 		/*/ end logic /*/
// 1: 
// 1: 		if (distance_cw <= distance_cc) {
// 1: 			return source + wrapAngle(difference_cw);
// 1: 		}
// 1: 
// 1: 		if (distance_cc <= distance_cw) {
// 1: 			return source + wrapAngle(difference_cc);
// 1: 		}
// 1: 
// 1: 		/*/ end logic /*/
// 1: 
// 1: 		return target;
	}

	//////////////////////
}

////////////////////////





////////////////////////
// Module.Exportation //
////////////////////////

export { $RotationAccumulator };

////////////////////////