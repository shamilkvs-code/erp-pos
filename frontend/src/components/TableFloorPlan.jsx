import React from 'react';
import { Box, Paper, Typography, Tooltip, Badge } from '@mui/material';
import { styled } from '@mui/material/styles';

const TableItem = styled(Paper)(({ theme, status }) => ({
  width: 80,
  height: 80,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: '2px solid',
  borderColor: 
    status === 'AVAILABLE' ? theme.palette.success.main :
    status === 'OCCUPIED' ? theme.palette.error.main :
    status === 'RESERVED' ? theme.palette.warning.main :
    theme.palette.info.main,
  backgroundColor: 
    status === 'AVAILABLE' ? theme.palette.success.light :
    status === 'OCCUPIED' ? theme.palette.error.light :
    status === 'RESERVED' ? theme.palette.warning.light :
    theme.palette.info.light,
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[6],
  },
}));

const TableFloorPlan = ({ tables, onTableClick, locationFilter = 'ALL' }) => {
  // Group tables by location
  const tablesByLocation = tables.reduce((acc, table) => {
    const location = table.location || 'MAIN';
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(table);
    return acc;
  }, {});

  // Filter locations based on the locationFilter
  const locationsToShow = locationFilter === 'ALL' 
    ? Object.keys(tablesByLocation) 
    : [locationFilter];

  return (
    <Box sx={{ mt: 3 }}>
      {locationsToShow.map(location => (
        <Box key={location} sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {getLocationLabel(location)} Area
          </Typography>
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2,
              p: 2,
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 1,
              backgroundColor: 'background.paper'
            }}
          >
            {tablesByLocation[location]?.map(table => (
              <Tooltip 
                key={table.id} 
                title={`Table ${table.tableNumber} - ${table.status} - Capacity: ${table.capacity}`}
                arrow
              >
                <Badge
                  badgeContent={table.currentOrder ? '🍽️' : 0}
                  color="primary"
                  overlap="circular"
                  sx={{ '& .MuiBadge-badge': { fontSize: '0.8rem' } }}
                >
                  <TableItem 
                    status={table.status}
                    onClick={() => onTableClick(table)}
                  >
                    <Typography variant="h6" component="div">
                      {table.tableNumber}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {table.capacity} seats
                    </Typography>
                  </TableItem>
                </Badge>
              </Tooltip>
            ))}
            {!tablesByLocation[location]?.length && (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                No tables in this area
              </Typography>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

// Helper function to get a readable location label
const getLocationLabel = (location) => {
  switch (location) {
    case 'MAIN':
      return 'Main';
    case 'OUTDOOR':
      return 'Outdoor';
    case 'PRIVATE':
      return 'Private Room';
    case 'BAR':
      return 'Bar';
    default:
      return location;
  }
};

export default TableFloorPlan;
