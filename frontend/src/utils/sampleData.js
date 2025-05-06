/**
 * This file contains sample data generators for testing the UI
 * In a real application, this would be replaced with API calls
 */

// Generate sample tables
export const generateSampleTables = (count = 20) => {
  const tables = [];
  const locations = ['MAIN', 'OUTDOOR', 'PRIVATE', 'BAR'];
  const statuses = ['AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE'];
  
  for (let i = 1; i <= count; i++) {
    const locationIndex = Math.floor(Math.random() * locations.length);
    const statusIndex = Math.floor(Math.random() * statuses.length);
    const capacity = Math.floor(Math.random() * 8) + 2; // 2 to 10 people
    
    const table = {
      id: i,
      tableNumber: i.toString(),
      capacity,
      status: statuses[statusIndex],
      location: locations[locationIndex]
    };
    
    // Add a current order for occupied tables
    if (table.status === 'OCCUPIED') {
      table.currentOrder = {
        id: i * 100,
        orderNumber: `ORD-${i * 100}`,
        numberOfGuests: Math.floor(Math.random() * table.capacity) + 1,
        orderDate: new Date().toISOString()
      };
    }
    
    tables.push(table);
  }
  
  return tables;
};

// Generate sample orders
export const generateSampleOrders = (count = 15) => {
  const orders = [];
  const statuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
  const orderTypes = ['DINE_IN', 'TAKEOUT', 'DELIVERY'];
  const paymentMethods = ['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'MOBILE_PAYMENT'];
  
  for (let i = 1; i <= count; i++) {
    const statusIndex = Math.floor(Math.random() * statuses.length);
    const orderTypeIndex = Math.floor(Math.random() * orderTypes.length);
    const paymentMethodIndex = Math.floor(Math.random() * paymentMethods.length);
    const numberOfItems = Math.floor(Math.random() * 5) + 1; // 1 to 5 items
    const items = [];
    let totalAmount = 0;
    
    // Generate order items
    for (let j = 1; j <= numberOfItems; j++) {
      const unitPrice = parseFloat((Math.random() * 20 + 5).toFixed(2)); // $5 to $25
      const quantity = Math.floor(Math.random() * 3) + 1; // 1 to 3 items
      const subtotal = unitPrice * quantity;
      totalAmount += subtotal;
      
      items.push({
        id: i * 1000 + j,
        product: {
          id: j,
          name: `Product ${j}`,
          price: unitPrice
        },
        quantity,
        unitPrice,
        subtotal,
        notes: Math.random() > 0.7 ? 'Special request' : ''
      });
    }
    
    const order = {
      id: i,
      orderNumber: `ORD-${i}`,
      orderDate: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(), // Random date in the last week
      customer: {
        id: i,
        name: `Customer ${i}`
      },
      totalAmount,
      status: statuses[statusIndex],
      paymentMethod: paymentMethods[paymentMethodIndex],
      orderType: orderTypes[orderTypeIndex],
      items,
      numberOfGuests: Math.floor(Math.random() * 6) + 1, // 1 to 6 guests
      specialInstructions: Math.random() > 0.8 ? 'Please bring extra napkins' : ''
    };
    
    // Add table for dine-in orders
    if (order.orderType === 'DINE_IN') {
      order.table = {
        id: i,
        tableNumber: i.toString(),
        capacity: Math.floor(Math.random() * 8) + 2, // 2 to 10 people
        status: 'OCCUPIED',
        location: ['MAIN', 'OUTDOOR', 'PRIVATE', 'BAR'][Math.floor(Math.random() * 4)]
      };
    }
    
    orders.push(order);
  }
  
  return orders;
};

// Generate sample customers
export const generateSampleCustomers = (count = 10) => {
  const customers = [];
  
  for (let i = 1; i <= count; i++) {
    customers.push({
      id: i,
      name: `Customer ${i}`,
      email: `customer${i}@example.com`,
      phone: `555-${1000 + i}`,
      address: `${i} Main St`
    });
  }
  
  return customers;
};

// Generate sample products
export const generateSampleProducts = (count = 15) => {
  const products = [];
  const categories = ['Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Sides'];
  
  for (let i = 1; i <= count; i++) {
    const categoryIndex = Math.floor(Math.random() * categories.length);
    const price = parseFloat((Math.random() * 20 + 5).toFixed(2)); // $5 to $25
    const stockQuantity = Math.floor(Math.random() * 100) + 10; // 10 to 110 items
    
    products.push({
      id: i,
      name: `Product ${i}`,
      description: `Description for product ${i}`,
      price,
      stockQuantity,
      category: {
        id: categoryIndex + 1,
        name: categories[categoryIndex]
      },
      active: Math.random() > 0.1 // 90% active
    });
  }
  
  return products;
};

// Generate dashboard stats
export const generateDashboardStats = () => {
  return {
    totalOrders: Math.floor(Math.random() * 500) + 100,
    totalCustomers: Math.floor(Math.random() * 200) + 50,
    totalProducts: Math.floor(Math.random() * 100) + 20,
    totalRevenue: parseFloat((Math.random() * 10000 + 1000).toFixed(2))
  };
};

// Generate recent orders for dashboard
export const generateRecentOrders = (count = 5) => {
  const orders = [];
  const statuses = ['COMPLETED', 'PENDING', 'IN_PROGRESS', 'CANCELLED'];
  
  for (let i = 1; i <= count; i++) {
    const statusIndex = Math.floor(Math.random() * statuses.length);
    const amount = parseFloat((Math.random() * 200 + 20).toFixed(2)); // $20 to $220
    
    orders.push({
      id: i,
      orderNumber: `ORD-${i}`,
      customer: `Customer ${i}`,
      amount,
      date: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      status: statuses[statusIndex]
    });
  }
  
  return orders;
};
