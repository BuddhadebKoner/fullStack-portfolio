"use client";

import { useState } from "react";
import Header from "@/components/Header";
import SkillsCard from "@/components/SkillsCard";
import ConnectCard from "@/components/ConnectCard";
import BlogsSection from "@/components/BlogsSection";
import WorkExperience from "@/components/WorkExperience";
import ProjectsSection from "@/components/ProjectsSection";
import ChatPopup from "@/components/ChatPopup";
import FloatingChatButton from "@/components/FloatingChatButton";
import Footer from "@/components/Footer";


const skills = [
  "Next JS",
  "React",
  "TypeScript",
  "JavaScript",
  "Node JS",
  "Express",
  "MongoDB",
  "Appwrite",
  "AWS",
  "Tailwind CSS",
  "Vercel",
  "Git",
  "Ai",
];

const blogs = [
  {
    title: "Top 5 Free React Native Ui Component Libraries in 2025",
    desc: "Five awesome, free React Native component libraries that will boost your productivity and make your ...",
  },
  {
    title: "How to Add Custom Fonts in React Native with Tailwind CSS",
    desc: "Custom fonts in React Native can elevate your app's design and user experience. In this blog post, w...",
  },
  {
    title: "Top 5 Note-Taking Platforms for Productivity and Creativity",
    desc: "Note-Taking Platforms for Productivity and Creativity...",
  },
];

const projects = [
  {
    title: "Build Portfolio",
    desc: "It is a portfolio builder tool where you can create your portfolio in...",
    img: "/images/portfolio.png",
  },
  {
    title: "Developer Think",
    desc: "Blog website for developers to share their thoughts and ideas.",
    img: "/images/devthink.png",
  },
  {
    title: "Resume Editor",
    desc: "A resume editor tool where you can create your resume in...",
    img: "/images/resume.png",
  },
  {
    title: "Og Image Generator",
    desc: "A og image generator tool where you can create og images in...",
    img: "/images/ogimg.png",
  },
  {
    title: "Persona AI",
    desc: "A Hitesh and Piyush Sir Persona AI where you can chat with them.",
    img: "/images/persona.png",
  },
  {
    title: "Do Paste",
    desc: "Share your text with anyone using this tool with a unique link.",
    img: "/images/dopaste.png",
  },
  {
    title: "Dribbble Clone",
    desc: "A dribbble clone website where you can share your designs.",
    img: "/images/dribbble.png",
  },
  {
    title: "Admin Dashboard",
    desc: "A admin dashboard for developer think website to manage blogs.",
    img: "/images/admin.png",
  },
  {
    title: "E-commerce",
    desc: "An e-commerce website frontend to sell products.",
    img: "/images/ecommerce.png",
  },
];

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#161616] text-white font-sans px-3 md:px-0 py-10 flex flex-col items-center">
      {/* Header */}
      <Header onChatOpen={() => setChatOpen(true)} />

      {/* Skills and Connect */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <SkillsCard skills={skills} />
        <ConnectCard />
      </div>

      {/* Blogs */}
      <BlogsSection blogs={blogs} />

      {/* Work Experience */}
      <WorkExperience />

      {/* Projects */}
      <ProjectsSection projects={projects} />

      {/* Footer */}
      <Footer />

      {/* Chat Popup UI */}
      <ChatPopup isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      {/* Floating Chat Button */}
      <FloatingChatButton 
        onClick={() => setChatOpen(true)} 
        isVisible={!chatOpen} 
      />
    </div>
  );
}