// ============================================================
// MaykerBike - Contact Page
// ============================================================

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ nombre: '', correo: '', asunto: '', mensaje: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.correo || !form.mensaje) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
    toast.success('¡Mensaje enviado exitosamente! 📨');
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'contacto@maykerbike.com', color: 'text-red-400' },
    { icon: Phone, label: 'WhatsApp', value: '+51 961 359 573', color: 'text-green-400' },
    { icon: MapPin, label: 'Ubicación', value: 'Cajamarca, Perú', color: 'text-orange-400' },
    { icon: Clock, label: 'Horario', value: 'Lun - Sáb: 8am - 6pm', color: 'text-blue-400' },
  ];

  const faqs = [
    { q: '¿Cómo funciona el sorteo?', a: 'Compra tickets, sube tu comprobante de Yape y espera la aprobación. Una vez aprobado, recibirás tu número de ticket. Al llegar la fecha, el sistema selecciona aleatoriamente el ganador.' },
    { q: '¿Cuándo se realizan los sorteos?', a: 'Cada sorteo tiene su propia fecha programada, visible en la tarjeta del sorteo. Recibirás notificación del resultado.' },
    { q: '¿Cómo cobro si gano?', a: 'Si tu número de ticket es seleccionado, nos contactamos contigo directamente para coordinar la entrega del premio.' },
    { q: '¿Qué pasa si se rechazan mis tickets?', a: 'Si el administrador rechaza tu pago por inconsistencias, puedes volver a intentarlo con un nuevo comprobante válido.' },
  ];

  return (
    <div className="min-h-screen bg-[#121212] pt-20 pb-16" style={{ fontFamily: 'Poppins, sans-serif' }}>

      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-transparent py-14 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-transparent to-orange-900/20" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-600/40 text-red-400 text-xs font-bold px-4 py-2 rounded-full mb-4 tracking-widest uppercase">
            <MessageSquare className="w-4 h-4" /> Contáctanos
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            ¿TIENES ALGUNA <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">PREGUNTA?</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Escríbenos y te responderemos a la brevedad.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">

          {/* Contact Info */}
          <div className="space-y-5">
            <h2 className="text-xl font-black text-white mb-5" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              📞 Información de Contacto
            </h2>

            {contactInfo.map((item, i) => (
              <div key={i} className="flex items-center gap-4 bg-gray-900 border border-white/10 rounded-2xl p-4">
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-medium">{item.label}</p>
                  <p className="text-white font-semibold">{item.value}</p>
                </div>
              </div>
            ))}

            {/* Social links */}
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-5">
              <h3 className="text-white font-bold mb-4">Síguenos en redes</h3>
              <div className="flex gap-3">
                {[
                  { name: 'FB', color: 'bg-blue-600' },
                  { name: 'IG', color: 'bg-gradient-to-br from-purple-600 to-pink-500' },
                  { name: 'TT', color: 'bg-black border border-white/20' },
                  { name: 'YT', color: 'bg-red-600' },
                ].map(s => (
                  <button key={s.name} className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-white text-xs font-bold hover:opacity-80 transition-opacity`}>
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-7">
              {sent ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-500/20 border-2 border-green-500/40 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>¡Mensaje Enviado!</h3>
                  <p className="text-gray-400 mb-6">Gracias por contactarnos. Te responderemos dentro de las próximas 24 horas.</p>
                  <button onClick={() => { setSent(false); setForm({ nombre: '', correo: '', asunto: '', mensaje: '' }); }}
                    className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-500 transition-colors">
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-black text-white mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    ✉️ Envíanos un Mensaje
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2">Nombre Completo *</label>
                        <input
                          type="text"
                          value={form.nombre}
                          onChange={handleChange('nombre')}
                          placeholder="Tu nombre"
                          className="w-full bg-gray-800 border border-white/10 focus:border-red-500/50 text-white placeholder-gray-500 px-4 py-3 rounded-xl outline-none transition-all duration-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2">Correo Electrónico *</label>
                        <input
                          type="email"
                          value={form.correo}
                          onChange={handleChange('correo')}
                          placeholder="tu@correo.com"
                          className="w-full bg-gray-800 border border-white/10 focus:border-red-500/50 text-white placeholder-gray-500 px-4 py-3 rounded-xl outline-none transition-all duration-200"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-semibold mb-2">Asunto</label>
                      <select
                        value={form.asunto}
                        onChange={handleChange('asunto')}
                        className="w-full bg-gray-800 border border-white/10 focus:border-red-500/50 text-white px-4 py-3 rounded-xl outline-none transition-all duration-200"
                      >
                        <option value="">Selecciona un asunto</option>
                        <option value="sorteo">Consulta sobre sorteo</option>
                        <option value="pago">Problema con pago</option>
                        <option value="ticket">Consulta sobre tickets</option>
                        <option value="winner">Reclamo de premio</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-semibold mb-2">Mensaje *</label>
                      <textarea
                        value={form.mensaje}
                        onChange={handleChange('mensaje')}
                        placeholder="Describe tu consulta o problema..."
                        rows={5}
                        className="w-full bg-gray-800 border border-white/10 focus:border-red-500/50 text-white placeholder-gray-500 px-4 py-3 rounded-xl outline-none transition-all duration-200 resize-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-lg rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-red-900/50 transition-all duration-300 hover:scale-[1.02]"
                    >
                      {loading ? (
                        <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Enviando...</>
                      ) : (
                        <><Send className="w-5 h-5" /> Enviar Mensaje</>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div>
          <h2 className="text-2xl font-black text-white mb-8 text-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            ❓ Preguntas <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">Frecuentes</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-gray-900 border border-white/10 hover:border-red-500/30 rounded-2xl p-6 transition-all duration-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-600/20 border border-red-600/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-400 font-black text-sm">{i + 1}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>{faq.q}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
