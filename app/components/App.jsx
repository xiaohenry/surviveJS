import AltContainer from 'alt-container';
import React from 'react';

import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Lanes from './Lanes.jsx';
import LaneActions from '../actions/LaneActions';
import LaneStore from '../stores/LaneStore';

// DragDropContext decorator
@DragDropContext(HTML5Backend)
export default class App extends React.Component {
    render() {
        // AltContainer allows us to bind data to its immediate children. In this case, it injects the lanes property into Lanes.
        return (
                <div>
                    <button className="add-lane" onClick={this.addLane}>+</button>
                    <AltContainer
                        stores={[LaneStore]}
                        inject={{lanes: () => LaneStore.getState().lanes}}>

                        <Lanes />
                    </AltContainer>
                </div>
        );
    }

    addLane() {
        LaneActions.create({name: 'New Lane'});
    }

    // deleteNote(id, e) {
    //     // Avoid bubbling to edit
    //     e.stopPropagation();
    //
    //     NoteActions.delete(id);
    // }
    //
    // addNote() {
    //     NoteActions.create({task: 'New task'});
    // }
    //
    // editNote(id, task) {
    //     // Don't modify if trying to set an empty value
    //     if (!task.trim()) {
    //         return;
    //     }
    //
    //     NoteActions.update({id, task});
    // }
}
