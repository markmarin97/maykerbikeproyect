// ============================================================
// MaykerBike - Navbar Component
// ============================================================

import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Menu, X, Bike, LogOut, User, LayoutDashboard, ChevronDown } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { currentUser, logout } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropOpen, setUserDropOpen] = useState(false);

  const navLinks = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'sorteos', label: 'Sorteos' },
    { id: 'registro', label: 'Registro' },
    { id: 'login', label: 'Iniciar Sesión' },
    { id: 'contacto', label: 'Contacto' },
  ];

  const handleNav = (page: string) => {
    onNavigate(page);
    setMenuOpen(false);
    setUserDropOpen(false);
  };

  const handleLogout = () => {
    logout();
    onNavigate('inicio');
    setMenuOpen(false);
    setUserDropOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-red-600/30 shadow-lg shadow-red-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <button
            onClick={() => handleNav('inicio')}
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <img
                src="/images/logo.png"
                alt="MaykerBike Logo"
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-red-600 to-orange-500 p-1.5 rounded-lg shadow-lg shadow-red-900/50 group-hover:shadow-red-500/50 transition-all duration-300">
                  <Bike className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-white font-black text-lg tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    MAYKER<span className="text-red-500">BIKE</span>
                  </span>
                  <span className="text-orange-400 text-[9px] font-semibold tracking-[0.2em] uppercase">Sorteos Premium</span>
                </div>
              </div>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {!currentUser && navLinks.filter(l => !['registro', 'login'].includes(l.id) || !currentUser).map(link => {
              if (currentUser && (link.id === 'registro' || link.id === 'login')) return null;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 ${
                    currentPage === link.id
                      ? 'bg-red-600 text-white shadow-md shadow-red-900/50'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {link.label}
                </button>
              );
            })}
            {currentUser && (
              <>
                {[
                  { id: 'inicio', label: 'Inicio' },
                  { id: 'sorteos', label: 'Sorteos' },
                  { id: 'contacto', label: 'Contacto' },
                ].map(link => (
                  <button
                    key={link.id}
                    onClick={() => handleNav(link.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 ${
                      currentPage === link.id
                        ? 'bg-red-600 text-white shadow-md shadow-red-900/50'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {link.label}
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropOpen(!userDropOpen)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2 rounded-xl transition-all duration-200"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                    {currentUser.nombre.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white text-sm font-medium hidden sm:block max-w-[120px] truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {currentUser.nombre.split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${userDropOpen ? 'rotate-180' : ''}`} />
                </button>

                {userDropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-gray-900 border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-white text-sm font-semibold truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>{currentUser.nombre}</p>
                      <p className="text-gray-400 text-xs truncate">{currentUser.correo}</p>
                      <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        currentUser.rol === 'admin' ? 'bg-red-600/20 text-red-400' : 'bg-orange-600/20 text-orange-400'
                      }`}>
                        {currentUser.rol === 'admin' ? '⭐ Admin' : '👤 Usuario'}
                      </span>
                    </div>
                    {currentUser.rol === 'admin' ? (
                      <button
                        onClick={() => handleNav('admin')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-red-600/20 hover:text-red-400 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Panel Administrador
                      </button>
                    ) : (
                      <button
                        onClick={() => handleNav('mi-panel')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-orange-600/20 hover:text-orange-400 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Mi Panel
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors border-t border-white/10"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => handleNav('login')}
                  className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white border border-white/20 hover:border-white/40 rounded-lg transition-all duration-200"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => handleNav('registro')}
                  className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 rounded-lg shadow-md shadow-red-900/40 transition-all duration-200 hover:shadow-red-500/40"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Registrarse
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-950 border-t border-white/10">
          <div className="px-4 py-3 space-y-1">
            {(currentUser
              ? [{ id: 'inicio', label: 'Inicio' }, { id: 'sorteos', label: 'Sorteos' }, { id: 'contacto', label: 'Contacto' }]
              : navLinks
            ).map(link => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                  currentPage === link.id
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {link.label}
              </button>
            ))}
            {currentUser && (
              <>
                <div className="border-t border-white/10 pt-2 mt-2">
                  {currentUser.rol === 'admin' ? (
                    <button onClick={() => handleNav('admin')} className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-600/20 transition-colors flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" /> Panel Administrador
                    </button>
                  ) : (
                    <button onClick={() => handleNav('mi-panel')} className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold text-orange-400 hover:bg-orange-600/20 transition-colors flex items-center gap-2">
                      <User className="w-4 h-4" /> Mi Panel
                    </button>
                  )}
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold text-gray-400 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Cerrar Sesión
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
