# TravelEase - Full Stack Travel Booking App

**TravelEase** is a comprehensive, full-stack mobile application designed to simplify travel planning. It enables users to browse and book flights and hotels seamlessly, featuring a robust backend with real-time data persistence, secure authentication, and payment integration.

## 🚀 Key Features

*   **Full-Stack Architecture:**  React Native (Expo) frontend connected to a dedicated Node.js/Express backend.
*   **User Authentication:** Secure signup and login using JWT (JSON Web Tokens).
*   **Real-Time Search:** 
    *   **Flights:** Search by origin, destination, date, and passengers.
    *   **Hotels:** Search by city, check-in/out dates, and guests.
*   **Booking Management:** 
    *   Add flights and hotels to cart.
    *   View booking history and status.
    *   Real-time seat/room availability tracking.
*   **Payment Integration:** Secure checkout process powered by Stripe (Test Mode).
*   **Interactive UI:** Modern, responsive design with smooth animations and intuitive navigation.

## 🛠️ Technology Stack

*   **Frontend:** React Native, Expo, React Navigation, Axios
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB (using Mongoose ODM)
*   **Authentication:** JWT, bcryptjs
*   **Payments:** Stripe API
*   **Data Seeding:** Custom scripts to generate realistic flight and hotel data

## ⚙️ Setup & Installation

### Prerequisites
*   Node.js (v14 or higher)
*   MongoDB (local or Atlas connection string)
*   Expo Go app on your mobile device (or Android/iOS emulator)

### 1. Backend Setup
The backend handles all API requests, database connections, and business logic.

\`\`\`bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure Environment Variables
cp .env.example .env
# Edit .env and add your MongoDB URI and Stripe keys

# Seed Database (Optional)
npm run seed

# Start the Server
npm run dev
\`\`\`

### 2. Frontend Setup
The frontend is the mobile application user interface.

\`\`\`bash
# Navigate to the root directory
cd ..

# Install dependencies
npm install

# Start the Expo development server
npx expo start
\`\`\`

### 3. Application Configuration
1.  Ensure the backend server is running.
2.  Verify your `.env` configuration matches your development environment.
3.  Update the API endpoint in `src/config/api.js` to point to your server's address (IP address or hosted URL).
4.  Run the app using Expo Go on your device or emulator.

## 📂 Project Structure

*   **`backend/`**: Contains server code, models, controllers, and routes.
    *   `models/`: Mongoose schemas (User, Flight, Hotel, Booking).
    *   `controllers/`: Business logic for APIs.
    *   `routes/`: API endpoint definitions.
    *   `seeders/`: Scripts to populate the database with mock data.
*   **`src/`**: React Native frontend code.
    *   `components/`: Reusable UI components (SearchBar, Header, etc.).
    *   `screens/`: Application screens (Home, SearchResults, Checkout, etc.).
    *   `services/`: API service layer for backend communication.
    *   `context/`: Global state management (Auth, Cart, Theme).
    *   `navigation/`: App navigation configuration.

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
