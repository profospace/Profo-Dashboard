import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import leadsService from './leadsService';

const initialState = {
    leads: [],
    selectedLead: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

// Fetch all leads
export const getLeads = createAsyncThunk(
    'leads/getAll',
    async (_, thunkAPI) => {
        try {
            return await leadsService.getLeads();
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

// Get lead by ID
export const getLeadById = createAsyncThunk(
    'leads/getById',
    async (id, thunkAPI) => {
        try {
            return await leadsService.getLeadById(id);
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

// Update lead status
export const updateLeadStatus = createAsyncThunk(
    'leads/updateStatus',
    async ({ id, status }, thunkAPI) => {
        try {
            return await leadsService.updateLeadStatus(id, status);
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

export const leadsSlice = createSlice({
    name: 'leads',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        clearSelectedLead: (state) => {
            state.selectedLead = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getLeads.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getLeads.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.leads = action.payload;
            })
            .addCase(getLeads.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getLeadById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getLeadById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.selectedLead = action.payload;
            })
            .addCase(getLeadById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateLeadStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateLeadStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.leads = state.leads.map(lead =>
                    lead._id === action.payload._id ? action.payload : lead
                );
                if (state.selectedLead && state.selectedLead._id === action.payload._id) {
                    state.selectedLead = action.payload;
                }
            })
            .addCase(updateLeadStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset, clearSelectedLead } = leadsSlice.actions;
export default leadsSlice.reducer;