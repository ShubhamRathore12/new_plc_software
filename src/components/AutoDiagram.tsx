export default function HVACDashboard({blower}:any) {
  const getSiloColor = (temp: number) => {
    return "#10b981" // Green color
  }

  const status = {
    TS1: 35,
  }

  return (
    <div className="w-full h-screen bg-gray-100 p-8 relative overflow-hidden">
      {/* Status Indicators */}
      <div className="absolute top-4 left-4 flex gap-4 items-center">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-gray-400"></div>
          <span className="text-xs mt-1">Green</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-gray-600"></div>
          <span className="text-xs mt-1">Red</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-yellow-500 border-2 border-gray-400"></div>
          <span className="text-xs mt-1">Yellow</span>
        </div>
      </div>

      {/* Temperature Display Boxes */}
      <div className="absolute top-4 right-4 space-y-2">
        <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">T1 = 15°C</div>
        <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">TH - T1 = 1°C</div>
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
          <text x="120" y="100" textAnchor="middle" className="text-lg font-bold" fill={getSiloColor(status.TS1)}>
            TS1: {status.TS1}°C
          </text>
        </g>

        {/* Connecting Lines - Exact Pattern */}
        {/* Main horizontal line across the top */}
        <line x1="200" y1="120" x2="650" y2="120" stroke="black" strokeWidth="3" />

        {/* Diagonal line from silo to main horizontal line */}
        <line x1="170" y1="180" x2="200" y2="120" stroke="black" strokeWidth="3" />

        {/* Vertical drops from main line to thermometers */}
        <line x1="280" y1="120" x2="280" y2="140" stroke="black" strokeWidth="2" />
        <line x1="380" y1="120" x2="380" y2="140" stroke="black" strokeWidth="2" />
        <line x1="480" y1="120" x2="480" y2="140" stroke="black" strokeWidth="2" />

        {/* Lower horizontal line for HTR units */}
        <line x1="170" y1="300" x2="580" y2="300" stroke="black" strokeWidth="3" />

        {/* Diagonal line from silo to lower horizontal line */}
        <line x1="170" y1="240" x2="170" y2="300" stroke="black" strokeWidth="3" />

        {/* Vertical connections from lower line to HTR units */}
        <line x1="280" y1="300" x2="280" y2="320" stroke="black" strokeWidth="2" />
        <line x1="350" y1="300" x2="350" y2="320" stroke="black" strokeWidth="2" />
        <line x1="420" y1="300" x2="420" y2="320" stroke="black" strokeWidth="2" />

        {/* Connection to blower */}
        <line x1="580" y1="300" x2="580" y2="340" stroke="black" strokeWidth="2" />

        {/* Line to condenser fan */}
        <line x1="650" y1="120" x2="750" y2="160" stroke="black" strokeWidth="2" />
      </svg>

      {/* Larger Thermometers - TH and T1 increased in size */}
      <div className="absolute left-64 top-36">
        <div className="w-16 h-32 bg-pink-200 border-2 border-red-300 rounded-lg relative">
          <div className="absolute inset-1 bg-gradient-to-b from-transparent via-pink-300 to-red-400 rounded"></div>
          <div className="absolute bottom-1 left-1 right-1 h-4 bg-red-500 rounded-full"></div>
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-sm font-bold">TH</div>
            <div className="text-sm">35°C</div>
          </div>
        </div>
      </div>

      <div className="absolute left-64 top-36 ml-24">
        <div className="w-14 h-28 bg-blue-100 border-2 border-blue-300 rounded-lg relative">
          <div className="absolute inset-1 bg-gradient-to-b from-blue-200 to-blue-300 rounded"></div>
          <div className="absolute top-1 left-1 right-1 h-3 bg-blue-500 rounded-full"></div>
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-sm font-bold">T0</div>
            <div className="text-sm">34°C</div>
          </div>
        </div>
      </div>

      <div className="absolute left-64 top-36 ml-48">
        <div className="w-16 h-32 bg-blue-100 border-2 border-blue-300 rounded-lg relative">
          <div className="absolute inset-1 bg-gradient-to-b from-blue-200 to-blue-300 rounded"></div>
          <div className="absolute top-1 left-1 right-1 h-3 bg-blue-500 rounded-full"></div>
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-sm font-bold">T1</div>
            <div className="text-sm">35°C</div>
          </div>
        </div>
      </div>

      {/* T2 Temperature Display */}
      <div className="absolute left-96 top-48 ml-24">
        <div className="text-center">
          <div className="text-2xl font-bold">T2</div>
          <div className="text-3xl font-bold">40C</div>
        </div>
      </div>

      {/* HTR Units - Repositioned to align with lower line connections */}
      <div className="absolute left-64 top-80 flex gap-8">
        <div className="bg-red-600 text-white px-4 py-6 text-center rounded">
          <div className="text-xs font-bold">HTR</div>
          <div className="text-lg font-bold">0%</div>
        </div>
        <div className="bg-red-600 text-white px-4 py-6 text-center rounded">
          <div className="text-xs font-bold">AHT</div>
          <div className="text-lg font-bold">0%</div>
        </div>
        <div className="bg-red-600 text-white px-4 py-6 text-center rounded">
          <div className="text-xs font-bold">HGS</div>
          <div className="text-lg font-bold">0%</div>
        </div>
      </div>

      {/* Blower Unit */}
 

      {/* Additional Blower */}
      <div className="absolute left-96 top-96 ml-32">
        <div className= "text-black px-6 py-4 text-center rounded">
          <img src="https://www.thumbsfrog.com/1046553/pages/low-pressure-blower-image-1695819922-1046553.jpg" alt="" width={70} height={70}/>
          <div className="text-xs font-bold">BLOWER</div>
          <div className="text-lg font-bold">0%</div>
        </div>
      </div>

      {/* Condenser Fan */}
      <div className="absolute right-32 top-32">
        <div className="w-16 h-32 bg-pink-200 border-2 border-red-300 rounded-lg relative">
          <div className="absolute bottom-1 left-1 right-1 h-3 bg-red-400 rounded-full"></div>
          <div className="absolute top-2 right-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
          <div className="absolute -right-16 top-1/2 transform -translate-y-1/2">
            <div className="flex items-center">
              <div className="w-8 h-1 bg-gray-600"></div>
              <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                <div className="w-4 h-0.5 bg-gray-600 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-sm font-bold">Cond Fan</div>
        </div>
      </div>

      {/* Compressor Unit */}
      <div className="absolute right-32 bottom-32">
        <div className="w-20 h-12 rounded relative">
        <img src={blower} width={20} height={20}/>  
        </div>
        <div className="absolute -bottom-12 bg-red-600 text-white px-4 py-2 text-center rounded text-xs">
          <div className="font-bold">0%</div>
        </div>
      </div>

      {/* Pressure Readings */}
      <div className="absolute right-8 bottom-16 flex gap-2">
        <div className="bg-yellow-400 text-black px-3 py-2 rounded text-sm font-bold">
          HP
          <br />
          103.16
        </div>
        <div className="bg-yellow-400 text-black px-3 py-2 rounded text-sm font-bold">
          LP
          <br />
          103.24
        </div>
      </div>
    </div>
  )
}
