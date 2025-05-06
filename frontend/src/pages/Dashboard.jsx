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
  Divider
} from '@mui/material';
import { 
  ShoppingCart as OrderIcon, 
  People as CustomerIcon, 
  Inventory as ProductIcon, 
  AttachMoney as RevenueIcon 
} from '@mui/icons-material';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalRevenue: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);

  // Simulated data - in a real app, this would come from API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalOrders: 156,
        totalCustomers: 84,
        totalProducts: 215,
        totalRevenue: 24680
      });

      setRecentOrders([
        { id: 1, customer: 'John Doe', amount: 125.50, date: '2023-05-15', status: 'COMPLETED' },
        { id: 2, customer: 'Jane Smith', amount: 89.99, date: '2023-05-14', status: 'COMPLETED' },
        { id: 3, customer: 'Bob Johnson', amount: 210.75, date: '2023-05-14', status: 'PENDING' },
        { id: 4, customer: 'Alice Brown', amount: 45.25, date: '2023-05-13', status: 'COMPLETED' },
        { id: 5, customer: 'Charlie Wilson', amount: 320.00, date: '2023-05-12', status: 'CANCELLED' }
      ]);
    }, 1000);
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
            <List>
              {recentOrders.map((order, index) => (
                <React.Fragment key={order.id}>
                  <ListItem>
                    <ListItemText
                      primary={`Order #${order.id} - ${order.customer}`}
                      secondary={`Date: ${order.date} | Status: ${order.status}`}
                    />
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      ${order.amount.toFixed(2)}
                    </Typography>
                  </ListItem>
                  {index < recentOrders.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
