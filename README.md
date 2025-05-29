# Matcha - Modern Dating Application 🥂

A full-stack dating application built with modern technologies, featuring real-time interactions, user matching, and profile management.

## 🚀 Tech Stack

### Frontend
- **Framework**: Nuxt 3 (Vue.js)
- **State Management**: Pinia
- **Routing**: Vue Router
- **Package Manager**: Yarn

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **File Storage**: AWS S3
- **Email Services**: Multiple providers (Mailgun, Mailjet, Sendinblue)
- **Push Notifications**: Web Push API

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Local AWS**: LocalStack for S3 emulation
- **Database**: PostgreSQL (containerized)

## 🛠️ Project Structure

```
matchaV2/
├── frontend/           # Nuxt 3 frontend application
│   ├── components/     # Vue components
│   ├── composables/    # Vue composables
│   ├── pages/         # Application pages
│   ├── layouts/       # Page layouts
│   ├── store/         # Pinia stores
│   └── public/        # Static assets
├── backend/           # Express.js backend application
│   ├── src/          # TypeScript source code
│   └── prisma/       # Database schema and migrations
├── database/         # Database related files
├── volume/          # Persistent storage for LocalStack
└── docker-compose.yml # Container orchestration
```

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js (v16 or higher)
- Yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd matchaV2
```

2. Start the development environment:
```bash
docker-compose up -d
```

3. Install frontend dependencies:
```bash
cd frontend
yarn install
```

4. Install backend dependencies:
```bash
cd ../backend
yarn install
```

### Development

1. Start the frontend development server:
```bash
cd frontend
yarn dev
```

2. Start the backend development server:
```bash
cd backend
yarn dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- PostgreSQL: localhost:5432
- LocalStack (S3): http://localhost:4566

## 🔑 Environment Variables

### Backend (.env)
Create a `.env` file in the backend directory with the following variables:
```
DATABASE_URL=postgresql://postgres:postgres@db:5432/matcha
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_REGION=us-east-1
```

### Frontend (.env)
Create a `.env` file in the frontend directory with:
```
NUXT_PUBLIC_API_BASE=http://localhost:3001
```

## 🌟 Features

- User authentication and authorization
- Profile management with photo uploads
- Real-time matching system
- Push notifications
- Email notifications
- User search and filtering
- Chat functionality
- Profile verification
- Location-based matching

## 📝 License

This project is part of the 42 school curriculum.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

Built with ❤️ for 42 school
