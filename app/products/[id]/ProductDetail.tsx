"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, ArrowLeft, Loader, CheckCircle, Download } from "lucide-react";

interface Product {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  cover_image: string | null;
  category: string;
}

export default function ProductDetail({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paying, setPaying] = useState(false);
  const [payStatus, setPayStatus] = useState<"idle" | "pending" | "success" | "failed">("idle");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [pollToken, setPollToken] = useState("");
  const [hasFile, setHasFile] = useState(false);
  const [serviceDetails, setServiceDetails] = useState("");
  const [receipt, setReceipt] = useState("");
  const [downloadToken, setDownloadToken] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [pollCount, setPollCount] = useState(0);
  const [error, setError] = useState("");

  const API_URL = "/api";

  useEffect(() => {
    if (!id) return;
    fetch(`${API_URL}/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load product");
        setLoading(false);
      });
  }, [id, API_URL]);

  // Poll payment status with timeout
  const MAX_POLLS = 40; // ~2 minutes (40 * 3 seconds)

  useEffect(() => {
    if (!orderId || !pollToken || payStatus !== "pending") return;

    const interval = setInterval(() => {
      setPollCount((c) => {
        const newCount = c + 1;
        if (newCount >= MAX_POLLS) {
          clearInterval(interval);
          return newCount;
        }
        return newCount;
      });

      fetch(`${API_URL}/payments/status/${orderId}?token=${encodeURIComponent(pollToken)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "paid") {
            setPayStatus("success");
            setDownloadToken(data.downloadToken || "");
            setDownloadUrl(data.downloadUrl || "");
            setHasFile(data.hasFile);
            setReceipt(data.receipt || "");
            if (!data.hasFile) {
              setServiceDetails("You will receive a confirmation call/email shortly with next steps.");
            }
            clearInterval(interval);
          } else if (data.status === "failed") {
            setPayStatus("failed");
            clearInterval(interval);
          }
        })
        .catch(() => {
          // Silently retry on network errors
        });
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId, pollToken, payStatus, API_URL]);

  const handlePayment = async () => {
    if (!phoneNumber || !product) return;
    setPaying(true);
    setPayStatus("pending");
    setPollCount(0);
    setError("");

    try {
      const res = await fetch(`${API_URL}/payments/stkpush`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber,
          productId: product.id,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOrderId(data.orderId);
        setPollToken(data.pollToken);
      } else {
        setPayStatus("failed");
        setError(data.error || "Payment failed");
      }
    } catch (err) {
      setPayStatus("failed");
      setError("Network error. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 flex items-center justify-center min-h-[60vh]">
        <Loader className="animate-spin text-gold-600" size={32} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 text-center">
        <p className="text-navy-500">Product not found</p>
        <Link href="/products" className="text-gold-600 hover:underline mt-4 inline-block">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/products" className="inline-flex items-center gap-2 text-navy-500 hover:text-navy-700 mb-8">
          <ArrowLeft size={18} />
          Back to all products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Book Cover */}
          <div className="aspect-[3/4] bg-navy-50 rounded-xl overflow-hidden">
            {product.cover_image ? (
              <img
                src={`${API_URL.replace("/api", "")}${product.cover_image}`}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-navy-100">
                <Package size={64} className="text-navy-300" />
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-center">
            <p className="text-gold-600 text-sm uppercase tracking-[0.25em] font-semibold mb-3">
              {product.category}
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-navy-900 mb-2">
              {product.title}
            </h1>
            {product.author && (
              <p className="text-lg text-navy-500 mb-4">{product.author}</p>
            )}
            <p className="text-navy-600 leading-relaxed mb-6">
              {product.description}
            </p>
            <p className="text-3xl font-bold text-navy-900 mb-8">
              KES {product.price.toLocaleString()}
            </p>

            {/* Payment Section */}
            {payStatus === "success" ? (
              hasFile ? (
                /* Downloadable product (book, PDF, etc.) */
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="text-green-600" size={24} />
                    <h3 className="font-semibold text-green-800">Payment Successful!</h3>
                  </div>
                  <p className="text-green-700 mb-4">
                    Your purchase is complete. Click below to download your product.
                  </p>
                  {receipt && (
                    <p className="text-sm text-green-600 mb-4">
                      Receipt: <strong>{receipt}</strong>
                    </p>
                  )}
                  <a
                    href={downloadUrl || `${API_URL}/download/${downloadToken}`}
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                  >
                    <Download size={18} />
                    Download Product
                  </a>
                </div>
              ) : (
                /* Service / No file (driving course, consultancy, etc.) */
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="text-green-600" size={24} />
                    <h3 className="font-semibold text-green-800">Payment Confirmed!</h3>
                  </div>
                  <p className="text-green-700 mb-4">
                    Thank you for your purchase. Your payment has been received.
                  </p>
                  {receipt && (
                    <p className="text-sm text-green-600 mb-4">
                      Receipt: <strong>{receipt}</strong>
                    </p>
                  )}
                  <div className="bg-white border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-navy-700">
                      <strong>Next Steps:</strong> {serviceDetails}
                    </p>
                  </div>
                  <p className="text-xs text-green-600">
                    You will receive a confirmation call or email shortly with further instructions.
                  </p>
                </div>
              )
            ) : (
              <div className="bg-navy-50 border border-navy-100 rounded-xl p-6">
                <h3 className="font-semibold text-navy-900 mb-4">Purchase This Product</h3>

                {payStatus === "pending" ? (
                  <div className="text-center py-4">
                    <Loader className="animate-spin text-gold-600 mx-auto mb-3" size={24} />
                    <p className="text-navy-600">
                      Mobile money prompt sent to your phone. Please complete payment...
                    </p>
                    {pollCount >= MAX_POLLS && (
                      <div className="mt-4">
                        <p className="text-sm text-navy-500 mb-3">
                          Taking longer than expected? The callback may not have reached our server.
                        </p>
                        <button
                          onClick={() => {
                            setPollCount(0);
                            setPayStatus("idle");
                          }}
                          className="text-sm text-gold-600 hover:text-gold-700 font-medium underline"
                        >
                          Try again
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-2">
                        Mobile Money Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="254700000000 or 0700000000"
                        className="w-full bg-white border border-navy-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-400"
                      />
                      <p className="text-xs text-navy-400 mt-1">
                        Enter your mobile money registered number
                      </p>
                    </div>

                    {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

                    {payStatus === "failed" && (
                      <p className="text-red-600 text-sm mb-4">
                        Payment failed. Please try again.
                      </p>
                    )}

                    <button
                      onClick={handlePayment}
                      disabled={paying || !phoneNumber}
                      className="w-full bg-navy-800 hover:bg-navy-700 disabled:bg-navy-300 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {paying ? (
                        <>
                          <Loader className="animate-spin" size={18} />
                          Processing...
                        </>
                      ) : (
                        <>Pay via NCBA mobile money</>
                      )}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
