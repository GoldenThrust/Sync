# Sync - Video Chat, Reimagined

![Sync Logo](./public/sync-logo-white-text.svg)

Sync is a real-time video conferencing web application that offers seamless communication experience with high-quality video and audio capabilities. The platform supports multi-user video conferencing, instant meetings, text chat, and more, making it ideal for both personal and professional use.

## Features

- **Real-Time Video Chat**: Crystal-clear, real-time video to stay connected, wherever you are.
- **Multi-Device Sync**: Easily switch between devices without missing a moment.
- **AI-Powered Subtitles**: Automatically generate accurate subtitles for spoken words, enhancing accessibility.
- **Screen Sharing & File Sharing**: Share your screen or send files instantly for smooth collaboration.
- **Chat Translation**: Real-time translation to connect with people globally regardless of language barriers.
- **End-to-End Encryption**: Fully encrypted conversations for privacy and security.
- **Mobile Responsive**: Works smoothly on both desktop and mobile devices with camera switching support.
- **Invite System**: Easily invite friends and colleagues to your meetings.

## Technology Stack

- **Frontend**: React, React Router, Redux Toolkit, Socket.IO Client, TailwindCSS
- **Backend**: Express.js, Socket.IO, MongoDB, Redis
- **Authentication**: JWT (JSON Web Token), Cookie-based auth
- **Real-time Communication**: WebRTC with Simple Peer
- **Build Tools**: Vite, ESLint

## Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB
- Redis

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=3000
VITE_SERVER_URL=http://localhost:3000
CLIENT_URL=http://localhost:5173

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/sync
REDIS_URI=redis://localhost:6379

# Authentication
JWT_SECRET=your_jwt_secret_key
COOKIE_SECRET=your_cookie_secret
COOKIE_NAME=auth_token
COOKIE_DOMAIN=localhost

# Email Configuration (for sending OTP and invites)
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=your_email@example.com
MAIL_PASS=your_email_password

# Optional: Cloudinary for image uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Installation and Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/sync.git
   cd sync
   ```

2. Install dependencies
   ```bash
   npm install --legacy-peer-deps
   ```

3. Start development servers (frontend and backend)
   ```bash
   # Run frontend and backend concurrently
   npm run dev
   
   # Run backend only
   npm run start
   
   # Build and run production version
   npm run build
   npm run start
   ```

## Project Structure

```
sync/
├── config/                # Server configuration files
├── controllers/           # API controllers
├── middlewares/           # Express middlewares
├── models/                # MongoDB models
├── public/                # Static files
├── routes/                # API routes
├── src/                   # Frontend React code
│   ├── assets/            # Images and other assets
│   ├── authentication/    # Authentication related files
│   ├── components/        # Reusable UI components
│   ├── pages/             # Application pages
│   ├── settings/          # User settings
│   ├── styles/            # CSS styles
│   └── utils/             # Utility functions
├── uploads/               # User uploaded files
├── utils/                 # Shared utility functions
├── index.js               # Backend entry point
├── index.html             # Frontend HTML template
└── vite.config.js         # Vite configuration
```

## Usage

1. Register an account or login if you already have one
2. Create an instant meeting or join an existing meeting with a link/passcode
3. Share the meeting link with others to invite them
4. Enjoy high-quality video conferencing with features like:
   - Toggle video on/off
   - Toggle audio mute/unmute
   - Switch camera (on mobile devices)
   - End call
   - Send chat messages
   - Invite more participants

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify user token
- `GET /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Meetings
- `GET /api/meet/initiate/:id` - Join or create a meeting room
- `GET /api/meet/getActiveUsers/:id` - Get active users in a meeting
- `POST /api/meet/send-invite` - Send meeting invitation

### User Settings
- `GET /api/settings/get` - Get user settings
- `POST /api/settings/initiate` - Initialize user settings
- `PUT /api/settings/update` - Update user settings

## WebSocket Events

- `connect` - Client connects to server
- `rtc-signal` - WebRTC signaling
- `return-rtc-signal` - WebRTC signal response
- `get-active-users` - Request active users in a room
- `active-users` - Response with active users
- `user-disconnected` - User left the meeting
- `end-call` - End the call

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any inquiries or issues, please contact through the following channels:
- Email: [adenijiolajid01@gmail.com](adenijiolajid01@gmail.com)
- Twitter: [@Goldenthrust3](https://twitter.com/Goldenthrust3)
- LinkedIn: [Olajide Adeniji](https://www.linkedin.com/in/olajide-adeniji/)
- GitHub: [GoldenThrust](https://github.com/GoldenThrust)
