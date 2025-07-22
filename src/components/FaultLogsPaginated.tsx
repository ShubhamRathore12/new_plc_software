import useDebounce from "@/hooks/useDebounce";
import { useState, useEffect } from "react";
const PAGE_SIZE = 20000;

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
  "AFTER_HEAT_TEMP_MORE_THAN_50",
  "AFTER_HEAT_TEMP_SENSOR_TH_OPEN",
  "AFTER_HEAT_TEMP_SENSOR_TH_SHORT_CIRCUIT",
  "AIR_OUTLET_TEMP_SENSOR_T0_OPEN",
  "AIR_OUTLET_TEMP_SENSOR_T0_SHORT_CIRCUIT",
  "AMBIENT_TEMP_LESS_THAN_4",
  "AMBIENT_TEMP_LOW_THAN_SET_TEMP",
  "AMBIENT_TEMP_OVER_40",
  "AMBIENT_TEMP_OVER_43",
  "AMBIENT_TEMP_SENSOR_T2_OPEN",
  "AMBIENT_TEMP_SENSOR_T2_SHORT_CIRCUIT",
  "ANTI_FREEZE_PROTECTION",
  "BLOWER_CIRCUIT_BREAKER_FAULT",
  "BLOWER_DRIVE_FAULT",
  "C0ND_FAN_TOP",
  "COLD_AIR_TEMP_SENSOR_T1_OPEN",
  "COLD_AIR_TEMP_SENSOR_T1_SHORT_CIRCUIT",
  "COMPRESSOR_CIRCUIT_BREA_FAULT",
  "COND_FAN_CIRCUIT_BREAKE_FAULT",
  "CONDENSER_FAN_DOOR_OPEN",
  "HEATER_CIRCUIT_BREAKER_FAULT",
  "HEATER_RCCCB_TRIP_FAULT",
  "HEATER_TOP_FAULT",
  "HIGH_PRESSURE_FAULT",
  "HIGH_PRESSURE_FAULT_LOCKED",
  "HP_TRANSDUCEER_FAILURE",
  "LOW_PRESSURE_FAULT",
  "LOW_PRESSURE_FAULT_LOCKED",
  "LP_TRANSDUCER_FAILURE",
  "SET_POINT_NOT_ACHIEVED_IN_AERATION_MODE",
  "THREE_PHASE_MONITORING_FAULT"
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
  "Air_outlet_sensor_2_short_circuit"
]

const GPL_115_TAGS = [
  "Compressor_circuit_breaker_fault",
  "Condenser_fan_door_open",
  "Blower_drive_fault",
  "Blower_circuit_breaker_fault",
  "Three_phase_monitor_fault",
  "Low_Pressure_Fault",
  "Ambient_temp_lower_than_set_temp",
  "Ambient_temp_Over_43C",
  "Compressor_motor_overheat",
  "Low_pressure_fault_Locked",
  "High_pressure_fault_Locked",
  "Ambient_temp_Over_40C",
  "Ambient_temp_Less_than_4C",
  "Cond_Fan_circuit_breaker_fault",
  "Cond_Fan_drive_fault",
  "Cond_Fan_TOP",
  "Ambient_Temp_Sensor_T2_1_Open",
  "Ambient_Temp_Sensor_T2_1_Short_Circuit",
  "Ambient_Temp_Sensor_T2_2_Open",
  "Ambient_Temp_Sensor_T2_2_Short_Circuit",
  "Air_Outlet_Temp_Sensor_T0_1_Open",
  "Air_Outlet_Temp_Sensor_T0_1_Short_Circuit",
  "Air_Outlet_Temp_Sensor_T0_2_Open",
  "Air_Outlet_Temp_Sensor_T0_2_Short_Circuit",
  "Cold_Air_Temp_Sensor_T1_1_Open",
  "Cold_Air_Temp_Sensor_T1_1_Short_Circuit",
  "Cold_Air_Temp_Sensor_T1_2_Open",
  "Cold_Air_Temp_Sensor_T1_2_Short_Circuit",
  "Air_After_Heater_Temp_Sensor_TH_1_Open",
  "Air_After_Heater_Temp_Sensor_TH_1_Short_Circuit",
  "Air_After_Heater_Temp_Sensor_TH_2_Open",
  "Air_After_Heater_Temp_Sensor_TH_2_Short_Circuit",
  "High_Pressure_Fault",
  "Heater_TOP_fault",
  "Heater_drive_Fault",
  "Heater_circuit_breaker_fault",
  "Heater_RCCB_fault",
  "Anti_Freeze_Protection",
  "TH_Temp_more_than_50C",
  "Delta_not_achieved_in_aeration_mode",
  "Warning_LP_transducer_failure",
  "Warning_HP_transducer_failure",
];

