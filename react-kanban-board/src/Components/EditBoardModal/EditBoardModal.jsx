import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteColumnAsync,
  editBoardAsync,
  fetchBoards,
} from "../../reducers/board/boardSlice";
import { hideModal } from "../../reducers/modal/modalSlice";
import Button from "../Button/Button";
import "./EditBoardModal.scss";

const EditBoardModal = () => {
  const dispatch = useDispatch();
  const { activeBoard } = useSelector((store) => store.board);
  const [boardName, setBoardName] = useState(activeBoard.name);
  const [columns, setColumns] = useState([...activeBoard.columns]);
  const [emptyInputs, setEmptyInputs] = useState(true);
  const [error, setError] = useState(false);

  const nameChangeHandler = (e) => {
    setBoardName(e.target.value);
  };

  const columnsChangeHandler = (i, e) => {
    const { value } = e.target;
    let editedColumns = columns.map((el, index) =>
      index === i
        ? {
            ...el,
            name: value,
          }
        : el
    );
    setColumns(editedColumns);

    // Check if there are any empty column names
    const empty = editedColumns.some((el) => !el.name);
    setEmptyInputs(!empty);
  };

  const addColumn = () => {
    setColumns([...columns, { name: "" }]);
  };

  const deleteColumnx = (i) => {
    let filteredColumns = [...columns];
    filteredColumns.splice(i, 1);
    setColumns(filteredColumns);
  };
const fetchBoardsAfterSave = async () => {
  // Fetch boards after saving changes
  await dispatch(fetchBoards());
};
  useEffect(() => {
    // Dispatch the fetchBoards action when the component mounts
    dispatch(fetchBoards());
  }, [dispatch]);

  return (
    <div className="edit-board-wrapper">
      <div className="edit-board-modal">
        <h3 className="edit-modal-title">Edit Board</h3>
        <div className="edit-board-name-div">
          <label>Board Name</label>
          <input
            value={boardName}
            onChange={nameChangeHandler}
            className={`${
              !boardName && error && "error-border"
            } edit-task-title`}
            type="text"
            maxLength={25}
            name="edit board name"
            placeholder="e.g. Web Design"
          />
          {!boardName && error && (
            <div className="name-error">Can't be empty</div>
          )}
        </div>
        <div className="edit-board-columns-div">
          <label>Board Columns</label>
          <div className="edit-columns-list">
            {columns.map((column, index) => (
              <div className="edit-columns-item-div" key={index}>
                <input
                  onChange={(e) => columnsChangeHandler(index, e)}
                  className={`${
                    !column.name && error && "error-border"
                  } edit-column-input`}
                  type="text"
                  name="board"
                  maxLength={20}
                  value={column.name}
                  placeholder="e.g. Web Design"
                />
                <svg
                  onClick={() => {
                    dispatch(deleteColumnAsync(column._id))
                      .unwrap()
                      .then(() => {
                        deleteColumnx(index);
                      });
                  }}
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
                {!column.name && error && (
                  <div className="columns-error">Can't be empty</div>
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
              const updatedColumns = columns.map((column) => ({
                _id: column._id,
                name: column.name,
              }));
              dispatch(hideModal());
              dispatch(
                editBoardAsync({
                  boardId: activeBoard._id,
                  boardName,
                  columns: updatedColumns,
                })
                
              );
              fetchBoardsAfterSave();
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

export default EditBoardModal;
