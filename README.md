# ERP-POS System

A comprehensive Enterprise Resource Planning (ERP) and Point of Sale (POS) system built with Java Spring Boot backend and React.js frontend.

## Project Structure

- `backend/` - Java Spring Boot application
- `frontend/` - React.js application

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.x
- Spring Data JPA
- Spring Security with JWT Authentication
- PostgreSQL
- Maven

### Frontend
- React.js
- Vite
- React Router for navigation
- Axios for API calls
- Material-UI for UI components

## Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- PostgreSQL 12 or higher
- Maven 3.6 or higher

## Database Setup

1. Create a PostgreSQL database named `erp_pos`
   ```sql
   CREATE DATABASE erp_pos;
   ```

2. Update the database configuration in `backend/src/main/resources/application.properties` if needed:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/erp_pos
   spring.datasource.username=postgres
   spring.datasource.password=postgres
   ```

## Setup Instructions

### Backend
1. Navigate to the `backend` directory
   ```bash
   cd backend
   ```

2. Build the application
   ```bash
   ./mvnw clean install
   ```

3. Run the application
   ```bash
   ./mvnw spring-boot:run
   ```

4. The backend will be available at `http://localhost:8080`

### Frontend
1. Navigate to the `frontend` directory
   ```bash
   cd frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. The frontend will be available at `http://localhost:3000`

## Default Admin Account

After starting the application, you can log in with the following credentials:

- Username: `admin`
- Password: `admin123`

## Features

- **User Authentication and Authorization**
  - JWT-based authentication
  - Role-based access control (Admin, Manager, Cashier, User)
  - User registration and login

- **Product Management**
  - Add, edit, and delete products
  - Categorize products
  - Track inventory levels

- **Customer Management**
  - Maintain customer database
  - Track customer orders and history

- **Order Processing**
  - Create and manage orders
  - Multiple payment methods
  - Order status tracking

- **Reporting and Analytics**
  - Sales reports
  - Inventory reports
  - Customer insights

## API Documentation

The backend API endpoints are available at:
- Authentication: `/api/auth/**`
- Products: `/api/products/**`
- Customers: `/api/customers/**`
- Orders: `/api/orders/**`

## License

This project is licensed under the MIT License.
