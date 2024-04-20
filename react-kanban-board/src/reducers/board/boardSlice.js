import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axiosConfig"; // Import your configured Axios instance

export const addBoard = createAsyncThunk(
  "board/createBoard",
  async (boardData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/board/createBoard", boardData);

      // // Return the data received from the API
      return response.data;
    } catch (error) {
      console.error("Error creating board:", error);

      // You can return a rejected action with a custom error message or data
      return rejectWithValue("Error creating board");
    }
  }
);

export const fetchBoards = createAsyncThunk(
  "board/fetchBoards",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/board/boards/${email}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching boards:", error);
      return rejectWithValue("Error fetching boards");
    }
  }
);

export const addNewColumn = createAsyncThunk(
  "board/newColumn",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/board/add_column/`, data);

      return response.data;
    } catch (error) {
      console.error("Error fetching boards:", error);
      return rejectWithValue("Error fetching boards");
    }
  }
);

export const createTask = createAsyncThunk(
  "board/createTask",
  async (taskData) => {
    try {
      const response = await axios.post("/board/tasks/createTask", taskData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);
export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ boardId, taskId, comment }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `/board/${boardId}/task/${taskId}/comment`,
        comment
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateTask = createAsyncThunk(
  "board/updateTask",
  async ({ taskId, updatedTask }, { rejectWithValue }) => {
    try {
      // Make an HTTP PUT request to update the task
      const response = await axios.put(`/board/tasks/${taskId}`, updatedTask);
      return response.data;
    } catch (error) {
      console.error("Error updating task:", error);
      return rejectWithValue(error.message || "Failed to update task");
    }
  }
);
export const updateSubtaskAsync = createAsyncThunk(
  "board/updateSubtask",
  async ({ taskId, subtaskId, checked }, { rejectWithValue }) => {
    try {
      console.log(taskId, subtaskId, checked);
      // Make an HTTP PUT request to update the subtask
      await axios.put(`/board/tasks/${taskId}/subtasks/${subtaskId}`, {
        checked,
      });

      return { taskId, subtaskId, checked };
    } catch (error) {
      console.error("Error updating subtask:", error);
      return rejectWithValue(error.message || "Failed to update subtask");
    }
  }
);
export const deleteTaskAsync = createAsyncThunk(
  "board/deleteTask",
  async (taskId, { rejectWithValue }) => {
    try {
      // Make an HTTP DELETE request to delete the task
      await axios.delete(`/board/tasks/${taskId}`);

      return taskId;
    } catch (error) {
      console.error("Error deleting task:", error);
      return rejectWithValue(error.message || "Failed to delete task");
    }
  }
);
export const moveTaskAsync = createAsyncThunk(
  "board/moveTask",
  async (
    { sourceColumnId, destinationColumnId, sourceIndex, destinationIndex },
    { rejectWithValue }
  ) => {
    try {
      // Make an HTTP PUT request to move the task
      await axios.post(`/board/tasks/move`, {
        sourceColumnId,
        destinationColumnId,
        sourceIndex,
        destinationIndex,
      });

      return {
        sourceColumnId,
        destinationColumnId,
        sourceIndex,
        destinationIndex,
      };
    } catch (error) {
      console.error("Error moving task:", error);
      return rejectWithValue(error.message || "Failed to move task");
    }
  }
);

export const deleteColumnAsync = createAsyncThunk(
  "board/deleteColumn",
  async (columnId, { rejectWithValue }) => {
    try {
      // Make an HTTP DELETE request to delete the task
      await axios.delete(`/board/columns/${columnId}`);
      return columnId;
    } catch (error) {
      console.error("Error deleting task:", error);
      return rejectWithValue(error.message || "Failed to delete task");
    }
  }
);

export const editBoardAsync = createAsyncThunk(
  "board/editBoard",
  async ({ boardId, boardName, columns }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/board/boards/${boardId}`, {
        boardName,
        columns,
      });

      // Return the updated data
      return response.data.board;
    } catch (error) {
      console.error("Error updating board:", error);
      return rejectWithValue("Error updating board");
    }
  }
);
export const deleteBoardAsync = createAsyncThunk(
  "board/deleteBoard",
  async (boardId, { rejectWithValue }) => {
    try {
      // Make the API request to delete the board
      const response = await axios.delete(`/board/boards/${boardId}`);

      // Return the data received from the API
      return response.data;
    } catch (error) {
      console.error("Error deleting board:", error);

      // You can return a rejected action with a custom error message or data
      return rejectWithValue("Error deleting board");
    }
  }
);

export const inviteMemberAsync = createAsyncThunk(
  "board/inviteMember",
  async ({ email, name, role, ownerId, boardId }) => {
    try {
      // API call to invite the member
      console.log(email, name, role);
      const response = await axios.post("/board/invite-member", {
        email,
        name,
        role,
        ownerId,
        boardId,
      });
      return response.data; // Assuming the API returns some data
    } catch (error) {
      throw error;
    }
  }
);

