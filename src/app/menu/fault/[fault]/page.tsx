"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAutoData } from "@/hooks/useAutoData";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import FaultLogsPaginated from "@/components/FaultLogsPaginated";

export default function FaultPage() {
  const [currentView, setCurrentView] = useState("faultLogs"); // 'faultCodes', 'faultLogs', 'viewFaultCode', 'allPaginatedLogs'
  const [selectedFault, setSelectedFault] = useState<any>(null);
  const router = useRouter();
  const { fault } = useParams();
  const { data, isConnected, error, formatValue } = useAutoData(
    fault as string
  );

  // S7-1200 fault codes (original codes)
  const s7_1200_faultCodes = [
    { code: 1, description: "Compressor_circuit_breaker_fault" },
    { code: 2, description: "Oil_pressure_low" },
    { code: 3, description: "Blower_drive_fault" },
    { code: 4, description: "Blower_circuit_breaker_fault" },
    { code: 5, description: "Ambient_air_sensor_1open" },
    { code: 6, description: "COND_FAN_OVERLOAD" },
    { code: 7, description: "Three_phase_monitor_fault" },
    { code: 8, description: "High_pressure_fault" },
    { code: 9, description: "Ambient_temp._lower_than_set_temp." },
    { code: 10, description: "Ambient_temp._over_50°C" },
    { code: 11, description: "COMP._MODULE_FEEDBACK_ERROR_(Si-I1)" },
    { code: 14, description: "Low_pressure_1_fault" },
    { code: 15, description: "COMP_FBK_ERROR" },
    { code: 16, description: "Low_pressure_2_fault" },
    { code: 17, description: "Ambient_temp._over_47°C" },
    { code: 18, description: "Condenser_fan_2_TOP_fault" },
    { code: 19, description: "Condenser_fan_3_TOP_fault" },
    { code: 20, description: "Condenser_fan_4_TOP_fault" },
    { code: 21, description: "Condenser_fan_2_circuit_breaker_fault" },
    { code: 22, description: "Condenser_fan_3_circuit_breaker_fault" },
    { code: 23, description: "Condenser_fan_4_circuit_breaker_fault" },
    { code: 24, description: "Condenser_fan_5_TOP_fault" },
    { code: 25, description: "Condenser_fan_6_TOP_fault" },
    { code: 26, description: "Condenser_fan_5_circuit_breaker_fault" },
    { code: 27, description: "Condenser_fan_6_circuit_breaker_fault" },
    { code: 30, description: "Condenser_fan_1_circuit_breaker_fault" },
    { code: 31, description: "Condenser_fan_1_TOP_fault" },
    { code: 32, description: "Ambient_air_sensor_1_short_circuit" },
    { code: 33, description: "Ambient_air_sensor_2_open" },
    { code: 34, description: "Ambient_air_sensor_2_short_circuit" },
    { code: 35, description: "Cold_air_sensor_1_open" },
    { code: 36, description: "Cold_air_sensor_1_short_circuit" },
    { code: 37, description: "Cold_air_sensor_2_open" },
    { code: 38, description: "Cold_air_sensor_2_short_circuit" },
    { code: 39, description: "Air_outlet_sensor_1_open" },
    { code: 40, description: "Air_outlet_sensor_1_short_circuit" },
    { code: 41, description: "Air_outlet_sensor_2_open" },
    { code: 42, description: "Air_outlet_sensor_2_short_circuit" },
  ];
  

  // S7-200 fault codes
  const s7_200_faultCodes = [
    { code: 1, description: "Compressor circuit breaker fault" },
    { code: 2, description: "Condenser fan door open" },
    { code: 3, description: "Blower drive fault" },
    { code: 4, description: "Blower circuit breaker fault" },
    { code: 6, description: "Heater circuit breaker fault" },
    { code: 7, description: "Three phase monitor fault" },
    { code: 8, description: "Low Pressure Fault" },
    { code: 9, description: "Ambient temp lower than set temp" },
    { code: 10, description: "Ambient temp. Over 43°C" },
    { code: 12, description: "Heater RCCB fault" },
    { code: 13, description: "Cond Fan circuit breaker fault" },
    { code: 14, description: "Low pressure fault : Locked" },
    { code: 15, description: "Anti Freeze Protection" },
    { code: 16, description: "High pressure fault : Locked" },
    { code: 17, description: "Ambient temp. Over 40°C" },
    { code: 18, description: "Ambient temp. Less than 4°C" },
    { code: 19, description: "Cond Fan TOP" },
    { code: 23, description: "Ambient Temp Sensor T2 Open" },
    { code: 24, description: "Ambient Temp Sensor T2 Short Circuit" },
    { code: 27, description: "Air Outlet Temp Sensor T0 Open" },
    { code: 28, description: "Air Outlet Temp Sensor T0 Short Circuit" },
    { code: 31, description: "Cold Air Temp Sensor T1 Open" },
    { code: 32, description: "Cold Air Temp Sensor T1 short circuit" },
    { code: 35, description: "Air After Heater Temp Sensor TH Open" },
    { code: 36, description: "Air After Heater Temp Sensor TH short circuit" },
    { code: 39, description: "High Pressure Fault" },
    { code: 41, description: "Heater TOP fault" },
    { code: 44, description: "TH Air After Heater Temp more than 50 °C" },
    {
      code: 45,
      description: "Warning : Delta value not achieved in aeration mode",
    },
    { code: 48, description: "Warning : LP transducer failure" },
    { code: 49, description: "Warning : HP transducer failure" },
  ];

  // S7-200 Tags with boolean values from useAutoData hook
  const s7_200_tags = [
    // { tag: "AERATION_MODE_WITH_HEAT", value: data?.AERATION_MODE_WITH_HEAT },
    // {
    //   tag: "AERATION_MODE_WITHOUT_HEAT",
    //   value: data?.AERATION_MODE_WITHOUT_HEAT,
    // },
    // {
    //   tag: "AERATION_WITH_HEATER_START",
    //   value: data?.AERATION_WITH_HEATER_START,
    // },
    // {
    //   tag: "AERATION_WITH_HEATER_STOP",
    //   value: data?.AERATION_WITH_HEATER_STOP,
    // },
    // {
    //   tag: "AERATION_WITHOUT_HEATER_START",
    //   value: data?.AERATION_WITHOUT_HEATER_START,
    // },
    // {
    //   tag: "AERATION_WITHOUT_HEATER_STOP",
    //   value: data?.AERATION_WITHOUT_HEATER_STOP,
    // },
    {
      tag: "AFTER_HEAT_TEMP_MORE_THAN_50",
      value: data?.AFTER_HEAT_TEMP_MORE_THAN_50,
    },
    {
      tag: "AFTER_HEAT_TEMP_SENSOR_TH_OPEN",
      value: data?.AFTER_HEAT_TEMP_SENSOR_TH_OPEN,
    },
    {
      tag: "AFTER_HEAT_TEMP_SENSOR_TH_SHORT_CIRCUIT",
      value: data?.AFTER_HEAT_TEMP_SENSOR_TH_SHORT_CIRCUIT,
    },
    // { tag: "AFTER_HEAT_VALVE_ON", value: data?.AFTER_HEAT_VALVE_ON },
    // { tag: "AHT_START_MANUAL_MODE", value: data?.AHT_START_MANUAL_MODE },
    // { tag: "AHT_STOP_MANUAL_MODE", value: data?.AHT_STOP_MANUAL_MODE },
    {
      tag: "AIR_OUTLET_TEMP_SENSOR_T0_OPEN",
      value: data?.AIR_OUTLET_TEMP_SENSOR_T0_OPEN,
    },
    {
      tag: "AIR_OUTLET_TEMP_SENSOR_T0_SHORT_CIRCUIT",
      value: data?.AIR_OUTLET_TEMP_SENSOR_T0_SHORT_CIRCUIT,
    },
    { tag: "AMBIENT_TEMP_LESS_THAN_4", value: data?.AMBIENT_TEMP_LESS_THAN_4 },
    {
      tag: "AMBIENT_TEMP_LOW_THAN_SET_TEMP",
      value: data?.AMBIENT_TEMP_LOW_THAN_SET_TEMP,
    },
    { tag: "AMBIENT_TEMP_OVER_40", value: data?.AMBIENT_TEMP_OVER_40 },
    { tag: "AMBIENT_TEMP_OVER_43", value: data?.AMBIENT_TEMP_OVER_43 },
    {
      tag: "AMBIENT_TEMP_SENSOR_T2_OPEN",
      value: data?.AMBIENT_TEMP_SENSOR_T2_OPEN,
    },
    {
      tag: "AMBIENT_TEMP_SENSOR_T2_SHORT_CIRCUIT",
      value: data?.AMBIENT_TEMP_SENSOR_T2_SHORT_CIRCUIT,
    },
    // { tag: "ANTI_FREEZE_PROTECTION", value: data?.ANTI_FREEZE_PROTECTION },
    // { tag: "AUTO_AERATION_ENABLE", value: data?.AUTO_AERATION_ENABLE },
    // { tag: "AUTO_EN", value: data?.AUTO_EN },
    // { tag: "AUTO_PROCESS_PB", value: data?.AUTO_PROCESS_PB },
    // { tag: "AUTO_PROCESS_STOP_PB", value: data?.AUTO_PROCESS_STOP_PB },
    {
      tag: "BLOWER_CIRCUIT_BREAKER_FAULT",
      value: data?.BLOWER_CIRCUIT_BREAKER_FAULT,
    },
    // { tag: "BLOWER_DRIVE_ENABLE", value: data?.BLOWER_DRIVE_ENABLE },
    { tag: "BLOWER_DRIVE_FAULT", value: data?.BLOWER_DRIVE_FAULT },
    // { tag: "BLOWER_DRIVE_ON", value: data?.BLOWER_DRIVE_ON },
    // { tag: "BLOWER_START_MANUAL_MOD", value: data?.BLOWER_START_MANUAL_MOD },
    // { tag: "BLOWER_STOP_MANUAL_MODE", value: data?.BLOWER_STOP_MANUAL_MODE },
    // { tag: "BUZZER_ON", value: data?.BUZZER_ON },
    { tag: "C0ND_FAN_TOP", value: data?.C0ND_FAN_TOP },
    {
      tag: "COLD_AIR_TEMP_SENSOR_T1_OPEN",
      value: data?.COLD_AIR_TEMP_SENSOR_T1_OPEN,
    },
    {
      tag: "COLD_AIR_TEMP_SENSOR_T1_SHORT_CIRCUIT",
      value: data?.COLD_AIR_TEMP_SENSOR_T1_SHORT_CIRCUIT,
    },
    {
      tag: "COMPRESSOR_CIRCUIT_BREA_FAULT",
      value: data?.COMPRESSOR_CIRCUIT_BREA_FAULT,
    },
    // { tag: "COMPRESSOR_ON", value: data?.COMPRESSOR_ON },
    // { tag: "COMPRESSOR_START_MANUAL", value: data?.COMPRESSOR_START_MANUAL },
    // { tag: "COMPRESSOR_STOP_MANUAL", value: data?.COMPRESSOR_STOP_MANUAL },
    // { tag: "COMPRESSOR_VISIBLE", value: data?.COMPRESSOR_VISIBLE },
    {
      tag: "COND_FAN_CIRCUIT_BREAKE_FAULT",
      value: data?.COND_FAN_CIRCUIT_BREAKE_FAULT,
    },
    // { tag: "COND_FAN_MOTOR_OVERHEAT", value: data?.COND_FAN_MOTOR_OVERHEAT },
    // { tag: "cond_fan_on", value: data?.cond_fan_on },
    // { tag: "COND_FAN_START_MANUAL_M", value: data?.COND_FAN_START_MANUAL_M },
    // { tag: "COND_FAN_STOP_MANUAL_M", value: data?.COND_FAN_STOP_MANUAL_M },
    { tag: "CONDENSER_FAN_DOOR_OPEN", value: data?.CONDENSER_FAN_DOOR_OPEN },
    // { tag: "CONTINUOUS_MODE", value: data?.CONTINUOUS_MODE },
    // { tag: "FAULT_RESET", value: data?.FAULT_RESET },
    // { tag: "GREEN_LIGHT", value: data?.GREEN_LIGHT },
    {
      tag: "HEATER_CIRCUIT_BREAKER_FAULT",
      value: data?.HEATER_CIRCUIT_BREAKER_FAULT,
    },
    // { tag: "HEATER_OVER_HEAT", value: data?.HEATER_OVER_HEAT },
    { tag: "HEATER_RCCCB_TRIP_FAULT", value: data?.HEATER_RCCCB_TRIP_FAULT },
    // { tag: "HEATER_START_MANUAL", value: data?.HEATER_START_MANUAL },
    // { tag: "HEATER_STOP_MANUAL", value: data?.HEATER_STOP_MANUAL },
    { tag: "HEATER_TOP_FAULT", value: data?.HEATER_TOP_FAULT },
    { tag: "HIGH_PRESSURE_FAULT", value: data?.HIGH_PRESSURE_FAULT },
    {
      tag: "HIGH_PRESSURE_FAULT_LOCKED",
      value: data?.HIGH_PRESSURE_FAULT_LOCKED,
    },
    // { tag: "HOT_GAS_VALVE_ON", value: data?.HOT_GAS_VALVE_ON },
    // { tag: "HOT_GAS_VALVE_START_MAN", value: data?.HOT_GAS_VALVE_START_MAN },
    // { tag: "HOT_GAS_VALVE_STOP_MAN", value: data?.HOT_GAS_VALVE_STOP_MAN },
    { tag: "HP_TRANSDUCEER_FAILURE", value: data?.HP_TRANSDUCEER_FAILURE },
    { tag: "LOW_PRESSURE_FAULT", value: data?.LOW_PRESSURE_FAULT },
    {
      tag: "LOW_PRESSURE_FAULT_LOCKED",
      value: data?.LOW_PRESSURE_FAULT_LOCKED,
    },
    { tag: "LP_TRANSDUCER_FAILURE", value: data?.LP_TRANSDUCER_FAILURE },
    // { tag: "MANUAL_EN", value: data?.MANUAL_EN },
    // { tag: "OPERATING_HOURS_RESET", value: data?.OPERATING_HOURS_RESET },
    {
      tag: "SET_POINT_NOT_ACHIEVED_IN_AERATION_MODE",
      value: data?.SET_POINT_NOT_ACHIEVED_IN_AERATION_MODE,
    },
    // { tag: "SET_TIME", value: data?.SET_TIME },
    {
      tag: "THREE_PHASE_MONITORING_FAULT",
      value: data?.THREE_PHASE_MONITORING_FAULT,
    },
    // { tag: "YELLOW_LIGHT", value: data?.YELLOW_LIGHT },
    { tag: "created_at", value: data?.created_at },
  ];

  const s7_1200_tags = [
    { tag: "COMPRESSOR_CIRCUIT_BREAKER_FAULT", value: data?.Compressor_circuit_breaker_fault },
    { tag: "OIL_PRESSURE_LOW", value: data?.Oil_pressure_low },
    { tag: "BLOWER_DRIVE_FAULT", value: data?.Blower_drive_fault },
    { tag: "BLOWER_CIRCUIT_BREAKER_FAULT", value: data?.Blower_circuit_breaker_fault },
    { tag: "AMBIENT_AIR_SENSOR_1_OPEN", value: data?.AMBIENT_AIR_SENSOR_1_OPEN },
    { tag: "COND_FAN_OVERLOAD", value: data?.COND_FAN_OVERLOAD },
    { tag: "THREE_PHASE_MONITOR_FAULT", value: data?.Three_phase_monitor_fault },
    { tag: "HIGH_PRESSURE_FAULT", value: data?.High_pressure_fault },
    { tag: "AMBIENT_TEMP_LOWER_THAN_SET_TEMP", value: data?.AMBIENT_TEMP_LOWER_THAN_SET_TEMP },
    { tag: "AMBIENT_TEMP_OVER_50C", value: data?.AMBIENT_TEMP_OVER_50C },
    { tag: "COMP_MODULE_FEEDBACK_ERROR", value: data?.COMP_MODULE_FEEDBACK_ERROR },
    { tag: "LOW_PRESSURE_1_FAULT", value: data?.LOW_PRESSURE_1_FAULT },
    { tag: "COMP_FBK_ERROR", value: data?.COMP_FBK_ERROR },
    { tag: "LOW_PRESSURE_2_FAULT", value: data?.LOW_PRESSURE_2_FAULT },
    { tag: "AMBIENT_TEMP_OVER_47C", value: data?.AMBIENT_TEMP_OVER_47C },
    { tag: "CONDENSER_FAN_2_TOP_FAULT", value: data?.CONDENSER_FAN_2_TOP_FAULT },
    { tag: "CONDENSER_FAN_3_TOP_FAULT", value: data?.CONDENSER_FAN_3_TOP_FAULT },
    { tag: "CONDENSER_FAN_4_TOP_FAULT", value: data?.CONDENSER_FAN_4_TOP_FAULT },
    { tag: "CONDENSER_FAN_2_CB_FAULT", value: data?.CONDENSER_FAN_2_CB_FAULT },
    { tag: "CONDENSER_FAN_3_CB_FAULT", value: data?.CONDENSER_FAN_3_CB_FAULT },
    { tag: "CONDENSER_FAN_4_CB_FAULT", value: data?.CONDENSER_FAN_4_CB_FAULT },
    { tag: "CONDENSER_FAN_5_TOP_FAULT", value: data?.CONDENSER_FAN_5_TOP_FAULT },
    { tag: "CONDENSER_FAN_6_TOP_FAULT", value: data?.CONDENSER_FAN_6_TOP_FAULT },
    { tag: "CONDENSER_FAN_5_CB_FAULT", value: data?.CONDENSER_FAN_5_CB_FAULT },
    { tag: "CONDENSER_FAN_6_CB_FAULT", value: data?.CONDENSER_FAN_6_CB_FAULT },
    { tag: "CONDENSER_FAN_1_CB_FAULT", value: data?.CONDENSER_FAN_1_CB_FAULT },
    { tag: "CONDENSER_FAN_1_TOP_FAULT", value: data?.CONDENSER_FAN_1_TOP_FAULT },
    { tag: "AMBIENT_AIR_SENSOR_1_SHORT", value: data?.AMBIENT_AIR_SENSOR_1_SHORT },
    { tag: "AMBIENT_AIR_SENSOR_2_OPEN", value: data?.AMBIENT_AIR_SENSOR_2_OPEN },
    { tag: "AMBIENT_AIR_SENSOR_2_SHORT", value: data?.AMBIENT_AIR_SENSOR_2_SHORT },
    { tag: "COLD_AIR_SENSOR_1_OPEN", value: data?.COLD_AIR_SENSOR_1_OPEN },
    { tag: "COLD_AIR_SENSOR_1_SHORT", value: data?.COLD_AIR_SENSOR_1_SHORT },
    { tag: "COLD_AIR_SENSOR_2_OPEN", value: data?.COLD_AIR_SENSOR_2_OPEN },
    { tag: "COLD_AIR_SENSOR_2_SHORT", value: data?.COLD_AIR_SENSOR_2_SHORT },
    { tag: "AIR_OUTLET_SENSOR_1_OPEN", value: data?.AIR_OUTLET_SENSOR_1_OPEN },
    { tag: "AIR_OUTLET_SENSOR_1_SHORT", value: data?.AIR_OUTLET_SENSOR_1_SHORT },
    { tag: "AIR_OUTLET_SENSOR_2_OPEN", value: data?.AIR_OUTLET_SENSOR_2_OPEN },
    { tag: "AIR_OUTLET_SENSOR_2_SHORT", value: data?.AIR_OUTLET_SENSOR_2_SHORT },
    { tag: "created_at", value: data?.created_at },
  ];
  


  const isActiveTag = (value: any) => {
    if (!value) return false;
    const normalized = value.toString().toLowerCase();
    return normalized === "true" || normalized === "tr";
  };
  

  function getRandomBoolean() {
    return Math.random() < 0.5;
  }

  // Determine which fault codes to use based on the fault parameter
  const isGT80E =
    fault && fault.toString().toLowerCase().includes("gt80e-s7-200-smart1");
  const faultCodes = isGT80E ? s7_200_faultCodes : s7_1200_faultCodes;
  const modelType = isGT80E
    ? "GT80E-S7-200-smart1"
    : fault?.toString().toLowerCase().includes("s7-1200-02")
      ? "Gtpl-S7-1200-02"
      : "Gtpl-122-S7-1200-01";


      const currentTags = isGT80E ? s7_200_tags : s7_1200_tags;

  const handleViewFaultCode = (faultItem: any) => {
    setSelectedFault(faultItem);
    setCurrentView("viewFaultCode");
  };

  // View Fault Code Screen (for individual fault details)
  if (currentView === "viewFaultCode" && selectedFault) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              FAULT CODE DETAILS - {modelType}
            </h1>
            <p className="text-muted-foreground">
              Code {selectedFault.code}: {selectedFault.description}
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  Fault Information
                </h3>
                <div className="bg-muted p-4 rounded-lg mb-6">
                  <p>
                    <strong>Fault Code:</strong> {selectedFault.code}
                  </p>
                  <p>
                    <strong>Description:</strong> {selectedFault.description}
                  </p>
                  <p>
                    <strong>Model:</strong> {modelType}
                  </p>
                  <p>
                    <strong>Timestamp:</strong> {new Date().toLocaleString()}
                  </p>
                </div>
              </div>

              {isGT80E && (
                <>
                  <h3 className="text-lg font-semibold mb-4">
                    GT80E System Tags Status
                  </h3>
                  <ScrollArea className="h-[500px] pr-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tag Name</TableHead>
                          <TableHead className="w-24">Status</TableHead>
                          <TableHead className="w-32">Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
  {currentTags.filter((tag) => isActiveTag(tag.value)).map((tag, index) => (
    <TableRow key={index}>
      <TableCell className="font-mono text-sm">{tag.tag}</TableCell>
      <TableCell>
        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
          Active
        </span>
      </TableCell>
      <TableCell className="font-medium">{isActiveTag(tag.value) ? "TRUE" : "FALSE"}</TableCell>
      <TableCell className="font-medium">
        {tag.tag === "created_at"
          ? tag.value
          : currentTags.find((t) => t.tag === "created_at")?.value || "N/A"}
      </TableCell>
    </TableRow>
  ))}
  {currentTags.filter((tag) => isActiveTag(tag.value)).length === 0 && (
    <TableRow>
      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
        No active tags found
      </TableCell>
    </TableRow>
  )}
</TableBody>


                    </Table>
                  </ScrollArea>
                </>
              )}
            </CardContent>

            <div className="p-6 pt-0">
              <Button
                variant="outline"
                onClick={() => router.push(`/menu/${fault}`)}
              >
                BACK TO FAULT CODES
              </Button>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  // Add a new view for all paginated logs
  if (currentView === "allPaginatedLogs") {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 container py-8">
          <FaultLogsPaginated machineName={modelType} />
          <div className="mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentView("faultLogs")}
            >
              BACK
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Fault Logs Screen
  if (currentView === "faultLogs") {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Active Alarms
            </h1>
            <p className="text-muted-foreground">
              Historical fault log entries
            </p>
          </div>

          {/* Add button to switch to Fault Codes view and to all paginated logs */}
          <div className="mb-4 flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setCurrentView("faultCodes")}
            >
              Fault Codes
            </Button>
            <Button
              variant="secondary"
              onClick={() => setCurrentView("allPaginatedLogs")}
            >
              Alarm History
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <ScrollArea className="h-[500px] pr-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tag Name</TableHead>
                      <TableHead className="w-24">Status</TableHead>
                      <TableHead className="w-32">Value</TableHead>
                      <TableHead className="w-32">Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
  {currentTags.filter((tag) => isActiveTag(tag.value)).map((tag, index) => (
    <TableRow key={index}>
      <TableCell className="font-mono text-sm">{tag.tag}</TableCell>
      <TableCell>
        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
          Active
        </span>
      </TableCell>
      <TableCell className="font-medium">{isActiveTag(tag.value) ? "TRUE" : "FALSE"}</TableCell>
      <TableCell className="font-medium">
        {tag.tag === "created_at"
          ? tag.value
          : currentTags.find((t) => t.tag === "created_at")?.value || "N/A"}
      </TableCell>
    </TableRow>
  ))}
  {currentTags.filter((tag) => isActiveTag(tag.value)).length === 0 && (
    <TableRow>
      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
        No active tags found
      </TableCell>
    </TableRow>
  )}
</TableBody>


                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </main>
        <div className="p-6 pt-0">
          <Button
            variant="outline"
            onClick={() => router.push(`/menu/${fault}`)}
          >
            BACK
          </Button>
        </div>
      </div>
    );
  }

  // Main Fault Codes Screen
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            FAULT CODE - {modelType}
          </h1>
          <p className="text-muted-foreground">
            System fault codes and descriptions for {modelType} model
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Fault Codes ({faultCodes.length} total)
              </h3>
              <Button
                variant="secondary"
                onClick={() => setCurrentView("faultLogs")}
              >
                View Fault Logs
              </Button>
            </div>

            <ScrollArea className="h-[600px] pr-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-32">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faultCodes.map((faultItem) => (
                    <TableRow key={faultItem.code}>
                      <TableCell className="font-medium">
                        {faultItem.code}
                      </TableCell>
                      <TableCell>{faultItem.description}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewFaultCode(faultItem)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>

          <div className="p-6 pt-0">
            <Button
              variant="outline"
              onClick={() => router.push(`/menu/${fault}`)}
            >
              BACK
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
