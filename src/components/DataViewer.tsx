import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Database,
  RefreshCw,
  FileText,
  FileJson,
} from "lucide-react";
import { MACHINE_REGISTRY } from "@/lib/machineRegistry";

// Derived from centralized registry — no manual updates needed
const TABLE_CONFIG: Record<string, { name: string; type: string; location: string }> = Object.fromEntries(
  MACHINE_REGISTRY
    .filter((m) => m.name !== "Gtpl-S7-1200-02") // exclude aliases
    .map((m) => [
      m.table,
      {
        name: `${m.name.match(/GTPL-\d+/i)?.[0] || m.name} (${m.type})`,
        type: m.type,
        location: m.location,
      },
    ])
);

interface DataViewerProps {
  className?: string;
}

export default function DataViewer({ className }: DataViewerProps) {
  const [selectedTable, setSelectedTable] = useState<string>(
    "kabomachinedatasmart200"
  );
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
    limit: 100,
  });

  const fetchData = async (table: string, page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const url = new URL("/api/getAllDataSmart200", window.location.origin);
      url.searchParams.append("table", table);
      url.searchParams.append("page", page.toString());
      url.searchParams.append("limit", "100");

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`HTTP error! ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      setData(result.data || []);
      setStats({
        total: result.total || 0,
        page: result.page || 1,
        totalPages: result.totalPages || 1,
        limit: result.limit || 100,
      });
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to fetch data");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadData = async (format: "csv" | "json") => {
    try {
      const url = new URL("/api/download-data", window.location.origin);
      url.searchParams.append("table", selectedTable);
      url.searchParams.append("format", format);
      url.searchParams.append("limit", "1000");

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      // Create blob and download
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${selectedTable}_${new Date().toISOString().split("T")[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      console.error("Download error:", err);
      alert(`Download failed: ${err.message}`);
    }
  };

  useEffect(() => {
    if (selectedTable) {
      fetchData(selectedTable);
    }
  }, [selectedTable]);

  const selectedTableConfig =
    TABLE_CONFIG[selectedTable as keyof typeof TABLE_CONFIG];

  return (
    <div className={`w-full max-w-7xl mx-auto p-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Viewer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Table Selector */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Machine Table
              </label>
              <Select value={selectedTable} onValueChange={setSelectedTable}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a table" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TABLE_CONFIG).map(([tableName, config]) => (
                    <SelectItem key={tableName} value={tableName}>
                      <div className="flex flex-col">
                        <span className="font-medium">{config.name}</span>
                        <span className="text-xs text-gray-500">
                          {config.type} • {config.location}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => fetchData(selectedTable)}
                disabled={loading}
                variant="outline"
                size="sm"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button
                onClick={() => downloadData("csv")}
                disabled={loading}
                variant="outline"
                size="sm"
              >
                <FileText className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button
                onClick={() => downloadData("json")}
                disabled={loading}
                variant="outline"
                size="sm"
              >
                <FileJson className="h-4 w-4 mr-2" />
                JSON
              </Button>
            </div>
          </div>

          {/* Table Info */}
          {selectedTableConfig && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                {selectedTableConfig.name}
              </h3>
              <div className="flex gap-4 text-sm text-blue-700">
                <span>Type: {selectedTableConfig.type}</span>
                <span>Location: {selectedTableConfig.location}</span>
                <span>Records: {stats.total.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Data Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900">
                  Latest Records ({data.length} shown)
                </h3>
                <span className="text-sm text-gray-500">
                  Page {stats.page} of {stats.totalPages}
                </span>
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500">Loading data...</p>
              </div>
            ) : data.length === 0 ? (
              <div className="p-8 text-center">
                <Database className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500">No data found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(data[0] || {})
                        .slice(0, 10)
                        .map((key) => (
                          <th
                            key={key}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {key}
                          </th>
                        ))}
                      {Object.keys(data[0] || {}).length > 10 && (
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ... ({Object.keys(data[0] || {}).length - 10} more)
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.slice(0, 10).map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {Object.values(row)
                          .slice(0, 10)
                          .map((value: any, valueIndex) => (
                            <td
                              key={valueIndex}
                              className="px-4 py-3 text-sm text-gray-900"
                            >
                              {typeof value === "object"
                                ? JSON.stringify(value)
                                : String(value)}
                            </td>
                          ))}
                        {Object.keys(row).length > 10 && (
                          <td className="px-4 py-3 text-sm text-gray-500">
                            ...
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {stats.totalPages > 1 && (
            <div className="flex justify-between items-center">
              <Button
                onClick={() => fetchData(selectedTable, stats.page - 1)}
                disabled={stats.page === 1 || loading}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-500">
                Page {stats.page} of {stats.totalPages}
              </span>
              <Button
                onClick={() => fetchData(selectedTable, stats.page + 1)}
                disabled={stats.page === stats.totalPages || loading}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
