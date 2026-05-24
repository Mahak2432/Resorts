import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="min-h-screen pt-32 px-6 bg-cream flex items-center justify-center text-center">
      <div>
        <p className="uppercase tracking-[0.3em] text-gold-500 text-xs">404</p>
        <h1 className="text-5xl text-forest-700 mt-3">This trail fades into the pines</h1>
        <p className="text-stone-500 mt-4 max-w-xl">
          The page you opened is not part of the resort map. Return to the main lodge and continue from there.
        </p>
        <Link to="/" className="btn-primary mt-8">Return home</Link>
      </div>
    </section>
  );
}
