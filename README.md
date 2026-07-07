# 🌱 EcoNova — Smart Waste Management Platform

EcoNova is a full-stack smart waste management platform that combines IoT monitoring, machine learning, and community-driven recycling to make urban waste collection more efficient and sustainable.

Built as part of the **AICTE Activity Point Programme** (Course Code: 19Z615, Theme 14) at PSG College of Technology.

🔗 **Live App:** [econova-silk.vercel.app](https://econova-silk.vercel.app)

---

## ✨ Features

- **📡 Simulated IoT Bin Monitor** — Real-time simulated fill-level tracking for smart bins across the city
- **🧠 ML Route Optimizer** — Uses K-Means clustering and Nearest Neighbor algorithms to generate optimized waste collection routes
- **♻️ Recycler Marketplace** — Connects users with local recyclers to buy/sell recyclable materials
- **💬 FAQ Chatbot** — Keyword-based chatbot to answer common waste management queries
- **🔐 Secure Authentication** — JWT-based user authentication and session management

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, Tailwind CSS |
| **Backend** | Python (FastAPI) |
| **Database** | PostgreSQL (via Supabase) |
| **Machine Learning** | scikit-learn (K-Means, Nearest Neighbor) |
| **Auth** | JWT |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js and npm
- Python 3.9+
- A Supabase account (for PostgreSQL database)

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## 📄 License

This project was developed for academic purposes as part of the AICTE Activity Point Programme.
