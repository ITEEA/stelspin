//////////////////
// Requirements //
//////////////////

import { $Position } from "./../math/position-utils.mjs";

//////////////////



//////////////////////
// Internal.Objects //
//////////////////////

class $IGeometry {
	//////////////////////
	// External.Methods //
	//////////////////////

	isInside (position) {
		return true;
	}

	//////////////////////
}

//////////////////////



////////////////////////
// Module.Declaration //
////////////////////////

class $TriangleGeometry extends $IGeometry {
	/////////////////
	// Constructor //
	/////////////////

	constructor (vertex_a, vertex_b) {
		super();

		this.__vertex_a = vertex_a;
		this.__vertex_b = vertex_b;
		this.__vertex_c = new $Position(0, 0);

		return this;
	}

	/////////////////

	//////////////////////
	// External.Getters //
	//////////////////////

	get_vertex_a () { return this.__vertex_a; }
	get_vertex_b () { return this.__vertex_b; }
	get_vertex_c () { return this.__vertex_c; }

	//////////////////////

	//////////////////////
	// External.Setters //
	//////////////////////

	set_vertex_a (value) { this.__vertex_a = value; return this; }
	set_vertex_b (value) { this.__vertex_b = value; return this; }
	set_vertex_c (value) { this.__vertex_c = value; return this; }

	//////////////////////



	//////////////////////
	// External.Methods //
	//////////////////////

	static delta (vertex_a, vertex_b, vertex_c) {
		let [ vA_x, vA_y ] = [ vertex_a.get_x(), vertex_a.get_y() ];
		let [ vB_x, vB_y ] = [ vertex_b.get_x(), vertex_b.get_y() ];
		let [ vC_x, vC_y ] = [ vertex_c.get_x(), vertex_c.get_y() ];

		/*/ end setup /*/

		let component_1 = (vA_x - vC_x) * (vB_y - vC_y);
		let component_2 = (vB_x - vC_x) * (vA_y - vC_y);

		/*/ end logic /*/

		return component_1 - component_2;
	}



	isInside (position) {
		let vertex_a = this.get_vertex_a();
		let vertex_b = this.get_vertex_b();
		let vertex_c = this.get_vertex_c();

		/*/ end setup /*/

		let delta_1 = $TriangleGeometry.delta(position, vertex_a, vertex_b);
		let delta_2 = $TriangleGeometry.delta(position, vertex_b, vertex_c);
		let delta_3 = $TriangleGeometry.delta(position, vertex_c, vertex_a);

		/*/ end logic /*/

		let negative = Math.min(delta_1, delta_2, delta_3) < 0;
		let positive = Math.max(delta_1, delta_2, delta_3) > 0;

		/*/ end logic /*/

		return !(negative && positive);
	}

	//////////////////////
}

class $PolygonGeometry extends $IGeometry {
	/////////////////
	// Constructor //
	/////////////////

	constructor (sides, scale) {
		super();

		this.__sides = sides;
		this.__scale = scale;
		this.__angle = 0;

		return this;
	}

	/////////////////



	//////////////////////
	// External.Getters //
	//////////////////////

	get_sides () { return this.__sides; }
	get_scale () { return this.__scale; }
	get_angle () { return this.__angle; }

	//////////////////////

	//////////////////////
	// External.Setters //
	//////////////////////

	set_sides (value) { this.__sides = value; return this; }
	set_scale (value) { this.__scale = value; return this; }
	set_angle (value) { this.__angle = value; return this; }

	//////////////////////



	//////////////////////
	// External.Methods //
	//////////////////////

		///////////////////////////////////
		// External.Methods.Calculations //
		///////////////////////////////////

		calc_theta () {
			let sides = this.get_sides();

			/*/ end setup /*/

			return (2 * Math.PI) / sides;
		}

		calc_chord () {
			let sides = this.get_sides();
			let scale = this.get_scale();

			/*/ end setup /*/

			return (scale * 0.5) / Math.cos(Math.PI / sides);
		}

		///////////////////////////////////



	// I could have memoized this, but I felt it unnecessary.
	isInside (position) {
		let sides = this.get_sides();
		let scale = this.get_scale();
		let angle = this.get_angle();

		let rotation = this.calc_theta();
		let distance = this.calc_chord();

		/*/ end setup /*/

		// could calculate which triangle it should be
		// in and then skip all other checks, but I'm
		// lazy and this is fine.
		for (let _side = 0; _side < sides; _side++) {
			let current_angle = (rotation * _side) - (rotation * 0.5) + angle;
			let current_slice;

			/*/ end setup /*/

			let corner_1 = $Position.from_angle(current_angle           , distance);
			let corner_2 = $Position.from_angle(current_angle + rotation, distance);

			current_slice = new $TriangleGeometry(corner_1, corner_2);

			/*/ end logic /*/

			if (current_slice.isInside(position)) {
				return true;
			}

			/*/ end checks /*/
		}

		/*/ end logic /*/

		return false;
	}

	//////////////////////
}

////////////////////////



////////////////////////
// Module.Exportation //
////////////////////////

export { $TriangleGeometry, $PolygonGeometry };

////////////////////////
