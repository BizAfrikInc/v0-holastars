import { CheckCircle } from "lucide-react";
import Link from 'next/link'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-holastars-light to-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="mb-6">Our <span className="hero-gradient-text">Mission</span></h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              We're helping businesses grow while giving back to humanity. Our goal is to provide powerful reputation management tools that drive business success while using our platform for positive global impact.
            </p>
            <Link href="/contact" className="btn btn-primary btn-lg">Join Our Mission</Link>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-semibold mb-6">Our Story</h2>
              <p className="text-gray-700 mb-6">
                Hola Stars was founded with a dual purpose: to help businesses succeed through better reputation management, and to leverage that success for humanitarian causes around the world.
              </p>
              <p className="text-gray-700 mb-6">
                Our journey began when our founders recognized two significant opportunities: First, many businesses struggle to effectively gather customer feedback and manage their online reputation. Second, successful tech companies are uniquely positioned to drive positive social change through their business models.
              </p>
              <p className="text-gray-700">
                Today, Hola Stars serves businesses of all sizes across multiple industries, helping them build stronger connections with their customers while contributing to humanitarian efforts in regions where help is desperately needed.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800"
                alt="Hola Stars team working"
                className="rounded-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 md:py-24 bg-holastars-light">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="mb-4">Our Core Values</h2>
            <p className="text-gray-600">
              The principles that guide everything we do at Hola Stars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="hover-card-effect">
                <CardContent className="pt-6">
                  <div className="bg-gradient-to-r from-holastars-primary to-holastars-secondary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <value.icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Philanthropy Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="mb-4">Our Commitment to Giving Back</h2>
              <p className="text-gray-600 text-lg">
                We're proud to donate 30% of our profits to humanitarian causes around the world.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div className="md:w-1/3">
                  <div className="bg-holastars-light rounded-full p-6 inline-flex">
                    <svg className="w-24 h-24 text-holastars-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="md:w-2/3 text-center md:text-left">
                  <h3 className="text-2xl font-semibold mb-4">The 30% Pledge</h3>
                  <p className="text-gray-700 mb-6">
                    We've committed to donating 30% of our profits to humanitarian causes in regions facing significant challenges. This isn't just a marketing strategy—it's a core part of our business model and mission.
                  </p>
                  <p className="text-gray-700">
                    When you choose Hola Stars for your reputation management needs, you're not just investing in your business's growth—you're also contributing to meaningful humanitarian efforts around the world.
                  </p>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-semibold mb-6">Our Focus Areas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {causes.map((cause, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">{cause.title}</h4>
                    <p className="text-gray-600">{cause.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Join Us Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-holastars-primary to-holastars-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="mb-6">Join Our Mission</h2>
            <p className="text-lg mb-8">
              Whether you're a business looking to grow your reputation or someone passionate about our humanitarian mission, there's a place for you in the Hola Stars community.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href='/contact' className="btn btn-primary btn-lg">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

// Data
const values = [
  {
    title: "Customer Success",
    description: "We're dedicated to helping our customers achieve measurable growth and success through effective reputation management.",
    icon: CheckCircle
  },
  {
    title: "Innovation",
    description: "We continually push the boundaries of what's possible in reputation management through technology and creative solutions.",
    icon: CheckCircle
  },
  {
    title: "Social Responsibility",
    description: "We believe businesses can be a powerful force for good, which is why we commit 30% of our profits to humanitarian causes.",
    icon: CheckCircle
  },
  {
    title: "Transparency",
    description: "We maintain open and honest communication with our customers, partners, and the communities we serve.",
    icon: CheckCircle
  },
  {
    title: "Inclusivity",
    description: "We create tools and solutions accessible to businesses of all sizes, from small local shops to multinational corporations.",
    icon: CheckCircle
  },
  {
    title: "Results-Driven",
    description: "We focus on delivering measurable results that help our customers build stronger businesses and better serve their customers.",
    icon: CheckCircle
  }
];

const causes = [
  {
    title: "DR Congo",
    description: "Supporting healthcare, education, and peace-building initiatives in the Democratic Republic of the Congo."
  },
  {
    title: "Palestine",
    description: "Providing humanitarian aid, medical supplies, and rebuilding assistance to Palestinian communities."
  },
  {
    title: "Sudan",
    description: "Delivering food security, clean water, and essential services to people affected by conflict and crisis in Sudan."
  },
  {
    title: "Yemen",
    description: "Supplying critical medical care, nutrition programs, and humanitarian relief to families impacted by the crisis in Yemen."
  }
];

const team = [
  {
    name: "Sarah Johnson",
    role: "Founder & CEO",
    bio: "Former tech executive with a passion for using business as a force for good."
  },
  {
    name: "Michael Chen",
    role: "CTO",
    bio: "Software engineer and AI specialist focused on building innovative reputation tools."
  },
  {
    name: "Amara Okafor",
    role: "Head of Humanitarian Initiatives",
    bio: "Human rights advocate with extensive experience in international aid organizations."
  },
  {
    name: "David Rodriguez",
    role: "Chief Customer Officer",
    bio: "Customer success expert dedicated to helping businesses grow through better reputation management."
  }
];

export default About;
