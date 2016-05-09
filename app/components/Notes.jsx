import React from 'react';
import Note from './Note.jsx'

// exporting only a function - Stateless Component
export default ({notes, onEdit, onDelete}) => {
    return (
        <ul className="notes">{notes.map(note =>
            <li className="note" key={note.id}>
                <Note
                    task={note.task}
                    onEdit={onEdit.bind(null, note.id)}
                    onDelete={onDelete.bind(null, note.id)}
                />
            </li>
            // this will call 'App's onEdit function with null as the 'this' argument, and the note's id passed in as the argument to the onEdit call
        )}
        </ul>
    );
}
