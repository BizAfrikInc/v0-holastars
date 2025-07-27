'use client'
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import React from 'react';

const FounderStorySection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 relative">
        <motion.div
          className="max-w-3xl mx-auto bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 relative shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative elements */}
          <div className="absolute -top-3 -left-3">
            <Star className="h-6 w-6 text-amber-400" fill="currentColor" />
          </div>
          <div className="absolute -bottom-3 -right-3">
            <Star className="h-6 w-6 text-purple-400" fill="currentColor" />
          </div>

          {/* Quote icon */}
          <div className="mb-6 flex justify-center">
            <div className="bg-gradient-to-r from-purple-600 to-sky-500 p-3 rounded-full">
              <Quote className="h-6 w-6 text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-sky-500 bg-clip-text text-transparent">
            Why I Started Hola Stars
          </h2>

          <div className="space-y-4 text-gray-700">
            <p>
              After exploring the space and having worked in this industry, I noticed something frustrating:
              most reputation marketing tools cost $100 to $350 a month — with essential features locked behind premium tiers.
            </p>

            <p>
              Worse still, I saw businesses sign up, get excited, then quietly drop off because they just couldn't
              keep up with the costs. I felt for them — they wanted to grow, build trust, and get chosen,
              but the tools weren't built with them in mind.
            </p>

            <p>
              So I created Hola Stars — an affordable, all-in-one solution that gives every business
              the tools to collect reviews, protect their reputation, and grow through trust.
            </p>

            <p className="font-bold italic text-center mt-6">
              "Because no business should be priced out of earning the reputation it deserves."
            </p>
          </div>

          <div className="mt-8 flex justify-center items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-sky-500 flex items-center justify-center text-white font-bold">
              HS
            </div>
            <div className="font-medium">
              <div className="text-gray-800">The Hola Stars Team</div>
              <div className="text-sm text-gray-500">Founder</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FounderStorySection;
