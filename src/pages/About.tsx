import { useEffect, useRef } from "react";
import { Mail, MessageCircle, Phone } from "lucide-react";

export function About() {
  const contactSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = contactSectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const progress = Math.min(
        Math.max(1 - rect.top / viewportHeight, 0),
        1
      );

      section.style.setProperty("--shine-pos", `${progress * 100}%`);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/images/deliver_man_photo.jpg")',
          opacity: 0.15,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="hero-section">
          <h1 className="hero-title">
            Connecting Worlds.<br />
            Delivering Excellence.
          </h1>
          <p className="hero-text">
            Bridging the gap between global quality and local access.
          </p>
        </section>

        {/* What We Do Section */}
        <section className="section">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-serif text-[#D4AF37] mb-6">
                  What We Do
                </h2>
                <div className="space-y-6 text-black ml-20">
                  <p>
                    My Super Store is a premier e-commerce platform dedicated to
                    bridging the gap between global markets and Nigeria.
                  </p>
                  <p>
                    We specialize in sourcing and distributing a diverse range
                    of high-quality items from multiple regions worldwide.
                  </p>
                  <p>
                    We handle international procurement and logistics, offering
                    a premium shopping experience tailored for Nigeria.
                  </p>
                </div>
              </div>

              <div className="card-black p-8 glass-border relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFC92E] rounded-full blur-[80px] opacity-10" />
                <div className="relative z-10 grid grid-cols-2 gap-6">
                  {[
                    ["Global", "Sourcing Network"],
                    ["NG", "Nationwide Delivery"],
                    ["100%", "Authentic Items"],
                    ["24/7", "Customer Support"],
                  ].map(([title, subtitle]) => (
                    <div key={title} className="text-center p-4">
                      <h3 className="text-4xl font-bold text-black mb-2">
                        {title}
                      </h3>
                      <p className="text-xs uppercase tracking-widest text-[#D4AF37]">
                        {subtitle}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact & Support Section */}
        <section
          ref={contactSectionRef}
          className="features-section metallic-scroll-border bg-black py-20"
        >
          <div className="container">
            <h2 className="text-3xl font-serif text-center text-[#D4AF37] mb-4">
              Contact & Support
            </h2>

            <p className="text-center text-white mb-8">
              Contact any of our team members through the following channels
            </p>

            <div className="flex flex-col md:flex-row gap-8 justify-center">
              <div className="feature-item">
                <div className="feature-icon-box">
                  <Mail size={32} strokeWidth={2.5} />
                </div>
                <h4 className="feature-title">Email Us</h4>
                <p className="feature-desc mb-4">
                  For general inquiries and support.
                </p>
                <a
                  href="mailto:monarchgrouptechgroup@gmail.com"
                  className="text-[#D4AF37] hover:text-white transition-colors font-medium 
                  text-center break-all sm:break-words max-w-full block"
                >
                  monarchgrouptechgroup@gmail.com
                </a>
              </div>

              <div className="feature-item">
                <div className="feature-icon-box">
                  <MessageCircle size={32} strokeWidth={2.5} />
                </div>
                <h4 className="feature-title">Live Chat</h4>
                <p className="feature-desc">
                  Available Mon–Fri, 9am–6pm WAT.
                </p>
                <span className="text-[#D4AF37]">Coming Soon</span>
              </div>

              <div className="feature-item">
                <div className="feature-icon-box">
                  <Phone size={32} strokeWidth={2.5} />
                </div>
                <h4 className="feature-title">Call Us</h4>
                <p className="feature-desc">+234 --- --- ----</p>
              </div>
            </div>
          </div>
        </section>

        {/* Shipping Info Section */}
        <section className="section bg-[#0F0F0F]">
          <div className="container">
            <h2 className="text-3xl font-serif text-center text-[#D4AF37] mb-8">
              Shipping Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  We offer a reliable shipping network spanning multiple regions
                  worldwide, delivering directly to Nigeria.
                </p>

                <ul className="space-y-4">
                  {[
                    "Standard Delivery: 5–14 Business Days",
                    "Express Delivery: 3–5 Business Days",
                    "Nationwide Coverage",
                  ].map((item) => (
                    <li key={item} className="flex items-center text-gray-400">
                      <span className="w-2 h-2 bg-[#D4AF37] rounded-full mr-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="w-full h-[400px] rounded-2xl overflow-hidden glass-border shadow-2xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.4593258525!2d3.1191410931584985!3d6.548376811802148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos%2C%20Nigeria!"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
