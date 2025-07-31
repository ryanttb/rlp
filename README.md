# Rapid Liquid Printing - 3D Printing Platform

A modern web application for managing 3D printing workflows, built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features (Planned)

- **3D Model Gallery**: Interactive visualization and management of 3D models
- **Print Queue Management**: Real-time monitoring and control of print jobs
- **Production Workflows**: Streamlined processes for manufacturing operations
- **Real-time Machine Interaction**: Live communication with 3D printing systems
- **Cloud-Deployed Platform**: Scalable architecture for enterprise use

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **3D Visualization**: Three.js (planned)
- **Backend**: Node.js APIs (planned)
- **Database**: Firebase Firestore (planned)
- **Authentication**: Firebase Auth (planned)
- **Deployment**: Vercel/Google Cloud Platform

## 🏗 Architecture Highlights

- **Component-Driven Design**: Modular, reusable UI components
- **Type Safety**: Full TypeScript implementation
- **Performance**: Optimized for real-time 3D rendering
- **Scalability**: Cloud-native architecture
- **Testing**: Comprehensive test coverage (planned)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Firebase project (for database and file storage)

### Setup

1. **Clone and install dependencies**
```bash
npm install
```

2. **Firebase Configuration**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Firestore Database and Storage
   - Copy your Firebase config from Project Settings
   - Create `.env.local` file with your Firebase credentials:
   ```bash
   cp env.example .env.local
   # Edit .env.local with your Firebase config
   ```

3. **Run development server**
```bash
npm run dev
```

4. **Build for production**
```bash
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📋 Development Roadmap

- [x] Basic Next.js setup with TypeScript
- [x] Firebase & Firestore integration
- [x] Database schema and types
- [x] File storage service
- [ ] 3D model upload component
- [ ] Model gallery display
- [ ] 3D model viewer component
- [ ] Print queue interface
- [ ] Real-time status updates
- [ ] User authentication
- [ ] Performance optimization
- [ ] Comprehensive testing

## 🎯 Job Interview Preparation

This project demonstrates:
- Modern React/Next.js development
- TypeScript proficiency
- Component-driven architecture
- Scalable system design
- Real-time application capabilities
- 3D visualization expertise

---

*Built for Rapid Liquid Printing technical interview preparation*
