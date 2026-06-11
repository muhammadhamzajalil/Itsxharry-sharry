import React, { useState, useEffect } from "react";
import { DynamicIcon } from "./DynamicIcon";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  commission: number;
  description?: string;
}

interface FeaturedProductsProps {
  navigate: (page: string) => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ navigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback high-quality featured list
  const fallbackProducts: Product[] = [
    {
      id: "p-cosm-1",
      name: "Dermashine Hydrating Hydra-Facial Kit",
      price: 1850,
      originalPrice: 2450,
      image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=400",
      category: "Wellness",
      commission: 350,
      description: "6-step premium organic cleansing system for deep skin rejuvenation."
    },
    {
      id: "p-gadg-2",
      name: "T800 Ultra Smartwatch with 2.0 HD Screen",
      price: 1450,
      originalPrice: 2200,
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=400",
      category: "Smart Gadgets",
      commission: 250,
      description: "IP68 water resistant, real-time sleep monitors, bluetooth call assistant, custom sports dials."
    },
    {
      id: "p-elec-3",
      name: "Pro-Bass Wireless Neckband Air-Buds",
      price: 1250,
      originalPrice: 1950,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400",
      category: "Electronics",
      commission: 200,
      description: "45-hour ultra high fidelity driver playback with hybrid active cancellation thresholds."
    },
    {
      id: "p-well-4",
      name: "Natural Organic Charcoal Deep Cleanser",
      price: 950,
      originalPrice: 1450,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400",
      category: "Wellness",
      commission: 200,
      description: "Pure active carbon, natural tea tree oil extract, door-to-door safe tracking."
    }
  ];

  useEffect(() => {
    const fetchPublicProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            // Take up to 4 items and map schema keys
            const mapped = data.slice(0, 4).map((p: any) => ({
              id: p.id,
              name: p.name,
              price: p.price,
              originalPrice: p.price + (p.markupAmount || 350),
              image: p.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400",
              category: p.categoryName || "Lifestyle",
              commission: p.markupAmount || 200,
              description: p.description || "Premium imported inventory."
            }));
            setProducts(mapped);
          } else {
            setProducts(fallbackProducts);
          }
        } else {
          setProducts(fallbackProducts);
        }
      } catch (err) {
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicProducts();
  }, []);

  return (
    <section className="relative py-24 bg-gray-50 text-gray-900 overflow-hidden border-t border-b border-gray-100">
      {/* Decorative Blur Accent */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-black uppercase tracking-widest text-[#0B7A33] px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full select-none">
            Storefront Showcases
          </span>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl font-extrabold text-gray-950 uppercase tracking-tight">
            Featured Hot Products
          </h2>
          <p className="mt-3 text-sm text-gray-500 font-semibold leading-relaxed">
            Take a look at a subset of products directly importable to your personal agency store list with verified commissions. All prices in PKR.
          </p>
        </div>

        {/* Product Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {(loading ? fallbackProducts : products).map((product) => (
            <div 
              key={product.id}
              className="group bg-white rounded-3xl border border-gray-150 overflow-hidden hover:border-[#0B7A33]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-left"
            >
              {/* Image Container with Zoom hover */}
              <div className="relative aspect-square bg-gray-100 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3.5 left-3.5 px-3 py-1 bg-[#0B7A33] text-white text-[9.5px] font-mono font-bold uppercase tracking-wider rounded-lg shadow-sm">
                  {product.category}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-black text-sm text-gray-950 uppercase tracking-tight line-clamp-1 group-hover:text-[#0B7A33] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 font-semibold">
                    {product.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="font-mono">
                    <span className="text-sm font-black text-[#0B7A33] block">Rs. {product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-[10px] text-gray-400 font-bold line-through block leading-none">
                        Rs. {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-[#12A84A] font-mono font-black uppercase tracking-wider block">Commission</span>
                    <span className="text-xs font-mono font-black text-[#12A84A] block">Rs. {product.commission}</span>
                  </div>
                </div>
              </div>

              {/* Interaction Actions */}
              <div className="px-6 pb-6 pt-2">
                <button
                  onClick={() => navigate("shop")}
                  className="w-full py-3 bg-gray-900 hover:bg-[#0B7A33] text-white font-mono text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <DynamicIcon name="ShoppingBag" size={13} />
                  Instant Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action redirect footer */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate("shop")}
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-dashed border-[#0B7A33]/25 hover:border-[#0B7A33] text-gray-700 hover:text-[#0B7A33] font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
          >
            Explore Complete Wholesale Catalog
            <DynamicIcon name="ArrowRight" size={13} />
          </button>
        </div>

      </div>
    </section>
  );
};
