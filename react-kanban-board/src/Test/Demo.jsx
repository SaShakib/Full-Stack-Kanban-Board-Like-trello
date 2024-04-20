import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";

const itemsFromBackend = [
  { id: uuid(), content: "First task" },
  { id: uuid(), content: "Second task" },
  { id: uuid(), content: "Third task" },
  { id: uuid(), content: "Fourth task" },
  { id: uuid(), content: "Fifth task" },
];
const columnsFromBackend = [
  { id: "1", name: "Requested", items: itemsFromBackend },
  { id: "2", name: "To do", items: [] },
  { id: "3", name: "In Progress", items: [] },
  { id: "4", name: "Done", items: [] },
];

export default function Demo() {
  const [col, setCol] = useState(columnsFromBackend);

  const handleDrag = (result, columns, setColumns) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // If the item is moved within the same column
    if (source.droppableId === destination.droppableId) {
      const column = columns.find((col) => col.id === source.droppableId);

      const newItems = [...column.items];
      const [removed] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, removed);

      const newColumns = columns.map((col) =>
        col.id === source.droppableId ? { ...col, items: newItems } : { ...col }
      );

      setColumns(newColumns);
    } else {
      // If the item is moved to a different column
      const sourceColumn = columns.find((col) => col.id === source.droppableId);
      const destColumn = columns.find(
        (col) => col.id === destination.droppableId
      );

      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];

      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      const newColumns = columns.map((col) => {
        if (col.id === source.droppableId) {
          return { ...col, items: sourceItems };
        } else if (col.id === destination.droppableId) {
          return { ...col, items: destItems };
        } else {
          return { ...col };
        }
      });

      setColumns(newColumns);
    }
  };

  const handleAddColumn = () => {
    const newColumn = {
      id: uuid(),
      name: "New Column",
      items: [],
    };

    setCol([...col, newColumn]);
  };
  const containerMinWidth = col.length * 250;
  return (
    <div
      style={{
        display: "flex",
        overflowX: "auto", // Enable horizontal scrolling
        height: "100%",
        minWidth: "min-content", // Set the minimum width to min-content
      }}
    >
      <DragDropContext
        onDragEnd={(result) => handleDrag(result, col, setCol)}
      >
        {col.map((column, index) => (
          <div
            key={column.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: "250px", // Set a minimum width for each column
              flexShrink: 0, // Prevent columns from shrinking too much
            }}
          >
            <h2>{column.name}</h2>
            <div style={{ margin: 8 }}>
              <Droppable droppableId={column.id} key={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      background: snapshot.isDraggingOver
                        ? "lightblue"
                        : "lightgrey",
                      padding: 4,
                      width: "100%", // Set the width to 100% to fill the container
                      minHeight: 500,
                    }}
                  >
                    {column.items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                        
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                            style={{
                              userSelect: "none",
                              padding: 16,
                              margin: "0 0 8px 0",
                              minHeight: "50px",
                              backgroundColor: snapshot.isDragging
                                ? "#263B4A"
                                : "#456C86",
                              color: "white",
                              ...provided.draggableProps.style,
                            }}
                          >
                            {item.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        ))}
        <button
          style={{
            padding: "10px 20px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={handleAddColumn}
        >
          Add Column
        </button>
      </DragDropContext>
    </div>
  );
}
