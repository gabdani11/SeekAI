# SeekAI 🔍🤖

An intelligent AI-powered search and chat application that combines real-time web search capabilities with advanced language models to provide accurate, context-aware responses.

## Overview

SeekAI is a full-stack application designed to deliver AI-powered conversations with the ability to search the internet in real-time. It leverages multiple AI models (Google Genai and Mistral AI) through LangChain, integrates Tavily for web search, and provides a modern, responsive user interface.

## Features

✨ **AI-Powered Chat**
- Real-time conversations with advanced language models
- Support for multiple AI models (Google Genai, Mistral AI)
- Context-aware responses with conversation history

🔍 **Web Search Integration**
- Real-time internet search capabilities via Tavily
- Augmented responses with current web information
- Seamless integration of search results into AI responses

👤 **User Authentication**
- Secure user registration and login
- JWT-based authentication
- Password encryption with bcrypt

💬 **Real-time Communication**
- WebSocket support for live chat updates
- Instant message delivery and notifications
- Socket.io integration for real-time features

📧 **Email Notifications**
- Email verification and account notifications
- Automated email service with Nodemailer

🎨 **Modern UI/UX**
- React-based responsive frontend
- Redux state management
- Markdown support for formatted responses
- Toast notifications for user feedback

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io
- **Authentication**: JWT, Bcrypt
- **AI/ML**: LangChain, Google Genai, Mistral AI
- **Search**: Tavily Core API
- **Email**: Nodemailer
- **Validation**: Express Validator, Zod
- **Environment**: dotenv

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **UI Enhancements**: React Markdown, React Toastify
- **Styling**: SASS
- **Linting**: ESLint

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB instance (local or cloud)
- API keys for:
  - Google Genai
  - Mistral AI
  - Tavily

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gabdani11/SeekAI.git
   cd SeekAI
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   ```

   Create a `.env` file in the Backend directory:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=7d

   # AI Model APIs
   GOOGLE_API_KEY=your_google_genai_api_key
   MISTRAL_API_KEY=your_mistral_api_key
   TAVILY_API_KEY=your_tavily_api_key

   # Email Service
   SMTP_SERVICE=your_email_service
   SMTP_USER=your_email
   SMTP_PASSWORD=your_email_password

   # Client URL
   CLIENT_URL=http://localhost:5173
   ```

3. **Frontend Setup**
   ```bash
   cd ../Frontend
   npm install
   ```

   Create a `.env` file in the Frontend directory:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

### Running the Application

**Terminal 1 - Backend**
```bash
cd Backend
npm run dev
```
The server will start on `http://localhost:3000`

**Terminal 2 - Frontend**
```bash
cd Frontend
npm run dev
```
The frontend will be available on `http://localhost:5173`

## Project Structure

```
SeekAI/
├── Backend/
│   ├── src/
│   │   ├── config/          # Database and configuration
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Custom middleware (auth, validation)
│   │   ├── model/           # MongoDB schemas
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic (AI, search, email)
│   │   ├── sockets/         # WebSocket configuration
│   │   ├── validator/       # Request validation schemas
│   │   └── app.js           # Express app configuration
│   ├── server.js            # Server entry point
│   └── package.json
│
└── Frontend/
    ├── src/
    │   ├── app/             # Main app component and routing
    │   ├── feature/         # Feature modules (auth, chat)
    │   ├── main.jsx         # React entry point
    │   └── store/           # Redux store configuration
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile (protected)

### Chat
- `GET /api/chat` - Get all chats (protected)
- `POST /api/chat` - Create new chat (protected)
- `GET /api/chat/:id` - Get chat details (protected)
- `POST /api/chat/:id/message` - Send message (protected)
- `DELETE /api/chat/:id` - Delete chat (protected)

### WebSocket Events
- `connect` - Establish WebSocket connection
- `send-message` - Send chat message
- `receive-message` - Receive chat message
- `disconnect` - Close connection

## Environment Variables

### Backend
| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `JWT_EXPIRE` | JWT expiration time | Yes |
| `GOOGLE_API_KEY` | Google Genai API key | Yes |
| `MISTRAL_API_KEY` | Mistral AI API key | Yes |
| `TAVILY_API_KEY` | Tavily search API key | Yes |
| `SMTP_SERVICE` | Email service provider | No |
| `SMTP_USER` | Email account | No |
| `SMTP_PASSWORD` | Email password | No |
| `CLIENT_URL` | Frontend URL for CORS | Yes |

### Frontend
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |

## Available Scripts

### Backend
```bash
npm run dev    # Start development server with hot reload
```

### Frontend
```bash
npm run dev    # Start Vite development server
npm run build  # Build for production
npm run lint   # Run ESLint
npm run preview # Preview production build
```

## Key Features Implementation

### AI Integration
- Uses LangChain for orchestrating AI models
- Supports both Google Genai and Mistral AI
- Dynamic model selection based on user preference
- Context-aware conversation management

### Web Search
- Tavily integration for real-time internet search
- Search results are synthesized into AI responses
- Automatic fact verification through web search

### Real-time Chat
- WebSocket connection for live messaging
- Streaming responses from AI
- Typing indicators and presence detection

### User Management
- Secure authentication with JWT tokens
- Password hashing with bcrypt
- Session management with secure cookies
- Email verification support

## Security Features

- JWT-based authentication
- CORS configuration
- Password encryption with bcrypt
- Request validation with Express Validator
- Database query sanitization with Mongoose
- Secure HTTP headers
- Protected API routes with middleware

## Database Models

### User
- Email (unique)
- Password (hashed)
- Full name
- Avatar
- Created at, Updated at

### Chat
- User reference
- Title
- Messages array
- Created at, Updated at

### Message
- Chat reference
- User reference
- Content
- AI response
- Search results (optional)
- Timestamp

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

For support, please open an issue on the GitHub repository or contact the development team.

## Roadmap

- [ ] Streaming responses for better UX
- [ ] Multi-language support
- [ ] Custom AI model training
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Collaborative chat features
- [ ] Chat history search
- [ ] Export chat functionality

## Acknowledgments

- [LangChain](https://js.langchain.com/) - AI orchestration
- [Google Genai](https://ai.google.dev/) - Language model
- [Mistral AI](https://mistral.ai/) - Language model
- [Tavily](https://tavily.com/) - Web search API
- [React](https://react.dev/) - Frontend framework
- [Express.js](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database

---

Made with ❤️ by Daniel.
