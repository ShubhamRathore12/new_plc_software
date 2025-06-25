import { useState, useEffect } from "react";

const PAGE_SIZE = 10;

interface TagData {
  tag: string;
  value: boolean;
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
  "C0ND_FAN_TOP",
  "COLD_AIR_TEMP_SENSOR_T1_OPEN",
  "COLD_AIR_TEMP_SENSOR_T1_SHORT_CIRCUIT",
  "COMPRESSOR_CIRCUIT_BREA_FAULT",
  "COMPRESSOR_ON",
  "COMPRESSOR_START_MANUAL",
  "COMPRESSOR_STOP_MANUAL",
  "COMPRESSOR_VISIBLE",
  "COND_FAN_CIRCUIT_BREAKE_FAULT",
  "COND_FAN_MOTOR_OVERHEAT",
  "cond_fan_on",
  "COND_FAN_START_MANUAL_M",
  "COND_FAN_STOP_MANUAL_M",
  "CONDENSER_FAN_DOOR_OPEN",
  "CONTINUOUS_MODE",
  "FAULT_RESET",
  "GREEN_LIGHT",
  "HEATER_CIRCUIT_BREAKER_FAULT",
  "HEATER_OVER_HEAT",
  "HEATER_RCCCB_TRIP_FAULT",
  "HEATER_START_MANUAL",
  "HEATER_STOP_MANUAL",
  "HEATER_TOP_FAULT",
  "HIGH_PRESSURE_FAULT",
  "HIGH_PRESSURE_FAULT_LOCKED",
  "HOT_GAS_VALVE_ON",
  "HOT_GAS_VALVE_START_MAN",
  "HOT_GAS_VALVE_STOP_MAN",
  "HP_TRANSDUCEER_FAILURE",
  "LOW_PRESSURE_FAULT",
  "LOW_PRESSURE_FAULT_LOCKED",
  "LP_TRANSDUCER_FAILURE",
  "MANUAL_EN",
  "OPERATING_HOURS_RESET",
  "SET_POINT_NOT_ACHIEVED_IN_AERATION_MODE",
  "SET_TIME",
  "THREE_PHASE_MONITORING_FAULT",
  "YELLOW_LIGHT",
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
  "Ambient_temp._lower_than_set_temp.",
  "Ambient_temp._over_50°C",
  "COMP._MODULE_FEEDBACK_ERROR_(Si-I1)",
  "Low_pressure_1_fault",
  "COMP_FBK_ERROR",
  "Low_pressure_2_fault",
  "Ambient_temp._over_47°C",
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
  "Air_outlet_sensor_2_short_circuit"
];

function extractActiveTags(data: any, machineName: string): TagData[] {
  const tags = machineName === "GTPL-118-gT-80E-P-S7-200" ? S7_200_TAGS : S7_1200_TAGS;
  const isS7_200 = machineName === "GTPL-118-gT-80E-P-S7-200";

  return tags.reduce((acc: TagData[], tag) => {
    const value = data[tag];
    const isActive = isS7_200 ? value === "tr" : value === true;

    if (isActive) {
      acc.push({
        tag,
        value,
        createdAt: data.created_at || data.createdAt || new Date().toISOString(),
      });
    }
    return acc;
  }, []);
}

function formatTagName(tag: string): string {
  return tag.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}

function getTagCategory(tag: string): string {
  if (tag.includes("FAULT") || tag.includes("OVER") || tag.includes("TRIP")) return "fault";
  if (tag.includes("TEMP") || tag.includes("SENSOR")) return "sensor";
  if (tag.includes("START") || tag.includes("STOP") || tag.includes("ON")) return "control";
  if (tag.includes("MANUAL") || tag.includes("AUTO")) return "mode";
  return "status";
}

