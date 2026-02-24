import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import InterviewContext from "../context/InterviewContext";
import { calculateTotal, addOnPrices } from "../utils/pricing";
import toast from "react-hot-toast";

const coupons = {
  FIRST50: (subtotal: number) => Math.min(subtotal * 0.5, 25),
  SAVE10: (subtotal: number) => (subtotal > 30 ? 10 : 0),
};

const CheckoutPage = () => {
  const { state } = useContext(InterviewContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const navigate = useNavigate();

  const subtotal =
    state.duration && state.difficulty
      ? calculateTotal(state.duration, state.difficulty, state.addOns)
      : 0;

  const total = Math.max(subtotal - discount, 0);

  const handleApplyCoupon = () => {
    if (!coupon) return;
    if (!coupons[coupon as keyof typeof coupons]) {
      toast.error("Invalid coupon code");
      return;
    }
    if (coupon === "SAVE10" && subtotal <= 30) {
      toast.error("This coupon requires a minimum order of $30.");
      return;
    }
    const disc = coupons[coupon as keyof typeof coupons](subtotal);
    setDiscount(disc);
    setAppliedCoupon(coupon);
    toast.success(`Coupon applied! Discount: $${disc}`);
    setCoupon("");
  };

  const mockPayment = async (email: string, amount: number) => {
    return new Promise<{ success: boolean; error?: string }>((resolve) => {
      setTimeout(() => {
        if (Math.random() > 0.2) resolve({ success: true });
        else resolve({ success: false, error: "Payment declined. Try again." });
      }, 2000);
    });
  };

  const handlePay = async () => {
    if (!name || name.trim().split(" ").length < 2) {
      toast.error("Name must contain first and last name");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Invalid email address");
      return;
    }
    setLoading(true);
    const res = await mockPayment(email, total);
    setLoading(false);
    if (res.success) setPaymentSuccess(true);
    else setPaymentError(res.error || "Payment failed");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {/* Order Summary */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="font-semibold mb-2">Order Summary</h2>
        <p>Type: {state.interviewType}</p>
        <p>Difficulty: {state.difficulty}</p>
        <p>Duration: {state.duration} min</p>
        <p>Topics: {state.topics.join(", ")}</p>
        <p>Base + Add-ons Subtotal: ${subtotal.toFixed(2)}</p>
        {appliedCoupon && (
          <p>
            Discount ({appliedCoupon}): -${discount}
          </p>
        )}
        <p className="font-bold">Total: ${total.toFixed(2)}</p>
        <button
          className="text-blue-600 underline mt-2"
          onClick={() => navigate("/configure")}
        >
          Edit
        </button>
      </div>

      {/* Payment Form */}
      {!paymentSuccess ? (
        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Payment</h2>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />

          {/* Coupon */}
          {!appliedCoupon && (
            <div className="mb-2">
              <input
                type="text"
                placeholder="Coupon Code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                className="p-2 border rounded mr-2"
              />
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleApplyCoupon}
              >
                Apply
              </button>
            </div>
          )}

          <button
            className={`w-full py-3 mt-4 font-bold rounded ${
              loading
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
            onClick={handlePay}
            disabled={loading}
          >
            {loading ? "Processing..." : `Pay $${total.toFixed(2)}`}
          </button>

          {paymentError && <p className="text-red-600 mt-2">{paymentError}</p>}
        </div>
      ) : (
        <div className="p-4 border rounded bg-green-100 text-green-800 font-bold">
          Payment successful! ✅
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
