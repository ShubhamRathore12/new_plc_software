import useDebounce from "@/hooks/useDebounce";
import { useState, useEffect } from "react";
const PAGE_SIZE = 500;

interface TagData {
  tag: string;
  value: boolean | string;
  createdAt: string;
}

interface Stats {
  total: number;
  activeTags: number;
  faultTags: number;
  currentPage: number;
  totalPages: number;
}

interface Pagination {
  total: number;
  totalPages: number;
  limit: number;
  page: number;
}

const S7_200_TAGS = [
  "AERATION_MODE_WITH_HEAT",
  "AERATION_MODE_WITHOUT_HEAT",
  "AERATION_WITH_HEATER_START",
  "AERATION_WITH_HEATER_STOP",
  "AERATION_WITHOUT_HEATER_START",
  "AERATION_WITHOUT_HEATER_STOP",
  "AFTER_HEAT_TEMP_MORE_THAN_50",
  "AFTER_HEAT_TEMP_SENSOR_TH_OPEN",
  "AFTER_HEAT_TEMP_SENSOR_TH_SHORT_CIRCUIT",
  "AFTER_HEAT_VALVE_ON",
  "AHT_START_MANUAL_MODE",
  "AHT_STOP_MANUAL_MODE",
  "AIR_OUTLET_TEMP_SENSOR_T0_OPEN",
  "AIR_OUTLET_TEMP_SENSOR_T0_SHORT_CIRCUIT",
  "AMBIENT_TEMP_LESS_THAN_4",
  "AMBIENT_TEMP_LOW_THAN_SET_TEMP",
  "AMBIENT_TEMP_OVER_40",
  "AMBIENT_TEMP_OVER_43",
  "AMBIENT_TEMP_SENSOR_T2_OPEN",
  "AMBIENT_TEMP_SENSOR_T2_SHORT_CIRCUIT",
  "ANTI_FREEZE_PROTECTION",
  "AUTO_AERATION_ENABLE",
  "AUTO_EN",
  "AUTO_PROCESS_PB",
  "AUTO_PROCESS_STOP_PB",
  "BLOWER_CIRCUIT_BREAKER_FAULT",
  "BLOWER_DRIVE_ENABLE",
  "BLOWER_DRIVE_FAULT",
  "BLOWER_DRIVE_ON",
  "BLOWER_START_MANUAL_MOD",
  "BLOWER_STOP_MANUAL_MODE",
  "BUZZER_ON",
 
  "COLD_AIR_TEMP_SENSOR_T1_OPEN",
  "COLD_AIR_TEMP_SENSOR_T1_SHORT_CIRCUIT",
  "COMPRESSOR_CIRCUIT_BREA_FAULT",
  "COMPRESSOR_ON",
  "COMPRESSOR_START_MANUAL",
  "COMPRESSOR_STOP_MANUAL",
  "COMPRESSOR_VISIBLE",
  "COND_FAN_CIRCUIT_BREAKE_FAULT",

  "cond_fan_on",
  "COND_FAN_START_MANUAL_M",
  "COND_FAN_STOP_MANUAL_M",
  "CONDENSER_FAN_DOOR_OPEN",
  "CONTINUOUS_MODE",
  "FAULT_RESET",
  "GREEN_LIGHT",
  "HEATER_CIRCUIT_BREAKER_FAULT",

  "HEATER_RCCCB_TRIP_FAULT",
  "HEATER_START_MANUAL",
  "HEATER_STOP_MANUAL",
  "HEATER_TOP_FAULT",
  "HIGH_PRESSURE_FAULT",
  "HIGH_PRESSURE_FAULT_LOCKED",
  "HOT_GAS_VALVE_ON",
  "HOT_GAS_VALVE_START_MAN",
  "HOT_GAS_VALVE_STOP_MAN",
 
  "LOW_PRESSURE_FAULT",
  "LOW_PRESSURE_FAULT_LOCKED",
 
  "MANUAL_EN",
  "OPERATING_HOURS_RESET",
  "SET_POINT_NOT_ACHIEVED_IN_AERATION_MODE",
  "SET_TIME",
  "THREE_PHASE_MONITORING_FAULT",
];

