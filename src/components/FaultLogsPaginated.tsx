import { useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";

import LanguageSelector from "@/components/faultLogs/LanguageSelector";
import SearchBar from "@/components/faultLogs/SearchBar";
import StatisticsCards from "@/components/faultLogs/StatisticsCards";
import TagDataTable from "@/components/faultLogs/TagDataTable";
import PaginationControls from "@/components/faultLogs/PaginationControls";
import LoadingIndicator from "@/components/faultLogs/LoadingIndicator";
import DebugDataDisplay from "@/components/faultLogs/DebugDataDisplay";

import {
  PAGE_SIZE,
  TagData,
  Stats,
  PaginationInfo,
  extractTagDataFromRecords,
  getMachinePrefix,
} from "@/utils/faultLogs";

interface Props {
  machineName: string;
}

export default function FaultLogsPaginated({ machineName }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [tagData, setTagData] = useState<TagData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawData, setRawData] = useState<any[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({ total: 0, totalPages: 0, limit: PAGE_SIZE, page: 1 });
  const [stats, setStats] = useState<Stats>({ total: 0, activeTags: 0, faultTags: 0, currentPage: 1, totalPages: 0 });

  const fetchLogs = async (pageNum: number, search = "") => {
    setLoading(true);
    setError(null);

    try {
      const url = new URL("/api/getActiveFaults", window.location.origin);
      url.searchParams.append("machineName", machineName);
      url.searchParams.append("page", pageNum.toString());
      url.searchParams.append("limit", PAGE_SIZE.toString());

      if (machineName === "GTPL-30-gT-180E-S7-1200") {
        url.searchParams.append("tableName", "GTPL_114_GT_140E_S7_1200");
      }

      if (search && search.trim()) {
        url.searchParams.append("search", search.trim());
      }

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`API Error: ${res.status} - ${await res.text()}`);
      const result = await res.json();

      let dataArray: any[] = [];
      let total = 0;
      let totalPages = 1;
      let resolvedPage = pageNum;

      if (Array.isArray(result?.data)) {
        dataArray = result.data;
        setRawData(result.data);
        total = result.total || result.data.length;
        totalPages = result.totalPages || 1;
        resolvedPage = result.page || pageNum;
      }

      let computedTagData: TagData[] = [];
      if (dataArray.length > 0) {
        computedTagData = extractTagDataFromRecords(dataArray, machineName);
      }

      if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        computedTagData = computedTagData.filter((t) => t.tag.toLowerCase().includes(q));
      }

      const faultCount = computedTagData.length; // all are faults per current logic

      setTagData(computedTagData);
      setStats({ total, activeTags: computedTagData.length, faultTags: faultCount, currentPage: resolvedPage, totalPages });
      setPaginationInfo({ total, totalPages, limit: result.limit || PAGE_SIZE, page: resolvedPage });
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(`Failed to fetch logs: ${err.message}`);
      setTagData([]);
      setRawData([]);
      setStats({ total: 0, activeTags: 0, faultTags: 0, currentPage: pageNum, totalPages: 1 });
      setPaginationInfo({ total: 0, totalPages: 1, limit: PAGE_SIZE, page: pageNum });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(currentPage, debouncedSearch);
    const intervalId = setInterval(() => fetchLogs(currentPage, debouncedSearch), 60 * 1000);
    return () => clearInterval(intervalId);
  }, [currentPage, machineName, debouncedSearch]);

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {getMachinePrefix(machineName)} Tags Monitor
              {machineName === "GTPL-30-gT-180E-S7-1200" && (
                <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">(gplt_144 table)</span>
              )}
            </h2>
            <LanguageSelector />
          </div>

          <StatisticsCards stats={stats} />
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} loading={loading} />

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">{error}</div>
          )}

          <DebugDataDisplay data={rawData} machineName={machineName} />
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Tag Data ({tagData.length} found on this page)</h3>
            <p className="text-sm text-gray-500">Filtered by: <strong>{debouncedSearch || "None"}</strong></p>
          </div>

          {loading ? (
            <LoadingIndicator />
          ) : (
            <>
              <div className="border border-gray-200 rounded-lg">
                <TagDataTable tagData={tagData} />
              </div>
              {paginationInfo.totalPages > 1 && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={paginationInfo.totalPages}
                  loading={loading}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}