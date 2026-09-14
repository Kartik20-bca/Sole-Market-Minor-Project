import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api/products";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    brand: "",
    price: "",
  });

  const [search, setSearch] = useState("");
  const [selections, setSelections] = useState({});

  const [orderForm, setOrderForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pin: "",
    payment: "CARD",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  const getSelection = (product) => {
    const current = selections[product._id];

    const sizes =
      Array.isArray(product.size) && product.size.length > 0
        ? product.size
        : ["Standard"];

    return {
      size: current?.size || sizes[0],
      quantity: current?.quantity || 1,
    };
  };

  const handleSizeChange = (productId, size) => {
    setSelections((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        size,
        quantity: prev[productId]?.quantity || 1,
      },
    }));
  };

  const handleQuantityChange = (product, change) => {
    const current = getSelection(product);

    let newQuantity = current.quantity + change;

    if (newQuantity < 1) {
      newQuantity = 1;
    }

    if (product.stock > 0 && newQuantity > product.stock) {
      newQuantity = product.stock;
    }

    setSelections((prev) => ({
      ...prev,
      [product._id]: {
        ...prev[product._id],
        size: current.size,
        quantity: newQuantity,
      },
    }));
  };

  const addToCart = (product) => {
    const current = getSelection(product);

    const existingIndex = cart.findIndex(
      (item) =>
        item._id === product._id &&
        item.selectedSize === current.size
    );

    if (existingIndex !== -1) {
      setCart((prevCart) =>
        prevCart.map((item, index) =>
          index === existingIndex
            ? {
                ...item,
                quantity: item.quantity + current.quantity,
              }
            : item
        )
      );
    } else {
      setCart((prevCart) => [
        ...prevCart,
        {
          ...product,
          selectedSize: current.size,
          quantity: current.quantity,
        },
      ]);
    }

    setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    setCart((prevCart) =>
      prevCart.filter((_, i) => i !== index)
    );
  };

  const startEdit = (product) => {
    setEditingId(product._id);

    setEditForm({
      name: product.name || "",
      brand: product.brand || "",
      price: product.price || "",
    });
  };

  const handleEditChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const saveEdit = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, {
        name: editForm.name,
        brand: editForm.brand,
        price: Number(editForm.price),
      });

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === id ? response.data : product
        )
      );

      setEditingId(null);
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Unable to update product.");
    }
  };

  const deleteProduct = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`);

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      );

      setCart((prevCart) =>
        prevCart.filter((product) => product._id !== id)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Unable to delete product.");
    }
  };

  const filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase();

    return (
      product.name?.toLowerCase().includes(searchText) ||
      product.brand?.toLowerCase().includes(searchText) ||
      product.category?.toLowerCase().includes(searchText)
    );
  });

  const cartTotal = cart.reduce(
    (total, item) =>
      total + Number(item.price || 0) * item.quantity,
    0
  );

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const openCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const goBackToCart = () => {
    setIsCheckoutOpen(false);
    setIsCartOpen(true);
  };

  const handleOrderChange = (e) => {
    setOrderForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 6);

    if (value.length > 2) {
      value =
        value.slice(0, 2) +
        "/" +
        value.slice(2);
    }

    setOrderForm((prev) => ({
      ...prev,
      expiry: value,
    }));
  };

  const placeOrder = (e) => {
    e.preventDefault();

    if (
      !orderForm.name ||
      !orderForm.phone ||
      !orderForm.address ||
      !orderForm.city ||
      !orderForm.pin
    ) {
      alert("Please fill all delivery details.");
      return;
    }

    if (orderForm.payment === "CARD") {
      const cardDigits = orderForm.cardNumber.replace(/\s/g, "");

      if (
        cardDigits.length !== 16 ||
        !/^\d+$/.test(cardDigits)
      ) {
        alert("Please enter a valid 16-digit card number.");
        return;
      }

      if (!/^\d{2}\/\d{4}$/.test(orderForm.expiry)) {
        alert(
          "Please enter a valid expiry date in MM/YYYY format."
        );
        return;
      }

      if (!/^\d{4}$/.test(orderForm.cvv)) {
        alert("Please enter a valid 4-digit CVV.");
        return;
      }
    }

    const orderId = `SM-${Date.now()
      .toString()
      .slice(-8)}`;

    setLastOrder({
      orderId,
      name: orderForm.name,
      phone: orderForm.phone,
      address: orderForm.address,
      city: orderForm.city,
      pin: orderForm.pin,
      payment: orderForm.payment,
      items: [...cart],
      total: cartTotal,
    });

    setCart([]);
    setIsCheckoutOpen(false);
    setIsOrderSuccess(true);

    setOrderForm({
      name: "",
      phone: "",
      address: "",
      city: "",
      pin: "",
      payment: "CARD",
      cardNumber: "",
      expiry: "",
      cvv: "",
    });
  };

  if (isOrderSuccess && lastOrder) {
    return (
      <div
        className="order-success-page"
        style={{
          minHeight: "100vh",
          background: "#f5f5f5",
          padding: "40px 20px 60px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "1050px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              background: "#111",
              color: "#fff",
              borderRadius: "24px",
              padding: "50px 25px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              marginBottom: "25px",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "220px",
                height: "220px",
                borderRadius: "50%",
                background: "rgba(255,91,53,0.12)",
                top: "-100px",
                left: "-80px",
              }}
            />

            <div
              style={{
                position: "absolute",
                width: "260px",
                height: "260px",
                borderRadius: "50%",
                background: "rgba(255,91,53,0.10)",
                bottom: "-150px",
                right: "-80px",
              }}
            />

            <div
              style={{
                position: "relative",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  width: "92px",
                  height: "92px",
                  borderRadius: "50%",
                  background: "#ff5b35",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 25px",
                  boxShadow:
                    "0 12px 35px rgba(255,91,53,0.35)",
                }}
              >
                <span
                  style={{
                    fontSize: "48px",
                    fontWeight: "900",
                  }}
                >
                  ✓
                </span>
              </div>

              <p
                style={{
                  color: "#ff5b35",
                  fontWeight: "800",
                  letterSpacing: "2px",
                  fontSize: "13px",
                  marginBottom: "10px",
                }}
              >
                ORDER CONFIRMED
              </p>

              <h1
                style={{
                  fontSize: "42px",
                  margin: "0 0 12px",
                  fontWeight: "900",
                }}
              >
                Your kicks are on the way! 👟
              </h1>

              <p
                style={{
                  color: "#ccc",
                  fontSize: "17px",
                  margin: "0 auto",
                  maxWidth: "600px",
                  lineHeight: "1.6",
                }}
              >
                Thanks for shopping with Sole Market,{" "}
                <strong style={{ color: "#fff" }}>
                  {lastOrder.name}
                </strong>
                . Your order has been successfully placed.
              </p>
            </div>
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: "18px",
              padding: "22px 28px",
              marginBottom: "25px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
              boxShadow:
                "0 5px 25px rgba(0,0,0,0.06)",
            }}
          >
            <div>
              <span
                style={{
                  display: "block",
                  color: "#888",
                  fontSize: "13px",
                  marginBottom: "5px",
                }}
              >
                ORDER ID
              </span>

              <strong
                style={{
                  fontSize: "22px",
                  letterSpacing: "1px",
                }}
              >
                {lastOrder.orderId}
              </strong>
            </div>

            <div
              style={{
                background: "#fff1ec",
                color: "#ff5b35",
                padding: "10px 16px",
                borderRadius: "30px",
                fontWeight: "800",
                fontSize: "14px",
              }}
            >
              ✓ Payment: {lastOrder.payment}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(0, 1.4fr) minmax(280px, 0.8fr)",
              gap: "25px",
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: "20px",
                padding: "28px",
                boxShadow:
                  "0 5px 25px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "22px",
                  }}
                >
                  Your Order
                </h2>

                <span
                  style={{
                    color: "#777",
                    fontSize: "14px",
                  }}
                >
                  {lastOrder.items.length} item
                  {lastOrder.items.length !== 1 ? "s" : ""}
                </span>
              </div>

              {lastOrder.items.map((item, index) => (
                <div
                  key={`${item._id}-${item.selectedSize}-${index}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "18px 0",
                    borderBottom:
                      index !== lastOrder.items.length - 1
                        ? "1px solid #eee"
                        : "none",
                  }}
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={{
                        width: "95px",
                        height: "95px",
                        objectFit: "cover",
                        borderRadius: "16px",
                        background: "#f5f5f5",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "95px",
                        height: "95px",
                        borderRadius: "16px",
                        background: "#f5f5f5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "38px",
                      }}
                    >
                      👟
                    </div>
                  )}

                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 5px",
                        fontSize: "17px",
                      }}
                    >
                      {item.name}
                    </h3>

                    <p
                      style={{
                        margin: "0 0 7px",
                        color: "#777",
                        fontSize: "14px",
                      }}
                    >
                      {item.brand}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          background: "#f4f4f4",
                          padding: "5px 9px",
                          borderRadius: "7px",
                          fontSize: "12px",
                          color: "#555",
                        }}
                      >
                        Size {item.selectedSize}
                      </span>

                      <span
                        style={{
                          background: "#f4f4f4",
                          padding: "5px 9px",
                          borderRadius: "7px",
                          fontSize: "12px",
                          color: "#555",
                        }}
                      >
                        Qty {item.quantity}
                      </span>
                    </div>
                  </div>

                  <strong
                    style={{
                      fontSize: "17px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ₹
                    {(
                      Number(item.price) * item.quantity
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>
              ))}

              <div
                style={{
                  marginTop: "20px",
                  paddingTop: "20px",
                  borderTop: "2px solid #111",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "17px",
                    fontWeight: "700",
                  }}
                >
                  Total Amount
                </span>

                <strong
                  style={{
                    fontSize: "26px",
                    color: "#ff5b35",
                  }}
                >
                  ₹
                  {Number(lastOrder.total).toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "25px",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: "20px",
                  padding: "28px",
                  boxShadow:
                    "0 5px 25px rgba(0,0,0,0.06)",
                }}
              >
                <h2
                  style={{
                    margin: "0 0 20px",
                    fontSize: "22px",
                  }}
                >
                  Delivery Details
                </h2>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "17px",
                  }}
                >
                  <div>
                    <span
                      style={{
                        display: "block",
                        color: "#888",
                        fontSize: "12px",
                        marginBottom: "4px",
                      }}
                    >
                      NAME
                    </span>

                    <strong>{lastOrder.name}</strong>
                  </div>

                  <div>
                    <span
                      style={{
                        display: "block",
                        color: "#888",
                        fontSize: "12px",
                        marginBottom: "4px",
                      }}
                    >
                      PHONE
                    </span>

                    <strong>{lastOrder.phone}</strong>
                  </div>

                  <div>
                    <span
                      style={{
                        display: "block",
                        color: "#888",
                        fontSize: "12px",
                        marginBottom: "4px",
                      }}
                    >
                      ADDRESS
                    </span>

                    <strong>{lastOrder.address}</strong>
                  </div>

                  <div>
                    <span
                      style={{
                        display: "block",
                        color: "#888",
                        fontSize: "12px",
                        marginBottom: "4px",
                      }}
                    >
                      CITY & PIN
                    </span>

                    <strong>
                      {lastOrder.city} - {lastOrder.pin}
                    </strong>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: "#111",
                  color: "#fff",
                  borderRadius: "20px",
                  padding: "25px",
                }}
              >
                <div
                  style={{
                    fontSize: "28px",
                    marginBottom: "12px",
                  }}
                >
                  🚚
                </div>

                <h3
                  style={{
                    margin: "0 0 8px",
                    fontSize: "19px",
                  }}
                >
                  Estimated Delivery in 4-5 Days
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: "#ccc",
                    lineHeight: "1.5",
                    fontSize: "14px",
                  }}
                >
                  Your order is being prepared and will
                  reach you soon.
                </p>

                <div
                  style={{
                    marginTop: "18px",
                    background: "#ff5b35",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    textAlign: "center",
                    fontWeight: "800",
                  }}
                >
                  Order Confirmed ✓
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              textAlign: "center",
              marginTop: "30px",
            }}
          >
            <button
              onClick={() => {
                setIsOrderSuccess(false);
                setLastOrder(null);
              }}
              style={{
                border: "none",
                background: "#ff5b35",
                color: "#fff",
                padding: "16px 38px",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "800",
                cursor: "pointer",
                boxShadow:
                  "0 8px 25px rgba(255,91,53,0.25)",
              }}
            >
              Continue Shopping →
            </button>

            <p
              style={{
                marginTop: "18px",
                color: "#888",
                fontSize: "14px",
              }}
            >
              Thank you for choosing{" "}
              <strong style={{ color: "#111" }}>
                SOLE MARKET
              </strong>{" "}
              🧡
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isCheckoutOpen) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <button
            className="back-cart-button"
            onClick={goBackToCart}
          >
            ← Back to Cart
          </button>

          <div className="checkout-header">
            <h1>Checkout 🛍️</h1>
            <p>
              Almost there. Let's get those kicks to you.
            </p>
          </div>

          <div className="checkout-layout">
            <form
              className="checkout-form"
              onSubmit={placeOrder}
            >
              <div className="checkout-card">
                <h2>Delivery Details</h2>

                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={orderForm.name}
                    onChange={handleOrderChange}
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={orderForm.phone}
                    onChange={handleOrderChange}
                  />
                </div>

                <div className="form-group">
                  <label>Delivery Address</label>
                  <textarea
                    name="address"
                    placeholder="House number, street, area"
                    value={orderForm.address}
                    onChange={handleOrderChange}
                    rows="4"
                  />
                </div>

                <div className="checkout-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={orderForm.city}
                      onChange={handleOrderChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>PIN Code</label>
                    <input
                      type="text"
                      name="pin"
                      placeholder="PIN Code"
                      value={orderForm.pin}
                      onChange={handleOrderChange}
                    />
                  </div>
                </div>
              </div>

              <div className="checkout-card">
                <h2>Payment Method</h2>

                <div className="payment-options">
                  <label
                    className={
                      orderForm.payment === "CARD"
                        ? "payment-option active"
                        : "payment-option"
                    }
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="CARD"
                      checked={
                        orderForm.payment === "CARD"
                      }
                      onChange={handleOrderChange}
                    />

                    <span>💳</span>

                    <div>
                      <strong>
                        Credit / Debit Card
                      </strong>
                      <small>
                        Pay securely using your card
                      </small>
                    </div>
                  </label>

                  {orderForm.payment === "CARD" && (
                    <div className="card-details">
                      <div className="form-group">
                        <label>Card Number</label>

                        <input
                          type="text"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                          inputMode="numeric"
                          value={orderForm.cardNumber}
                          onChange={handleOrderChange}
                        />
                      </div>

                      <div className="checkout-row">
                        <div className="form-group">
                          <label>Expiry Date</label>

                          <input
                            type="text"
                            name="expiry"
                            placeholder="MM/YYYY"
                            maxLength="7"
                            inputMode="numeric"
                            value={orderForm.expiry}
                            onChange={handleExpiryChange}
                          />
                        </div>

                        <div className="form-group">
                          <label>CVV</label>

                          <input
                            type="password"
                            name="cvv"
                            placeholder="••••"
                            maxLength="4"
                            inputMode="numeric"
                            value={orderForm.cvv}
                            onChange={handleOrderChange}
                          />
                        </div>
                      </div>

                      <div className="card-secure-message">
                        🔒 Your card information is securely
                        handled.
                      </div>
                    </div>
                  )}

                  <label
                    className={
                      orderForm.payment === "UPI"
                        ? "payment-option active"
                        : "payment-option"
                    }
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="UPI"
                      checked={
                        orderForm.payment === "UPI"
                      }
                      onChange={handleOrderChange}
                    />

                    <span>📱</span>

                    <div>
                      <strong>UPI</strong>
                      <small>
                        Pay securely using UPI
                      </small>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="place-order-button"
              >
                Place Order • ₹
                {cartTotal.toLocaleString("en-IN")}
              </button>
            </form>

            <div className="checkout-summary">
              <div className="checkout-card">
                <h2>Your Kicks</h2>

                <div className="checkout-items">
                  {cart.map((item, index) => (
                    <div
                      className="checkout-item"
                      key={`${item._id}-${item.selectedSize}-${index}`}
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                        />
                      ) : (
                        <div className="checkout-item-no-image">
                          👟
                        </div>
                      )}

                      <div className="checkout-item-info">
                        <strong>{item.name}</strong>

                        <span>{item.brand}</span>

                        <span>
                          Size: {item.selectedSize}
                        </span>

                        <span>
                          Qty: {item.quantity}
                        </span>
                      </div>

                      <b>
                        ₹
                        {(
                          Number(item.price) *
                          item.quantity
                        ).toLocaleString("en-IN")}
                      </b>
                    </div>
                  ))}
                </div>

                <div className="checkout-total">
                  <span>Total</span>

                  <strong>
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </strong>
                </div>

                <div className="secure-message">
                  🔒 Your order details are securely handled.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-main">SOLE</span>
          <span className="logo-market">MARKET</span>
        </div>

        <input
          type="text"
          className="search-box"
          placeholder="Search shoes or brands..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="cart"
          onClick={() => setIsCartOpen(true)}
        >
          🛒 Cart ({cartCount})
        </button>
      </header>

      <section className="hero">
        <h1>Step Into Style</h1>

        <p>
          Discover the latest kicks from your favorite brands.
        </p>
      </section>

      <section className="products-section">
        <h2>Our Collection</h2>

        {filteredProducts.length === 0 ? (
          <p className="no-products">
            No kicks found. Try another search.
          </p>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => {
              const currentSelection =
                getSelection(product);

              const availableSizes =
                Array.isArray(product.size) &&
                product.size.length > 0
                  ? product.size
                  : ["Standard"];

              return (
                <div
                  className="product-card"
                  key={product._id}
                >
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="product-image"
                    />
                  ) : (
                    <div className="product-image no-image">
                      No Image
                    </div>
                  )}

                  {editingId === product._id ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        placeholder="Shoe name"
                      />

                      <input
                        type="text"
                        name="brand"
                        value={editForm.brand}
                        onChange={handleEditChange}
                        placeholder="Brand"
                      />

                      <input
                        type="number"
                        name="price"
                        value={editForm.price}
                        onChange={handleEditChange}
                        placeholder="Price"
                      />

                      <div className="edit-buttons">
                        <button
                          onClick={() =>
                            saveEdit(product._id)
                          }
                        >
                          Save
                        </button>

                        <button
                          onClick={() =>
                            setEditingId(null)
                          }
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="product-info">
                      <div className="product-top">
                        <h3>{product.name}</h3>

                        {product.stock > 0 && (
                          <span className="stock-badge">
                            {product.stock} left
                          </span>
                        )}
                      </div>

                      <p className="brand">
                        {product.brand}
                      </p>

                      {product.category && (
                        <p className="category">
                          {product.category}
                        </p>
                      )}

                      {product.description && (
                        <p className="description">
                          {product.description}
                        </p>
                      )}

                      <p className="price">
                        ₹
                        {Number(product.price).toLocaleString(
                          "en-IN"
                        )}
                      </p>

                      <div className="size-section">
                        <div className="size-header">
                          <span>Size</span>

                          <strong>
                            {currentSelection.size}
                          </strong>
                        </div>

                        <div className="size-options">
                          {availableSizes.map((size) => (
                            <button
                              key={String(size)}
                              type="button"
                              className={
                                String(
                                  currentSelection.size
                                ) === String(size)
                                  ? "size-button active"
                                  : "size-button"
                              }
                              onClick={() =>
                                handleSizeChange(
                                  product._id,
                                  size
                                )
                              }
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="quantity-section">
                        <span>Quantity</span>

                        <div className="quantity-control">
                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(
                                product,
                                -1
                              )
                            }
                          >
                            −
                          </button>

                          <span>
                            {currentSelection.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(
                                product,
                                1
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="product-buttons">
                        <button
                          onClick={() =>
                            addToCart(product)
                          }
                        >
                          🛒 Add to Cart
                        </button>

                        <button
                          onClick={() =>
                            startEdit(product)
                          }
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            deleteProduct(product._id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {isCartOpen && (
        <div
          className="cart-overlay"
          onClick={() => setIsCartOpen(false)}
        >
          <div
            className="cart-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cart-header">
              <h2>Your Cart 🛒</h2>

              <button
                className="close-cart"
                onClick={() =>
                  setIsCartOpen(false)
                }
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-icon">
                  🛒
                </div>

                <h3>Your cart is empty</h3>

                <p>
                  Time to add some fresh kicks.
                </p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item, index) => (
                    <div
                      className="cart-item"
                      key={`${item._id}-${item.selectedSize}-${index}`}
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="cart-item-image"
                        />
                      ) : (
                        <div className="cart-item-image">
                          👟
                        </div>
                      )}

                      <div className="cart-item-info">
                        <strong>
                          {item.name}
                        </strong>

                        <span>{item.brand}</span>

                        <span>
                          Size: {item.selectedSize}
                        </span>

                        <span>
                          Qty: {item.quantity}
                        </span>

                        <b>
                          ₹
                          {(
                            Number(item.price) *
                            item.quantity
                          ).toLocaleString("en-IN")}
                        </b>
                      </div>

                      <button
                        className="remove-cart-item"
                        onClick={() =>
                          removeFromCart(index)
                        }
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div className="cart-total-row">
                    <span>Total</span>

                    <strong>
                      ₹{cartTotal.toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <button
                    className="checkout-button"
                    onClick={openCheckout}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <footer className="footer">
        <p>
          © 2026 Sole Market. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;