const S7_1200_TAGS = [
  "Compressor_circuit_breaker_fault",
  "Oil_pressure_low",
  "Blower_drive_fault",
  "Blower_circuit_breaker_fault",
  "Ambient_air_sensor_1open",
  "COND_FAN_OVERLOAD",
  "Three_phase_monitor_fault",
  "High_pressure_fault",
  "Ambient_temp_lower_than_set_temp",
  "Ambient_temp_over_50C",
  "COMP_MODULE_FEEDBACK_ERROR_Si_I1",
  "Low_pressure_1_fault",
  "COMP_FBK_ERROR",
  "Low_pressure_2_fault",
  "Ambient_temp_over_47C",
  "Condenser_fan_2_TOP_fault",
  "Condenser_fan_3_TOP_fault",
  "Condenser_fan_4_TOP_fault",
  "Condenser_fan_2_circuit_breaker_fault",
  "Condenser_fan_3_circuit_breaker_fault",
  "Condenser_fan_4_circuit_breaker_fault",
  "Condenser_fan_5_TOP_fault",
  "Condenser_fan_6_TOP_fault",
  "Condenser_fan_5_circuit_breaker_fault",
  "Condenser_fan_6_circuit_breaker_fault",
  "Condenser_fan_1_circuit_breaker_fault",
  "Condenser_fan_1_TOP_fault",
  "Ambient_air_sensor_1_short_circuit",
  "Ambient_air_sensor_2_open",
  "Ambient_air_sensor_2_short_circuit",
  "Cold_air_sensor_1_open",
  "Cold_air_sensor_1_short_circuit",
  "Cold_air_sensor_2_open",
  "Cold_air_sensor_2_short_circuit",
  "Air_outlet_sensor_1_open",
  "Air_outlet_sensor_1_short_circuit",
  "Air_outlet_sensor_2_open",
  "Air_outlet_sensor_2_short_circuit",
];

function extractActiveTags(data: any, machineName: string): TagData[] {
  const tags =
    machineName === "GTPL-118-gT-80E-P-S7-200" ? S7_200_TAGS : S7_1200_TAGS;
  const isS7_200 = machineName === "GTPL-118-gT-80E-P-S7-200";

  console.log("Processing data for machine:", machineName);
  console.log("Data received:", data);
  console.log("Using tags:", tags.slice(0, 5), "... (showing first 5)");

  const activeTags: TagData[] = [];

  tags.forEach((tag) => {
    const value = data[tag];
    console.log(`Tag: ${tag}, Value: ${value}, Type: ${typeof value}`);

    let isActive = false;
    if (isS7_200) {
      // For S7_200, check for "tr" string or true boolean
      isActive = value === "tr" || value === true || value === "true";
    } else {
      // For S7_1200, check for true boolean or "true" string
      isActive =
        value === true || value === "true" || value === 1 || value === "1";
    }

    if (isActive) {
      console.log(`Active tag found: ${tag} with value: ${value}`);
      activeTags.push({
        tag,
        value,
        createdAt: data.created_at || data.createdAt || data?.created_on,
      });
    }
  });

  console.log("Total active tags found:", activeTags.length);
  return activeTags;
}

