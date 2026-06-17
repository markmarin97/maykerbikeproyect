// ============================================================
// MaykerBike - Main App Entry Point
// ============================================================

import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useStore } from './store/useStore';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SorteosPage from './pages/SorteosPage';
import UserPanelPage from './pages/UserPanelPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';

type Page = 'inicio' | 'sorteos' | 'login' | 'registro' | 'contacto' | 'mi-panel' | 'admin';

export default function App() {
  const { currentUser } = useStore();
  const [currentPage, setCurrentPage] = useState<Page>('inicio');

  // Route protection
  const navigate = (page: string) => {
    const p = page as Page;

    // Redirect admin users trying to access user panel
    if (p === 'mi-panel' && currentUser?.rol === 'admin') {
      setCurrentPage('admin');
      return;
    }

    // Protect admin panel
    if (p === 'admin' && (!currentUser || currentUser.rol !== 'admin')) {
      setCurrentPage('login');
      return;
    }

    // Protect user panel
    if (p === 'mi-panel' && !currentUser) {
      setCurrentPage('login');
      return;
    }

    // If logged in and tries to access login/register, redirect
    if ((p === 'login' || p === 'registro') && currentUser) {
      setCurrentPage(currentUser.rol === 'admin' ? 'admin' : 'inicio');
      return;
    }

    setCurrentPage(p);
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle back/forward browser buttons
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'inicio':
        return <HomePage onNavigate={navigate} />;
      case 'sorteos':
        return <SorteosPage onNavigate={navigate} />;
      case 'login':
        return <LoginPage onNavigate={navigate} />;
      case 'registro':
        return <RegisterPage onNavigate={navigate} />;
      case 'contacto':
        return <ContactPage />;
      case 'mi-panel':
        return <UserPanelPage onNavigate={navigate} />;
      case 'admin':
        return <AdminPage onNavigate={navigate} />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#121212]" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Global toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1f1f1f',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            iconTheme: { primary: '#E53935', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />

      {/* Navigation */}
      <Navbar currentPage={currentPage} onNavigate={navigate} />

      {/* Page content */}
      <main>
        {renderPage()}
      </main>
    </div>
  );
}
