
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DonationSection = () => {
  return (
    <section className="py-12" id="philanthropy">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="mb-4">Supporting Humanitarian Causes</h2>
          <p className="text-gray-600">
            30% of Hola Stars profits are donated to humanitarian causes. You can select a cause to direct your contribution during checkout.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {["Congo", "Palestine", "Sudan", "Yemen"].map((cause) => (
              <Card key={cause}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{cause}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Supporting humanitarian aid in {cause}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationSection;