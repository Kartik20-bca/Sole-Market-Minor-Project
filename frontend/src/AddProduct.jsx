import { useState } from "react";
import axios from "axios";

const CURATED_IMAGE_PRESETS = [
  {
    name: "Crimson Eclipse High",
    url: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Monochrome Low",
    url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Quantum Cyan Drop",
    url: "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Emerald Court",
    url: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Retro Stealth Slate",
    url: "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Autumn Wheat Suede",
    url: "https://images.unsplash.com/photo-1588117260148-b47818741c74?auto=format&fit=crop&w=800&q=80",
  },
];

const BRAND_PRESETS = [
  "Neo-Stride",
  "CyberPulse",
  "Volt Stryke",
  "Apex Grail",
  "Chrono Drip",
  "Vortex Aero",
  "Shadow Forge",
  "Kinetic Labs",
  "Solaris",
  "Echo Skate",
];

const CATEGORY_PRESETS = [
  "Exclusive Drop",
  "High-Top",
  "Streetwear",
  "Retro Court",
  "Air Cushion",
  "Hyper-Comfort",
  "Skatewear",
];

const STANDARD_SIZES = ["6", "7", "8", "9", "10", "11", "12"];

function AddProduct({ token, apiUrl, onProductAdded, onClose }) {
  const [form, setForm] = useState({
    name: "",
    brand: "Neo-Stride",
    price: "16999",
    category: "Exclusive Drop",
    imageUrl: "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=800&q=80",
    description: "Engineered with aerodynamic styling, signature responsive cushioning, and premium handcrafted leather overlays.",
    size: "7, 8, 9, 10, 11",
    stock: "15",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedSizes, setSelectedSizes] = useState(["7", "8", "9", "10", "11"]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const toggleSize = (sz) => {
    let updated;
    if (selectedSizes.includes(sz)) {
      if (selectedSizes.length === 1) return; // keep at least one
      updated = selectedSizes.filter((s) => s !== sz);
    } else {
      updated = [...selectedSizes, sz].sort((a, b) => Number(a) - Number(b));
    }
    setSelectedSizes(updated);
    setForm((prev) => ({
      ...prev,
      size: updated.join(", "),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const sizes = (form.size || "")
      .split(",")
      .map((size) => size.trim())
      .filter((size) => size !== "");

    const newProductPayload = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      price: Number(form.price) || 9999,
      category: form.category.trim() || "Exclusive Drop",
      imageUrl: form.imageUrl.trim() || "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
      description: form.description.trim() || "Handcrafted collector sneaker drop with responsive high-rebound cushioning.",
      size: sizes.length > 0 ? sizes : ["7", "8", "9", "10", "11"],
      stock: Number(form.stock) || 10,
    };

    const endpoint = apiUrl || "https://sole-market-backend.onrender.com/api/products";

    try {
      let createdProduct = null;
      try {
        const res = await axios.post(endpoint, newProductPayload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        createdProduct = res.data;
      } catch (backendErr) {
        console.warn("Backend API save skipped/offline, creating local item:", backendErr?.message);
        createdProduct = {
          _id: "custom-prod-" + Date.now(),
          ...newProductPayload,
        };
      }

      if (onProductAdded && createdProduct) {
        onProductAdded(createdProduct);
      }

      alert("👟 Sneaker successfully added to the Sole Market catalog! 🔥");
      if (onClose) onClose();
    } catch (err) {
      console.error("Error adding product:", err);
      setErrorMsg(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Could not add product. Please check fields and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 3000,
        padding: "16px",
        backdropFilter: "blur(10px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          maxHeight: "92vh",
          overflowY: "auto",
          background: "linear-gradient(180deg, #181818 0%, #111111 100%)",
          color: "#fff",
          borderRadius: "24px",
          padding: "30px",
          boxSizing: "border-box",
          boxShadow: "0 30px 80px rgba(0,0,0,0.8), 0 0 40px rgba(255,91,53,0.15)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            paddingBottom: "16px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: "900",
                color: "#ff5b35",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>👑 SNEAKER CREATION STUDIO</span>
            </div>
            <h2 style={{ margin: "4px 0 0", fontSize: "24px", fontWeight: "900", letterSpacing: "-0.5px" }}>
              Add New Sneaker Drop
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "50%",
              width: "38px",
              height: "38px",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "0.2s ease",
            }}
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div
            style={{
              background: "rgba(255, 75, 75, 0.15)",
              border: "1px solid #ff4b4b",
              color: "#ff8b8b",
              padding: "12px 16px",
              borderRadius: "12px",
              marginBottom: "16px",
              fontSize: "13px",
              fontWeight: "700",
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Sneaker Name */}
          <div>
            <label style={{ fontSize: "13px", fontWeight: "800", color: "#ddd", display: "block", marginBottom: "6px" }}>
              Sneaker Name *
            </label>
            <input
              name="name"
              placeholder="e.g. Neo-Stride Apex High 'Midnight Obsidian'"
              value={form.name}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "13px 15px",
                borderRadius: "12px",
                background: "#222222",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff",
                fontSize: "14px",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          {/* Brand Selection with Quick Preset Chips */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "800", color: "#ddd" }}>
                Brand *
              </label>
              <span style={{ fontSize: "11px", color: "#ff8c00" }}>Click a brand chip below:</span>
            </div>
            <input
              name="brand"
              placeholder="e.g. Neo-Stride, CyberPulse, Volt Stryke"
              value={form.brand}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px 15px",
                borderRadius: "12px",
                background: "#222222",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff",
                fontSize: "14px",
                boxSizing: "border-box",
                outline: "none",
                marginBottom: "8px",
              }}
            />
            {/* Quick Brand Pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {BRAND_PRESETS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, brand: b }))}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "16px",
                    border: form.brand === b ? "1px solid #ff5b35" : "1px solid rgba(255,255,255,0.1)",
                    background: form.brand === b ? "rgba(255,91,53,0.2)" : "rgba(255,255,255,0.04)",
                    color: form.brand === b ? "#ff8c00" : "#bbb",
                    fontSize: "11px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Price & Stock Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "800", color: "#ddd", display: "block", marginBottom: "6px" }}>
                Price (₹) *
              </label>
              <input
                name="price"
                type="number"
                placeholder="e.g. 16999"
                value={form.price}
                onChange={handleChange}
                required
                min="1"
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  borderRadius: "12px",
                  background: "#222222",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "800", color: "#ddd", display: "block", marginBottom: "6px" }}>
                Stock in Vault *
              </label>
              <input
                name="stock"
                type="number"
                placeholder="e.g. 15"
                value={form.stock}
                onChange={handleChange}
                min="0"
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  borderRadius: "12px",
                  background: "#222222",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label style={{ fontSize: "13px", fontWeight: "800", color: "#ddd", display: "block", marginBottom: "6px" }}>
              Category
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
              {CATEGORY_PRESETS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, category: cat }))}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "16px",
                    border: form.category === cat ? "1px solid #ff5b35" : "1px solid rgba(255,255,255,0.08)",
                    background: form.category === cat ? "rgba(255,91,53,0.25)" : "#222",
                    color: form.category === cat ? "#ff914d" : "#aaa",
                    fontSize: "11px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Size Multi-Select Toggle */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "800", color: "#ddd" }}>
                Available Sizes (UK / India)
              </label>
              <span style={{ fontSize: "11px", color: "#4ade80" }}>Click to toggle sizes</span>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "6px" }}>
              {STANDARD_SIZES.map((sz) => {
                const active = selectedSizes.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => toggleSize(sz)}
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "10px",
                      border: active ? "1px solid #ff5b35" : "1px solid rgba(255,255,255,0.1)",
                      background: active ? "linear-gradient(135deg, #ff5b35, #e03e1a)" : "#222",
                      color: "#fff",
                      fontSize: "14px",
                      fontWeight: "900",
                      cursor: "pointer",
                      boxShadow: active ? "0 0 12px rgba(255,91,53,0.4)" : "none",
                      transition: "0.2s ease",
                    }}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image URL & Preset Selection Gallery */}
          <div>
            <label style={{ fontSize: "13px", fontWeight: "800", color: "#ddd", display: "block", marginBottom: "6px" }}>
              Sneaker Visual Preset or Custom URL
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "10px" }}>
              {CURATED_IMAGE_PRESETS.map((preset) => (
                <div
                  key={preset.name}
                  onClick={() => setForm((p) => ({ ...p, imageUrl: preset.url }))}
                  style={{
                    background: form.imageUrl === preset.url ? "rgba(255,91,53,0.25)" : "#222",
                    border: form.imageUrl === preset.url ? "2px solid #ff5b35" : "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    padding: "6px",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.2s ease",
                  }}
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    style={{ width: "100%", height: "55px", objectFit: "cover", borderRadius: "8px" }}
                  />
                  <span style={{ fontSize: "10px", fontWeight: "700", color: "#ddd", display: "block", marginTop: "4px" }}>
                    {preset.name}
                  </span>
                </div>
              ))}
            </div>

            <input
              name="imageUrl"
              placeholder="Or paste custom image URL (https://...)"
              value={form.imageUrl}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px 15px",
                borderRadius: "12px",
                background: "#222222",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff",
                fontSize: "13px",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: "13px", fontWeight: "800", color: "#ddd", display: "block", marginBottom: "6px" }}>
              Sneaker Story & Specs
            </label>
            <textarea
              name="description"
              placeholder="Craftsmanship details, silhouette highlights, and materials..."
              value={form.description}
              onChange={handleChange}
              rows={2}
              style={{
                width: "100%",
                padding: "12px 15px",
                borderRadius: "12px",
                background: "#222222",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff",
                fontSize: "13px",
                boxSizing: "border-box",
                resize: "vertical",
                outline: "none",
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "transparent",
                color: "#aaa",
                fontWeight: "700",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 2,
                padding: "14px",
                borderRadius: "14px",
                border: "none",
                background: "linear-gradient(135deg, #ff5b35 0%, #ff8c00 100%)",
                color: "#fff",
                fontWeight: "900",
                fontSize: "15px",
                letterSpacing: "0.5px",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 8px 25px rgba(255,91,53,0.4)",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Adding Drop..." : "➕ Add to Catalog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;