import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security | LegalSnap",
  description: "Learn about the security measures and protocols implemented by LegalSnap to protect your data.",
};

export default function SecurityPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-8">Security Measures</h1>
          
          <div className="prose prose-indigo max-w-none">
            <section className="mb-8">
              <h2>Data Protection</h2>
              <p>
                At LegalSnap, we implement industry-standard security measures to protect your personal information and conversation data:
              </p>
              <ul>
                <li>End-to-end encryption for all data transmissions</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Secure database storage with encryption at rest</li>
                <li>Access controls and authentication mechanisms</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2>Infrastructure Security</h2>
              <p>
                Our application is hosted on secure cloud infrastructure with:
              </p>
              <ul>
                <li>Distributed denial-of-service (DDoS) protection</li>
                <li>Firewall protection and intrusion detection systems</li>
                <li>Regular security patches and updates</li>
                <li>Redundant systems and disaster recovery protocols</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2>Authentication & Access</h2>
              <p>
                We employ robust authentication mechanisms to ensure only authorized users can access their accounts:
              </p>
              <ul>
                <li>Secure authentication through Clerk</li>
                <li>Password security requirements and hashing</li>
                <li>Rate limiting to prevent brute force attacks</li>
                <li>Session management and automatic timeouts</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2>Compliance</h2>
              <p>
                Our security practices are designed to comply with relevant regulations:
              </p>
              <ul>
                <li>Adherence to data protection regulations</li>
                <li>Regular compliance reviews</li>
                <li>Transparent privacy policies</li>
                <li>Data minimization principles</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2>Incident Response</h2>
              <p>
                In the unlikely event of a security incident:
              </p>
              <ul>
                <li>We maintain a comprehensive incident response plan</li>
                <li>Our team is trained to quickly identify and address security threats</li>
                <li>We will notify affected users in accordance with applicable laws</li>
                <li>We continuously improve our security measures based on incident learnings</li>
              </ul>
            </section>
            
            <section>
              <h2>Security Recommendations</h2>
              <p>
                To enhance your security when using LegalSnap:
              </p>
              <ul>
                <li>Use strong, unique passwords</li>
                <li>Enable two-factor authentication when available</li>
                <li>Keep your devices and browsers updated</li>
                <li>Be cautious of phishing attempts and only access LegalSnap through official channels</li>
                <li>Log out of your account when using shared devices</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}