//////////////////
// Requirements //
//////////////////

//////////////////



////////////////////////
// Module.Declaration //
////////////////////////

class $Position {
	/////////////////
	// Constructor //
	/////////////////

	constructor (x, y) {
		this.__x = x;
		this.__y = y;

		return this;
	}

	/////////////////



	//////////////////////
	// External.Getters //
	//////////////////////

	get_x () { return this.__x; }
	get_y () { return this.__y; }

	//////////////////////

	//////////////////////
	// External.Setters //
	//////////////////////

	set_x (value) { this.__x = value; return this; }
	set_y (value) { this.__y = value; return this; }

	//////////////////////



	//////////////////////
	// External.Methods //
	//////////////////////

		/////////////////////////////////
		// External.Methods.Conversion //
		/////////////////////////////////

		// note: from the vertical axis.
		static from_angle (angle, scale) {
			let x = Math.sin(angle) * scale;
			let y = Math.cos(angle) * scale;

			/* end logic /*/

			return new $Position(x, y);
		}

		// note: from the vertical axis.
		into_angle () {
			let x = this.get_x();
			let y = this.get_y();

			/*/ end setup /*/

			let angle = Math.atan2(x, y);

			/*/ end logic /*/

			return angle;
		}

		/////////////////////////////////



		/////////////////////////////////
		// External.Methods.Arithmetic //
		/////////////////////////////////

		scale (scalar) {
			return new $Position()
				.set_x( this.get_x() * scalar )
				.set_y( this.get_y() * scalar )
				;
		}



		add (position) {
			return new $Position()
				.set_x( this.get_x() + position.get_x() )
				.set_y( this.get_y() + position.get_y() )
				;
		}

		minus (position) {
			return this.scale(-1).add(position);
		}

		/////////////////////////////////

	//////////////////////
}

////////////////////////



////////////////////////
// Module.Exportation //
////////////////////////

export { $Position };

////////////////////////