import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideModal } from "../../reducers/modal/modalSlice";
import {
  deleteBoardAsync,
  deleteCurrentBoard,
} from "../../reducers/board/boardSlice";
import "./DeleteBoardModal.scss";

const DeleteBoardModal = () => {
  const { activeBoard } = useSelector((state) => state.board);

  const dispatch = useDispatch();
  return (
    <div className="delete-board-wrapper">
      <div className="delete-board-modal">
        <h3 className="delete-board-title">Delete this board?</h3>
        <p className="delete-text">
          Are you sure you want to delete the board? This action will remove all
          columns and tasks and cannot be reversed.
        </p>
        <div className="delete-btn-div">
          <button
            onClick={() => {
              dispatch(deleteBoardAsync(activeBoard._id));
              dispatch(deleteCurrentBoard());
              dispatch(hideModal());
            }}
            className="delete-btn"
          >
            Delete
          </button>
          <button
            onClick={() => {
              dispatch(hideModal());
            }}
            className="cancel-btn"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBoardModal;
