
import { Switch } from "@/components/ui/switch";

interface PricingHeroProps {
  billingPeriod: "semiAnnual" | "annual";
  onToggleBilling: () => void;
}

const PricingHero = ({ billingPeriod, onToggleBilling }: PricingHeroProps) => {
  return (
    <section className="bg-gradient-to-br from-brand/10 to-white py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="mb-6">Simple, Transparent, <span className="hero-gradient-text">Affordable</span></h1>
          <p className="text-lg text-gray-700 mb-4">
            Choose the plan that's right for your business. All plans include a 7-day free trial to get you started with confidence.
          </p>
          <p className="text-md text-gray-600 mb-6">
            No contracts, no hidden fees – cancel anytime.
          </p>
          <div className="flex items-center justify-center space-x-3 mb-8">
            <span className={`${billingPeriod === "semiAnnual" ? "font-semibold" : "text-gray-500"}`}>Semi-Annually</span>
            <Switch
              checked={billingPeriod === "annual"}
              onCheckedChange={onToggleBilling}
            />
            <span className={`${billingPeriod === "annual" ? "font-semibold" : "text-gray-500"}`}>
              Annually <span className="bg-brand text-white text-xs px-2 py-1 rounded-full ml-1">Save 10%</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingHero;
