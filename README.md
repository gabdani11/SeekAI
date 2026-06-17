# SeekAI 🔍🤖

An intelligent AI-powered search and chat application that combines real-time web search, document-grounded answers (RAG), and streaming chat to provide accurate, context-aware responses.

## Overview

SeekAI is a full-stack application built around a **tool-using AI agent**. Instead of a single model call, every message is handled by a LangChain agent that can decide, on its own, whether to answer directly, search the live web (via Tavily), or pull facts from PDFs you've uploaded (via a Pinecone-backed RAG pipeline). Responses are streamed token-by-token to the browser over Socket.IO so replies appear as they're generated rather than all at once.

## Features

✨ **Agentic AI Chat**
- Conversational agent powered by Google Gemini (`gemini-2.5-flash`) via LangChain's `createAgent`
- The agent autonomously chooses between answering from its own knowledge, searching the internet, or querying your uploaded documents
- Conversation history is persisted and replayed back into the agent for context
- Mistral (`mistral-small-latest`) generates a short title for each new chat

🔍 **Live Web Search Tool**
- A `searchInternet` tool backed by Tavily lets the agent pull current information from the internet when it decides a question needs it
- Search depth and result count are tuned for speed and context size

📄 **PDF / RAG Tool**
- Upload a PDF from the chat UI; the backend extracts its text (`pdf-parse`), splits it into chunks, embeds each chunk with Mistral's `mistral-embed` model, and stores the vectors in Pinecone
- A `queryRAG` tool lets the agent retrieve the most relevant chunks to ground its answer in your documents

💬 **Real-time Streaming Chat**
- Socket.IO streams the agent's response chunk-by-chunk to the client as it's generated
- The client joins a per-chat "room" so multiple chats can stream independently
- Final message and any errors are also broadcast as discrete events

👤 **User Authentication**
- Registration and login with hashed passwords (bcrypt)
- Email verification required before login is allowed
- JWT issued on login and stored in a cookie; protected routes are guarded by cookie-based auth middleware

📧 **Email Verification**
- Verification emails are sent through Gmail using OAuth2 (via `googleapis` + `nodemailer`), not raw SMTP credentials

🎨 **Modern UI/UX**
- React-based responsive frontend with Redux Toolkit for state
- Markdown rendering for AI responses
- Toast notifications for auth/chat feedback
- Icon set via `@remixicon/react`

## Tech Stack

### Backend
- **Runtime**: Node.js (ESM)
- **Framework**: Express 5
- **Database**: MongoDB with Mongoose ODM
- **AI Orchestration**: LangChain (`createAgent`, tool calling) with Google Gemini and Mistral
- **Vector Store**: Pinecone (for RAG)
- **Web Search**: Tavily Core API
- **PDF Parsing**: pdf-parse
- **File Uploads**: Multer (in-memory storage)
- **Real-time**: Socket.IO
- **Authentication**: JWT (cookie-based), Bcrypt
- **Email**: Nodemailer over Gmail OAuth2 (`googleapis`)
- **Validation**: Express Validator, Zod (for tool schemas)
- **Environment**: dotenv

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **UI**: React Markdown, React Toastify, `@remixicon/react`
- **Styling**: SASS
- **Linting**: ESLint

## Getting Started

### Prerequisites