export const invitedBoards = createAsyncThunk(
  "board/invitedBoard",
  async ({ email }) => {
    try {
      // API call to invite the member
      const response = await axios.get(`/board/invited/${email}`);
      return response.data; // Assuming the API returns some data
    } catch (error) {
      throw error;
    }
  }
);

const boardSlice = createSlice({
  name: "board",
  initialState: {
    boards: [],
    tasks: [],
    activeBoard: null,
    activeColumn: null,
    activeTask: null,
  },
  reducers: {
    setActiveBoard: (state, { payload }) => {
      const getBoardByID = state.boards.find((el) => el._id === payload);
      state.activeBoard = getBoardByID;
    },
    setActiveTask: (state, { payload }) => {
      const getBoardByID = state.boards.find(
        (el) => el._id === state.activeBoard._id
      );
      const getColumnByID = getBoardByID.columns.find(
        (el) => el._id === payload.columnID
      );
      const getTaskID = getColumnByID.taskList.find(
        (el) => el._id === payload.taskID
      );
      state.activeColumn = getColumnByID;
      state.activeTask = getTaskID;
    },

    editBoard: (state, { payload }) => {
      const getBoardByID = state.boards.find(
        (el) => el._id === state.activeBoard.id
      );
      getBoardByID.name = payload.boardName;
      getBoardByID.columns = payload.columns;

      state.activeBoard = getBoardByID;
    },
    editTask: (state, { payload }) => {
      const getBoardByID = state.boards.find(
        (el) => el._id === state.activeBoard._id
      );
      const getColumnByID = getBoardByID.columns.find(
        (el) => el._id === state.activeColumn._id
      );
      const getTaskID = getColumnByID.taskList.find(
        (el) => el._id === state.activeTask._id
      );

      state.activeTask.subtasks = getTaskID.subtasks;
      getTaskID.name = payload.name;
      getTaskID.description = payload.description;
      getTaskID.subtasks = payload.subtasks;
      getTaskID.label = payload.label;
      getTaskID.color = payload.color;
      getTaskID.image = payload.image;
      getTaskID.deadline = payload.deadline;
      getTaskID.startDate = payload.startDate;
      getTaskID.comment = payload.comments;
      getTaskID.resources = payload.resources;
      getTaskID.assignedList = payload.assignedList;

      state.activeTask = getTaskID;
      state.activeBoard = getBoardByID;
    },

    deleteCurrentBoard: (state, { payload }) => {
      const deletedBoard = state.boards.filter(
        (item) => item._id !== state.activeBoard._id
      );

      state.boards = deletedBoard;

      state.activeBoard = state.boards[0];
    },
    addColumn: (state, { payload }) => {},
    addTask: (state, { payload }) => {
      console.log(payload);
      const getBoardByID = state.boards.find(
        (el) => el._id === state.activeBoard._id
      );
      const getColumnByID = getBoardByID.columns.find(
        (el) => el._id === payload.status
      );
      const newTask = {
        _id: payload._id,
        name: payload.name,
        description: payload.description,
        subtasks: payload.subtasks,
        deadline: payload.deadline,
        label: payload.label,
        color: payload.color,
        image: payload.image,
        comment: [],
        resources: payload.resources,
        assignedList: payload.assignedList,

        owner: payload.owner,
      };

      getColumnByID.taskList.push(newTask);
      state.activeBoard = getBoardByID;
    },
    moveTask: (state, { payload }) => {
      const { source, destination, activeBoard } = payload;

      // Find the board being moved
      const movedBoard = state.boards.find(
        (board) => board._id === activeBoard._id
      );

      // Find the source and destination columns
      const sourceColumn = movedBoard.columns.find(
        (col) => col._id === source.droppableId
      );
      const destinationColumn = movedBoard.columns.find(
        (col) => col._id === destination.droppableId
      );
      // If Moving Items are on the same column
      if (source.droppableId === destination.droppableId) {
        const newItems = [...sourceColumn.taskList];
        const [removed] = newItems.splice(source.index, 1);
        newItems.splice(destination.index, 0, removed);

        sourceColumn.taskList = newItems;
      } else {
        // If Moving Items are on different columns
        const sourceItems = [...sourceColumn.taskList];
        const destItems = [...destinationColumn.taskList];

        const [removed] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, removed);

        sourceColumn.taskList = sourceItems;
        destinationColumn.taskList = destItems;
      }

      // Update the state
      state.boards = state.boards.map((board) =>
        board._id === activeBoard._id
          ? { ...board, columns: [...board.columns] }
          : board
      );
      state.activeBoard = movedBoard;
    },

    deleteCurrentTask: (state, { payload }) => {},
    setCheckbox: (state, { payload }) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(inviteMemberAsync.fulfilled, (state, action) => {
        const getBoardByID = state.boards.find(
          (el) => el._id === state.activeBoard._id
        );

        const { name, role, email } = action.payload;
        console.log(name, role, email);
        getBoardByID.access.push({ name, role, email });
        console.log(JSON.parse(JSON.stringify(getBoardByID)));
        state.activeBoard = getBoardByID;
      })
      .addCase(invitedBoards.fulfilled, (state, action) => {
        // Handle move task loading state if needed
        const newBoards = action.payload.boards.map((invited) => invited.board);
        state.boards = state.boards.concat(newBoards);
        const tasks = action.payload.boards.map((invited) => invited.task);
        state.tasks = tasks;
        if (state.boards) state.activeBoard = state.boards[0];
      })
      .addCase(moveTaskAsync.fulfilled, (state, action) => {
        // Handle move task success if needed
      })
      .addCase(moveTaskAsync.rejected, (state, action) => {
        // Handle move task error state if needed
      })
      .addCase(deleteTaskAsync.pending, (state) => {})
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        // Remove the deleted task from the state

        let getBoardByID = state.boards.find(
          (el) => el._id === state.activeBoard._id
        );
        let getColumnByID = getBoardByID.columns.find(
          (el) => el._id === state.activeColumn._id
        );
        let filteredTask = state.activeColumn.taskList.filter(
          (el) => el._id !== state.activeTask._id
        );
        state.activeColumn.taskList = filteredTask;
        state.activeTask = null;
        getColumnByID.taskList = state.activeColumn.taskList;
        state.activeBoard = getBoardByID;
      })
      .addCase(deleteTaskAsync.rejected, (state, action) => {
        // Handle deletion error state if needed
      })
      .addCase(updateSubtaskAsync.pending, (state) => {})
      .addCase(updateSubtaskAsync.fulfilled, (state, action) => {
        let getBoardByID = state.boards.find(
          (el) => el._id === state.activeBoard._id
        );
        let getColumnByID = getBoardByID.columns.find(
          (el) => el._id === state.activeColumn._id
        );
        const getTaskID = getColumnByID.taskList.find(
          (el) => el._id === state.activeTask._id
        );
        const getSubTaskByID = getTaskID.subtasks.find(
          (el) => el._id === action.payload.subtaskId
        );

        getSubTaskByID.checked = action.payload.checked;

        state.activeTask.subtasks = getTaskID.subtasks;
        state.activeBoard = getBoardByID;
      })
      .addCase(updateSubtaskAsync.rejected, (state, action) => {})
      .addCase(updateTask.pending, (state) => {})
      .addCase(updateTask.fulfilled, (state, action) => {
        // You can update the state with the new task data if needed
        // For example, state.tasks = state.tasks.map(task => (task.id === action.payload.taskId ? action.payload.updatedTask : task));
      })
      .addCase(updateTask.rejected, (state, action) => {})
      .addCase(addBoard.fulfilled, (state, action) => {
        // Update the state based on the successful API call
        const { board } = action.payload;

        // Add the populated board to the state
        state.boards.push(board);
        state.activeBoard = board;
      })
      .addCase(addComment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.status = "succeeded";
        const getBoardByID = state.boards.find(
          (el) => el._id === state.activeBoard._id
        );
        const getColumnByID = getBoardByID.columns.find(
          (el) => el._id === state.activeColumn._id
        );
        const getTaskID = getColumnByID.taskList.find(
          (el) => el._id === state.activeTask._id
        );
        getTaskID.comment.push(action.payload.comment);

        state.activeTask = getTaskID;
        state.activeBoard = getBoardByID;
      })
      .addCase(addComment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(addBoard.rejected, (state, action) => {
        // Handle the rejected case if needed
      })
      .addCase(createTask.fulfilled, (state, action) => {
        // Handle the successful creation of the task, update your state as needed
        // For example, update the board or relevant data in your store
        // action.payload contains the response from the backend
        // console.log(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        // Handle the error
        console.error(action.error.message);
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.boards = action.payload.boards;
        if (state.boards) state.activeBoard = state.boards[0];
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        // Handle the rejected case if needed
      })
      .addCase(addNewColumn.fulfilled, (state, action) => {
        const getBoardByID = state.boards.find(
          (el) => el._id === state.activeBoard._id
        );
        getBoardByID.columns.push(action.payload.createdColumn);
        state.activeBoard = getBoardByID;
        console.log(JSON.parse(JSON.stringify(getBoardByID)));
      })
      .addCase(addNewColumn.rejected, (state, action) => {
        // Handle the rejected case if needed
      });
  },
});

export const {
  setActiveBoard,
  deleteColumn,
  deleteCurrentBoard,
  addColumn,
  editBoard,
  editTask,
  addTask,
  setActiveTask,
  moveTask,
  moveColumn,
  deleteCurrentTask,
  setCheckbox,
} = boardSlice.actions;

export default boardSlice.reducer;
