'use client'
import { Calendar, CheckCircle, Image, MessageSquare, Star, Users } from "lucide-react";
import Link from 'next/link'
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  useEffect(() => {
    // Scroll animation for sections
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          entry.target.classList.remove('opacity-0');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach((section) => {
      section.classList.add('opacity-0');
      observer.observe(section);
    });

    return () => {
      document.querySelectorAll('.animate-on-scroll').forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <main>
      {/* Hero Section - Light gradient background */}
      <section className="bg-gradient-to-br from-brand-light to-white py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 max-w-xl">
              <h1 className="font-bold leading-tight">
                Grow Your <span className="hero-gradient-text">Reputation.</span><br />
                Engage Your <span className="hero-gradient-text">Customers.</span><br />
                Empower Your <span className="hero-gradient-text">Business.</span>
              </h1>
              <p className="text-lg text-gray-700 mt-6">
                Hola Stars helps businesses collect feedback, manage reviews, and build their reputation to attract more customers and grow their business.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href='/contact' className=" btn btn-gradient btn-lg">
                  Book a Demo
                </Link>
                <Link href="/features"  className="btn btn-outline btn-lg">
                  Explore Features
                </Link>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mt-4">
                <CheckCircle size={16} className="text-holastars-primary" />
                <span>No credit card required</span>
                <span className="mx-2">•</span>
                <CheckCircle size={16} className="text-holastars-primary" />
                <span>7-day free trial</span>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 animate-zoom-in">
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800"
                  alt="Hola Stars Dashboard Preview"
                  className="rounded-lg w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 hidden md:block animate-slide-in">
                <div className="flex items-center gap-3">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={16} fill="#FFD700" stroke="#FFD700" />
                    ))}
                  </div>
                  <span className="font-semibold text-holastars-dark">4.9 Average Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section - Neutral background */}
      <section className="py-10 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-xl md:text-2xl font-semibold text-gray-600 mb-8">Trusted by businesses across industries</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {['Brand 1', 'Brand 2', 'Brand 3', 'Brand 4', 'Brand 5'].map((brand, index) => (
              <div key={index} className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
                <div className="bg-gray-200 h-10 w-24 md:w-32 rounded flex items-center justify-center">
                  {brand}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - White background */}
      <section className="section-padding bg-white animate-on-scroll">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="mb-4">Powerful Features to Grow Your Reputation</h2>
            <p className="text-lg text-gray-600">
              Everything you need to collect feedback, manage reviews, and showcase your reputation to potential customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover-card-effect">
                <CardContent className="pt-6">
                  <div className="bg-gradient-to-r from-holastars-primary to-holastars-secondary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="btn-gradient">
              <a href="/features">View All Features</a>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section - Medium blue background */}
      <section className="bg-brand-light/70 section-padding animate-on-scroll">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="mb-4">How Hola Stars Works</h2>
            <p className="text-lg text-gray-600">
              A simple, effective process to help you gather feedback, manage reviews, and boost your online reputation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-brand w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full shadow-md text-white">
                  <span className="text-2xl font-bold">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section - Deep blue background with white text */}
      <section className="bg-brand-dark section-padding animate-on-scroll">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="mb-4 text-white">What Our Customers Say</h2>
            <p className="text-lg text-blue-100">
              Businesses like yours are using Hola Stars to boost their online reputation and grow their customer base.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-8 border-t-4 border-t-brand shadow-lg bg-white">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                </div>
                <div>
                  <div className="flex mb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={16} fill="#FFD700" stroke="#FFD700" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-4">
                    "Hola Stars transformed how we collect and showcase customer reviews. Our Google rating increased from 3.2 to 4.8 stars within months, and new customers consistently mention seeing our reviews online."
                  </blockquote>
                  <div>
                    <h4 className="font-semibold">Sarah Johnson</h4>
                    <p className="text-gray-500">Marketing Director, Acme Inc.</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-t-4 border-t-brand shadow-lg bg-white">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                </div>
                <div>
                  <div className="flex mb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={16} fill="#FFD700" stroke="#FFD700" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-4">
                    "The multi-location management features have been a game-changer for our franchise. Being able to track performance across all locations while giving each manager their own dashboard has streamlined our entire process."
                  </blockquote>
                  <div>
                    <h4 className="font-semibold">Michael Rodriguez</h4>
                    <p className="text-gray-500">Operations Manager, Metro Services</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-brand-dark">
              <a href="/testimonials">Read More Success Stories</a>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section - Gradient background */}
      <section className="section-padding bg-gradient-to-r from-brand to-brand-dark text-white animate-on-scroll">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="mb-6">Ready to Boost Your Reputation?</h2>
            <p className="text-lg mb-8">
              Join thousands of businesses using Hola Stars to collect feedback, manage reviews, and grow their reputation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-brand-dark hover:bg-gray-100">
                Book a Demo
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-dark">
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

const features = [
  {
    title: "Customer Feedback Collection",
    description: "Easily collect feedback from customers via email, SMS, QR codes, or custom forms with our intuitive tools.",
    icon: MessageSquare
  },
  {
    title: "Review Management",
    description: "Monitor, respond to, and showcase reviews from Google, Facebook, Yelp, and other platforms in one dashboard.",
    icon: Star
  },
  {
    title: "Multi-location Support",
    description: "Manage reputation for multiple locations with custom dashboards and role-based permissions.",
    icon: Users
  },
  {
    title: "Social Media Integration",
    description: "Automatically share positive reviews to your social media platforms and engage with customers.",
    icon: Image
  },
  {
    title: "Review Widgets",
    description: "Showcase your best reviews on your website with customizable, responsive widgets and carousels.",
    icon: CheckCircle
  },
  {
    title: "Appointment Scheduling",
    description: "Enable customers to book appointments directly from review requests or follow-up messages.",
    icon: Calendar
  }
];

const steps = [
  {
    title: "Connect Your Accounts",
    description: "Easily connect your Google Business Profile, Facebook, and other review platforms to start monitoring reviews."
  },
  {
    title: "Collect Feedback",
    description: "Use our tools to request feedback from customers via email, SMS, or QR codes after their experience."
  },
  {
    title: "Build Your Reputation",
    description: "Showcase positive reviews, respond to negative ones, and turn happy customers into brand advocates."
  }
];

export default Index;
