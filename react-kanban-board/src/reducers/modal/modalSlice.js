import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    sideBarModal: false,
    editBoardModal: false,
    editTaskModal: false,
    inviteModal: false,
    newBoardModal: false,
    newColumnModal: false,
    newTaskModal: false,
    deleteBoardModal: false,
    deleteTaskModal: false,
    taskItemModal: false,
    taskMenuToggle: false,
    navMenuToggle: false,
    theme: false,
    invitedTask: false,
  },
  reducers: {
    sideBar: (state) => {
      state.sideBarModal = true;
    },
    editBoard: (state) => {
      state.editBoardModal = true;
    },
    editTask: (state) => {
      state.editTaskModal = true;
    },
    newBoard: (state) => {
      state.newBoardModal = true;
    },
    invitedTask: (state) => {
      state.invitedTask = true;
    },
    inviteModal: (state) => {
      state.inviteModal = true;
    },
    newColumn: (state) => {
      state.newColumnModal = true;
    },
    newTask: (state) => {
      state.newTaskModal = true;
    },
    deleteBoard: (state) => {
      state.deleteBoardModal = true;
    },
    deleteTask: (state) => {
      state.deleteTaskModal = true;
    },
    taskItem: (state) => {
      state.taskItemModal = true;
    },
    taskMenu: (state) => {
      state.taskMenuToggle = !state.taskMenuToggle;
    },
    navMenu: (state) => {
      state.navMenuToggle = !state.navMenuToggle;
    },
    themeToggle: (state) => {
      state.theme = !state.theme;
    },
    hideModal: (state) => {
      state.sideBarModal = false;
      state.editBoardModal = false;
      state.editTaskModal = false;
      state.newBoardModal = false;
      state.newColumnModal = false;
      state.newTaskModal = false;
      state.deleteBoardModal = false;
      state.deleteTaskModal = false;
      state.taskItemModal = false;
      state.inviteModal = false;
      state.invitedTask = false;
    },
  },
});

export const {
  sideBar,
  invitedTask,
  editBoard,
  editTask,
  newBoard,
  inviteModal,
  newColumn,
  newTask,
  deleteBoard,
  deleteTask,
  hideModal,
  taskItem,
  taskMenu,
  navMenu,
  themeToggle,
} = modalSlice.actions;

export default modalSlice.reducer;
