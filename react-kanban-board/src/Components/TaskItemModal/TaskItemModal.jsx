import React from "react";
import { hideModal, editTask, taskMenu } from "../../reducers/modal/modalSlice";
import {
  deleteTaskAsync,
  updateSubtaskAsync,
} from "../../reducers/board/boardSlice";
import { useDispatch, useSelector } from "react-redux";
import mobile from "../../assets/icon-vertical-ellipsis.svg";
import "./TaskItemModal.scss";

const TaskItemModal = () => {
  const dispatch = useDispatch();
  const { taskMenuToggle } = useSelector((store) => store.modal);
  const { activeTask, activeBoard } = useSelector((store) => store.board);
  const { user } = useSelector((store) => store.user);

  const handleDeleteTask = (taskId) => {
    // Dispatch the delete task thunk action
    dispatch(deleteTaskAsync(taskId));
  };
  return (
    <div className="task-item-wrapper">
      <div className="task-item-modal">
        <div className="task-header">
          <h3 className="task-item-title">{activeTask.title}</h3>
          {
            <button className="menu-btn" onClick={() => dispatch(taskMenu())}>
              <img src={mobile} alt="menu button" />
            </button>
          }

          {taskMenuToggle && (
            <div className="menu-div">
              <button
                onClick={() => {
                  dispatch(hideModal());
                  dispatch(editTask());
                }}
                className="edit-board-btn"
              >
                Edit Task
              </button>

              {user._id === activeBoard.owner._id && (
                <button
                  onClick={() => {
                    dispatch(hideModal());
                    handleDeleteTask(activeTask._id);
                  }}
                  className="delete-board-btn"
                >
                  Delete Task
                </button>
              )}
            </div>
          )}
        </div>
        <p className="task-text">{activeTask.description}</p>
        <div className="task-subtask-div">
          <ul className="subtask-list">
            {activeTask.subtasks.map((item, index) => (
              <label className="subtask-item" key={index}>
                <input
                  onClick={() =>
                    dispatch(
                      updateSubtaskAsync({
                        taskId: activeTask._id,
                        subtaskId: item._id,
                        checked: !item.checked,
                      })
                    )
                  }
                  className="checkbox"
                  name="checked"
                  readOnly
                  value={item.checked}
                  checked={item.checked}
                  type="checkbox"
                />
                <span
                  className={`${
                    item.checked ? "checked-text" : ""
                  } subtask-text`}
                >
                  {item.task}
                </span>
              </label>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TaskItemModal;
