import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import propertiesService from './propertiesService';

const initialState = {
    properties: [],
    selectedProperty: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

// Fetch all properties
export const getProperties = createAsyncThunk(
    'properties/getAll',
    async (_, thunkAPI) => {
        try {
            return await propertiesService.getProperties();
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

// Select a property
export const selectProperty = createAsyncThunk(
    'properties/select',
    async (id, thunkAPI) => {
        try {
            return await propertiesService.getPropertyById(id);
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

export const propertiesSlice = createSlice({
    name: 'properties',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        clearSelectedProperty: (state) => {
            state.selectedProperty = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProperties.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProperties.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.properties = action.payload;
            })
            .addCase(getProperties.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(selectProperty.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(selectProperty.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.selectedProperty = action.payload;
            })
            .addCase(selectProperty.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset, clearSelectedProperty } = propertiesSlice.actions;
export default propertiesSlice.reducer;