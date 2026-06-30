import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      })
      .then((data) => {
        const formattedProducts = data.map((product) => ({
          id: product.id,
          name: product.title,
          price: Math.round(product.price * 85), // USD → INR
          image: product.image,
        }));

        setProducts(formattedProducts);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const increaseQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="container">
      <header className="header">
        <h1>🛒 Mini E-Commerce Cart</h1>

        <div className="cart-badge">
          Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
        </div>
      </header>

      <div className="content">
        <section className="products-section">
          <h2>Products</h2>

          {loading && <p className="status">Loading products...</p>}

          {error && <p className="status error">{error}</p>}

          <div className="products-grid">
            {!loading &&
              !error &&
              products.map((product) => (
                <div className="card" key={product.id}>
                  <img src={product.image} alt={product.name} />

                  <h3>{product.name}</h3>

                  <p className="price">₹{product.price}</p>

                  <button onClick={() => addToCart(product)}>
                    Add to Cart
                  </button>
                </div>
              ))}
          </div>
        </section>

        <section className="cart-section">
          <h2>Your Cart</h2>

          {cart.length === 0 ? (
            <p className="empty-cart">Your cart is empty.</p>
          ) : (
            <>
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img src={item.image} alt={item.name} />

                  <div className="item-details">
                    <h4>{item.name}</h4>

                    <p>₹{item.price}</p>

                    <div className="quantity-controls">
                      <button onClick={() => decreaseQuantity(item.id)}>
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button onClick={() => increaseQuantity(item.id)}>
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div className="total-section">
                <h3>Total: ₹{totalPrice}</h3>

                <button className="checkout-btn">
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;