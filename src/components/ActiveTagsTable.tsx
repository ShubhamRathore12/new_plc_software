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

  return (
    <ScrollArea className="h-[500px] pr-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tag Name</TableHead>
            <TableHead className="w-24">Status</TableHead>
            <TableHead className="w-32">Value</TableHead>
            <TableHead className="w-32">Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activeTags.map((tag, index) => (
            <TableRow key={index}>
              <TableCell className="font-mono text-sm">
                {tag.tag}
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  Active
                </span>
              </TableCell>
              <TableCell className="font-medium">
                {isActiveTag(tag.value) ? "TRUE" : "FALSE"}
              </TableCell>
              <TableCell className="font-medium">
                {tag.tag === "created_at" ? tag.value : createdAtTag?.value || "N/A"}
              </TableCell>
            </TableRow>
          ))}
          {activeTags.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center py-8 text-muted-foreground"
              >
                No active tags found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}