const GPL_117_TAGS = [
  "Compressor_circuit_breaker_fault",
  "Cond_fan1_circuit_breaker_fault_I2_2",
  "Condenser_fan1_door_open",
  "Blower_drive_fault",
  "Blower_circuit_breaker_fault",
  "Heater_circuit_breaker_fault",
  "Three_phase_monitor_fault",
  "Low_Pressure_Fault",
  "Ambient_temp_lower_than_set_temp",
  "Ambient_temp_Over_43C",
  "Compressor_motor_overheat",
  "Heater_RCCB_fault",
  "Cond_Fan2_circuit_breaker_fault",
  "Low_pressure_fault_Locked",
  "Anti_Freeze_Protection",
  "High_pressure_fault_Locked",
  "Ambient_temp_Over_40C",
  "Ambient_temp_Less_than_4C",
  "Cond_Fan_1_TOP",
  "Cond_Fan1_circuit_breaker_fault",
  "Cond_Fan_drive_fault",
  "Cond_Fan_2_TOP",
  "Ambient_Temp_Sensor_T2_1_Open",
  "Ambient_Temp_Sensor_T2_1_Short_Circuit",
  "Ambient_Temp_Sensor_T2_2_Open",
  "Ambient_Temp_Sensor_T2_2_Short_Circuit",
  "Air_Outlet_Temp_Sensor_T0_1_Open",
  "Air_Outlet_Temp_Sensor_T0_1_Short_Circuit",
  "Air_Outlet_Temp_Sensor_T0_2_Open",
  "Air_Outlet_Temp_Sensor_T0_2_Short_Circuit",
  "Cold_Air_Temp_Sensor_T1_1_Open",
  "Cold_Air_Temp_Sensor_T1_1_Short_Circuit",
  "Cold_Air_Temp_Sensor_T1_2_Open",
  "Cold_Air_Temp_Sensor_T1_2_Short_Circuit",
  "Air_After_Heater_Temp_Sensor_TH_1_Open",
  "Air_After_Heater_Temp_Sensor_TH_1_Short_Circuit",
  "Air_After_Heater_Temp_Sensor_TH_2_Open",
  "Air_After_Heater_Temp_Sensor_TH_2_Short_Circuit",
  "High_Pressure_Fault",
  "Comp_Oil_Low",
  "Heater_TOP_fault",
  "Heater_drive_Fault",
  "Condenser_fan2_door_open",
  "TH_Temp_more_than_50C",
  "Delta_not_achieved_in_aeration_mode",
  "Warning_LP_transducer_failure",
  "Warning_HP_transducer_failure",
];

const S7_200_MACHINES = [
  "GTPL-118-gT-80E-P-S7-200",
  "GTPL-108-gT-40E-P-S7-200",
  "GTPL-109-gT-40E-P-S7-200",
  "GTPL-110-gT-40E-P-S7-200",
  "GTPL-111-gT-80E-P-S7-200",
  "GTPL-112-gT-80E-P-S7-200",
  "GTPL-113-gT-80E-P-S7-200",
];

function extractActiveTags(data: any, machineName: string): TagData[] {
  if (!data || typeof data !== "object") {
    console.warn("Invalid data provided to extractActiveTags:", data);
    return [];
  }

  let tags: string[] = [];

  // Select appropriate tag list based on machine name
  if (machineName === "GTPL-115-gT-80E-P-S7-200" || "GTPL-114-gT-80E-P-S7-200" ||"GTPL-119-gT-80E-P-S7-200" ||"GTPL-120-gT-80E-P-S7-200") {
    tags = GPL_115_TAGS;
  } else if (machineName === "GTPL-117-gT-320E-S7-1200" ||"GTPL-116-gT-320E-S7-1200") {
    tags = GPL_117_TAGS;
  }
  else if (S7_200_MACHINES.includes(machineName)) {
    tags = S7_200_TAGS;
  } else {
    tags = S7_1200_TAGS;
  }

  // S7_200 logic applies for both S7_200_MACHINES and this special case
  const isS7_200 =
    machineName === "GTPL-118-gT-80E-P-S7-200" ||
    S7_200_MACHINES.includes(machineName);

  const activeTags: TagData[] = [];

  tags.forEach((tag) => {
    const value = data[tag];

    // Skip if value is undefined, null, or empty
    if (value === undefined || value === null || value === "") {
      return;
    }

    let isActive = false;

    if (isS7_200) {
      // For S7-200 and GPL-115: check for boolean or "tr"
      isActive =
        value === "tr" || value === true || value === "true" || value === 1 || value === "True";
    } else {
      // For S7-1200: check for boolean or "1"/"true"
      isActive =
        value === true || value === "true" || value === 1 || value === "1" || value === "True";
    }

    if (isActive) {
      // Extract timestamp from available fields or use now
      const timestamp =
        data.created_at ||
        data.createdAt ||
        data.created_on ||
        data.timestamp ||
        data.updated_at ||
        new Date().toISOString();

      activeTags.push({
        tag,
        value,
        createdAt: timestamp,
      });
    }
  });

  return activeTags;
}

