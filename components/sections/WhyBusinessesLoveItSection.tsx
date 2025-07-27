'use client'
import { motion } from 'framer-motion';
import { CheckCircle, Star, TrendingUp, Users } from 'lucide-react';
import React from 'react';
import SectionHeading from '@/components/ui/SectionHeading';
import ServiceCard from '@/components/ui/ServiceCard';

const WhyBusinessesLoveItSection: React.FC = () => {
  // Value propositions for "Why Businesses Will Love It" section
  const valueProps = [
    {
      title: "Simple to Set Up",
      description: "Get started in minutes with our user-friendly dashboard and no technical knowledge required.",
      icon: <CheckCircle className="h-6 w-6" />,
    },
    {
      title: "Scales with Your Businesses",
      description: "From single locations to enterprise organizations, our platform grows with you.",
      icon: <TrendingUp className="h-6 w-6" />,
    },
    {
      title: "Affordable Pricing",
      description: "Flexible plans that fit businesses of all sizes with no hidden costs or surprises.",
      icon: <Star className="h-6 w-6" />,
    },
    {
      title: "Built for Teams",
      description: "Designed for collaboration and communication across departments and locations.",
      icon: <Users className="h-6 w-6" />,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Why Businesses Will Love It"
          subtitle="Hola Stars is designed with your success in mind"
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {valueProps.map((prop, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <ServiceCard
                title={prop.title}
                description={prop.description}
                icon={prop.icon}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyBusinessesLoveItSection;
