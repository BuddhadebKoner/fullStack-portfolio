# 🚀 Full-Stack Portfolio - Next.js

> A modern, feature-rich portfolio website built with Next.js, TypeScript, and MongoDB. Perfect for developers, designers, and creators who want to showcase their work professionally.

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

## ✨ Features

- 🎨 **Modern UI/UX** - Beautiful glassmorphic design with smooth animations
- 📝 **Blog Management** - Rich text editor with markdown support
- 💼 **Project Showcase** - Display your projects with detailed descriptions
- 🛠️ **Skills Management** - Organize and display your technical skills
- 💬 **AI-Powered Chat** - Integrated Gemini AI for visitor interactions
- 🔐 **Authentication** - Secure admin panel with Clerk authentication
- 📊 **Analytics Dashboard** - Track blog views and engagement
- 📱 **Responsive Design** - Perfect on all devices
- ⚡ **Performance Optimized** - Built with Next.js 15 and Turbopack

## 📸 Screenshots

### 🏠 Home Page
![Home Page](https://res.cloudinary.com/dsfztnp9x/image/upload/v1750497003/Screenshot_2025-06-21_at_14-32-05_Buddhadeb_Koner_FullStack_Web_Developer_bbi2pm.png)

### 📚 All Blogs
![All Blogs](https://res.cloudinary.com/dsfztnp9x/image/upload/v1750497006/Screenshot_2025-06-21_at_14-32-26_Buddhadeb_Koner_FullStack_Web_Developer_txkefa.png)

### 📖 Blog Details
![Blog Details](https://res.cloudinary.com/dsfztnp9x/image/upload/v1750497000/Screenshot_2025-06-21_at_14-32-55_Buddhadeb_Koner_FullStack_Web_Developer_li7myr.png)

### ✨ Glassmorphic Effects
![Glassmorphic Effects](https://res.cloudinary.com/dsfztnp9x/image/upload/v1750497000/Screenshot_2025-06-20_at_10-31-47_Buddhadeb_Koner_FullStack_Web_Developer_d5qnbk.png)

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Motion (Framer Motion)
- **Backend**: Next.js API Routes, MongoDB with Mongoose
- **Authentication**: Clerk
- **AI Integration**: Google Gemini AI
- **State Management**: TanStack Query (React Query)
- **Rich Text Editor**: TipTap, React Quill
- **Charts**: Chart.js, Recharts
- **Icons**: Lucide React, Tabler Icons
- **Package Manager**: Bun

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- MongoDB database
- Clerk account
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/full-stack-portfolio.git
   cd full-stack-portfolio
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI="your_mongodb_connection_string"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   CLERK_SECRET_KEY="your_clerk_secret_key"
   GOOGLE_GEMINI_API_KEY="your_gemini_api_key"
   ```

4. **Run the development server**
   ```bash
   bun dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/                    # Next.js 13+ app directory
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── blog/              # Blog pages
│   └── ...
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── models/                # MongoDB models
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

## 🎯 Core Features

### 📝 Content Management
- **Blog System**: Create, edit, and publish blog posts with rich text editing
- **Project Showcase**: Add your projects with images, descriptions, and live/repo links
- **Skills Management**: Organize your technical skills by categories
- **Work Experience**: Timeline of your professional journey

### 🤖 AI Integration
- **Smart Chat**: Visitors can chat with an AI assistant about your work
- **Context-Aware**: AI understands your portfolio content for better responses

### 📊 Analytics
- **Blog Analytics**: Track views, engagement, and popular content
- **Dashboard**: Visual insights into your portfolio performance

### 🔐 Admin Panel
- **Secure Authentication**: Clerk-powered authentication system
- **Content Management**: Easy-to-use admin interface
- **Real-time Updates**: Instant content updates across the site

## 🎨 Customization

### Styling
- Built with Tailwind CSS for easy customization
- Glassmorphic design components
- Responsive design principles
- Dark/light mode support

### Content
- Modify content through the admin panel
- Update personal information, skills, and projects
- Customize blog categories and tags

## 📱 Mobile Responsive

The portfolio is fully responsive and works perfectly on:
- 📱 Mobile devices
- 📱 Tablets
- 💻 Laptops
- 🖥️ Desktop computers

## 🌟 Use This Portfolio for Your Own

This repository is completely free to use for your own portfolio! Here's how you can get started:

### 🎯 What You Can Do

1. **Fork & Customize**: Fork this repository and make it your own
2. **No License Required**: Use it freely for personal or commercial purposes
3. **Easy Setup**: Follow the installation guide above
4. **Content Management**: Use the admin panel to add your own content

### 📝 Getting Your Content

To populate your portfolio with your own content, simply:

1. **Set up the admin panel** by following the installation guide
2. **Log in to the admin dashboard** at `/admin`
3. **Add your content**:
   - Upload your profile information
   - Add your projects with descriptions and links
   - Write blog posts about your experiences
   - List your technical skills
   - Add your work experience

### 🔄 Content Collection

The beauty of this system is that all your content is managed through the intuitive admin interface. No need to edit code files directly - just log in and start adding your information through the web interface.

### 🚀 Deploy Your Portfolio

Once you've customized your content, deploy it to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **Any platform that supports Node.js**

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- Built with ❤️ using Next.js and modern web technologies
- UI inspiration from modern portfolio designs
- Thanks to the open-source community for amazing tools and libraries

---

⭐ **If you find this portfolio template helpful, please give it a star!** ⭐

**Happy coding!** 🚀