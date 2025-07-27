
import { Edit, MapPin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Location } from "@/lib/helpers/types"

interface LocationCardProps {
  location: Location;
  onEdit: (location: Location) => void;
  onDelete: (locationId: string) => void;
}

const LocationCard = ({ location, onEdit, onDelete }: LocationCardProps) => {
  return (
    <Card className="w-full max-w-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2 min-w-5">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="truncate block">{location.name}</span>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(location)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={!Boolean(location.id)}
              onClick={() => onDelete(location.id!)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm text-muted-foreground">
          <p className="flex items-start gap-1">
            <span className="font-medium">Address:</span>
            <span className="text-right break-words">{location.address}</span>
          </p>
        </div>
        <div className="pt-2 border-t">
          {
            location.createdAt  &&
          <p className="text-xs text-muted-foreground">
            Added {new Date(location.createdAt).toLocaleDateString()}
          </p>
          }
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationCard;