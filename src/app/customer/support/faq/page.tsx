"use client";

import React, { useState } from 'react';
import { ChevronDown, Mail, MessageCircle, Package, Clock } from 'lucide-react';
import { colors } from '@/lib/colors';

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
          <a href="mailto:support@example.com?subject=Storefront%20Support" className="text-blue-600 hover:text-blue-800 underline font-medium">
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
    <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${colors.background.muted} 0%, ${colors.white} 50%, ${colors.amber[50]} 100%)` }}>
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: colors.stone[600] }}>
            <MessageCircle className="w-8 h-8" style={{ color: colors.white }} />
          </div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: colors.text.primary }}>
            Frequently Asked Questions
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.text.secondary }}>
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
                className="rounded-lg shadow-sm overflow-hidden transition-all duration-200"
                style={{ 
                  backgroundColor: colors.background.card,
                  border: `1px solid ${colors.border.light}`
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 4px 6px -1px ${colors.amber[200]}40`}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = ''}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  style={{
                    borderColor: isOpen ? colors.border.focus : 'transparent',
                    borderWidth: '2px',
                    borderStyle: 'inset'
                  }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" 
                      style={{ backgroundColor: colors.amber[100] }}>
                      <Icon className="w-5 h-5" style={{ color: colors.amber[600] }} />
                    </div>
                    <span className="text-lg font-semibold" style={{ color: colors.text.primary }}>
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 flex-shrink-0 ml-4 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                    style={{ color: colors.text.muted }}
                  />
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    isOpen ? 'max-h-48' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-5 pt-2 pl-20 leading-relaxed" style={{ color: colors.text.secondary }}>
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Card */}
        <div className="rounded-xl shadow-lg p-8" style={{ 
          background: `linear-gradient(135deg, ${colors.stone[600]} 0%, ${colors.stone[700]} 100%)`,
          color: colors.white
        }}>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-3">Still have questions?</h2>
            <p className="mb-6" style={{ color: colors.stone[200] }}>
              Our support team is here to help you with any inquiries.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="mailto:support@example.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors"
                style={{ backgroundColor: colors.white, color: colors.stone[600] }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.amber[50]}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.white}
              >
                <Mail className="w-5 h-5" />
                Email Us
              </a>
              <a
                href="/customer/support/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors"
                style={{ backgroundColor: colors.amber[500], color: colors.white }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.amber[600]}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.amber[500]}>
                <MessageCircle className="w-5 h-5" />
                Live Chat
              </a>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm" style={{ color: colors.stone[200] }}>
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
