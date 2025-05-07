import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  ShoppingCart as OrderIcon,
  People as CustomerIcon,
  Inventory as ProductIcon,
  AttachMoney as RevenueIcon
} from '@mui/icons-material';
import { getDashboardStats, getRecentOrders } from '../services/api';

// Define StatCard component outside of Dashboard component
function StatCard({ title, value, icon, color }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" component="div" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ mt: 1 }}>
              {title === 'Total Revenue' ? `$${value.toLocaleString()}` : value.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{
            backgroundColor: `${color}.light`,
            borderRadius: '50%',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalRevenue: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    // If we've already fetched data, don't fetch again
    if (dataFetched) {
      return;
    }

    // Create an AbortController to cancel requests when component unmounts
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchDashboardData() {
      setLoading(true);
      setError(null);

      try {
        // Check if user is authenticated
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          console.error('No user found in localStorage');
          setError('You must be logged in to view the dashboard.');
          setLoading(false);
          return;
        }

        // Parse user data
        let user;
        try {
          user = JSON.parse(userStr);
        } catch (e) {
          console.error('Error parsing user data:', e);
          setError('Invalid user data. Please log in again.');
          setLoading(false);
          return;
        }

        // Check if token exists
        if (!user.token) {
          console.error('No token found in user data');
          setError('Authentication token missing. Please log in again.');
          setLoading(false);
          return;
        }

        console.log('Fetching dashboard data with token:', user.token ? 'Token exists' : 'No token');

        // Fetch dashboard data from the API with the abort signal
        const statsData = await getDashboardStats(signal);
        setStats(statsData);

        // Fetch recent orders from the API with the abort signal
        const ordersData = await getRecentOrders(signal);
        setRecentOrders(ordersData);

        // Mark that we've fetched data
        setDataFetched(true);
      } catch (err) {
        // If the request was aborted, don't update state
        if (err.name === 'AbortError' || err.name === 'CanceledError') {
          console.log('Dashboard data fetch aborted');
          return;
        }

        console.error('Error fetching dashboard data:', err);

        // Check if it's an authentication error
        if (err.response && err.response.status === 401) {
          setError('Your session has expired. Please log in again.');
          // Redirect to login page after a short delay
          setTimeout(() => {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            window.location.href = '/login';
          }, 3000);
        } else {
          setError('Failed to load dashboard data. Please try again later.');
        }

        // Fallback to empty data
        setStats({
          totalOrders: 0,
          totalCustomers: 0,
          totalProducts: 0,
          totalRevenue: 0
        });
        setRecentOrders([]);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();

    // Cleanup function to abort any in-flight requests when the component unmounts
    return () => {
      controller.abort();
    };
  }, [dataFetched]);



  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {/* Stats Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              icon={<OrderIcon sx={{ color: 'primary.main', fontSize: 40 }} />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Customers"
              value={stats.totalCustomers}
              icon={<CustomerIcon sx={{ color: 'info.main', fontSize: 40 }} />}
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Products"
              value={stats.totalProducts}
              icon={<ProductIcon sx={{ color: 'success.main', fontSize: 40 }} />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Revenue"
              value={stats.totalRevenue}
              icon={<RevenueIcon sx={{ color: 'warning.main', fontSize: 40 }} />}
              color="warning"
            />
          </Grid>

          {/* Recent Orders */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" component="h2" gutterBottom>
                Recent Orders
              </Typography>
              {recentOrders.length > 0 ? (
                <List>
                  {recentOrders.map((order, index) => (
                    <React.Fragment key={order.id || index}>
                      <ListItem>
                        <ListItemText
                          primary={`Order #${order.orderNumber || order.id || 'N/A'} - ${order.customer?.name || (typeof order.customer === 'string' ? order.customer : 'Guest')}`}
                          secondary={`Date: ${order.orderDate || order.date || 'N/A'} | Status: ${order.status || 'N/A'}`}
                        />
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          ${(order.totalAmount || order.amount || 0).toFixed(2)}
                        </Typography>
                      </ListItem>
                      {index < recentOrders.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
                  No recent orders found
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;
