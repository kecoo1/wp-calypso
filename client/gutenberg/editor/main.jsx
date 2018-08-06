/** @format */
/**
 * External dependencies
 */
import React, { Component } from 'react';
import { noop } from 'lodash';
import {
	registerBlockType,
	setDefaultBlockName,
	setUnknownTypeHandlerName,
} from '@wordpress/blocks';
import { registerStore, restrictPersistence } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Editor from './edit-post/editor.js';
import * as paragraph from './core-blocks/paragraph';
import * as heading from './core-blocks/heading';
import reducer from './edit-post/store/reducer';
import applyMiddlewares from './edit-post/store/middlewares';
import * as actions from './edit-post/store/actions';
import * as selectors from './edit-post/store/selectors';

const editorSettings = {};
const overridePost = {};
const post = {
	type: 'post',
	content: {},
};

// Mock registerCoreBlocks until core-blocks package is published
const registerCoreBlocks = () => {
	[ paragraph, heading ].forEach( ( { name, settings } ) => {
		registerBlockType( name, settings );
	} );

	setDefaultBlockName( paragraph.name );

	setUnknownTypeHandlerName( paragraph.name );
};

registerCoreBlocks();

// Initialize edit-post store
const store = registerStore( 'core/edit-post', {
	reducer: restrictPersistence( reducer, 'preferences' ),
	actions,
	selectors,
	persist: true,
} );

applyMiddlewares( store );
store.dispatch( { type: 'INIT' } );

class GutenbergEditor extends Component {
	render() {
		return (
			<Editor
				settings={ editorSettings }
				hasFixedToolbar={ true }
				post={ post }
				overridePost={ overridePost }
				onError={ noop }
			/>
		);
	}
}

export default GutenbergEditor;
