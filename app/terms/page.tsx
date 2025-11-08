import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | LegalSnap",
  description: "Terms and conditions for using LegalSnap's AI legal voice assistant platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-8">Terms of Service</h1>
          
          <div className="prose prose-indigo max-w-none">
            <p className="text-sm text-gray-500 mb-4">Last Updated: October 2023</p>
            
            <section className="mb-8">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using LegalSnap's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>
            
            <section className="mb-8">
              <h2>2. Description of Service</h2>
              <p>
                LegalSnap provides an AI-powered legal information service that allows users to interact with an AI assistant for general legal guidance. Our service is designed to provide information about Indian laws and legal processes but does not constitute legal advice or create an attorney-client relationship.
              </p>
            </section>
            
            <section className="mb-8">
              <h2>3. User Accounts</h2>
              <p>
                To access certain features of our service, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information when creating your account and to update your information as necessary.
              </p>
            </section>
            
            <section className="mb-8">
              <h2>4. User Conduct</h2>
              <p>
                When using our service, you agree not to:
              </p>
              <ul>
                <li>Use the service for any illegal purpose or in violation of any laws</li>
                <li>Impersonate any person or entity or falsely state your affiliation</li>
                <li>Interfere with or disrupt the service or servers connected to the service</li>
                <li>Attempt to gain unauthorized access to any part of the service</li>
                <li>Use the service to transmit harmful code or malware</li>
                <li>Collect or harvest user information without consent</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2>5. Intellectual Property</h2>
              <p>
                All content, features, and functionality of our service, including but not limited to text, graphics, logos, and software, are owned by LegalSnap or its licensors and are protected by copyright, trademark, and other intellectual property laws.
              </p>
            </section>
            
            <section className="mb-8">
              <h2>6. Subscription and Payments</h2>
              <p>
                Some features of our service may require a subscription. By subscribing to our premium services, you agree to pay the applicable fees as they become due. We may change our fees at any time, but changes will not apply retroactively.
              </p>
            </section>
            
            <section className="mb-8">
              <h2>7. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, LegalSnap shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or in connection with your use of our service.
              </p>
            </section>
            
            <section className="mb-8">
              <h2>8. Disclaimer of Warranties</h2>
              <p>
                Our service is provided "as is" and "as available" without any warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
              </p>
            </section>
            
            <section className="mb-8">
              <h2>9. Termination</h2>
              <p>
                We may terminate or suspend your access to our service immediately, without prior notice or liability, for any reason, including but not limited to a breach of these Terms of Service.
              </p>
            </section>
            
            <section>
              <h2>10. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms of Service at any time. We will notify users of any material changes by posting the new terms on our website and updating the "Last Updated" date. Your continued use of the service after such changes constitutes your acceptance of the new terms.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}