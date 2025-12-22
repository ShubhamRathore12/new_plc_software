import Image from "next/image";
import { motion } from "framer-motion";
import Fan1200 from "../../public/images/fan.jpg";
import Fan from "../../public/images/fan.png";

export default function HVACDashboard({
  data,
  formatValue,
  machineName,
}: any) {
  const greenOn =
    data?.GREEN_LIGHT === "tr" || data?.["Chiller_healthy_(Q1.1)"] === "true";
  const redOn =
    data?.RED_LIGHT === "tr" || data?.["Chiller_fault_(Q2.3)"] === "true";
  const yellowOn =
    data?.YELLOW_LIGHT === "tr" || data?.["System_warnning_(Q1.0)"] === "true";

  // Helper for lamp color
  const lampColor = (on: boolean, color: string) => (on ? color : "#d1d5db");

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4 md:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      {/* Status Indicators - Modernized */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-4 left-4 flex gap-3 items-center backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 p-3 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 z-10"
      >
        <motion.div 
          className="flex flex-col items-center gap-1"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div
            className="w-10 h-10 rounded-full border-2 shadow-lg transition-all duration-300"
            style={{ 
              backgroundColor: lampColor(greenOn, "#10b981"),
              borderColor: greenOn ? "#10b981" : "#d1d5db",
              boxShadow: greenOn ? "0 0 20px rgba(16, 185, 129, 0.6)" : "none"
            }}
          >
            {greenOn && <div className="w-full h-full rounded-full animate-ping bg-green-400 opacity-75" />}
          </div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Healthy</span>
        </motion.div>
        <motion.div 
          className="flex flex-col items-center gap-1"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div
            className="w-10 h-10 rounded-full border-2 shadow-lg transition-all duration-300"
            style={{ 
              backgroundColor: lampColor(redOn, "#ef4444"),
              borderColor: redOn ? "#ef4444" : "#d1d5db",
              boxShadow: redOn ? "0 0 20px rgba(239, 68, 68, 0.6)" : "none"
            }}
          >
            {redOn && <div className="w-full h-full rounded-full animate-ping bg-red-400 opacity-75" />}
          </div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Fault</span>
        </motion.div>
        <motion.div 
          className="flex flex-col items-center gap-1"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div
            className="w-10 h-10 rounded-full border-2 shadow-lg transition-all duration-300"
            style={{ 
              backgroundColor: lampColor(yellowOn, "#eab308"),
              borderColor: yellowOn ? "#eab308" : "#d1d5db",
              boxShadow: yellowOn ? "0 0 20px rgba(234, 179, 8, 0.6)" : "none"
            }}
          >
            {yellowOn && <div className="w-full h-full rounded-full animate-ping bg-yellow-400 opacity-75" />}
          </div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Warning</span>
        </motion.div>
      </motion.div>

      {/* Temperature Display Boxes - Modernized */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute top-4 right-4 space-y-3 z-10"
      >
        {machineName === "GTPL-122-gT-1000T-S7-1200" ? (
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="backdrop-blur-xl bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-2xl border border-orange-300/50 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 via-white/20 to-orange-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <div className="relative flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              T0 = {formatValue(data?.T0_temp_mean, "°C")}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="backdrop-blur-xl bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-2xl border border-orange-300/50 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 via-white/20 to-orange-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <div className="relative flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              T1 = {formatValue(data?.T1_SET_POINT, "°C")}
            </div>
          </motion.div>
        )}

        {machineName === "GTPL-122-gT-1000T-S7-1200" ? (
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="backdrop-blur-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-2xl border border-purple-300/50 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-white/20 to-purple-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <div className="relative flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              T Delta = {formatValue(data.Delta_T_set_point || data?.Th_T1, "°C")}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="backdrop-blur-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-2xl border border-purple-300/50 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-white/20 to-purple-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <div className="relative flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              TH - T1 = {formatValue(data.AI_TH_Act || data?.Th_T1, "°C")}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* SVG Container for Silo and Lines */}
      <div className="w-full max-w-[1400px] mx-auto relative z-0">
        <div className="relative w-full h-[500px] md:h-[600px] lg:h-[650px]">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
            viewBox="0 0 1200 600"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Add animated flow effect on lines */}
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                <animate attributeName="x1" values="-100%;100%" dur="2s" repeatCount="indefinite" />
                <animate attributeName="x2" values="0%;200%" dur="2s" repeatCount="indefinite" />
              </linearGradient>
            </defs>
            {/* Silo using provided code - Enhanced */}
            <g filter="url(#shadow)">
              <defs>
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                  <feOffset dx="0" dy="2" result="offsetblur"/>
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.3"/>
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <linearGradient id="siloGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="1" />
                </linearGradient>
              </defs>
              
              <ellipse
                cx="120"
                cy="120"
                rx="50"
                ry="20"
                fill="url(#siloGradient)"
                stroke="#047857"
                strokeWidth="2.5"
                opacity="0.95"
              />
              <rect
                x="70"
                y="120"
                width="100"
                height="150"
                fill="url(#siloGradient)"
                stroke="#047857"
                strokeWidth="2.5"
                opacity="0.95"
              />
              <ellipse
                cx="120"
                cy="270"
                rx="50"
                ry="20"
                fill="url(#siloGradient)"
                stroke="#047857"
                strokeWidth="2.5"
                opacity="1"
              />

              {/* Horizontal lines with gradient */}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
                <line
                  key={i}
                  x1="72"
                  y1={130 + i * 12}
                  x2="168"
                  y2={130 + i * 12}
                  stroke="#6b7280"
                  strokeWidth="1.5"
                  opacity="0.6"
                />
              ))}

              {/* Silo outlet with gradient */}
              <rect
                x="115"
                y="270"
                width="10"
                height="25"
                fill="#6b7280"
                stroke="#4b5563"
                strokeWidth="1.5"
              />

              <text
                x="120"
                y="320"
                textAnchor="middle"
                className="text-sm font-bold"
                fill="#1f2937"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
              >
                SILO
              </text>
            </g>

            {/* Connecting Lines - Fixed for consistent positioning */}
            {/* Main horizontal line across the top */}
            <line
              x1="200"
              y1="120"
              x2="800"
              y2="120"
              stroke="black"
              strokeWidth="2"
            />

            {/* Diagonal line from silo to main horizontal line */}
            <line
              x1="170"
              y1="180"
              x2="200"
              y2="120"
              stroke="black"
              strokeWidth="2"
            />

            {/* Vertical drops from main line to thermometers */}
            {machineName !== "GTPL-122-gT-1000T-S7-1200" && (
              <line
                x1="280"
                y1="120"
                x2="280"
                y2="150"
                stroke="black"
                strokeWidth="2"
              />
            )}
            <line
              x1="380"
              y1="120"
              x2="380"
              y2="150"
              stroke="black"
              strokeWidth="2"
            />
            <line
              x1="480"
              y1="120"
              x2="480"
              y2="150"
              stroke="black"
              strokeWidth="2"
            />

            {/* Connection to blower */}
            <line
              x1="800"
              y1="120"
              x2="800"
              y2="150"
              stroke="black"
              strokeWidth="2"
            />
            <line
              x1="800"
              y1="500"
              x2="800"
              y2="380"
              stroke="black"
              strokeWidth="2"
            />

            {/* Lower horizontal line for HTR units */}
            <line
              x1="170"
              y1="400"
              x2="600"
              y2="400"
              stroke="black"
              strokeWidth="2"
            />

            {/* Diagonal line from silo to lower horizontal line */}
            <line
              x1="170"
              y1="240"
              x2="170"
              y2="400"
              stroke="black"
              strokeWidth="2"
            />

            {/* Vertical connections from lower line to HTR units */}
            <line
              x1="320"
              y1="400"
              x2="320"
              y2="430"
              stroke="black"
              strokeWidth="0"
            />
            <line
              x1="420"
              y1="400"
              x2="420"
              y2="430"
              stroke="black"
              strokeWidth="0"
            />
            <line
              x1="520"
              y1="400"
              x2="520"
              y2="430"
              stroke="black"
              strokeWidth="0"
            />

            {/* Line to condenser fan */}
            <line
              x1="1000"
              y1="120"
              x2="1000"
              y2="200"
              stroke="black"
              strokeWidth="0"
            />

            {/* Line to compressor - Fixed positioning */}
            <line
              x1="600"
              y1="400"
              x2="750"
              y2="500"
              stroke="black"
              strokeWidth="2"
            />
            {/* Connecting Lines - Fixed for consistent positioning - Enhanced with gradients */}
            <defs>
              <linearGradient id="pipeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1f2937" />
                <stop offset="50%" stopColor="#374151" />
                <stop offset="100%" stopColor="#1f2937" />
              </linearGradient>
            </defs>

            {/* Main horizontal line across the top */}
            <line
              x1="200"
              y1="120"
              x2="800"
              y2="120"
              stroke="url(#pipeGradient)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Diagonal line from silo to main horizontal line */}
            <line
              x1="170"
              y1="180"
              x2="200"
              y2="120"
              stroke="url(#pipeGradient)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Vertical drops from main line to thermometers */}
            {machineName !== "GTPL-122-gT-1000T-S7-1200" && (
              <line
                x1="280"
                y1="120"
                x2="280"
                y2="150"
                stroke="url(#pipeGradient)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            )}
            <line
              x1="380"
              y1="120"
              x2="380"
              y2="150"
              stroke="url(#pipeGradient)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="480"
              y1="120"
              x2="480"
              y2="150"
              stroke="url(#pipeGradient)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Connection to blower */}
            <line
              x1="800"
              y1="120"
              x2="800"
              y2="150"
              stroke="url(#pipeGradient)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="800"
              y1="500"
              x2="800"
              y2="380"
              stroke="url(#pipeGradient)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Lower horizontal line for HTR units */}
            <line
              x1="170"
              y1="400"
              x2="600"
              y2="400"
              stroke="url(#pipeGradient)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Diagonal line from silo to lower horizontal line */}
            <line
              x1="170"
              y1="240"
              x2="170"
              y2="400"
              stroke="url(#pipeGradient)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Line to compressor - Fixed positioning */}
            <line
              x1="600"
              y1="400"
              x2="750"
              y2="500"
              stroke="url(#pipeGradient)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          {/* Thermometers - Modernized with glassmorphism and animations */}
          {machineName !== "GTPL-122-gT-1000T-S7-1200" && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className="absolute" 
              style={{ left: "20%", top: "35%" }}
            >
              <div className="w-14 h-40 backdrop-blur-xl bg-gradient-to-b from-pink-500/80 via-red-500/80 to-red-600/90 border-2 border-red-300/50 rounded-2xl relative shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent rounded-2xl"></div>
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-red-400/0 via-red-400/20 to-red-600/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Centered text labels */}
                <div className="relative z-10 text-sm font-bold p-1 text-center w-full text-white drop-shadow-lg">
                  TH
                </div>
                <div className="relative z-10 text-xs font-bold p-1 text-center w-full text-white drop-shadow-lg">
                  {formatValue(
                    data.AI_TH_Act || data?.AFTER_HEATER_TEMP_Th,
                    "°C"
                  )}
                </div>

                {/* Temperature indicator bars with pulse animation */}
                <div className="absolute bottom-1 left-1 right-1 h-3 bg-white/90 rounded-full shadow-lg animate-pulse"></div>
                <div className="absolute bottom-6 left-1 right-1 h-3 bg-white/80 rounded-full shadow-lg"></div>
                <div className="absolute bottom-11 left-1 right-1 h-3 bg-white/70 rounded-full shadow-lg"></div>
                <div className="absolute bottom-16 left-1 right-1 h-3 bg-white/60 rounded-full shadow-lg"></div>
              </div>
            </motion.div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            className="absolute" 
            style={{ left: "28%", top: "35%" }}
          >
            <div className="w-14 h-40 backdrop-blur-xl bg-gradient-to-b from-cyan-400/80 via-blue-500/80 to-blue-600/90 border-2 border-blue-300/50 rounded-2xl relative shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent rounded-2xl"></div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/0 via-blue-400/20 to-blue-600/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10 text-sm font-bold p-1 text-center text-white drop-shadow-lg">T0</div>
              <div className="relative z-10 text-xs font-bold p-1 text-center text-white drop-shadow-lg">
                {formatValue(
                  data.AIR_OUTLET_TEMP || data?.T0_temp_mean,
                  "°C"
                )}
              </div>

              {/* Temperature indicator bars */}
              <div className="absolute bottom-1 left-1 right-1 h-3 bg-white/90 rounded-full shadow-lg animate-pulse"></div>
              <div className="absolute bottom-6 left-1 right-1 h-3 bg-white/80 rounded-full shadow-lg"></div>
              <div className="absolute bottom-11 left-1 right-1 h-3 bg-white/70 rounded-full shadow-lg"></div>
              <div className="absolute bottom-16 left-1 right-1 h-3 bg-white/60 rounded-full shadow-lg"></div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className="absolute" 
            style={{ left: "36%", top: "35%" }}
          >
            <div className="w-14 h-40 backdrop-blur-xl bg-gradient-to-b from-cyan-400/80 via-blue-500/80 to-blue-600/90 border-2 border-blue-300/50 rounded-2xl relative shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent rounded-2xl"></div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/0 via-blue-400/20 to-blue-600/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10 text-sm font-bold p-1 text-center text-white drop-shadow-lg">T1</div>
              <div className="relative z-10 text-xs font-bold p-1 text-center text-white drop-shadow-lg">
                {formatValue(
                  data?.COLD_AIR_TEMP_T1 || data?.T1_temp_mean,
                  "°C"
                )}
              </div>

              {/* Temperature indicator bars */}
              <div className="absolute bottom-1 left-1 right-1 h-3 bg-white/90 rounded-full shadow-lg animate-pulse"></div>
              <div className="absolute bottom-6 left-1 right-1 h-3 bg-white/80 rounded-full shadow-lg"></div>
              <div className="absolute bottom-11 left-1 right-1 h-3 bg-white/70 rounded-full shadow-lg"></div>
              <div className="absolute bottom-16 left-1 right-1 h-3 bg-white/60 rounded-full shadow-lg"></div>
            </div>
          </motion.div>

          {/* T2 Temperature Display - Modernized */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.1 }}
            className="absolute" 
            style={{ left: "45%", top: "40%" }}
          >
            <div className="backdrop-blur-xl bg-gradient-to-br from-amber-500/80 to-orange-600/80 text-white px-4 py-3 rounded-2xl shadow-2xl border border-amber-300/50 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 via-orange-400/20 to-orange-600/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10 text-center">
                <div className="text-lg font-bold drop-shadow-lg">T2</div>
                <div className="text-sm font-semibold drop-shadow-lg">
                  {formatValue(data?.T2_temp_mean || data?.AMBIENT_AIR_TEMP_T2) ||
                    "N/A"}
                  °C
                </div>
              </div>
            </div>
          </motion.div>

          {/* HTR Units - Modernized with glassmorphism and animations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="absolute flex gap-4"
            style={{ left: "20%", top: "62%" }}
          >
            {machineName !== "GTPL-122-gT-1000T-S7-1200" && (
              <motion.div 
                whileHover={{ scale: 1.1, y: -5 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="backdrop-blur-xl bg-gradient-to-br from-red-500/90 to-red-600/90 text-white px-4 py-4 text-center rounded-2xl shadow-2xl border border-red-300/50 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-red-400/0 via-red-400/20 to-red-600/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="text-xs font-bold drop-shadow-lg">HTR</div>
                  <div className="text-sm font-bold drop-shadow-lg">
                    {formatValue(data.Value_to_Display_HEATER, "%")}
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div 
              whileHover={{ scale: 1.1, y: -5 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="backdrop-blur-xl bg-gradient-to-br from-red-500/90 to-red-600/90 text-white px-4 py-4 text-center rounded-2xl shadow-2xl border border-red-300/50 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-red-400/0 via-red-400/20 to-red-600/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="text-xs font-bold drop-shadow-lg">AHT</div>
                <div className="text-sm font-bold drop-shadow-lg">
                  {formatValue(
                    data.Value_to_Display_AHT_VALE_OPEN ||
                      data.AFTER_HEAT_VALVE_RPM ||
                      data?.AHT_vale_speed,
                    "%"
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.1, y: -5 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="backdrop-blur-xl bg-gradient-to-br from-red-500/90 to-red-600/90 text-white px-4 py-4 text-center rounded-2xl shadow-2xl border border-red-300/50 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-red-400/0 via-red-400/20 to-red-600/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="text-xs font-bold drop-shadow-lg">HGS</div>
                <div className="text-sm font-bold drop-shadow-lg">
                  {formatValue(
                    data.Value_to_Display_HOT_GAS_VALVE_OPEN ||
                      data?.HOT_GAS_VALVE_RPM ||
                      data?.Hot_valve_speed,
                    "%"
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Blower Unit - Modernized with spinning animation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            className="absolute" 
            style={{ left: "60%", top: "70%" }}
          >
            <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 px-4 py-3 text-center rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 via-blue-400/10 to-blue-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="relative w-16 h-16 mx-auto">
                  <img
                    src="https://www.thumbsfrog.com/1046553/pages/low-pressure-blower-image-1695819922-1046553.jpg"
                    alt="Blower"
                    className="w-full h-full object-contain animate-spin"
                    style={{ animationDuration: '3s' }}
                  />
                </div>
                <div className="text-xs font-bold mt-2 text-gray-800 dark:text-gray-200">BLOWER</div>
                <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {formatValue(
                    data?.Blower_speed ||
                      data?.BLOWER_RPM ||
                      data?.Value_to_Display_BLOWER,
                    "%"
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Condenser Fan - Modernized with spinning animation */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="absolute" 
            style={{ left: "63%", top: "35%" }}
          >
            <div className="w-14 h-36 backdrop-blur-xl bg-gradient-to-b from-pink-500/80 via-red-500/80 to-red-600/90 border-2 border-red-300/50 rounded-2xl relative shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent rounded-2xl"></div>
              
              <div className="absolute bottom-1 left-1 right-1 h-3 bg-white/90 rounded-full shadow-lg"></div>
              <div className="absolute top-2 right-2">
                <div className="w-3 h-3 bg-white rounded-full shadow-lg animate-pulse"></div>
              </div>
              <div className="absolute -right-30 top-1/2 transform -translate-y-1/2">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center"
                >
                  <div className="w-full h-full rounded-full flex items-center justify-center ml-2">
                    <Image
                      src={
                        machineName === "GTPL-122-gT-1000T-S7-1200"
                          ? Fan1200
                          : Fan
                      }
                      alt="Fan"
                      className="w-20 h-20 object-contain animate-spin"
                      style={{ animationDuration: '2s' }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="absolute -bottom-12 left-20 transform -translate-x-1/2 text-center backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 px-3 py-2 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="text-xs font-bold text-gray-800 dark:text-gray-200">Condensor</div>
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                {formatValue(data.Value_to_Display_COND_ACT_SPEED || data?.CONDENSER_RPM, "%")}
              </div>
            </motion.div>
          </motion.div>

          {/* Compressor Unit - Fixed positioning */}
          <div className="absolute" style={{ left: "74%", top: "72%" }}>
            <div className="w-20 h-12 rounded relative">
              <img
                src="https://tse2.mm.bing.net/th/id/OIP.I6O7E9W-F27nxBsa_GZ35wAAAA?r=0&w=370&h=370&rs=1&pid=ImgDetMain&cb=idpwebp2&o=7&rm=3"
                className="w-40 h-20 object-contain"
                alt="Compressor"
              />
            </div>
            <div className="absolute -bottom-8 bg-red-600 text-white px-2 py-1 text-center rounded text-xs left-1/2 transform -translate-x-1/2">
              <div className="font-bold">
                {formatValue(
                  data?.COMPRESSOR_TIME || data?.Compressor_timer,
                  "%"
                )}
              </div>
            </div>
          </div>

          {/* Compressor Unit - Modernized */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="absolute" 
            style={{ left: "74%", top: "72%" }}
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 p-3 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 via-purple-400/10 to-purple-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10 w-20 h-12 rounded">
                <img
                  src="https://tse2.mm.bing.net/th/id/OIP.I6O7E9W-F27nxBsa_GZ35wAAAA?r=0&w=370&h=370&rs=1&pid=ImgDetMain&cb=idpwebp2&o=7&rm=3"
                  className="w-40 h-20 object-contain"
                  alt="Compressor"
                />
              </div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="absolute -bottom-8 backdrop-blur-xl bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 text-center rounded-xl shadow-lg text-xs left-1/2 transform -translate-x-1/2 border border-red-300/50"
              >
                <div className="font-bold drop-shadow-lg">
                  {formatValue(
                    data?.COMPRESSOR_TIME || data?.Compressor_timer,
                    "%"
                  )}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Pressure Readings - Modernized with gradient cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="absolute flex gap-3"
            style={{ right: "17%", bottom: "2%" }}
          >
            <motion.div 
              whileHover={{ scale: 1.1, y: -5 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="backdrop-blur-xl bg-gradient-to-br from-orange-500/90 to-red-600/90 text-white px-4 py-3 rounded-2xl text-xs font-bold shadow-2xl border border-orange-300/50 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/0 via-red-400/20 to-red-600/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10 text-center">
                <div className="drop-shadow-lg">HP</div>
                <div className="drop-shadow-lg">
                  {formatValue(
                    data.AI_COND_PRESSURE ||
                      data?.HP ||
                      data?.COMPRESSOR_TIME ||
                      data?.HP_value
                  )}
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.1, y: -5 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/90 to-blue-600/90 text-white px-4 py-3 rounded-2xl text-xs font-bold shadow-2xl border border-cyan-300/50 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 via-blue-400/20 to-blue-600/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10 text-center">
                <div className="drop-shadow-lg">LP</div>
                <div className="drop-shadow-lg">
                  {formatValue(data.AI_SUC_PRESSURE || data?.LP || data?.LP_value)}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
