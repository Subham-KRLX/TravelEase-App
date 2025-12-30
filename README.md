# TravelEase - Full Stack Travel Booking App ✈️🏨

TravelEase is a comprehensive mobile application for seamless travel planning, enabling users to browse and book flights and hotels with real-time data and secure payments.

## 🚀 Key Features

- **Full-Stack Architecture**: React Native (Expo) frontend + Node.js/Express backend.
- **Secure Authentication**: JWT-based signup and login.
- **Real-Time Search**: Browsing for flights (origin, date) and hotels (city, dates).
- **Booking Management**: Cart system, booking history, and live availability tracking.
- **Integrated Payments**: Secure checkout powered by Stripe (Test Mode).
- **Modern UI**: Responsive, animated interface using React Native.

## 🛠️ Tech Stack

- **Frontend**: React Native, Expo, React Navigation, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Security**: JWT, bcryptjs
- **Payments**: Stripe API

## ⚙️ Quick Setup

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env  # Add your MongoDB URI & Stripe keys
npm run seed          # Optional: Seed with mock data
npm run dev
```

### 2. Frontend
```bash
# From root directory
npm install
npx expo start
```

## 📂 Project Structure

- **`backend/`**: API routes, controllers, and MongoDB models.
- **`src/`**: React Native screens, components, and service integrations.

## 🤝 Contributing
Contributions are welcome! Fork the repo and submit a PR.

## 📄 License
MIT License
