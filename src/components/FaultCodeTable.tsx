"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { describeFaultTag } from "@/lib/faultDescriptions";

interface FaultCode {
  code: number;
  description: string;
  lastOccurrenceAt?: string | null;
}

interface FaultCodeTableProps {
  faultCodes: FaultCode[];
  onViewDetails: (faultItem: FaultCode) => void;
}

/**
 * Fault list (F-12).
 *
 * The rows used to show the raw PLC tag as the whole description, which means
 * nothing to an operator. Each row now leads with a readable description and a
 * recommended response, keeping the tag as secondary detail for service, and
 * the 42-row table is searchable.
 */
export function FaultCodeTable({
  faultCodes,
  onViewDetails,
}: FaultCodeTableProps) {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const decorated = faultCodes.map((faultItem) => ({
      faultItem,
      ...describeFaultTag(faultItem.description),
    }));

    const q = query.trim().toLowerCase();
    if (!q) return decorated;

    return decorated.filter(
      (row) =>
        row.title.toLowerCase().includes(q) ||
        row.response.toLowerCase().includes(q) ||
        row.tag.toLowerCase().includes(q) ||
        String(row.faultItem.code).includes(q)
    );
  }, [faultCodes, query]);

  return (
    <div className="space-y-3">
      <div className="max-w-sm space-y-1">
        <Label htmlFor="fault-search" className="text-xs font-medium">
          Search faults
        </Label>
        <div className="relative">
          <Search
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <Input
            id="fault-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Code, description or tag"
            className="pl-9"
          />
        </div>
      </div>

      <p className="text-muted-foreground text-xs" aria-live="polite">
        {rows.length} of {faultCodes.length} fault codes
      </p>

      <ScrollArea className="h-[600px] pr-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Code</TableHead>
              <TableHead>Fault</TableHead>
              <TableHead>Recommended response</TableHead>
              <TableHead className="w-32">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground py-8 text-center text-sm">
                  No fault code matches that search.
                </TableCell>
              </TableRow>
            ) : (
              rows.map(({ faultItem, title, response, tag }) => (
                <TableRow key={faultItem.code}>
                  <TableCell className="font-medium tabular-nums">
                    {faultItem.code}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{title}</span>
                    {/* The raw PLC tag stays available for service, below the
                        readable description rather than instead of it. */}
                    <span className="text-muted-foreground block font-mono text-xs">
                      {tag}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{response}</TableCell>
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
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
