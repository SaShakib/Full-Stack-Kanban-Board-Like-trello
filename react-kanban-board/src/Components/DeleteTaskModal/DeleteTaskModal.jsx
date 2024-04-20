import React from 'react';
import {useDispatch} from "react-redux";
import {deleteCurrentTask} from "../../reducers/board/boardSlice";
import {hideModal} from "../../reducers/modal/modalSlice";
import "./DeleteTaskModal.scss";

const DeleteTaskModal = () => {
  const dispatch = useDispatch();
  return (
    <div className="delete-task-wrapper">
      <div className="delete-task-modal">
        <h3 className="delete-task-title">Delete this board?</h3>
        <p className="delete-text">Are you sure you want to delete the task and its subtasks? This action cannot be reversed.</p>
        <div className="delete-btn-div">
          <button
            onClick={() => {
            dispatch(hideModal());
            dispatch(deleteCurrentTask());
          }}
            className="delete-task-btn">Delete</button>
          <button onClick={() => dispatch(hideModal())} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>

  )
}

export default DeleteTaskModal;