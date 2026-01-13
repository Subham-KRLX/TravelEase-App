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
            id: item.id || item._id // Ensure we have a consistent id
        };

        setCartItems(prev => {
            const existingItem = prev.find(cartItem => cartItem.id === itemToStore.id && cartItem.type === itemToStore.type);
            if (existingItem) {
                return prev.map(cartItem =>
                    cartItem.id === itemToStore.id && cartItem.type === itemToStore.type
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
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
            // Handle both direct price and nested price.economy structure
            const itemPrice = typeof item.price === 'number' ? item.price :
                (item.price?.economy || item.price?.pricePerNight || item.pricePerNight || 0);
            return total + (itemPrice * item.quantity);
        }, 0);
    };

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
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
