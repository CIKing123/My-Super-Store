import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselSlide {
    id: number;
    image: string;
    alt: string;
    category: string;
}

const slides: CarouselSlide[] = [
    { id: 1, image: '/assets/hero/cosmetics.png', alt: 'Premium Cosmetics Collection', category: 'Cosmetics' },
    { id: 2, image: '/assets/hero/construction.png', alt: 'Construction Tools & Equipment', category: 'Construction' },
    { id: 3, image: '/assets/hero/furniture.png', alt: 'Luxury Furniture Showroom', category: 'Furniture' },
    { id: 4, image: '/assets/hero/fashion.png', alt: 'Fashion & Clothing Collection', category: 'Fashion' },
    { id: 5, image: '/assets/hero/events.png', alt: 'Event Tools & Equipment', category: 'Events' },
    { id: 6, image: '/assets/hero/electrical.png', alt: 'Electrical Appliances', category: 'Electrical' },
];

const AUTO_SLIDE_INTERVAL = 5000; // 5 seconds

export function HeroCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);
    const autoSlideTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-slide functionality
    const startAutoSlide = useCallback(() => {
        if (autoSlideTimerRef.current) {
            clearInterval(autoSlideTimerRef.current);
        }
        autoSlideTimerRef.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, AUTO_SLIDE_INTERVAL);
    }, []);

    const stopAutoSlide = useCallback(() => {
        if (autoSlideTimerRef.current) {
            clearInterval(autoSlideTimerRef.current);
            autoSlideTimerRef.current = null;
        }
    }, []);

    // Start auto-slide on mount and when not hovered
    useEffect(() => {
        if (!isHovered) {
            startAutoSlide();
        } else {
            stopAutoSlide();
        }

        return () => stopAutoSlide();
    }, [isHovered, startAutoSlide, stopAutoSlide]);

    // Navigation functions
    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        stopAutoSlide();
        setTimeout(startAutoSlide, 1000); // Resume auto-slide after 1 second
    };

    const nextSlide = () => {
        goToSlide((currentSlide + 1) % slides.length);
    };

    const prevSlide = () => {
        goToSlide((currentSlide - 1 + slides.length) % slides.length);
    };

    // Touch/swipe handlers for mobile
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        const swipeThreshold = 50;
        const diff = touchStartX.current - touchEndX.current;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // Swipe left - next slide
            } else {
                prevSlide(); // Swipe right - previous slide
            }
        }
    };

    return (
        <div
            className="absolute inset-0 overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Carousel slides */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out bg-gradient-to-br from-[#0F0F0F] via-[#1A1A1A] to-[#0F0F0F] ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    style={{ pointerEvents: index === currentSlide ? 'auto' : 'none' }}
                >
                    <img
                        src={slide.image}
                        alt={slide.alt}
                        className="absolute inset-0 w-full h-full object-contain"
                        style={{
                            objectFit: 'contain',
                            objectPosition: 'center center'
                        }}
                        loading={index === 0 ? 'eager' : 'lazy'}
                    />
                </div>
            ))}

            {/* Navigation arrows */}
            <div className="absolute inset-0 pointer-events-none z-20">
                <button
                    onClick={prevSlide}
                    className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 pointer-events-auto bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-1 sm:p-1.5 md:p-2 lg:p-3 rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 pointer-events-auto bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-1 sm:p-1.5 md:p-2 lg:p-3 rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                </button>
            </div>

            {/* Navigation dots */}
            <div className="hidden sm:flex absolute bottom-2 sm:bottom-3 md:bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 gap-1 sm:gap-1.5 md:gap-2 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 rounded-full ${index === currentSlide
                            ? 'w-4 h-1 sm:w-5 sm:h-1.5 md:w-6 md:h-1.5 lg:w-8 lg:h-2 bg-[#FFE55C]'
                            : 'w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-white/40 hover:bg-white/60'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
