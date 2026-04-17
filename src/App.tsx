import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { CustomCursor } from './components/CustomCursor';
import { Navigation } from './components/Navigation';
import { Hero } from './components/sections/Hero';
import { Services } from './components/sections/Services';
import { Strategy } from './components/sections/Strategy';
import { Testimonials } from './components/sections/Testimonials';
import { News } from './components/sections/News';

gsap.registerPlugin(ScrollTrigger);

function App() {
  // Initialize Lenis smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-white">
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main>
        <Hero />
        <Services />
        <Strategy />
        <Testimonials />
        <News />
      </main>

      {/* Footer */}
      <footer id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-lg font-semibold mb-4">Outsource Consultants, Inc.</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Experts in Municipal Building Codes, Zoning & Permits. Serving New York City since 2012.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>info@outsourceconsultants.com</p>
                <p>(212) 555-0123</p>
                <p>New York, NY 10001</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Follow Us</h4>
              <div className="flex items-center gap-4">
                <a href="#" className="text-gray-600 hover:text-black transition-colors" data-cursor-hover>
                  LinkedIn
                </a>
                <a href="#" className="text-gray-600 hover:text-black transition-colors" data-cursor-hover>
                  Twitter
                </a>
                <a href="#" className="text-gray-600 hover:text-black transition-colors" data-cursor-hover>
                  Instagram
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © 2024 Outsource Consultants, Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors" data-cursor-hover>
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors" data-cursor-hover>
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
