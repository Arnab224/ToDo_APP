# 📝 Full Stack TODO App (AI Enhanced)

This is a full-stack TODO application built using the MERN stack (MongoDB, Express, React, Node.js), enhanced with AI features like task suggestions and voice input.

## 🔧 Project Structure

TODO_APP/
├── client/               # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── AI/           # AI features (e.g., task suggestion, voice input)
│   │   └── assets/       # Static assets
│   ├── index.html
│   ├── App.jsx
│   └── …
├── server/               # Backend (Node.js + Express)
│   ├── controller/
│   ├── model/
│   ├── routers/
│   ├── middleware/
│   ├── config/           # DB connection, etc.
│   ├── uploads/          # Uploaded files
│   └── index.js          # Entry point
├── .gitignore
├── README.md
└── docker-compose.override.yml

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/todo-app.git
cd todo-app

2. Install dependencies
Frontend
cd client
npm install

Backend
cd ../server
npm install

⚙️ Running the App

Frontend (Vite + React)
cd client
npm run dev

Backend (Express)
cd server
npm run dev

Make sure to set up your .env file with:
PORT=3000
MONGO_URI=your_mongo_db_url
JWT_SECRET=your_jwt_secret

🧠 AI Features
	•	Task Suggestions using OpenAI API
	•	Voice Input to add tasks
	•	Chat With Your TODO List feature

Make sure your OpenAI key is in the backend .env:
OPENAI_API_KEY=your_openai_api_key