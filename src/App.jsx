import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AppPreview from './components/AppPreview';
import Differentiator from './components/Differentiator';
import Features from './components/Features';
import Footer from './components/Footer';
import LegalPage from './components/LegalPage';
import AdminDashboard from './components/AdminDashboard';
import ConfirmDeletePage from './components/ConfirmDeletePage';

export default function App() {
  const [currentView, setCurrentView] = useState(null); // null | 'privacy' | 'terms' | 'child-safety' | 'admin' | 'confirm-delete'
  const [deleteToken, setDeleteToken] = useState('');

  // Handle URL hash changes
  useEffect(() => {
    const handleHash = () => {
      const rawHash = window.location.hash.replace('#', '');
      const hash = rawHash.split('?')[0];
      const path = window.location.pathname;

      if (hash === 'privacy' || path === '/privacy') {
        setCurrentView('privacy');
      } else if (hash === 'terms' || path === '/terms') {
        setCurrentView('terms');
      } else if (hash === 'child-safety' || path === '/child-safety') {
        setCurrentView('child-safety');
      } else if (hash === 'admin' || path === '/admin') {
        setCurrentView('admin');
      } else if (hash === 'confirm-delete' || path === '/confirm-delete') {
        const queryPart = rawHash.includes('?') ? rawHash.split('?')[1] : window.location.search.replace('?', '');
        const params = new URLSearchParams(queryPart);
        setDeleteToken(params.get('token') || '');
        setCurrentView('confirm-delete');
      } else {
        setCurrentView(null);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    window.addEventListener('popstate', handleHash);

    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('popstate', handleHash);
    };
  }, []);

  const openView = (type) => {
    window.location.hash = type;
    setCurrentView(type);
  };

  const closeView = () => {
    window.location.hash = '';
    setCurrentView(null);
  };

  if (currentView === 'admin') {
    return <AdminDashboard onBackToHome={closeView} />;
  }

  if (currentView === 'confirm-delete') {
    return <ConfirmDeletePage token={deleteToken} onBackToHome={closeView} />;
  }

  if (currentView === 'privacy' || currentView === 'terms' || currentView === 'child-safety') {
    return (
      <LegalPage 
        currentType={currentView} 
        onClose={closeView} 
        onSwitchType={(t) => {
          window.location.hash = t;
          setCurrentView(t);
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fafcfa] flex flex-col justify-between">
      <div>
        <Navbar onOpenLegal={openView} />
        <main>
          <Hero />
          <AppPreview />
          <Differentiator />
          <Features />
        </main>
      </div>
      <Footer onOpenLegal={openView} />
    </div>
  );
}
