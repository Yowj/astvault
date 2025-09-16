# ASTVault

A modern template management platform with AI-powered features, built with React and Supabase.

## 🚀 Features

- **Template Management**: Create, browse, and manage code templates with categories and search
- **AI Grammar Enhancer**: Improve text quality with AI-powered grammar enhancement
- **AI Chat Assistant**: Interactive AI chat for coding help and questions
- **User Authentication**: Secure login and signup with user profiles
- **Real-time Features**: Online user tracking and live updates
- **Responsive Design**: Mobile-first design with DaisyUI components
- **Dark/Light Themes**: Theme switching with persistent preferences

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS, DaisyUI
- **Backend**: Supabase (Database, Auth, Real-time)
- **State Management**: Zustand, TanStack Query
- **Routing**: React Router v7
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd astvault-yowjprojects
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL="your supabase url"
   VITE_SUPABASE_ANON_KEY="your supabase anon key"
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── templates/      # Template management components
│   └── ui/             # General UI components
├── hooks/              # Custom React hooks
├── pages/              # Route components
├── services/           # API and external services
└── store/              # State management
```

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Set up the required database tables for templates and user management
3. Configure authentication providers as needed
4. Update environment variables with your project credentials

### Deployment

The project is configured for Vercel deployment with SPA routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

## 🎯 Key Features

### Template Management
- Create and organize code templates by category
- Search templates by title or description
- Pagination for large template collections
- Real-time updates across users

### AI Features
- Grammar enhancement for improving text quality
- Interactive AI chat for coding assistance
- Edge functions for optimal performance

### User Experience
- Responsive design for all device sizes
- Theme switching with persistent preferences
- Loading states and error handling
- Toast notifications for user feedback

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
