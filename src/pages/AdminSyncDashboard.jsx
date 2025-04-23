// src/pages/admin/AdminSyncDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    Grid,
    TextField,
    Typography,
    Alert,
    Paper,
    Divider,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Collapse
} from '@mui/material';
import { FilterList, ExpandMore, ExpandLess, Refresh } from '@mui/icons-material';
import { base_url } from '../../utils/base_url';
import { getAuthConfig } from '../../utils/authConfig';

const AdminSyncDashboard = () => {
    const [collections, setCollections] = useState([]);
    const [selectedCollections, setSelectedCollections] = useState([]);
    const [localMongoUri, setLocalMongoUri] = useState('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.2');
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [syncId, setSyncId] = useState(null);
    const [syncStatus, setSyncStatus] = useState(null);
    const [showFilters, setShowFilters] = useState({});
    const [filters, setFilters] = useState({});
    const [recentOperations, setRecentOperations] = useState([]);

    // Fetch collections on component mount
    useEffect(() => {
        fetchCollections();
        fetchRecentOperations();
    }, []);

    // Fetch sync status if syncId exists
    useEffect(() => {
        if (syncId) {
            const interval = setInterval(() => {
                checkSyncStatus(syncId);
            }, 2000);

            return () => clearInterval(interval);
        }
    }, [syncId]);

    const fetchCollections = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${base_url}/api/sync/collections` , getAuthConfig());
            setCollections(response.data.collections);
        } catch (err) {
            setError(`Failed to fetch collections: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecentOperations = async () => {
        try {
            const response = await axios.get(`${base_url}/api/sync/operations`, getAuthConfig());
            setRecentOperations(response.data.operations);
        } catch (err) {
            console.error('Failed to fetch recent operations:', err);
        }
    };

    const checkSyncStatus = async (id) => {
        try {
            const response = await axios.get(`${base_url}/api/sync/status/${id}`, getAuthConfig());
            console.log("response", response) 
            setSyncStatus(response.data.status);

            if (!response.data.status.inProgress) {
                setSyncing(false);
                if (response.data.status.errors?.length > 0) {
                    setError(`Sync completed with ${response.data.status.errors.length} errors.`);
                } else {
                    setSuccess('Sync completed successfully!');
                }
                fetchRecentOperations();
            }
        } catch (err) {
            console.error('Failed to check sync status:', err);
        }
    };

    const handleSelectCollection = (fullName) => {
        setSelectedCollections(prev => {
            if (prev.includes(fullName)) {
                return prev.filter(item => item !== fullName);
            } else {
                return [...prev, fullName];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedCollections.length === collections.length) {
            setSelectedCollections([]);
        } else {
            setSelectedCollections(collections.map(c => c.fullName));
        }
    };

    const toggleFilters = (collection) => {
        setShowFilters(prev => ({
            ...prev,
            [collection]: !prev[collection]
        }));

        // Initialize filters for this collection if not already set
        if (!filters[collection]) {
            setFilters(prev => ({
                ...prev,
                [collection]: { query: '{}', limit: '' }
            }));
        }
    };

    const updateFilter = (collection, field, value) => {
        setFilters(prev => ({
            ...prev,
            [collection]: {
                ...prev[collection],
                [field]: value
            }
        }));
    };

    const handleSync = async () => {
        if (!localMongoUri) {
            setError('Local MongoDB URI is required');
            return;
        }

        if (selectedCollections.length === 0) {
            setError('Please select at least one collection to sync');
            return;
        }

        setError(null);
        setSuccess(null);
        setSyncing(true);

        try {
            const response = await axios.post(`${base_url}/api/sync/execute`, {
                localMongoUri,
                selections: selectedCollections,
                filters
            } ,getAuthConfig(),);

            setSyncId(response.data.syncId);
        } catch (err) {
            setError(`Failed to start sync: ${err.response?.data?.message || err.message}`);
            setSyncing(false);
        }
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Database Sync Tool
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" paragraph>
                Securely synchronize collections from production MongoDB to a local instance for testing and development.
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>
            )}

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Local MongoDB Connection
                            </Typography>
                            <TextField
                                label="Local MongoDB URI"
                                placeholder="mongodb://localhost:27017/dbname"
                                fullWidth
                                value={localMongoUri}
                                onChange={(e) => setLocalMongoUri(e.target.value)}
                                margin="normal"
                                required
                                helperText="The local database where you want to import production data"
                            />

                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSync}
                                    disabled={syncing || selectedCollections.length === 0 || !localMongoUri}
                                >
                                    {syncing ? 'Syncing...' : 'Start Sync'}
                                </Button>

                                {syncing && (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CircularProgress size={24} sx={{ mr: 1 }} />
                                        <Typography variant="body2">
                                            Syncing {syncStatus?.completed || 0} of {syncStatus?.total || selectedCollections.length}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </CardContent>
                    </Card>

                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">
                                Available Collections
                            </Typography>
                            <Box>
                                <Button
                                    startIcon={<Refresh />}
                                    onClick={fetchCollections}
                                    disabled={loading}
                                    size="small"
                                >
                                    Refresh
                                </Button>
                                <Button
                                    onClick={handleSelectAll}
                                    size="small"
                                    sx={{ ml: 1 }}
                                >
                                    {selectedCollections?.length === collections?.length ? 'Deselect All' : 'Select All'}
                                </Button>
                            </Box>
                        </Box>

                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <List>
                                {collections?.map((collection) => (
                                    <React.Fragment key={collection.fullName}>
                                        <ListItem
                                            secondaryAction={
                                                <IconButton edge="end" onClick={() => toggleFilters(collection.fullName)}>
                                                    <FilterList />
                                                </IconButton>
                                            }
                                        >
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={selectedCollections.includes(collection.fullName)}
                                                        onChange={() => handleSelectCollection(collection.fullName)}
                                                    />
                                                }
                                                label={
                                                    <Box>
                                                        <Typography variant="body1">{collection.collection}</Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {collection.database}
                                                        </Typography>
                                                    </Box>
                                                }
                                                sx={{ width: '100%' }}
                                            />
                                        </ListItem>

                                        <Collapse in={showFilters[collection.fullName]} timeout="auto" unmountOnExit>
                                            <Box sx={{ pl: 4, pr: 2, pb: 2 }}>
                                                <TextField
                                                    label="Query Filter (JSON)"
                                                    size="small"
                                                    fullWidth
                                                    margin="dense"
                                                    value={filters[collection.fullName]?.query || '{}'}
                                                    onChange={(e) => updateFilter(collection.fullName, 'query', e.target.value)}
                                                    placeholder='{"createdAt": {"$gt": "2023-01-01"}}'
                                                    helperText="MongoDB query syntax as JSON"
                                                />
                                                <TextField
                                                    label="Limit Documents"
                                                    size="small"
                                                    type="number"
                                                    margin="dense"
                                                    value={filters[collection.fullName]?.limit || ''}
                                                    onChange={(e) => updateFilter(collection.fullName, 'limit', e.target.value)}
                                                    placeholder="100"
                                                    helperText="Leave empty for no limit"
                                                />
                                            </Box>
                                        </Collapse>
                                        <Divider component="li" />
                                    </React.Fragment>
                                ))}
                            </List>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Recent Sync Operations
                            </Typography>

                            {recentOperations?.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">
                                    No recent operations
                                </Typography>
                            ) : (
                                <List dense>
                                    {recentOperations?.map(op => (
                                        <ListItem key={op.id}>
                                            <ListItemText
                                                primary={`Sync ${op.id.substring(5)}`}
                                                secondary={
                                                    <>
                                                        <Typography variant="caption" display="block">
                                                            {new Date(op.startTime).toLocaleString()}
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            color={op.hasErrors ? 'error' : 'success.main'}
                                                        >
                                                            {op.inProgress
                                                                ? `In progress: ${op.completed}/${op.total}`
                                                                : op.hasErrors
                                                                    ? 'Completed with errors'
                                                                    : 'Completed successfully'
                                                            }
                                                        </Typography>
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </CardContent>
                    </Card>

                    {syncStatus && (
                        <Card sx={{ mt: 3 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Current Sync Status
                                </Typography>

                                <Box sx={{ mt: 1 }}>
                                    <Typography variant="body2">
                                        <strong>Progress:</strong> {syncStatus.completed} / {syncStatus.total} collections
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Started:</strong> {new Date(syncStatus.startTime).toLocaleString()}
                                    </Typography>
                                    {!syncStatus.inProgress && (
                                        <Typography variant="body2">
                                            <strong>Completed:</strong> {new Date(syncStatus.endTime).toLocaleString()}
                                        </Typography>
                                    )}

                                    {syncStatus.errors.length > 0 && (
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="subtitle2" color="error">
                                                Errors:
                                            </Typography>
                                            <List dense>
                                                {syncStatus.errors.map((error, index) => (
                                                    <ListItem key={index}>
                                                        <ListItemText primary={error} />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Box>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminSyncDashboard;