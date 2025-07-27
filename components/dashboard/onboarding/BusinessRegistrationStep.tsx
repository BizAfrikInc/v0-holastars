
import BusinessRegistrationForm from "@/components/dashboard/BusinessRegistrationForm"
import { Business } from "@/lib/helpers/types"
interface BusinessRegistrationStepProps {
  onComplete: (data: Business) => void;
  business?: Business;
}

const BusinessRegistrationStep = ({ onComplete, business }: BusinessRegistrationStepProps) => {
  return (
    <div className="space-y-6">
      <BusinessRegistrationForm business={business} onComplete={onComplete}/>
    </div>
  );
};

export default BusinessRegistrationStep;