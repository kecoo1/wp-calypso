/** @format */
// Initialize polyfills before any dependencies are loaded
import './polyfills';

/**
 * External dependencies
 */
import debugFactory from 'debug';
import page from 'page';

/**
 * Internal dependencies
 */
import loginModule from 'login';
import createReduxStoreFromPersistedInitialState from 'state/initial-state';
import * as controller from 'controller/index.web';
import { setupContextMiddleware } from './common';

const debug = debugFactory( 'calypso' );

window.AppBoot = () => {
	debug( 'boot login page' );
	createReduxStoreFromPersistedInitialState( reduxStore => {
		setupContextMiddleware( reduxStore );
		loginModule( controller.clientRouter );
		page.start();
	} );
};
