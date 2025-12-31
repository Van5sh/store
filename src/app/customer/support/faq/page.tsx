"use client";

import React, { useState } from 'react';
import { ChevronDown, Mail, MessageCircle, Package, Clock } from 'lucide-react';

const FaqSupportPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      icon: Package,
      question: "What is your return policy?",
      answer: "We accept returns within 30 days of purchase. Items must be in original condition and packaging."
    },
    {
      icon: Package,
      question: "How can I track my order?",
      answer: "Once your order is shipped, you will receive an email with a tracking number and a link to track your package."
    },
    {
      icon: MessageCircle,
      question: "Do you offer customer support?",
      answer: "Yes. Our customer support team is available via email and live chat from Monday to Friday, 9 AM to 6 PM."
    },
    {
      icon: Mail,
      question: "How can I contact support?",
      answer: (
        <span>
          You can reach us at{" "}
          <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-800 underline font-medium">
            support@example.com
          </a>
          {" "}or through the contact form on our website.
        </span>
      )
    }
  ];

  const toggleFaq = (index: number | React.SetStateAction<null>) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our services, policies, and support.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 mb-12">
          {faqs.map((faq, index) => {
            const Icon = faq.icon;
            const isOpen = openIndex === index;
            
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-lg font-semibold text-gray-900">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ml-4 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    isOpen ? 'max-h-48' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-5 pt-2 pl-20 text-gray-700 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-3">Still have questions?</h2>
            <p className="text-blue-100 mb-6">
              Our support team is here to help you with any inquiries.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="mailto:support@example.com"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                <Mail className="w-5 h-5" />
                Email Us
              </a>
              <button className="inline-flex items-center gap-2 bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors">
                <MessageCircle className="w-5 h-5" />
                Live Chat
              </button>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-blue-100 text-sm">
              <Clock className="w-4 h-4" />
              <span>Monday - Friday, 9 AM - 6 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqSupportPage;