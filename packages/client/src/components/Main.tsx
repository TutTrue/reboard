import React from 'react';
import { Layout, ArrowRight, Users } from 'lucide-react';
import Link from 'next/link';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <Layout className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">Reboard</span>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Organize Your Life with
            <span className="block text-indigo-600">
              Reboard
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            The intelligent todo list that helps you achieve more. Collaborate with your team, 
            stay organized, and boost your productivity together.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/api/auth/signin" className="group inline-flex items-center bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-indigo-700 transition-all duration-200">
              Start Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform animate-pulse" />
            </Link>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;