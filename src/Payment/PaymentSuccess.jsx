import React from "react";
import { Link } from "react-router";

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 text-center px-4">
      <img
        src="https://media.giphy.com/media/111ebonMs90YLu/giphy.gif"
        alt="Payment Success"
        className="w-64 mb-6"
      />

      <h2 className="text-4xl font-bold text-green-600 mb-2">
        Payment Successful
      </h2>

      <p className="text-gray-500 mb-6 text-lg font-semibold">
        Your payment was completed successfully.
      </p>

      <Link to="/dashboard">
        <button className="px-6 py-2 btn-btn font-bold text-white rounded-lg transition">
          Back to Dashboard
        </button>
      </Link>
    </div>
  );
};

export default PaymentSuccess;
