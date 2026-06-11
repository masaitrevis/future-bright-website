"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, ShoppingCart, ArrowRight, Loader } from "lucide-react";

interface Product {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  cover_image: string | null;
  category: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load products");
        setLoading(false);
      });
  }, [API_URL]);

  if (loading) {
    return (
      <div className="pt-32 flex items-center justify-center min-h-[60vh]">
        <Loader className="animate-spin text-gold-600" size={32} />
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-20 md:py-28 bg-navy-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1920&q=80"
            alt="Books"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-900/80 to-navy-900" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold-400 text-sm uppercase tracking-[0.25em] font-semibold mb-3">
            Our Collection
          </p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4">
            Books & Publications
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Discover our curated collection of books on business, sustainability, leadership, and African innovation.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8 text-center max-w-lg mx-auto">
              <p className="text-amber-800 font-semibold mb-2">⚠️ Backend Not Connected</p>
              <p className="text-amber-700 text-sm mb-3">
                The products service is currently unavailable. Make sure the backend is running at:
              </p>
              <code className="bg-amber-100 px-2 py-1 rounded text-xs text-amber-900">{API_URL}</code>
              <p className="text-amber-600 text-sm mt-3">
                Admin login: <strong>admin</strong> / <strong>admin123</strong> at <Link href="/admin" className="underline">/admin</Link>
              </p>
            </div>
          )}

          {products.length === 0 && !error && (
            <div className="text-center py-20">
              <BookOpen size={48} className="text-navy-300 mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold text-navy-700 mb-2">
                No books available yet
              </h3>
              <p className="text-navy-500 mb-4">
                Check back soon for our upcoming publications.
              </p>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 font-semibold"
              >
                Add books in admin <ArrowRight size={16} />
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-white border border-navy-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-[3/4] bg-navy-50 relative overflow-hidden">
                  {product.cover_image ? (
                    <img
                      src={`${API_URL.replace("/api", "")}${product.cover_image}`}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-navy-100">
                      <BookOpen size={48} className="text-navy-300" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-xs text-gold-600 uppercase tracking-wider font-semibold mb-2">
                    {product.category}
                  </p>
                  <h3 className="font-display text-lg font-semibold text-navy-900 mb-1">
                    {product.title}
                  </h3>
                  {product.author && (
                    <p className="text-sm text-navy-500 mb-3">by {product.author}</p>
                  )}
                  <p className="text-sm text-navy-600 line-clamp-2 mb-4">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-navy-900">
                      KES {product.price.toLocaleString()}
                    </span>
                    <Link
                      href={`/products/${product.id}`}
                      className="inline-flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      Buy Now
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
