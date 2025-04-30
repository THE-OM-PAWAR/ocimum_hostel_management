"use client";

import { motion } from "framer-motion";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 px-4 md:px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="prose prose-gray dark:prose-invert max-w-none"
        >
          <h1 className="text-4xl font-bold mb-8">Refund and Cancellation Policy</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Subscription Cancellation</h2>
            <p>You can cancel your HostelHub subscription at any time:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cancellations must be made through your account dashboard</li>
              <li>Access to services will continue until the end of the current billing period</li>
              <li>No partial refunds for unused days in the current billing period</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Refund Eligibility</h2>
            <p>Refunds may be issued in the following cases:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Technical issues preventing service access for over 24 hours</li>
              <li>Duplicate charges or billing errors</li>
              <li>Service cancellation within 14 days of initial subscription (first-time subscribers only)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Refund Process</h2>
            <p>To request a refund:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Contact our support team within 30 days of the charge</li>
              <li>Provide your account details and reason for the refund</li>
              <li>Refunds are processed within 5-10 business days</li>
              <li>Refunds will be issued to the original payment method</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Non-Refundable Items</h2>
            <p>The following are not eligible for refunds:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Partial months of service</li>
              <li>Add-on features or services</li>
              <li>Customization fees</li>
              <li>Implementation or setup charges</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Service Termination</h2>
            <p>HostelHub reserves the right to terminate services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>For violation of terms of service</li>
              <li>Due to fraudulent activity</li>
              <li>For non-payment of fees</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Contact Information</h2>
            <p>For refund and cancellation inquiries, please contact us at billing@hostelhub.com</p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}