"use client";

import { motion } from "framer-motion";
import { LandingHeader } from "@/components/landing-page/landing-header";
import { LandingFooter } from "@/components/landing-page/landing-footer";

export default function ReturnPage() {
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
            <h1 className="text-4xl font-bold mb-8">Return Policy</h1>
            <p className="font-medium">Effective Date: July 1, 2023</p>
            
            <p className="mt-4">
              At OrganisationHub, we strive to provide the best service and experience for our users. 
              However, in case you are not satisfied with your purchase or subscription, we have 
              created the following <strong>Return Policy</strong> to outline the process for 
              returning services or products.
            </p>
            
            <p className="mt-2 mb-6">
              By using our Service, you agree to the terms outlined in this policy.
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Return Policy for Subscription Services</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>No Physical Goods:</strong> Since our Service is cloud-based software and there are no physical goods involved, we do not accept returns in the traditional sense.</li>
                <li><strong>Service-related Issues:</strong> If you face any issues with the software, such as functionality problems or failures to meet the service specifications, please contact our support team. We will work to resolve the issue promptly.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Eligibility for Returns</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Defective Services:</strong> If the Service is found to be defective or non-functional due to a technical error on our part, you are eligible for a return, and we will either fix the issue or provide a full refund for the service.</li>
                <li><strong>Refund for Canceled Services:</strong> If you have canceled your subscription within the allowed period (as per our <strong>Refund & Cancellation Policy</strong>), you will be eligible for a refund in accordance with the terms mentioned there.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Non-Returnable Items</h2>
              <p>The following are non-returnable:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Subscriptions that have been used or partially used.</li>
                <li>Any custom development or setup charges for your specific organisation setup.</li>
                <li>Payments made for services that have been fully delivered and accepted.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. How to Request a Return or Refund</h2>
              <p>If you believe that you are eligible for a return or refund, please follow these steps:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Contact Us:</strong> Email our support team at support@organisationhub.com with the subject line "Return Request" or "Refund Request".</li>
                <li><strong>Provide Information:</strong> Include your account details, the reason for your return request, and any relevant transaction details.</li>
                <li><strong>Review Process:</strong> Our team will review your request and, if eligible, either provide a solution to the issue or process your return/refund accordingly.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Return & Refund Processing</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Defective Service:</strong> If the service is defective or fails to meet the agreed specifications, we will either fix the issue or provide a full refund for the service.</li>
                <li><strong>Refund Method:</strong> Refunds will be issued to the original payment method used for the subscription or purchase, unless otherwise agreed upon.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Modifications to Subscription Plans</h2>
              <p>You may upgrade or downgrade your subscription plan at any time. Changes will be reflected at the beginning of the next billing cycle. Any adjustments made will not be eligible for a return unless there is an issue with the subscription itself.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Termination of Services by Us</h2>
              <p>We may terminate your subscription or access to the Service if you:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Breach our Terms & Conditions or any other related policies.</li>
                <li>Fail to comply with the payment terms.</li>
                <li>Engage in any fraudulent or unlawful activities.</li>
              </ul>
              <p className="mt-2">In such cases, no return or refund will be provided.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Changes to This Policy</h2>
              <p>We may update this Return Policy from time to time. Any changes will be reflected on this page with an updated effective date. Please review this page periodically to stay informed about our policies.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
              <p>If you have any questions or concerns about this Return Policy or the return/refund process, please reach out to our support team:</p>
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