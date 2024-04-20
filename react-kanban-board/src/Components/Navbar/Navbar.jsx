import React from "react";
import darkLogo from "../../assets/logo-light.svg";
import lightLogo from "../../assets/logo-dark.svg";
import mobile from "../../assets/icon-vertical-ellipsis.svg";
import Button from "../Button/Button";
import { useDispatch, useSelector } from "react-redux";

import {
  newTask,
  editBoard,
  deleteBoard,
  navMenu,
  sideBar,
  inviteModal,
} from "../../reducers/modal/modalSlice";
import "./Navbar.scss";
import NavbarAvatar from "./NavbarAvatar";

const Navbar = () => {
  const dispatch = useDispatch();
  const { navMenuToggle, theme } = useSelector((store) => store.modal);
  const { activeBoard } = useSelector((store) => store.board);
  const { user } = useSelector((store) => store.user);
  return (
    <nav className="navbar">
      <div className="logo-div">
        <img
          className="logo-img"
          src={!theme ? darkLogo : lightLogo}
          alt="logo"
        />
      </div>
      <div className="main-navbar">
        <div className="mobile-logo-div">
          <svg width="24" height="25" xmlns="http://www.w3.org/2000/svg">
            <g fill="#635FC7" fillRule="evenodd">
              <rect width="6" height="25" rx="2" />
              <rect opacity=".75" x="9" width="6" height="25" rx="2" />
              <rect opacity=".5" x="18" width="6" height="25" rx="2" />
            </g>
          </svg>
          <button
            onClick={() => dispatch(sideBar())}
            className="mobile-board-menu"
          >
            {activeBoard && (
              <h2 className="mobile-board-name">{activeBoard.name}</h2>
            )}
            <svg width="10" height="7" xmlns="http://www.w3.org/2000/svg">
              <path
                stroke="#635FC7"
                strokeWidth="2"
                fill="none"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
        </div>
        {activeBoard && (
          <>
            <h2 className="board-name">{activeBoard.name}</h2>
            <div className="container">
              <NavbarAvatar />

              {user._id === activeBoard.owner._id && (
                <div className="add-task-div">
                  <Button
                    onClick={() => dispatch(newTask())}
                    className={"add-task"}
                    text={"+ Add New Task"}
                  />
                  <button
                    onClick={() => dispatch(newTask())}
                    className="mobile-add-btn"
                  >
                    <svg
                      width="12"
                      height="12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="#FFF"
                        d="M7.368 12V7.344H12V4.632H7.368V0H4.656v4.632H0v2.712h4.656V12z"
                      />
                    </svg>
                  </button>
                  <img
                    onClick={() => dispatch(navMenu())}
                    className="menu-btn"
                    src={mobile}
                    alt="menu"
                  />
                </div>
              )}
            </div>
          </>
        )}
        {navMenuToggle && (
          <div className="menu-div">
            <button
              onClick={() => dispatch(inviteModal())}
              className="invite-button"
            >
              Invite
            </button>
            <button
              onClick={() => dispatch(editBoard())}
              className="edit-board-btn"
            >
              Edit Board
            </button>
            <button
              onClick={() => dispatch(deleteBoard())}
              className="delete-board-btn"
            >
              Delete Board
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
