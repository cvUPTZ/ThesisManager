import React from 'react';
import { Book, FileText, Users, Award, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthProvider';
import { Navbar } from '../components/Navbar';

export function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: Book,
      title: 'Structured Writing',
      description: 'Organize your thesis with chapters, sections, and a clear outline'
    },
    {
      icon: FileText,
      title: 'Reference Management',
      description: 'Easily manage citations and generate bibliographies'
    },
    {
      icon: Users,
      title: 'Collaboration Ready',
      description: 'Share your work and get feedback from supervisors'
    },
    {
      icon: Award,
      title: 'Professional Export',
      description: 'Export your thesis in professional formats like DOCX'
    }
  ];

  const handleGetStarted = () => {
    if (user) {
      navigate('/thesis');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Write Your Thesis with
            <span className="text-blue-600"> ThesisCreator</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            A powerful tool designed to help you write, organize, and format your academic thesis with ease.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <button
                onClick={handleGetStarted}
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-24">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="relative bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="absolute -top-4 left-4">
                  <span className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                    <feature.icon className="h-6 w-6 text-white" />
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-12 sm:px-12">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Ready to start your academic journey?
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Join thousands of students and researchers who trust ThesisCreator for their academic writing.
              </p>
              <div className="mt-8">
                <button
                  onClick={handleGetStarted}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Start Writing Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}