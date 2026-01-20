import { useNavigate } from 'react-router-dom';

export function Home() {
  const navigate = useNavigate();

  // TEMP PLACEHOLDER DATA
  const categories = [
    'Electronics',
    'Fashion',
    'Beauty',
    'Home & Living',
    'Building Materials',
    'Appliances',
    'Sports',
    'Accessories',
  ];

  const placeholderProducts = Array.from({ length: 8 });

  return (
    <main className="bg-slate-50">

      {/* ================= HERO AD BANNER ================= */}
      <section className="relative w-full h-[420px] bg-black overflow-hidden">
        <img
          src="https://via.placeholder.com/1600x600"
          alt="Hero Ad"
          className="w-full h-full object-cover opacity-90"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />

        <div className="absolute inset-0 flex items-center px-8 lg:px-16">
          <div className="max-w-xl text-white">
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">
              Discover Everything You Need
            </h1>
            <p className="text-lg opacity-90 mb-6">
              Shop across categories curated for quality and convenience.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-[#D4AF37] text-black px-8 py-3 rounded-lg font-bold hover:bg-[#c9a634]"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </section>

      {/* ================= CATEGORY GRID ================= */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16">
        <h2 className="text-2xl font-bold mb-8">Shop by Category</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => navigate(`/shop?category=${cat}`)}
              className="bg-white rounded-xl border border-slate-200 hover:shadow-lg transition p-4 flex flex-col gap-3"
            >
              <div className="h-32 bg-slate-100 rounded-lg flex items-center justify-center">
                <img
                  src="https://via.placeholder.com/200"
                  alt={cat}
                  className="object-cover h-full w-full rounded-lg"
                />
              </div>
              <span className="font-semibold text-slate-800">{cat}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ================= AD STRIP ================= */}
      <section className="w-full bg-white py-10 border-y">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <img
            src="https://via.placeholder.com/1400x300"
            alt="Mid Ad"
            className="w-full rounded-xl"
          />
        </div>
      </section>

      {/* ================= PRODUCT ROW ================= */}
      {[
        'Trending Products',
        'Recommended For You',
        'Electronics Picks',
        'Fashion Essentials',
      ].map((sectionTitle) => (
        <section
          key={sectionTitle}
          className="max-w-[1280px] mx-auto px-6 lg:px-10 py-14"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{sectionTitle}</h2>
            <button
              onClick={() => navigate('/shop')}
              className="text-sm text-[#D4AF37] font-semibold hover:underline"
            >
              See all
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {placeholderProducts.map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-slate-200 hover:shadow-lg transition cursor-pointer"
              >
                <div className="h-48 bg-slate-100 rounded-t-xl overflow-hidden">
                  <img
                    src="https://via.placeholder.com/300"
                    alt="Product Placeholder"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 flex flex-col gap-2">
                  <span className="text-xs text-slate-500">
                    Category
                  </span>
                  <span className="font-semibold text-slate-800 line-clamp-2">
                    Sample Product Name Goes Here
                  </span>

                  {/* ❌ NO PRICE ON HOMEPAGE */}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* ================= FULL WIDTH AD ================= */}
      <section className="w-full py-16 bg-black">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <img
            src="https://via.placeholder.com/1600x400"
            alt="Bottom Ad"
            className="w-full rounded-xl"
          />
        </div>
      </section>
    </main>
  );
}
