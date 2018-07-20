/** @format */
/**
 * External dependencies
 */
import React, { PureComponent } from 'react';

/**
 * Internal dependencies
 */
import accept from 'lib/accept';
import Button from 'components/button';
import Checklist from '../';
import Item from '../item';

export default class ChecklistExample extends PureComponent {
	static displayName = 'ChecklistExample';

	state = {
		showPlaceholder: false,
	};

	togglePlaceholder = () =>
		void this.setState( ( { showPlaceholder } ) => ( { showPlaceholder: ! showPlaceholder } ) );

	getClickHandler = taskId => () =>
		accept(
			'Will you complete this thing?',
			accepted => ( accepted ? void this.setState( { [ taskId ]: true } ) : undefined ),
			'Yes',
			'No'
		);
	getToggleHandler = taskId => () =>
		void this.setState( state => ( { [ taskId ]: ! state[ taskId ] } ) );

	render() {
		return (
			<>
				<Button onClick={ this.togglePlaceholder }>
					{ this.state.showPlaceholder ? 'Hide Placeholder' : 'Show Placeholder' }
				</Button>
				<Checklist isPlaceholder={ this.state.showPlaceholder } inferCompletedCount>
					<Item
						onClick={ this.getClickHandler( 'reticulateSplines' ) }
						onDismiss={ this.getToggleHandler( 'reticulateSplines' ) }
						title="Reticulate splines"
						buttonText="Reticulate!"
						buttonPrimary
						completedTitle="Splines are reticulated 👍"
						description="Make sure that all the splines are reticulated."
						duration="1 minute"
						completed={ this.state.reticulateSplines }
					/>
					<Item
						onClick={ this.getClickHandler( 'shaveYak' ) }
						onDismiss={ this.getToggleHandler( 'shaveYak' ) }
						title="Shave yaks!"
						buttonText="Buzzzz"
						buttonPrimary
						completedTitle="Yaks shaved."
						description="Make sure you shave the yaks so you can get on with your life."
						duration="10,000 minutes"
						completed={ this.state.shaveYak }
					/>
				</Checklist>
			</>
		);
	}
}
