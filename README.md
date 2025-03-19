# 👨‍⚕️ Doctor Search - Find Your Healthcare Hero! 🦸‍♀️

Welcome to Doctor Search - the app that helps you find the perfect doctor faster than you can say "Is this covered by insurance?" 💉

## 🌟 What's This All About?

Doctor Search is a super cool web application that connects patients with doctors. Think of it as a matchmaking service, but instead of finding your soulmate, you're finding someone who can tell you whether that weird mole is concerning.

### ✨ Key Features

- **User Authentication**: Create an account as either a patient looking for healthcare or a doctor looking for patients. It's like Tinder, but for healthcare!
- **Doctor Search**: Find doctors by specialty, location, or name. Filter results and find your perfect medical match.
- **Doctor Profiles**: View detailed doctor information, including specialty, experience, location, and availability. Stalk them professionally before making a decision!
- **Appointment Booking**: See when doctors are available and book appointments with a few clicks. No more endless phone calls to receptionists!
- **Dashboards**: Separate interfaces for patients and doctors to manage appointments, profiles, and more. Everyone gets their own special space!

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS (for that sleek, modern look)
- Lucide icons (because boring icons are so 2010)
- Axios (for talking to the backend without breaking a sweat)

### Backend
- Node.js with Express (the dynamic duo of backend development)
- MongoDB with Mongoose (because data needs a cozy home)
- JWT authentication (keeping the bad guys out since 2015)

## 🚀 Getting Started

Want to run this amazing project locally? Follow these steps and you'll be matching patients and doctors in no time!

### Prerequisites

- Node.js (v14 or newer) - the engine that powers our rocket ship
- MongoDB (v4 or newer) - where all the juicy data lives
- A sense of humor (for reading this README)

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/nileshambekarr/doctor-search.git
cd doctor-search
```

#### 2. Start the MongoDB server
Make sure MongoDB is running on your machine. If you've never done this before, it's like feeding a pet - not too hard once you know how!

#### 3. Set up the Server
```bash
# Navigate to the server directory
cd server

# Install dependencies (grab a coffee, this might take a minute)
npm install

# Create a .env file with your secrets (shhh, don't tell anyone)
echo "PORT=3000
MONGODB_URI=mongodb://localhost:27017/doctor-search
JWT_SECRET=your_super_secret_key_that_nobody_will_guess" > .env

# Start the server (the moment of truth!)
npm start
```

#### 4. Set up the Client
```bash
# Open a new terminal and navigate to the client directory
cd ../client-js

# Install dependencies (maybe grab another coffee?)
npm install

# Start the client (fingers crossed!)
npm run dev
```

#### 5. Open your browser
Navigate to `http://localhost:5173` and behold the glory of Doctor Search!

## 🎮 How to Use

### For Patients
1. Register for a new account (as a patient)
2. Search for doctors based on specialty, location, or name
3. View doctor profiles and check their availability
4. Book an appointment with your chosen doctor
5. Manage your appointments through your dashboard

### For Doctors
1. Register for a new account (as a doctor)
2. Complete your profile with specialties, experience, and availability
3. View and manage appointment requests
4. Update your availability as needed

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Create a new user (doctor or patient)
- `POST /api/auth/login` - Login and get authentication token
- `GET /api/auth/me` - Get current user info

### Doctors
- `GET /api/doctor/search` - Search for doctors with filters
- `GET /api/doctor/:id` - Get a specific doctor's profile
- `POST /api/doctor/profile` - Create/update doctor profile
- `GET /api/doctor/profile` - Get logged-in doctor's profile

### Appointments
- `POST /api/appointment` - Book a new appointment
- `GET /api/appointment/patient` - Get patient's appointments
- `GET /api/appointment/doctor` - Get doctor's appointments
- `PUT /api/appointment/:id/cancel` - Cancel an appointment

## 🎭 User Roles

- **Patients**: Can search for doctors, view profiles, book and manage appointments
- **Doctors**: Can create and update profiles, manage appointments, and set availability

## 🌈 Project Structure

```
doctor-search/
├── server/                  # Backend code
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── middlewares/     # Custom middlewares
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Server entry point
│   └── package.json         # Backend dependencies
│
└── client-js/               # Frontend code
    ├── src/
    │   ├── components/      # Reusable components
    │   ├── context/         # React context providers
    │   ├── pages/           # Page components
    │   ├── services/        # API services
    │   ├── App.jsx          # Main app component
    │   └── main.jsx         # Entry point
    └── package.json         # Frontend dependencies
```

## 🤝 Contributing

Found a bug? Want to add a feature? Have a suggestion for making this even more awesome? 

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

<!-- ## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details. -->

## 🙏 Acknowledgements

- Coffee, for making this development possible
- Stack Overflow, for saving developers one error at a time
- The incredible open-source community for all the amazing tools

---

Built with ❤️ and a lot of debugging. Happy doctor hunting!
