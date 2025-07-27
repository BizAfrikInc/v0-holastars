
import { ArrowRight, Award, Handshake, Link2, Shield, Star, TrendingUp, Users, Zap } from "lucide-react";
import Link from 'next/link'
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Affiliate = () => {
  const businessBenefits = [
    {
      title: "Higher Commission Rates",
      description: "Earn up to 30% recurring commission on all referred businesses.",
      icon: TrendingUp
    },
    {
      title: "Co-Branding Opportunities",
      description: "Offer reputation management under your own brand with our white label solutions.",
      icon: Handshake
    },
    {
      title: "Dedicated Account Manager",
      description: "Get personalized support to maximize your affiliate success.",
      icon: Users
    },
    {
      title: "Priority Service for Clients",
      description: "Your referred businesses receive expedited onboarding and support.",
      icon: Award
    }
  ];

  const individualBenefits = [
    {
      title: "Simple Referral Process",
      description: "Share your unique link and start earning commissions immediately.",
      icon: Link2
    },
    {
      title: "Flexible Payout Options",
      description: "Choose how and when you want to receive your affiliate payments.",
      icon: Zap
    },
    {
      title: "Comprehensive Resources",
      description: "Access marketing materials, guides, and strategies to boost your referrals.",
      icon: Shield
    },
    {
      title: "Performance Bonuses",
      description: "Unlock additional rewards as you reach various referral milestones.",
      icon: Star
    }
  ];

  const howItWorks = [
    {
      title: "Sign Up",
      description: "Register for our affiliate program and get your unique referral link.",
      step: 1
    },
    {
      title: "Share",
      description: "Promote Hola Stars to your network using our marketing resources.",
      step: 2
    },
    {
      title: "Earn",
      description: "Get paid recurring commissions when businesses sign up and stay active.",
      step: 3
    },
    {
      title: "Grow",
      description: "Scale your earnings by referring more businesses and reaching bonus tiers.",
      step: 4
    }
  ];

  // Centralized CTA buttons data
  const ctaButtons = [
    { label: 'Join Affiliate', href: '/waitlist', className: 'btn btn-gradient btn-lg' },
    { label: 'Learn More', href: '#learn-more', className: 'btn btn-gradient btn-lg' },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-brand-light/50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand to-brand-dark py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Earn While Helping Businesses Grow
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-white/90">
              Join the Hola Stars affiliate program and earn recurring commissions by referring businesses to our reputation management platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* CTA Buttons */}
                {ctaButtons.map((button, index) => (
                  <Link
                    key={index}
                    href={button.href}
                    className={button.className}
                  >
                    {button.label}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Program Overview */}
      <div className="container mx-auto px-4 py-16 md:py-24" id="learn-more">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-dark">
            Our Affiliate Program
          </h2>
          <p className="text-xl text-gray-600">
            Hola Stars offers one of the most rewarding affiliate programs in the reputation management industry. Whether you're an agency looking to expand your service offerings or an individual with a network of business connections, our program is designed to help you generate substantial recurring revenue.
          </p>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center text-brand-dark">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item) => (
              <div key={item.step} className="relative">
                <div className="absolute -left-4 top-0 hidden lg:flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-brand to-brand-dark text-white font-bold text-xl">
                  {item.step}
                </div>
                <Card className="hover-card-effect border-none bg-white shadow-md h-full">
                  <CardContent className="p-6">
                    <div className="flex lg:hidden items-center mb-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-brand to-brand-dark text-white font-bold text-lg">
                        {item.step}
                      </div>
                      <h3 className="text-xl font-semibold ml-4 text-brand-dark">{item.title}</h3>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 hidden lg:block text-brand-dark">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
                {item.step < 4 && (
                  <div className="hidden lg:block absolute top-1/2 left-full w-8 h-0.5 bg-gradient-to-r from-brand to-brand-dark transform -translate-y-1/2 -translate-x-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Two Types of Partners */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-12 text-center text-brand-dark">Choose Your Partnership Type</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Business Partners */}
            <Card className="bg-white border-none shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-brand to-brand-dark text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Business Partners</CardTitle>
                    <CardDescription className="text-white/80">For agencies & service providers</CardDescription>
                  </div>
                  <Users size={32} />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-6">
                  Designed for agencies, consultants, and businesses who work with other companies and want to offer reputation management as an additional service.
                </p>

                <h3 className="text-lg font-semibold mb-4 text-brand-dark">Benefits:</h3>
                <div className="grid grid-cols-1 gap-4 mb-8">
                  {businessBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <div className="bg-gradient-to-r from-brand to-brand-dark w-10 h-10 rounded-full flex items-center justify-center shrink-0 mr-4">
                        <benefit.icon className="text-white" size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-brand-dark">{benefit.title}</h4>
                        <p className="text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="px-6 py-4 bg-gray-50">
                <Button asChild size="lg" className="w-full bg-gradient-to-r from-brand to-brand-dark">
                  <Link href="/waitlist" className="flex items-center justify-center gap-2">
                    Join as Business Partner <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Individual Referrers */}
            <Card className="bg-white border-none shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-brand-gold to-brand-gold-dark text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Individual Referrers</CardTitle>
                    <CardDescription className="text-white/80">For freelancers & networkers</CardDescription>
                  </div>
                  <Star size={32} />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-6">
                  Perfect for individuals who want to earn by connecting businesses to our platform. Great for freelancers, consultants, and those with business networks.
                </p>

                <h3 className="text-lg font-semibold mb-4 text-brand-dark">Benefits:</h3>
                <div className="grid grid-cols-1 gap-4 mb-8">
                  {individualBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <div className="bg-gradient-to-r from-brand-gold to-brand-gold-dark w-10 h-10 rounded-full flex items-center justify-center shrink-0 mr-4">
                        <benefit.icon className="text-white" size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-brand-dark">{benefit.title}</h4>
                        <p className="text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="px-6 py-4 bg-gray-50">
                <Button asChild size="lg" className="w-full bg-gradient-to-r from-brand-gold to-brand-gold-dark">
                  <Link href="/waitlist" className="flex items-center justify-center gap-2">
                    Join as Individual Referrer <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Commission Structure */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-8 shadow-lg mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center text-brand-dark">Rewarding Commission Structure</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-brand-light">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2 text-brand-dark">Standard Rate</h3>
                <div className="text-4xl font-bold text-brand mb-4">20%</div>
                <p className="text-gray-600">Recurring commission on all standard plan subscriptions</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-brand relative bg-brand-light/20">
              <div className="absolute top-0 right-0 bg-brand text-white px-3 py-1 text-sm font-medium rounded-bl">Popular</div>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2 text-brand-dark">Business Partners</h3>
                <div className="text-4xl font-bold text-brand mb-4">25%</div>
                <p className="text-gray-600">Recurring commission for qualified business partners</p>
              </CardContent>
            </Card>

            <Card className="border border-brand-gold-dark">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2 text-brand-dark">Volume Partners</h3>
                <div className="text-4xl font-bold text-brand-gold-dark mb-4">30%+</div>
                <p className="text-gray-600">For partners who refer 10+ active businesses</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-brand-dark">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-brand-dark">How soon do I get paid?</h3>
                <p className="text-gray-600">
                  Commissions are calculated at the end of each month and paid within the first 15 days of the following month, once the referred customer has paid their subscription.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-brand-dark">What marketing materials do you provide?</h3>
                <p className="text-gray-600">
                  We provide a comprehensive range of marketing materials including email templates, social media posts, banner ads, product descriptions, and demo videos you can use to promote Hola Stars.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-brand-dark">How long do commissions last?</h3>
                <p className="text-gray-600">
                  You'll earn recurring commissions for as long as your referred customers remain active subscribers of our platform. This creates a sustainable passive income stream.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-brand-dark">Is there a minimum payout threshold?</h3>
                <p className="text-gray-600">
                  Yes, the minimum payout threshold is $50. Once you reach this amount, you can request payment through your preferred payout method.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-r from-brand to-brand-dark rounded-xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Earning With Hola Stars?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join our affiliate program today and start earning recurring commissions by referring businesses to our platform.
          </p>
          <Button asChild size="lg" className="bg-white text-brand-dark hover:bg-white/90 text-lg">
            <Link href="/waitlist" className="flex items-center gap-2">
              Apply to Affiliate Program <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Affiliate;
