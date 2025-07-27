"use client"
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import Link from "next/link"
import DonationSection from "@/components/pricing/DonationSection";
import FAQSection from "@/components/pricing/FAQSection";
import PricingCard from "@/components/pricing/PricingCard";
import PricingHero from "@/components/pricing/PricingHero";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState<"semiAnnual" | "annual">("annual");
  const [selectedDonation, setSelectedDonation] = useState<string | null>(null);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [tipAmount, setTipAmount] = useState("");

  const handleToggleBilling = () => {
    setBillingPeriod(billingPeriod === "annual" ? "semiAnnual" : "annual");
  };

  const handleSelectDonation = (cause: string) => {
    setSelectedDonation(selectedDonation === cause ? null : cause);
  };

  // Calculate donation amount to add to pricing
  const donationAmount = tipAmount ? parseFloat(tipAmount) : 0;

  return (
    <main>
      <PricingHero
        billingPeriod={billingPeriod}
        onToggleBilling={handleToggleBilling}
      />

      {/* Pricing Cards */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              title="Basic"
              description="Perfect for small businesses getting started"
              basePrice={39}
              billingPeriod={billingPeriod}
              features={basicFeatures}
              buttonText="Start Free Trial"
              borderColor="border-gray-300"
              donationAmount={donationAmount}
            />

            <PricingCard
              title="Premium"
              description="Ideal for growing businesses"
              basePrice={59}
              billingPeriod={billingPeriod}
              features={premiumFeatures}
              isPopular={true}
              buttonText="Start Free Trial"
              borderColor="border-brand"
              donationAmount={donationAmount}
            />

            <PricingCard
              title="Enterprise"
              description="For established businesses with advanced needs"
              basePrice={79}
              billingPeriod={billingPeriod}
              features={enterpriseFeatures}
              buttonText="Contact Sales"
              borderColor="border-brand-dark"
              donationAmount={donationAmount}
            />
          </div>

          {/* Show More Features */}
          <div className="max-w-5xl mx-auto mt-8">
            <Collapsible open={showAllFeatures} onOpenChange={setShowAllFeatures}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="mx-auto flex items-center gap-2">
                  {showAllFeatures ? "Show Less Features" : "Show More Features"}
                  {showAllFeatures ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="font-semibold text-lg mb-4 text-center">Basic Features</h3>
                    <ul className="space-y-2">
                      {allBasicFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <span className="text-brand mr-2 mt-0.5 flex-shrink-0">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-4 text-center">Premium Features</h3>
                    <ul className="space-y-2">
                      {allPremiumFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <span className="text-brand mr-2 mt-0.5 flex-shrink-0">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-4 text-center">Enterprise Features</h3>
                    <ul className="space-y-2">
                      {allEnterpriseFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <span className="text-brand mr-2 mt-0.5 flex-shrink-0">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </section>

      <DonationSection />

      <FAQSection />

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-holastars-primary to-holastars-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="mb-6">Ready to Get Started?</h2>
            <p className="text-lg mb-8">
              Start your 7-day free trial today. No credit card required.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-holastars-primary hover:bg-gray-100">
                <Link href="/">Start Free Trial</Link>
              </Button>

              <Button size="lg" variant="outline" className="bg-white text-holastars-primary hover:bg-gray-100">
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

// Features for each plan
const basicFeatures = [
  "Collect reviews via SMS, WhatsApp, QR codes, or email",
  "Showcase reviews on your website",
  "Instant alerts for negative feedback",
  "Basic review monitoring",
  "Email support"
];

const premiumFeatures = [
  "All Basic features",
  "Review pop-ups and review streams",
  "Automated email campaigns with analytics",
  "AI-powered responses",
  "Auto-reminders",
  "Automated social media posting for top reviews",
  "Priority support"
];

const enterpriseFeatures = [
  "All Premium features",
  "Advanced analytics and competitor insights",
  "Leaderboards for teams",
  "Reward and gift campaigns",
  "Internal employee/team surveys",
  "Fully white-labeled branding",
  "Dedicated account manager"
];

// Detailed features for show more section
const allBasicFeatures = [
  "SMS review requests",
  "WhatsApp integration",
  "QR code generation",
  "Email review requests",
  "Website review widgets",
  "Negative feedback alerts",
  "Basic dashboard",
  "Google Reviews integration",
  "Facebook Reviews integration"
];

const allPremiumFeatures = [
  "Review pop-up notifications",
  "Live review streams",
  "Email campaign builder",
  "Campaign analytics",
  "AI response generation",
  "Smart auto-reminders",
  "Social media auto-posting",
  "Instagram integration",
  "Twitter integration",
  "Advanced filtering"
];

const allEnterpriseFeatures = [
  "Competitor benchmarking",
  "Performance analytics",
  "Team leaderboards",
  "Reward campaigns",
  "Gift card integration",
  "Employee surveys",
  "Team feedback tools",
  "White-label portal",
  "Custom branding",
  "API access",
  "Custom integrations"
];

export default Pricing;
