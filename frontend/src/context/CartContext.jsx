import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        loadCart();
    }, []);

    useEffect(() => {
        saveCart();
    }, [cartItems]);

    const loadCart = () => {
        try {
            const storedCart = localStorage.getItem('travelease_cart');
            if (storedCart) {
                setCartItems(JSON.parse(storedCart));
            }
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    };

    const saveCart = () => {
        try {
            localStorage.setItem('travelease_cart', JSON.stringify(cartItems));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    };

    const addToCart = (item) => {
        const itemToStore = {
            ...item,
            id: item.id || item._id, // Ensure we have a consistent id
            quantity: item.quantity || 1 // Ensure quantity defaults to 1
        };

        setCartItems(prev => {
            const existingItem = prev.find(cartItem => cartItem.id === itemToStore.id && cartItem.type === itemToStore.type);
            if (existingItem) {
                return prev.map(cartItem =>
                    cartItem.id === itemToStore.id && cartItem.type === itemToStore.type
                        ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
                        : cartItem
                );
            }
            return [...prev, itemToStore];
        });
    };

    const removeFromCart = (id, type) => {
        setCartItems(prev => prev.filter(item => !(item.id === id && item.type === type)));
    };

    const updateQuantity = (id, type, quantity) => {
        if (quantity <= 0) {
            removeFromCart(id, type);
            return;
        }

        setCartItems(prev =>
            prev.map(item =>
                item.id === id && item.type === type
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => {
            if (!item) return total;
            
            // Safely extract price with multiple fallback options
            let itemPrice = 0;
            
            // Try direct price property
            if (typeof item.price === 'number') {
                itemPrice = item.price;
            }
            // Try nested price.economy
            else if (item.price && typeof item.price === 'object' && typeof item.price.economy === 'number') {
                itemPrice = item.price.economy;
            }
            // Try price.pricePerNight
            else if (item.price && typeof item.price === 'object' && typeof item.price.pricePerNight === 'number') {
                itemPrice = item.price.pricePerNight;
            }
            // Try direct pricePerNight
            else if (typeof item.pricePerNight === 'number') {
                itemPrice = item.pricePerNight;
            }
            // Try other common price properties
            else if (typeof item.basePrice === 'number') {
                itemPrice = item.basePrice;
            }
            else if (typeof item.amount === 'number') {
                itemPrice = item.amount;
            }
            
            // Ensure quantity is a valid number
            const quantity = Number.isInteger(item.quantity) && item.quantity > 0 ? item.quantity : 1;
            
            // Calculate line total
            const lineTotal = itemPrice * quantity;
            
            // Only add if it's a valid number
            return total + (Number.isFinite(lineTotal) ? lineTotal : 0);
        }, 0);
    };

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => {
            if (!item) return total;
            const quantity = Number.isInteger(item.quantity) && item.quantity > 0 ? item.quantity : 1;
            return total + quantity;
        }, 0);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
