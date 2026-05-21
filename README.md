# 🎮 AI Ludo — Real-Time Full-Stack Multiplayer Game with AI Agents

A real-time, full-stack multiplayer Ludo game built with a modern web architecture featuring Socket.IO-based synchronization, persistent backend state, and AI-powered fallback players for disconnected users.

This project demonstrates end-to-end engineering across frontend, backend, real-time systems, database design, and lightweight AI agent logic.

---

## 🚀 Live Features

### 🎯 Real-Time Multiplayer Engine
- 2–4 player live Ludo gameplay in browser
- Fully synchronized game state using Socket.IO
- No polling — all updates are event-driven
- Server-authoritative game logic (anti-cheat architecture)

### 🤖 AI Agent System (Disconnected Player Handling)
- AI automatically takes over disconnected players
- Performs:
  - Dice rolling
  - Valid move selection
  - Rule-compliant gameplay actions
- Ensures uninterrupted matches

> Lightweight rule-based agent system integrated into real-time gameplay

---

### 🧠 Full-Stack Architecture
- Secure authentication system (login/signup)
- Persistent user accounts with coin system
- Match history tracking (complete game records)
- Global leaderboard with ranking + tiebreak logic

---

### 💬 Real-Time Communication
- Live in-game chat using Socket.IO
- System notifications:
  - captures
  - turns
  - wins
- Real-time game event log

---

### 🎲 Game Engine (Server-Side Logic)
- Server-side dice rolling (anti-cheat)
- Complete Ludo rule implementation:
  - Token movement validation
  - Captures & safe zones
  - Home stretch logic
  - Win detection
- 20-second turn timer with auto-move fallback

---

## 🏗️ Tech Stack

### Frontend
- React (Vite)
- React Router
- Context API (Auth + Game State)
- Socket.IO Client
- Axios

### Backend
- Node.js
- Express.js
- Socket.IO
- MongoDB + Mongoose

---

## 🧩 Architecture Overview
Client (React)
↓ Socket Events
Socket.IO Gateway
↓
Game Controller (Server Logic)
↓
MongoDB (Persistence)


### Design Principles
- Server is single source of truth
- Client is purely UI-driven
- Event-based real-time updates
- Room-based multiplayer isolation

---

## 🤖 AI System (Agent Logic)

When a player disconnects:
1. Server detects disconnect event
2. Player is assigned to AI controller
3. AI performs:
   - Valid dice roll
   - Legal token selection
   - Move execution

Ensures:
- No game interruption
- Continuous multiplayer flow
- Rule-compliant automated behavior

---

## 📊 Core Modules

- Authentication System (JWT/cookies)
- Real-Time Game Engine
- AI Player Module (fallback system)
- Chat System (Socket events)
- Leaderboard Engine (coin ranking + tie-break logic)
- Match History Tracker

---

## 🗄️ Database Schema

### User
- username (unique)
- password
- dob
- coins (default: 100)
- total games played

### Game
- players (with rank + rewards)
- status: waiting / playing / finished
- timestamps
- full match history

---
## ⚡ Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/your-username/ai-ludo.git
cd ai-ludo
```

### 2. Install Backend 
```bash
cd server
npm install
npm run dev
```

### 3. Install Frontend 
```bash
cd client
npm install
npm run dev
```

### 4. Environment Variables

Create `config.env` inside `/server`:
```bash
PORT=8000
MONGO_URI=your_mongodb_connection_string
NODE_ENV=development
```

## 🌐 Routes

- `/` → Landing page
- `/login` → Login
- `/signup` → Register
- `/home` → Dashboard
- `/newgame/lobby` → Game lobby
- `/newgame/:id` → Live game
- `/leaderboard` → Rankings
- `/history` → Match history
- `/update-profile` → Profile settings

## 📈 What This Project Demonstrates

### ✔ Full-Stack Engineering
- End-to-end system design
- REST + real-time hybrid architecture
- Modular backend design

### ✔ Real-Time Systems
- Socket.IO synchronization
- Multiplayer state management
- Low-latency event updates

### ✔ AI Integration
- Rule-based agent system
- Autonomous fallback player
- Event-driven decision execution

### ✔ Production-Level Design
- Server-side validation (anti-cheat)
- Persistent state storage
- Scalable architecture patterns

## 🔮 Future Improvements

- Reinforcement learning-based AI opponent
- Matchmaking system
- Spectator mode
- Redis-based scaling
- Voice chat integration

## 👨‍💻 Author

Built as a full-stack + AI systems project demonstrating:

- Real-time system design
- Backend architecture
- Frontend engineering
- AI agent integration

## ⭐ Why This Project Stands Out

- Real-time multiplayer synchronization
- Server-authoritative game engine
- AI-powered fallback system
- Production-style architecture
- Full-stack + systems + AI combination