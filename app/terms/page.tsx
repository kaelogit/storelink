import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg text-gray-600">

           <h3>1. Agreement to Terms</h3>
           <p>By using StoreLink, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.</p>
           <br />
           <h3>2. User Accounts</h3>
           <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms.</p>
           <br />

           <h3>3. Content</h3>
           <p>Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the Service.</p>
            <br />
           <h3>4. Termination</h3>
           <p>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
           
        </div>
      </div>
      <Footer />
    </div>
  );
}