# QuickCourt - A Local Sports Booking System 

## Team Information
- **Team Name**: VoidVipers
- **Team Leader**: Shashwat Vikram Singh


## Overview
QuickCourt is a full-stack web application built with the MERN stack (MongoDB, Express.js, React, Node.js) that enables users to book local sports facilities and connect with other sports enthusiasts.

## Tech Stack

### Frontend
- **React.js** (with React Router for navigation)
- **Redux** for state management
- **Material-UI** or **Tailwind CSS** for UI components
- **Axios** for API calls
- **Formik + Yup** for form handling and validation
- **Chart.js** or **Recharts** for data visualization

### Backend
- **Node.js** with **Express.js** framework
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **Nodemailer** for OTP verification
- **Moment.js** for date/time handling
- **Multer** for file uploads

### Development Tools
- **Postman** for API testing
- **Git** for version control
- **VS Code** as IDE

## Key API Endpoints

### Authentication
- `POST /api/auth/register` - User registration with OTP
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Venues
- `GET /api/venues` - Get all venues (with filters)
- `GET /api/venues/:id` - Get single venue details
- `POST /api/venues` - Create new venue (owner/admin only)
- `PUT /api/venues/:id` - Update venue (owner/admin only)

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/user/:userId` - Get user bookings
- `GET /api/bookings/venue/:venueId` - Get venue bookings
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Admin
- `GET /api/admin/pending-venues` - Get pending venues for approval
- `PUT /api/admin/approve-venue/:id` - Approve/reject venue

## Database Models

### User
```javascript
{
  name: String,
  email: { type: String, unique: true },
  password: String,
  avatar: String,
  role: { type: String, enum: ['user', 'owner', 'admin'] },
  isVerified: Boolean,
  otp: String,
  createdAt: Date
}
```

### Venue
```javascript
{
  name: String,
  description: String,
  location: {
    address: String,
    city: String,
    coordinates: [Number] 
  },
  sports: [String], 
  amenities: [String],
  photos: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isApproved: Boolean,
  rating: Number,
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    comment: String,
    createdAt: Date
  }]
}
```

### Court
```javascript
{
  name: String,
  venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
  sportType: String,
  pricePerHour: Number,
  operatingHours: {
    open: String, 
    close: String 
  },
  unavailableSlots: [{
    date: Date,
    startTime: String,
    endTime: String,
    reason: String
  }]
}
```

### Booking
```javascript
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  court: { type: mongoose.Schema.Types.ObjectId, ref: 'Court' },
  date: Date,
  startTime: String,
  endTime: String,
  totalPrice: Number,
  status: { type: String, enum: ['confirmed', 'cancelled', 'completed'] },
  paymentStatus: String,
  createdAt: Date
}
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- Git

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/quickcourt.git
   cd quickcourt
   ```

2. Set up the backend:
   ```bash
   cd server
   npm install
   cp .env.example .env
   
   ```

3. Set up the frontend:
   ```bash
   cd ../client
   npm install
   cp .env.example .env
   
   ```

4. Run the application:
   - In one terminal (backend):
     ```bash
     cd server
     npm run dev
     ```
   - In another terminal (frontend):
     ```bash
     cd client
     npm start
     ```

5. Access the application at `http://localhost:3000`

## Deployment

### Backend
1. Set up a MongoDB Atlas cluster and get connection string
2. Configure environment variables in production
3. Deploy to Heroku, Render, or AWS

### Frontend
1. Build for production:
   ```bash
   cd client
   npm run build
   ```
2. Deploy to Railway

## Future Enhancements
- Real payment gateway integration (Stripe/Razorpay)
- Push notifications for booking reminders
- Social features (friend system, matchmaking)
- Mobile app using React Native

