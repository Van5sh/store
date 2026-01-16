"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { colors } from '@/lib/colors';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: colors.background.app }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3" style={{ color: colors.text.accent }}>
            Contact Us
          </h1>
          <p className="text-lg" style={{ color: colors.text.secondary }}>
            We&apos;d love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: colors.background.card }}>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center" 
                  style={{ backgroundColor: colors.stone[200] }}>
                  <Mail className="w-6 h-6" style={{ color: colors.stone[600] }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: colors.text.primary }}>Email</h3>
                  <p className="text-sm" style={{ color: colors.text.secondary }}>support@example.com</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: colors.background.card }}>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center" 
                  style={{ backgroundColor: colors.amber[100] }}>
                  <Phone className="w-6 h-6" style={{ color: colors.amber[600] }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: colors.text.primary }}>Phone</h3>
                  <p className="text-sm" style={{ color: colors.text.secondary }}>+1 (555) 123-4567</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: colors.background.card }}>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center" 
                  style={{ backgroundColor: colors.stone[200] }}>
                  <MapPin className="w-6 h-6" style={{ color: colors.stone[600] }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: colors.text.primary }}>Address</h3>
                  <p className="text-sm" style={{ color: colors.text.secondary }}>123 Business St, Suite 100<br />City, State 12345</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="rounded-lg shadow-md p-8" style={{ backgroundColor: colors.background.card }}>
              <h2 className="text-2xl font-semibold mb-6" style={{ color: colors.text.primary }}>
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg transition-all"
                    style={{ 
                      border: `2px solid ${colors.border.light}`,
                      color: colors.text.primary
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = colors.border.focus}
                    onBlur={(e) => e.currentTarget.style.borderColor = colors.border.light}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg transition-all"
                    style={{ 
                      border: `2px solid ${colors.border.light}`,
                      color: colors.text.primary
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = colors.border.focus}
                    onBlur={(e) => e.currentTarget.style.borderColor = colors.border.light}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg transition-all"
                    style={{ 
                      border: `2px solid ${colors.border.light}`,
                      color: colors.text.primary
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = colors.border.focus}
                    onBlur={(e) => e.currentTarget.style.borderColor = colors.border.light}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-2 rounded-lg transition-all resize-none"
                    style={{ 
                      border: `2px solid ${colors.border.light}`,
                      color: colors.text.primary
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = colors.border.focus}
                    onBlur={(e) => e.currentTarget.style.borderColor = colors.border.light}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.stone[600]} 0%, ${colors.stone[700]} 100%)`,
                    color: colors.white
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = ''}
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;