- Node.js (v18+ recommended, since the backend uses ESM and recent LangChain packages)
- npm
- A MongoDB instance (local or cloud)
- A Pinecone account with an index named `seekai`
- API keys / credentials for:
  - Google Gemini
  - Mistral AI
  - Tavily
  - Pinecone
  - A Google Cloud OAuth2 client (Gmail API) for sending verification emails

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

   Create a `.env` file in the `Backend` directory with the variables your code actually reads:
   ```env
   # Database
   MONGOOSE_SERVER=your_mongodb_connection_string

   # Auth
   JWT_SECRET=your_jwt_secret

   # AI Models
   GOOGLE_GEMINI_API_KEY=your_gemini_api_key
   MISTRALAI_API_KEY=your_mistral_api_key

   # Web Search
   TAVILY_API_KEY=your_tavily_api_key

   # Vector store (RAG)
   PINECONE_API_KEY=your_pinecone_api_key

   # Gmail OAuth2 (used to send verification emails)
   GOOGLE_USER=your_gmail_address
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
   GOOGLE_REFRESH_TOKEN=your_google_oauth_refresh_token
   ```

   > Pinecone setup: create an index called `seekai` with 1024 dimensions (to match `mistral-embed`) before uploading any PDFs.
   >
   > Gmail OAuth2 setup: create OAuth2 credentials in Google Cloud Console for the Gmail API, then generate a refresh token for your sending account (e.g. via Google's OAuth2 Playground). This is required — the mail service will fail to start without valid credentials.

3. **Frontend Setup**
   ```bash
   cd ../Frontend
   npm install
   ```

   The frontend currently talks to the backend at a hardcoded `http://localhost:3000` (see [Notes & Known Limitations](#notes--known-limitations)), so no `.env` file is required for local development out of the box.

### Running the Application

**Terminal 1 - Backend**
```bash
cd Backend
npm run dev
```
The server starts on `http://localhost:3000` (port is currently hardcoded).

**Terminal 2 - Frontend**
```bash
cd Frontend
npm run dev
```
The frontend will be available on `http://localhost:5173`.

## Project Structure

```
SeekAI/
├── Backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection
│   │   ├── controllers/      # auth + chat route handlers
│   │   ├── middleware/       # cookie-based JWT auth guard
│   │   ├── model/            # Mongoose schemas (User, Chat, Message)
│   │   ├── routes/           # API route definitions
│   │   ├── services/         # ai.service (agent), rag.service (Pinecone),
│   │   │                     # internet.service (Tavily), mail.service (Gmail OAuth2)
│   │   ├── sockets/          # Socket.IO server + streaming events
│   │   ├── validator/        # express-validator chains for auth
│   │   └── app.js            # Express app configuration
│   ├── server.js             # Server entry point
│   └── package.json
│
└── Frontend/
    ├── src/
    │   ├── app/              # App.jsx, router, Redux store
    │   ├── feature/
    │   │   ├── auth/          # login/register pages, auth slice, Protected route
    │   │   └── chat/          # dashboard, chat slice, socket + REST chat services
    │   ├── main.jsx           # React entry point
    │   └── styles/            # global SCSS
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` — register a new user (`username`, `email`, `password`); sends a verification email
- `POST /api/auth/login` — log in (only succeeds if the account's email is verified); sets a `token` cookie
- `GET /api/auth/get-me` — get the current authenticated user (protected)
- `GET /api/auth/verify-email?token=...` — verify the account via the link sent by email

> There is currently no `/logout` endpoint; ending a session is left to the client (e.g. clearing the cookie).

### Chat
- `POST /api/chat/message` — send a message (`{ message, chatId }`); creates a new chat + title if `chatId` is omitted, responds immediately, then streams the AI's reply over Socket.IO and persists it once generation completes (protected)
- `GET /api/chat/` — list all chats for the authenticated user (protected)
- `GET /api/chat/:chatId/messages` — get message history for a chat (protected)
- `DELETE /api/chat/delete/:chatId` — delete a chat and its messages (protected)
- `POST /api/chat/upload` — upload a PDF (multipart field name `file`) to feed the RAG pipeline (protected)

### WebSocket Events
- `joinChat` *(client → server)* — join the room for a given `chatId` to receive its streamed response
- `aiResponseChunk` *(server → client)* — `{ chatId, text }`, one per streamed token/segment
- `aiResponseComplete` *(server → client)* — `{ chatId, fullText }`, sent once generation finishes
- `aiResponseError` *(server → client)* — `{ chatId, error }`, sent if generation fails
- `disconnect` — standard Socket.IO disconnect

## Environment Variables

### Backend (read by the current code)
| Variable | Description | Required |
|----------|-------------|----------|
| `MONGOOSE_SERVER` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `GOOGLE_GEMINI_API_KEY` | Google Gemini API key (main agent model) | Yes |
| `MISTRALAI_API_KEY` | Mistral API key (chat titles + embeddings) | Yes |
| `TAVILY_API_KEY` | Tavily web search API key | Yes |
| `PINECONE_API_KEY` | Pinecone API key (RAG vector store) | Yes |
| `GOOGLE_USER` | Gmail address used to send verification emails | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth2 client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth2 client secret | Yes |
| `GOOGLE_REFRESH_TOKEN` | Google OAuth2 refresh token | Yes |

### Frontend
The frontend does not currently read any environment variables — API and Socket.IO base URLs are hardcoded to `http://localhost:3000`.

## Available Scripts

### Backend
```bash
npm run dev    # Start development server with nodemon hot reload
```

### Frontend
```bash
npm run dev      # Start Vite development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Key Features Implementation

### AI Agent
- Built with LangChain's `createAgent`, configured with the Gemini model and two tools: `searchInternet` and `queryRAG`
- The agent decides per-message whether a tool call is needed based on a system prompt instructing it to search the web for current info or query the RAG index for document-related questions
- Responses are streamed via `agent.stream(..., { streamMode: "messages" })` and forwarded to the client over Socket.IO as they arrive

### RAG / Document Q&A
- PDFs are parsed server-side with `pdf-parse`, split into ~100-character chunks (`RecursiveCharacterTextSplitter`), and embedded with Mistral's `mistral-embed` (1024 dimensions)
- Chunks are upserted into a Pinecone index named `seekai`; queries embed the question and retrieve the top 5 most similar chunks
- Note: chunk IDs are currently generated as `doc-0`, `doc-1`, ... per upload, so uploading a new PDF can overwrite vectors from a previous one rather than appending to them — worth keeping in mind if you need multiple documents to coexist in the index

### Real-time Chat
- Each chat has its own Socket.IO room (named after the chat's MongoDB `_id`)
- The client joins that room and listens for `aiResponseChunk` / `aiResponseComplete` to render the streaming answer live

### User Management
- JWT-based authentication with the token stored in a cookie (not an `Authorization` header)
- Passwords hashed with bcrypt via a Mongoose `pre('save')` hook
- Registration requires email verification before login is permitted

## Security Features

- JWT-based authentication via cookies
- Password hashing with bcrypt
- Request validation with Express Validator (registration/login)
- Mandatory email verification before login
- Protected API routes via auth middleware

## Database Models

### User
- `username` (unique, 3–30 chars, alphanumeric/underscore)
- `email` (unique)
- `password` (hashed)
- `verified` (boolean, default `false`)
- `createdAt`, `updatedAt`

### Chat
- `user` (reference to User)
- `title` (defaults to `"New Chat"`, generated automatically for new chats)
- `createdAt`, `updatedAt`

### Message
- `chat` (reference to Chat)
- `content` (string)
- `role` (`"user"` or `"ai"`)
- `createdAt`, `updatedAt`

> Messages are stored in their own collection referencing the chat, rather than as an embedded array on the Chat document.

## Notes & Known Limitations

A few things worth knowing if you're picking this codebase up:

- **Hardcoded URLs/ports**: the backend listens on port `3000` and CORS origins are set to `http://localhost:5173` directly in `app.js` / `server.socket.js`, and the frontend points at `http://localhost:3000` directly in its API/socket service files. None of these currently read from environment variables, so deploying beyond localhost means editing those files directly.
- **No logout endpoint** exists yet on either the backend or frontend.
- **`deleteChat` on the frontend currently issues a GET request** to the delete endpoint rather than a DELETE request — double-check this if chat deletion doesn't behave as expected.
- **No LICENSE file** is currently present in the repository despite being referenced below.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License (see `package.json`).

## Support

For support, please open an issue on the GitHub repository or contact the development team.

## Roadmap

Recently shipped:
- [x] Streaming responses for better UX
- [x] PDF upload + RAG-grounded answers

Planned:
- [ ] Configurable backend port / CORS origin / frontend API base URL via environment variables
- [ ] Logout endpoint
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Collaborative chat features
- [ ] Chat history search
- [ ] Export chat functionality

## Acknowledgments

- [LangChain](https://js.langchain.com/) - AI orchestration & agent tooling
- [Google Gemini](https://ai.google.dev/) - Language model
- [Mistral AI](https://mistral.ai/) - Language model & embeddings
- [Tavily](https://tavily.com/) - Web search API
- [Pinecone](https://www.pinecone.io/) - Vector database for RAG
- [React](https://react.dev/) - Frontend framework
- [Express.js](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Socket.IO](https://socket.io/) - Real-time streaming

---

Made with ❤️ by Daniel.
