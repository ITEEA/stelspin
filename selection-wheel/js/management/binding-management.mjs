//////////////////
// Requirements //
//////////////////

//////////////////



/////////////////////
// Internal.States //
/////////////////////

let __CONSTRUCTED_BINDINGS = new WeakMap();

/////////////////////



////////////////////////
// Module.Declaration //
////////////////////////

// dirty hack.
function bind (callable, parent) {
	let bindings = __CONSTRUCTED_BINDINGS;

	let category;
	let contents;

	/*/ end setup /*/

	if (!bindings.has(parent)) {
		category = new WeakMap();

		/*/ end setup /*/

		bindings.set(parent, category);
	} else {
		category = bindings.get(parent)
	}

	/*/ end logic /*/

	if (!category.has(callable)) {
		contents = callable.bind(parent);

		/*/ end setup /*/

		category.set(callable, contents);
	} else {
		contents = category.get(callable);
	}

	/*/ end logic /*/

	return contents;
}

////////////////////////



////////////////////////
// Module.Exportation //
////////////////////////

export { bind };

////////////////////////
