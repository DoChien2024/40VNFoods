import { motion } from 'framer-motion'
import { LANGUAGES, CONTACT_INFO } from '../config'

function Footer({ language }) {
  const t = LANGUAGES[language]

  const contactItems = [
    { icon: '📧', label: t.email, value: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}`, hover: 'hover:border-gray-400' },
    { icon: '📱', label: t.phone, value: CONTACT_INFO.phone, href: `tel:${CONTACT_INFO.phone}`, hover: 'hover:border-emerald-400' },
    { icon: '💻', label: 'GitHub', value: 'Source Code', href: CONTACT_INFO.github, hover: 'hover:border-gray-400' },
    { icon: '💼', label: 'LinkedIn', value: 'Connect Me', href: CONTACT_INFO.linkedin, hover: 'hover:border-blue-400' }
  ]

  return (
    <footer className="w-full mt-auto pt-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full bg-gray-200/90 backdrop-blur-md border-t border-gray-200 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 py-12">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
          <div className="absolute top-0 left-0 w-64 h-64 bg-accent/5 rounded-full -ml-32 -mt-32 blur-3xl opacity-50" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
            
            {/* CỘT 1 */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="text-5xl bg-white shadow-md w-16 h-16 flex items-center justify-center rounded-2xl border border-gray-100"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  🍜
                </motion.div>
                <div>
                  <h3 className="text-2xl font-black text-gray-800 tracking-tight leading-none">
                    {t.app_title}
                  </h3>
                  <span className="text-sm font-bold text-primary uppercase tracking-widest">AI Recognition</span>
                </div>
              </div>
              <p className="text-gray-700 font-medium leading-relaxed max-w-sm">
                {t.hero_desc}
              </p>
            </div>

            {/* CỘT 2 */}
            <div className="lg:col-span-8">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-[0.3em] mb-8 lg:text-left text-center">
                Quick Connection
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contactItems.map((item, idx) => (
                  <motion.a
                    key={idx}
                    href={item.href}
                    target={item.href.startsWith('http') ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className={`flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br ${item.gradient} border border-black/20 transition-all group shadow-sm`}
                    whileHover={{ y: -4, backgroundColor: 'rgba(255,255,255,0.9)', shadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  >
                    <div className="text-3xl filter drop-shadow-sm">{item.icon}</div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">{item.label}</div>
                      <div className={`text-sm font-black ${item.text} group-hover:underline transition-all`}>
                        {item.value}
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
          
          {/* Divider */}
          <div className="h-px bg-gradient-to-r via-black to-transparent my-8" />

          {/* BOTTOM SECTION */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-gray-700 text-sm font-medium text-center">
                {t.footer_text}
              </p>
            <div className="text-gray-700 text-sm font-medium">
              Made with ❤️ in Viet Nam
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}
export default Footer