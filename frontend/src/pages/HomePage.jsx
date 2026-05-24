import ImmersiveHero from '../components/hero/ImmersiveHero';
import MasonryGallery from '../components/gallery/MasonryGallery';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <>
      <ImmersiveHero />

      <section className="py-24 max-w-4xl mx-auto px-6 text-center">
        <p className="uppercase tracking-[0.3em] text-gold-500 text-xs">Welcome</p>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }} className="text-5xl text-forest-700 mt-4">
          A retreat above the clouds
        </motion.h2>
        <p className="mt-6 text-stone-500 text-lg leading-relaxed">
          Set 7,500 feet up in the cedar-clad foothills, Whispering Pines is a private
          haven of forty-four suites and villas, two destination spas, and three
          restaurants curated by chefs from across the subcontinent.
        </p>
      </section>

      <section className="parallax-bg h-[60vh] relative"
               style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=2000)' }}>
        <div className="absolute inset-0 bg-forest-900/50 flex items-center justify-center">
          <h3 className="text-cream font-display text-5xl text-center max-w-3xl px-6">
            "Stillness, served at altitude."
          </h3>
        </div>
      </section>

      <MasonryGallery />
    </>
  );
}
