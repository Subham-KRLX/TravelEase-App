import { loadStripe } from '@stripe/stripe-js';

// Replace with your real publishable key from Stripe Dashboard
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51O4E2JSDl4O0X0S1X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0');

export default stripePromise;
