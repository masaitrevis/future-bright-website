"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Package,
  Plus,
  Trash2,
  LogOut,
  Loader,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

interface Product {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  cover_image: string | null;
  file_path: string | null;
  category: string;
  status: string;
  created_at: string;
}

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("service");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL = "/api";

  const fetchProducts = useCallback(() => {
    if (!token) return;
    setLoading(true);
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, [token, API_URL]);

  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token") || localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (loggedIn) fetchProducts();
  }, [loggedIn, fetchProducts]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        setLoggedIn(true);
        localStorage.setItem("admin_token", data.token);
      } else {
        setMessage("Invalid credentials");
      }
    } catch {
      setMessage("Login failed");
    }
  };

  const handleLogout = () => {
    setToken("");
    setLoggedIn(false);
    localStorage.removeItem("admin_token");
    localStorage.removeItem("token");
  };

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setDescription("");
    setPrice("");
    setCategory("book");
    setCoverFile(null);
    setBookFile(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;

    setSubmitting(true);
    setMessage("");

    // Convert files to base64 for JSON transport
    let coverBase64 = null;
    let fileBase64 = null;

    if (coverFile) {
      coverBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(coverFile);
      });
    }

    if (bookFile) {
      fileBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(bookFile);
      });
    }

    try {
      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          description,
          price: parseFloat(price),
          category,
          cover_image: coverBase64,
          file_path: fileBase64,
        }),
      });
      const data = await res.json();
      if (data.id) {
        setMessage("Product created successfully!");
        resetForm();
        fetchProducts();
      } else {
        setMessage(data.error || "Failed to create product");
      }
    } catch {
      setMessage("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch {
      setMessage("Failed to delete");
    }
  };

  if (!loggedIn) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-navy-50">
        <div className="w-full max-w-md bg-white border border-navy-100 rounded-xl p-8">
          <div className="text-center mb-6">
            <Package size={40} className="text-gold-600 mx-auto mb-3" />
            <h1 className="font-display text-2xl font-bold text-navy-900">
              Admin Login
            </h1>
           
            <p className="text-sm text-navy-500">
              Manage your products and services
            </p>
          </div>

          {message && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-navy-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold-400"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-navy-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold-400"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-navy-800 hover:bg-navy-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-navy-500 hover:text-navy-700">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="font-display text-2xl font-bold text-navy-900">
              Admin Dashboard
            </h1>
            <p><a href="https://j24pd7scg7cto.kimi.page/"> Manage Tenders</a>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-navy-500 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {message && (
          <div className={`p-3 rounded-lg mb-6 text-sm ${message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {message}
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-navy-900">
            Products ({products.length})
          </h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={18} />
            {showForm ? "Cancel" : "Add Product"}
          </button>
        </div>

        {showForm && (
          <div className="bg-white border border-navy-100 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-navy-900 mb-4">Add New Product</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Driving Course, Consultancy Package..."
                    className="w-full border border-navy-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-2">
                    Brand / Subtitle / Author (Optional)
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Future Bright, 5-Day Course, John Doe..."
                    className="w-full border border-navy-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full border border-navy-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold-400"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-2">
                    Price (KES) *
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full border border-navy-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-navy-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold-400"
                  >
                    <option value="service">Service</option>
                    <option value="course">Course</option>
                    <option value="book">Book</option>
                    <option value="publication">Publication</option>
                    <option value="digital">Digital Product</option>
                    <option value="physical">Physical Product</option>
                    <option value="consultancy">Consultancy</option>
                    <option value="training">Training</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-2">
                    Cover Image (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-navy-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-2">
                  Product File / Download (Optional)
                </label>
                <input
                  type="file"
                  accept=".pdf,.zip,.doc,.docx"
                  onChange={(e) => setBookFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-navy-600"
                />
                <p className="text-xs text-navy-400 mt-1">
                  Upload the file buyers will download after payment (PDF, ZIP, DOC). Leave empty for services/courses.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-navy-800 hover:bg-navy-700 disabled:bg-navy-300 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <Loader className="animate-spin" size={16} />
                      Saving...
                    </span>
                  ) : (
                    "Save Product"
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-navy-200 hover:border-navy-300 text-navy-700 font-semibold px-6 py-2.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <Loader className="animate-spin text-gold-600 mx-auto" size={32} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white border border-navy-100 rounded-xl">
            <Package size={48} className="text-navy-300 mx-auto mb-4" />
            <p className="text-navy-500">
              No products yet. Add your first product above!
            </p>
          </div>
        ) : (
          <div className="bg-white border border-navy-100 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-navy-50">
                <tr>
                  <th className="text-left text-xs font-semibold text-navy-700 uppercase tracking-wider px-6 py-4">
                    Product
                  </th>
                  <th className="text-left text-xs font-semibold text-navy-700 uppercase tracking-wider px-6 py-4">
                    Brand / Subtitle
                  </th>
                  <th className="text-left text-xs font-semibold text-navy-700 uppercase tracking-wider px-6 py-4">
                    Price
                  </th>
                  <th className="text-left text-xs font-semibold text-navy-700 uppercase tracking-wider px-6 py-4">
                    Status
                  </th>
                  <th className="text-right text-xs font-semibold text-navy-700 uppercase tracking-wider px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-navy-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.cover_image ? (
                          <img
                            src={product.cover_image}
                            alt={product.title}
                            className="w-10 h-14 object-cover rounded"
                          />
                        ) : (
                          <div className="w-10 h-14 bg-navy-100 rounded flex items-center justify-center">
                            <Package size={16} className="text-navy-400" />
                          </div>
                        )}
                        <span className="font-medium text-navy-900">
                          {product.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-navy-600">
                      {product.author || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-navy-900">
                      KES {product.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                          product.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <CheckCircle size={12} />
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
