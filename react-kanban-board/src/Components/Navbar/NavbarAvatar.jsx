// NavbarAvatar.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./NavbarAvatar.scss";

const NavbarAvatar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { activeBoard } = useSelector((state) => state.board);
  const members = activeBoard.access;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="navbar-avatar">
      <Button onClick={handleClick} style={{ color: "#635FC7" }}>
        <AccountCircleIcon fontSize="large" />
        <span style={{ color: "white", margin: "5px" }}>Invited Members</span>
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        style={{ paddingTop: "4px", paddingBottom: "4px" }}
      >
        {members.map((member, key) => (
          <MenuItem key={member._id} onClick={handleClose}>
            <AccountCircleIcon fontSize="large" style={{ color: "#b417f1" }} />
            <div style={{ marginLeft: "8px" }}>
              <Typography variant="body1" fontWeight="bold">
                {member.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {member.email}
              </Typography>
            </div>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default NavbarAvatar;
