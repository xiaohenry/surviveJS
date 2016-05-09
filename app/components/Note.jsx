import React from 'react';

// export default function({task}) { return <div>{task}</div> };
// export default ({task}) => <div>{task}</div>;

export default class Note extends React.Component {
    constructor(props) {
        super(props);

        // bind "this" to refer to Note within each function
        this.renderEdit = this.renderEdit.bind(this);
        this.renderNote = this.renderNote.bind(this);
        this.edit = this.edit.bind(this);
        this.checkEnter = this.checkEnter.bind(this);
        this.finishEdit = this.finishEdit.bind(this);
        this.renderDelete = this.renderDelete.bind(this);

        this.state = {
            editing: false
        }
    }

    render() {
        if (this.state.editing) {
            return this.renderEdit();
        } else {
            return this.renderNote();
        }
    }

    renderEdit() {
        // Deal with blur/input handlers here.
        return <input
        type="text"
        ref={(e) => e ? e.selectionStart = this.props.task.length : null}
        autoFocus={true}
        defaultValue={this.props.task}
        onBlur={this.finishEdit}
        onKeyPress={this.checkEnter} />
    }

    renderNote() {
        // if user clicks a normal note, trigger editing logic
        /**  TODO: why save this? */
        const onDelete = this.props.onDelete;

        return (
            <div onClick={this.edit}>
                <span className="task">{this.props.task}</span>
                {onDelete ? this.renderDelete() : null}
                {/* if an onDelete function is passed in, call renderDelete, which returns a delete button and attaches the button to this note component */}
            </div>
        );
    }

    renderDelete() {
        // return a button that's attached to the delete function passed in as a prop
        return (
            <button
                className="delete-note"
                onClick={this.props.onDelete}>x
            </button>
        );
    }

    edit() {
        this.setState({
            editing: true
        });
    }

    checkEnter(e) {
        // the user hit *enter*, finish up
        if (e.key === 'Enter') {
            this.finishEdit(e);
        }
    }

    finishEdit(e) {
        // 'Note' will trigger an optional 'onEdit' callback passed in via props once it has a new val.
        // We will use this to communicate the change to 'App', because 'App' actually holds all the
        // data for the Notes
        const value = e.target.value;
        if (this.props.onEdit) {
            this.props.onEdit(value);

            // Exit edit mode
            this.setState({
                editing: false
            });
        }
    }

}
