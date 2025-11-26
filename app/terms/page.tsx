"use client";

import { motion } from "framer-motion";
import { LandingHeader } from "@/components/landing-page/landing-header";
import { LandingFooter } from "@/components/landing-page/landing-footer";

export default function TermsPage() {
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
            <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>
            <p className="font-medium">Effective Date: July 1, 2023</p>
            
            <p className="mt-4">
              These Terms and Conditions (&quot;Terms&quot;) govern your use of our <strong>Organisation Management Software</strong> (&quot;Service&quot;) 
              provided by OrganisationHub, located at Main Street, Tech Park, Bangalore, India (referred to as &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
            </p>
            
            <p className="mt-2 mb-6">
              By accessing, using, subscribing, or registering on our platform, you (&quot;User&quot;, &quot;you&quot;, &quot;your&quot;) agree to be bound 
              by these Terms, including our <strong>Privacy Policy</strong>, <strong>Refund Policy</strong>, and any other applicable policies.
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p>By registering or using the Service, you:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Agree to abide by all terms and policies listed here.</li>
                <li>Confirm that you are authorized to act on behalf of the organisation or institution you represent.</li>
                <li>Agree that any violation of these terms may result in suspension or termination of your access.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Eligibility</h2>
              <p>You must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Be at least 18 years old and capable of entering into a contract under Indian law.</li>
                <li>Provide accurate and complete information during registration.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Description of Services</h2>
              <p>We provide a cloud-based platform that allows:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Organisation owners/administrators to manage rooms, students, fees, complaints, visitor logs, attendance, and more.</li>
                <li>Access via web or mobile app for authorized users including staff and students.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. User Obligations</h2>
              <p>You agree:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To maintain the confidentiality of your login credentials.</li>
                <li>Not to use the platform for any illegal, abusive, or unauthorized purpose.</li>
                <li>Not to reverse-engineer, copy, or attempt to replicate the software or its components.</li>
                <li>To inform us immediately if you suspect unauthorized access to your account.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Payment & Subscriptions</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Subscription fees are payable as per the selected plan.</li>
                <li>All fees are exclusive of applicable taxes.</li>
                <li>Non-payment or chargebacks may lead to suspension of service.</li>
                <li>We reserve the right to revise pricing with notice.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Data Ownership & Privacy</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You own the data you input; we only process it.</li>
                <li>We follow Indian laws for data protection and will not sell your data to third parties.</li>
                <li>You grant us a license to use your data only to operate and improve our services.</li>
                <li>See our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a> for full details.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Service Availability</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>We strive for 99.9% uptime but cannot guarantee uninterrupted access.</li>
                <li>Planned maintenance will be notified in advance when possible.</li>
                <li>We are not liable for data loss due to external factors (e.g., power failure, ISP downtime).</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>All software, logos, and documentation are our exclusive property.</li>
                <li>Unauthorized use, duplication, or redistribution is prohibited.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
              <p>We may terminate your access:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>If you breach these Terms.</li>
                <li>If you misuse the system or violate laws.</li>
                <li>You may terminate by canceling your subscription. However, no refunds will be issued unless stated in the Refund Policy.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>We are not liable for any indirect, incidental, or consequential damages arising from your use of the Service.</li>
                <li>In any case, our liability is limited to the amount paid by you in the last 3 months.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Indemnification</h2>
              <p>You agree to indemnify and hold us harmless from any claims arising out of:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your use of the Service.</li>
                <li>Your violation of any law or third-party rights.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Governing Law & Jurisdiction</h2>
              <p>These terms are governed by the laws of <strong>India</strong>.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">13. Modifications</h2>
              <p>We reserve the right to update these Terms at any time. Updates will be posted on this page. Your continued use of the service after changes means you accept the new terms.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">14. Contact Information</h2>
              <p>If you have any questions or concerns, please contact:</p>
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