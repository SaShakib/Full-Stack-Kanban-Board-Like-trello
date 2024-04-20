// Home.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideModal, navMenu, taskMenu } from "../reducers/modal/modalSlice";

import Navbar from "../Components/Navbar/Navbar";
import Sidebar from "../Components/Sidebar/Sidebar";
import BoardBody from "../Components/BoardBody/BoardBody";
import NewBoardModal from "../Components/NewBoardModal/NewBoardModal";
import NewTaskModal from "../Components/NewTaskModal/NewTaskModal";
import NewColumnModal from "../Components/NewColumnModal/NewColumnModal";
import EditTaskModal from "../Components/EditTaskModal/EditTaskModal";
import EditBoardModal from "../Components/EditBoardModal/EditBoardModal";
import DeleteBoardModal from "../Components/DeleteBoardModal/DeleteBoardModal";
import DeleteTaskModal from "../Components/DeleteTaskModal/DeleteTaskModal";
import TaskItemModal from "../Components/TaskItemModal/TaskItemModal";
import { fetchBoards, invitedBoards } from "../reducers/board/boardSlice";
import InviteModal from "../Components/InviteModal/InviteModal";
import AssignedTaskModal from "../Components/AssignedTaskModal/AssignedTaskModal";
const Home = () => {
  let {
    sideBarModal,
    newBoardModal,
    newTaskModal,
    newColumnModal,
    editTaskModal,
    editBoardModal,
    deleteBoardModal,
    deleteTaskModal,
    taskItemModal,
    taskMenuToggle,
    navMenuToggle,
    inviteModal,
    invitedTask,
  } = useSelector((store) => store.modal);
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    // Dispatch the fetchBoards action when the component mounts
    dispatch(fetchBoards());
    dispatch(invitedBoards(user.email));
  }, [dispatch, user.email]);
  return (
    <div
      className="App"
      onClick={() => {
        taskMenuToggle && dispatch(taskMenu());
        navMenuToggle && dispatch(navMenu());
      }}
    >
      {(newBoardModal ||
        invitedTask ||
        newTaskModal ||
        newColumnModal ||
        editTaskModal ||
        editBoardModal ||
        deleteBoardModal ||
        deleteTaskModal ||
        taskItemModal ||
        inviteModal ||
        sideBarModal) && (
        <div>
          <div
            onClick={() => {
              dispatch(hideModal());
            }}
            className="modal-overlay"
          ></div>
          {inviteModal && <InviteModal />}
          {invitedTask && <AssignedTaskModal />}
          {newBoardModal && <NewBoardModal />}
          {newTaskModal && <NewTaskModal />}
          {newColumnModal && <NewColumnModal />}
          {editTaskModal && <EditTaskModal />}
          {editBoardModal && <EditBoardModal />}
          {deleteBoardModal && <DeleteBoardModal />}
          {deleteTaskModal && <DeleteTaskModal />}
          {taskItemModal && <TaskItemModal />}
          {sideBarModal && <Sidebar />}
        </div>
      )}
      <Navbar />
      <main>
        <Sidebar />
        <BoardBody />
      </main>
      {/* Additional content for the homepage goes here */}
    </div>
  );
};

export default Home;
