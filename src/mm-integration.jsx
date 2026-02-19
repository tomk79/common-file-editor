/**
 * Integration layer for @tomk79/htmm in common-file-editor.
 * Mounts HtmmMap for .mm preview (read-only) and edit (editable).
 * Uses the same React as htmm (bundled from source) to avoid "a is not a function".
 */
const React = require('react');
const { createRoot } = require('react-dom/client');
const { HtmmMap, parseMindMapXML, generateMindMapXML, createRootNode } = require('@tomk79/htmm');

/**
 * Mount read-only mind map preview in the given container.
 * @param {HTMLElement} container - DOM element to mount into
 * @param {string} xmlString - .mm file content (XML string)
 * @returns {{ unmount: function }}
 */
function mountMmPreview(container, xmlString) {
	let mapData;
	try {
		mapData = parseMindMapXML(xmlString);
	} catch (err) {
		container.textContent = err instanceof Error ? err.message : String(err);
		return {
			unmount: function () {},
		};
	}

	const root = createRoot(container);
	root.render(
		React.createElement(HtmmMap, {
			initialMapData: mapData,
			readOnly: true,
			width: '100%',
			height: '100%',
			className: 'common-file-editor__htmm-preview',
		})
	);

	return {
		unmount: function () {
			root.unmount();
		},
	};
}

/**
 * Mount editable mind map editor in the given container.
 * @param {HTMLElement} container - DOM element to mount into
 * @param {string} xmlString - .mm file content (XML string)
 * @returns {{ getMapData: function, unmount: function }}
 */
function mountMmEditor(container, xmlString) {
	const ref = React.createRef();
	let mapData;
	try {
		mapData = parseMindMapXML(xmlString);
	} catch (err) {
		// On parse error, create minimal empty map so user can still edit
		mapData = {
			version: '1.0.1',
			root: createRootNode('New Mind Map'),
		};
	}

	const root = createRoot(container);
	root.render(
		React.createElement(HtmmMap, {
			ref: ref,
			initialMapData: mapData,
			readOnly: false,
			width: '100%',
			height: '100%',
			className: 'common-file-editor__htmm-editor',
		})
	);

	return {
		getMapData: function () {
			return ref.current ? ref.current.getMapData() : null;
		},
		getXml: function () {
			const data = ref.current ? ref.current.getMapData() : null;
			return data ? generateMindMapXML(data) : '';
		},
		unmount: function () {
			root.unmount();
		},
	};
}

module.exports = {
	mountMmPreview,
	mountMmEditor,
	generateMindMapXML,
};
