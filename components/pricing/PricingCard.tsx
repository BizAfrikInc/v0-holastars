
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface PricingCardProps {
  title: string;
  description: string;
  basePrice: number;
  billingPeriod: "semiAnnual" | "annual";
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  borderColor: string;
  donationAmount?: number;
}

const PricingCard = ({
                       title,
                       description,
                       basePrice,
                       billingPeriod,
                       features,
                       isPopular = false,
                       buttonText,
                       borderColor,
                       donationAmount = 0
                     }: PricingCardProps) => {
  const getPrice = (basePrice: number) => {
    const discount = billingPeriod === "annual" ? 0.1 : 0;
    const discountedPrice = basePrice - (basePrice * discount);
    return Math.round(discountedPrice);
  };

  const finalPrice = getPrice(basePrice);
  const totalWithDonation = finalPrice + donationAmount;

  return (
    <Card className={`hover-card-effect border-t-4 ${borderColor} relative`}>
      {isPopular && (
        <div className="absolute top-0 right-0 bg-brand text-white text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg font-medium">
          Most Popular
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">${finalPrice}</span>
            <span className="text-gray-500">/ month/location</span>
          </div>
          {donationAmount > 0 && (
            <div className="mt-2 p-2 bg-green-50 rounded-lg border border-green-200">
              <div className="text-sm text-green-700">
                + ${donationAmount} donation = <span className="font-semibold">${totalWithDonation}/month</span>
              </div>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Billed {billingPeriod === "annual" ? "annually" : "semi-annually"}
        </p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start text-sm">
              <CheckCircle className="text-brand mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full btn-gradient">{buttonText}</Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
