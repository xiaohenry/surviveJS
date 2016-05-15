import uuid from 'node-uuid';
import alt from '../libs/alt';
import NoteActions from '../actions/NoteActions';

class NoteStore {
    constructor() {
        this.bindActions(NoteActions);
        // map each action from NoteActions to a method in NoteStore by name
        // then, trigger appropriate logic at each method

        this.notes = [];

        this.exportPublicMethods({
            getNotesByIds: this.getNotesByIds.bind(this)
        });
    }

    create(note) {
        const notes = this.notes;

        note.id = uuid.v4();

        this.setState({
            notes: notes.concat(note)
        });

        return note;
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

    // Lanes have a notes field which is an arr of note ids. Lane uses this public method to fetch the
    // appropriate notes by passing in ids
    getNotesByIds(ids) {
        // 1. Make sure we are operating on an array, or map will crash
        return (ids || []).map(
            // 2. Extract matching Notes, so we get the notes we want to show
            id => this.notes.filter(note => note.id === id)
            // 3. Filter out possible empty arrays (filter can return empty arr), and extract first item of each list
            // We extract the first element b/c each filter call should only grab ONE note with the matching id.
        ).filter(arr => arr.length).map(nonEmptyArr => nonEmptyArr[0]);
    }
}

// connect the store with Alt
// this is the default import if another js file imports NoteStore
export default alt.createStore(NoteStore, 'NoteStore');
