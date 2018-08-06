/** @format */

/**
 * External dependencies
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import page from 'page';

/**
 * Internal dependencies
 */
import { getSelectedSiteId } from 'state/ui/selectors';
import { getCurrentPlan } from 'state/sites/plans/selectors';
import { getSiteSlug } from 'state/sites/selectors';
import config from 'config';

export class UpsellRedirectWrapper extends React.Component {
	static propTypes = {
		siteId: PropTypes.number.isRequired,
		ComponentClass: PropTypes.any.isRequired,
		upsellPageURL: PropTypes.string.isRequired,
		shouldRedirect: PropTypes.bool.isRequired,
		loadingPlan: PropTypes.bool.isRequired,
	};

	componentDidMount() {
		this.redirected = false;
		this.goToUpsellPageIfRequired();
	}

	getSnapshotBeforeUpdate() {
		this.goToUpsellPageIfRequired();
		return null;
	}

	componentDidUpdate() {}

	goToUpsellPageIfRequired() {
		const props = this.props;
		if ( this.shouldRedirect() ) {
			if ( ! this.redirected ) {
				setTimeout( () => {
					page.redirect( `${ props.upsellPageURL }/${ props.siteSlug }` );
				} );
				this.redirected = true;
			}
		}
	}

	shouldRedirect() {
		const props = this.props;
		return props.shouldRedirect && ! props.loadingPlan;
	}

	render() {
		const { ComponentClass, loadingPlan, shouldRedirect, ...props } = this.props;
		if ( loadingPlan || this.shouldRedirect() ) {
			return false;
		}

		return <ComponentClass { ...props } />;
	}
}

export const createMapStateToProps = (
	ComponentClass,
	shouldRedirectCallback,
	upsellPageURL
) => state => {
	const siteId = getSelectedSiteId( state );
	const siteSlug = getSiteSlug( state, siteId );
	const currentPlan = getCurrentPlan( state, siteId );
	const shouldRedirect = !! (
		config.isEnabled( 'upsell/nudge-a-palooza' ) &&
		currentPlan &&
		siteSlug &&
		shouldRedirectCallback( state, siteId )
	);

	return {
		siteId,
		siteSlug,
		ComponentClass,
		upsellPageURL,
		shouldRedirect,
		loadingPlan: ! currentPlan,
	};
};

export const redirectIf = ( requiredFeature, upsellPageURL ) => {
	return ComponentClass => {
		const mapStateToProps = createMapStateToProps( ComponentClass, requiredFeature, upsellPageURL );
		return connect( mapStateToProps )( UpsellRedirectWrapper );
	};
};

export default redirectIf;
