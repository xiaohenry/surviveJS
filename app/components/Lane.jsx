import AltContainer from 'alt-container';
import React from 'react';
import Notes from './Notes.jsx';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';
import LaneActions from '../actions/LaneActions';
import Editable from './Editable.jsx';

export default class Lane extends React.Component {
    constructor(props) {
        super(props);
        this.addNote = this.addNote.bind(this);
        this.deleteNote = this.deleteNote.bind(this);
        this.editName = this.editName.bind(this);
        this.deleteLane = this.deleteLane.bind(this);
        this.activateLaneEdit = this.activateLaneEdit.bind(this);
        this.activateNoteEdit = this.activateNoteEdit.bind(this);

    }
    render() {
        const {lane, ...props} = this.props; // extract lane and props from props passed from Parent (Lanes)

        return (
            // use all the props passed in from the parent (key, lane, className)
            <div {...props}>
                <div className="lane-header" onClick={this.activateLaneEdit}>
                    <div className="lane-add-note">
                        <button onClick={this.addNote}>+</button>
                    </div>
                    <Editable className="lane-name" editing={lane.editing} value={lane.name} onEdit={this.editName} />
                    <div className="lane-delete">
                        <button onClick={this.deleteLane}>x</button>
                    </div>
                </div>

                <AltContainer
                    stores={[NoteStore]}
                    inject={{
                        // Lanes have a notes field which is an arr of note ids. Lane uses this public method to fetch the
                        // appropriate notes by passing in ids
                        notes: () => NoteStore.getNotesByIds(lane.notes)
                    }}>

                    <Notes
                        onValueClick={this.activateNoteEdit}
                        onEdit={this.editNote}
                        onDelete={this.deleteNote} />

                </AltContainer>

            </div>
        );
    }

    editNote(id, task) {
        // Don't modify if trying to set an empty value
        if (!task.trim()) {
            NoteActions.update({id: id, editing: false});

            return;
        }

        NoteActions.update({id: id, task: task, editing: false});
    }
    addNote(e) {
        const laneId = this.props.lane.id;
        const note = NoteActions.create({task: 'New Task'});

        LaneActions.attachToLane({
            noteId: note.id,
            laneId: laneId
        });
    }
    deleteNote(noteId, e) {
        // avoid bubbling to edit
        e.stopPropagation();

        const laneId = this.props.lane.id;

        LaneActions.detachFromLane({laneId, noteId});
        NoteActions.delete(noteId);
    }
    editName(name) {
        const laneId = this.props.lane.id;

        if (!name.trim()) {
            // can't just return b/c we need to trigger editing to false.
            // If we just returned, the lane will still be in editing mode
            LaneActions.update({id: laneId, editing: false});
            return;
        }

        LaneActions.update({id: laneId, name: name, editing: false});
    }

    deleteLane() {
        const laneId = this.props.lane.id;

        LaneActions.delete(laneId);
        // for each note in this lane, call NoteActions.delete(noteId);
        //NoteActions.delete()
    }

    activateLaneEdit() {
        const laneId = this.props.lane.id;

        LaneActions.update({id: laneId, editing: true});
    }

    activateNoteEdit(id) {
        NoteActions.update({id: id, editing: true});
    }

}
