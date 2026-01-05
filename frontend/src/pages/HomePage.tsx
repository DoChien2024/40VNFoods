
import { motion, useScroll, useTransform } from 'framer-motion';
import Introduction from './Introduction';
import { useNavigate } from 'react-router-dom';
import { LANGUAGES } from '../config';

interface HomePageProps {
  language: 'VN' | 'EN';
}

function HomePage({ language }: HomePageProps) {
  const bgImage = "https://as1.ftcdn.net/v2/jpg/02/60/12/88/1000_F_260128861_Q2ttKHoVw2VrmvItxyCVBnEyM1852MoJ.jpg";
  const navigate = useNavigate();
  const t = LANGUAGES[language];

  const { scrollY } = useScroll();
  
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 0.9]);
  const textY = useTransform(scrollY, [0, 500], [0, -50]); 
  return (
    <div className="relative w-full min-h-screen bg-white">
      <div className="sticky top-0 h-screen w-full overflow-hidden z-0">
        <motion.div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            opacity, 
            scale,
            backgroundImage: `url('${bgImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center' 
          }}
        >
          <div className="absolute inset-0 bg-black/45" />
        </motion.div>

        <section className="relative z-10 w-full h-full flex flex-col items-center justify-center text-white px-4 text-center">
          <motion.div style={{ y: textY, opacity }}>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl tracking-[0.6em] uppercase mb-4 font-bold"
            >
              {t.home_banner_title}
            </motion.h1>
            
            <motion.p
              className="mt-6 text-2xl md:text-4xl font-bold tracking-[0.3em] uppercase">
              {t.home_banner_subtitle}
            </motion.p>
          </motion.div>
        </section>
        <motion.div 
          style={{ opacity }}
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center"
        >
          <button
            className="btn-transparent"
            onClick={() => navigate('/library')}
          >
            {t.home_discover_btn}
          </button>
        </motion.div>
      </div>

    {/* introductiom */}
      <div className="relative z-10 bg-white w-full">
        <Introduction language={language} />
      </div>

    </div>
  );
}

export default HomePage;