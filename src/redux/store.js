import { configureStore } from '@reduxjs/toolkit';
import propertiesReducer from './features/Properties/propertiesSlice';
import projectsReducer from './features/Projects/projectsSlice';
import buildingsReducer from './features/Buildings/buildingsSlice';
import leadsReducer from './features/Leads/leadsSlice';
import usersReducer from './features/Users/usersSlice';

export const store = configureStore({
    reducer: {
        properties: propertiesReducer,
        projects: projectsReducer,
        buildings: buildingsReducer,
        leads: leadsReducer,
        users: usersReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});