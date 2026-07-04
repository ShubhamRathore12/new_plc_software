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
      // Calculate 2-month date range (60 days ago to today)
      const today = new Date();
      const twoMonthsAgo = new Date(today);
      twoMonthsAgo.setDate(twoMonthsAgo.getDate() - 60);

      // Format dates as YYYY-MM-DD
      const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
      };

      const fromDate = formatDate(twoMonthsAgo);
      const toDate = formatDate(today);

      // We need enough true-like tag entries to cover the requested page of tag results.
      // Accumulate tag entries across API pages until we have enough to slice the requested page.
      let accumulated: TagData[] = [];
      let collectedRaw: any[] = [];

      // First fetch page 1 to get totalPages
      const firstUrl = new URL("/api/getActiveFaults", window.location.origin);
      firstUrl.searchParams.append("machineName", machineName);
      firstUrl.searchParams.append("page", "1");
      firstUrl.searchParams.append("limit", PAGE_SIZE.toString());
      firstUrl.searchParams.append("fromDate", fromDate);
      firstUrl.searchParams.append("toDate", toDate);
      if (machineName === "GTPL-30-gT-180E-S7-1200") {
        firstUrl.searchParams.append("tableName", "GTPL_114_GT_140E_S7_1200");
      }
      if (search && search.trim()) {
        firstUrl.searchParams.append("search", search.trim());
      }
      const firstRes = await fetch(firstUrl.toString());
      if (!firstRes.ok)
        throw new Error(
          `API Error: ${firstRes.status} - ${await firstRes.text()}`
        );
      const firstResult = await firstRes.json();
      const totalPages = Number(firstResult?.totalPages || 1);

      // Determine how many tag entries we need to cover the requested tag page
      const endIdxNeeded = pageNum * PAGE_SIZE;

      // Safety cap: never scan more than MAX_API_PAGES data pages in one fetch.
      // Prevents endless API calls when few/no active faults exist in the data.
      const MAX_API_PAGES = 25;
      const scanPages = Math.min(totalPages, MAX_API_PAGES);

      // Iterate through API pages until we have enough tag entries or exhaust pages
      for (let apiPage = 1; apiPage <= scanPages; apiPage++) {
        const url = new URL("/api/getActiveFaults", window.location.origin);
        url.searchParams.append("machineName", machineName);
        url.searchParams.append("page", apiPage.toString());
        url.searchParams.append("limit", PAGE_SIZE.toString());
        url.searchParams.append("fromDate", fromDate);
        url.searchParams.append("toDate", toDate);
        if (machineName === "GTPL-30-gT-180E-S7-1200") {
          url.searchParams.append("tableName", "GTPL_114_GT_140E_S7_1200");
        }
        if (search && search.trim()) {
          url.searchParams.append("search", search.trim());
        }

        const res = await fetch(url.toString());
        if (!res.ok)
          throw new Error(`API Error: ${res.status} - ${await res.text()}`);
        const result = await res.json();

        const batchRows: any[] = Array.isArray(result?.data) ? result.data : [];
        if (apiPage === 1) setRawData(batchRows);

        // Extract tag entries from this batch
        let batchTags = extractTagDataFromRecords(batchRows, machineName);
        if (search && search.trim()) {
          const q = search.trim().toLowerCase();
          batchTags = batchTags.filter((t) => t.tag.toLowerCase().includes(q));
        }

        accumulated = accumulated.concat(batchTags);
        collectedRaw = collectedRaw.concat(batchRows);

        if (accumulated.length >= endIdxNeeded) break;
      }

      // Compute final pagination based on total accumulated tag entries
      const totalTrue = accumulated.length;
      const totalPagesTrue = Math.max(1, Math.ceil(totalTrue / PAGE_SIZE));
      const safePage = Math.min(Math.max(1, pageNum), totalPagesTrue);
      const startIdx = (safePage - 1) * PAGE_SIZE;
      const endIdx = startIdx + PAGE_SIZE;
      const pageSlice = accumulated.slice(startIdx, endIdx);

      setAllTagData(accumulated);
      setTagData(pageSlice);
      setStats({
        total: totalTrue,
        activeTags: pageSlice.length,
        faultTags: totalTrue,
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
