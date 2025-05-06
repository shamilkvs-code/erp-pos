import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
const port = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: 'shamilkv',
  host: 'localhost',
  database: 'erp_pos',
  password: '',
  port: 5432,
});

// JWT Secret
const JWT_SECRET = 'your_jwt_secret_key_here_make_it_long_and_secure_in_production';

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to PostgreSQL database at:', res.rows[0].now);
  }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes

// Login
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Get user from database
    const userResult = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    const user = userResult.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // For testing purposes, accept 'admin123' as the password for the admin user
    if (username === 'admin' && password === 'admin123') {
      console.log('Admin login successful with hardcoded password');
      // Skip password check for admin user
    } else {
      // Check password for other users
      console.log('Stored password hash:', user.password);
      console.log('Provided password:', password);
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Password valid:', isPasswordValid);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
    }

    // Get user roles
    const rolesResult = await pool.query(
      'SELECT r.name FROM roles r JOIN user_roles ur ON r.id = ur.role_id WHERE ur.user_id = $1',
      [user.id]
    );

    const roles = rolesResult.rows.map(role => role.name);

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, roles },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      roles,
      token
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Register
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, email, password, fullName, roles } = req.body;

    // Check if username or email already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password, full_name, created_at, updated_at, active) VALUES ($1, $2, $3, $4, NOW(), NOW(), true) RETURNING id',
      [username, email, hashedPassword, fullName]
    );

    const userId = newUser.rows[0].id;

    // Assign roles
    if (roles && roles.length > 0) {
      for (const role of roles) {
        const roleResult = await pool.query(
          'SELECT id FROM roles WHERE name = $1',
          [role]
        );

        if (roleResult.rows.length > 0) {
          const roleId = roleResult.rows[0].id;
          await pool.query(
            'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)',
            [userId, roleId]
          );
        }
      }
    } else {
      // Assign default user role
      const userRoleResult = await pool.query(
        'SELECT id FROM roles WHERE name = $1',
        ['ROLE_USER']
      );

      if (userRoleResult.rows.length > 0) {
        const roleId = userRoleResult.rows[0].id;
        await pool.query(
          'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)',
          [userId, roleId]
        );
      }
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all products
app.get('/api/products', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id'
    );

    const products = result.rows.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      stockQuantity: product.stock_quantity,
      sku: product.sku,
      barcode: product.barcode,
      category: product.category_id ? {
        id: product.category_id,
        name: product.category_name
      } : null,
      active: product.active,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    }));

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get product by ID
app.get('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = result.rows[0];

    res.json({
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      stockQuantity: product.stock_quantity,
      sku: product.sku,
      barcode: product.barcode,
      category: product.category_id ? {
        id: product.category_id,
        name: product.category_name
      } : null,
      active: product.active,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create product
app.post('/api/products', authenticateToken, async (req, res) => {
  try {
    const { name, description, price, stockQuantity, sku, barcode, category } = req.body;

    const result = await pool.query(
      'INSERT INTO products (name, description, price, stock_quantity, sku, barcode, category_id, active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW(), NOW()) RETURNING *',
      [name, description, price, stockQuantity, sku, barcode, category ? category.id : null]
    );

    const product = result.rows[0];

    res.status(201).json({
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      stockQuantity: product.stock_quantity,
      sku: product.sku,
      barcode: product.barcode,
      category: category,
      active: product.active,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update product
app.put('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stockQuantity, sku, barcode, category, active } = req.body;

    const result = await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, stock_quantity = $4, sku = $5, barcode = $6, category_id = $7, active = $8, updated_at = NOW() WHERE id = $9 RETURNING *',
      [name, description, price, stockQuantity, sku, barcode, category ? category.id : null, active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = result.rows[0];

    res.json({
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      stockQuantity: product.stock_quantity,
      sku: product.sku,
      barcode: product.barcode,
      category: category,
      active: product.active,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Disable product (soft delete) - Using DELETE method for backward compatibility
app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Instead of deleting, update the product to set active = false
    const result = await pool.query(
      'UPDATE products SET active = false, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const disabledProduct = result.rows[0];

    res.json({
      message: 'Product successfully disabled',
      product: {
        id: disabledProduct.id,
        name: disabledProduct.name,
        active: disabledProduct.active
      }
    });
  } catch (error) {
    console.error('Error disabling product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Explicit endpoint to disable a product
app.patch('/api/products/:id/disable', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Update the product to set active = false
    const result = await pool.query(
      'UPDATE products SET active = false, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const disabledProduct = result.rows[0];

    res.json({
      message: 'Product successfully disabled',
      product: {
        id: disabledProduct.id,
        name: disabledProduct.name,
        active: disabledProduct.active
      }
    });
  } catch (error) {
    console.error('Error disabling product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Explicit endpoint to enable a product
app.patch('/api/products/:id/enable', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Update the product to set active = true
    const result = await pool.query(
      'UPDATE products SET active = true, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const enabledProduct = result.rows[0];

    res.json({
      message: 'Product successfully enabled',
      product: {
        id: enabledProduct.id,
        name: enabledProduct.name,
        active: enabledProduct.active
      }
    });
  } catch (error) {
    console.error('Error enabling product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
