'use client'
import { ArrowRight, Award, Check, Handshake, Link2, Mail, MessageSquare, Shield, Star, TrendingUp , Users, Zap } from "lucide-react";
import Link from 'next/link'
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FeatureCard from "@/components/ui/FeatureCard"

const ComingSoon = () => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // Get launch date from localStorage or set it if not exists
    let launchDateString = localStorage.getItem("holastars-launch-date");

    if (!launchDateString) {
      const launchDate = new Date();
      launchDate.setMonth(launchDate.getMonth() + 4);
      launchDateString = launchDate.toISOString();
      localStorage.setItem("holastars-launch-date",  launchDateString);
    }

    const launchDate = new Date(launchDateString).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      // Time calculations for days, hours, minutes and seconds
      setDays(Math.floor(distance / (1000 * 60 * 60 * 24)));
      setHours(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
      setSeconds(Math.floor((distance % (1000 * 60)) / 1000));
    };

    // Initial call
    updateCountdown();

    // Update the countdown every 1 second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: "Turn Feedback into Sales",
      description: "Collect 5-star reviews through automated SMS and email campaigns to build trust and increase conversions.",
      icon: Star
    },
    {
      title: "Protect Your Reputation",
      description: "Resolve customer concerns privately and prevent negative reviews from harming your online image.",
      icon: Shield
    },
    {
      title: "Showcase Trust in Real-Time",
      description: "Highlight customer trust with review widgets, live review streams, and pop-up reviews embedded directly on your website.",
      icon: MessageSquare
    },
    {
      title: "Amplify Your Brand's Voice",
      description: "Share glowing reviews across Google, Facebook, TripAdvisor, Instagram and more to attract new customers and grow your audience.",
      icon: Mail
    },
    {
      title: "Employee and Customer Insights",
      description: "Gain actionable analytics to improve team performance, boost customer satisfaction, and drive loyalty.",
      icon: Users
    },
    {
      title: "AI-Powered Responses",
      description: "Automate review replies to save time and maintain professionalism.",
      icon: Check
    }
  ];

  const businessBenefits = [
    {
      title: "Affordable and Accessible",
      description: "Get all the features you need at a fraction of the cost of other reputation management tools.",
      icon: TrendingUp
    },
    {
      title: "Build Customer Trust",
      description: "Showcase authentic reviews and build credibility with potential customers.",
      icon: Handshake
    },
    {
      title: "Increase Conversions",
      description: "Convert more website visitors into paying customers with social proof.",
      icon: TrendingUp
    },
    {
      title: "Protect Your Brand",
      description: "Address negative feedback privately before it affects your online reputation.",
      icon: Shield
    },
    {
      title: "Save Time and Resources",
      description: "Automate review collection and responses to focus on growing your business.",
      icon: Zap
    },
    {
      title: "Boost Team Performance",
      description: "Track and celebrate employee wins to keep your team motivated and performing at their best.",
      icon: Users
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h1 className="mb-6 text-5xl font-bold md:text-7xl">
            We're{" "}
            <span className="bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-transparent">
              Almost Ready
            </span>{" "}
            to Launch!
          </h1>

          <p className="mb-12 text-xl text-gray-600 md:text-2xl">
            Our team is working hard to bring you the best reputation management platform. Join our waitlist to be the
            first to know when we launch!
          </p>

          {/* Countdown timer */}
          <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-white/80 p-4 shadow-xl backdrop-blur">
              <div className="text-4xl font-bold text-brand md:text-6xl">{days}</div>
              <div className="mt-2 text-gray-600">Days</div>
            </div>
            <div className="rounded-lg bg-white/80 p-4 shadow-xl backdrop-blur">
              <div className="text-4xl font-bold text-brand md:text-6xl">{hours}</div>
              <div className="mt-2 text-gray-600">Hours</div>
            </div>
            <div className="rounded-lg bg-white/80 p-4 shadow-xl backdrop-blur">
              <div className="text-4xl font-bold text-brand md:text-6xl">{minutes}</div>
              <div className="mt-2 text-gray-600">Minutes</div>
            </div>
            <div className="rounded-lg bg-white/80 p-4 shadow-xl backdrop-blur">
              <div className="text-4xl font-bold text-brand md:text-6xl">{seconds}</div>
              <div className="mt-2 text-gray-600">Seconds</div>
            </div>
          </div>

          <Button
            asChild
            size="lg"
            className="rounded-full bg-gradient-to-r from-brand to-brand-dark px-8 py-6 text-lg text-white transition-all duration-300 hover:shadow-lg"
          >
            <Link href="/waitlist" className="flex items-center gap-2">
              Join the Waitlist <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>

        {/* Founder's Story Section */}
        <div className="mx-auto mb-20 max-w-3xl rounded-xl bg-white/80 p-8 shadow-lg backdrop-blur-md md:p-10">
          <h2 className="mb-6 bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-center text-3xl font-bold text-transparent md:text-4xl">
            Our Journey
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-gray-600">
            <p>
              After exploring the space and having worked in this industry, I noticed something frustrating: most
              reputation marketing tools cost $100 to $350 a month — with essential features locked behind premium
              tiers.
            </p>
            <p>
              Worse still, I saw businesses sign up, get excited, then quietly drop off because they just couldn't keep
              up with the costs. I felt for them — they wanted to grow, build trust, and get chosen, but the tools
              weren't built with them in mind.
            </p>
            <p>
              So I created Hola Stars — an affordable, all-in-one solution that gives every business the tools to
              collect reviews, protect their reputation, and grow through trust.
            </p>
            <p className="font-medium text-brand-dark">
              Because no business should be priced out of earning the reputation it deserves.
            </p>
            <div className="mt-6 text-right font-medium italic text-brand-dark">- Maher Badhawi, Founder Hola Stars</div>
          </div>
        </div>

        {/* Features Sneak Peek Section */}
        <div className="mb-16">
          <h2 className="mb-4 bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-center text-3xl font-bold text-transparent md:text-4xl">
            Features
          </h2>
          <p className="mx-auto mb-12 max-w-3xl text-center text-xl text-gray-600">
            Here's a preview of the powerful tools you'll have access to when Hola Stars launches
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="hover-card-effect border-none bg-white/70 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-brand to-brand-dark shadow-md">
                    <feature.icon className="text-white" size={24} />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-brand-dark">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-20 rounded-xl bg-white/50 p-8 shadow-lg backdrop-blur-sm">
          <h2 className="mb-8 bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-center text-3xl font-bold text-transparent md:text-4xl">
            Why Businesses Love Hola Stars
          </h2>
          {/* Why business love hola stars Section */}

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {businessBenefits.map((benefit, index) => (
              <FeatureCard key={index} title={benefit.title} description={benefit.description} Icon={benefit.icon} />
            ))}
          </div>

          <div className="text-center">
            <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600">
              Hola Stars is designed with small and medium-sized businesses in mind, providing enterprise-level tools at
              an affordable price point.
            </p>
            <Button asChild variant="outline" className="border-brand text-brand hover:bg-brand hover:text-white">
              <Link href="/waitlist" className="flex items-center gap-2">
                Learn More About Our Solutions <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Affiliate program Section */}

        <div className="mb-20 rounded-xl bg-brand-dark/5 p-8 shadow-lg backdrop-blur-sm">
          <h2 className="mb-6 bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-center text-3xl font-bold text-transparent md:text-4xl">
            Grow With Us: Affiliate Program
          </h2>

          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="hover-card-effect h-full border-none bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-dark shadow-md">
                  <Award className="text-white" size={24} />
                </div>
                <h3 className="mb-4 text-xl font-semibold text-brand-dark">Earn Recurring Revenue</h3>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Join our affiliate program and earn generous commissions for every business you refer to Hola Stars.
                    We offer some of the most competitive rates in the industry with ongoing passive income.
                  </p>
                  <div className="rounded-lg bg-brand-light/50 p-4">
                    <h4 className="font-semibold text-brand-dark">Affiliate Perks:</h4>
                    <ul className="mt-2 space-y-2 text-gray-600">
                      <li className="flex items-center">
                        <Check className="mr-2 text-green-500" size={18} />
                        Recurring commissions on all referrals
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 text-green-500" size={18} />
                        Real-time tracking dashboard
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 text-green-500" size={18} />
                        Ready-to-use marketing materials
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-card-effect h-full border-none bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-dark shadow-md">
                  <Link2 className="text-white" size={24} />
                </div>
                <h3 className="mb-4 text-xl font-semibold text-brand-dark">Two Ways to Partner</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="rounded-lg border border-brand-light p-4">
                    <h4 className="flex items-center font-semibold text-brand-dark">
                      <Users className="mr-2 text-brand" size={18} />
                      Business Partners
                    </h4>
                    <p className="mt-2 text-gray-600">
                      For agencies, consultants, and businesses who work with other companies and want to offer
                      reputation management as an additional service.
                    </p>
                  </div>

                  <div className="rounded-lg border border-brand-light p-4">
                    <h4 className="flex items-center font-semibold text-brand-dark">
                      <Star className="mr-2 text-brand" size={18} />
                      Individual Referrers
                    </h4>
                    <p className="mt-2 text-gray-600">
                      For individuals who want to earn by connecting businesses to our platform. Perfect for freelancers
                      and networkers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-dark px-8 py-6 text-white transition-all duration-300 hover:shadow-lg"
            >
              <Link href="/affiliate" className="flex items-center gap-2">
                Learn More About Our Affiliate Program <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-6 bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-3xl font-bold text-transparent">
            Be Among the First to Experience HolaStars
          </h2>
          <p className="mb-8 text-xl text-gray-600">
            Join our waitlist today and get early access to our platform, plus exclusive launch offers.
          </p>
          <Button
            asChild
            size="lg"
            className="animate-pulse rounded-full bg-gradient-to-r from-brand to-brand-dark px-8 py-6 text-lg text-white transition-all duration-300 hover:shadow-lg"
          >
            <Link href="/waitlist" className="flex items-center gap-2">
              Join the Waitlist <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
};

export default ComingSoon;
