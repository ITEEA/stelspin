//////////////////
// Requirements //
//////////////////

import { $Position            } from "./../math/position-utils.mjs";
import { $RotationAccumulator } from "./../math/rotation-utils.mjs";
import { $PolygonGeometry     } from "./../math/geometry-utils.mjs";

import { $MouseTracker } from "./../components/tracking-components.mjs";

import * as BindingManager from "./../management/binding-management.mjs";

//////////////////



////////////////////////
// Module.Declaration //
////////////////////////

class $SelectorWheel {
	/////////////////
	// Constructor //
	/////////////////

	constructor (element) {
		this.__element = element;

		this.__intersector = new $PolygonGeometry(-1, 0);
		this.__accumulator = null;

		return this;
	}

	/////////////////



	//////////////////////
	// External.Getters //
	//////////////////////

	get_element () { return this.__element; }

	get_intersector () { return this.__intersector; }
	get_accumulator () { return this.__accumulator; }

	//////////////////////

	//////////////////////
	// External.Setters //
	//////////////////////

	set_element (value) { this.__element = value; return this; }

	set_intersector (value) { this.__intersector = value; return this; }
	set_accumulator (value) { this.__accumulator = value; return this; }

	//////////////////////



	//////////////////////
	// External.Methods //
	//////////////////////

		/////////////////////////////////
		// External.Methods.Management //
		/////////////////////////////////

		load () {
			let element     = this.get_element();
			let intersector = this.get_intersector();

			let property_sides = 0 | element.getAttribute("sides");
			let property_scale = 0 | element.getAttribute("scale");

			/*/ end setup /*/

			{
				intersector.set_sides(property_sides);
				intersector.set_scale(property_scale);
			}

			{
				element.style.setProperty("--sides" , property_sides);
				element.style.setProperty("--scale" , property_scale);

				element.setAttribute("draggable", "false");
				element.setAttribute("alt", "Image of Rotating Polygon.");
			}

			/*/ end logic /*/

			return this;
		}

		exit () {
			let element = this.get_element();

			/*/ end setup /*/

			{
				element.style.setProperty("--sides" , 0);
				element.style.setProperty("--scale" , 0);
			}

			/*/ end logic /*/

			return this;
		}

		/////////////////////////////////



		/////////////////////////////////
		// External.Methods.Processors //
		/////////////////////////////////

		process_stressed (cursor) {
			let element     = this.get_element();
			let intersector = this.get_intersector();

			/*/ end setup /*/

			if (intersector.isInside(cursor)) {
				this.set_accumulator( new $RotationAccumulator() );

				return true;
			}

			/*/ end false /*/

			return false;
		}

		process_movement (cursor, origin) {
			if (this.get_accumulator() === null) {
				return false;
			}

			/*/ end checks /*/

			let element     = this.get_element();
			let intersector = this.get_intersector();
			let accumulator = this.get_accumulator();

			/*/ end setup /*/

			let rotation = cursor.into_angle() - origin.into_angle();
			let division = intersector.calc_theta();

			/*/ end logic /*/

			{
				accumulator.update(rotation);
			}

			/*/ end logic /*/

			if (accumulator.magnitude() >= division) {
				let angle_source = Number( element.style.getPropertyValue("--angle") );
				let angle_target = accumulator.translate(angle_source);

				angle_target = Math.round(angle_target / division) * division;

				/*/ end logic /*/

				{
					element.style.setProperty("--angle", angle_target);
				}

				{
					accumulator.rezero();
				}

				/*/ end logic /*/
			}

			/*/ end checks /*/

			return true;
		}

		process_released (cursor) {
			let element = this.get_element();

			/*/ end setup /*/

			this.set_accumulator(null);

			return true;
		}

		/////////////////////////////////

	//////////////////////
}

class $SelectorStack {
	/////////////////
	// Constructor //
	/////////////////

	constructor (element) {
		this.__element = element;

		this.__content = [];
		this.__tracker = null;

		return this;
	}

	/////////////////



	//////////////////////
	// External.Getters //
	//////////////////////

	get_element () { return this.__element; }

	get_content () { return this.__content; }
	get_tracker () { return this.__tracker; }

	//////////////////////

	//////////////////////
	// External.Setters //
	//////////////////////

	set_element (value) { this.__element = value; return this; }

	set_content (value) { this.__content = value; return this; }
	set_tracker (value) { this.__tracker = value; return this; }

	//////////////////////


	//////////////////////
	// External.Methods //
	//////////////////////

		/////////////////////////////////////
		// External.Methods.Weird_Bindings //
		/////////////////////////////////////

		clump_callbacks () {
			return ({
				"stressed": BindingManager.bind(this.process_stressed, this),
				"movement": BindingManager.bind(this.process_movement, this),
				"released": BindingManager.bind(this.process_released, this),
			});
		}

		/////////////////////////////////////



		/////////////////////////////////
		// External.Methods.Management //
		/////////////////////////////////

		load () {
			let element = this.get_element();
			let content = this.get_content();
			let tracker;

			let callbacks = this.clump_callbacks();

			/*/ end setup /*/

			for (let _child of element.children) {
				if (_child.tagName === "IMG") {
					let current_wheel = new $SelectorWheel(_child);

					/*/ end setup /*/

					current_wheel.load();

					/*/ end logic /*/

					content.push(current_wheel);
				}
			}

			/*/ end logic /*/

			{
				element.style.setProperty("display", "block");
			}

			{
				tracker = new $MouseTracker(element, callbacks.stressed, callbacks.movement, callbacks.released);

				tracker.load();
			}

			/*/ end logic /*/

			this.set_tracker(tracker);

			return this;
		}

		exit () {
			let element = this.get_element();
			let content = this.get_content();
			let tracker = this.get_tracker();

			/*/ end setup /*/

			while (content.length > 0) {
				content.pop().exit();
			}

			/*/ end logic /*/

			{
				element.style.setProperty("display", "none");
			}

			{
				tracker.exit();
			}

			/*/ end logic /*/

			this.set_tracker(null);

			return this;
		}

		/////////////////////////////////



		/////////////////////////////////
		// External.Methods.Processors //
		/////////////////////////////////

		// pray that this doesen't get called
		// multiple times in a row.
		process_stressed (cursor) {
			let content = this.get_content();

			/*/ end setup /*/

			// break out of this reverse loop when
			// we encounter our first hit. this is
			// because, once we do reach our first
			// hit, we know that all lower wheels
			// will also be hit BUT that they are
			// over-shadowed by this hit above all
			// of them.
			// 
			// this is also another thing I caught
			// before any annoying debugging. also,
			// if anyone is actually reading these,
			// hello world! or, like, 5 people...
			for (let _wheel = content.length - 1; _wheel >= 0; _wheel--) {
				let current_wheel = content[_wheel];

				/*/ end setup /*/

				if (current_wheel.process_stressed(cursor)) {
					break;
				}

				/*/ end checks /*/
			}

			/*/ end logic /*/

			return true;
		}

		process_movement (cursor, origin) {
			let content = this.get_content();

			/*/ end setup /*/

			for (let _wheel of content) {
				_wheel.process_movement(cursor, origin);
			}

			/*/ end logic /*/

			return true;
		}

		process_released (cursor) {
			let content = this.get_content();

			/*/ end setup /*/

			for (let _wheel of content) {
				_wheel.process_released(cursor);
			}

			/*/ end logic /*/

			return true;
		}

		/////////////////////////////////

	//////////////////////
}

////////////////////////



////////////////////////
// Module.Exportation //
////////////////////////

export { $SelectorWheel, $SelectorStack };

////////////////////////
