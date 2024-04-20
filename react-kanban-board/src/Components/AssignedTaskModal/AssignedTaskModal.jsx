// AssignedModal.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideModal } from "../../reducers/modal/modalSlice";
import Button from "../Button/Button";
import "./AssignedTaskModal.scss";

const AssignedTaskModal = () => {
  const dispatch = useDispatch();
  let { tasks } = useSelector((store) => store.board);
  if (tasks) tasks = tasks[0];
  return (
    <div className="assigned-modal-wrapper">
      <div className="assigned-modal">
        <h3 className="modal-title">Assigned Tasks</h3>
        <div className="assigned-tasks-list">
          {tasks &&
            tasks.map((task) => (
              <div className="assigned-task" key={task._id}>
                <h4 className="task-name">
                  Task Name:{" "}
                  <span
                    style={{
                      color: "white",
                      display: "inline",
                      fontSize: "16px",
                    }}
                  >
                    {task.name}
                  </span>
                </h4>
                <div className="subtasks">
                  <p className="subtask-label">Subtasks:</p>
                  <ul className="subtask-list">
                    {task.subtasks.map((subtask) => (
                      <li key={subtask._id} className="subtask">
                        {subtask.task}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="deadline">
                  <p className="deadline-label">Deadline:</p>
                  <p className="deadline-info">
                    {task.deadlineStart &&
                      `Start: ${new Date(
                        task.deadlineStart
                      ).toLocaleDateString()}`}
                    {task.deadlineStart && task.deadlineEnd && " - "}
                    {task.deadlineEnd &&
                      `End: ${new Date(task.deadlineEnd).toLocaleDateString()}`}
                  </p>
                </div>
                {task.label && (
                  <div className="label">
                    <p className="label-label">Label:</p>
                    <div
                      className="label-color"
                      style={{ backgroundColor: task.label }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
        </div>
        <Button
          onClick={() => dispatch(hideModal())}
          text="Close"
          className="close-button"
        />
      </div>
    </div>
  );
};

export default AssignedTaskModal;
