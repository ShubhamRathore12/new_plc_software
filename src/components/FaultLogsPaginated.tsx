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
  const [allTagData, setAllTagData] = useState<TagData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawData, setRawData] = useState<any[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    total: 0,
    totalPages: 0,
    limit: PAGE_SIZE,
    page: 1,
  });
  const [stats, setStats] = useState<Stats>({
    total: 0,
    activeTags: 0,
    faultTags: 0,
    currentPage: 1,
    totalPages: 0,
  });

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
        if (machineName === "GTPL-132-GT-650T-S7-1200") {
        url.searchParams.append("tableName", "GTPL_132_GT300AP");
      }

      if (search && search.trim()) {
        url.searchParams.append("search", search.trim());
      }

      const res = await fetch(url.toString());
      if (!res.ok)
        throw new Error(`API Error: ${res.status} - ${await res.text()}`);
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
        computedTagData = computedTagData.filter((t) =>
          t.tag.toLowerCase().includes(q)
        );
      }

      // Client-side pagination based on true-like filtered tags
      const totalTrue = computedTagData.length;
      const totalPagesTrue = Math.max(1, Math.ceil(totalTrue / PAGE_SIZE));
      const safePage = Math.min(Math.max(1, resolvedPage), totalPagesTrue);
      const startIdx = (safePage - 1) * PAGE_SIZE;
      const endIdx = startIdx + PAGE_SIZE;
      const pageSlice = computedTagData.slice(startIdx, endIdx);

      setAllTagData(computedTagData);
      const faultCount = totalTrue; // all entries represent faults
      setTagData(pageSlice);
      setStats({
        total: totalTrue,
        activeTags: pageSlice.length,
        faultTags: faultCount,
        currentPage: safePage,
        totalPages: totalPagesTrue,
      });
      setPaginationInfo({
        total: totalTrue,
        totalPages: totalPagesTrue,
        limit: PAGE_SIZE,
        page: safePage,
      });
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(`Failed to fetch logs: ${err.message}`);
      setTagData([]);
      setRawData([]);
      setStats({
        total: 0,
        activeTags: 0,
        faultTags: 0,
        currentPage: pageNum,
        totalPages: 1,
      });
      setPaginationInfo({
        total: 0,
        totalPages: 1,
        limit: PAGE_SIZE,
        page: pageNum,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(currentPage, debouncedSearch);
    const intervalId = setInterval(
      () => fetchLogs(currentPage, debouncedSearch),
      60 * 1000
    );
    return () => clearInterval(intervalId);
  }, [currentPage, machineName, debouncedSearch]);

  // Recompute page slice client-side when page changes without waiting for API
  useEffect(() => {
    if (allTagData.length === 0) return;
    const totalTrue = allTagData.length;
    const totalPagesTrue = Math.max(1, Math.ceil(totalTrue / PAGE_SIZE));
    const safePage = Math.min(Math.max(1, currentPage), totalPagesTrue);
    const startIdx = (safePage - 1) * PAGE_SIZE;
    const endIdx = startIdx + PAGE_SIZE;
    const pageSlice = allTagData.slice(startIdx, endIdx);
    setTagData(pageSlice);
    setStats((prev) => ({
      ...prev,
      total: totalTrue,
      activeTags: pageSlice.length,
      faultTags: totalTrue,
      currentPage: safePage,
      totalPages: totalPagesTrue,
    }));
    setPaginationInfo({
      total: totalTrue,
      totalPages: totalPagesTrue,
      limit: PAGE_SIZE,
      page: safePage,
    });
  }, [currentPage, allTagData]);

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
      

          <StatisticsCards stats={stats} />
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            loading={loading}
          />

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          <DebugDataDisplay data={rawData} machineName={machineName} />
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Tag Data ({tagData.length} found on this page)
            </h3>
            <p className="text-sm text-gray-500">
              Filtered by: <strong>{debouncedSearch || "None"}</strong>
            </p>
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
                  total={paginationInfo.total}
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
