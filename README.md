# DreamNest - Premium Real Estate Platform

A modern, full-stack real estate management platform built with React, TypeScript, Node.js, and MongoDB.

## 🏠 Features

### User Features
- **Property Browsing**: Search and filter properties by type, price, location
- **Property Details**: Detailed property information with image galleries
- **Booking System**: Submit booking requests for properties
- **User Dashboard**: Manage profile and view booking history
- **Responsive Design**: Optimized for all devices

### Admin Features
- **Property Management**: Create, edit, delete, and manage property listings
- **Booking Management**: Review and respond to booking requests
- **User Management**: View and manage user accounts
- **Analytics Dashboard**: View platform statistics and insights
- **Featured Properties**: Mark properties as featured

### Technical Features
- **Authentication**: JWT-based authentication with role-based access
- **Real-time Updates**: Live updates for bookings and notifications
- **Dark Mode**: Toggle between light and dark themes
- **Email Notifications**: Automated email notifications for bookings
- **Image Management**: Support for multiple property images
- **Search & Filters**: Advanced search and filtering capabilities

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **React Hook Form** for form handling
- **React Query** for data fetching
- **Axios** for API calls

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Nodemailer** for email notifications
- **Express Validator** for input validation

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/your-username/dreamnest.git
cd dreamnest
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install all dependencies (frontend + backend)
npm run install:all
```

### 3. Environment Setup
Create a `.env` file in the backend directory:
```bash
cp backend/.env.example backend/.env
```

Update the `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dreamnest
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

### 4. Seed the database
```bash
npm run seed
```

### 5. Start the development servers
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 👤 Default Login Credentials

After seeding the database, you can login with:

**Admin Account:**
- Email: admin@dreamnest.com
- Password: admin123

**User Account:**
- Email: user@dreamnest.com
- Password: user123

## 📁 Project Structure

```
dreamnest/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── pages/           # Page components
│   │   ├── utils/           # Utility functions
│   │   └── types/           # TypeScript types
│   └── public/              # Static assets
├── backend/                 # Node.js backend
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   └── config/              # Configuration files
└── package.json             # Root package.json
```

## 🔧 Available Scripts

### Root Scripts
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build the frontend for production
- `npm run install:all` - Install dependencies for both frontend and backend
- `npm run seed` - Seed the database with sample data

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

## 🌟 Key Features Explained

### Authentication System
- JWT-based authentication with HTTP-only cookies
- Role-based access control (User/Admin)
- Protected routes and middleware
- Automatic token refresh

### Property Management
- CRUD operations for properties
- Image upload and management
- Advanced search and filtering
- Featured properties system

### Booking System
- User booking requests
- Admin approval/rejection workflow
- Email notifications
- Booking history tracking

### Admin Dashboard
- Real-time statistics
- User management
- Property management
- Booking management

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet security headers
- XSS protection

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎨 UI/UX Features

- Modern, clean design
- Dark mode support
- Smooth animations
- Loading states
- Error handling
- Toast notifications
- Confirmation dialogs

## 📧 Email Configuration

To enable email notifications, configure your SMTP settings in the backend `.env` file:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@dreamnest.com
```

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: `cd frontend && npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Configure environment variables

### Backend Deployment (Heroku/Railway)
1. Set up your MongoDB Atlas database
2. Configure environment variables
3. Deploy the backend folder
4. Update CORS settings for your frontend domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by leading real estate platforms
- Designed for scalability and maintainability

## 📞 Support

For support, email support@dreamnest.com or create an issue in the GitHub repository.

---

**DreamNest** - Making real estate dreams come true! 🏡✨
