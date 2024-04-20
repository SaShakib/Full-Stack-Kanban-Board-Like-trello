import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { newBoard, hideModal, invitedTask } from "../../reducers/modal/modalSlice";
import { setActiveBoard } from "../../reducers/board/boardSlice";
import SideBarBoard from "../SideBarBoard/SideBarBoard";
import "./Sidebar.scss";
import { logout } from "../../reducers/user/userSlice";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { boards } = useSelector((store) => store.board);
  const { sideBarModal } = useSelector((store) => store.modal);
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then((result) => {
        // Redirect to '/' on successful sign-in
        navigate("/signin");
      })
      .catch((err) => {
        // Handle any errors here (they are already set in the Redux state)
        // You can also display an error message to the user
      });
  };
  return (
    <div
      className={`${sideBarModal && "mobile-show-sidebar"}  sidebar-wrapper`}
    >
      <div className={`${sidebarToggle && "hide-sidebar"} sidebar`}>
        <div className="boards-list-div">
          <h5 className="sidebar-boards-counter">{`ALL BOARDS (${boards.length})`}</h5>
          <ul className="sidebar-board-list">
            {boards &&
              boards.map((item) => {
                return (
                  <SideBarBoard
                    onClick={() => {
                      dispatch(hideModal());
                      dispatch(setActiveBoard(item._id));
                    }}
                    _id={item._id}
                    name={item.name}
                    key={item._id}
                  />
                );
              })}
          </ul>
          <button
            onClick={() => {
              dispatch(hideModal());
              dispatch(newBoard());
            }}
            className="create-board-btn"
          >
            
            + Create New Board
          </button>

          <button
            onClick={() => {
              dispatch(hideModal());
              dispatch(invitedTask());
            }}
            className="create-board-btn"
            style={{
              background: "#635FC7",
              color: "white",
              marginTop: "20px",
              width: "100%",
              borderRadius: "2px",
            }}
          >
            <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z"
                fill="currentColor"
              />
            </svg>
            Assigned Task
          </button>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-log-out"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Logout
        </button>
        <button
          className={`${
            sidebarToggle && "hidden-toggle-btn"
          } sidebar-toggle-btn`}
          onClick={() => setSidebarToggle((prev) => !prev)}
        >
          {sidebarToggle ? (
            <svg width="16" height="11" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15.815 4.434A9.055 9.055 0 0 0 8 0 9.055 9.055 0 0 0 .185 4.434a1.333 1.333 0 0 0 0 1.354A9.055 9.055 0 0 0 8 10.222c3.33 0 6.25-1.777 7.815-4.434a1.333 1.333 0 0 0 0-1.354ZM8 8.89A3.776 3.776 0 0 1 4.222 5.11 3.776 3.776 0 0 1 8 1.333a3.776 3.776 0 0 1 3.778 3.778A3.776 3.776 0 0 1 8 8.89Zm2.889-3.778a2.889 2.889 0 1 1-5.438-1.36 1.19 1.19 0 1 0 1.19-1.189H6.64a2.889 2.889 0 0 1 4.25 2.549Z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <>
              <svg width="18" height="16" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8.522 11.223a4.252 4.252 0 0 1-3.654-5.22l3.654 5.22ZM9 12.25A8.685 8.685 0 0 1 1.5 8a8.612 8.612 0 0 1 2.76-2.864l-.86-1.23A10.112 10.112 0 0 0 .208 7.238a1.5 1.5 0 0 0 0 1.524A10.187 10.187 0 0 0 9 13.75c.414 0 .828-.025 1.239-.074l-1-1.43A8.88 8.88 0 0 1 9 12.25Zm8.792-3.488a10.14 10.14 0 0 1-4.486 4.046l1.504 2.148a.375.375 0 0 1-.092.523l-.648.453a.375.375 0 0 1-.523-.092L3.19 1.044A.375.375 0 0 1 3.282.52L3.93.068a.375.375 0 0 1 .523.092l1.735 2.479A10.308 10.308 0 0 1 9 2.25c3.746 0 7.031 2 8.792 4.988a1.5 1.5 0 0 1 0 1.524ZM16.5 8a8.674 8.674 0 0 0-6.755-4.219A1.75 1.75 0 1 0 12.75 5v-.001a4.25 4.25 0 0 1-1.154 5.366l.834 1.192A8.641 8.641 0 0 0 16.5 8Z"
                  fill="currentColor"
                />
              </svg>
              Hide Sidebar
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
