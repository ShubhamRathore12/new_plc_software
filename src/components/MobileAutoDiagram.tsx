import Image from "next/image"

export default function MobileAutoDiagram({ blower, data, formatValue, machineName }: any) {
  const getSiloColor = (temp: number) => {
    return "#10b981"
  }

  const status = { TS1: 35 }

  const greenOn = data?.GREEN_LIGHT === "tr"
  const redOn = data?.RED_LIGHT === "tr"
  const yellowOn = data?.YELLOW_LIGHT === "tr"

  const lampColor = (on: boolean, color: string) => (on ? color : "#d1d5db")

  return (
    <div className="w-full min-h-screen bg-gray-100 p-4 md:p-8 relative overflow-auto flex flex-col md:block">
      {/* Status Lights */}
      <div className="flex gap-4 items-center justify-center md:justify-start md:absolute top-4 left-4">
        {[
          { label: "Green", on: greenOn, color: "#10b981" },
          { label: "Red", on: redOn, color: "#ef4444" },
          { label: "Yellow", on: yellowOn, color: "#eab308" },
        ].map(({ label, on, color }) => (
          <div className="flex flex-col items-center" key={label}>
            <div className="w-8 h-8 rounded-full border-2 border-gray-400" style={{ backgroundColor: lampColor(on, color) }} />
            <span className="text-xs mt-1">{label}</span>
          </div>
        ))}
      </div>

      {/* Temperature Display Boxes */}
      <div className="flex flex-col space-y-2 items-end md:absolute md:top-4 md:right-4 mt-4 md:mt-0">
        <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">
          {machineName === "GTPL-122-gT-1000T-S7-1200"
            ? `T0 = ${formatValue(data?.T0_temp_mean, "°C")}`
            : `T1 = ${formatValue(data?.T1_SET_POINT, "°C")}`}
        </div>
        <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">
          {machineName === "GTPL-122-gT-1000T-S7-1200"
            ? `T Delta = ${formatValue(data.Delta_T_set_point || data?.Th_T1, "°C")}`
            : `TH - T1 = ${formatValue(data.AI_TH_Act || data?.Th_T1, "°C")}`}
        </div>
      </div>

      {/* SVG Diagram */}
      <svg className="w-full h-auto md:absolute inset-0 pointer-events-none" viewBox="0 0 800 600" preserveAspectRatio="xMinYMin meet" style={{ zIndex: 1 }}>
        {/* Silo and piping logic (same as your original, no changes) */}
        <g>
          <ellipse cx="120" cy="120" rx="50" ry="20" fill={getSiloColor(status.TS1)} stroke="#6b7280" strokeWidth="2" opacity="0.8" />
          <rect x="70" y="120" width="100" height="150" fill={getSiloColor(status.TS1)} stroke="#6b7280" strokeWidth="2" opacity="0.8" />
          <ellipse cx="120" cy="270" rx="50" ry="20" fill={getSiloColor(status.TS1)} stroke="#6b7280" strokeWidth="2" opacity="0.9" />
          {[...Array(12)].map((_, i) => (
            <line key={i} x1="72" y1={130 + i * 12} x2="168" y2={130 + i * 12} stroke="#9ca3af" strokeWidth="1" opacity="0.7" />
          ))}
          <rect x="115" y="270" width="10" height="25" fill="#9ca3af" stroke="#6b7280" strokeWidth="1" />
          <text x="120" y="320" textAnchor="middle" className="text-sm font-bold fill-gray-800">SILO</text>
        </g>

        {/* Connecting lines */}
        <line x1="200" y1="120" x2="580" y2="120" stroke="black" strokeWidth="2" />
        <line x1="170" y1="180" x2="200" y2="120" stroke="black" strokeWidth="2" />
        {machineName !== "GTPL-122-gT-1000T-S7-1200" && <line x1="280" y1="120" x2="280" y2="128" stroke="black" strokeWidth="2" />}
        <line x1="380" y1="120" x2="380" y2="128" stroke="black" strokeWidth="2" />
        <line x1="480" y1="120" x2="480" y2="128" stroke="black" strokeWidth="2" />
        <line x1="580" y1="120" x2="580" y2="400" stroke="black" strokeWidth="2" />
        <line x1="170" y1="300" x2="580" y2="300" stroke="black" strokeWidth="2" />
        <line x1="170" y1="240" x2="170" y2="300" stroke="black" strokeWidth="2" />
      </svg>

      {/* Thermometers */}
      <div className="flex flex-wrap justify-center md:block md:absolute md:left-64 md:top-32 gap-6 mt-6 md:mt-0">
        {machineName !== "GTPL-122-gT-1000T-S7-1200" && (
          <div className="w-14 md:w-16 h-32 md:h-42 bg-pink-200 border-2 border-red-300 rounded-lg relative">
            <div className="absolute inset-1 bg-gradient-to-b from-transparent via-pink-300 to-red-400 rounded" />
            <div className="absolute bottom-1 left-1 right-1 h-4 bg-red-500 rounded-full" />
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
              <div className="text-sm font-bold">TH</div>
              <div className="text-sm">{formatValue(data.AI_TH_Act || data?.AFTER_HEATER_TEMP_Th, "°C")}</div>
            </div>
          </div>
        )}
        <div className="w-14 md:w-16 h-32 md:h-42 bg-blue-100 border-2 border-blue-300 rounded-lg relative">
          <div className="absolute inset-1 bg-gradient-to-b from-blue-200 to-blue-300 rounded" />
          <div className="absolute top-1 left-1 right-1 h-3 bg-blue-500 rounded-full" />
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-sm font-bold">T0</div>
            <div className="text-sm">{formatValue(data.AIR_OUTLET_TEMP || data?.T0_temp_mean, "°C")}</div>
          </div>
        </div>
        <div className="w-14 md:w-16 h-32 md:h-42 bg-blue-100 border-2 border-blue-300 rounded-lg relative">
          <div className="absolute inset-1 bg-gradient-to-b from-blue-200 to-blue-300 rounded" />
          <div className="absolute top-1 left-1 right-1 h-3 bg-blue-500 rounded-full" />
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-sm font-bold">T1</div>
            <div className="text-sm">{formatValue(data?.COLD_AIR_TEMP_T1 || data?.T1_temp_mean, "°C")}</div>
          </div>
        </div>
      </div>

      {/* T2 */}
      <div className="text-center mt-6 md:absolute md:left-[28rem] md:top-48">
        <div className="text-2xl font-bold">T2</div>
        <div className="text-3xl font-bold">{formatValue(data?.T2_temp_mean || data?.AMBIENT_AIR_TEMP_T2) || "N/A"}</div>
      </div>

      {/* HTR Units */}
      <div className="flex flex-wrap gap-4 justify-center mt-6 md:absolute md:left-64 md:top-[24rem]">
        {machineName !== "GTPL-122-gT-1000T-S7-1200" && (
          <div className="bg-red-600 text-white px-4 py-6 text-center rounded">
            <div className="text-xs font-bold">HTR</div>
            <div className="text-lg font-bold">{formatValue(data.Value_to_Display_HEATER, "%")}</div>
          </div>
        )}
        {["AHT", "HGS"].map((label, i) => (
          <div key={label} className="bg-red-600 text-white px-4 py-6 text-center rounded">
            <div className="text-xs font-bold">{label}</div>
            <div className="text-lg font-bold">
              {formatValue(
                data[`Value_to_Display_${label}_VALE_OPEN`] ||
                data[`${label}_valve_speed`] ||
                data[`${label === "HGS" ? "HOT_GAS_VALVE_RPM" : "AFTER_HEAT_VALVE_RPM"}`],
                "%"
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Blower */}
      <div className="flex justify-center mt-6 md:absolute md:left-[32rem] md:top-[26rem]">
        <div className="text-black px-6 py-4 text-center rounded">
          <img src="https://www.thumbsfrog.com/1046553/pages/low-pressure-blower-image-1695819922-1046553.jpg" alt="Blower" width={70} height={70} />
          <div className="text-xs font-bold">BLOWER</div>
          <div className="text-lg font-bold">{formatValue(data?.Blower_speed || data?.BLOWER_RPM || data?.Value_to_Display_BLOWER, "%")}</div>
        </div>
      </div>

      {/* Condenser */}
      <div className="flex flex-col items-center mt-6 md:absolute md:right-32 md:top-32">
        <div className="w-16 h-32 bg-pink-200 border-2 border-red-300 rounded-lg relative">
          <div className="absolute bottom-1 left-1 right-1 h-3 bg-red-400 rounded-full" />
          <div className="absolute top-2 right-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
          </div>
          <div className="absolute -right-16 top-1/2 transform -translate-y-1/2">
            <div className="flex items-center">
              <div className="w-full h-full rounded-full flex items-center justify-center ml-10">
                <Image src={blower} alt="Condenser Fan" width={60} height={60} />
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-2">
          <div className="text-sm font-bold">Condensor</div>
          <div>{formatValue(data.Value_to_Display_COND_ACT_SPEED, "%")}</div>
        </div>
      </div>

      {/* Compressor */}
      <div className="flex flex-col items-center mt-6 md:absolute md:right-32 md:bottom-32">
        <img src="https://tse2.mm.bing.net/th/id/OIP.I6O7E9W-F27nxBsa_GZ35wAAAA" width={80} height={80} alt="Compressor" />
        <div className="bg-red-600 text-white px-4 py-2 text-center rounded text-xs mt-2">
          <div className="font-bold">{formatValue(data?.COMPRESSOR_TIME || data?.Compressor_timer, "%")}</div>
        </div>
      </div>

      {/* Pressure Readings */}
      <div className="flex gap-2 justify-center mt-4 md:absolute md:right-8 md:bottom-2">
        {["HP", "LP"].map(label => (
          <div key={label} className="bg-yellow-400 text-black px-3 py-2 rounded text-sm font-bold">
            {label}
            <br />
            {formatValue(
              data[`AI_${label === "HP" ? "COND" : "SUC"}_PRESSURE`] ||
              data[label] ||
              data[`${label}_value`]
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
