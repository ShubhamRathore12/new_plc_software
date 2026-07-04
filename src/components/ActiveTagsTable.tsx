import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { isActiveTag } from "@/lib/faultConfig";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface TagData {
  tag: string;
  value: any;
}

interface ActiveTagsTableProps {
  tags: TagData[];
}

export function ActiveTagsTable({ tags }: ActiveTagsTableProps) {
  const activeTags = tags.filter((tag) => isActiveTag(tag.value));
  const createdAtTag = tags.find((t) => t.tag === "created_at");

  // Format tag name for display
  const formatTagName = (tag: string): string => {
    return tag
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .trim();
  };

  return (
    <ScrollArea className="h-[500px] pr-4 w-full">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="text-left">Fault Column</TableHead>
            <TableHead className="w-32 text-center">Status</TableHead>
            <TableHead className="w-24 text-center">Value</TableHead>
            <TableHead className="w-40 text-right">Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activeTags.length > 0 ? (
            activeTags.map((tag, index) => (
              <TableRow
                key={index}
                className="border-b hover:bg-red-50 transition-colors"
              >
                <TableCell className="font-mono text-sm font-semibold">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    {formatTagName(tag.tag)}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    ACTIVE ALARM
                  </span>
                </TableCell>
                <TableCell className="text-center font-bold text-red-600">
                  {isActiveTag(tag.value) ? "TRUE" : "FALSE"}
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {createdAtTag?.value
                    ? new Date(createdAtTag.value).toLocaleString()
                    : "N/A"}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-12">
                <div className="flex flex-col items-center justify-center gap-2">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                  <p className="text-muted-foreground font-medium">
                    No Active Faults
                  </p>
                  <p className="text-xs text-muted-foreground">
                    System is operating normally
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}