# TravelEase Backend API

Full-stack travel booking platform backend built with Node.js, Express, and MongoDB.

## Features

- 🔐 **JWT Authentication** - Secure user authentication with JWT tokens
- ✈️ **Flight Search & Booking** - Search flights with advanced filters and book tickets
- 🏨 **Hotel Search & Booking** - Find and book hotels with location-based search
- 💳 **Payment Integration** - Stripe payment processing
- 📱 **RESTful APIs** - Well-documented REST APIs
- 👨‍💼 **Admin Dashboard** - Manage flights, hotels, and bookings
- 🗂️ **Database Seeding** - Pre-populated data for development

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Stripe
- **Security**: Helmet, CORS, bcrypt

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Stripe account (for payments)

## Installation

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

3. **Configure `.env` file**:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/travelease
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d
   STRIPE_SECRET_KEY=sk_test_your_stripe_key
   FRONTEND_URL=http://localhost:19006
   ADMIN_EMAIL=admin@travelease.com
   ADMIN_PASSWORD=admin123
   ```

4. **Install MongoDB** (if using local):
   - **macOS**: `brew install mongodb-community`
   - **Windows**: Download from [MongoDB website](https://www.mongodb.com/try/download/community)
   - **Linux**: Follow [MongoDB docs](https://docs.mongodb.com/manual/installation/)

5. **Start MongoDB**:
   ```bash
   # macOS
   brew services start mongodb-community

   # Or manually
   mongod --dbpath /path/to/data/directory
   ```

6. **Seed the database**:
   ```bash
   npm run seed
   ```

   This will create:
   - **500 flights** across Indian and international routes
   - **180+ hotels** in 12 cities
   - **Admin user**: admin@travelease.com / admin123
   - **Demo user**: demo@travelease.com / demo123

7. **Start the server**:
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

The server will start at `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

#### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+91-9876543210"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile (Protected)
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Flights

#### Search Flights
```http
GET /api/flights/search?origin=Mumbai&destination=Delhi&departureDate=2024-01-15&passengers=2&class=economy&sortBy=price
```

#### Get Flight Details
```http
GET /api/flights/:id
```

#### Get Popular Routes
```http
GET /api/flights/popular-routes
```

### Hotels

#### Search Hotels
```http
GET /api/hotels/search?city=Goa&checkIn=2024-01-15&checkOut=2024-01-20&guests=2&minRating=4&amenities=Free WiFi,Swimming Pool&sortBy=rating
```

#### Get Hotel Details
```http
GET /api/hotels/:id
```

#### Get Nearby Hotels
```http
GET /api/hotels/nearby?latitude=19.0760&longitude=72.8777&maxDistance=10000
```

### Bookings (Protected)

#### Create Booking
```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookingType": "flight",
  "itemId": "flight_id_here",
  "details": {
    "passengers": [
      { "firstName": "John", "lastName": "Doe", "age": 30, "gender": "Male" }
    ],
    "class": "economy"
  },
  "totalPrice": 5000
}
```

#### Get User Bookings
```http
GET /api/bookings
Authorization: Bearer <token>
```

#### Cancel Booking
```http
PUT /api/bookings/:id/cancel
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Change of plans"
}
```

### Payments (Protected)

#### Create Payment Intent
```http
POST /api/payments/create-intent
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 5000,
  "bookingId": "booking_id_here"
}
```

### Admin Routes (Admin Only)

#### Get All Flights
```http
GET /api/admin/flights
Authorization: Bearer <admin_token>
```

#### Create Flight
```http
POST /api/admin/flights
Authorization: Bearer <admin_token>
```

#### Get All Bookings
```http
GET /api/admin/bookings
Authorization: Bearer <admin_token>
```

## Project  Structure

```
backend/
├── config/
│   └── database.js       # MongoDB connection
├── controllers/
│   ├── authController.js
│   ├── flightController.js
│   ├── hotelController.js
│   ├── bookingController.js
│   ├── paymentController.js
│   └── adminController.js
├── middleware/
│   └── auth.js           # JWT verification
├── models/
│   ├── User.js
│   ├── Flight.js
│   ├── Hotel.js
│   ├── Booking.js
│   └── Review.js
├── routes/
│   ├── auth.js
│   ├── flights.js
│   ├── hotels.js
│   ├── bookings.js
│   ├── payments.js
│   └── admin.js
├── seeders/
│   ├── flightSeeder.js
│   ├── hotelSeeder.js
│   └── index.js
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

## Testing

Test the API health:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "success",
  "message": "TravelEase API is running!",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Deployment

For production deployment:

1. Set `NODE_ENV=production` in `.env`
2. Use a cloud MongoDB service (MongoDB Atlas)
3. Set up proper Stripe production keys
4. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name travelease-api
   ```

## License

MIT
