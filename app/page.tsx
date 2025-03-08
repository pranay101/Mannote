"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutGridIcon,
  FileTextIcon,
  UsersIcon,
  ImageIcon,
  TextIcon,
  LinkIcon,
  ArrowRightIcon,
  CheckIcon,
  GithubIcon,
  TwitterIcon,
  InstagramIcon,
} from "lucide-react";

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
            mannote
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
            href="#templates"
            className="text-sm hover:text-indigo-600 transition-colors"
          >
            Templates
          </Link>
          <Link
            href="#pricing"
            className="text-sm hover:text-indigo-600 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#about"
            className="text-sm hover:text-indigo-600 transition-colors"
          >
            About
          </Link>
          <Link
            href="/dashboard"
            className="text-sm hover:text-indigo-600 transition-colors"
          >
            Dashboard
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm hover:text-indigo-600 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/dashboard"
            className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Sign up free
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
            className="glass border border-gray-200 hover:border-indigo-600 px-8 py-3 rounded-md text-lg transition-colors"
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

      {/* Templates Section */}
      <section id="templates" className="py-20 px-6 md:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start with a template
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started quickly with professionally designed templates for any
              project
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Project Planning",
                description: "Organize tasks, timelines, and resources",
                color: "from-blue-500 to-indigo-600",
                delay: 0.2,
              },
              {
                title: "Mood Boards",
                description: "Collect visual inspiration for your projects",
                color: "from-purple-500 to-pink-600",
                delay: 0.4,
              },
              {
                title: "Content Calendar",
                description: "Plan and schedule your content strategy",
                color: "from-green-500 to-teal-600",
                delay: 0.6,
              },
            ].map((template, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: template.delay }}
                className="group relative rounded-lg overflow-hidden shadow-md h-64 cursor-pointer card-hover"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-90 group-hover:opacity-100 transition-opacity`}
                ></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <h3 className="text-xl font-semibold mb-2">
                    {template.title}
                  </h3>
                  <p className="text-white/80 mb-4">{template.description}</p>
                  <span className="inline-flex items-center text-sm font-medium">
                    Use template
                    <ArrowRightIcon className="h-4 w-4 ml-1" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
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
              Loved by creative professionals
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See what our users have to say about Mannote
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Mannote has completely transformed how I organize my design projects. The visual boards make it so easy to see everything at a glance.",
                author: "Sarah Johnson",
                role: "UX Designer",
                delay: 0.2,
              },
              {
                quote:
                  "As a content creator, I need a tool that helps me organize my ideas visually. Mannote is exactly what I&apos;ve been looking for.",
                author: "Michael Chen",
                role: "Content Strategist",
                delay: 0.4,
              },
              {
                quote:
                  "Our team has been using Mannote for project planning and it's been a game-changer for our creative process.",
                author: "Emily Rodriguez",
                role: "Creative Director",
                delay: 0.6,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: testimonial.delay }}
                className="bg-white p-8 rounded-lg shadow-sm card-hover"
              >
                <p className="text-gray-600 mb-6 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <span className="text-indigo-600 font-semibold">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 md:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the plan that&apos;s right for you
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Free",
                price: "$0",
                description: "Perfect for individuals just getting started",
                features: [
                  "Up to 3 boards",
                  "Basic templates",
                  "1GB storage",
                  "Personal use only",
                ],
                cta: "Get started",
                popular: false,
                delay: 0.2,
              },
              {
                name: "Pro",
                price: "$12",
                period: "/month",
                description: "Everything you need for serious projects",
                features: [
                  "Unlimited boards",
                  "All templates",
                  "10GB storage",
                  "Collaboration with up to 5 users",
                  "Priority support",
                ],
                cta: "Start free trial",
                popular: true,
                delay: 0.4,
              },
              {
                name: "Team",
                price: "$49",
                period: "/month",
                description: "For teams that need to collaborate extensively",
                features: [
                  "Unlimited boards",
                  "All templates",
                  "100GB storage",
                  "Unlimited team members",
                  "Advanced permissions",
                  "24/7 support",
                ],
                cta: "Contact sales",
                popular: false,
                delay: 0.6,
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: plan.delay }}
                className={`bg-white p-8 rounded-lg shadow-sm ${
                  plan.popular ? "ring-2 ring-indigo-600 relative" : ""
                } card-hover`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    Popular
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-end mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-500 ml-1">{plan.period}</span>
                  )}
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="#"
                  className={`block text-center py-2 px-4 rounded-md transition-colors ${
                    plan.popular
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "border border-gray-300 hover:border-indigo-600 text-gray-800"
                  }`}
                >
                  {plan.cta}
                </Link>
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
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Templates
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Integrations
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Tutorials
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Community
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Press
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Security
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 mb-4 md:mb-0">
            © {new Date().getFullYear()} Mannote. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              href="#"
              className="text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <span className="sr-only">Twitter</span>
              <TwitterIcon className="h-6 w-6" />
            </Link>
            <Link
              href="#"
              className="text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <span className="sr-only">GitHub</span>
              <GithubIcon className="h-6 w-6" />
            </Link>
            <Link
              href="#"
              className="text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <span className="sr-only">Instagram</span>
              <InstagramIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
