"use client";

import { motion } from "framer-motion";
import { LandingHeader } from "@/components/landing-page/landing-header";
import { LandingFooter } from "@/components/landing-page/landing-footer";

export default function PrivacyPage() {
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
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
            <p className="font-medium">Effective Date: July 1, 2023</p>
            
            <p className="mt-4">
              At HostelHub ("we", "us", or "our"), we are committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, and share your personal data when 
              you use our Hostel Management Software Service ("Service").
            </p>
            
            <p className="mt-2 mb-6">
              By accessing or using our Service, you consent to the practices described in this Privacy Policy.
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
              <p>We collect the following types of personal data:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account Information:</strong> When you register, we collect information such as your name, email address, and phone number.</li>
                <li><strong>Hostel Data:</strong> Information about students, rooms, fees, attendance, complaints, and other hostel-related data entered by you.</li>
                <li><strong>Payment Information:</strong> We collect payment details such as credit card information or other payment methods to process your subscription.</li>
                <li><strong>Usage Data:</strong> Information about how you use our platform, including IP address, browser type, operating system, and other usage metrics.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Data</h2>
              <p>We use your personal data for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>To Provide Services:</strong> To process your subscription, manage your account, and provide features of our hostel management platform.</li>
                <li><strong>For Communication:</strong> To send updates, maintenance notifications, and customer support communication.</li>
                <li><strong>For Legal and Compliance:</strong> To comply with applicable laws and regulations, including data protection laws in India.</li>
                <li><strong>To Improve Our Services:</strong> To analyze usage patterns and improve our platform's performance.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Data Storage & Security</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Data Storage:</strong> We store your data securely in India and take reasonable precautions to protect it from unauthorized access, alteration, or destruction.</li>
                <li><strong>Security Measures:</strong> We implement technical and organizational measures to safeguard your personal information from misuse, loss, or unauthorized access.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Data Sharing</h2>
              <p>We may share your data under the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>With Service Providers:</strong> We may share your data with third-party vendors or service providers who assist in providing the Service (e.g., payment processors, cloud storage providers).</li>
                <li><strong>For Legal Compliance:</strong> We may disclose your data if required by law, in response to legal requests, or to protect our legal rights.</li>
                <li><strong>With Your Consent:</strong> We may share data with your explicit consent or for specific purposes you have authorized.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
              <p>As a user of our platform, you have the following rights regarding your personal data:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access:</strong> You can request access to the personal data we hold about you.</li>
                <li><strong>Correction:</strong> You can update or correct your personal information via your account settings.</li>
                <li><strong>Deletion:</strong> You can request the deletion of your account and personal data, subject to legal obligations and retention policies.</li>
                <li><strong>Opt-Out:</strong> You can opt-out of receiving marketing communications at any time by following the unsubscribe instructions.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking Technologies</h2>
              <p>We use cookies and similar technologies to enhance your experience on our platform. Cookies help us track your preferences and improve the performance of the Service. You can control cookie settings through your browser.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Third-Party Links</h2>
              <p>Our platform may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites. Please review their privacy policies before providing any personal information.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
              <p>Our Service is not intended for children under the age of 18. We do not knowingly collect personal data from children. If you believe that we have collected data from a child, please contact us immediately.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Changes to This Privacy Policy</h2>
              <p>We reserve the right to update this Privacy Policy. Any changes will be posted on this page with an updated effective date. Your continued use of the Service after such changes constitutes acceptance of the updated policy.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
              <p>If you have any questions or concerns about this Privacy Policy or how we handle your personal data, please contact us:</p>
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