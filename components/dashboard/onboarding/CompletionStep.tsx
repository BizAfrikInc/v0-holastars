
import { Building2, CheckCircle2, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Business } from "@/lib/helpers/types"


interface CompletionStepProps {
  businessData: Business;
  locationsCount: number;
  departmentsCount: number;
  onComplete: () => void;
}

const CompletionStep = ({
                          businessData,
                          locationsCount,
                          departmentsCount,
                          onComplete
                        }: CompletionStepProps) => {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <CheckCircle2 className="h-8 w-8 text-green-600" />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">Setup Complete!</h2>
        <p className="text-muted-foreground">
          Congratulations! Your business is now ready to go.
        </p>
      </div>

      {/* Setup Summary */}
      <div className="bg-muted/50 rounded-lg p-6 space-y-4">
        <h3 className="font-semibold mb-4">Setup Summary</h3>

        <div className="flex items-center gap-3 text-left">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="font-medium">{businessData?.name}</div>
            <div className="text-sm text-muted-foreground">Business registered</div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-left">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="font-medium">{locationsCount} Location{locationsCount !== 1 ? 's' : ''}</div>
            <div className="text-sm text-muted-foreground">Added to your business</div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-left">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="font-medium">{departmentsCount} Department{departmentsCount !== 1 ? 's' : ''}</div>
            <div className="text-sm text-muted-foreground">
              {departmentsCount > 0 ? 'Added to organize your team' : 'You can add these later'}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          onClick={onComplete}
          className="w-full"
          size="lg"
        >
          Complete Setup.
        </Button>
        <p className="text-xs text-muted-foreground">
          You can always modify these settings later from your dashboard
        </p>
      </div>
    </div>
  );
};

export default CompletionStep;