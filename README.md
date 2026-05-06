# 🎓 Immigration CRM System — 360 College Review

A full-stack CRM platform to manage students applying for study visas, track applications, manage documents, and streamline counsellor workflows.

---

## 🌐 Live Demo

- **Frontend:** https://immigration-crm-system.vercel.app
- **Backend API:** https://immigration-crm-system.onrender.com

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas |
| Real-time | Socket.io |
| Auth | JWT (JSON Web Tokens) |
| File Upload | Multer |
| Hosting | Vercel (Frontend) + Render (Backend) |

---

## 👥 User Roles

| Role | Access |
|------|--------|
| **SuperAdmin** | Full system access, create admins & counsellors |
| **Admin** | Manage students, applications, documents, users |
| **Counsellor** | Manage assigned students, applications |
| **Student** | View own profile, applications, documents |

---

## ✨ Features

### Student Management
- Student onboarding and profile management
- SKU based segmentation (Super Premium, Premium, Value+, Alliance)
- Profile completion meter
- Lead status tracking (Hot, Warm, Cold)

### Application Tracking
- University application management
- Status tracking (Draft → Submitted → Approved → Rejected)
- Document management per application

### Document Management
- Multiple file upload (PDF, JPG, PNG)
- Document types: SOP, LOR, Passport, Financial, Academics
- Document status: Pending, Approved, Rejected

### Chat System (Backend Ready)
- Real-time messaging via Socket.io
- Student ↔ Counsellor communication
- Message history
- Online user tracking

### Admin Panel
- User management (Create Counsellors, Admins)
- Dashboard with stats
- Role-based access control

---

## 🔐 Security
- JWT Authentication
- Role-based middleware
- Bcrypt password hashing
- CORS protection

---

## 📁 Project Structure

```
immigration-CRM-System/
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── socket/
│   │   └── config/
│   ├── server.js
│   └── package.json
└── Frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── layouts/
    │   ├── services/
    │   └── Forms-pages/
    ├── index.html
    └── package.json
```

---

## ⚙️ Local Setup

### Backend
```bash
cd Backend
npm install
# Create .env file with:
# MONGO_URI=your_mongodb_uri
# SECRET_KEY=your_secret_key
# FRONTEND_URL=http://localhost:5173
# PORT=5000
node server.js
```

### Frontend
```bash
cd Frontend
npm install
# Create .env file with:
# VITE_API_URL=http://localhost:5000/api
npm run dev
```

---

## 🔑 Default Login (SuperAdmin)

Create SuperAdmin directly from MongoDB Atlas or contact system administrator.

> SuperAdmin can create Counsellor and Admin accounts from Admin Panel → Users → Create User

---

## 📌 API Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/login | Public |
| POST | /api/auth/register | Public (Student only) |
| GET | /api/students | Auth |
| POST | /api/students | Admin, Counsellor |
| GET | /api/applications | Auth |
| POST | /api/applications | Admin, Counsellor |
| GET | /api/documents/:applicationId | Auth |
| POST | /api/documents | Student, Counsellor |
| GET | /api/dashboard | Auth |
| POST | /api/chat | Auth |
| GET | /api/message/:chatId | Auth |

---

## 🛣️ Roadmap

- [x] Auth System (Login, Register, JWT)
- [x] Student Management
- [x] Application Tracking
- [x] Document Management
- [x] Admin Panel
- [x] Real-time Chat Backend
- [ ] Chat Frontend
- [ ] WhatsApp Integration
- [ ] Offer Management
- [ ] Visa Preparation Module
- [ ] Partner Schools Portal
- [ ] Student Feedback System

---

## 👨‍💻 Developed By

**Karanpartap Singh**
5K-WebTech, Mohali

---

## 📄 License

This project is private and developed for 360 College Review.