function ActiveTagRow({ tagData }: { tagData: TagData }) {
  const category = getTagCategory(tagData.tag);
  const getCategoryStyle = (cat: string) => {
    switch (cat) {
      case "fault": return "bg-red-50 text-red-800 border-red-200";
      case "sensor": return "bg-blue-50 text-blue-800 border-blue-200";
      case "control": return "bg-green-50 text-green-800 border-green-200";
      case "mode": return "bg-purple-50 text-purple-800 border-purple-200";
      default: return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  return (
    <tr className={`border-b border-gray-200 hover:bg-gray-50 ${getCategoryStyle(category)}`}>
      <td className="px-4 py-3 text-sm font-medium">{tagData.tag}</td>
      <td className="px-4 py-3 text-sm">{formatTagName(tagData.tag)}</td>
      <td className="px-4 py-3 text-sm">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
      </td>
      <td className="px-4 py-3 text-sm">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryStyle(category)}`}>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </span>
      </td>
      <td className="px-4 py-3 text-sm">{new Date(tagData.createdAt).toLocaleString()}</td>
    </tr>
  );
}

function ActiveTagsTable({ activeTags }: { activeTags: TagData[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tag Name</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {activeTags.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No active tags found</td>
            </tr>
          ) : (
            activeTags.map((tagData, idx) => (
              <ActiveTagRow key={`${tagData.tag}-${tagData.createdAt}-${idx}`} tagData={tagData} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function StatisticsCards({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {[
        { label: "Total Records", value: stats.total, color: "blue" },
        { label: "Active Tags", value: stats.activeTags, color: "green" },
        { label: "Fault Tags", value: stats.faultTags, color: "red" },
        { label: "Current Page", value: stats.currentPage, color: "purple" },
        { label: "Total Pages", value: stats.totalPages, color: "yellow" },
      ].map((stat, idx) => (
        <div key={idx} className={`bg-${stat.color}-50 p-4 rounded-lg border border-${stat.color}-200`}>
          <h3 className={`text-sm font-medium text-${stat.color}-600`}>{stat.label}</h3>
          <p className={`text-2xl font-bold text-${stat.color}-800`}>{stat.value}</p>
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

  for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
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
        Showing page {currentPage} of {totalPages} ({totalPages * PAGE_SIZE} total records)
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1 || loading}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed">
          Previous
        </button>
        {pageButtons.map((page, idx) => (
          <button key={idx} disabled={page === "..." || loading || page === currentPage}
            onClick={() => typeof page === "number" && onPageChange(page)}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              page === currentPage
                ? "bg-blue-600 text-white"
                : page === "..."
                ? "text-gray-400 cursor-default"
                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
            }`}>
            {page}
          </button>
        ))}
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages || loading}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed">
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

export default function FaultLogsPaginated({ machineName }: { machineName: string }) {
  const [activeTags, setActiveTags] = useState<TagData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const fetchLogs = async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = machineName === "GTPL-118-gT-80E-P-S7-200" ? "/api/getSmart200Fault" : "/api/getSmart1200Fault";
      const res = await fetch(`${endpoint}?page=${pageNum}&limit=${PAGE_SIZE}&from=2024-01-01&to=2024-12-31`);
      if (!res.ok) throw new Error("Failed to fetch logs");
      const result = await res.json();

      if (result?.data && Array.isArray(result.data)) {
        const active: TagData[] = [];
        let faultCount = 0;

        for (const record of result.data) {
          const tags = extractActiveTags(record, machineName);
          active.push(...tags);
          faultCount += tags.filter(t => getTagCategory(t.tag) === "fault").length;
        }

        setActiveTags(active);
        setStats({
          total: result.total,
          activeTags: active.length,
          faultTags: faultCount,
          currentPage: result.page,
          totalPages: result.totalPages,
        });
        setPaginationInfo({
          total: result.total,
          totalPages: result.totalPages,
          limit: result.limit,
          page: result.page,
        });
      } else {
        console.warn("Unexpected response:", result);
        setActiveTags([]);
      }
    } catch (err: any) {
      setError(err.message || "Unknown error");
      setActiveTags([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(currentPage);
  }, [currentPage]);

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Active S7-200 Tags Monitor</h2>
          <StatisticsCards stats={stats} />
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">{error}</div>}
        </div>
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Active Tags ({activeTags.length} found on this page)</h3>
            <p className="text-sm text-gray-500">Showing only tags with value = true • Page {currentPage} of {paginationInfo.totalPages}</p>
          </div>
          {loading ? <LoadingIndicator /> : (
            <>
              <div className="border border-gray-200 rounded-lg">
                <ActiveTagsTable activeTags={activeTags} />
              </div>
              {paginationInfo.totalPages > 1 && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={paginationInfo.totalPages}
                  loading={loading}
                  onPageChange={page => setCurrentPage(page)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
