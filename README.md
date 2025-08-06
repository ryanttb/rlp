# Rapid Liquid Printing (RLP) Platform

A modern, cloud-deployed 3D printing platform built with Next.js, TypeScript, and Google Cloud Platform.

## 🚀 Project Overview

This is a Next.js/TypeScript application for Rapid Liquid Printing (https://www.rapidliquidprint.com/) job interview. The app is a comprehensive 3D printing platform featuring:

- **Next.js 15** + TypeScript + Tailwind CSS
- **Firebase Firestore** (database) + Storage (file uploads)
- **Google Cloud Platform** deployment with App Engine
- **Component-driven architecture** with reusable components
- **3D visualization** with Three.js
- **Real-time features** and scalable architecture

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **3D Visualization**: Three.js with multiple format support (STL, OBJ, PLY, FBX, DAE)
- **Backend**: Node.js, Firebase Firestore, Google Cloud Storage
- **Infrastructure**: Google Cloud Platform, App Engine, Terraform
- **Development**: Turbopack, ESLint, PostCSS

## 📋 Prerequisites

- Node.js 18+ and npm
- Google Cloud Platform account
- gcloud CLI (installed)
- Terraform (installed)

## 🚀 Quick Start

### Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick deployment**:
```bash
# Set your GCP project
export GOOGLE_CLOUD_PROJECT="your-project-id"

# Run automated deployment
./deploy.sh
```

## 🏗️ Project Structure

```
rlp/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # Reusable React components
│   ├── lib/                 # Utility libraries
│   └── types/               # TypeScript type definitions
├── terraform/               # Infrastructure as Code
├── app.yaml                 # App Engine configuration
├── deploy.sh               # Automated deployment script
└── DEPLOYMENT.md           # Deployment guide
```

## 🌟 Features

### Core Functionality
- **3D Model Gallery**: Interactive visualization and management
- **Print Queue Management**: Real-time monitoring and control
- **Production Workflows**: Streamlined manufacturing processes
- **Real-time Machine Interaction**: Live communication with 3D printers
- **Cloud-Deployed Platform**: Scalable enterprise architecture
- **Advanced Analytics**: Performance insights and efficiency metrics

### Technical Features
- **Multi-format 3D Support**: STL, OBJ, PLY, FBX, DAE files
- **Real-time Updates**: Live status monitoring
- **Responsive Design**: Mobile and desktop optimized
- **Dark Mode**: Modern UI with theme support
- **Type Safety**: Full TypeScript implementation
- **Performance Optimized**: Next.js 15 with Turbopack

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
GOOGLE_CLOUD_PROJECT=your-project-id
CLOUD_STORAGE_BUCKET=your-storage-bucket
```

### Firebase Configuration

The application uses Firebase for:
- **Firestore**: NoSQL database for application data
- **Storage**: File uploads and 3D model storage

## 📊 Infrastructure

The application is designed for Google Cloud Platform with:

- **App Engine**: Scalable hosting with automatic scaling
- **Cloud Storage**: Static asset and file storage
- **Firestore**: NoSQL database
- **Terraform**: Infrastructure as Code for reproducible deployments

## 🚀 Deployment Status

✅ **Development Environment**: Fully functional
✅ **Dependencies**: All installed and working
✅ **Build Process**: Configured and tested
✅ **Infrastructure**: Terraform configuration ready
✅ **Deployment Scripts**: Automated deployment available

## 📝 Next Steps

1. **Configure GCP Project**: Set up your Google Cloud project
2. **Update Configuration**: Modify `terraform/terraform.tfvars`
3. **Deploy**: Run `./deploy.sh` for automated deployment
4. **Monitor**: Use GCP Console for monitoring and logs

## 🤝 Contributing

This project is designed for a job interview with Rapid Liquid Printing. The codebase demonstrates:

- Modern React/Next.js development practices
- TypeScript implementation
- Google Cloud Platform integration
- 3D visualization capabilities
- Scalable architecture design
- Infrastructure as Code practices

## 📄 License

This project is created for interview purposes with Rapid Liquid Printing.

---

**Built for the future of additive manufacturing** 🏭
