"use client";

import { motion } from "framer-motion";

export default function ReturnPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 px-4 md:px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="prose prose-gray dark:prose-invert max-w-none"
        >
          <h1 className="text-4xl font-bold mb-8">Return Policy</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Digital Services</h2>
            <p>As HostelHub provides digital services, traditional return policies for physical goods do not apply. Please refer to our Refund and Cancellation Policy for information about service cancellations and refunds.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Data Return</h2>
            <p>Upon service cancellation:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You can export your data within 30 days of cancellation</li>
              <li>Data will be provided in standard formats (CSV, JSON)</li>
              <li>Personal information will be handled according to our Privacy Policy</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Account Restoration</h2>
            <p>If you wish to return to our service:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Accounts can be reactivated within 90 days of cancellation</li>
              <li>Historical data will be preserved during this period</li>
              <li>New subscription terms may apply</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Retention</h2>
            <p>After service cancellation:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Data is retained for 90 days</li>
              <li>After 90 days, data is permanently deleted</li>
              <li>Backup copies are removed according to our data retention schedule</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Contact Information</h2>
            <p>For questions about data return or account restoration, please contact us at support@hostelhub.com</p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}