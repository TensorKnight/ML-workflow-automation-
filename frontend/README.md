# ML Workflow Automation Frontend

A modern React frontend for the ML Workflow Automation platform, built with Vite, TypeScript, and Material-UI.

## 🚀 Features

- **Step-by-step ML Pipeline**: Guided workflow from data upload to model deployment
- **Real-time Progress Tracking**: Live updates on data processing and model training
- **Interactive Data Visualization**: Charts and graphs for data quality and model performance
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **TypeScript Support**: Full type safety and better development experience
- **Modern UI Components**: Beautiful Material-UI components with consistent design

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Material-UI (MUI)** - React component library for beautiful UIs
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Axios** - HTTP client for API communication
- **React Dropzone** - File upload with drag & drop

## 📦 Installation

### Quick Start (Recommended)

1. **Navigate to the frontend directory**
   ```bash
   cd ml-workflow-frontend
   ```

2. **Run the setup script**
   ```bash
   node setup.js
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

### Manual Installation

1. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   VITE_API_URL=http://localhost:8000
   VITE_APP_NAME=ML Workflow Automation
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

### Troubleshooting

If you encounter dependency conflicts:

1. **Use simplified dependencies**
   ```bash
   node setup.js --simple
   ```

2. **Or manually use legacy peer deps**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Check TROUBLESHOOTING.md** for detailed solutions

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Navbar.tsx       # Main navigation
│   └── workflow/        # Workflow step components
│       ├── DataUpload.tsx
│       ├── DataPreprocessing.tsx
│       ├── FeatureEngineering.tsx
│       ├── ModelTraining.tsx
│       └── Results.tsx
├── pages/               # Page components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── NewProject.tsx   # Project creation workflow
│   └── ProjectPage.tsx # Individual project view
├── services/            # API services
│   └── api.ts          # API client and endpoints
├── hooks/              # Custom React hooks
│   ├── useProject.ts   # Project-related hooks
│   └── useMLPipeline.ts # ML pipeline hooks
├── utils/               # Utility functions
│   ├── constants.ts    # App constants
│   └── helpers.ts      # Helper functions
├── App.tsx             # Main app component
└── main.tsx            # App entry point
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 UI Components

### Workflow Steps

1. **Data Upload** - Drag & drop file upload with quality assessment
2. **Data Preprocessing** - Configure missing value handling, encoding, scaling
3. **Feature Engineering** - Auto-generate features and create custom ones
4. **Model Training** - Train multiple models and compare performance
5. **Results** - View model performance and download results

### Key Features

- **File Upload**: Support for CSV, Excel, JSON, and Parquet files
- **Data Quality Report**: Automatic analysis of uploaded datasets
- **Interactive Configuration**: Easy-to-use forms for ML pipeline setup
- **Real-time Progress**: Live updates during model training
- **Performance Visualization**: Charts and tables for model comparison
- **Export Functionality**: Download models and reports

## 🔌 API Integration

The frontend communicates with the backend through a REST API:

- **Projects**: Create, read, update, delete projects
- **Datasets**: Upload and manage datasets
- **ML Pipeline**: Run data ingestion, preprocessing, feature engineering, and training
- **Background Jobs**: Monitor long-running tasks
- **Results**: Retrieve model performance metrics

## 🎯 Usage

### Creating a New Project

1. Click "New Project" on the dashboard
2. Upload your dataset (CSV, Excel, JSON, Parquet)
3. Review the data quality report
4. Configure preprocessing options
5. Set up feature engineering
6. Train models and compare performance
7. Download results and models

### Managing Projects

- View all projects on the dashboard
- Click on a project to see detailed results
- Retrain models with different configurations
- Share projects with team members

## 🚀 Deployment

### Production Build

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Docker Deployment

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment Variables

- `VITE_API_URL` - Backend API URL
- `VITE_APP_NAME` - Application name
- `VITE_MAX_FILE_SIZE_MB` - Maximum file upload size
- `VITE_SUPPORTED_FILE_TYPES` - Allowed file types

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue on GitHub
- Check the documentation
- Contact the development team

## 🔄 Updates

- **v1.0.0** - Initial release with basic ML workflow
- **v1.1.0** - Added real-time progress tracking
- **v1.2.0** - Enhanced data visualization
- **v1.3.0** - Mobile responsive design
