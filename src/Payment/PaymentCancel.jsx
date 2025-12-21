import React from "react";
import { Link } from "react-router";

const PaymentCancel = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 text-center px-4">
      <img
        src="https://media1.tenor.com/m/W-yLS8VS1FUAAAAd/bugs-bunny-crying.gif"
        alt="Payment Cancelled"
        className="w-64 mb-6"
      />

      <h2 className="text-4xl font-bold text-red-500 mb-2">
        Payment Cancelled
      </h2>

      <p className="text-gray-500 mb-6 text-lg font-semibold">
        Your payment was not completed. You can try again anytime.
      </p>

      <Link to="/dashboard/my-issues">
        <button className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-bold">
          Try Again
        </button>
      </Link>
    </div>
  );
};

export default PaymentCancel;
