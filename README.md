# Immigration CRM System

A comprehensive Customer Relationship Management system designed specifically for immigration consultancies and legal firms to streamline client management, document tracking, and case processing workflows.

🔗 **Live Demo:** [immigration-crm-system.vercel.app](https://immigration-crm-system.vercel.app)

## 📋 Overview

The Immigration CRM System is a full-stack web application that helps immigration consultants and firms manage their clients, track visa applications, monitor case progress, and maintain organized documentation throughout the immigration process.

## ✨ Features

### Client Management
- **Centralized Client Database** - Store and manage all client information in one secure location
- **Contact Information** - Track client details, contact preferences, and communication history
- **Document Management** - Upload, organize, and track important client documents
- **Client Portal** - Allow clients to view their case status and upload documents

### Case Management
- **Application Tracking** - Monitor the status of visa applications and cases in real-time
- **Timeline Management** - Track important deadlines and milestones
- **Case Notes** - Maintain detailed notes and updates for each case
- **Status Updates** - Keep clients informed with automated status notifications

### Document Processing
- **Document Templates** - Use pre-built templates for common immigration forms
- **File Upload & Storage** - Securely store client documents with version control
- **Document Verification** - Track document verification status and requirements
- **Digital Signatures** - Collect and manage digital signatures

### Workflow Automation
- **Task Automation** - Automate repetitive tasks and reminders
- **Email Notifications** - Send automated updates to clients and team members
- **Deadline Reminders** - Never miss important filing deadlines
- **Custom Workflows** - Create workflows tailored to different visa types

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI framework for building interactive interfaces
- **JavaScript** - Core programming language
- **CSS/Styled Components** - Responsive and modern styling
- **Vercel** - Deployment and hosting platform

### Backend
- **Node.js** - Server-side JavaScript runtime
- **Express.js** - Web application framework
- **RESTful API** - Clean API architecture for frontend-backend communication

### Database
- **MongoDB/PostgreSQL** - (Specify your database)
- Secure data storage with encryption

### Authentication & Security
- JWT-based authentication
- Role-based access control (RBAC)
- Data encryption at rest and in transit
- GDPR compliant data handling

## 🚀 Getting Started

### Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14.x or higher)
- npm or yarn
- MongoDB/PostgreSQL (based on your configuration)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/iamkrn/immigration-CRM-System.git
   cd immigration-CRM-System
   ```

2. **Install Backend Dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../Frontend
   npm install
   ```

4. **Environment Configuration**

   Create a `.env` file in the Backend directory:
   ```env
   PORT=5000
   DATABASE_URL=your_database_connection_string
   JWT_SECRET=your_jwt_secret_key
   EMAIL_SERVICE=your_email_service
   EMAIL_USER=your_email
   EMAIL_PASSWORD=your_email_password
   ```

   Create a `.env` file in the Frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

5. **Run the Application**

   Start the backend server:
   ```bash
   cd Backend
   npm start
   ```

   In a new terminal, start the frontend:
   ```bash
   cd Frontend
   npm start
   ```

6. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## 📁 Project Structure

```
immigration-CRM-System/
├── Backend/
│   ├── controllers/      # Request handlers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── config/          # Configuration files
│   └── server.js        # Entry point
│
├── Frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── utils/       # Utility functions
│   │   ├── context/     # React context
│   │   └── App.js       # Main app component
│   └── package.json
│
└── README.md
```

## 🔐 User Roles & Permissions

### Admin
- Full system access
- User management
- System configuration
- Reports and analytics

### Consultant/Case Manager
- Manage assigned cases
- Update case status
- Upload and manage documents
- Communicate with clients

### Client
- View case status
- Upload required documents
- Communicate with assigned consultant
- Access personal information

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get specific client
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Cases
- `GET /api/cases` - Get all cases
- `GET /api/cases/:id` - Get specific case
- `POST /api/cases` - Create new case
- `PUT /api/cases/:id` - Update case
- `DELETE /api/cases/:id` - Delete case

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/:id` - Get document
- `DELETE /api/documents/:id` - Delete document

## 🧪 Testing

Run tests for the backend:
```bash
cd Backend
npm test
```

Run tests for the frontend:
```bash
cd Frontend
npm test
```

## 📦 Deployment

### Frontend (Vercel)
The frontend is automatically deployed to Vercel from the main branch.

### Backend
Deploy the backend to your preferred hosting service (e.g., Heroku, AWS, DigitalOcean):

```bash
# Example for Heroku
heroku create your-app-name
git push heroku main
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**iamkrn**
- GitHub: [@iamkrn](https://github.com/iamkrn)

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Built with modern web technologies and best practices
- Designed to meet the specific needs of immigration consultancies

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

## 🗺️ Roadmap

- [ ] Multi-language support
- [ ] Mobile application (iOS/Android)
- [ ] Advanced analytics and reporting
- [ ] Integration with government portals
- [ ] AI-powered document verification
- [ ] Video consultation feature
- [ ] Payment gateway integration

---

Made with ❤️ for immigration professionals worldwide
