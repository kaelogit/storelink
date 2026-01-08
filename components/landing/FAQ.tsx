"use client";
import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "How does the WhatsApp Handshake work?",
    answer: "It’s our secret sauce. When a customer checks out, Storelink generates a pre-filled order summary with their name, items, and total price. When they click 'Send', it opens your WhatsApp with the order already typed out. You start the conversation at the finish line."
  },
  {
    question: "Do I need to be a registered business to use Storelink?",
    answer: "No. Whether you are a registered LLC or a creative selling from your bedroom, you can build an empire here. We empower every level of entrepreneur."
  },
  {
    question: "Who can find my store on Storelink?",
    answer: "Two ways: First, through your unique link (storelink.ng/yourbrand) which you share on your Bio or Status. Second, through our Central Marketplace where thousands of shoppers search for products daily."
  },
  {
    question: "Do I have to pay for a domain name?",
    answer: "No. Your professional Storelink storefront link is completely free. You get a branded 'storelink.ng/yourbrand' address to share with your customers instantly."
  },
  {
    question: "How do I get paid by customers?",
    answer: "Storelink handles the order structure, but the money goes directly to you. You can share your preferred bank account details or payment links directly within the 'Handshake' message on WhatsApp."
  },
  {
    question: "What exactly are Empire Coins?",
    answer: "They are digital loyalty assets. When customers shop with you, they earn coins. These coins are saved in their private Storelink wallet, giving them a massive financial reason to come back to your store instead of a competitor."
  },
  {
    question: "How long is the free trial?",
    answer: "You get 14 days of Premium access for free the moment you sign up. No payment is required to start. You can explore unlimited products, the Flashdrop engine, and the digital ledger before you spend a Kobo."
  },
  {
    question: "Do I need technical skills to set this up?",
    answer: "If you can post a photo on WhatsApp, you can use Storelink. Our dashboard is built for mobile-first users. You can launch your store in under 2 minutes."
  },
  {
    question: "What is the 'Blue Tick' and how do I get it?",
    answer: "The Blue Tick is our 'Seal of Trust.' To get verified, you must provide a valid ID through our verification portal for manual vetting. Any vendor on any plan can earn the badge once they pass the verification process; it is not automatically granted by just upgrading."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-gray-50" id="faq">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Got Questions? <span className="text-emerald-600 italic">We've Got Answers</span>
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know to move from manual stress to industrial growth.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`group border rounded-2xl transition-all duration-300 ${
                  isOpen ? 'border-emerald-500 bg-white shadow-md' : 'border-gray-200 bg-white hover:border-emerald-300'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left"
                >
                  <span className={`text-lg font-bold pr-4 transition-colors ${isOpen ? 'text-emerald-700' : 'text-gray-900'}`}>
                    {faq.question}
                  </span>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-emerald-100 text-emerald-600 rotate-180' : 'bg-gray-100 text-gray-500'}`}>
                    {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                </button>

                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-5 md:p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-50">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}