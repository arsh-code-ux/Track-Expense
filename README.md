# Track Expense - Personal Finance Manager# Track Expense (Full Stack)



A beautiful and feature-rich expense tracking application built with React and Node.js.This repository contains a minimal full-stack Expense Tracker with an AI chatbot assistant.



## Features**Features:**

- Add/view transactions (income/expense)

✨ **Dashboard Overview**- Spending visualization with pie charts

- Beautiful gradient design with glass morphism effects- AI chatbot for financial insights and advice

- Real-time financial statistics and insights- Budget tracking capabilities

- Responsive design for all devices

## Structure

💰 **Transaction Management**- `backend/` - Express + MongoDB server

- Add, edit, and delete transactions- `frontend/` - Vite + React UI

- Categorize expenses and income

- Advanced filtering and search## Prerequisites

- Node.js (v16+)

📊 **Budget Tracking**- MongoDB (local or cloud)

- Create and manage budgets by category- OpenAI API key (or compatible LLM service)

- Visual progress indicators

- Budget alerts and notifications## Quick Start



🎯 **Savings Goals**### 1. Start MongoDB

- Set and track financial goalsMake sure MongoDB is running locally:

- Progress visualization```bash

- Milestone achievementsmongod

```

🔔 **Smart Alerts**Or use MongoDB Atlas cloud service.

- Low balance warnings

- Budget overspending alerts### 2. Backend Setup

- Savings goal progress notifications```bash

cd backend

⚙️ **User Preferences**npm install

- Multiple currency supportcp .env.example .env

- Theme customization```

- Personalized settings

Edit `.env` file:

## Tech Stack```bash

PORT=4000

**Frontend:**MONGODB_URI=mongodb://localhost:27017/track_expense

- React 18 with ViteJWT_SECRET=your_super_secret_jwt_key_here

- Tailwind CSS with custom gradientsOPENAI_API_KEY=sk-your-openai-api-key

- Lucide React icons```

- Responsive design

Start backend server:

**Backend:**```bash

- Node.js with Expressnpm run dev

- MongoDB with Mongoose```

- JWT Authentication

- RESTful API design### 3. Frontend Setup

```bash

## Quick Startcd frontend

npm install

1. **Install Dependencies**npm run dev

   ```bash```

   # Install backend dependencies

   cd backend && npm installThe frontend will be available at http://localhost:3000 and will proxy API calls to the backend on port 4000.

   

   # Install frontend dependencies## Usage

   cd ../frontend && npm install1. Open http://localhost:3000

   ```2. Navigate to Dashboard to add transactions and view charts

3. Use the Chat page to ask your AI assistant about spending patterns

2. **Environment Setup**4. Login/Register functionality is included in the API but not fully wired in the UI

   - Copy `backend/.env.example` to `backend/.env`

   - Configure your MongoDB connection string## Notes

   - Set JWT secret key- The AI chat uses OpenAI's API; configure your API key in backend `.env`

- Authentication is basic; enhance security before production

3. **Run the Application**- The project is designed to be extended with additional features

   ```bash
   # Start backend (from root directory)
   npm run dev:backend
   
   # Start frontend (from root directory)
   npm run dev:frontend
   ```

4. **Access the App**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3005

## Project Structure

```
TRACK-EXPENSE/
├── backend/          # Express.js API server
│   ├── src/          # Source code
│   ├── .env          # Environment variables
│   └── package.json  # Backend dependencies
├── frontend/         # React application
│   ├── src/          # Source code
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
└── package.json      # Root package with scripts
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Create transaction
- `GET /api/budgets` - Get user budgets
- `POST /api/budgets` - Create budget
- `GET /api/savings-goals` - Get savings goals
- `POST /api/savings-goals` - Create savings goal
- `GET /api/alerts` - Get user alerts

## Deployment

The application is ready for deployment with:
- Environment-based configuration
- Production-optimized builds
- Secure authentication
- Error handling and logging

Enjoy tracking your finances! 💸✨