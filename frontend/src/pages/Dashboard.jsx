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

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalRevenue: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch dashboard data from the API
        const statsData = await getDashboardStats();
        setStats(statsData);

        // Fetch recent orders from the API
        const ordersData = await getRecentOrders();
        setRecentOrders(ordersData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');

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
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
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
                    <React.Fragment key={order.id}>
                      <ListItem>
                        <ListItemText
                          primary={`Order #${order.orderNumber || order.id} - ${order.customer?.name || order.customer}`}
                          secondary={`Date: ${order.orderDate || order.date} | Status: ${order.status}`}
                        />
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          ${(order.totalAmount || order.amount).toFixed(2)}
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
