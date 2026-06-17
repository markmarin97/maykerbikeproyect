// ============================================================
// MaykerBike - Login Page
// ============================================================

import { useState } from 'react';
import { useStore } from '../store/useStore';
import { LogIn, Eye, EyeOff, Bike, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const { login } = useStore();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!correo.trim() || !contrasena.trim()) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setLoading(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));

    const user = login(correo.trim(), contrasena);
    setLoading(false);

    if (user) {
      toast.success(`¡Bienvenido, ${user.nombre.split(' ')[0]}! 🏍️`, {
        style: { background: '#1f1f1f', color: '#fff', border: '1px solid #E53935' },
      });
      if (user.rol === 'admin') {
        onNavigate('admin');
      } else {
        onNavigate('inicio');
      }
    } else {
      setError('Correo o contraseña incorrectos. Verifica tus datos.');
    }
  };

  return (
    <div
      className="min-h-screen bg-[#121212] flex items-center justify-center px-4 py-24"
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/50">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl mb-4 shadow-xl shadow-red-900/50">
              <Bike className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              INICIAR <span className="text-red-500">SESIÓN</span>
            </h1>
            <p className="text-gray-400 text-sm">Accede a tu cuenta MaykerBike</p>
          </div>

          {/* Error alert */}
          {error && (
            <div className="flex items-center gap-3 bg-red-600/10 border border-red-600/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={correo}
                onChange={e => setCorreo(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full bg-gray-800/80 border border-white/10 focus:border-red-500/60 text-white placeholder-gray-500 px-4 py-3.5 rounded-xl outline-none transition-all duration-200 focus:ring-1 focus:ring-red-500/30"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={contrasena}
                  onChange={e => setContrasena(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-800/80 border border-white/10 focus:border-red-500/60 text-white placeholder-gray-500 px-4 py-3.5 pr-12 rounded-xl outline-none transition-all duration-200 focus:ring-1 focus:ring-red-500/30"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-lg rounded-xl shadow-xl shadow-red-900/40 hover:shadow-red-500/40 hover:from-red-500 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-900 text-gray-500">¿No tienes cuenta?</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('registro')}
            className="w-full py-3.5 border-2 border-white/20 hover:border-red-500/50 text-gray-300 hover:text-white font-semibold rounded-xl transition-all duration-200 hover:bg-red-600/10"
          >
            Crear cuenta gratis
          </button>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <button
            onClick={() => onNavigate('inicio')}
            className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
