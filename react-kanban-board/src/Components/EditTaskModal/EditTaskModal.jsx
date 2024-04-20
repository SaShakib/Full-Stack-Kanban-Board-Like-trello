import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideModal } from "../../reducers/modal/modalSlice";
import {
  addComment,
  editTask,
  updateTask,
} from "../../reducers/board/boardSlice";
import Button from "../Button/Button";
import { v4 as uuid } from "uuid";
import "./EditTaskModal.scss";
import axios from "../../axiosConfig";
import CommentsSection from "./CommentsSection";

const EditTaskModal = () => {
  const dispatch = useDispatch();
  const { activeTask, activeBoard, activeColumn } = useSelector(
    (store) => store.board
  );

  const { user } = useSelector((store) => store.user);
  const [title, setTitle] = useState(activeTask.name);
  const [description, setDescription] = useState(activeTask.description);
  const [subtasks, setSubTasks] = useState([...activeTask.subtasks]);
  const [removedSubTask, setRemovedSubTask] = useState(0);
  const status = activeColumn._id;
  // const [option, setOption] = useState(activeColumn.board);
  const [emptyInputs, setEmptyInputs] = useState(true);
  const [error, setError] = useState(false);
  const [label, setLabel] = useState(activeTask.label || "");
  const [color, setColor] = useState(activeTask.color || "");
  const [image, setImage] = useState(activeTask.image || null);
  const [deadline, setDeadline] = useState(
    activeTask.deadline ||
      new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
  );
  const [startDate, setStartDate] = useState(
    activeTask.startDate || new Date(Date.now()).toISOString()
  );
  const [comment, setComments] = useState("");
  const [resources, setResources] = useState(activeTask.resource || "");
  const [members, setMembers] = useState(activeTask.assignedList || []);
  const [member, setMember] = useState("");
  const [uploadedimage, setuploadImage] = useState(null);
  const [newFiles, setNewFiles] = useState([]);
  const [Message, setMessage] = useState("");

  const titleHandler = (e) => {
    setTitle(e.target.value);
  };
  const descriptionHandler = (e) => {
    setDescription(e.target.value);
  };

  const subTasksChangeHandler = (i, e) => {
    const { name, value } = e.target;
    let editedTasks = subtasks.map((el, index) =>
      index === i
        ? {
            ...el,
            [name]: value,
          }
        : el
    );
    const empty = editedTasks.find((el) => el.task === "");
    setSubTasks(editedTasks);

    if (empty) {
      setEmptyInputs(false);
    } else {
      setEmptyInputs(true);
    }
  };

  const addSubTask = () => {
    setSubTasks([...subtasks, { _id: uuid(), task: "", checked: false }]);
  };
  const colorOptions = ["#FF5733", "#33FF57", "#5733FF", "#FF5733", "#33FF57"]; // Add your desired colors

  const handleFilesChange = (e) => {
    const selectedFiles = e.target.files;
    setNewFiles(Array.from(selectedFiles));
  };
  const uploadFiles = async () => {
    try {
      const formData = new FormData();
      newFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await axios.post("/upload/upload-files", formData);
      // // Update the fileUrls state with the new file URLs
      const updatedFileUrls = [...resources, ...response.data.fileUrls];
      setResources(updatedFileUrls);

      // // Reset the newFiles state
      setNewFiles([]);
      document.getElementById("fileInput").value = "";

      // Handle success, update UI as needed
    } catch (error) {
      console.error("Error uploading files:", error);
      // Handle error
    }
  };
  const addCommentHandler = () => {
    dispatch(
      addComment({
        boardId: activeBoard._id,
        taskId: activeTask._id, // Make sure taskId is defined in your component
        comment: { name: user.name, content: comment }, // Update with actual user name
      })
    );
    setComments("");
  };

  const deleteFile = async (filename, index) => {
    try {
      await axios.delete(`/upload/delete-file/${filename}`);
      // Handle success, update UI as needed
      const updatedFiles = [...resources];
      updatedFiles.splice(index, 1);
      setResources(updatedFiles);
    } catch (error) {
      console.error("Error deleting file:", error);
      // Handle error
    }
  };
  const handleImageRemove = () => {
    setImage(null);
  };

  const deleteSubTask = (i, _id) => {
    let filteredSubTasks = [...subtasks];
    let getSubTaskByID = subtasks.find((el) => el._id === _id);

    if (getSubTaskByID.checked) {
      setRemovedSubTask(removedSubTask + 1);
    }

    filteredSubTasks.splice(i, 1);

    setSubTasks(filteredSubTasks);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage({ dataUrl: reader.result, file });
      };

      reader.readAsDataURL(file);
    }
  };
  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append("image", image.file);

      const response = await axios.post("/upload/upload-image", formData);
      setuploadImage(response.data.imageUrls);
      console.log(response.data);

      document.getElementById("imageUpload").value = "";
      // Handle success, update UI as needed
    } catch (error) {
      console.error("Error uploading image:", error);
      // Handle error
    }
  };

  const handleAddMember = async () => {
    const isEmailAlreadyAdded = activeBoard.access.some(
      (user) => user.email === member
    );

    if (isEmailAlreadyAdded) {
      setMessage("");
      try {
        const response = await axios.post("/board/add-member", {
          taskId: activeTask._id,
          member,
        });

        // Assuming the API response contains the updated task
        const updatedTask = response.data.task;

        // Update the members state with the new member
        setMembers(updatedTask.assignedList);
        setMember("");
        // You can perform any other actions based on the API response
        console.log("Member added successfully:", updatedTask);
      } catch (error) {
        // Handle errors here
        console.error("Error adding member:", error);
      }
      return;
    }
    setMember("");
    setMessage("User wasnt invited on board!");
  };
  return (
    <div className="edit-task-wrapper">
      <div className="edit-task-modal">
        <h3 className="edit-task-title">Edit Task</h3>

        <div className="container">
          <div className="col1">
            <div className="edit-task-title-div">
              <label htmlFor="edit-task-title">Title</label>
              <input
                onChange={titleHandler}
                type="text"
                maxLength={60}
                name="edit-task-title"
                value={title}
                className={`${
                  !title && error && "error-border"
                } edit-task-title`}
                placeholder="e.g. Web Design"
              />
              {!title && error && (
                <div className="title-error">Can't be empty</div>
              )}
            </div>
            <div className="edit-description-div">
              <label htmlFor="edit-description">Description</label>
              <textarea
                onChange={descriptionHandler}
                className="edit-description"
                name="edit-description"
                value={description}
                rows="5"
                placeholder="e.g. It's always good to take a break. This 15 minute break will
  recharge the batteries a little. (OPTIONAL)"
              ></textarea>
            </div>
            <div className="edit-subtasks-div">
              <label htmlFor="edit-subtasks">Subtasks</label>
              <div className="edit-subtasks-list">
                {subtasks.map((item, index) => (
                  <div className="edit-subtasks-item-div" key={index}>
                    <input
                      onChange={(e) => subTasksChangeHandler(index, e)}
                      className={`${
                        !item.task && error && "error-border"
                      } edit-subtasks-input`}
                      type="text"
                      value={item.task}
                      name="task"
                      placeholder="e.g. Web Design"
                    />
                    {user._id === activeBoard.owner._id && (
                      <svg
                        onClick={() => {
                          deleteSubTask(index, item._id);
                        }}
                        width="15"
                        height="15"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g fill="#828FA3" fillRule="evenodd">
                          <path d="m12.728 0 2.122 2.122L2.122 14.85 0 12.728z" />
                          <path d="M0 2.122 2.122 0 14.85 12.728l-2.122 2.122z" />
                        </g>
                      </svg>
                    )}
                    {!item.task && error && (
                      <div className="subtask-error">Can't be empty</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {user._id === activeBoard.owner._id && (
              <Button
                onClick={() => addSubTask()}
                text={"+ Add New Subtask"}
                className={"add-column-subtask"}
              />
            )}
            <div>
              <div className="edit-comments-div">
                <label>Comments</label>
                <textarea
                  onChange={(e) => setComments(e.target.value)}
                  className="edit-comments"
                  value={comment}
                  name="comments"
                  rows="5"
                  placeholder="Add comments here..."
                />
              </div>
              <button className="send-button" onClick={addCommentHandler}>
                Send
              </button>

              <CommentsSection comments={activeTask.comment} />
            </div>
          </div>
          <div className="col2">
            <div className="edit-label-div">
              <label>Label</label>
              <input
                onChange={(e) => setLabel(e.target.value)}
                type="text"
                value={label}
                name="label"
                className="edit-label"
                placeholder="e.g. Important"
              />
            </div>

            <div className="edit-color-div">
              <label>Color</label>
              <div className="edit-color-options">
                {colorOptions.map((option, index) => (
                  <div
                    key={index}
                    className={`edit-color-option${
                      color === option ? " selected" : ""
                    }`}
                    style={{ backgroundColor: option }}
                    onClick={() => setColor(option)}
                  />
                ))}
              </div>
              {color && (
                <div className="edit-selected-color">
                  <label>Selected Color:</label>
                  <div
                    className="edit-color-option selected"
                    style={{ backgroundColor: color }}
                  />
                </div>
              )}
            </div>

            <div className="deadline-div">
              <label>Start Date</label>
              <input
                type="date"
                value={startDate.split("T")[0]}
                onChange={(e) => setStartDate(new Date(e.target.value))}
                required
              />
            </div>
            <div className="deadline-div">
              <label>End Deadline</label>
              <input
                type="date"
                value={deadline.split("T")[0]}
                onChange={(e) => setDeadline(new Date(e.target.value))}
                required
              />
            </div>
            <div className="edit-image-upload-div">
              <label>Image Upload</label>
              <input
                type="file"
                accept="image/*"
                id="imageUpload"
                onChange={handleImageChange}
              />
              {image && (
                <div className="uploaded-image">
                  <label>Uploaded Image:</label>
                  <img src={image.dataUrl} alt="uploaded" />
                  <button onClick={handleImageRemove}>Remove</button>
                  <button onClick={uploadImage}>Upload Image</button>
                </div>
              )}
            </div>
            <div className="edit-resources-div">
              <label>Resource Sharing</label>
              <input
                type="file"
                onChange={handleFilesChange}
                multiple
                id="fileInput"
              />
              {resources.length > 0 && (
                <div className="Uploaded">
                  <label>Uploaded Files:</label>
                  <ul>
                    {resources.map((fileUrl, index) => (
                      <li key={index} style={{ margin: "12px" }}>
                        <a
                          className="file-link"
                          href={`http://localhost:5000/api/uploads/${fileUrl.name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {fileUrl.name}{" "}
                        </a>

                        <button onClick={() => deleteFile(fileUrl.name, index)}>
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {newFiles.length > 0 && (
                <div>
                  <label>New Files:</label>
                  <ul>
                    {newFiles.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                  <button onClick={uploadFiles}>Upload New Files</button>
                </div>
              )}
            </div>
            {Message && <>{Message}</>}
            <div className="edit-members-div">
              {user._id === activeBoard.owner._id && (
                <div>
                  <label>Member List</label>
                  <input
                    onChange={(e) => setMember(e.target.value)}
                    type="text"
                    value={member}
                    name="members"
                    className="edit-members"
                    placeholder="Add member's email"
                  />
                  <button onClick={handleAddMember}>Add</button>
                </div>
              )}
              {members.length > 0 && (
                <div className="members-list">
                  <h4>Member List</h4>
                  <ul>
                    {members.map((member, index) => (
                      <li key={index}>
                        {member.name}
                        {"    "}
                        <span
                          style={{
                            color: "gray",
                            fontSize: "12px",
                            marginLeft: "6px",
                          }}
                        >
                          ({member.email})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {user._id === activeBoard.owner._id && (
          <Button
            onClick={() => {
              if (emptyInputs && title) {
                const updatedTask = {
                  name: title,
                  description,
                  subtasks,
                  status,
                  deadline,
                  startDate,
                  label,
                  color,
                  resources,
                  image: uploadedimage,
                  assignedList: members,
                  comments: activeTask.comment,
                };

                setError(false);
                dispatch(
                  updateTask({ taskId: activeTask._id, updatedTask })
                ).then((res) => {
                  dispatch(
                    editTask({
                      name: title,
                      description,
                      subtasks,
                      status,
                      deadline,
                      startDate,
                      label,
                      color,
                      resources,
                      assignedList: members,
                      image: uploadedimage,
                      comments: activeTask.comment,
                    })
                  );
                });

                // dispatch(moveTask(status));
                dispatch(hideModal());
              } else {
                setError(true);
              }
            }}
            text={"Save Changes"}
            className={"create-save-changes"}
          />
        )}
      </div>
    </div>
  );
};

export default EditTaskModal;
