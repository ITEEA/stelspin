//////////////////
// Requirements //
//////////////////

import { $Position } from "./../math/position-utils.mjs";

import * as BindingManager from "./../management/binding-management.mjs";

//////////////////



////////////////////////
// Internal.Utilities //
////////////////////////

// note: may break with nested scrollable elements.
function calculateCursor (event, element) {
	let container = element.getBoundingClientRect();

	/*/ end logic /*/

	let offset_x = window.scrollX + container.left + container.width * 0.5;
	let offset_y = window.scrollY + container.top + container.height * 0.5;

	let relative_x =  (event.pageX - offset_x);
	let relative_y = -(event.pageY - offset_y);

	/*/ end logic /*/

	return new $Position(relative_x, relative_y);
}

////////////////////////



////////////////////////
// Module.Declaration //
////////////////////////

// note: doesen't support touch interactions.
//       I wanted to add this, but I ran out
//       of time at the last moment. I would
//       have probably split it off into its
//       own module, `interact-components`.
class $MouseTracker {
	/////////////////
	// Constructor //
	/////////////////

	constructor (element, callback_stressed, callback_movement, callback_released) {
		this.__element = element;

		this.__origin = null;

		this.__callback_stressed = callback_stressed;
		this.__callback_movement = callback_movement;
		this.__callback_released = callback_released;

		return this;
	}

	/////////////////



	//////////////////////
	// External.Getters //
	//////////////////////

	get_element () { return this.__element; }

	get_origin () { return this.__origin; }

	get_callback_stressed () { return this.__callback_stressed; }
	get_callback_movement () { return this.__callback_movement; }
	get_callback_released () { return this.__callback_released; }

	//////////////////////

	//////////////////////
	// External.Setters //
	//////////////////////

	set_element (value) { this.__element = value; return this; }

	set_origin (value) { this.__origin = value; return this; }

	set_callback_stressed (value) { this.__callback_stressed = value; return this; }
	set_callback_movement (value) { this.__callback_movement = value; return this; }
	set_callback_released (value) { this.__callback_released = value; return this; }

	//////////////////////



	//////////////////////
	// External.Methods //
	//////////////////////

		/////////////////////////////////////
		// External.Methods.Weird_Bindings //
		/////////////////////////////////////

		clump_listeners () {
			return ({
				"down": BindingManager.bind(this.onMouseDown, this),
				"move": BindingManager.bind(this.onMouseMove, this),
				"gone": BindingManager.bind(this.onMouseGone, this),
			});
		}

		clump_callbacks () {
			return ({
				"stressed": this.get_callback_stressed(),
				"movement": this.get_callback_movement(),
				"released": this.get_callback_released(),
			});
		}

		/////////////////////////////////////



		/////////////////////////////////
		// External.Methods.Management //
		/////////////////////////////////

		load () {
			let element = this.get_element();

			let listeners = this.clump_listeners();

			/*/ end setup /*/

			{
				element.addEventListener("mousedown", listeners.down);
			}

			/*/ end logic /*/

			return this;
		}

		exit () {
			let element = this.get_element();

			let listeners = this.clump_listeners();

			/*/ end setup /*/

			{
				element.removeEventListener("mousedown", listeners.down);

				document.removeEventListener("mousemove" , listeners.move);
				document.removeEventListener("mouseup"   , listeners.gone);
				document.removeEventListener("mouseleave", listeners.move);
			}

			/*/ end logic /*/

			return this;
		}

		/////////////////////////////////



		/////////////////////////////////////
		// External.Methods.Event_Handlers //
		/////////////////////////////////////

		onMouseDown (event) {
			// SMH, had this set to 1 instead of 0.
			if (event?.button !== 0) {
				return;
			}

			/*/ end checks /*/

			let element = this.get_element();

			let listeners = this.clump_listeners();
			let callbacks = this.clump_callbacks();

			/*/ end setup /*/

			let cursor = calculateCursor(event, element);

			/*/ end setup /*/

			{
				event.preventDefault();
			}

			// the repeated callback is for an edge-case.
			{
				document.addEventListener("mousemove" , listeners.move);
				document.addEventListener("mouseup"   , listeners.gone, { "once": true });
				document.addEventListener("mouseleave", listeners.gone, { "once": true });
			}

			{
				(callbacks.stressed)(cursor);
			}

			/*/ end logic /*/

			this.set_origin(cursor);

			return;
		}

		onMouseMove (event) {
			let element = this.get_element();
			let origin  = this.get_origin();

			let callbacks = this.clump_callbacks();

			/*/ end setup /*/

			let cursor = calculateCursor(event, element);

			/*/ end setup /*/

			{
				event.preventDefault();
			}

			{
				(callbacks.movement)(cursor, origin);
			}

			/*/ end logic /*/

			return;
		}

		onMouseGone (event) {
			let element = this.get_element();

			let listeners = this.clump_listeners();
			let callbacks = this.clump_callbacks();

			/*/ end setup /*/

			let cursor = calculateCursor(event, element);

			/*/ end setup /*/

			{
				document.removeEventListener("mousemove", listeners.move);
			}

			{
				(callbacks.released)(cursor);
			}

			/*/ end logic /*/

			this.set_origin(null);

			return;
		}

		/////////////////////////////////////

	//////////////////////

}

////////////////////////



////////////////////////
// Module.Exportation //
////////////////////////

export { $MouseTracker };

////////////////////////