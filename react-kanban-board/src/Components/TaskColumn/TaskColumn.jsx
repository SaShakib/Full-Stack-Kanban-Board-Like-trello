import React from "react";
import TaskItem from "../TaskItem/TaskItem";
import { useSelector } from "react-redux";
import "./TaskColumn.scss";
import { Droppable } from "react-beautiful-dnd";

const TaskColumn = ({ name, _id, color }) => {
  const { activeBoard } = useSelector((store) => store.board);
  const columnsByID = activeBoard.columns.find((el) => el._id === _id);
  return (
    <Droppable droppableId={_id} key={_id}>
      {(provided, snapshot) => (
        <div className="board-column">
          <h3>
            <span
              className="board-color"
              style={{
                backgroundColor: color,
              }}
            ></span>
            {name} ({columnsByID.taskList && columnsByID.taskList.length})
          </h3>
          <ul className="task-list">
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                background: snapshot.isDraggingOver ? "#3e3f4e" : "#1e1e1e",
                minHeight: "60px",
              }}
            >
              {columnsByID.taskList &&
                columnsByID.taskList.map((item, index) => (
                  <TaskItem
                    columnID={_id}
                    taskID={item._id}
                    key={index}
                    index={index}
                    title={item.name}
                    label={item.label}
                    color={item.color}
                    tasksLength={item.subtasks.length}
                    member={item.assignedList}
                    
                  />
                ))}
              {provided.placeholder}
            </div>
          </ul>
        </div>
      )}
    </Droppable>
  );
};

export default TaskColumn;
