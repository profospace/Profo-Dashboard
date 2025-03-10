import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import usersService from './usersService';

const initialState = {
    users: [],
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalUsers: 0,
        pageSize: 10
    },
    selectedUser: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

// Fetch paginated users
export const getPaginatedUsers = createAsyncThunk(
    'users/getPaginated',
    async ({ page, limit, filters }, thunkAPI) => {
        try {
            return await usersService.getPaginatedUsers(page, limit, filters);
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

// Get user by ID
export const getUserById = createAsyncThunk(
    'users/getById',
    async (id, thunkAPI) => {
        try {
            return await usersService.getUserById(id);
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

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        clearSelectedUser: (state) => {
            state.selectedUser = null;
        },
        setPage: (state, action) => {
            state.pagination.currentPage = action.payload;
        },
        setFilters: (state, action) => {
            state.pagination.currentPage = 1; // Reset to first page when filters change
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPaginatedUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getPaginatedUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.users = action.payload.users;
                state.pagination = {
                    ...state.pagination,
                    totalPages: action.payload.pagination.pages,
                    totalUsers: action.payload.pagination.total,
                };
            })
            .addCase(getPaginatedUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getUserById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getUserById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.selectedUser = action.payload;
            })
            .addCase(getUserById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset, clearSelectedUser, setPage, setFilters } = usersSlice.actions;
export default usersSlice.reducer;