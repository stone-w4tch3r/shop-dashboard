# Mock Backend API Server

This directory contains the Mockoon configuration for the Product Management System mock API.

## Quick Start

### 1. Start the Mock Server

```bash
cd back
mockoon-cli start --data api-config.json --port 3001
```

The server will start on `http://localhost:3001`

### 2. Available Endpoints

#### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product  
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

#### Analytics
- `GET /api/stats` - Get analytics data
- `POST /api/click/:productId` - Record product click

### 3. Test the API

```bash
# Get all products
curl http://localhost:3001/api/products

# Get analytics
curl http://localhost:3001/api/stats
```

## Configuration

- **Port**: 3001
- **CORS**: Enabled for `http://localhost:3000`
- **Response Delays**: 100-200ms simulation
- **Data Format**: MongoDB-like JSON structure

## Mock Data

Sample data includes:
- 5 fitness products (protein, bands, tracker, shoes, yoga mat)
- Analytics with click counts and earnings
- Category breakdown and time-series data

## Frontend Integration

The frontend at `http://localhost:3000` is configured to call this mock API for all product and analytics operations.