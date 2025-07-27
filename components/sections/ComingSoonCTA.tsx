'use client'
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import Link from "next/link"

const ComingSoonCTA: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-sky-500 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Be the First to Know When We Launch
          </motion.h2>
          <motion.p
            className="text-lg text-gray-700 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Join our waitlist to receive exclusive early access and special offers when Hola Stars launches.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="#waitlist-form"
              className=" btn btn-lg shadow-md bg-gradient-to-r from-purple-600 to-sky-500 hover:from-purple-700 hover:to-sky-600 text-white"
            >
              <Rocket className="mr-2 h-4 w-4" />
              Get Notified at Launch
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ComingSoonCTA;
