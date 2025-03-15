"use client";

import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  FileTextIcon,
  ImageIcon,
  LayoutGridIcon,
  LinkIcon,
  TextIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="flex justify-between items-center py-4 px-6 md:px-12 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent"
          >
            <Link href="/">Mannnote</Link>
          </motion.span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-sm hover:text-indigo-600 transition-colors"
          >
            Features
          </Link>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/pranay101/Mannote"
            className="text-sm hover:text-indigo-600 transition-colors"
          >
            GitHub
          </Link>
          <Link
            href="#about"
            className="text-sm hover:text-indigo-600 transition-colors"
          >
            About
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-20 md:py-32 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 -z-10 dotted-bg opacity-30"></div>
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary-light rounded-full blur-3xl opacity-30 -z-10"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-secondary-light rounded-full blur-3xl opacity-30 -z-10"></div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold max-w-4xl mb-6"
        >
          The visual way to organize your{" "}
          <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            ideas & projects
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10"
        >
          Collect, organize and develop your ideas into beautiful boards that
          help you think visually.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 mb-16"
        >
          <Link
            href="/dashboard"
            className="btn-3d bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-md text-lg transition-colors flex items-center justify-center gap-2"
          >
            Get started for free
            <ArrowRightIcon size={18} />
          </Link>
          <Link
            href="#demo"
            className="hidden glass border border-gray-200 hover:border-indigo-600 px-8 py-3 rounded-md text-lg transition-colors"
          >
            Watch demo
          </Link>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8 }}
          className="relative w-full max-w-5xl h-[400px] md:h-[600px] rounded-lg overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-4 p-6">
              {[
                { color: "bg-gray-100", delay: 0.9 },
                { color: "bg-indigo-100", delay: 1.0 },
                { color: "bg-purple-100", delay: 1.1 },
                { color: "bg-gray-100", delay: 1.2 },
                { color: "bg-indigo-100", delay: 1.3 },
                { color: "bg-purple-100", delay: 1.4 },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: item.delay }}
                  className="bg-white rounded-lg shadow-md p-4 flex flex-col card-hover"
                >
                  <div
                    className={`w-full h-24 ${item.color} rounded mb-3`}
                  ></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 md:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to organize your thoughts
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features that help you capture and organize your ideas in
              a visual way
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: <LayoutGridIcon className="h-6 w-6 text-indigo-600" />,
                title: "Visual Boards",
                description:
                  "Create beautiful boards that help you organize your thoughts and ideas in a visual way.",
                delay: 0.2,
              },
              {
                icon: <FileTextIcon className="h-6 w-6 text-indigo-600" />,
                title: "Notes & Tasks",
                description:
                  "Capture your ideas with notes, to-dos, images and links, all in one flexible workspace.",
                delay: 0.4,
              },
              {
                icon: <UsersIcon className="h-6 w-6 text-indigo-600" />,
                title: "Collaboration",
                description:
                  "Work together with your team in real-time, share boards and get feedback instantly.",
                delay: 0.6,
              },
              {
                icon: <ImageIcon className="h-6 w-6 text-indigo-600" />,
                title: "Image Collections",
                description:
                  "Collect and organize images for mood boards, design inspiration, and visual research.",
                delay: 0.8,
              },
              {
                icon: <TextIcon className="h-6 w-6 text-indigo-600" />,
                title: "Rich Text Editing",
                description:
                  "Format your notes with rich text editing, including headings, lists, and more.",
                delay: 1.0,
              },
              {
                icon: <LinkIcon className="h-6 w-6 text-indigo-600" />,
                title: "Web Clipper",
                description:
                  "Save content from the web directly to your boards with our browser extension.",
                delay: 1.2,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: feature.delay }}
                className="bg-white p-8 rounded-lg shadow-sm card-hover"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How <span className="gradient-text">Mannote</span> works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A simple, intuitive workflow to help you organize your ideas
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                number: "01",
                title: "Collect",
                description:
                  "Gather your ideas, notes, images, and links in one place.",
                color: "from-blue-500 to-indigo-600",
                delay: 0.2,
              },
              {
                number: "02",
                title: "Organize",
                description:
                  "Arrange your content visually on flexible boards.",
                color: "from-indigo-500 to-purple-600",
                delay: 0.4,
              },
              {
                number: "03",
                title: "Develop",
                description:
                  "Refine your ideas and collaborate with your team.",
                color: "from-purple-500 to-pink-600",
                delay: 0.6,
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: step.delay }}
                className="relative p-8 rounded-lg"
              >
                <div
                  className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${step.color} opacity-10 rounded-lg -z-10`}
                ></div>
                <div
                  className={`text-4xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent mb-4`}
                >
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 bg-indigo-600 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to organize your ideas?
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Join thousands of creative professionals who use Mannote to organize
            their thoughts and bring their projects to life.
          </p>
          <Link
            href="/dashboard"
            className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-md text-lg font-medium transition-colors inline-block"
          >
            Get started for free
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-12 border-t border-gray-100">
        <p className="text-sm text-gray-600 mb-4 md:mb-0 text-center">
          © {new Date().getFullYear()} Mannote. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
