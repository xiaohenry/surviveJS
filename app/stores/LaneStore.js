import uuid from 'node-uuid';
import alt from '../libs/alt';
import LaneActions from '../actions/LaneActions';
import NoteActions from '../actions/NoteActions';

import update from 'react-addons-update';

class LaneStore {
    constructor() {
        this.bindActions(LaneActions);

        this.lanes = [];

    }

    create(lane) {
            const lanes = this.lanes;

            lane.id = uuid.v4();

            // if `notes` aren't provided for some reason, default to empty array
            // lane.notes is simply an array of note ids
            lane.notes = lane.notes || [];

            this.setState({
                lanes: lanes.concat(lane)
            });
    }

    update(updatedLane) {
        const lanes = this.lanes.map(lane => {
            if (lane.id === updatedLane.id) {
                // update the lane object to hsve updatedLane properties
                return Object.assign({}, lane, updatedLane);
            } else {
                return lane;
            }
        });
        this.setState({lanes});
    }

    delete(id) {
        // store the lane to be deleted
        const lane = this.lanes.filter(lane => lane.id === id)[0];

        this.setState({
            lanes: this.lanes.filter(lane => lane.id !== id)
        });

        // delete notes associated with this lane
        lane.notes.forEach(noteId => NoteActions.delete.defer(noteId));
    }

    // extract the individual variables from the passed in object
    attachToLane({laneId, noteId}) {
        const lanes = this.lanes.map(lane => {
            if (lane.notes.includes(noteId)) {
                // Note already in this lane - remove it
                lane.notes = lane.notes.filter(note => note !== noteId);
            }
            // add or re-add the note to the lane
            if (lane.id === laneId) {
                lane.notes.push(noteId)
            }
            return lane;
        });

        this.setState({lanes});
    }

    detachFromLane({laneId, noteId}) {
        const lanes = this.lanes.map(lane => {
            if (lane.id === laneId) {
                lane.notes = lane.notes.filter(note => note.id !== noteId);
            }

            return lane;
        });

        this.setState({lanes});
    }

    move({sourceId, targetId}) {
        const lanes = this.lanes;
        const sourceLane = lanes.filter(lane => lane.notes.includes(sourceId))[0];
        const targetLane = lanes.filter(lane => lane.notes.includes(targetId))[0];
        const sourceNoteIndex = sourceLane.notes.indexOf(sourceId);
        const targetNoteIndex = targetLane.notes.indexOf(targetId);

        // 2 notes moving around indeces in the same lane
        if (sourceLane === targetLane) {
            // when operate based on ids aand perform ops 1 at a time, we need to take index alterations into account
            // For example, if we are modifying the same lane, we need to consider that it will be changed twice due to 2 notes
            // hopping between indeces.
            // We solve this by using a react helper, `update`, that will take care of this data moving in one pass
            sourceLane.notes = update(sourceLane.notes, {
                $splice: [
                    [sourceNoteIndex, 1], // remove
                    [targetNoteIndex, 0, sourceId] // add the note in
                ]
            });
        // note hopping to another lane
        } else {
            // remove source note from its lane
            sourceLane.notes.splice(sourceNoteIndex, 1);

            // move it (add) it to target index
            targetLane.notes.splice(targetNoteIndex, 0, sourceId);
        }
        this.setState({lanes});
    }
}

export default alt.createStore(LaneStore, 'LaneStore');
