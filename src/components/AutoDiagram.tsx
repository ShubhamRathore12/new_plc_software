import Image from "next/image"


export default function HVACDashboard({blower,data,formatValue,machineName}:any) {
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
     <div className="absolute top-4 left-4 flex gap-4 items-center">
    <div className="flex flex-col items-center">
      <div 
        className="w-8 h-8 rounded-full border-2 border-gray-400"
        style={{ backgroundColor: lampColor(greenOn, "#10b981") }}
      ></div>
      <span className="text-xs mt-1">Green</span>
    </div>
    <div className="flex flex-col items-center">
      <div 
        className="w-8 h-8 rounded-full border-2 border-gray-600"
        style={{ backgroundColor: lampColor(redOn, "#ef4444") }}
      ></div>
      <span className="text-xs mt-1">Red</span>
    </div>
    <div className="flex flex-col items-center">
      <div 
        className="w-8 h-8 rounded-full border-2 border-gray-400"
        style={{ backgroundColor: lampColor(yellowOn, "#eab308") }}
      ></div>
      <span className="text-xs mt-1">Yellow</span>
    </div>
  </div>

      {/* Temperature Display Boxes */}
      <div className="absolute top-4 right-4 space-y-2">
         {machineName === "GTPL-122-gT-1000T-S7-1200" ? ( <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">T0 = {formatValue(data?.T0_temp_mean, "°C")}</div>):( <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">T1 = {formatValue(data?.T1_SET_POINT, "°C")}</div>)}

   {machineName === "GTPL-122-gT-1000T-S7-1200" ? (
  <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">
    T Delta = {formatValue(data.Delta_T_set_point || data?.Th_T1, "°C")}
  </div>
) : (
  <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">
    TH - T1 = {formatValue(data.AI_TH_Act || data?.Th_T1, "°C")}
  </div>
)}

      </div>

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
  {machineName !== "GTPL-122-gT-1000T-S7-1200" &&      <line x1="240" y1="120" x2="240" y2="128" stroke="black" strokeWidth="2" />}
  

        <line x1="320" y1="120" x2="320" y2="128" stroke="black" strokeWidth="2" />

        <line x1="410" y1="120" x2="410" y2="128" stroke="black" strokeWidth="2" />

        {/* Connection from top line to blower - NEW */}

        <line x1="500" y1="120" x2="500" y2="400" stroke="black" strokeWidth="2" />

        {/* Lower horizontal line for HTR units */}

        <line x1="170" y1="300" x2="500" y2="300" stroke="black" strokeWidth="2" />

        {/* Diagonal line from silo to lower horizontal line */}

        <line x1="170" y1="240" x2="170" y2="300" stroke="black" strokeWidth="2" />

        {/* Vertical connections from lower line to HTR units */}

        <line x1="280" y1="300" x2="280" y2="320" stroke="black" strokeWidth="0" />

        <line x1="350" y1="300" x2="350" y2="320" stroke="black" strokeWidth="0" />

        <line x1="420" y1="300" x2="420" y2="320" stroke="black" strokeWidth="0" />

        {/* Line to condenser fan */}

        {/* <line x1="650" y1="320" x2="350" y2="360" stroke="black" strokeWidth="2" /> */}
      </svg>

      {/* Larger Thermometers - TH and T1 increased in size */}
      <div className="absolute left-54 top-32">
        {machineName !== "GTPL-122-gT-1000T-S7-1200" &&   <div className="w-14 h-42 bg-pink-200 border-2 border-red-300 rounded-lg relative">
          <div className="absolute inset-1 bg-gradient-to-b from-transparent via-pink-300 to-red-400 rounded"></div>
          <div className="absolute bottom-1 left-1 right-1 h-4 bg-red-500 rounded-full"></div>
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-sm font-bold">TH </div>
            <div className="text-sm">  {formatValue(data.AI_TH_Act || data?.AFTER_HEATER_TEMP_Th, "°C")}</div>
          </div>
        </div>}
      
      </div>

      <div className="absolute left-50 top-32 ml-24">
        <div className="w-14 h-42 bg-blue-100 border-2 border-blue-300 rounded-lg relative">
          <div className="absolute inset-1 bg-gradient-to-b from-blue-200 to-blue-300 rounded"></div>
          <div className="absolute top-1 left-1 right-1 h-3 bg-blue-500 rounded-full"></div>
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-sm font-bold">T0</div>
            <div className="text-sm">   {formatValue(
                data.AIR_OUTLET_TEMP || data?.T0_temp_mean,
                "°C"
              )}</div>
          </div>
        </div>
      </div>

      <div className="absolute left-48 top-32 ml-48">
        <div className="w-14 h-42 bg-blue-100 border-2 border-blue-300 rounded-lg relative">
          <div className="absolute inset-1 bg-gradient-to-b from-blue-200 to-blue-300 rounded"></div>
          <div className="absolute top-1 left-1 right-1 h-3 bg-blue-500 rounded-full"></div>
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-sm font-bold">T1</div>
            <div className="text-sm">      {formatValue(data?.COLD_AIR_TEMP_T1 || data?.T1_temp_mean, "°C")}</div>
          </div>
        </div>
      </div>

      {/* T2 Temperature Display */}
      <div className="absolute left-110 top-48 ml-24">
        <div className="text-center">
          <div className="text-lg font-bold">T2</div>
          <div className="text-sm">       {formatValue(
                data?.T2_temp_mean || data?.AMBIENT_AIR_TEMP_T2
              ) || "N/A"}°C </div>
        </div>
      </div>

      {/* HTR Units - Repositioned to align with lower line connections */}
      <div className="absolute left-54 top-90 flex gap-8">
        {machineName !== "GTPL-122-gT-1000T-S7-1200" &&  <div className="bg-red-600 text-white px-4 py-6 text-center rounded">
          <div className="text-xs font-bold">HTR</div>
          <div className="text-lg font-bold">{formatValue(data.Value_to_Display_HEATER, "%")}</div>
        </div>}
       
        <div className="bg-red-600 text-white px-4 py-6 text-center rounded">
          <div className="text-xs font-bold">AHT</div>
          <div className="text-lg font-bold">   {formatValue(
                data.Value_to_Display_AHT_VALE_OPEN ||
                  data.AFTER_HEAT_VALVE_RPM || data?.AHT_vale_speed,
                "%"
              )}</div>
        </div>
        <div className="bg-red-600 text-white px-4 py-6 text-center rounded">
          <div className="text-xs font-bold">HGS</div>
          <div className="text-lg font-bold">   {formatValue(
                data.Value_to_Display_HOT_GAS_VALVE_OPEN ||
                  data?.HOT_GAS_VALVE_RPM || data?.Hot_valve_speed,
                "%"
              )}</div>
        </div>
      </div>

      {/* Blower Unit */}
 

      {/* Additional Blower */}
      <div className="absolute left-85 top-92 ml-32">
        <div className= "text-black px-6 py-4 text-center rounded">
          <img src="https://www.thumbsfrog.com/1046553/pages/low-pressure-blower-image-1695819922-1046553.jpg" alt="" width={70} height={70}/>
          <div className="text-xs font-bold">BLOWER</div>
          <div className="text-lg font-bold">  {formatValue(
    data?.Blower_speed || data?.BLOWER_RPM || data?.Value_to_Display_BLOWER,
    "%"
  )}</div>
        </div>
      </div>

      {/* Condenser Fan */}
      <div className="absolute right-32 top-32 max-[1600px]:right-16">
        <div className="w-12 h-32 bg-pink-200 border-2 border-red-300 rounded-lg relative">
          <div className="absolute bottom-1 left-1 right-1 h-3 bg-red-400 rounded-full"></div>
          <div className="absolute top-2 right-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
          <div className="absolute -right-16 top-1/2 transform -translate-y-1/2">
            <div className="flex items-center">
         
              <div className="w-full h-full rounded-full flex items-center justify-center ml-10">
              <Image src={blower} alt="" width={60} height={60}/>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-sm font-bold">Condensor</div>
          <div>      {formatValue(data.Value_to_Display_COND_ACT_SPEED, "%")}</div>
        </div>

           {/* <div className="absolute -bottom-8 left-30 transform -translate-x-1/2 text-center">
          <div className="text-sm font-bold">Cond Fan</div>
        </div> */}
      </div>

      {/* Compressor Unit */}
      <div className="absolute right-20 bottom-72 max-[1600px]:left-[37rem] max-[1600px]:bottom-56">
        <div className="w-20 h-12 rounded relative">
        <img src="https://tse2.mm.bing.net/th/id/OIP.I6O7E9W-F27nxBsa_GZ35wAAAA?r=0&w=370&h=370&rs=1&pid=ImgDetMain&cb=idpwebp2&o=7&rm=3" width={80} height={80}/>  
        </div>
        <div className="absolute -bottom-12 bg-red-600 text-white px-4 py-2 text-center rounded text-xs">
          <div className="font-bold">         {formatValue(data?.COMPRESSOR_TIME || data?.Compressor_timer, "%")}</div>
        </div>
      </div>

      {/* Pressure Readings */}
      <div className="absolute right-20 bottom-42  flex gap-2 max-[1600px]:right-2 max-[1600px]:bottom-28 ">
        <div className="bg-yellow-400 text-black px-3 py-2 rounded text-sm font-bold">
          HP
          <br />
        {formatValue(
                data.AI_COND_PRESSURE || data?.HP || data?.COMPRESSOR_TIME || data?.HP_value
              )}
        </div>
        <div className="bg-yellow-400 text-black px-3 py-2 rounded text-sm font-bold">
          LP
          <br />
                  {formatValue(data.AI_SUC_PRESSURE || data?.LP || data?.LP_value)}
        </div>
      </div>
    </div>
  )
}
