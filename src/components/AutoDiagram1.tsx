import Image from "next/image";
import Fan1200 from "../../public/images/fan.jpg";
import Fan from "../../public/images/fan.png";
import Fan1 from "../../public/images/124.png";
import { usePathname } from "next/navigation";

import { useEffect, useState } from "react";

export default function AutoDiagram1({
  blower,
  data,
  formatValue,
  machineName,
}: any) {
  const pathname = usePathname();
  const isGrainChilling = pathname.includes("auto-grain");
  const isPaddyChilling = pathname.includes("auto-paddy");
  const getSiloColor = (temp: number) => {
    return "#10b981"; // Green color
  };

  const status = {
    TS1: 35,
  };

  const [compressorTime, setCompressorTime] = useState<number | null>(null);

  useEffect(() => {
    const rawValue = data?.COMPRESSOR_TIME || data?.Compressor_timer;
    const parsed = parseFloat(rawValue);

    if (!isNaN(parsed)) {
      setCompressorTime(parsed);
    }
  }, [data?.COMPRESSOR_TIME, data?.Compressor_timer]);

  useEffect(() => {
    if (compressorTime === null) return;

    const interval = setInterval(() => {
      setCompressorTime((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000); // decrement every second

    return () => clearInterval(interval);
  }, [compressorTime]);

  // Helper function to check if a value represents "true"
  const isTrueValue = (value: any) => {
    if (!value) return false;
    const normalizedValue = String(value).toLowerCase();
    return (
      normalizedValue === "true" ||
      normalizedValue === "tr" ||
      normalizedValue === "True"
    );
  };

  // Green light conditions
  const greenLightFields = [
    "GREEN_LIGHT",
    "Chiller_healthy_(Q1.1)",
    "Chiller_healthy_on_Q1_1",
    "Chiller_healthy_on",
    "Chiller_healthy",
  ];

  // Red light conditions
  const redLightFields = [
    "RED_LIGHT",
    "Chiller_fault_(Q2.3)",
    "Chiller_Fault_on_Q2_0",
    "Chiller_Fault_on",
    "Chiller_Fault",
    "Chiller_fault_Q2_3",
  ];

  // Yellow light conditions
  const yellowLightFields = [
    "YELLOW_LIGHT",
    "System_warnning_(Q1.0)",
    "Collective_Trouble_Signal_on_Q2_1",
    "Collective_Trouble_Signal_on",
    "Collective_Trouble_Signal",
    "Collective_trouble_signal_Q1_0",
  ];

  // Check conditions
  const greenOn = greenLightFields.some((field) => isTrueValue(data?.[field]));
  const redOn = redLightFields.some((field) => isTrueValue(data?.[field]));
  const yellowOn = yellowLightFields.some((field) =>
    isTrueValue(data?.[field])
  );

  // Alternative: One-liner version if you prefer
  const checkTrueValue = (val: any) =>
    val && ["true", "tr", "True"].includes(String(val).toLowerCase());

  const greenOnAlt = greenLightFields.some((field) =>
    checkTrueValue(data?.[field])
  );
  const redOnAlt = redLightFields.some((field) =>
    checkTrueValue(data?.[field])
  );
  const yellowOnAlt = yellowLightFields.some((field) =>
    checkTrueValue(data?.[field])
  );

  // Helper for lamp color
  const lampColor = (on: boolean, color: string) => (on ? color : "#d1d5db");

  const isCompressorOn =
    data?.COMPRESSOR_ON === "tr" ||
    data?.Compressor_on_Q0_4 === "True" ||
    data?.Compressor_start === "True" ||
    data?.COMPRESSOR_ON === "True";

  return (
    <div className="w-full h-screen bg-gray-100 overflow-auto">
      {/* Fixed container that maintains layout */}
      <div
        className="relative bg-gray-100"
        style={{
          minWidth: "1200px",
          minHeight: "800px",
          width: "max(100vw, 1200px)",
          height: "max(100vh, 800px)",
        }}
      >
        {/* Status Indicators - Fixed to container */}
        <div className="absolute top-4 left-[30rem] flex gap-4 items-center z-10">
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

        {/* Temperature Display Boxes - Fixed to container */}
        <div className="absolute top-4 right-[35rem] space-y-2 z-10">
          {[
            "GTPL-122-gT-1000T-S7-1200",
            "GTPL-121-gT-1000T-S7-1200",
            "GTPL-124-GT-450T-S7-1200",
            "GTPL-132-300-AP-300-S7-1200",
          ].some((name) => machineName.includes(name)) ? (
            <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">
              T0 ={" "}
              {isGrainChilling
                ? formatValue(
                    data?.T0_set_point ||
                      data?.AIR_OUTLET_TEMP ||
                      data?.T1_set_point_in_grain_chilling_mode,
                    "°C"
                  )
                : isPaddyChilling
                  ? formatValue(
                      data?.T0_set_point ||
                        data?.AIR_OUTLET_TEMP ||
                        data?.T1_set_point_in_paddy_aeging_mode,
                      "°C"
                    )
                  : formatValue(
                      data?.T0_set_point ||
                        data?.AIR_OUTLET_TEMP ||
                        data?.T1_set_point_in_paddy_aeging_mode,
                      "°C"
                    )}
            </div>
          ) : (
            <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">
              T1 ={" "}
              {formatValue(
                data?.T1_set_point ||
                  data?.T1_temp_mean ||
                  data?.T1_SET_POINT ||
                  data?.Delta_T_set_point_paddy_aeging_mode,
                "°C"
              )}
            </div>
          )}

          {[
            "GTPL-122-gT-1000T-S7-1200",
            "GTPL-121-gT-1000T-S7-1200",
            "GTPL-124-GT-450T-S7-1200",
            "GTPL-132-300-AP-300-S7-1200",
          ].some((name) => machineName.includes(name)) ? (
            <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">
              T Delta ={" "}
              {isGrainChilling
                ? formatValue(
                    data.Delta_T_set_point ||
                      data?.Th_T1 ||
                      data?.Delta_T_set_point_in_grain_chilling_mode,
                    "°C"
                  )
                : isPaddyChilling
                  ? formatValue(
                      data.Delta_T_set_point ||
                        data?.Th_T1 ||
                        data?.
Delta_T_set_point_paddy_aeging_mode,
                      "°C"
                    )
                  : formatValue(
                      data.Delta_T_set_point ||
                        data?.Th_T1 ||
                        data?.Delta_T_set_point_in_grain_chilling_mode ||
                        data?.
Delta_T_set_point_paddy_aeging_mode,
                      "°C"
                    )}
            </div>
          ) : (
            <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">
              TH - T1 ={" "}
              {formatValue(
                data.AI_TH_Act || data?.Th_T1 || data?.TH_T1_set_point,
                "°C"
              )}
            </div>
          )}
        </div>

        {/* Main Dashboard Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full max-w-[1200px] h-[600px]">
            {/* SVG Container for Silo and Lines */}
            <svg
              className="absolute inset-0 w-full h-full"
              style={{ zIndex: 1 }}
              viewBox="0 0 1200 600"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Silo */}
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
                <rect
                  x="115"
                  y="270"
                  width="10"
                  height="25"
                  fill="#9ca3af"
                  stroke="#6b7280"
                  strokeWidth="1"
                />
                <text
                  x="120"
                  y="320"
                  textAnchor="middle"
                  className="text-sm font-bold fill-gray-800"
                >
                  SILO
                </text>
              </g>

              {/* Connecting Lines */}
              <line
                x1="200"
                y1="120"
                x2="800"
                y2="120"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="170"
                y1="180"
                x2="200"
                y2="120"
                stroke="black"
                strokeWidth="2"
              />

              {/* Vertical drops from main line to thermometers */}
              {![
                "GTPL-122-gT-1000T-S7-1200",
                "GTPL-121-gT-1000T-S7-1200",
                "GTPL-124-GT-450T-S7-1200",
                "GTPL-132-300-AP-300-S7-1200",
              ].some((name) => machineName.includes(name)) && (
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
              <line
                x1="170"
                y1="240"
                x2="170"
                y2="400"
                stroke="black"
                strokeWidth="2"
              />

              {/* Line to compressor */}
              <line
                x1="600"
                y1="400"
                x2="750"
                y2="500"
                stroke="black"
                strokeWidth="2"
              />
            </svg>

            {/* Thermometers - Fixed positioning */}
            {![
              "GTPL-122-gT-1000T-S7-1200",
              "GTPL-121-gT-1000T-S7-1200",
              "GTPL-124-GT-450T-S7-1200",
              "GTPL-132-300-AP-300-S7-1200",
            ].some((name) => machineName.includes(name)) && (
              <div
                className="absolute z-10"
                style={{
                  left: "calc(980px * 100% / 1200px)",
                  top: "calc(270px * 100% / 600px)",
                  transform: "translateX(535%)",
                }}
              >
                <div className="w-12 mt-36 h-64 bg-pink-200 border-2 border-red-300 rounded-lg relative">
                  <div className="absolute inset-1 bg-gradient-to-b from-transparent via-pink-300 to-red-400 rounded"></div>
                  <div className="text-xs font-bold p-1 text-center w-full">
                    TH
                  </div>
                  <div className="text-xs font-bold p-1 text-center w-full">
                    {formatValue(
                      data.AI_TH_Act ||
                        data?.AFTER_HEATER_TEMP_Th ||
                        data?.TH_temp_mean,
                      "°C"
                    )}
                  </div>
                  <div className="absolute bottom-1 left-1 right-1 h-2 bg-red-500 rounded-full"></div>
                  <div className="absolute bottom-4 left-1 right-1 h-2 bg-red-500 rounded-full"></div>
                  <div className="absolute bottom-7 left-1 right-1 h-2 bg-red-500 rounded-full"></div>
                  <div className="absolute bottom-10 left-1 right-1 h-2 bg-red-500 rounded-full"></div>
                  <div className="absolute bottom-14 left-1 right-1 h-2 bg-red-500 rounded-full"></div>
                  <div className="absolute bottom-18 left-1 right-1 h-2 bg-red-500 rounded-full"></div>
                  <div className="absolute bottom-22 left-1 right-1 h-2 bg-red-500 rounded-full"></div>
                  <div className="absolute bottom-14 left-1 right-1 h-2 bg-red-500 rounded-full"></div>
                </div>
              </div>
            )}

            <div
              className="absolute z-10"
              style={{
                left: "calc(380px * 100% / 1200px)",
                top: "calc(150px * 100% / 600px)",
                transform: "translateX(745%)",
              }}
            >
              <div className="w-12 mt-36 h-64 bg-blue-100 border-2 border-blue-300 rounded-lg relative">
                <div className="absolute inset-1 bg-gradient-to-b from-blue-200 to-blue-300 rounded">
                  <div className="text-xs font-bold p-1 text-center">T0</div>
                  <div className="text-xs p-1 text-center">
                    {formatValue(
                      data.AIR_OUTLET_TEMP || data?.T0_temp_mean,
                      "°C"
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="absolute z-10"
              style={{
                left: "calc(480px * 100% / 1200px)",
                top: "calc(150px * 100% / 600px)",
                transform: "translateX(950%)",
              }}
            >
              <div className="w-12 mt-36 h-64 bg-blue-100 border-2 border-blue-300 rounded-lg relative">
                <div className="absolute inset-1 bg-gradient-to-b from-blue-200 to-blue-300 rounded">
                  <div className="text-xs font-bold p-1 text-center">T1</div>
                  <div className="text-xs p-1 text-center">
                    {formatValue(
                      data?.COLD_AIR_TEMP_T1 ||
                        data?.T1_temp_mean ||
                        data?.T1_temp_mean,
                      "°C"
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* T2 Temperature Display */}
            <div
              className="absolute z-10 mt-[15rem] ml-12"
              style={{
                left: "calc(580px * 100% / 1200px)",
                top: "calc(200px * 100% / 600px)",
                transform: "translateX(1950%)",
              }}
            >
              <div className="text-center">
                <div className="text-lg font-bold">T2</div>
                <div className="text-sm">
                  {formatValue(
                    data?.T2_temp_mean || data?.AMBIENT_AIR_TEMP_T2
                  ) || "N/A"}
                  °C
                </div>
              </div>
            </div>

            {/* HTR Units */}
            <div
              className="absolute flex gap-14 z-10"
              style={{
                left: "calc(200px * 100% / 1200px)",
                top: "calc(430px * 100% / 600px)",
                transform: [
                  "GTPL-122-gT-1000T-S7-1200",
                  "GTPL-121-gT-1000T-S7-1200",
                  "GTPL-124-GT-450T-S7-1200",
                  "GTPL-118-gT-80E-P-S7-200",
                  "GTPL-108-gT-40E-P-S7-200",
                  "GTPL-109-gT-40E-P-S7-200",
                  "GTPL-110-gT-40E-P-S7-200",
                  "GTPL-111-gT-80E-P-S7-200",
                  "GTPL-112-gT-80E-P-S7-200",
                  "GTPL-113-gT-80E-P-S7-200",
                  'GTPL-132-300-AP-300-S7-1200'
                ].some((name) => machineName.includes(name))
                  ? "translate(230%,650%)"
                  : "translateY(620%)",
              }}
            >
              {![
                "GTPL-122-gT-1000T-S7-1200",
                "GTPL-121-gT-1000T-S7-1200",
                "GTPL-124-GT-450T-S7-1200",
                "GTPL-118-gT-80E-P-S7-200",
                "GTPL-108-gT-40E-P-S7-200",
                "GTPL-109-gT-40E-P-S7-200",
                "GTPL-110-gT-40E-P-S7-200",
                "GTPL-111-gT-80E-P-S7-200",
                "GTPL-112-gT-80E-P-S7-200",
                "GTPL-113-gT-80E-P-S7-200",
                'GTPL-132-300-AP-300-S7-1200'
              ].some((name) => machineName.includes(name)) && (
                <div className="bg-red-600 text-white px-3 ml-64 py-4 text-center rounded">
                  <div className="text-xs font-bold">HTR</div>
                  <div className="text-sm font-bold">
                    {formatValue(
                      data.Value_to_Display_HEATER || data?.Heater_speed,
                      "%"
                    )}
                  </div>
                </div>
              )}
              <div className="bg-red-600 text-white px-3 py-4 text-center rounded">
                <div className="text-xs font-bold">AHT</div>
                <div className="text-sm font-bold">
                  {formatValue(
                    data?.AHT_vale_speed ||
                      data.Value_to_Display_AHT_VALE_OPEN ||
                      data.AFTER_HEAT_VALVE_RPM ||
                      data?.AHT_valve_speed,
                    "%"
                  )}
                </div>
              </div>
              <div className="bg-red-600 text-white px-3 py-4 text-center rounded">
                <div className="text-xs font-bold">HGS</div>
                <div className="text-sm font-bold">
                  {formatValue(
                    data.Value_to_Display_HOT_GAS_VALVE_OPEN ||
                      data?.HOT_GAS_VALVE_RPM ||
                      data?.Hot_valve_speed,
                    "%"
                  )}
                </div>
              </div>
            </div>

            {/* Blower Unit */}
            <div
              className="absolute z-10"
              style={{
                left: "calc(800px * 100% / 1200px)",
                top: "calc(500px * 100% / 600px)",
                transform: "translate(750%)",
              }}
            >
              <div className="text-black px-4 py-2 text-center rounded mt-112">
                <img
                  src="https://www.thumbsfrog.com/1046553/pages/low-pressure-blower-image-1695819922-1046553.jpg"
                  alt="Blower"
                  className="w-16 h-16 object-contain mx-auto"
                />
                <div className="text-xs font-bold mt-1">BLOWER</div>
                <div className="text-sm font-bold">
                  {formatValue(
                    data?.Blower_speed ||
                      data?.BLOWER_RPM ||
                      data?.Value_to_Display_BLOWER ||
                      data?.Blower_speed,
                    "%"
                  )}
                </div>
              </div>
            </div>

            {/* Condenser Fan */}
            <div
              className="absolute z-10"
              style={{
                left: "calc(800px * 100% / 1200px)",
                top: "calc(150px * 100% / 600px)",
                transform: "translateX(1620%)",
              }}
            >
              <div className="w-12 h-64 mt-36 bg-pink-200 border-2 border-red-300 rounded-lg relative">
                <div className="absolute bottom-1 left-1 right-1 h-3 bg-red-400 rounded-full"></div>
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>

                {/* ✅ Ensure parent is relative and image wrapper is sized */}
                {machineName.includes("GTPL-124-GT-450T-S7-1200") ? (
                  // Show Fan1 if machineName contains 124
                  <div className="absolute left-16 top-[6rem] transform -translate-y-1/2">
                    <div className="w-20 h-20 relative">
                      <Image
                        src={Fan1}
                        alt="Fan1"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                ) : // Otherwise, same old logic
                [
                    "GTPL-116-gT-240E-S7-1200",
                    "GTPL-117-gT-320E-S7-1200",
                    "GTPL-122-gT-1000T-S7-1200",
                    "GTPL-121-gT-1000T-S7-1200",
                  ].some((name) => machineName.includes(name)) ? (
                  <>
                    <div className="absolute left-16 top-[6rem] transform -translate-y-1/2">
                      <div className="w-20 h-20 relative">
                        <Image
                          src={Fan1200}
                          alt="Fan"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                    {/* <div className="absolute left-16 top-[10rem] transform -translate-y-1/2">
        <div className="w-20 h-20 relative">
          <Image src={Fan} alt="Fan" fill className="object-contain" />
        </div>
      </div> */}
                  </>
                ) : (
                  <div className="absolute left-16 top-[6rem] transform -translate-y-1/2">
                    <div className="w-20 h-20 relative">
                      <Image
                        src={Fan}
                        alt="Fan"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="absolute -bottom-12 left-20 transform -translate-x-1/2 text-center">
                <div className="text-xs font-bold">Condensor</div>
                <div className="text-xs">
                  {formatValue(
                    data?.Value_to_Display_COND_ACT_SPEED ||
                      data?.CONDENSER_RPM ||
                      data?.Cond_fan_speed,
                    "%"
                  )}
                </div>
              </div>
            </div>

            {/* Compressor Unit */}
            <div
              className="absolute z-10"
              style={{
                left: "calc(900px * 100% / 1200px)",
                top: "calc(500px * 100% / 600px)",
                transform: "translate(1050%)",
              }}
            >
              <div className="w-20 h-12 rounded relative mt-[29rem]">
                <img
                  src="https://tse2.mm.bing.net/th/id/OIP.I6O7E9W-F27nxBsa_GZ35wAAAA?r=0&w=370&h=370&rs=1&pid=ImgDetMain&cb=idpwebp2&o=7&rm=3"
                  className="w-40 h-20 object-contain"
                  alt="Compressor"
                />
              </div>
              <div className="absolute -bottom-8 bg-red-600 text-white px-2 py-1 text-center rounded text-xs left-1/2 transform -translate-x-1/2">
                <div className="font-bold">
                  <span className="flex items-center gap-1">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isCompressorOn
                          ? "bg-green-500 group-hover:bg-green-600"
                          : "bg-red-500 group-hover:bg-red-600"
                      } shadow-sm transition-colors duration-300`}
                    />
                    {isCompressorOn ? "ON" : "OFF"}
                  </span>
                </div>
              </div>
            </div>

            {/* Pressure Readings */}
            <div
              className="absolute flex gap-2 flex-row z-10 mt-[36rem] ml-[29.5rem]"
              style={{
                right: "calc(200px * 100% / 1200px)",
                bottom: "calc(50px * 100% / 600px)",
                transform: "translate(520%)",
              }}
            >
              <div className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
                LP
                <br />
                {formatValue(
                  data.AI_SUC_PRESSURE || data?.LP || data?.LP_value
                )}
              </div>
              <div className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
                HP
                <br />
                {formatValue(
                  data.AI_COND_PRESSURE ||
                    data?.HP ||
                    data?.COMPRESSOR_TIME ||
                    data?.HP_value ||
                    data?.Compressor_timer
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
