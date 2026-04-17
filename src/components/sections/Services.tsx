import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    title: 'Project Closeout',
    description:
      'Lingering open applications can stall your construction project and complicate refinancing. At Outsource Consultants, we prioritize project completion, preparing for closeout even before the DOB issues the permits.',
    image:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop',
  },
  {
    title: 'Special Inspections',
    description:
      "Since 2012, Outsource Consultants has provided comprehensive Special Inspection services across New York City's construction landscape.",
    image:
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=400&fit=crop',
  },
  {
    title: 'Violations & Compliance',
    description:
      'Fast, effective resolution of violations and proactive compliance to keep your project on track.',
    image:
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop',
  },
  {
    title: 'Expediting',
    description:
      'We help New York City projects move faster by efficiently navigating approvals and permits through city agencies.',
    image:
      'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600&h=400&fit=crop',
  },
  {
    title: 'Building Code Consulting',
    description:
      'At Outsource Consultants, our in-house team of expert consultants tackles the most complex Building, Zoning, Plumbing, and Mechanical Code challenges in New York City.',
    image:
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&h=400&fit=crop',
  },
];

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = cardsRef.current;
    if (!cards) return;

    const cardElements = cards.querySelectorAll('.service-card');

    cardElements.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
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
      id="services"
      ref={sectionRef}
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
        <p className="text-gray-600 mb-12 max-w-2xl">
          Comprehensive solutions for your construction and building compliance
          needs.
        </p>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-card group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg cursor-pointer"
              data-cursor-hover
            >
              <div className="aspect-[3/2] overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="service-image w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 group-hover:text-gray-700 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                <button className="learn-more-btn inline-flex items-center gap-2 px-4 py-2 border border-black text-sm font-medium rounded-full transition-colors relative z-10">
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            className="inline-flex items-center gap-2 text-lg font-medium border-b-2 border-black pb-1 hover:gap-4 transition-all"
            data-cursor-hover
          >
            View All Services
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
