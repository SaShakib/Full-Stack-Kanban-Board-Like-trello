import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../Button/Button";
import "./InviteModal.scss";
import { signUp } from "../../reducers/user/userSlice";
import axios from "../../axiosConfig";
import { inviteMemberAsync } from "../../reducers/board/boardSlice";

const InviteModal = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [Message, setMessage] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [found, setIsFound] = useState(false);
  const { activeBoard } = useSelector((state) => state.board);
  const { access } = activeBoard;
  const searchEmail = async () => {
    if (access.some((user) => user.email === email)) {
      // If it's already invited, display a message and clear the email field
      setIsFound(false);
      setIsEmailValid(true);
      setEmail("");
      setMessage("This user is already added");
      return;
    }
    try {
      const response = await axios.post("/auth/check-email", { email });
      setIsFound(response.data.emailExists);
      setIsEmailValid(response.data.emailExists);
    } catch (error) {
      console.error("Error searching email:", error);
      setIsFound(false);
      setIsEmailValid(false);
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleInvite = async () => {
    if (!isEmailValid) {
      const userData = {
        email,
        name,
        password: name,
      };

      await dispatch(signUp(userData));
    }

    await dispatch(
      inviteMemberAsync({
        email,
        name,
        role,
        ownerId: activeBoard.owner._id,
        boardId: activeBoard._id,
      })
    ).then(() => {
      setEmail("");
      setName("");
      setIsEmailValid(true);
      setIsFound(false);
      setMessage("User is added");
    });
  };

  return (
    <div className="invite-modal-wrapper">
      <div className="invite-modal">
        <h3 className="modal-title">Invite New Members</h3>
        <div className="search-email-div">
          <label htmlFor="email">Email</label>
          <input
            className={`${
              !email && !isEmailValid && "error-border"
            } email-input`}
            type="text"
            maxLength={50}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            placeholder="Enter email"
          />
          <Button
            onClick={searchEmail}
            text="Search"
            className="search-button"
          />
          {!isEmailValid && <div className="email-error">Email not found</div>}
          {found && <div className="email-success">Email found</div>}
          {Message && <div className="email-success">{Message}</div>}
        </div>
        {!isEmailValid && (
          <>
            <div className="name-div">
              <label htmlFor="name">Name</label>
              <input
                className={`${!name && "error-border"} name-input`}
                type="text"
                maxLength={50}
                value={name}
                required
                onChange={handleNameChange}
                name="name"
                placeholder="Enter name"
              />
            </div>
            <div className="role-div">
              <label htmlFor="role">Role</label>
              <input
                className={`${!role && "error-border"} role-input`}
                type="text"
                maxLength={50}
                required
                value={role}
                onChange={handleRoleChange}
                name="role"
                placeholder="Enter role"
              />
            </div>
            <Button
              onClick={() => {
                handleInvite();
              }}
              text="Invite"
              className="invite-button"
            />
          </>
        )}

        {found && (
          <>
            <div className="role-div">
              <label htmlFor="role">Role</label>
              <input
                className={`${!role && "error-border"} role-input`}
                type="text"
                maxLength={50}
                value={role}
                required
                onChange={handleRoleChange}
                name="role"
                placeholder="Enter role"
              />
            </div>
            <Button
              onClick={() => {
                handleInvite();
              }}
              text="Invite"
              className="invite-button"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default InviteModal;
