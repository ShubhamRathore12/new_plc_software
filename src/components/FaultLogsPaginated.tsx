import { useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { siteApi } from "@/lib/apiClient";

import LanguageSelector from "@/components/faultLogs/LanguageSelector";
import SearchBar from "@/components/faultLogs/SearchBar";
import StatisticsCards from "@/components/faultLogs/StatisticsCards";
import TagDataTable from "@/components/faultLogs/TagDataTable";
import PaginationControls from "@/components/faultLogs/PaginationControls";
import LoadingIndicator from "@/components/faultLogs/LoadingIndicator";
import DebugDataDisplay from "@/components/faultLogs/DebugDataDisplay";

/**
 * Build-time flag, not a runtime toggle: the debug panel exposes internal tag
 * names, record keys and value types, so it must not ship in the production
 * bundle at all (F-04).
 */
const SHOW_DEBUG_PANEL = process.env.NEXT_PUBLIC_DEBUG === "true";

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
  /**
   * One terminal state, never two at once. The page used to report totals of
   * zero while it was still loading, which read as "no alarms" on a machine
   * that had them (F-04).
   */
  const [phase, setPhase] = useState<"loading" | "ready" | "error">("loading");
  const loading = phase === "loading";
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
    setPhase("loading");
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
      const firstRes = await siteApi(firstUrl.toString());
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

        const res = await siteApi(url.toString());
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
      // Every counter is derived from this one result, so they cannot
      // contradict each other. An empty result reads 0 of 0, not 1 of 0.
      const emptyResult = totalTrue === 0;
      setStats({
        total: totalTrue,
        activeTags: pageSlice.length,
        faultTags: totalTrue,
        currentPage: emptyResult ? 0 : safePage,
        totalPages: emptyResult ? 0 : totalPagesTrue,
      });
      setPaginationInfo({
        total: totalTrue,
        totalPages: emptyResult ? 0 : totalPagesTrue,
        limit: PAGE_SIZE,
        page: emptyResult ? 0 : safePage,
      });
    } catch (err: any) {
      console.error("Fetch error:", err);
      setPhase("error");
      setError(`Failed to fetch logs: ${err.message}`);
      setTagData([]);
      setRawData([]);
      setStats({
        total: 0,
        activeTags: 0,
        faultTags: 0,
        currentPage: 0,
        totalPages: 0,
      });
      setPaginationInfo({
        total: 0,
        totalPages: 0,
        limit: PAGE_SIZE,
        page: 0,
      });
    } finally {
      // `phase` is only moved to "ready" on the success path; an error leaves
      // it at "error" so counters are never rendered from a failed load.
      setPhase((prev) => (prev === "error" ? prev : "ready"));
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
    // A successful client-side re-slice is a resolved state too.
    setPhase((prev) => (prev === "loading" ? "ready" : prev));
  }, [currentPage, allTagData]);

  const isEmpty = phase === "ready" && stats.total === 0;

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          {/* Counters are shown only once the load has resolved — a total of
              zero must never be rendered while the answer is still unknown. */}
          {phase === "ready" && <StatisticsCards stats={stats} />}

          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            loading={loading}
          />

          {phase === "error" && error && (
            <div
              role="alert"
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm"
            >
              {error}
            </div>
          )}

          {SHOW_DEBUG_PANEL && (
            <DebugDataDisplay data={rawData} machineName={machineName} />
          )}
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              {phase === "ready"
                ? `Tag data — ${stats.currentPage} of ${stats.totalPages} page(s), ${stats.total} entr${stats.total === 1 ? "y" : "ies"}`
                : "Tag data"}
            </h3>
            <p className="text-sm text-gray-500">
              Filtered by: <strong>{debouncedSearch || "None"}</strong>
            </p>
          </div>

          {/* Exactly one of: loading, error, empty, results. */}
          {phase === "loading" ? (
            <LoadingIndicator />
          ) : phase === "error" ? (
            <div className="border border-gray-200 rounded-lg p-8 text-center text-sm text-gray-500">
              The alarm history could not be loaded.
            </div>
          ) : isEmpty ? (
            <div className="border border-gray-200 rounded-lg p-8 text-center text-sm text-gray-500">
              No alarms recorded in the selected period.
            </div>
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
