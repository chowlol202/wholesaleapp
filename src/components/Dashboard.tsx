import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, BarChart as ChartBar, Settings, Users, Wallet, ArrowUpRight, LogIn, UserPlus, LogOut } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { SignUpForm } from './auth/SignUpForm';
import { SignInForm } from './auth/SignInForm';
import { useAuth } from '../contexts/AuthContext';

export function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isSignUpOpen, setIsSignUpOpen] = React.useState(false);
  const [isSignInOpen, setIsSignInOpen] = React.useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2073&q=80')] opacity-[0.03] bg-cover bg-center mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-shine bg-[length:200px_200px] opacity-5 animate-gradient-x"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 via-primary-700/90 to-primary-800/90 backdrop-blur-sm"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-3 shadow-lg ring-1 ring-white/20">
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-white">
                  Investment Dashboard
                </h1>
                <p className="mt-2 text-primary-100">
                  Track and optimize your real estate portfolio
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl px-4 py-2 ring-1 ring-white/20">
                    <span className="text-white text-sm">
                      Hi, <span className="font-semibold">{user.displayName}</span>
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="group flex items-center px-4 py-2 bg-white/10 rounded-xl backdrop-blur-lg ring-1 ring-white/20 text-white hover:bg-white/20 transition-all duration-200"
                  >
                    <LogOut className="h-5 w-5 mr-2 transform transition-transform duration-200 group-hover:translate-x-1" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              ) : (
                <>
                  <Dialog.Root open={isSignInOpen} onOpenChange={setIsSignInOpen}>
                    <Dialog.Trigger asChild>
                      <button className="group flex items-center px-4 py-2 bg-white/10 rounded-xl backdrop-blur-lg ring-1 ring-white/20 text-white hover:bg-white/20 transition-all duration-200">
                        <LogIn className="h-5 w-5 mr-2 transform transition-transform duration-200 group-hover:translate-x-1" />
                        <span className="font-medium">Sign In</span>
                      </button>
                    </Dialog.Trigger>

                    {isSignInOpen && (
                      <SignInForm
                        onClose={() => setIsSignInOpen(false)}
                        onSignUpClick={() => {
                          setIsSignInOpen(false);
                          setIsSignUpOpen(true);
                        }}
                      />
                    )}
                  </Dialog.Root>

                  <Dialog.Root open={isSignUpOpen} onOpenChange={setIsSignUpOpen}>
                    <Dialog.Trigger asChild>
                      <button className="group flex items-center px-4 py-2 bg-white rounded-xl shadow-sm text-primary-700 hover:bg-primary-50 transition-all duration-200">
                        <UserPlus className="h-5 w-5 mr-2 transform transition-transform duration-200 group-hover:scale-110" />
                        <span className="font-medium">Sign Up</span>
                      </button>
                    </Dialog.Trigger>

                    {isSignUpOpen && (
                      <SignUpForm
                        onClose={() => setIsSignUpOpen(false)}
                        onSignInClick={() => {
                          setIsSignUpOpen(false);
                          setIsSignInOpen(true);
                        }}
                      />
                    )}
                  </Dialog.Root>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div 
            onClick={() => navigate('/leads')}
            className="group bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
          >
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div className="bg-primary-100 rounded-xl p-3 transform transition-transform duration-300 group-hover:scale-110">
                  <Building2 className="h-8 w-8 text-primary-600" />
                </div>
                <ArrowUpRight className="h-6 w-6 text-primary-600 transform transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">Property Leads</h3>
              <p className="mt-2 text-gray-600">Track and manage your property leads, offers, and negotiations.</p>
              <div className="mt-6 inline-flex items-center text-primary-600 font-medium">
                View Leads
                <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {[
            {
              title: 'Analytics',
              description: 'Get insights into your portfolio performance and market trends.',
              icon: ChartBar,
              badge: 'Coming Soon'
            },
            {
              title: 'Team',
              description: 'Collaborate with your team members and manage permissions.',
              icon: Users,
              badge: 'Coming Soon'
            },
            {
              title: 'Financials',
              description: 'Track expenses, revenue, and generate financial reports.',
              icon: Wallet,
              badge: 'Coming Soon'
            },
            {
              title: 'Settings',
              description: 'Customize your dashboard and notification preferences.',
              icon: Settings,
              badge: 'Coming Soon'
            }
          ].map((card, index) => (
            <div key={index} className="relative bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-gray-500/10"></div>
              <div className="p-8">
                <div className="flex items-center justify-between">
                  <div className="bg-gray-100 rounded-xl p-3">
                    <card.icon className="h-8 w-8 text-gray-600" />
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {card.badge}
                  </span>
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-gray-900">{card.title}</h3>
                <p className="mt-2 text-gray-600">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}