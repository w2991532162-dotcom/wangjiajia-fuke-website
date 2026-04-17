import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote:
      'Outsource Consultants has been instrumental in helping us navigate complex DOB regulations. Their expertise and responsiveness are unmatched.',
    author: 'T. Hanks',
    role: 'CRO',
    company: 'Gensler',
  },
  {
    quote:
      "Working with OCI has streamlined our entire permitting process. They've saved us countless hours and headaches.",
    author: 'Ricky Gervais',
    role: 'CEO',
    company: 'Walmart',
  },
  {
    quote:
      'The team at Outsource Consultants is knowledgeable, professional, and always available when we need them. Highly recommended.',
    author: 'Stuart Pidd',
    role: 'CMO',
    company: 'Skanska',
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.fromTo(
      section.querySelector('.testimonial-container'),
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const navigate = (direction: 'prev' | 'next') => {
    if (isAnimating) return;

    setIsAnimating(true);

    if (quoteRef.current) {
      gsap.to(quoteRef.current, {
        opacity: 0,
        x: direction === 'next' ? -20 : 20,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          setCurrentIndex((prev) => {
            if (direction === 'next') {
              return prev === testimonials.length - 1 ? 0 : prev + 1;
            }
            return prev === 0 ? testimonials.length - 1 : prev - 1;
          });

          gsap.fromTo(
            quoteRef.current,
            { opacity: 0, x: direction === 'next' ? 20 : -20 },
            {
              opacity: 1,
              x: 0,
              duration: 0.3,
              ease: 'power2.out',
              onComplete: () => setIsAnimating(false),
            }
          );
        },
      });
    }
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white"
    >
      <div className="testimonial-container max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">Testimonials</h2>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="counter-number">{String(currentIndex + 1).padStart(2, '0')}</span>
            <span>/</span>
            <span className="counter-number">{String(testimonials.length).padStart(2, '0')}</span>
          </div>
        </div>

        <div ref={quoteRef} className="relative">
          <Quote className="w-12 h-12 text-gray-700 mb-6" />

          <blockquote className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed mb-8">
            "{currentTestimonial.quote}"
          </blockquote>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-lg">{currentTestimonial.author}</div>
              <div className="text-gray-400">
                {currentTestimonial.role}, {currentTestimonial.company}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('prev')}
                className="p-3 rounded-full border border-gray-600 hover:border-gray-400 hover:bg-gray-800 transition-all"
                data-cursor-hover
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('next')}
                className="p-3 rounded-full border border-gray-600 hover:border-gray-400 hover:bg-gray-800 transition-all"
                data-cursor-hover
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
