"use client";

import {
  ChevronDown,
  ChevronUp,
  Github,
  Twitter
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// FAQ component for the About page
const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex w-full justify-between items-center text-left font-medium text-gray-900"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="mt-2 text-gray-600 text-sm">{answer}</div>}
    </div>
  );
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <Image
                  src="/favicon.ico"
                  alt="Mannote Logo"
                  width={32}
                  height={32}
                  className="h-8 w-auto"
                />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  Mannote
                </span>
              </Link>
            </div>
            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              About Mannote
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              The visual way to organize your ideas & projects
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - About */}
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
              What is Mannote?
            </h2>
            <div className="prose prose-indigo prose-lg">
              <p>
                Mannote is a visual workspace that helps you organize your ideas
                and projects into beautiful boards. Inspired by Milanote, it
                provides a flexible canvas where you can collect, organize, and
                develop your thoughts.
              </p>
              <p>
                Whether you&apos;re planning a project, collecting inspiration, or
                organizing your thoughts, Mannote gives you the tools to think
                visually and create connections between your ideas.
              </p>
              <h3>Key Features</h3>
              <ul>
                <li>
                  <strong>Visual Boards</strong>: Create infinite canvases to
                  organize your content
                </li>
                <li>
                  <strong>Rich Cards</strong>: Add notes, to-do lists, links,
                  and images
                </li>
                <li>
                  <strong>Connections</strong>: Draw lines between related ideas
                  to show relationships
                </li>
                <li>
                  <strong>Collaboration</strong>: Share your boards with others
                  (coming soon)
                </li>
                <li>
                  <strong>Responsive Design</strong>: Works on desktop and
                  mobile devices
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Card Types */}
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
              Card Types
            </h2>
            <div className="space-y-6">
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Note Cards
                  </h3>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>
                      Rich text notes with formatting options like headings,
                      lists, and more. Perfect for capturing ideas and writing
                      content.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Todo Cards
                  </h3>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>
                      Interactive task lists with checkboxes. Great for tracking
                      progress on projects and managing action items.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Link Cards
                  </h3>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>
                      Save links with rich previews showing images, titles, and
                      descriptions. Perfect for collecting research and
                      inspiration.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Image Cards
                  </h3>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>
                      Upload or paste images directly onto your board. Ideal for
                      visual inspiration and reference materials.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
            How to Use Mannote
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                  1
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Create a Board
                </h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p>
                    Start by creating a new board from your dashboard. Give it a
                    name that reflects your project or collection of ideas.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                  2
                </div>
                <h3 className="text-lg font-medium text-gray-900">Add Cards</h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p>
                    Click on the canvas and select the type of card you want to
                    add. Fill in the content and arrange it on your board.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                  3
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Connect Ideas
                </h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p>
                    Drag from the handles on each card to create connections
                    between related ideas. Organize your thoughts visually.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto">
            <FAQItem
              question="Is Mannote free to use?"
              answer={
                <p>
                  Yes, Mannote is currently free to use during our beta period.
                  We plan to introduce premium features in the future, but will
                  always maintain a free tier.
                </p>
              }
            />
            <FAQItem
              question="Can I collaborate with others?"
              answer={
                <p>
                  Collaboration features are coming soon! You&apos;ll be able to
                  invite others to view and edit your boards.
                </p>
              }
            />
            <FAQItem
              question="Is my data secure?"
              answer={
                <p>
                  Yes, we take data security seriously. Your boards are private
                  by default and we use industry-standard encryption to protect
                  your information.
                </p>
              }
            />
            <FAQItem
              question="Can I export my boards?"
              answer={
                <p>
                  Export functionality is planned for a future update. You&apos;ll be
                  able to export your boards as images or PDFs.
                </p>
              }
            />
            <FAQItem
              question="How do I get help if I have a problem?"
              answer={
                <p>
                  You can reach out to us through the feedback form in the
                  dashboard or by emailing support@mannote.com.
                </p>
              }
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-indigo-50 rounded-lg px-6 py-12 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-gray-500 mb-6">
            Create your first board and start organizing your ideas visually.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Image
                src="/favicon.ico"
                alt="Mannote Logo"
                width={24}
                height={24}
                className="h-6 w-auto"
              />
              <span className="ml-2 text-sm text-gray-500">
                © 2023 Mannote. All rights reserved.
              </span>
            </div>
            <div className="flex space-x-6">
              <a
                href="https://github.com/yourusername/mannote"
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">GitHub</span>
                <Github className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com/mannoteapp"
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
