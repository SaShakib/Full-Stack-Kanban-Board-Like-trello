import React, { useState } from "react";
import Button from "../Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { hideModal } from "../../reducers/modal/modalSlice";
import { addTask, createTask } from "../../reducers/board/boardSlice";
import { v4 as uuid } from "uuid";
import "./NewTaskModal.scss";
import axios from "../../axiosConfig"; // Import your configured Axios instance

const NewTaskModal = () => {
  const dispatch = useDispatch();
  const { activeBoard } = useSelector((store) => store.board);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subTasks, setSubTasks] = useState([
    { _id: uuid(), task: "", checked: false },
    { _id: uuid(), task: "", checked: false },
  ]);
  const [status] = useState(activeBoard.columns[0]._id);
  const [emptyInputs, setEmptyInputs] = useState(false);
  const [error, setError] = useState(false);
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
  );
  const [startDate, setStartDate] = useState(
    new Date(Date.now()).toISOString()
  );
  const [label, setLabel] = useState("");
  const [color, setColor] = useState("");
  const [image, setImage] = useState(null);
  const [uploadedimage, setuploadImage] = useState(null);

  const [newFiles, setNewFiles] = useState([]);
  const [fileUrls, setFileUrls] = useState([]);

  const [members, setMembers] = useState("");

  const titleChangeHandler = (e) => {
    setTitle(e.target.value);
  };

  const descriptionChangeHandler = (e) => {
    setDescription(e.target.value);
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
  const deleteFile = async (filename, index) => {
    try {
      await axios.delete(`/upload/delete-file/${filename}`);
      // Handle success, update UI as needed
      const updatedFiles = [...fileUrls];
      updatedFiles.splice(index, 1);
      setFileUrls(updatedFiles);
    } catch (error) {
      console.error("Error deleting file:", error);
      // Handle error
    }
  };

  const handleImageRemove = () => {
    setImage(null);
  };

  const handleFilesChange = (e) => {
    const selectedFiles = e.target.files;
    setNewFiles(Array.from(selectedFiles));
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

  const uploadFiles = async () => {
    try {
      const formData = new FormData();
      newFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await axios.post("/upload/upload-files", formData);
      // // Update the fileUrls state with the new file URLs
      const updatedFileUrls = [...fileUrls, ...response.data.fileUrls];
      console.log(updatedFileUrls);
      setFileUrls(updatedFileUrls);

      // // Reset the newFiles state
      setNewFiles([]);
      document.getElementById("fileInput").value = "";

      // Handle success, update UI as needed
    } catch (error) {
      console.error("Error uploading files:", error);
      // Handle error
    }
  };

  const subTasksChangeHandler = (i, e) => {
    let subTasksValues = [...subTasks];
    subTasksValues[i][e.target.name] = e.target.value;
    setSubTasks(subTasksValues);
    let empty = subTasksValues.find((el) => el.task === "");

    if (empty) {
      setEmptyInputs(false);
    } else {
      setEmptyInputs(true);
    }
  };

  const addSubTask = () => {
    setSubTasks([...subTasks, { _id: uuid(), task: "", checked: false }]);
  };

  const deleteSubTask = (i) => {
    let filteredSubTasks = [...subTasks];
    filteredSubTasks.splice(i, 1);
    setSubTasks(filteredSubTasks);
  };
  const colorOptions = ["#FF5733", "#33FF57", "#5733FF", "#FF5733", "#33FF57"]; // Add your desired colors

  return (
    <div className="new-task-wrapper">
      <div className="new-task-modal">
        <ul className="add_task">
          <h3 className="new-task-title">Add New Task</h3>
          <div className="container">
            <div className="col1">
              <div className="task-title-div">
                <label>Title</label>
                <input
                  onChange={titleChangeHandler}
                  type="text"
                  maxLength={60}
                  name="title"
                  value={title}
                  className={`${!title && error && "error-border"} title`}
                  placeholder="e.g. Web Design"
                />
                {!title && error && (
                  <div className="title-error">Can't be empty</div>
                )}
              </div>
              <div className="description-div">
                <label>Description</label>
                <textarea
                  onChange={descriptionChangeHandler}
                  className="description"
                  value={description}
                  name="description"
                  rows="5"
                  placeholder="e.g. It's always good to take a break. This 15 minute break will
recharge the batteries a little. (OPTIONAL)"
                ></textarea>
              </div>
              <div className="subtasks-div">
                <label>Subtasks</label>
                <div className="subtask-list">
                  {subTasks.map((item, index) => (
                    <div className="subtasks-item-div" key={index}>
                      <input
                        onChange={(e) => subTasksChangeHandler(index, e)}
                        className={`${
                          !item.task && error && "error-border"
                        } subtasks-input`}
                        type="text"
                        name="task"
                        value={item.task}
                        placeholder="e.g. Take Coffee Break"
                      />
                      <svg
                        onClick={() => deleteSubTask(index)}
                        width="15"
                        height="15"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g fill="#828FA3" fillRule="evenodd">
                          <path d="m12.728 0 2.122 2.122L2.122 14.85 0 12.728z" />
                          <path d="M0 2.122 2.122 0 14.85 12.728l-2.122 2.122z" />
                        </g>
                      </svg>
                      {!item.task && error && (
                        <div className="subtask-error">Can't be empty</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <Button
                onClick={() => addSubTask()}
                text={"+ Add New Subtask"}
                className={"add-column-subtask"}
              />
            </div>
            <div className="col2">
              {/* New Fields */}
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

              <div className="label-div">
                <label>Label</label>
                <input
                  onChange={(e) => setLabel(e.target.value)}
                  type="text"
                  value={label}
                  name="label"
                  className="label"
                  placeholder="e.g. Important"
                />
              </div>

              <div className="color-div">
                <label>Color</label>
                <div className="color-options">
                  {colorOptions.map((option, index) => (
                    <div
                      key={index}
                      className={`color-option${
                        color === option ? " selected" : ""
                      }`}
                      style={{ backgroundColor: option }}
                      onClick={() => setColor(option)}
                    />
                  ))}
                </div>
                {color && (
                  <div className="selected-color">
                    <label>Selected Color:</label>
                    <div
                      className="color-option selected"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                )}
              </div>

              <div className="image-upload-div">
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

              <div className="resources-div">
                <label>Resources</label>
                <input
                  type="file"
                  onChange={handleFilesChange}
                  multiple
                  id="fileInput"
                />
                {fileUrls.length > 0 && (
                  <div className="Uploaded">
                    <label>Uploaded Files:</label>
                    <ul>
                      {fileUrls.map((fileUrl, index) => (
                        <li key={index}>
                          <a
                            className="file-link"
                            href={`http://localhost:5000/api/uploads/${fileUrl.name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {fileUrl.name}{" "}
                          </a>

                          <button
                            onClick={() => deleteFile(fileUrl.name, index)}
                          >
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

              <div className="members-div">
                <label>Member List</label>
                <input
                  onChange={(e) => setMembers(e.target.value)}
                  type="text"
                  value={members}
                  name="members"
                  className="members"
                  placeholder="Add member's email"
                />
              </div>
            </div>
          </div>
          <Button
            onClick={() => {
              if (emptyInputs && title) {
                setError(false);
                dispatch(
                  createTask({
                    activeBoard: activeBoard._id,
                    fileUrls,
                    title,
                    image: uploadedimage,
                    description,
                    status,
                    subTasks,
                    count: 0,
                    deadline,
                    startDate,
                    label,
                    color,
                  })
                )
                  .then(({payload}) => {
                    // The createTask action was successful
                    // Now dispatch the addTask action with the created task data
                    dispatch(
                      addTask({
                        _id: payload.createdTask._id,
                        resources: fileUrls,
                        name: title,
                        image: uploadedimage,
                        description,
                        status,
                        subtasks: subTasks,
                        count: 0,
                        deadline,
                        startDate,
                        label,
                        color,
                        assignedList: members,
                        owner: payload.createdTask.owner,
                      })
                    );


                    // Optionally, perform other actions or handle success here
                  })
                  .catch((error) => {
                    // Handle errors from createTask action
                    console.error("Error creating task:", error);

                    // Optionally, dispatch an action or handle errors here
                  });
                dispatch(hideModal());
              } else {
                setError(true);
              }
            }}
            text={"Create Task"}
            className={"create-save-changes"}
          />
        </ul>
      </div>
    </div>
  );
};

export default NewTaskModal;
