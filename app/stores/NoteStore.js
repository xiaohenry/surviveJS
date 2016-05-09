import uuid from 'node-uuid';
import alt from '../libs/alt';
import NoteActions from '../actions/NoteActions';

class NoteStore {
    constructor() {
        this.bindActions(NoteActions);
        // map each action from NoteActions to a method in NoteStore by name
        // then, trigger appropriate logic at each method

        this.notes = [];
    }
    create(note) {
        const notes = this.notes;
        note.id = uuid.v4();
        this.setState({
            notes: notes.concat(note)
        });
    }
    update(updatedNote) {
        const notes = this.notes.map(note => {
            // return the update note in place of the original if found
            if (note.id === updatedNote.id) {
                // applies note to {}, then updatedNote to {note}
                // not sure why we can't just return Object.assign(note, updatedNote);
                return Object.assign({}, note, updatedNote);
            }
            // not the updated note, just return this
            return note;
        });

        // notes now contains the notes with the updated note
        this.setState({
            notes: notes
        });
    }
    delete(id) {
        this.setState({
            // delete the note with the matching id
            notes: this.notes.filter(note => note.id !== id)
        });
    }
}

// connect the store with Alt
// this is the default import if another js file imports NoteStore
export default alt.createStore(NoteStore, 'NoteStore');
