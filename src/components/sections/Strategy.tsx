import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, MessageCircle, Compass, Target } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const strategies = [
  {
    number: '01',
    title: 'Experts',
    description:
      'Experts in Building and Zoning Code, guiding your project with confidence.',
    icon: BookOpen,
  },
  {
    number: '02',
    title: 'Communication',
    description:
      'Trustworthy, quick, accountable, and fluent in all things related to the Department of Buildings.',
    icon: MessageCircle,
  },
  {
    number: '03',
    title: 'Navigation',
    description:
      'Turning city agency hurdles into on-time project milestones.',
    icon: Compass,
  },
  {
    number: '04',
    title: 'Results',
    description:
      'Fast, compliant, and precise—powered by our proprietary technologies.',
    icon: Target,
  },
];

export function Strategy() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = itemsRef.current;
    if (!items) return;

    const itemElements = items.querySelectorAll('.strategy-item');

    itemElements.forEach((item, index) => {
      gsap.fromTo(
        item,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
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
      id="about"
      ref={sectionRef}
      className="py-24 px-4 sm:px-6 lg:px-8 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Strategy</h2>

        <div ref={itemsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {strategies.map((strategy, index) => {
            const Icon = strategy.icon;
            return (
              <div
                key={index}
                className="strategy-item group p-6 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer"
                data-cursor-hover
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Icon className="w-6 h-6 text-gray-400 group-hover:text-black transition-colors" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-gray-400">
                        {strategy.number}
                      </span>
                      <h3 className="text-xl font-semibold">{strategy.title}</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {strategy.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
