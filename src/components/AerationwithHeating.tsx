import Image from "next/image"
import Fan1200 from "../../public/images/fan.jpg"

export default function AerationwithHeating({blower,data,formatValue,machineName}:any) {
  const getSiloColor = (temp: number) => {
    return "#10b981" // Green color
  }

  const status = {
    TS1: 35,
  }

    const greenOn = data?.GREEN_LIGHT === "tr" || data?.GREEN_LIGHT === "true";
  const redOn = data?.RED_LIGHT === "tr" || data?.RED_LIGHT === "true";
  const yellowOn = data?.YELLOW_LIGHT === "tr" || data?.YELLOW_LIGHT === "true";

  // Helper for lamp color
  const lampColor = (on: boolean, color: string) => (on ? color : "#d1d5db");

  return (
    <div className="w-full h-screen bg-gray-100 p-8 relative overflow-hidden">
      {/* Status Indicators */}


      {/* Temperature Display Boxes */}
 

      {/* SVG Container for Silo and Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        {/* Silo using provided code */}
        <g>
          <ellipse
            cx="120"
            cy="120"
            rx="50"
            ry="20"
            fill={getSiloColor(status.TS1)}
            stroke="#6b7280"
            strokeWidth="2"
            opacity="0.8"
          />
          <rect
            x="70"
            y="120"
            width="100"
            height="150"
            fill={getSiloColor(status.TS1)}
            stroke="#6b7280"
            strokeWidth="2"
            opacity="0.8"
          />
          <ellipse
            cx="120"
            cy="270"
            rx="50"
            ry="20"
            fill={getSiloColor(status.TS1)}
            stroke="#6b7280"
            strokeWidth="2"
            opacity="0.9"
          />
          <div className="">
            TH
          </div>

          {/* Horizontal lines */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
            <line
              key={i}
              x1="72"
              y1={130 + i * 12}
              x2="168"
              y2={130 + i * 12}
              stroke="#9ca3af"
              strokeWidth="1"
              opacity="0.7"
            />
          ))}

          {/* Silo outlet */}
          <rect x="115" y="270" width="10" height="25" fill="#9ca3af" stroke="#6b7280" strokeWidth="1" />

          <text x="120" y="320" textAnchor="middle" className="text-sm font-bold fill-gray-800">
            SILO
          </text>
      
        </g>

      {/* Connecting Lines - Exact Pattern */}

        {/* Main horizontal line across the top - extended to reach blower */}

        <line x1="200" y1="120" x2="500" y2="120" stroke="black" strokeWidth="2" />

        {/* Diagonal line from silo to main horizontal line */}

        <line x1="170" y1="180" x2="200" y2="120" stroke="black" strokeWidth="2" />

        {/* Vertical drops from main line to thermometers */}
  {machineName !== "GTPL-122-gT-1000T-S7-1200" &&      <line x1="240" y1="120" x2="240" y2="128" stroke="black" strokeWidth="0" />}
  

        <line x1="320" y1="120" x2="320" y2="128" stroke="black" strokeWidth="0" />

        <line x1="410" y1="120" x2="410" y2="128" stroke="black" strokeWidth="0" />

        {/* Connection from top line to blower - NEW */}

        <line x1="500" y1="120" x2="540" y2="400" stroke="black" strokeWidth="2" />

        {/* Lower horizontal line for HTR units */}

        <line x1="170" y1="300" x2="475" y2="300" stroke="black" strokeWidth="2" />

        {/* Diagonal line from silo to lower horizontal line */}

        <line x1="170" y1="240" x2="170" y2="300" stroke="black" strokeWidth="2" />

        {/* Vertical connections from lower line to HTR units */}

        <line x1="280" y1="300" x2="280" y2="320" stroke="black" strokeWidth="0" />

        <line x1="350" y1="300" x2="350" y2="320" stroke="black" strokeWidth="0" />

        <line x1="475" y1="300" x2="500" y2="400" stroke="black" strokeWidth="2" />

        {/* Line to condenser fan */}

        {/* <line x1="650" y1="320" x2="350" y2="360" stroke="black" strokeWidth="2" /> */}
      </svg>

      {/* Larger Thermometers - TH and T1 increased in size */}
   

      {/* T2 Temperature Display */}
     {/* T2 box next to blower line */}
