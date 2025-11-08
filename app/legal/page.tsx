import Footer from "@/components/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal Policies | LegalSnap",
  description: "Legal policies and compliance information for LegalSnap's AI legal voice assistant platform.",
};

export default function LegalPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-8">Legal Policies</h1>
          
          <div className="prose prose-indigo max-w-none">
            <section className="mb-8">
              <h2>Legal Disclaimer</h2>
              <p>
                LegalSnap provides an AI-powered legal information service. While we strive for accuracy, the information provided through our platform is for general informational purposes only and does not constitute legal advice. No attorney-client relationship is created through the use of our service.
              </p>
              <p>
                The legal information provided by LegalSnap is not a substitute for professional legal advice from a qualified lawyer who is aware of the facts and circumstances of your individual situation. You should never rely solely on the information provided by our AI assistant for decisions that could affect your legal rights.
              </p>
            </section>
            
            <section className="mb-8">
              <h2>Regulatory Compliance</h2>
              <p>
                LegalSnap complies with all applicable laws and regulations in India, including but not limited to:
              </p>
              <ul>
                <li>Information Technology Act, 2000 and its amendments</li>
                <li>Bar Council of India regulations regarding legal services</li>
                <li>Consumer Protection Act, 2019</li>
                <li>Personal Data Protection laws and regulations</li>
              </ul>
              <p>
                We maintain appropriate licenses and registrations as required by law for the services we provide.
              </p>
            </section>
            
            <section className="mb-8">
              <h2>Limitations of Service</h2>
              <p>
                Our AI legal assistant:
              </p>
              <ul>
                <li>Cannot represent you in court or before any legal authority</li>
                <li>Cannot prepare or file legal documents on your behalf</li>
                <li>May not be updated with the very latest legal developments or changes in law</li>
                <li>Cannot account for all local variations in laws and regulations</li>
                <li>Is not a substitute for a licensed attorney in matters requiring legal representation</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2>Accuracy of Information</h2>
              <p>
                While we make every effort to ensure the accuracy and reliability of information provided through LegalSnap, we cannot guarantee that the information is always correct, complete, or up-to-date. Laws and regulations change frequently, and their application can vary widely based on specific circumstances.
              </p>
            </section>
            
            <section className="mb-8">
              <h2>Third-Party Links and Resources</h2>
              <p>
                LegalSnap may provide links to third-party websites or resources. We have no control over the content, privacy policies, or practices of any third-party sites or resources and accept no responsibility for them or for any loss or damage that may arise from your use of them.
              </p>
            </section>
            
            <section>
              <h2>Changes to Legal Policies</h2>
              <p>
                We may update our legal policies from time to time. We will notify users of any material changes by posting the new policies on this page and updating the effective date. You are advised to review this page periodically for any changes.
              </p>
              <p>
                Last updated: October 2023
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}