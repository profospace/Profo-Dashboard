import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectsService from './projectsSevice';

const initialState = {
    projects: [],
    selectedProject: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

// Fetch all projects
export const getProjects = createAsyncThunk(
    'projects/getAll',
    async (_, thunkAPI) => {
        try {
            return await projectsService.getProjects();
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();

            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Select a project
export const selectProject = createAsyncThunk(
    'projects/select',
    async (id, thunkAPI) => {
        try {
            return await projectsService.getProjectById(id);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();

            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        clearSelectedProject: (state) => {
            state.selectedProject = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProjects.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProjects.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.projects = action.payload;
            })
            .addCase(getProjects.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(selectProject.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(selectProject.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.selectedProject = action.payload;
            })
            .addCase(selectProject.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset, clearSelectedProject } = projectsSlice.actions;
export default projectsSlice.reducer;