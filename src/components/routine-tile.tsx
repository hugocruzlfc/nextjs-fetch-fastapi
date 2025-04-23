import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Routine } from "@/lib/types";

interface RoutineProps {
  routine: Routine;
}

export default function RoutineTile({ routine }: RoutineProps) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{routine.name}</CardTitle>
      </CardHeader>
      <CardContent>{routine.description}</CardContent>
    </Card>
  );
}
