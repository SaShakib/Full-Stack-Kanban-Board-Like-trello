import React from "react";
import { useDispatch } from "react-redux";
import { taskItem } from "../../reducers/modal/modalSlice";
import { setActiveTask } from "../../reducers/board/boardSlice";
import "./TaskItem.scss";
import { Draggable } from "react-beautiful-dnd";
import group from "./group.png";
import withness from "./witness.png";
import { useSelector } from "react-redux";
import GroupsIcon from "@mui/icons-material/Groups";
import VisibilityIcon from "@mui/icons-material/Visibility";
const TaskItem = ({
  title,
  taskCount,
  tasksLength,
  columnID,
  taskID,
  index,
  color,
  member,
  label,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);
  const hasMail = member.some((mem) => mem.email === user.email);

  return (
    <Draggable key={taskID} draggableId={taskID} index={index}>
      {(provided, snapshot) => (
        <li
          className="board-item"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            userSelect: "none",
            backgroundColor: snapshot.isDragging ? "#263B4A" : "#2B2C37",
            ...provided.draggableProps.style,
          }}
          onClick={() => {
            dispatch(setActiveTask({ columnID, taskID }));
            dispatch(taskItem());
          }}
        >
          
          {label && (
            <div
              className="Label"
              style={{ background: color ? color : "#635FC7" }}
            >
              <p>{label} </p>
            </div>
          )}
          <h4 className="item-title">{title}</h4>
          <div className="Icons">
            {hasMail && <VisibilityIcon className="icon" />}
            {member.length > 0 && <GroupsIcon className="icon" />}
          </div>
        </li>
      )}
    </Draggable>
  );
};

export default TaskItem;
