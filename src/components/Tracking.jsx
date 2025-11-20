import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Button, Grid, TextField, Select, MenuItem, Typography, Container } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { fetchRequests } from './api'; // Ensure this API module exists
import './styles.scss'; // Updated import to a valid style path

const TrackingPanel = () => {
    const [requests, setRequests] = useState([]);
    const [searchFilter, setSearchFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [dateFromFilter, setDateFromFilter] = useState(null);
    const [dateToFilter, setDateToFilter] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [requestCount, setRequestCount] = useState(0);
    const [error, setError] = useState(null); // Added error state

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchRequests(); // Fetching the requests data
                setRequests(data.requests);
                setRequestCount(data.total);
                setTotalPages(Math.ceil(data.total / 10)); // Assuming 10 items per page
            } catch (err) {
                setError('Failed to load data.'); // Error handling
            }
        };
        loadData();
    }, []);

    const handleDashboardClick = () => {
        // Navigate to dashboard
    };

    const handleNewRequestClick = () => {
        // Navigate to new request form
    };

    const handleSearchClick = () => {
        // Implement search logic
    };

    const handleClearFiltersClick = () => {
        setSearchFilter('');
        setStatusFilter('');
        setPriorityFilter('');
        setDateFromFilter(null);
        setDateToFilter(null);
    };

    const handleNextPageClick = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const handlePreviousPageClick = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const columns = [
        { field: 'id', headerName: 'Request ID', width: 150 },
        { field: 'compoundName', headerName: 'Compound Name', flex: 1 },
        { 
            field: 'priorityLevel', 
            headerName: 'Priority', 
            width: 130, 
            renderCell: (params) => (
                <span className={`priority-badge priority-${params.value}`}>{params.value}</span>
            )
        },
        { 
            field: 'status', 
            headerName: 'Status', 
            width: 150, 
            renderCell: (params) => (
                <span className={`status-badge status-${params.value.toLowerCase().replace('_', '-')}`}>
                    {params.row.statusDisplay}
                </span>
            )
        },
        { 
            field: 'progressPercentage', 
            headerName: 'Progress', 
            width: 150, 
            renderCell: (params) => (
                <div className="progress-container">
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${params.value}%` }}></div>
                    </div>
                    <small>{params.value}%</small>
                </div>
            ) 
        },
        { 
            field: 'requestDate', 
            headerName: 'Submitted', 
            width: 150, 
            renderCell: (params) => new Date(params.value).toLocaleDateString()
        },
        { 
            field: 'timelineRequired', 
            headerName: 'Timeline', 
            width: 150, 
            renderCell: (params) => new Date(params.value).toLocaleDateString()
        },
    ];

    return (
        <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto' }}>
            {error && <Typography color="error">{error}</Typography>} {/* Display error message */}
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">
                        <i className="fas fa-search"></i> Track Requests
                    </Typography>
                    <Button onClick={handleDashboardClick} startIcon={<i className="x-fa fa-tachometer-alt" />}>
                        Dashboard
                    </Button>
                    <Button onClick={handleNewRequestClick} startIcon={<i className="x-fa fa-plus" />}>
                        Request Form
                    </Button>
                </Toolbar>
            </AppBar>
            <Container sx={{ marginTop: 2 }}>
                <Box display="flex" mb={2}>
                    <TextField
                        fullWidth
                        placeholder="Search by Request ID, Compound Name, or Status..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                    />
                    <Button onClick={handleSearchClick} variant="contained" sx={{ marginLeft: 1 }}>
                        <i className="fas fa-search"></i> Search
                    </Button>
                </Box>
                <Box display="flex" mb={2}>
                    <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} displayEmpty>
                        <MenuItem value=""><em>All Statuses</em></MenuItem>
                        <MenuItem value="submitted">Submitted</MenuItem>
                        <MenuItem value="pre-screening">Pre-screening</MenuItem>
                        <MenuItem value="supervisor-review">Supervisor Review</MenuItem>
                        <MenuItem value="approved">Approved</MenuItem>
                        <MenuItem value="assigned">Assigned</MenuItem>
                        <MenuItem value="in-synthesis">In Synthesis</MenuItem>
                        <MenuItem value="quality-check">Quality Check</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                    <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} displayEmpty sx={{ marginLeft: 1 }}>
                        <MenuItem value=""><em>All Priorities</em></MenuItem>
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                    </Select>
                    <TextField
                        type="date"
                        value={dateFromFilter}
                        onChange={(e) => setDateFromFilter(e.target.value)}
                        placeholder="From Date"
                        sx={{ marginLeft: 1 }}
                    />
                    <TextField
                        type="date"
                        value={dateToFilter}
                        onChange={(e) => setDateToFilter(e.target.value)}
                        placeholder="To Date"
                        sx={{ marginLeft: 1 }}
                    />
                    <Button onClick={handleClearFiltersClick} sx={{ marginLeft: 1 }}>
                        <i className="fas fa-times"></i> Clear
                    </Button>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="h5">Your Requests</Typography>
                    <Typography variant="body1">{requestCount} requests found</Typography>
                </Box>
                <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={requests}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        pagination
                        paginationMode="server"
                        onPageChange={(newPage) => setCurrentPage(newPage)}
                    />
                </Box>
            </Container>
            <AppBar position="fixed" color="default" sx={{ top: 'auto', bottom: 0 }}>
                <Toolbar>
                    <Button onClick={handlePreviousPageClick} disabled={currentPage === 1}>
                        <i className="fas fa-chevron-left"></i> Previous
                    </Button>
                    <Typography variant="body1" sx={{ marginX: 2 }}>
                        Page {currentPage} of {totalPages}
                    </Typography>
                    <Button onClick={handleNextPageClick} disabled={currentPage === totalPages}>
                        Next <i className="fas fa-chevron-right"></i>
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default TrackingPanel;