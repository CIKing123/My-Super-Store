import { Mail, MessageCircle, Phone } from 'lucide-react';

export function About() {
    return (
        <div className="relative min-h-screen">
            {/* Background Image */}
            <div
                className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url("/images/deliver_man_photo.jpg")',
                    opacity: 0.15,
                    pointerEvents: 'none'
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 ">
                            <div>
                                <h2 className="text-3xl font-serif text-[#D4AF37] mb-6">What We Do</h2>
                                <div className="space-y-6 text-black ml-20">
                                    <p>
                                        My Super Store is a premier e-commerce platform dedicated to bridging the gap between global markets and Nigeria. We specialize in sourcing and distributing a diverse range of high-quality items from multiple regions around the world directly to our customers.
                                    </p>
                                    <p>
                                        Our mission is to provide seamless access to international products, ensuring that authenticity, quality, and variety are never compromised. Whether it's luxury fashion, state-of-the-art electronics, or premium home goods, we handle the logistics of bringing the world to your doorstep.
                                    </p>
                                    <p>
                                        We streamline the complex process of international procurement and shipping, offering a reliable, efficient, and premium shopping experience tailored for the Nigerian market.
                                    </p>
                                </div>
                            </div>
                            <div className="card-black p-8 glass-border relative overflow-hidden">
                                {/* Decorative background element */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFC92E] rounded-full blur-[80px] opacity-10"></div>
                                <div className="relative z-10 grid grid-cols-2 gap-6">
                                    <div className="text-center p-4">
                                        <h3 className="text-4xl font-bold text-black mb-2">Global</h3>
                                        <p className="text-xs uppercase tracking-widest text-[#D4AF37]">Sourcing Network</p>
                                    </div>
                                    <div className="text-center p-4">
                                        <h3 className="text-4xl font-bold text-black mb-2">NG</h3>
                                        <p className="text-xs uppercase tracking-widest text-[#D4AF37]">Nationwide Delivery</p>
                                    </div>
                                    <div className="text-center p-4">
                                        <h3 className="text-4xl font-bold text-black mb-2">100%</h3>
                                        <p className="text-xs uppercase tracking-widest text-[#D4AF37]">Authentic Items</p>
                                    </div>
                                    <div className="text-center p-4">
                                        <h3 className="text-4xl font-bold text-black mb-2">24/7</h3>
                                        <p className="text-xs uppercase tracking-widest text-[#D4AF37]">Customer Support</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section >

                {/* Contact & Support Section */}
                < section className="features-section" >
                    <div className="container">
                        <h2 className="text-3xl font-serif text-center text-[#D4AF37] mb-4">Contact & Support</h2>
                        <p className="text-center text-[#fffffff] mb-4">
                            Contact any of our team members through the following channels
                        </p>

                        <div className="flex gap-8">
                            <div className="feature-item">
                                <div className="feature-icon-box">
                                    <Mail size={32} strokeWidth={2.5} />
                                </div>
                                <h4 className="feature-title">Email Us</h4>
                                <p className="feature-desc mb-4">For general inquiries and support.</p>
                                <a href="mailto:monarchgrouptechgroup@gmail.com" className="text-[#D4AF37] hover:text-white transition-colors font-medium">
                                    monarchgrouptechgroup@gmail.com
                                </a>
                            </div>

                            <div className="feature-item">
                                <div className="feature-icon-box">
                                    <MessageCircle size={32} strokeWidth={2.5} />
                                </div>
                                <h4 className="feature-title">Live Chat</h4>
                                <p className="feature-desc">Available Mon-Fri, 9am - 6pm WAT.</p>
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
                </section >

                {/* Shipping Info Section */}
                < section className="section bg-[#0F0F0F]" >
                    <div className="container">
                        <h2 className="text-3xl font-serif text-center text-[#D4AF37] mb-8">Shipping Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div>
                                <p className="text-gray-300 mb-6 leading-relaxed">
                                    We are proud to offer a reliable and efficient shipping network that spans across the globe basically multiple regions, delivering directly to Nigeria.
                                </p>
                                <p className="text-gray-300 mb-6 leading-relaxed">
                                    Our logistics partners are selected for their speed, security, and care, ensuring that your items arrive in pristine condition.
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex items-center text-gray-400">
                                        <span className="w-2 h-2 bg-[#D4AF37] rounded-full mr-3"></span>
                                        Standard Delivery: 5-14 Business Days
                                    </li>
                                    <li className="flex items-center text-gray-400">
                                        <span className="w-2 h-2 bg-[#D4AF37] rounded-full mr-3"></span>
                                        Express Delivery: 3-5 Business Days
                                    </li>
                                    <li className="flex items-center text-gray-400">
                                        <span className="w-2 h-2 bg-[#D4AF37] rounded-full mr-3"></span>
                                        Nationwide Coverage
                                    </li>
                                </ul>
                            </div>
                            <div className="w-full h-[400px] rounded-2xl overflow-hidden glass-border shadow-2xl">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.4593258525!2d3.1191410931584985!3d6.548376811802148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2sus!4v1713292451234!5m2!1sen!2sus"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </section >
            </div >
        </div >
    );
}