function formatTagName(tag: string): string {
  return tag
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

// Import the language context
import { useLanguage } from "@/contexts/LanguageContext";

// Language selector component
function LanguageSelector() {
  const { language, setLanguage, availableLanguages } = useLanguage();
  
  return (
    <div className="flex items-center">
      <label htmlFor="language-select" className="mr-2 text-sm text-gray-600">
        Language:
      </label>
      <select
        id="language-select"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {availableLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {lang === 'en-US' ? 'English' : 'Deutsch'}
          </option>
        ))}
      </select>
    </div>
  );
}
function getTagCategory(tag: string): string {
  const lower = tag.toLowerCase();
  if (lower.includes("fault") || lower.includes("error") || lower.includes("alarm")) {
    return "fault";
  }

  return "fault";
}

function ActiveTagRow({ tagData }: { tagData: TagData }) {
  const { tFault, language, tUI } = useLanguage();
  const category = getTagCategory(tagData.tag);
  const getCategoryStyle = (cat: string) => {
    switch (cat) {
      case "fault":
        return "bg-red-50 text-red-800 border-red-200";

      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  return (
    <tr className={`border-b border-gray-200 hover:bg-gray-50`}>
      <td className="px-4 py-3 text-sm font-medium">{tagData.tag}</td>
      <td className="px-4 py-3 text-sm">
        {tFault(tagData.tag) || formatTagName(tagData.tag)}
      </td>
      <td className="px-4 py-3 text-sm">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {tUI("ON")} ({String(tagData.value)})
        </span>
      </td>
      <td className="px-4 py-3 text-sm">
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryStyle(category)}`}
        >
          {tUI("FAULT")}
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
            className={`px-3 py-2 text-sm font-medium rounded-md ${page === currentPage
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

function SearchBar({
  searchTerm,
  onSearchChange,
  loading
}: {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  loading: boolean;
}) {
  return (
    <div className="mb-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tags across all records..."
          disabled={loading}
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
      {searchTerm && (
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Searching for: <span className="font-medium">"{searchTerm}"</span>
          </p>
          <button
            onClick={() => onSearchChange("")}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear search
          </button>
        </div>
      )}
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

  const tags = S7_200_MACHINES.includes(machineName)
    ? S7_200_TAGS
    : S7_1200_TAGS;
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
  const debouncedSearch = useDebounce(searchTerm, 500);
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
      // Use the new searchActiveFaults API endpoint
      const url = new URL("/api/searchActiveFaults", window.location.origin);
      url.searchParams.append("machineName", machineName);
      url.searchParams.append("page", pageNum.toString());
      url.searchParams.append("limit", PAGE_SIZE.toString());

      // Add search parameter if provided
      if (search && search.trim()) {
        url.searchParams.append("search", search.trim());
      }

      const res = await fetch(url.toString());

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API Error: ${res.status} - ${errorText}`);
      }

      const result = await res.json();

      let dataArray = [];
      let total = 0;
      let totalPages = 1;
      let currentPage = pageNum;

      if (Array.isArray(result?.data)) {
        dataArray = result.data;
        total = result.total || result.data.length;
        totalPages = result.totalPages || 1;
        currentPage = result.page || pageNum;
      } else if (result?.data && typeof result.data === "object") {
        dataArray = [result.data];
        total = 1;
        totalPages = 1;
        currentPage = 1;
      } else if (result?.recordData) {
        dataArray = [result.recordData];
        total = 1;
        totalPages = 1;
        currentPage = 1;
      } else if (Array.isArray(result)) {
        dataArray = result;
        total = result.length;
        totalPages = 1;
        currentPage = 1;
      } else {
        console.warn("Unexpected response format:", result);
      }

      setRawData(dataArray);

      // Use activeTags directly from the API response if available
      const active: TagData[] = result.activeTags || [];
      let faultCount = active.filter(t => getTagCategory(t.tag) === "fault").length;

      setActiveTags(active);
      setStats({
        total: result.total || 0,
        activeTags: active.length,
        faultTags: faultCount,
        currentPage,
        totalPages: 1, // Since we're only showing active tags from the latest record
      });
      setPaginationInfo({
        total,
        totalPages,
        limit: result.limit || PAGE_SIZE,
        page: currentPage,
      });
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(`Failed to fetch logs: ${err.message}`);
      setActiveTags([]);
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

    const intervalId = setInterval(() => {
      fetchLogs(currentPage, debouncedSearch);
    }, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [currentPage, machineName, debouncedSearch]);

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Active {machineName} Tags Monitor
            </h2>
            <LanguageSelector />
          </div>

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