function formatTagName(tag: string): string {
  return tag
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

function getTagCategory(tag: string): string {
  if (
    tag.includes("fault") ||
    tag.includes("FAULT") ||
    tag.includes("OVER") ||
    tag.includes("over") ||
    tag.includes("TRIP") ||
    tag.includes("trip")
  )
    return "fault";
  if (
    tag.includes("TEMP") ||
    tag.includes("temp") ||
    tag.includes("SENSOR") ||
    tag.includes("sensor")
  )
    return "sensor";
  if (
    tag.includes("START") ||
    tag.includes("start") ||
    tag.includes("STOP") ||
    tag.includes("stop") ||
    tag.includes("ON") ||
    tag.includes("on")
  )
    return "control";
  if (
    tag.includes("MANUAL") ||
    tag.includes("manual") ||
    tag.includes("AUTO") ||
    tag.includes("auto")
  )
    return "mode";
  return "status";
}

function ActiveTagRow({ tagData }: { tagData: TagData }) {
  const category = getTagCategory(tagData.tag);
  const getCategoryStyle = (cat: string) => {
    switch (cat) {
      case "fault":
        return "bg-red-50 text-red-800 border-red-200";
      case "sensor":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "control":
        return "bg-green-50 text-green-800 border-green-200";
      case "mode":
        return "bg-purple-50 text-purple-800 border-purple-200";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  return (
    <tr className={`border-b border-gray-200 hover:bg-gray-50`}>
      <td className="px-4 py-3 text-sm font-medium">{tagData.tag}</td>
      <td className="px-4 py-3 text-sm">{formatTagName(tagData.tag)}</td>
      <td className="px-4 py-3 text-sm">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Active ({String(tagData.value)})
        </span>
      </td>
      <td className="px-4 py-3 text-sm">
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryStyle(category)}`}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </span>
      </td>
      <td className="px-4 py-3 text-sm">{tagData.createdAt}</td>
    </tr>
  );
}

function ActiveTagsTable({ activeTags }: { activeTags: TagData[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              Tag Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              Description
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              Status
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              Category
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              Timestamp
            </th>
          </tr>
        </thead>
        <tbody>
          {activeTags.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                No active tags found
              </td>
            </tr>
          ) : (
            activeTags.map((tagData, idx) => (
              <ActiveTagRow
                key={`${tagData.tag}-${tagData.createdAt}-${idx}`}
                tagData={tagData}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function StatisticsCards({ stats }: { stats: Stats }) {
  const getGradientClass = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-gradient-to-r from-blue-500 to-blue-600";
      case "green":
        return "bg-gradient-to-r from-green-500 to-green-600";
      case "red":
        return "bg-gradient-to-r from-red-500 to-red-600";
      case "purple":
        return "bg-gradient-to-r from-purple-500 to-purple-600";
      case "yellow":
        return "bg-gradient-to-r from-amber-500 to-yellow-600";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {[
        { label: "Total Records", value: stats.total, color: "blue" },
        { label: "Active Tags", value: stats.activeTags, color: "green" },
        { label: "Fault Tags", value: stats.faultTags, color: "red" },
        { label: "Current Page", value: stats.currentPage, color: "purple" },
        { label: "Total Pages", value: stats.totalPages, color: "yellow" },
      ].map((stat, idx) => (
        <div
          key={idx}
          className={`${getGradientClass(stat.color)} p-5 rounded-lg shadow-md transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden`}
        >
          <div className="relative z-10">
            <h3 className="text-sm font-medium text-white text-opacity-90 mb-2">
              {stat.label}
            </h3>
            <p className="text-2xl font-bold text-white">
              {stat.value.toLocaleString()}
            </p>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
        </div>
      ))}
    </div>
  );
}

function PaginationControls({
  currentPage,
  totalPages,
  loading,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}) {
  const delta = 2;
  const visiblePages = [];

  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(totalPages - 1, currentPage + delta);
    i++
  ) {
    visiblePages.push(i);
  }

  const pageButtons: (number | string)[] = [1];

  if (currentPage - delta > 2) {
    pageButtons.push("...");
  }

  pageButtons.push(...visiblePages);

  if (currentPage + delta < totalPages - 1) {
    pageButtons.push("...");
  }

  if (totalPages > 1) {
    pageButtons.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-700">
        Showing page {currentPage} of {totalPages} ({totalPages * PAGE_SIZE}{" "}
        total records)
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {pageButtons.map((page, idx) => (
          <button
            key={idx}
            disabled={page === "..." || loading || page === currentPage}
            onClick={() => typeof page === "number" && onPageChange(page)}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              page === currentPage
                ? "bg-blue-600 text-white"
                : page === "..."
                  ? "text-gray-400 cursor-default"
                  : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function LoadingIndicator() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-gray-600">Loading...</span>
    </div>
  );
}

// Debug component to show raw data
function DebugDataDisplay({
  data,
  machineName,
}: {
  data: any[];
  machineName: string;
}) {
  const [showDebug, setShowDebug] = useState(false);

  if (!showDebug) {
    return (
      <button
        onClick={() => setShowDebug(true)}
        className="mb-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
      >
        Show Debug Data
      </button>
    );
  }

  const tags =
    machineName === "GTPL-118-gT-80E-P-S7-200" ? S7_200_TAGS : S7_1200_TAGS;
  const sampleRecord = data[0] || {};

  return (
    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-yellow-800">
          Debug Information
        </h3>
        <button
          onClick={() => setShowDebug(false)}
          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Hide
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-yellow-700">
            Machine: {machineName}
          </h4>
          <p className="text-sm text-yellow-600">
            Records found: {data.length}
          </p>
        </div>

        <div>
          <h4 className="font-medium text-yellow-700">
            Expected Tags (first 10):
          </h4>
          <div className="text-sm text-yellow-600 bg-white p-2 rounded border">
            {tags.slice(0, 10).join(", ")}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-yellow-700">Sample Record Keys:</h4>
          <div className="text-sm text-yellow-600 bg-white p-2 rounded border max-h-32 overflow-y-auto">
            {Object.keys(sampleRecord).join(", ")}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-yellow-700">
            Sample Values for Expected Tags:
          </h4>
          <div className="text-sm text-yellow-600 bg-white p-2 rounded border max-h-32 overflow-y-auto">
            {tags.slice(0, 10).map((tag) => (
              <div key={tag}>
                <strong>{tag}:</strong> {JSON.stringify(sampleRecord[tag])} (
                {typeof sampleRecord[tag]})
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FaultLogsPaginated({
  machineName,
}: {
  machineName: string;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500); // debounce after 500ms
  const [activeTags, setActiveTags] = useState<TagData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawData, setRawData] = useState<any[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<Pagination>({
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
      const endpoint =
        machineName === "GTPL-118-gT-80E-P-S7-200"
          ? "/api/getSmart200Fault"
          : "/api/getSmart1200Fault";
      const url = new URL(`${endpoint}`, window.location.origin);
      url.searchParams.append("page", pageNum.toString());
      url.searchParams.append("limit", PAGE_SIZE.toString());
      url.searchParams.append("from", "2024-01-01");
      url.searchParams.append("to", "2025-12-31");
      if (search) url.searchParams.append("search", search);

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch logs");
      const result = await res.json();

      if (result?.data && Array.isArray(result.data)) {
        setRawData(result.data);
        const active: TagData[] = [];
        let faultCount = 0;

        for (const record of result.data) {
          const tags = extractActiveTags(record, machineName);
          active.push(...tags);
          faultCount += tags.filter(
            (t) => getTagCategory(t.tag) === "fault"
          ).length;
        }

        setActiveTags(active);
        setStats({
          total: result.total || 0,
          activeTags: active.length,
          faultTags: faultCount,
          currentPage: result.page || pageNum,
          totalPages: result.totalPages || 1,
        });
        setPaginationInfo({
          total: result.total || 0,
          totalPages: result.totalPages || 1,
          limit: result.limit || PAGE_SIZE,
          page: result.page || pageNum,
        });
      } else {
        setActiveTags([]);
        setRawData([]);
      }
    } catch (err: any) {
      setError(err.message || "Unknown error");
      setActiveTags([]);
      setRawData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(currentPage, debouncedSearch);

    const intervalId = setInterval(
      () => {
        fetchLogs(currentPage, debouncedSearch);
      },
       60 * 1000
    ); // every 5 min

    return () => clearInterval(intervalId);
  }, [currentPage, machineName, debouncedSearch]);

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Active {machineName} Tags Monitor
          </h2>
          {/* <div className="mb-4">
            <input
              type="text"
              placeholder="Search by device name..."
              className="w-full md:w-1/2 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset to page 1 on new search
              }}
            />
          </div> */}
          <StatisticsCards stats={stats} />
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
              Active Tags ({activeTags.length} found on this page)
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
                <ActiveTagsTable
                  activeTags={activeTags.filter(
                    (tag) => getTagCategory(tag.tag) !== "control"
                  )}
                />
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
