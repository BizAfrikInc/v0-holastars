import React from 'react';
import { ArrowRight, Rocket } from 'lucide-react';
import Link from "next/link"

interface CTASectionProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  showRocket?: boolean;
}

const CTASection: React.FC<CTASectionProps> = ({
                                                 title,
                                                 subtitle,
                                                 buttonText,
                                                 buttonLink,
                                                 showRocket = false,
                                               }) => {
  return (
    <section className="container section-padding">
      <div className="bg-brand-dark rounded-xl p-8 md:p-12 lg:p-16 text-white">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
          <p className="text-sky-100 text-lg">{subtitle}</p>
          <div className="pt-4">
            <Link
              href={buttonLink}
              className="btn bg-amber-400 text-text-primary hover:bg-white hover:text-sky-700 btn-lg group"
            >
              {showRocket ? (
                <Rocket className="mr-2 h-4 w-4" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              )}
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
