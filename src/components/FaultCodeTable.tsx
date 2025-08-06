import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FaultCode {
  code: number;
  description: string;
}

interface FaultCodeTableProps {
  faultCodes: FaultCode[];
  onViewDetails: (faultItem: FaultCode) => void;
}

export function FaultCodeTable({ faultCodes, onViewDetails }: FaultCodeTableProps) {
  return (
    <ScrollArea className="h-[600px] pr-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">Code</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-32">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {faultCodes.map((faultItem) => (
            <TableRow key={faultItem.code}>
              <TableCell className="font-medium">
                {faultItem.code}
              </TableCell>
              <TableCell>{faultItem.description}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewDetails(faultItem)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}