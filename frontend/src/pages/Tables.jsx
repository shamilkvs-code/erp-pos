import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Restaurant as RestaurantIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  LocalDining as DiningIcon,
  ViewModule as GridViewIcon,
  Map as MapViewIcon
} from '@mui/icons-material';
import {
  getAllTables,
  createTable,
  updateTable,
  deleteTable,
  changeTableStatus,
  clearTable,
  createOrderForTable
} from '../services/api';
import TableFloorPlan from '../components/TableFloorPlan';

const Tables = () => {
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentTable, setCurrentTable] = useState({
    tableNumber: '',
    capacity: 4,
    status: 'AVAILABLE',
    location: 'MAIN'
  });
  const [currentOrder, setCurrentOrder] = useState({
    orderType: 'DINE_IN',
    numberOfGuests: 1,
    specialInstructions: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'floor'

  useEffect(() => {
    fetchTables();
  }, [statusFilter, locationFilter]);

  const fetchTables = async () => {
    setLoading(true);
    try {
      // Fetch tables from the API
      let data = await getAllTables();

      // Apply status filter
      if (statusFilter !== 'ALL') {
        data = data.filter(table => table.status === statusFilter);
      }

      // Apply location filter (only for grid view, floor plan handles this internally)
      if (locationFilter !== 'ALL' && viewMode === 'grid') {
        data = data.filter(table => table.location === locationFilter);
      }

      setTables(data);
    } catch (error) {
      console.error('Error fetching tables:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load tables: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
      setTables([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (table = null) => {
    if (table) {
      setCurrentTable({ ...table });
    } else {
      setCurrentTable({
        tableNumber: '',
        capacity: 4,
        status: 'AVAILABLE',
        location: 'MAIN'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenOrderDialog = (table) => {
    setCurrentTable(table);
    setCurrentOrder({
      orderType: 'DINE_IN',
      numberOfGuests: 1,
      specialInstructions: ''
    });
    setOpenOrderDialog(true);
  };

  const handleCloseOrderDialog = () => {
    setOpenOrderDialog(false);
  };

  const handleOpenDeleteDialog = (table) => {
    setCurrentTable(table);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTable({
      ...currentTable,
      [name]: name === 'capacity' ? parseInt(value, 10) : value
    });
  };

  const handleOrderInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentOrder({
      ...currentOrder,
      [name]: name === 'numberOfGuests' ? parseInt(value, 10) : value
    });
  };

  const handleSaveTable = async () => {
    try {
      if (currentTable.id) {
        // Update existing table
        await updateTable(currentTable.id, currentTable);
        setSnackbar({
          open: true,
          message: 'Table updated successfully',
          severity: 'success'
        });
      } else {
        // Create new table
        await createTable(currentTable);
        setSnackbar({
          open: true,
          message: 'Table created successfully',
          severity: 'success'
        });
      }
      handleCloseDialog();
      fetchTables();
    } catch (error) {
      console.error('Error saving table:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save table: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
    }
  };

  const handleCreateOrder = async () => {
    try {
      // The API service will handle adding the required fields
      await createOrderForTable(currentTable.id, currentOrder);
      setSnackbar({
        open: true,
        message: 'Order created successfully',
        severity: 'success'
      });
      handleCloseOrderDialog();
      fetchTables();
    } catch (error) {
      console.error('Error creating order:', error);
      setSnackbar({
        open: true,
        message: 'Failed to create order: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
    }
  };

  const handleDeleteTable = async () => {
    try {
      await deleteTable(currentTable.id);
      setSnackbar({
        open: true,
        message: 'Table deleted successfully',
        severity: 'success'
      });
      handleCloseDeleteDialog();
      fetchTables();
    } catch (error) {
      console.error('Error deleting table:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete table: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
    }
  };

  const handleChangeStatus = async (tableId, status) => {
    try {
      await changeTableStatus(tableId, status);
      setSnackbar({
        open: true,
        message: `Table status changed to ${status}`,
        severity: 'success'
      });
      fetchTables();
    } catch (error) {
      console.error('Error changing table status:', error);
      setSnackbar({
        open: true,
        message: 'Failed to change table status: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
    }
  };

  const handleClearTable = async (tableId) => {
    try {
      await clearTable(tableId);
      setSnackbar({
        open: true,
        message: 'Table cleared successfully',
        severity: 'success'
      });
      fetchTables();
    } catch (error) {
      console.error('Error clearing table:', error);
      setSnackbar({
        open: true,
        message: 'Failed to clear table: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    // The useEffect will trigger a refetch
  };

  const handleLocationFilterChange = (event) => {
    setLocationFilter(event.target.value);
    // The useEffect will trigger a refetch
  };

  const handleViewModeChange = (event, newValue) => {
    if (newValue !== null) {
      setViewMode(newValue);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'success';
      case 'OCCUPIED':
        return 'error';
      case 'RESERVED':
        return 'warning';
      case 'CLEANING':
        return 'info';
      default:
        return 'default';
    }
  };

  const getLocationLabel = (location) => {
    switch (location) {
      case 'MAIN':
        return 'Main Area';
      case 'OUTDOOR':
        return 'Outdoor';
      case 'PRIVATE':
        return 'Private Room';
      case 'BAR':
        return 'Bar Area';
      default:
        return location;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Tables
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Table
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={statusFilter}
                label="Status"
                onChange={handleStatusFilterChange}
                size="small"
              >
                <MenuItem value="ALL">All Statuses</MenuItem>
                <MenuItem value="AVAILABLE">Available</MenuItem>
                <MenuItem value="OCCUPIED">Occupied</MenuItem>
                <MenuItem value="RESERVED">Reserved</MenuItem>
                <MenuItem value="CLEANING">Cleaning</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="location-filter-label">Location</InputLabel>
              <Select
                labelId="location-filter-label"
                id="location-filter"
                value={locationFilter}
                label="Location"
                onChange={handleLocationFilterChange}
                size="small"
              >
                <MenuItem value="ALL">All Locations</MenuItem>
                <MenuItem value="MAIN">Main Area</MenuItem>
                <MenuItem value="OUTDOOR">Outdoor</MenuItem>
                <MenuItem value="PRIVATE">Private Room</MenuItem>
                <MenuItem value="BAR">Bar Area</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ ml: 'auto' }}>
              <Tabs
                value={viewMode}
                onChange={handleViewModeChange}
                aria-label="view mode tabs"
              >
                <Tab
                  icon={<GridViewIcon />}
                  label="Grid"
                  value="grid"
                  aria-label="grid view"
                />
                <Tab
                  icon={<MapViewIcon />}
                  label="Floor Plan"
                  value="floor"
                  aria-label="floor plan view"
                />
              </Tabs>
            </Box>
          </Box>
        </Paper>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : tables.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">No tables found</Typography>
          <Typography variant="body2" color="text.secondary">
            Add a new table to get started or adjust your filters
          </Typography>
        </Paper>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === 'grid' && (
            <Grid container spacing={3}>
              {tables.map((table) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={table.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderTop: `4px solid ${table.status === 'AVAILABLE' ? '#4caf50' :
                                            table.status === 'OCCUPIED' ? '#f44336' :
                                            table.status === 'RESERVED' ? '#ff9800' : '#2196f3'}`,
                      cursor: table.status === 'OCCUPIED' ? 'pointer' : 'default'
                    }}
                    onClick={() => {
                      if (table.status === 'OCCUPIED') {
                        // Use React Router's navigate for navigation
                        navigate(`/dashboard/tables/${table.id}/order`);
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h5" component="h2">
                          Table {table.tableNumber}
                        </Typography>
                        <Chip
                          label={table.status}
                          color={getStatusColor(table.status)}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Capacity:</strong> {table.capacity} people
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Location:</strong> {getLocationLabel(table.location)}
                      </Typography>
                      {table.currentOrder && (
                        <Box sx={{ mt: 2, p: 1, bgcolor: 'rgba(0, 0, 0, 0.04)', borderRadius: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Current Order:</strong> #{table.currentOrder.orderNumber}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Guests:</strong> {table.currentOrder.numberOfGuests}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                    <CardActions>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Box>
                          <Tooltip title="Edit Table">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(table)}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Table">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDeleteDialog(table)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Box>
                          {table.status === 'AVAILABLE' && (
                            <Tooltip title="Create Order">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenOrderDialog(table)}
                                color="success"
                              >
                                <DiningIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          {table.status === 'OCCUPIED' && (
                            <Tooltip title="Clear Table">
                              <IconButton
                                size="small"
                                onClick={() => handleClearTable(table.id)}
                                color="warning"
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          {table.status !== 'CLEANING' && (
                            <Tooltip title="Set to Cleaning">
                              <IconButton
                                size="small"
                                onClick={() => handleChangeStatus(table.id, 'CLEANING')}
                                color="info"
                              >
                                <RestaurantIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          {table.status === 'CLEANING' && (
                            <Tooltip title="Set to Available">
                              <IconButton
                                size="small"
                                onClick={() => handleChangeStatus(table.id, 'AVAILABLE')}
                                color="success"
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Floor Plan View */}
          {viewMode === 'floor' && (
            <TableFloorPlan
              tables={tables}
              onTableClick={(table) => {
                if (table.status === 'AVAILABLE') {
                  handleOpenOrderDialog(table);
                } else if (table.status === 'OCCUPIED') {
                  // Use React Router's navigate for navigation
                  navigate(`/dashboard/tables/${table.id}/order`);
                } else {
                  handleOpenDialog(table);
                }
              }}
              locationFilter={locationFilter}
            />
          )}
        </>
      )}

      {/* Table Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{currentTable.id ? 'Edit Table' : 'Add New Table'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="tableNumber"
            label="Table Number"
            type="text"
            fullWidth
            variant="outlined"
            value={currentTable.tableNumber}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="capacity"
            label="Capacity"
            type="number"
            fullWidth
            variant="outlined"
            value={currentTable.capacity}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            InputProps={{ inputProps: { min: 1 } }}
          />
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={currentTable.status}
              label="Status"
              onChange={handleInputChange}
            >
              <MenuItem value="AVAILABLE">Available</MenuItem>
              <MenuItem value="OCCUPIED">Occupied</MenuItem>
              <MenuItem value="RESERVED">Reserved</MenuItem>
              <MenuItem value="CLEANING">Cleaning</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel id="location-label">Location</InputLabel>
            <Select
              labelId="location-label"
              name="location"
              value={currentTable.location}
              label="Location"
              onChange={handleInputChange}
            >
              <MenuItem value="MAIN">Main Area</MenuItem>
              <MenuItem value="OUTDOOR">Outdoor</MenuItem>
              <MenuItem value="PRIVATE">Private Room</MenuItem>
              <MenuItem value="BAR">Bar Area</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveTable} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Create Order Dialog */}
      <Dialog open={openOrderDialog} onClose={handleCloseOrderDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create Order for Table {currentTable.tableNumber}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel id="order-type-label">Order Type</InputLabel>
            <Select
              labelId="order-type-label"
              name="orderType"
              value={currentOrder.orderType}
              label="Order Type"
              onChange={handleOrderInputChange}
            >
              <MenuItem value="DINE_IN">Dine In</MenuItem>
              <MenuItem value="TAKEOUT">Takeout</MenuItem>
              <MenuItem value="DELIVERY">Delivery</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="numberOfGuests"
            label="Number of Guests"
            type="number"
            fullWidth
            variant="outlined"
            value={currentOrder.numberOfGuests}
            onChange={handleOrderInputChange}
            sx={{ mb: 2 }}
            InputProps={{ inputProps: { min: 1 } }}
          />
          <TextField
            margin="dense"
            name="specialInstructions"
            label="Special Instructions"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            value={currentOrder.specialInstructions}
            onChange={handleOrderInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOrderDialog}>Cancel</Button>
          <Button onClick={handleCreateOrder} variant="contained">Create Order</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Table</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete Table {currentTable.tableNumber}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteTable} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Tables;
