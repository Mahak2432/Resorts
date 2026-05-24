import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function ImmersiveHero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=2400"
        alt=""
        className="absolute inset-0 w-full h-full object-cover scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-forest-900/40 via-forest-900/40 to-forest-900/95" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-cream px-6">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="uppercase tracking-[0.5em] text-gold-300 text-xs">
          A whispered retreat in the pines
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.4, duration: 1 }}
                   className="font-display text-6xl md:text-8xl mt-4 leading-tight">
          Whispering Pines
        </motion.h1>
        <motion.div initial={{ width: 0 }} animate={{ width: '6rem' }}
                    transition={{ delay: 1.0, duration: 0.8 }}
                    className="h-px bg-gold-400 mt-8" />
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="mt-8 max-w-xl text-cream/80 italic font-display text-2xl">
          Where ancient cedars hush the world and the mountains hold the morning.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.6 }}
                    className="mt-10">
          <Link to="/book" className="btn-primary text-base">Reserve Your Stay</Link>
        </motion.div>
      </div>

      <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/70 text-xs uppercase tracking-[0.3em]">
        Scroll
      </motion.div>
    </section>
  );
}
