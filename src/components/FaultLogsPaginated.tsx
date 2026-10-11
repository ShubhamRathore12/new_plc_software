import { useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { api } from "@/lib/apiClient";
import { resolveFaultTable } from "@/lib/machineConfig";

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
  FETCH_LIMIT,
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

  const fetchLogs = async (
    pageNum: number,
    search = "",
    signal?: AbortSignal
  ) => {
    setPhase("loading");
    setError(null);

    try {
      // Alarm history is read straight from the primeosys backend now, not the
      // local /api/getActiveFaults proxy. The data table is resolved from the
      // same server-side config the proxy used, so an unknown machine fails
      // loudly instead of silently querying nothing.
      const table = resolveFaultTable(machineName);
      if (!table) {
        throw new Error(`No data table configured for ${machineName}`);
      }

      // We need enough true-like tag entries to cover the requested page of tag results.
      // Accumulate tag entries across API pages until we have enough to slice the requested page.
      let accumulated: TagData[] = [];
      let collectedRaw: any[] = [];

      // Alarm entries needed to fill the requested table page. PAGE_SIZE is the
      // table page size; FETCH_LIMIT is the raw-record batch per API call — they
      // used to be one constant, so a large batch collapsed the table to one page
      // and page 2 of the API was never requested.
      const endIdxNeeded = pageNum * PAGE_SIZE;

      // Safety cap: never scan more than MAX_API_PAGES data pages in one fetch.
      // Prevents endless API calls when few/no active faults exist in the data.
      const MAX_API_PAGES = 25;
      let totalPages = 1;

      // Walk API pages until we have enough entries or the API has no next page.
      for (let apiPage = 1; apiPage <= Math.min(totalPages, MAX_API_PAGES); apiPage++) {
        // primeosys backend endpoint: paginated raw records for the table.
        const path =
          `/api/all700data/paginatedSmart200` +
          `?table=${encodeURIComponent(table)}` +
          `&page=${apiPage}` +
          `&limit=${FETCH_LIMIT}`;

        const res = await api(path, { signal });
        if (!res.ok)
          throw new Error(`API Error: ${res.status} - ${await res.text()}`);
        const result = await res.json();
        totalPages = Number(result?.totalPages || 1);

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
      // A superseded/unmounted fetch aborts itself; that is not a load failure,
      // so leave the current state alone and let the live request win.
      if (err?.name === "AbortError" || signal?.aborted) return;
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
      // it at "error" so counters are never rendered from a failed load. An
      // aborted request must not flip to "ready" either — the superseding
      // fetch owns the phase now.
      if (!signal?.aborted) {
        setPhase((prev) => (prev === "error" ? prev : "ready"));
      }
    }
  };

  useEffect(() => {
    // One controller per effect run. React StrictMode (dev) mounts effects
    // twice; aborting on cleanup cancels the throwaway first request so the
    // backend is hit once, not twice, and a stale response can't overwrite a
    // newer one.
    const controller = new AbortController();
    fetchLogs(currentPage, debouncedSearch, controller.signal);
    const intervalId = setInterval(
      () => fetchLogs(currentPage, debouncedSearch, controller.signal),
      60 * 1000
    );
    return () => {
      controller.abort();
      clearInterval(intervalId);
    };
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
      <div className="bg-card text-card-foreground rounded-lg shadow-lg">
        <div className="p-6 border-b border-border">
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
              className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive text-sm"
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
            <h3 className="text-lg font-semibold text-foreground">
              {phase === "ready"
                ? `Tag data — ${stats.currentPage} of ${stats.totalPages} page(s), ${stats.total} entr${stats.total === 1 ? "y" : "ies"}`
                : "Tag data"}
            </h3>
            <p className="text-sm text-muted-foreground">
              Filtered by: <strong>{debouncedSearch || "None"}</strong>
            </p>
          </div>

          {/* Exactly one of: loading, error, empty, results. */}
          {phase === "loading" ? (
            <LoadingIndicator />
          ) : phase === "error" ? (
            <div className="border border-border rounded-lg p-8 text-center text-sm text-muted-foreground">
              The alarm history could not be loaded.
            </div>
          ) : isEmpty ? (
            <div className="border border-border rounded-lg p-8 text-center text-sm text-muted-foreground">
              No alarms recorded in the selected period.
            </div>
          ) : (
            <>
              <div className="border border-border rounded-lg">
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
