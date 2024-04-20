import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { newColumn, newBoard } from "../../reducers/modal/modalSlice";
import Button from "../Button/Button";
import TaskColumn from "../TaskColumn/TaskColumn";
import "./BoardBody.scss";
import { DragDropContext } from "react-beautiful-dnd";

import { moveTask, moveTaskAsync } from "../../reducers/board/boardSlice";
const BoardBody = () => {
  const dispatch = useDispatch();
  const { boards, activeBoard } = useSelector(
    (store) => store.board
  );
  const { user } = useSelector((store) => store.user);

  const colors = ["#49c4e5", "#8471f2", "#67e2ae", "#ff6fa2", "#ffca5e"];
  const handleDrag = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    if (user._id === activeBoard.owner._id) {
      dispatch(
        moveTaskAsync({
          sourceColumnId: source.droppableId,
          destinationColumnId: destination.droppableId,
          sourceIndex: source.index,
          destinationIndex: destination.index,
        })
      );
      dispatch(moveTask({ source, destination, activeBoard }));
    }
  };

  return (
    <div className="board-body">
      {boards.length > 0 ? (
        <div className="boards-div">
          <DragDropContext
            onDragEnd={(result) => handleDrag(result, activeBoard)}
          >
            {activeBoard &&
              activeBoard.columns &&
              activeBoard.columns.map((item, index) => {
                return (
                  <TaskColumn
                    _id={item._id}
                    name={item.name}
                    key={item._id}
                    color={colors[index % colors.length]}
                  />
                );
              })}
            <div
              onClick={() => dispatch(newColumn())}
              className="new-board-column"
            >
              <h2>+ New Column</h2>
            </div>
          </DragDropContext>
        </div>
      ) : (
        <div className="empty-board-div">
          <div className="empty-content">
            <h3>No Board! Create Board to get Started</h3>
            <Button
              onClick={() => dispatch(newBoard())}
              className={"add-task"}
              text={"+ Add New Board"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardBody;
