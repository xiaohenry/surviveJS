import uuid from 'node-uuid';
import alt from '../libs/alt';
import LaneActions from '../actions/LaneActions';
import NoteActions from '../actions/NoteActions';

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
            if (lane.id === laneId) {
                if (lane.notes.includes(noteId)) {
                    console.warn('Already attached note to lane', lanes);
                } else {
                    lane.notes.push(noteId); // add note to this lane's notes
                }
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
}

export default alt.createStore(LaneStore, 'LaneStore');
