import Footer from "@/components/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About LegalSnap | AI Legal Voice Assistant",
  description: "Learn about LegalSnap's mission to make legal assistance accessible to everyone through AI technology.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-8">About LegalSnap</h1>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Company Overview</h2>
            <p className="text-gray-700 mb-4">
              LegalSnap is an innovative legal technology startup founded in 2023 by a team of legal professionals and technology experts. We are dedicated to bridging the gap between complex legal systems and everyday people through the power of artificial intelligence.
            </p>
            <p className="text-gray-700 mb-4">
              Based in India, our platform is specifically designed to address the unique challenges of the Indian legal system, providing accessible, affordable, and accurate legal guidance to millions who might otherwise struggle to access legal services.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
              <p className="text-indigo-800 italic text-lg">
                "To democratize access to legal information and guidance through innovative AI technology, making quality legal assistance available to everyone, regardless of their background or resources."
              </p>
            </div>
            <p className="text-gray-700 mt-4">
              We believe that understanding your legal rights and options should not be a privilege reserved for those who can afford expensive legal consultations. By leveraging the latest advancements in artificial intelligence and natural language processing, we're creating a future where everyone can access reliable legal guidance at their fingertips.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-700 mb-4">
              We envision a world where legal barriers are minimized, and justice is more accessible to all. Our vision extends beyond just providing information – we aim to empower individuals and businesses to navigate legal challenges confidently and effectively.
            </p>
            <p className="text-gray-700 mb-4">
              By 2030, we aspire to become the most trusted AI legal assistant platform in India, serving millions of users across diverse legal domains and continuously evolving to address the changing legal landscape.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Team</h2>
            <p className="text-gray-700 mb-4">
              LegalSnap is powered by a diverse team of legal experts, AI specialists, and dedicated professionals committed to our mission. Our advisory board includes experienced lawyers, judges, and legal scholars who ensure the accuracy and relevance of our platform's guidance.
            </p>
            <p className="text-gray-700 mb-4">
              The platform was initially conceptualized by Janvi Chauhan and Sarang Rastogi, two final-year Computer Science Engineering students passionate about using technology to solve real-world problems.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Approach</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-medium text-indigo-600 mb-2">AI-Powered</h3>
                <p className="text-gray-700">
                  Our platform utilizes advanced AI models specifically trained on Indian legal frameworks to provide accurate and contextual guidance.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-medium text-indigo-600 mb-2">User-Centric</h3>
                <p className="text-gray-700">
                  We design every feature with our users in mind, ensuring the platform is accessible, intuitive, and responsive to diverse needs.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-medium text-indigo-600 mb-2">Continuously Evolving</h3>
                <p className="text-gray-700">
                  We are committed to ongoing improvement, regularly updating our knowledge base and enhancing our AI capabilities.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}