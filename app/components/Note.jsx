import React from 'react';
import {DragSource, DropTarget} from 'react-dnd';
import ItemTypes from '../constants/itemTypes';

// Tell note it can be dragged
const noteSource = {
    // function that fires when we begin dragging
    beginDrag(props) {
        return {
            id: props.id
        };
    }
};

const noteTarget = {
    hover(targetProps, monitor) {
        const targetId = targetProps.id;
        const sourceProps = monitor.getItem();
        const sourceId = sourceProps.id;

        if (sourceId !== targetId) {
            targetProps.onMove({sourceId, targetId});
        }
    }
};

// Both decorators give us access to the `Note` props. We use `monitor.getItem()` to access them at `noteTarget`
@DragSource(
    ItemTypes.NOTE,
    noteSource,
    (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging() // map isDragging() state to isDragging prop below
    })
)
@DropTarget(
    ItemTypes.NOTE,
    noteTarget,
    (connect) => ({connectDropTarget: connect.dropTarget()})
)
export default class Note extends React.Component {
    render() {
        // set up props that we'll extract from `this.props`
        const {connectDragSource, connectDropTarget, isDragging, onMove, id, ...props} = this.props;

        return connectDragSource(connectDropTarget(
            <li style={{
                opacity: isDragging ? 0 : 1
                }} {...props}>{props.children}</li>
        ));
    }
}
