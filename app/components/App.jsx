import AltContainer from 'alt-container';
import React from 'react';
import Notes from './Notes.jsx';

import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';

export default class App extends React.Component {
    render() {
        // AltContainer allows us to bind data to its immediate children. In this case, it injects the notes property
        // into Notes.
        return (
                <div>
                    <button className="add-note" onClick={this.addNote}>+</button>
                    <AltContainer
                        stores={[NoteStore]}
                        inject={{notes: () => NoteStore.getState().notes}}>
                        <Notes onEdit={this.editNote} onDelete={this.deleteNote}/>
                    </AltContainer>
                </div>
        );
    }

    deleteNote(id, e) {
        // Avoid bubbling to edit
        e.stopPropagation();

        NoteActions.delete(id);
    }

    addNote() {
        NoteActions.create({task: 'New task'});
    }

    editNote(id, task) {
        // Don't modify if trying to set an empty value
        if (!task.trim()) {
            return;
        }

        NoteActions.update({id, task});
    }
}
