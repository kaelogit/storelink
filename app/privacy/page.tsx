import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg text-gray-600">

           <h3>1. Introduction</h3>
           <p>StoreLink respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>
            <br />
           <h3>2. Information We Collect</h3>
           <p>We may collect personal information such as your name, email address, and phone number when you register as a vendor or contact us for support.</p>
            <br />
           <h3>3. How We Use Your Information</h3>
           <p>We use the information we collect to operate and maintain our services, improve user experience, and communicate with you regarding updates and support.</p>
            <br />
           <h3>4. Data Security</h3>
           <p>We use administrative, technical, and physical security measures to help protect your personal information.</p>
           
        </div>
      </div>
      <Footer />
    </div>
  );
}