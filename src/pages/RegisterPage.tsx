// ============================================================
// MaykerBike - Register Page
// ============================================================

import { useState } from 'react';
import { useStore } from '../store/useStore';
import { UserPlus, Eye, EyeOff, Bike, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

export default function RegisterPage({ onNavigate }: RegisterPageProps) {
  const { register } = useStore();
  const [form, setForm] = useState({ nombre: '', correo: '', contrasena: '', confirmar: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setError('');
  };

  const validate = (): boolean => {
    if (!form.nombre.trim() || form.nombre.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres.');
      return false;
    }
    if (!form.correo.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
      setError('Ingresa un correo electrónico válido.');
      return false;
    }
    if (form.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return false;
    }
    if (form.contrasena !== form.confirmar) {
      setError('Las contraseñas no coinciden.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const ok = register(form.nombre.trim(), form.correo.trim().toLowerCase(), form.contrasena);
    setLoading(false);

    if (ok) {
      setSuccess(true);
      toast.success('¡Cuenta creada exitosamente! 🎉', {
        style: { background: '#1f1f1f', color: '#fff', border: '1px solid #E53935' },
      });
      setTimeout(() => onNavigate('login'), 2500);
    } else {
      setError('Este correo ya está registrado. Intenta con otro.');
    }
  };

  const passStrength = (): { level: number; label: string; color: string } => {
    const p = form.contrasena;
    if (p.length === 0) return { level: 0, label: '', color: '' };
    if (p.length < 6) return { level: 1, label: 'Débil', color: 'bg-red-500' };
    if (p.length < 8 || !/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { level: 2, label: 'Media', color: 'bg-orange-500' };
    return { level: 3, label: 'Fuerte', color: 'bg-green-500' };
  };

  const strength = passStrength();

  if (success) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <div className="text-center">
          <div className="w-24 h-24 bg-green-500/20 border-2 border-green-500/50 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h2 className="text-3xl font-black text-white mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            ¡Registro <span className="text-green-400">Exitoso!</span>
          </h2>
          <p className="text-gray-400 mb-6">Tu cuenta ha sido creada. Redirigiendo al inicio de sesión...</p>
          <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4 py-24" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Background decorative */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/50">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-4 shadow-xl shadow-orange-900/50">
              <Bike className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              CREAR <span className="text-orange-500">CUENTA</span>
            </h1>
            <p className="text-gray-400 text-sm">Únete a la comunidad MaykerBike</p>
          </div>

          {/* Error alert */}
          {error && (
            <div className="flex items-center gap-3 bg-red-600/10 border border-red-600/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre */}
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Nombre Completo</label>
              <input
                type="text"
                value={form.nombre}
                onChange={handleChange('nombre')}
                placeholder="Juan Carlos Pérez"
                className="w-full bg-gray-800/80 border border-white/10 focus:border-orange-500/60 text-white placeholder-gray-500 px-4 py-3.5 rounded-xl outline-none transition-all duration-200 focus:ring-1 focus:ring-orange-500/30"
                required
                minLength={3}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Correo Electrónico</label>
              <input
                type="email"
                value={form.correo}
                onChange={handleChange('correo')}
                placeholder="tu@correo.com"
                className="w-full bg-gray-800/80 border border-white/10 focus:border-orange-500/60 text-white placeholder-gray-500 px-4 py-3.5 rounded-xl outline-none transition-all duration-200 focus:ring-1 focus:ring-orange-500/30"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Contraseña</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.contrasena}
                  onChange={handleChange('contrasena')}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-gray-800/80 border border-white/10 focus:border-orange-500/60 text-white placeholder-gray-500 px-4 py-3.5 pr-12 rounded-xl outline-none transition-all duration-200 focus:ring-1 focus:ring-orange-500/30"
                  required
                  minLength={6}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors">
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {/* Strength indicator */}
              {form.contrasena.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.level ? strength.color : 'bg-gray-700'}`} />
                    ))}
                  </div>
                  <span className={`text-xs font-medium ${strength.level === 1 ? 'text-red-400' : strength.level === 2 ? 'text-orange-400' : 'text-green-400'}`}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Confirmar Contraseña</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmar}
                  onChange={handleChange('confirmar')}
                  placeholder="Repite tu contraseña"
                  className={`w-full bg-gray-800/80 border text-white placeholder-gray-500 px-4 py-3.5 pr-12 rounded-xl outline-none transition-all duration-200 focus:ring-1 ${
                    form.confirmar && form.confirmar !== form.contrasena
                      ? 'border-red-500/60 focus:ring-red-500/30'
                      : form.confirmar && form.confirmar === form.contrasena
                      ? 'border-green-500/60 focus:ring-green-500/30'
                      : 'border-white/10 focus:border-orange-500/60 focus:ring-orange-500/30'
                  }`}
                  required
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors">
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {form.confirmar && form.confirmar !== form.contrasena && (
                <p className="text-red-400 text-xs mt-1">Las contraseñas no coinciden</p>
              )}
              {form.confirmar && form.confirmar === form.contrasena && (
                <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Las contraseñas coinciden
                </p>
              )}
            </div>

            {/* Terms */}
            <p className="text-gray-500 text-xs text-center leading-relaxed">
              Al registrarte aceptas nuestros{' '}
              <span className="text-orange-400 cursor-pointer hover:underline">Términos de Servicio</span>{' '}
              y{' '}
              <span className="text-orange-400 cursor-pointer hover:underline">Política de Privacidad</span>
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg rounded-xl shadow-xl shadow-orange-900/40 hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Crear Cuenta
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-900 text-gray-500">¿Ya tienes cuenta?</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('login')}
            className="w-full py-3.5 border-2 border-white/20 hover:border-orange-500/50 text-gray-300 hover:text-white font-semibold rounded-xl transition-all duration-200 hover:bg-orange-600/10"
          >
            Iniciar Sesión
          </button>
        </div>

        <div className="text-center mt-6">
          <button onClick={() => onNavigate('inicio')} className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
