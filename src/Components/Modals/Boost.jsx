// import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
// import toast from "react-hot-toast";

// const Boost = ({ issueId, user, closeModal, refetch }) => {
//   const stripe = useStripe();
//   const elements = useElements();

//   const handlePay = async (e) => {
//     e.preventDefault();

//     // 1️⃣ create payment intent
//     const res = await fetch("http://localhost:3000/create-payment-intent", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ amount: 100 }),
//     });

//     const { clientSecret } = await res.json();

//     // 2️⃣ confirm payment
//     const result = await stripe.confirmCardPayment(clientSecret, {
//       payment_method: {
//         card: elements.getElement(CardElement),
//         billing_details: { email: user.email },
//       },
//     });

//     if (result.error) {
//       return toast.error(result.error.message);
//     }

//     if (result.paymentIntent.status === "succeeded") {
//       // 3️⃣ save payment + boost issue
//       await fetch("http://localhost:3000/payments/boost-issue", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           issueId,
//           email: user.email,
//           transactionId: result.paymentIntent.id,
//         }),
//       });

//       toast.success("Issue boosted successfully 🚀");
//       closeModal();
//       refetch();
//     }
//   };

//   return (
//     <form onSubmit={handlePay} className="space-y-4">
//       <CardElement className="border p-3 rounded" />
//       <button className="w-full bg-purple-600 text-white py-2 rounded">
//         Pay 100 BDT & Boost
//       </button>
//     </form>
//   );
// };

// export default Boost;
