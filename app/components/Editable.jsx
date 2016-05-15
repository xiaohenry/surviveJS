import React from 'react';

export default class Editable extends React.Component {
    constructor(props) {
        super(props);

        // bind "this" to refer to Note within each function
        this.renderEdit = this.renderEdit.bind(this);
        this.renderValue = this.renderValue.bind(this);
        this.checkEnter = this.checkEnter.bind(this);
        this.finishEdit = this.finishEdit.bind(this);
        this.renderDelete = this.renderDelete.bind(this);

    }

    render() {
        const {value, onEdit, onValueClick, editing, ...props} = this.props;

        return (
            <div {...props}>
                {editing ? this.renderEdit() : this.renderValue()}
            </div>
        );
    }

    renderEdit() {
        // Deal with blur/input handlers here.
        return <input
        type="text"
        ref={(e) => e ? e.selectionStart = this.props.value.length : null}
        autoFocus={true}
        defaultValue={this.props.value}
        onBlur={this.finishEdit}
        onKeyPress={this.checkEnter} />
    }

    renderValue() {
        // if user clicks a normal note, trigger editing logic
        /**  TODO: why save this? */
        const onDelete = this.props.onDelete;

        return (
            <div onClick={this.props.onValueClick}>
                <span className="value">{this.props.value}</span>
                {onDelete ? this.renderDelete() : null}
                {/* if an onDelete function is passed in, call renderDelete, which returns a delete button and attaches the button to this Editable component */}
            </div>
        );
    }

    renderDelete() {
        // return a button that's attached to the delete function passed in as a prop
        return (
            <button
                className="delete"
                onClick={this.props.onDelete}>x
            </button>
        );
    }

    checkEnter(e) {
        // the user hit *enter*, finish up
        if (e.key === 'Enter') {
            this.finishEdit(e);
        }
    }

    finishEdit(e) {
        const value = e.target.value;
        if (this.props.onEdit) {
            this.props.onEdit(value);
        }
    }

}
