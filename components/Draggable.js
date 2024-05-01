import React from "react";

export function Draggable(props) {
  return (
    <div draggable onDragStart={props.onDragStart} onDragEnd={props.onDragEnd}>
      {props.children}
    </div>
  );
}
