import React, { useState } from "react";
import Button from "../Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { hideModal } from "../../reducers/modal/modalSlice";
import {  addNewColumn } from "../../reducers/board/boardSlice";
import "./NewColumnModal.scss";

const NewColumnModal = () => {
  const dispatch = useDispatch();
  const [newColumn, setNewColumn] = useState("");
  const [error, setError] = useState(false);
  const { activeBoard } = useSelector((state) => state.board);
  const newColumnHandler = (e) => {
    setNewColumn(e.target.value);
  };

  return (
    <div className="new-column-wrapper">
      <div className="new-column-modal">
        <h3 className="column-title">Add New Column</h3>
        <div className="new-column-div">
          <label htmlFor="name">Name</label>
          <input
            onChange={newColumnHandler}
            type="text"
            name="name"
            maxLength={20}
            className={`${!newColumn && error && "error-border"} name`}
            placeholder="e.g. Archived"
          />
          {!newColumn && error && (
            <div className="name-error">Can't be empty</div>
          )}
        </div>
        <Button
          onClick={() => {
            if (newColumn) {
              setError(false);
              dispatch(hideModal());
              console.log(newColumn);
              dispatch(
                addNewColumn({ boardId: activeBoard._id, name: newColumn })
              );
            } else {
              setError(true);
            }
          }}
          text={"+ Add New Column"}
          className={"create-save-changes"}
        />
      </div>
    </div>
  );
};

export default NewColumnModal;
