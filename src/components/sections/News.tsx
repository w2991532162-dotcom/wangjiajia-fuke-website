import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const newsItems = [
  {
    date: '02.12',
    category: 'Contractors',
    title: 'Building Inclusivity: Celebrating Black History in Construction, Architecture, & Engineering',
  },
  {
    date: '02.08',
    category: 'Architects',
    title: 'Outsource Consultants Inc becomes SCA Certified MBE',
  },
  {
    date: '02.08',
    category: 'Building Owners',
    title: 'Leaving Lead Behind: How NYC Plans to Replace Lead Pipes',
  },
  {
    date: '02.08',
    category: 'Building Owners',
    title: 'Powering Up: Applications Open for E-Bike Charging Cabinets',
  },
];

export function News() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = itemsRef.current;
    if (!items) return;

    const itemElements = items.querySelectorAll('.news-card');

    itemElements.forEach((item, index) => {
      gsap.fromTo(
        item,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
          delay: index * 0.1,
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      id="news"
      ref={sectionRef}
      className="py-24 px-4 sm:px-6 lg:px-8 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Latest News</h2>
          <button
            className="hidden md:inline-flex items-center gap-2 text-sm font-medium border-b border-black pb-1 hover:gap-3 transition-all"
            data-cursor-hover
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div ref={itemsRef} className="space-y-0 border-t border-gray-200">
          {newsItems.map((item, index) => (
            <div
              key={index}
              className="news-card group py-6 border-b border-gray-200 cursor-pointer"
              data-cursor-hover
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-4 md:w-48 flex-shrink-0">
                  <span className="text-sm font-medium text-gray-400">
                    {item.date}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>
                <h3 className="news-title text-lg md:text-xl font-medium flex-1 group-hover:text-gray-600 transition-colors">
                  {item.title}
                </h3>
                <ArrowRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity md:ml-4 flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 md:hidden">
          <button
            className="inline-flex items-center gap-2 text-sm font-medium border-b border-black pb-1"
            data-cursor-hover
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
