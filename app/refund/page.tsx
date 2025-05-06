"use client";

import { motion } from "framer-motion";
import { LandingHeader } from "@/components/landing-page/landing-header";
import { LandingFooter } from "@/components/landing-page/landing-footer";

export default function RefundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingHeader />
      
      <main className="flex-1">
        <div className="container py-12 px-4 md:px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="prose prose-gray dark:prose-invert max-w-none"
          >
            <h1 className="text-4xl font-bold mb-8">Refund & Cancellation Policy</h1>
            <p className="font-medium">Effective Date: July 1, 2023</p>
            
            <p className="mt-4">
              We understand that sometimes plans may change. This Refund & Cancellation Policy 
              explains how we handle cancellations and refunds for services provided through 
              our Hostel Management Software (&quot;Service&quot;).
            </p>
            
            <p className="mt-2 mb-6">
              By using our Service, you agree to the terms outlined in this policy.
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Cancellation Policy</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Subscription Cancellation:</strong> You may cancel your subscription at any time by notifying us at least <strong>7 days</strong> before your next billing cycle. After cancellation, you will no longer be charged for future billing cycles.</li>
                <li><strong>Refunds for Cancellations:</strong> If you cancel within <strong>7 days</strong> of your subscription, you are eligible for a full refund for that billing cycle.</li>
                <li><strong>Non-Cancelable Services:</strong> Certain services, such as time-sensitive bookings or custom setups, may not be eligible for cancellation or refund. This includes any services that have already been processed or delivered.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Refund Policy</h2>
              <p><strong>Eligibility for Refunds:</strong> Refunds are only applicable under the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-2 ml-4">
                <li><strong>Subscription Cancellation within 7 Days:</strong> Full refund for the current billing period if cancelled within the first 7 days.</li>
                <li><strong>Service Not Provided as Promised:</strong> If we fail to provide the services as per the terms agreed upon during the subscription.</li>
              </ul>
              <p className="mt-2"><strong>Refund Processing:</strong> If eligible, refunds will be credited within <strong>7 days</strong> from the approval of your refund request.</p>
              <p><strong>Refund Method:</strong> Refunds will be issued to the original payment method used for the subscription, unless otherwise agreed upon.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Non-Refundable Charges</h2>
              <p>The following charges are non-refundable:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fees for services that have already been delivered.</li>
                <li>Any payments made towards custom integrations or setups.</li>
                <li>Late payment fees or charges incurred due to your failure to make timely payments.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. How to Request a Cancellation or Refund</h2>
              <p>To request a cancellation or refund:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Contact Us:</strong> Email our support team at support@hostelhub.com with the subject line &quot;Refund Request&quot; or &quot;Cancellation Request&quot;.</li>
                <li><strong>Provide Information:</strong> Include your account details, the reason for the cancellation or refund request, and any relevant transaction details.</li>
                <li><strong>Review Process:</strong> Once we receive your request, our team will review it and process it accordingly.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Modification of Subscription</h2>
              <p>You may upgrade or downgrade your subscription plan at any time. Changes in your plan will take effect at the beginning of your next billing cycle. In case of upgrades, additional charges will apply.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Termination by Us</h2>
              <p>We reserve the right to suspend or terminate your access to the Service if you:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate the Terms & Conditions or this Refund & Cancellation Policy.</li>
                <li>Engage in fraudulent activities or misuse the Service.</li>
                <li>Fail to make payments as agreed.</li>
              </ul>
              <p className="mt-2">In such cases, no refund will be provided, and your access to the Service may be permanently terminated.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Changes to This Policy</h2>
              <p>We may update this Refund & Cancellation Policy from time to time. Any changes will be reflected on this page with an updated effective date. We encourage you to review this policy periodically for any updates.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
              <p>If you have any questions or concerns about this Refund & Cancellation Policy, please reach out to our support team:</p>
              <div className="mt-4">
                <p><strong>Support Team</strong></p>
                <p>Email: om.pawar1512@gmail.com</p>
                <p>Phone: +91-9522557828</p>
                <p>Office Hours: Monday to Friday, 9:00 AM to 6:00 PM</p>
              </div>
            </section>
          </motion.div>
        </div>
      </main>
      
      <LandingFooter />
    </div>
  );
}