import { motion } from 'framer-motion';

const IMAGES = [
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900',
  'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=900',
  'https://images.unsplash.com/photo-1571508601891-ca5e7a713859?w=900',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900',
  'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=900',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900',
];

export default function MasonryGallery() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <p className="uppercase tracking-[0.3em] text-gold-500 text-xs text-center">Gallery</p>
      <h2 className="text-5xl text-forest-700 text-center mt-3">A retreat in pictures</h2>
      <div className="mt-12 columns-1 sm:columns-2 lg:columns-3 gap-4 [&>*]:mb-4">
        {IMAGES.map((src, i) => (
          <motion.img
            key={src}
            src={src}
            alt=""
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 4) * 0.08 }}
            className="w-full break-inside-avoid rounded-xl shadow-luxe hover:scale-[1.02] transition duration-500"
          />
        ))}
      </div>
    </section>
  );
}
