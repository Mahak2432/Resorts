import MasonryGallery from '../components/gallery/MasonryGallery';

export default function GalleryPage() {
  return (
    <main className="pt-28 bg-cream min-h-screen">
      <section className="max-w-4xl mx-auto px-6 text-center py-12">
        <p className="uppercase tracking-[0.3em] text-gold-500 text-xs">Visual journal</p>
        <h1 className="text-5xl md:text-6xl text-forest-700 mt-3">The resort, room by room</h1>
        <p className="text-stone-500 mt-5 text-lg">
          Explore the architecture, suites, cedar decks, spa rituals, and mountain views that shape Whispering Pines.
        </p>
      </section>
      <MasonryGallery />
    </main>
  );
}