<div className="absolute left-[350px] top-[320px]">
  <div className="flex flex-row items-center px-2 py-1 gap-2">
    <div className="text-sm font-bold text-gray-700">
      T2:
    </div>
    <div className="border border-black text-black px-4 py-2 rounded text-lg font-bold min-w-[80px] text-center">
      {formatValue(
        data?.T2_temp_mean || data?.AMBIENT_AIR_TEMP_T2,
        "°C"
      ) || "N/A"}
    </div>
  </div>
</div>


      {/* HTR Units - Repositioned to align with lower line connections */}
 

      {/* Blower Unit */}
 
{/* TH box next to Silo */}
<div className="absolute left-[170px] top-[180px]">
  <div className="flex flex-row items-center px-2 py-1 gap-2">
    <div className="text-sm font-bold text-gray-700">
       TH
    </div>
    <div className="border border-black text-black px-4 py-2 rounded text-lg font-bold min-w-[80px] text-center">
      {formatValue(
        data?.AI_TH_Act || data?.AFTER_HEATER_TEMP_Th  || data?.T0_temp_mean || data?.TH_temp_mean,
        "°C"
      )}
    </div>
  </div>
</div>


      {/* Additional Blower */}
      <div className="absolute left-85 top-92 ml-32">
        <div className= "text-black px-6 py-4 text-center rounded">
          <img src="https://www.thumbsfrog.com/1046553/pages/low-pressure-blower-image-1695819922-1046553.jpg" alt="" width={70} height={70}/>
          <div className="text-xs font-bold">BLOWER</div>
          <div className="text-lg font-bold">         {formatValue(
                data?.Value_to_Display_EVAP_ACT_SPEED || data?.BLOWER_RPM || data?.Blower_speed,
                "%"
              )}</div>
        </div>
      </div>
      

     {/* Running Time - Left side of blower */}
 <div className="absolute left-72 top-96">
  <div className="text-center px-3 py-2">
    <div className="text-sm font-bold text-gray-700">Running Time</div>
    <div className="flex gap-4 mt-2 justify-center">
      {/* Hour Box */}
      <div className="flex flex-col items-center">
        <div className="bg-black text-white px-4 py-2 rounded text-lg font-bold min-w-[60px] text-center">
          {formatValue(data?.Running_time_hour || data?.RUNNING_HOUR1 || data?.Running_time_hour || "0")}
        </div>
        <div className="text-xs text-gray-600 mt-1">Hours</div>
      </div>

      {/* Minute Box */}
      <div className="flex flex-col items-center">
        <div className="bg-black text-white px-4 py-2 rounded text-lg font-bold min-w-[60px] text-center">
          {formatValue(data?.Running_time_minute || data?.RUNNING_MINUTE1 || data?.Running_time_minute || "0")}
        </div>
        <div className="text-xs text-gray-600 mt-1">Minutes</div>
      </div>
    </div>
  </div>
</div>


      {/* Set Duration - Below Running Time */}

   {machineName === "GTPL-122-gT-1000T-S7-1200" || machineName === "GTPL-115-gT-180E-S7-1200" ? null :
   

  <div className="absolute left-125 top-32">
    <div className="flex items-center gap-3 px-3 py-2">
      {/* Label */}
      <div className="text-sm font-bold text-gray-700">
        Set Duration
      </div>

      {/* Value in black box */}
      <div className="bg-black text-white px-4 py-2 rounded text-lg font-bold min-w-[80px] text-center">
        {formatValue(data?.HEATING_MODE_Set_Run_Duration || data?.SET_DURATION || data?.Aeration_duration_set) || "00:00"}h
      </div>
    </div>
  </div>
}
</div>
  )
}
