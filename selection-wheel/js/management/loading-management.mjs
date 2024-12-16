//////////////////
// Requirements //
//////////////////

import { $SelectorStack } from "./../components/selector-components.mjs";

//////////////////



/////////////////////
// Internal.States //
/////////////////////

let __LOADED_SELECTOR_STACKS = new Map();

/////////////////////



////////////////////////
// Module.Declaration //
////////////////////////

function load () {
	let loaded = __LOADED_SELECTOR_STACKS;
	let queued = document.querySelectorAll("div.selection-wheel");

	/*/ end setup /*/

	for (let _container of queued) {
		if (!loaded.has(_container)) {
			let current_container = new $SelectorStack(_container);

			/*/ end setup /*/

			current_container.load();

			/*/ end logic /*/

			loaded.set(_container, current_container);
		}
	}

	/*/ end logic /*/

	return;
}

function exit () {
	let loaded = __LOADED_SELECTOR_STACKS;

	/*/ end setup /*/

	for (let [_container, _stack] of loaded) {
		_stack.exit();

		loaded.delete(_container);
	}

	/*/ end logic /*/

	return;
}

////////////////////////



////////////////////////
// Module.Exportation //
////////////////////////

export { load, exit };

////////////////////////