import React from 'react';
import Editable from './Editable.jsx'

import Note from './Note.jsx';

// exporting only a function - Stateless Component
export default ({notes, onValueClick, onEdit, onDelete}) => {
    return (
        // Wrap Editable inside of Note, which will render its children (Editable is its children)
        <ul className="notes">{notes.map(note =>
            <Note className="note" id={note.id} key={note.id}>
                <Editable
                    editing={note.editing}
                    value={note.task}
                    onValueClick={onValueClick.bind(null, note.id)}
                    onEdit={onEdit.bind(null, note.id)}
                    onDelete={onDelete.bind(null, note.id)}/>
            </Note>
            // this will call 'App's onEdit function with null as the 'this' argument, and the note's id passed in as the argument to the onEdit call
        )}
        </ul>
    );
}
