import React, { useState } from "react";

import { useDispatch } from "react-redux";
import { addBoard } from "../../reducers/board/boardSlice";
import { hideModal } from "../../reducers/modal/modalSlice";
import Button from "../Button/Button";
import { v4 as uuid } from "uuid";
import "./NewBoardModal.scss";

const NewBoardModal = () => {
  const dispatch = useDispatch();
  const [boardName, setBoardName] = useState("");
  const [columns, setColumns] = useState([
    {
      id: uuid(),
      board: "Todo",
      tasks: [],
    },
    {
      id: uuid(),
      board: "Doing",
      tasks: [],
    },
  ]);
  const [emptyInputs, setEmptyInputs] = useState(true);
  const [error, setError] = useState(false);

  const nameChangeHandler = (e) => {
    setBoardName(e.target.value);
  };

  const columnsChangeHandler = (i, e) => {
    let columnsValues = [...columns];
    columnsValues[i][e.target.name] = e.target.value;

    setColumns(columnsValues);
    let empty = columnsValues.find((el) => el.board === "");

    if (empty) {
      setEmptyInputs(false);
    } else {
      setEmptyInputs(true);
    }
  };

  const addColumn = () => {
    setColumns([
      ...columns,
      {
        _id: uuid(),
        board: "",
        tasks: [],
      },
    ]);
  };

  const deleteColumn = (i) => {
    let filteredColumns = [...columns];
    filteredColumns.splice(i, 1);
    setColumns(filteredColumns);
  };

  return (
    <div className="new-board-wrapper">
      <div className="new-board-modal">
        <h3 className="modal-title">Add New Board</h3>
        <div className="board-name-div">
          <label htmlFor="board name">Board Name</label>
          <input
            className={`${!boardName && error && "error-border"} board-name`}
            type="text"
            maxLength={25}
            value={boardName}
            onChange={nameChangeHandler}
            name="board name"
            placeholder="e.g. Web Design"
          />{" "}
          {!boardName && error && (
            <div className="name-error">Can't be empty</div>
          )}{" "}
        </div>
        <div className="board-columns-div">
          <label>Board Columns</label>
          <div className="columns-list">
            {columns.map((column, index) => (
              <div className="columns-item-div" key={index}>
                <input
                  onChange={(e) => columnsChangeHandler(index, e)}
                  className={`${
                    !column.board && error && "error-border"
                  } column-input`}
                  type="text"
                  name="board"
                  maxLength={20}
                  value={column.board || ""}
                  placeholder="e.g. Web Design"
                />
                <svg
                  onClick={() => deleteColumn(index)}
                  key={index}
                  width="15"
                  height="15"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g fill="#828FA3" fillRule="evenodd">
                    <path d="m12.728 0 2.122 2.122L2.122 14.85 0 12.728z" />
                    <path d="M0 2.122 2.122 0 14.85 12.728l-2.122 2.122z" />
                  </g>
                </svg>
                {!column.board && error && (
                  <div className="column-error">Can't be empty</div>
                )}
              </div>
            ))}
          </div>
        </div>
        <Button
          onClick={() => addColumn()}
          text={"+ Add New Column"}
          className={"add-column-subtask"}
        />
        <Button
          onClick={() => {
            if (boardName && emptyInputs) {
              setError(false);
              dispatch(addBoard({ name: boardName, columns }));
              dispatch(hideModal());
            } else {
              setError(true);
            }
          }}
          text={"Save Changes"}
          className={"create-save-changes"}
        />
      </div>
    </div>
  );
};

export default NewBoardModal;
