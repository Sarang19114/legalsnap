import Footer from "@/components/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | LegalSnap",
  description: "Learn about how LegalSnap protects your data and privacy.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-indigo max-w-none">
            <section className="mb-8">
              <p className="text-sm text-gray-500 mb-4">Last Updated: October 2023</p>
              
              <p>
                At LegalSnap, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI legal voice assistant platform.
              </p>
            </section>
            
            <section className="mb-8">
              <h2>Information We Collect</h2>
              <p>We collect the following types of information:</p>
              
              <h3>Personal Information</h3>
              <ul>
                <li>Name, email address, and contact details when you create an account</li>
                <li>Payment information when you subscribe to premium services</li>
                <li>Voice recordings during interactions with our AI assistant</li>
              </ul>
              
              <h3>Usage Information</h3>
              <ul>
                <li>Interaction history with our AI assistant</li>
                <li>Device information and IP address</li>
                <li>Browser type and settings</li>
                <li>System activity and usage patterns</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2>How We Use Your Information</h2>
              <p>We use the collected information for various purposes, including:</p>
              <ul>
                <li>Providing and maintaining our service</li>
                <li>Improving and personalizing user experience</li>
                <li>Processing transactions and managing your account</li>
                <li>Training and improving our AI models</li>
                <li>Communicating with you about service updates</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2>Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction. These measures include:
              </p>
              <ul>
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Regular security assessments and audits</li>
                <li>Access controls and authentication procedures</li>
                <li>Employee training on data protection</li>
              </ul>
              <p>
                However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>
            
            <section className="mb-8">
              <h2>Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When determining the retention period, we consider:
              </p>
              <ul>
                <li>The amount, nature, and sensitivity of the information</li>
                <li>The potential risk of harm from unauthorized use or disclosure</li>
                <li>The purposes for which we process the data</li>
                <li>Legal and regulatory requirements</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2>Your Rights</h2>
              <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
              <ul>
                <li>Access to your personal information</li>
                <li>Correction of inaccurate or incomplete information</li>
                <li>Deletion of your personal information</li>
                <li>Restriction or objection to processing</li>
                <li>Data portability</li>
                <li>Withdrawal of consent</li>
              </ul>
              <p>
                To exercise these rights, please contact us at privacy@legalsnap.ai.
              </p>
            </section>
            
            <section>
              <h2>Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}