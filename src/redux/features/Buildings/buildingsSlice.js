import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import buildingsService from './buildingsService';

const initialState = {
    buildings: [],
    selectedBuilding: null,
    buildingConfig: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

// Fetch all buildings
export const getBuildings = createAsyncThunk(
    'buildings/getAll',
    async (_, thunkAPI) => {
        try {
            return await buildingsService.getBuildings();
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

// Select a building
export const selectBuilding = createAsyncThunk(
    'buildings/select',
    async (id, thunkAPI) => {
        try {
            return await buildingsService.getBuildingById(id);
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

// Get building configuration
export const getBuildingConfig = createAsyncThunk(
    'buildings/getConfig',
    async (id, thunkAPI) => {
        try {
            return await buildingsService.getBuildingConfig(id);
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

// Save building configuration
export const saveBuildingConfig = createAsyncThunk(
    'buildings/saveConfig',
    async (configData, thunkAPI) => {
        try {
            return await buildingsService.saveBuildingConfig(configData);
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

export const buildingsSlice = createSlice({
    name: 'buildings',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        clearSelectedBuilding: (state) => {
            state.selectedBuilding = null;
        },
        updateBuildingConfig: (state, action) => {
            if (state.buildingConfig) {
                // Update the buildings array within the config
                state.buildingConfig = {
                    ...state.buildingConfig,
                    buildings: action.payload,
                };
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getBuildings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getBuildings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.buildings = action.payload;
            })
            .addCase(getBuildings.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(selectBuilding.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(selectBuilding.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.selectedBuilding = action.payload;
            })
            .addCase(selectBuilding.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getBuildingConfig.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getBuildingConfig.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.buildingConfig = action.payload?.data || null;
            })
            .addCase(getBuildingConfig.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(saveBuildingConfig.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(saveBuildingConfig.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.buildingConfig = action.payload?.data || state.buildingConfig;
            })
            .addCase(saveBuildingConfig.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset, clearSelectedBuilding, updateBuildingConfig } = buildingsSlice.actions;
export default buildingsSlice.reducer;