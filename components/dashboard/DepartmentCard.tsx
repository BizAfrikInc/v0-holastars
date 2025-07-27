
import { Building, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Department, Location } from "@/lib/helpers/types"

interface DepartmentCardProps {
  department: Department;
  location: Location;
  onEdit: (department: Department) => void;
  onDelete: (departmentId: string) => void;
}

const DepartmentCard = ({ department, location, onEdit, onDelete }: DepartmentCardProps) => {
  return (
    <Card className="w-full max-w-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2 min-w-5">
            <Building className="h-5 w-5 text-primary" />
            <span className="truncate  block">{department.name}</span>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(department)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={!Boolean(location.id)}
              onClick={() => onDelete(department.id!)}
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
            <span className="font-medium">Location:</span>
            <span className="text-right break-words">{location.name}</span>
          </p>
        </div>
        {department.description && (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Description:</span> {department.description}
          </p>
        )}
        <div className="pt-2 border-t">
          {department.createdAt  &&
          <p className="text-xs text-muted-foreground">
            Added {new Date(department.createdAt).toLocaleDateString()}
          </p>
          }
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentCard;