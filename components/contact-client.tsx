"use client";

import { Button } from "@/components/ui/button";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface ContactClientProps {
  user: {
    name: string;
    email: string;
  } | null;
}
export default function ContactClient({ user }: ContactClientProps) {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact/message", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user?.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (response.ok) {
        toast.success("Email sent successfully!");
        setFormData({
          subject: "",
          message: "",
        });
      } else {
        toast.error(
          "You already asked for a mission with this email, just wait."
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation direction="up" delay={0.2}>
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Contact me
            </h2>
            <p className="font-mono text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to collaborate on your next project? Let&apos;s talk!
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <ScrollAnimation direction="left" delay={0.4}>
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Let&apos;s talk about your project
                </h3>
                <p className="text-gray-600 leading-relaxed mb-8">
                  I&apos;m always open to new opportunities and interesting
                  collaborations. If you have a specific project in mind or just
                  in mind or just want to discuss possibilities, feel free to
                  contact me.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-600">lamrininawfal11@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Phone Number
                    </h4>
                    <p className="text-gray-600">+32 488 12 83 07</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Localisation
                    </h4>
                    <p className="text-gray-600">Brussels, Belgium</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Follow me</h4>
                <div className="flex space-x-4">
                  <a
                    href="https://github.com/baguette1070"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <Github className="h-5 w-5 text-gray-700" />
                  </a>
                  <a
                    href="https://linkedin.com/in/nawfal-lamrini"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"
                  >
                    <Linkedin className="h-5 w-5 text-blue-600" />
                  </a>
                  <a
                    href="https://twitter.com/votre-username"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"
                  >
                    <Twitter className="h-5 w-5 text-blue-400" />
                  </a>
                </div>
              </div>

              {/* Availability */}
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Availability
                </h4>
                <p className="text-gray-600 mb-3">
                  Currently available for new projects
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 font-medium">
                    Available
                  </span>
                </div>
              </div>
            </div>
          </ScrollAnimation>

          {/* Contact Form */}
          <ScrollAnimation direction="right" delay={0.6}>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 pb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Send me a message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6 h-[62vh]">
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Subject of your message"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 h-[40vh] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Describe your project or request..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {user ? (
                    isSubmitting ? (
                      "Sending..."
                    ) : (
                      "Send message"
                    )
                  ) : (
                    <Link href="/auth/signin">Sign in to send a message</Link>
                  )}
                </Button>
              </form>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
