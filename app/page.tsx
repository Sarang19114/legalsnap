"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Scale,
  Sparkles,
  Wand2,
  Zap,
  ArrowUpRight,
  Play,
  Shield,
  FileText,
  Users,
  Building,
  Home,
  Heart,
  Gavel,
  Mic,
  Phone,
  Mail,
  MapPin,
  Star,
  ChevronDown,
  Globe,
  Lock,
  Clock,
  MessageSquare,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { FlipWords } from "@/components/ui/flip-words";
import { Cover } from "@/components/ui/cover";
import { Spotlight } from "@/components/ui/spotlight-new";
import { cn } from "@/lib/utils";
import { HeroSection } from "@/components/hero-section-1";

export default function LandingPage() {
  const words = ["Instant", "Reliable", "Expert", "Secure"];
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-black text-white selection:bg-blue-500 selection:text-white"
    >
      {/* Background Patterns */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/[0.03] to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/25 to-transparent" />
      </div>

      {/* Hero Section with Navbar */}
      <HeroSection />

      {/* Features Section */}
      <section id="features" className="py-32 relative bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/[0.03] to-transparent" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Expert Legal Guidance Across All Areas
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Get specialized advice from AI trained in specific legal domains
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="group relative rounded-xl border-2 border-blue-400/60 shadow-2xl transition-all duration-300 ease-out hover:shadow-blue-400/50"
              >
                <Card className="p-8 bg-white/[0.05] border border-white/10 hover:border-blue-400/50 transition-all duration-300 backdrop-blur-lg relative overflow-hidden rounded-xl">
                  {/* Glowing gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />

                  {/* Icon with hover scale effect */}
                  <feature.icon className="h-12 w-12 text-blue-400 mb-6 transition-transform duration-300 group-hover:scale-110" />

                  {/* Title & Description */}
                  <h3 className="text-xl font-semibold mb-3 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-32 relative bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/[0.02] to-transparent" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              How It Works
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Get legal advice in three simple steps
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-12 items-stretch">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center relative group h-full flex flex-col justify-center"
              >
                <div className="mb-8">
                  <div className="relative inline-block">
                    {/* Glowing background effect */}
                    <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-0" />

                    {/* Number container with blue border */}
                    <div className="w-20 h-20 bg-white/[0.05] rounded-full flex items-center justify-center border-2 border-blue-400/60 shadow-lg relative transition-all duration-300 ease-out group-hover:scale-105 group-hover:rotate-2 group-hover:shadow-blue-400/50">
                      <span className="text-3xl font-bold bg-gradient-to-b from-blue-400 to-blue-600 bg-clip-text text-transparent">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card content with hover tilt effect */}
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="border-2 border-blue-400/60 p-6 rounded-lg bg-white/[0.05] shadow-lg transition-all duration-300 ease-out group-hover:shadow-blue-400/50 min-h-[220px] flex flex-col justify-center h-full"
                >
                  <h3 className="text-2xl font-semibold mb-4 text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose LegalSnap Section */}
      <section className="py-32 relative bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/[0.02] to-transparent" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Why Choose LegalSnap?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Advanced features designed for Indian legal requirements
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="text-center p-8 bg-white/[0.02] rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 group border border-white/10 hover:border-orange-400/30 backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative">
                  <div className="mb-6">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-orange-400/20 rounded-lg blur group-hover:blur-md transition-all duration-300" />
                      <div className="relative bg-orange-500/10 p-3 rounded-lg border border-orange-400/20 group-hover:border-orange-400/40 transition-colors duration-300">
                        <feature.icon className="h-8 w-8 text-orange-500 mx-auto group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-orange-100 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 relative bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/[0.03] to-transparent" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Choose the plan that works best for you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Free Plan */}
        <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="p-12 bg-white/[0.05] border-2 border-gray-600/70 relative overflow-hidden group rounded-xl shadow-lg"
        >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-300 mb-4">
                  Free Plan
                </h3>
                <div className="mb-6">
                  <span className="text-6xl font-bold bg-gradient-to-b from-gray-300 to-gray-500 bg-clip-text text-transparent">
                    ₹0
                  </span>
                  <span className="text-gray-400 ml-2">/month</span>
                </div>
                <button className="w-full bg-gray-600 text-white py-4 rounded-lg text-lg hover:bg-gray-700 transition-colors">
                  Get Started Free
          </button>
              </div>
              <div className="space-y-5">
                {freeFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center text-gray-400">
                    <CheckCircle className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-12 bg-blue-900/[0.1] border-2 border-blue-400/70 relative overflow-hidden group rounded-xl shadow-lg"
            >
              <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Popular
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative text-center mb-8">
                <h3 className="text-2xl font-bold text-blue-400 mb-4">
                  Pro Plan
                </h3>
                <div className="mb-6">
                  <span className="text-6xl font-bold bg-gradient-to-b from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    ₹499
                  </span>
                  <span className="text-gray-400 ml-2">/month</span>
                </div>
                <button className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg hover:bg-blue-700 transition-colors">
                  Start Pro Trial
          </button>
              </div>
              <div className="space-y-5">
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center text-gray-400">
                    <CheckCircle className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 relative bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/[0.02] to-transparent" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Trusted by thousands of users across India
            </p>
          </motion.div>
<div className="overflow-hidden">
            <div className="flex animate-marquee hover:animate-marquee-paused gap-8">
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (index % testimonials.length) * 0.1 }}
                  viewport={{ once: true }}
                  className="flex-shrink-0 w-80 p-8 bg-white/[0.05] border border-white/10 rounded-xl shadow-lg backdrop-blur-lg transition-all duration-300 hover:shadow-2xl hover:border-blue-400/50 hover:scale-[1.02] relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/[0.3] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                  <div className="relative flex flex-col h-full">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-400 mb-6 text-lg leading-relaxed flex-grow">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center mt-auto">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">{testimonial.name.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <p className="font-semibold text-white">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-gray-400">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <style jsx>{`
            @keyframes marquee {
              0% {
                transform: translateX(0%);
              }
              100% {
                transform: translateX(-50%);
              }
            }

            .animate-marquee {
              animation: marquee 30s linear infinite;
            }

            .animate-marquee-paused {
              animation-play-state: paused;
            }
          `}</style>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 relative bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/[0.02] to-transparent" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to know about LegalSnap
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/[0.02] rounded-xl shadow-xl overflow-hidden border border-white/10 hover:border-blue-400/30 transition-all duration-300 backdrop-blur-sm group"
              >
                <button
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-blue-500/5 transition-colors duration-200"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-semibold text-white group-hover:text-blue-100 transition-colors pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 group-hover:text-blue-300 transition-all duration-200 flex-shrink-0 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    <p className="text-gray-400 leading-relaxed border-t border-white/5 pt-4">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/[0.06] to-transparent" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          > 
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
              Ready to Get Expert Legal Advice?
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Join thousands of users who trust LegalSnap for their legal guidance
            </p>
            <Link href={"/dashboard"}>
              <Button
                size="lg"
                className="h-14 px-8 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 group transform hover:scale-105"
              >
                Start Legal Consultation Now
                <ArrowUpRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/10 relative bg-black">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <Link href="/" className="flex items-center space-x-2 group mb-6">
                <div className="relative">
                  <div className="absolute inset-0 rotate-45 scale-0 bg-blue-600 transition-transform duration-300 group-hover:scale-100 rounded-lg blur opacity-50" />
                  <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 p-2.5 rounded-lg">
                    <Scale className="h-6 w-6 text-white relative transition-transform duration-300 group-hover:scale-110" />
                  </div>
                </div>
                <span className="font-bold text-xl tracking-tight text-white">
                  LegalSnap
                </span>
              </Link>
              <p className="text-gray-400">
                India's leading AI-powered legal assistant, making legal advice accessible to everyone.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg text-white">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="#features" className="hover:text-blue-400 transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-blue-400 transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    Legal Areas
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg text-white">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg text-white">Legal</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-white/10 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} LegalSnap. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const menuItems = [
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#' },
]

const features = [
  {
    title: "General Lawyer",
    description: "For basic legal questions and general advice",
    icon: Users,
  },
  {
    title: "Criminal Lawyer",
    description: "IPC offenses, FIR, bail, and criminal cases",
    icon: Gavel,
  },
  {
    title: "Property Lawyer",
    description: "Land disputes, tenancy, RERA compliance",
    icon: Home,
  },
  {
    title: "Family Lawyer",
    description: "Marriage, divorce, custody, and family matters",
    icon: Heart,
  },
  {
    title: "Corporate Lawyer",
    description: "Business law, contracts, and corporate matters",
    icon: Building,
  },
  {
    title: "Documentation Help",
    description: "Notices, affidavits, agreements, and legal docs",
    icon: FileText,
  },
];

const keyFeatures = [
  {
    title: "Indian Law Focused",
    description: "AI trained specifically on Indian legal framework and precedents",
    icon: Globe,
  },
  {
    title: "Voice-based Interaction",
    description: "Natural language processing for seamless voice conversations",
    icon: Mic,
  },
  {
    title: "Privacy & Security",
    description: "End-to-end encryption and data protection compliance",
    icon: Lock,
  },
  {
    title: "Instant Response",
    description: "Get legal guidance within seconds, not hours",
    icon: Clock,
  },
  {
    title: "Structured Summary",
    description: "Get organized summaries after every consultation session",
    icon: FileText,
  },
  {
    title: "24/7 Support",
    description: "Round-the-clock legal assistance whenever you need it",
    icon: MessageSquare,
  },
];

const steps = [
  {
    title: "Choose your legal area",
    description: "Select from our specialized legal categories based on your issue",
  },
  {
    title: "Speak your issue to LegalSnap",
    description: "Use natural voice commands to describe your legal problem",
  },
  {
    title: "Get structured advice & next steps",
    description: "Receive comprehensive legal guidance with actionable steps",
  },
];

const freeFeatures = [
  "3 voice consultations/month",
  "Basic legal advice",
  "Standard response time",
  "Access to general templates",
];

const premiumFeatures = [
  "Unlimited consultations",
  "Legal summary export",
  "Priority queue",
  "Email support",
];

const testimonials = [
  {
    content:
      "I was worried about tenancy rights, but LegalSnap gave me instant clarity and the confidence to act.",
    name: "Naina Jain from Ajmer",
    role: "Tenant",
  },
  {
    content:
      "Even while living abroad, I needed help with inheritance law in India. LegalSnap made cross-border legal issues much simpler.",
    name: "Akshat Jain (NRI)",
    role: "Overseas Professional",
  },
  {
    content:
      "Running a startup in Noida, I needed guidance on company registration. LegalSnap saved me time and stress.",
    name: "Yash Chaturvedi from Noida",
    role: "Startup Founder",
  },
  {
    content:
      "I wasn’t sure how to proceed with a cyber harassment complaint. LegalSnap guided me step by step with clear advice.",
    name: "Ruqayya Shah from Saharanpur",
    role: "Student",
  },
  {
    content:
      "During a property transfer in Delhi, I was confused about stamp duty and registration. LegalSnap made it effortless.",
    name: "Tejas Chauhan from Delhi",
    role: "Homebuyer",
  },
];


const faqs = [
  {
    question: "Is this legal advice admissible in court?",
    answer: "LegalSnap provides general legal information and guidance. For court proceedings, we recommend consulting with a qualified lawyer for formal legal representation.",
  },
  {
    question: "How accurate is the AI?",
    answer: "Our AI is trained on comprehensive Indian legal databases and continuously updated. However, for complex cases, we recommend cross-verifying with legal professionals.",
  },
  {
    question: "Can I speak in Hindi or regional languages?",
    answer: "Yes! LegalSnap supports multiple Indian languages including Hindi, Tamil, Telugu, Bengali, and more for natural voice interactions.",
  },
  {
    question: "Can LegalSnap connect me to a real lawyer?",
    answer: "Currently, LegalSnap provides AI-powered legal guidance. We're working on partnerships to connect users with verified lawyers for complex cases.",
  },
  {
    question: "What happens to my data?",
    answer: "Your data is encrypted and stored securely. We follow strict privacy policies and never share your information with third parties without consent.",
  },
  {
    question: "How much does it cost?",
    answer: "We offer a free plan with 3 consultations per month. Our Pro plan costs ₹499/month for unlimited consultations and advanced features.",
  },
];
