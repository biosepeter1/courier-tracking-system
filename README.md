# Courier Service Tracking System

A modern, full-stack courier service tracking system with real-time updates, Google Maps integration, and email notifications.

## Features

- 🔐 **Authentication & Authorization** - JWT-based auth with user/admin roles
- 📦 **Shipment Management** - Create, track, and update shipments
- 🗺️ **Google Maps Integration** - Real-time location tracking with geocoding
- 📧 **Email Notifications** - Automated email updates at each checkpoint
- ⚡ **Real-time Updates** - Socket.IO for instant shipment status updates
- 🎨 **Modern UI** - React with Tailwind CSS and shadcn/ui components
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **Nodemailer** - Email notifications
- **Google Maps API** - Geocoding service
- **Joi** - Input validation

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Socket.IO Client** - Real-time updates
- **Axios** - HTTP client
- **Lucide React** - Icons

## Project Structure

```
courier-tracking-system/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── hooks/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or cloud instance)
- Google Maps API key (optional, uses fallbacks)
- SMTP credentials (optional, for email notifications)

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd courier-tracking-system

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

#### Backend Environment (.env)

```bash
cd backend
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
ALLOWED_ORIGIN=http://localhost:3000

# Database
MONGO_URI=mongodb://localhost:27017/courier-tracking

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Google Maps API (optional)
GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password-here
EMAIL_FROM=Your Courier Service <noreply@yourcourier.com>

# Socket.IO
SOCKET_CORS_ORIGINS=http://localhost:3000
```

#### Frontend Environment (.env)

```bash
cd frontend
cp .env.example .env
```

Update the `.env` file:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# Socket.IO Configuration
VITE_SOCKET_URL=http://localhost:5000

# Google Maps API Key (optional)
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
```

### 3. Start the Application

#### Start MongoDB
Make sure MongoDB is running on your system.

#### Start Backend Server
```bash
cd backend
npm run dev
# Server will start on http://localhost:5000
```

#### Start Frontend Development Server
```bash
cd frontend
npm run dev
# Frontend will start on http://localhost:5173
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout user

### Shipments
- `POST /api/shipments` - Create shipment (Admin)
- `GET /api/shipments` - List shipments
- `GET /api/shipments/:id` - Get shipment by ID
- `GET /api/shipments/tracking/:trackingNumber` - Track by number (Public)
- `PUT /api/shipments/:id/update` - Update status/location (Admin)
- `PUT /api/shipments/:id/details` - Update shipment details (Admin)
- `DELETE /api/shipments/:id` - Delete shipment (Admin)
- `GET /api/shipments/admin/stats` - Get statistics (Admin)

### Health Check
- `GET /api/health` - Health check endpoint

## Usage Guide

### 1. User Registration & Login
- Visit the landing page at `http://localhost:5173`
- Click "Sign Up" to create a new account
- Login with your credentials

### 2. Admin Functions
- Register with `role: "admin"` in the request body
- Create new shipments with sender/receiver details
- Update shipment status and location
- View all shipments and statistics

### 3. User Functions
- View your shipments in the dashboard
- Track shipments by tracking number
- Receive email notifications for updates

### 4. Public Tracking
- Anyone can track shipments using the tracking number
- No authentication required for tracking

## Key Features Implementation

### Real-time Updates
The system uses Socket.IO for real-time communication:
- Clients join rooms based on tracking numbers
- Server emits updates when shipment status changes
- Frontend automatically updates without refresh

### Geocoding Integration
- Admin enters location names (e.g., "Lagos, Nigeria")
- Backend automatically geocodes to coordinates
- Coordinates stored in shipment history
- Fallback coordinates provided if API unavailable

### Email Notifications
- Automated emails sent on shipment updates
- HTML and plain text versions
- Google Maps links included
- Customizable email templates

### Security Features
- JWT authentication with role-based access
- Password hashing with bcrypt
- Input validation with Joi
- CORS protection
- Rate limiting
- Helmet security headers

## Development

### Available Scripts

#### Backend
```bash
npm run dev      # Start with nodemon (development)
npm start        # Start production server
npm test         # Run tests (if configured)
```

#### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Database Models

#### User Model
- Authentication and profile information
- Role-based access control (user/admin)
- Password hashing and validation

#### Shipment Model
- Complete shipment information
- Tracking history with coordinates
- Virtual fields for progress calculation
- Automatic status updates

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **CORS Errors**
   - Verify `ALLOWED_ORIGIN` in backend `.env`
   - Check frontend is running on correct port

3. **Socket.IO Connection Issues**
   - Ensure both frontend and backend URLs are correct
   - Check firewall settings

4. **Email Not Sending**
   - Verify SMTP credentials
   - Check email provider settings
   - App passwords may be required for Gmail

5. **Geocoding Not Working**
   - Google Maps API key may be missing or invalid
   - System will use fallback coordinates

## Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Use strong JWT secret
3. Configure proper CORS origins
4. Set up environment variables
5. Use PM2 or similar for process management

### Frontend Deployment
1. Build with `npm run build`
2. Serve static files with nginx/Apache
3. Configure API URLs for production
4. Enable HTTPS

### Database
1. Use MongoDB Atlas or dedicated server
2. Enable authentication
3. Configure backups
4. Monitor performance

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the API documentation

---

**Note**: This is a complete implementation based on your Requirements & Design Note (RDN). The system is ready for development and can be extended with additional features as needed.