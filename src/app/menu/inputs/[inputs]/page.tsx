"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams, useRouter } from "next/navigation";
import { useAutoData } from "@/hooks/useAutoData";
import { useLanguage } from "@/providers/language-provider";
import { ArrowLeft, Activity, AlertCircle, CheckCircle2, Gauge, Zap, Settings, TrendingUp, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function InputsPage() {
  const router = useRouter();
  const { inputs } = useParams();
  const device = inputs?.toString();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const isGT80E = ['118', '108', '109', '110', '111', '112', '113'].some(code => device?.includes(code));
  const isGtpl122 = ['122', '121', '133'].some(code => device?.includes(code))
  const isGtpl1200_02 = device === "Gtpl-S7-1200-02";
  const isGtpl115 = device === "GTPL-115-gT-180E-S7-1200" || device === "GTPL-30-gT-180E-S7-1200" || device === 'GTPL-119-gT-180E-S7-1200' || device === "GTPL-120-gT-180E-S7-1200";
  const isGtpl124 = device === "GTPL-124-GT-450T-S7-1200";
  const isGTPL116 = device === "GTPL-116-gT-240E-S7-1200" || device === "GTPL-117-gT-320E-S7-1200"
  const isGTPL132 = device === "GTPL-132-300-AP-S7-1200" || device === "GTPL-142-gT-450AP-S7-1200" || device === "GTPL-123-GT-450AP" || device === "GTPL-143-gT-450AP-S7-1200"
  const isGTPL136 = device === "GTPL-136-gT-450AP"
  const isGTPL137 = device === "GTPL-137-GT-450T-S7-1200"
  const isGTPL138 = device === "GTPL-138-GT-450T-S7-1200"
  const isGTPL061 = device === "GTPL-061-gT-450T-S7-1200"
  const isGTPL139 = device === "GTPL-139-GT-300AP-S7-1200"
  const { data } = useAutoData(device as string);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper to normalize all possible "fault" values
  const isStatusFault = (value: unknown): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase();
      return lowerValue === "true" || lowerValue === "tr" || lowerValue === "True";
    }
    return false;
  };

  const s7_200_faultStatus = [
    { id: "1", description: "Blower circuit breaker fault", status: data?.BLOWER_CIRCUIT_BREAKER_FAULT },
    { id: "2", description: "Blower drive fault", status: data?.BLOWER_DRIVE_FAULT },
    { id: "3", description: "Blower drive operation", status: data?.BLOWER_DRIVE_ON },
    { id: "4", description: "Spare", status: data?.AFTER_HEAT_TEMP_MORE_THAN_50 },
    { id: "5", description: "Condenser fan overheat", status: data?.COND_FAN_MOTOR_OVERHEAT },
    { id: "6", description: "Spare", status: data?.SET_POINT_NOT_ACHIEVED_IN_AERATION_MODE },
    { id: "7", description: "Compressor circuit breaker fault", status: data?.COMPRESSOR_CIRCUIT_BREA_FAULT },
    { id: "8", description: "Low pressure fault", status: data?.LOW_PRESSURE_FAULT },
    { id: "9", description: "High pressure fault", status: data?.HIGH_PRESSURE_FAULT },
    { id: "10", description: "Three phase monitor fault", status: data?.THREE_PHASE_MONITORING_FAULT },
    { id: "11", description: "Heater overheat", status: data?.HEATER_OVER_HEAT },
    { id: "12", description: "Condenser fan circuit breaker fault", status: data?.COND_FAN_CIRCUIT_BREAKE_FAULT },
    { id: "13", description: "Heater circuit breaker fault", status: data?.HEATER_CIRCUIT_BREAKER_FAULT },
    { id: "14", description: "Heater RCCB fault", status: data?.HEATER_RCCCB_TRIP_FAULT },
    { id: "15", description: "Condenser fan door open", status: data?.CONDENSER_FAN_DOOR_OPEN },
  ];

  const s7_1200_faultStatus = [
    { id: "I0.0", description: "Compressor circuit breaker", status: data?.Compressor_circuit_breaker_ },
    { id: "I0.1", description: "Compressor module FDK error", status: data?.Comp_module_fdk_error_ },
    { id: "I0.2", description: "Compressor in operation", status: data?.Comp_in_operation_ },
    { id: "I0.3", description: "Oil level", status: data?.Oil_level_ },
    { id: "I0.4", description: "Blower drive", status: data?.Blower_drive_ },
    { id: "I0.5", description: "Blower in operation", status: data?.Blower_in_operation_ },
    { id: "I0.6", description: "Blower circuit breaker", status: data?.Blower_circuit_breaker_ },
    { id: "I0.7", description: "Condenser fan 1 TOP", status: data?.Cond_fan_1_TOP_ },
    { id: "I1.0", description: "Cond fan 1 circuit breaker", status: data?.Cond_fan_1_cir_cuit_breaker_ },
    { id: "I1.1", description: "Low pressure fault", status: data?.Low_pressure_fault_ },
    { id: "I1.2", description: "Compressor OLR trip", status: data?.Compressor_OLR_trip_ },
    { id: "I1.3", description: "High pressure fault", status: data?.High_pressure_fault_ },
    { id: "I1.4", description: "Start stop switch", status: data?.Start_stop_switch_ },
    { id: "I2.0", description: "Three phase monitoring fault", status: data?.Three_phase_monitoring_fault_ },
    { id: "I2.2", description: "Condenser fan 2 TOP", status: data?.Cond_fan_2_TOP_ },
    { id: "I2.3", description: "Condenser fan 3 TOP", status: data?.Cond_fan_3_TOP_ },
    { id: "I2.4", description: "Condenser fan 4 TOP", status: data?.Cond_fan_4_TOP_ },
    { id: "I2.5", description: "Cond fan 2 circuit breaker", status: data?.Cond_fan_2_circuit_breaker_ },
    { id: "I2.6", description: "Cond fan 3 circuit breaker", status: data?.Cond_fan_3_circuit_breaker_ },
    { id: "I2.7", description: "Cond fan 4 circuit breaker", status: data?.Cond_fan_4_circuit_breaker_ },
    { id: "I3.0", description: "Condenser fan 5 TOP", status: data?.Cond_fan_5_TOP_ },
    { id: "I3.1", description: "Condenser fan 6 TOP", status: data?.Cond_fan_6_TOP_ },
    { id: "I3.2", description: "Cond fan 5 circuit breaker", status: data?.Cond_fan_5_circuit_breaker_ },
    { id: "I3.3", description: "Cond fan 6 circuit breaker", status: data?.Cond_fan_6_circuit_breaker_ },
  ];

  const gtpl_132_faultStatus = [
    { id: "I0.0", description: "Compressor circuit breaker", status: data?.["Compressor_circuit_breaker_I0_0"] },
    { id: "I0.1", description: "Compressor module feedback error", status: data?.["Compressor_module_feedback_error_I0_1"] },
    { id: "I0.2", description: "Compressor in operation", status: data?.["Compressor_in_operation_I0_2"] },
    { id: "I0.3", description: "Compressor oil low", status: data?.["Compressor_oil_low_I0_3"] },
    { id: "I0.4", description: "Blower drive fault", status: data?.["Blower_drive_fault_I0_4"] },
    { id: "I0.5", description: "Blower drive in operation", status: data?.["Blower_drive_in_operation_I0_5"] },
    { id: "I0.6", description: "Blower circuit breaker", status: data?.["Blower_circuit_breaker_I0_6"] },
    { id: "I0.7", description: "Condenser fan1 TOP fault", status: data?.["Condenser_fan1_TOP_fault_I0_7"] },
    { id: "I1.0", description: "Condenser fan1 circuit breaker", status: data?.["Condenser_fan1_circuit_breaker_I1_0"] },
    { id: "I1.1", description: "Spare", status: data?.["Spare_I1_1"] },
    { id: "I1.2", description: "Low pressure fault", status: data?.Low_pressure_fault_I1_2 },
    { id: "I1.3", description: "High Pressure Fault", status: data?.["High_Pressure_Fault_I1_3"] },
    { id: "I1.4", description: "Start/stop", status: data?.["Start/stop_I1_4"] },
    { id: "I2.0", description: "Three phase monitor fault", status: data?.["Three_phase_monitor_fault_I2_0"] },
    { id: "I2.1", description: "Spare", status: data?.["Spare_I2_1"] },
    { id: "I2.2", description: "Condenser fan2 TOP fault", status: data?.["Cond_fan2_TOP_fault_I2_2"] },
    { id: "I2.3", description: "Spare", status: data?.["Spare_I2_3"] },
    { id: "I2.4", description: "Spare", status: data?.["Spare_I2_4"] },
    { id: "I2.5", description: "Condenser fan2 circuit breaker fault", status: data?.["Condenser_fan2_circuit_breaker_fault_I2_5"] },
  ];

  const gtpl_137_faultStatus = [
    { id: "I0.0", description: "Compressor circuit breaker", status: data?.Compressor_circuit_breaker_I0_0 },
    { id: "I0.1", description: "Compressor module feedback error", status: data?.Compressor_module_feedback_error_I0_1 },
    { id: "I0.2", description: "Compressor in operation", status: data?.Compressor_in_operation_I0_2 },
    { id: "I0.3", description: "Compressor oil low", status: data?.Compressor_oil_low_I0_3 },
    { id: "I0.4", description: "Blower drive fault", status: data?.Blower_drive_fault_I0_4 },
    { id: "I0.5", description: "Blower drive in operation", status: data?.Blower_drive_in_operation_I0_5 },
    { id: "I0.6", description: "Blower circuit breaker", status: data?.Blower_circuit_breaker_I0_6 },
    { id: "I0.7", description: "Condenser fan1 TOP fault", status: data?.Condenser_fan1_TOP_fault_I0_7 },
    { id: "I1.0", description: "Condenser fan1 circuit breaker", status: data?.Condenser_fan1_circuit_breaker_I1_0 },
    { id: "I1.1", description: "Spare", status: data?.Spare_I1_1 },
    { id: "I1.2", description: "Low pressure fault", status: data?.Low_pressure_fault_I1_2 },
    { id: "I1.3", description: "High Pressure Fault", status: data?.High_Pressure_Fault_I1_3 },
    { id: "I1.4", description: "Start/stop", status: data?.Start_stop_I1_4 },
    { id: "I2.0", description: "Three phase monitor fault", status: data?.Three_phase_monitor_fault_I2_0 },
    { id: "I2.1", description: "Spare", status: data?.Spare_I2_1 },
    { id: "I2.2", description: "Cond fan2 TOP fault", status: data?.Cond_fan2_TOP_fault_I2_2 },
    { id: "I2.3", description: "Cond fan3 TOP fault", status: data?.Cond_fan3_TOP_fault_I2_3 },
    { id: "I2.4", description: "Cond fan4 TOP fault", status: data?.Cond_fan4_TOP_fault_I2_4 },
    { id: "I2.5", description: "Cond fan2 circuit breaker fault", status: data?.Cond_fan2_circuit_breaker_fault_I2_5 },
    { id: "I2.6", description: "Cond fan3 circuit breaker fault", status: data?.Cond_fan3_circuit_breaker_fault_I2_6 },
    { id: "I2.7", description: "Cond fan4 circuit breaker fault", status: data?.Cond_fan4_circuit_breaker_fault_I2_7 },
  ];

  const gtpl_138_faultStatus = [
    { id: "I0.0", description: "Compressor circuit breaker", status: data?.Compressor_circuit_breaker_I0_0 },
    { id: "I0.1", description: "Compressor module feedback error", status: data?.Compressor_module_feedback_error_I0_1 },
    { id: "I0.2", description: "Compressor in operation", status: data?.Compressor_in_operation_I0_2 },
    { id: "I0.3", description: "Compressor oil low", status: data?.Compressor_oil_low_I0_3 },
    { id: "I0.4", description: "Blower drive fault", status: data?.Blower_drive_fault_I0_4 },
    { id: "I0.5", description: "Blower drive in operation", status: data?.Blower_drive_in_operation_I0_5 },
    { id: "I0.6", description: "Blower circuit breaker", status: data?.Blower_circuit_breaker_I0_6 },
    { id: "I0.7", description: "Condenser fan1 TOP fault", status: data?.Condenser_fan1_TOP_fault_I0_7 },
    { id: "I1.0", description: "Condenser fan1 circuit breaker", status: data?.Condenser_fan1_circuit_breaker_I1_0 },
    { id: "I1.1", description: "Spare", status: data?.Spare_I1_1 },
    { id: "I1.2", description: "Low pressure fault", status: data?.Low_pressure_fault_I1_2 },
    { id: "I1.3", description: "High Pressure Fault", status: data?.High_Pressure_Fault_I1_3 },
    { id: "I1.4", description: "Start/stop", status: data?.Start_stop_I1_4 },
    { id: "I2.0", description: "Three phase monitor fault", status: data?.Three_phase_monitor_fault_I2_0 },
    { id: "I2.1", description: "Spare", status: data?.Spare_I2_1 },
    { id: "I2.2", description: "Cond fan2 TOP fault", status: data?.Cond_fan2_TOP_fault_I2_2 },
    { id: "I2.3", description: "Cond fan3 TOP fault", status: data?.Cond_fan3_TOP_fault_I2_3 },
    { id: "I2.4", description: "Cond fan4 TOP fault", status: data?.Cond_fan4_TOP_fault_I2_4 },
    { id: "I2.5", description: "Cond fan2 circuit breaker fault", status: data?.Cond_fan2_circuit_breaker_fault_I2_5 },
    { id: "I2.6", description: "Cond fan3 circuit breaker fault", status: data?.Cond_fan3_circuit_breaker_fault_I2_6 },
    { id: "I2.7", description: "Cond fan4 circuit breaker fault", status: data?.Cond_fan4_circuit_breaker_fault_I2_7 },
  ];

  const gtpl_136_faultStatus = [
    { id: "I0.0", description: "Compressor circuit breaker", status: data?.Compressor_circuit_breaker_I0_0 },
    { id: "I0.1", description: "Compressor module feedback error", status: data?.Compressor_module_feedback_error_I0_1 },
    { id: "I0.2", description: "Compressor in operation", status: data?.Compressor_in_operation_I0_2 },
    { id: "I0.3", description: "Compressor oil low", status: data?.Compressor_oil_low_I0_3 },
    { id: "I0.4", description: "Blower drive fault", status: data?.Blower_drive_fault_I0_4 },
    { id: "I0.5", description: "Blower drive in operation", status: data?.Blower_drive_in_operation_I0_5 },
    { id: "I0.6", description: "Blower circuit breaker", status: data?.Blower_circuit_breaker_I0_6 },
    { id: "I0.7", description: "Condenser fan1 TOP fault", status: data?.Condenser_fan1_TOP_fault_I0_7 },
    { id: "I1.0", description: "Condenser fan1 circuit breaker", status: data?.Condenser_fan1_circuit_breaker_I1_0 },
    { id: "I1.1", description: "Spare", status: data?.Spare_I1_1 },
    { id: "I1.2", description: "Low pressure fault", status: data?.Low_pressure_fault_I1_2 },
    { id: "I1.3", description: "High Pressure Fault", status: data?.High_Pressure_Fault_I1_3 },
    { id: "I1.4", description: "Start/stop", status: data?.Start_stop_I1_4 },
    { id: "I2.0", description: "Three phase monitor fault", status: data?.Three_phase_monitor_fault_I2_0 },
    { id: "I2.1", description: "Spare", status: data?.Spare_I2_1 },
    { id: "I2.2", description: "Cond fan2 TOP fault", status: data?.Cond__fan2_TOP_fault_I2_2 },
    { id: "I2.3", description: "Cond fan3 TOP fault", status: data?.Cond__fan3_TOP_fault_I2_3 },
    { id: "I2.4", description: "Cond fan4 TOP fault", status: data?.Cond__fan4_TOP_fault_I2_4 },
    { id: "I2.5", description: "Cond fan2 circuit breaker fault", status: data?.Cond__fan2_circuit_breaker_fault_I2_5 },
    { id: "I2.6", description: "Cond fan3 circuit breaker fault", status: data?.Cond__fan3_circuit_breaker_fault_I2_6 },
    { id: "I2.7", description: "Cond fan4 circuit breaker fault", status: data?.Cond__fan4_circuit_breaker_fault_I2_7 },
  ];

  const gtpl_115_faultStatus = [
    { id: "1", description: "Blower circuit breaker fault", status: data?.BLOWER_CIRCUIT_BREAKER_I0_0 },
    { id: "2", description: "Blower drive fault", status: data?.BLOWER_DRIVE_I0_1 },
    { id: "3", description: "Blower in operation", status: data?.BLOWER_IN_OPERATION_I0_2 },
    { id: "4", description: "Heater drive fault", status: data?.HEATER_DRIVE_FAULT_I0_4 },
    { id: "5", description: "Condenser fan TOP fault", status: data?.CONDENSER_FAN_TOP_FAULT_I0_6 },
    { id: "6", description: "Condenser fan drive fault", status: data?.CONDENSER_FAN_DRIVE_FAULT_I0_7 },
    { id: "7", description: "Blower circuit breaker", status: data?.BLOWER_CIRCUIT_BREAKER_I0_6 },
    { id: "8", description: "Compressor circuit breaker fault", status: data?.COMPRESSOR_CIRCUIT_BREAKER_FAULT_I1_1 },
    { id: "9", description: "Compressor motor overheat", status: data?.COMPRESSOR_MOTOR_OVERHEAT_I1_2 },
    { id: "10", description: "Low pressure fault", status: data?.LOW_PRESSURE_FAULT_I1_3 },
    { id: "11", description: "High pressure fault", status: data?.HIGH_PRESSURE_FAULT_I1_4 },
    { id: "12", description: "Three phase monitor fault", status: data?.THREE_PHASE_MONITOR_FAULT_I2_0 },
    { id: "13", description: "Heater TOP fault", status: data?.HEATER_TOP_FAULT_I2_1 },
    { id: "14", description: "Condenser fan 1 circuit breaker fault", status: data?.COND_FAN1_CIRCUIT_BREAKER_FAULT_I2_2 },
    { id: "15", description: "Heater circuit breaker fault", status: data?.HEATER_CIRCUIT_BREAKER_FAULT_I2_3 },
    { id: "16", description: "Heater RCCB fault", status: data?.HEATER_RCCB_FAULT_I2_4 },
    { id: "17", description: "Condenser fan door open", status: data?.CONDENSER_FAN_DOOR_OPEN_I2_5 },
  ];

  const gtpl_116_faultStatus = [
    { id: "1", description: "Blower circuit breaker", status: data?.Blower_circuit_breaker },
    { id: "2", description: "Blower drive", status: data?.Blower_drive },
    { id: "3", description: "Blower in operation", status: data?.Blower_in_operation },
    { id: "4", description: "Heater drive fault", status: data?.Heater_drive_fault },
    { id: "5", description: "Condenser fan1 TOP fault", status: data?.Condenser_fan1_TOP_fault },
    { id: "6", description: "Condenser fan2 TOP fault", status: data?.Condenser_fan2_TOP_fault },
    { id: "7", description: "Condenser fan drive fault", status: data?.Condenser_fan_drive_fault },
    { id: "8", description: "Compressor oil low", status: data?.Compressor_oil_low },
    { id: "9", description: "Compressor circuit breaker fault", status: data?.Compressor_circuit_breaker_fault },
    { id: "10", description: "Compressor motor overheat", status: data?.Compressor_motor_overheat },
    { id: "11", description: "Low Pressure Fault", status: data?.Low_Pressure_Fault },
    { id: "12", description: "High pressure fault", status: data?.High_pressure_fault },
    { id: "13", description: "Three phase monitor fault", status: data?.Three_phase_monitor_fault },
    { id: "14", description: "Heater TOP fault", status: data?.Heater_TOP_fault },
    { id: "15", description: "Cond fan1 circuit breaker fault", status: data?.Cond_fan1_circuit_breaker_fault },
    { id: "16", description: "Heater circuit breaker fault", status: data?.Heater_circuit_breaker_fault },
    { id: "17", description: "Heater RCCB fault", status: data?.Heater_RCCB_fault },
    { id: "18", description: "Condenser fan1 door open", status: data?.Condenser_fan1_door_open },
    { id: "19", description: "Cond fan2 circuit breaker", status: data?.Cond_fan2_circuit_breaker },
    { id: "20", description: "Condenser fan2 door open", status: data?.Condenser_fan2_door_open }
  ];

  const gtpl_124_faultStatus = [
    { id: "I0.0", description: "Compressor circuit breaker fault", status: data?.Compressor_circuit_breaker_I0_0 },
    { id: "I0.1", description: "Compressor module FDK error", status: data?.Comp_module_fdk_error_I0_1 },
    { id: "I0.2", description: "Compressor in operation", status: data?.Comp_in_operation_I0_2 },
    { id: "I0.3", description: "Oil level", status: data?.Oil_level_I0_3 },
    { id: "I0.4", description: "Blower drive", status: data?.Blower_drive_I0_4 },
    { id: "I0.5", description: "Blower in operation", status: data?.Blower_in_operation_I0_5 },
    { id: "I0.6", description: "Blower circuit breaker fault", status: data?.Blower_circuit_breaker_I0_6 },
    { id: "I0.7", description: "Condenser fan 1 TOP", status: data?.Cond_fan1_TOP_I0_7 },
    { id: "I1.0", description: "Condenser fan 1 circuit breaker fault", status: data?.Cond_fan1_circuit_breaker_I1_0 },
    { id: "I1.1", description: "Spare input", status: data?.Spare_I1_1 },
    { id: "I1.2", description: "Low pressure fault", status: data?.Low_pressure_fault_I1_2 },
    { id: "I1.3", description: "High pressure fault", status: data?.High_pressure_fault_I1_3 },
    { id: "I1.4", description: "Start/Stop signal", status: data?.Start_stop_I1_4 },
    { id: "I2.0", description: "Three phase monitor fault", status: data?.Three_phase_monitor_fault_I2_0 },
    { id: "I2.1", description: "Spare input", status: data?.Spare_I2_1 },
    { id: "I2.2", description: "Condenser fan 2 TOP fault", status: data?.Cond_fan2_TOP_fault_I2_2 },
    { id: "I2.3", description: "Condenser fan 3 TOP fault", status: data?.Cond_fan3_TOP_fault_I2_3 },
    { id: "I2.4", description: "Condenser fan 4 TOP fault", status: data?.Cond_fan4_TOP_fault_I2_4 },
    { id: "I2.5", description: "Condenser fan 2 circuit breaker fault", status: data?.Cond_fan2_cb_fault_I2_5 },
    { id: "I2.6", description: "Condenser fan 3 circuit breaker fault", status: data?.Cond_fan3_cb_fault_I2_6 },
    { id: "I2.7", description: "Condenser fan 4 circuit breaker fault", status: data?.Cond_fan4_cb_fault_I2_7 },
  ];

  const gtpl_061_faultStatus = [
    { id: "I0.0", description: "Compressor circuit breaker", status: data?.Compressor_circuit_breaker_I0_0 },
    { id: "I0.1", description: "Compressor module feedback error", status: data?.Compressor_module_feedback_error_I0_1 },
    { id: "I0.2", description: "Compressor in operation", status: data?.Compressor_in_operation_I0_2 },
    { id: "I0.3", description: "Compressor oil low", status: data?.Compressor_oil_low_I0_3 },
    { id: "I0.4", description: "Blower drive fault", status: data?.Blower_drive_fault_I0_4 },
    { id: "I0.5", description: "Blower drive in operation", status: data?.Blower_drive_in_operation_I0_5 },
    { id: "I0.6", description: "Blower circuit breaker", status: data?.Blower_circuit_breaker_I0_6 },
    { id: "I0.7", description: "Condenser fan1 TOP fault", status: data?.Condenser_fan1_TOP_fault_I0_7 },
    { id: "I1.0", description: "Condenser fan1 circuit breaker", status: data?.Condenser_fan1_circuit_breaker_I1_0 },
    { id: "I1.1", description: "Spare", status: data?.Spare_I1_1 },
    { id: "I1.2", description: "Spare", status: data?.Spare_I1_2 },
    { id: "I1.3", description: "High Pressure Fault", status: data?.High_Pressure_Fault_I1_3 },
    { id: "I1.4", description: "Start/stop", status: data?.Start_stop_I1_4 },
    { id: "I2.0", description: "Three phase monitor fault", status: data?.Three_phase_monitor_fault_I2_0 },
    { id: "I2.1", description: "Spare", status: data?.Spare_I2_1 },
    { id: "I2.2", description: "Cond fan4 circuit breaker fault", status: data?.Cond_fan4_circuit_breaker_fault_I2_2 },
    { id: "I2.3", description: "Cond fan2 TOP fault", status: data?.Cond_fan2_TOP_fault_I2_3 },
    { id: "I2.4", description: "Cond fan3 TOP fault", status: data?.Cond_fan3_TOP_fault_I2_4 },
    { id: "I2.5", description: "Cond fan4 TOP fault", status: data?.Cond_fan4_TOP_fault_I2_5 },
    { id: "I2.6", description: "Cond fan2 circuit breaker fault", status: data?.Cond_fan2_circuit_breaker_fault_I2_6 },
    { id: "I2.7", description: "Cond fan3 circuit breaker fault", status: data?.Cond_fan3_circuit_breaker_fault_I2_7 },
  ];

  const gtpl_139_faultStatus = [
    { id: "I0.0", description: "Compressor circuit breaker", status: data?.Compressor_circuit_breaker_I0_0 },
    { id: "I0.1", description: "Compressor module feedback error", status: data?.Compressor_module_feedback_error_I0_1 },
    { id: "I0.2", description: "Compressor in operation", status: data?.Compressor_in_operation_I0_2 },
    { id: "I0.3", description: "Compressor oil low", status: data?.Compressor_oil_low_I0_3 },
    { id: "I0.4", description: "Blower drive fault", status: data?.Blower_drive_fault_I0_4 },
    { id: "I0.5", description: "Blower drive in operation", status: data?.Blower_drive_in_operation_I0_5 },
    { id: "I0.6", description: "Blower circuit breaker", status: data?.Blower_circuit_breaker_I0_6 },
    { id: "I0.7", description: "Condenser fan1 TOP fault", status: data?.Condenser_fan1_TOP_fault_I0_7 },
    { id: "I1.0", description: "Condenser fan1 circuit breaker", status: data?.Condenser_fan1_circuit_breaker_I1_0 },
    { id: "I1.1", description: "Spare", status: data?.Spare_I1_1 },
    { id: "I1.2", description: "Low pressure fault", status: data?.Low_pressure_fault_I1_2 },
    { id: "I1.3", description: "High Pressure Fault", status: data?.High_Pressure_Fault_I1_3 },
    { id: "I1.4", description: "Start/stop", status: data?.Start_stop_I1_4 },
    { id: "I2.0", description: "Three phase monitor fault", status: data?.Three_phase_monitor_fault_I2_0 },
    { id: "I2.1", description: "Spare", status: data?.Spare_I2_1 },
    { id: "I2.2", description: "Cond fan2 TOP fault", status: data?.Cond__fan2_TOP_fault_I2_2 },
    { id: "I2.3", description: "Spare", status: data?.Spare_I2_3 },
    { id: "I2.4", description: "Spare", status: data?.Spare_I2_4 },
    { id: "I2.5", description: "Cond fan2 circuit breaker fault", status: data?.Cond__fan2_circuit_breaker_fault_I2_5 },
    { id: "I2.6", description: "Spare", status: data?.Spare_I2_6 },
    { id: "I2.7", description: "Spare", status: data?.Spare_I2_7 },
  ];

  const renderList = () => {
    const selectedList =
      isGT80E ? s7_200_faultStatus :
        isGtpl115 ? gtpl_115_faultStatus :
          isGtpl124 ? gtpl_124_faultStatus :
            (isGtpl122 || isGtpl1200_02) ? s7_1200_faultStatus :
              isGTPL116 ? gtpl_116_faultStatus :
                isGTPL132 ? gtpl_132_faultStatus :
                  isGTPL136 ? gtpl_136_faultStatus :
                    isGTPL137 ? gtpl_137_faultStatus :
                      isGTPL138 ? gtpl_138_faultStatus :
                        isGTPL061 ? gtpl_061_faultStatus :
                          isGTPL139 ? gtpl_139_faultStatus :
                            [];

    return selectedList.map((item, index) => {
      const isFault = isStatusFault(item.status);
      const isCondenserFan1TopFault = isGTPL132 && (item.id === 'I0.2' || item.id === 'I1.2' || item.id === "I2.0");
      const shouldShowRed = isCondenserFan1TopFault ? !isFault : isFault;

      return (
        <div
          key={item.id}
          className="group relative overflow-hidden rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:border-blue-400/50 dark:hover:border-blue-500/50"
          style={{
            animation: mounted ? `slideInUp 0.6s ease-out ${index * 0.05}s both` : 'none'
          }}
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-700" />

          {/* Glowing border effect */}
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-xl" />

          <div className="relative flex items-center gap-4 p-4">
            {/* Animated ID Badge */}
            <div className="flex-shrink-0 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border-2 border-gray-300 dark:border-gray-600 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <span className="font-mono text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {item.id}
                </span>
              </div>
            </div>

            {/* Description with animated underline */}
            <div className="flex-1 min-w-0 relative">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {item.description}
              </p>
              <div className="h-0.5 w-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 group-hover:w-full transition-all duration-700 mt-1" />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 flex items-center gap-1.5">
                <span className={`inline-block w-2 h-2 rounded-full ${shouldShowRed ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                {shouldShowRed ? "Active Alert" : "Normal Operation"}
              </p>
            </div>

            {/* Animated Status Indicator */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="relative">
                {/* Pulsing ring for active faults */}
                {shouldShowRed && (
                  <>
                    <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping" />
                    <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-50 animate-pulse" />
                  </>
                )}

                {/* Main status circle */}
                <div className={`relative inline-flex items-center justify-center w-14 h-14 rounded-full border-3 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 ${shouldShowRed
                  ? "bg-gradient-to-br from-red-500 to-red-600 border-red-700 shadow-lg shadow-red-500/50"
                  : "bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-700 shadow-lg shadow-emerald-500/50"
                  }`}>
                  {shouldShowRed ? (
                    <AlertCircle className="h-7 w-7 text-white animate-pulse" />
                  ) : (
                    <CheckCircle2 className="h-7 w-7 text-white" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className={`h-1 w-0 group-hover:w-full transition-all duration-700 ${shouldShowRed
            ? 'bg-gradient-to-r from-red-500 via-orange-500 to-red-500'
            : 'bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500'
            }`} />
        </div>
      );
    });
  };

  const selectedList =
    isGT80E ? s7_200_faultStatus :
      isGtpl115 ? gtpl_115_faultStatus :
        isGtpl124 ? gtpl_124_faultStatus :
          (isGtpl122 || isGtpl1200_02) ? s7_1200_faultStatus :
            isGTPL116 ? gtpl_116_faultStatus :
              isGTPL132 ? gtpl_132_faultStatus :
                isGTPL136 ? gtpl_136_faultStatus :
                  isGTPL137 ? gtpl_137_faultStatus :
                    isGTPL138 ? gtpl_138_faultStatus :
                      isGTPL061 ? gtpl_061_faultStatus :
                        isGTPL139 ? gtpl_139_faultStatus :
                          [];

  const totalInputs = selectedList.length;
  const activeFaults = selectedList.filter(item => isStatusFault(item.status)).length;
  const normalStatus = totalInputs - activeFaults;

  return (
    <>
      <style jsx global>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
          background: linear-gradient(
            to right,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%
          );
          background-size: 1000px 100%;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
          {/* Animated Header */}
          <div
            ref={headerRef}
            className="mb-8"
            style={{
              animation: mounted ? 'fadeInScale 0.8s ease-out' : 'none'
            }}
          >
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push(`/menu/${device}`)}
                className="h-14 w-14 rounded-2xl border-2 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:scale-110 hover:rotate-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <div className="flex-1">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text  mb-2 animate-shimmer">
                  System Inputs Monitor
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 animate-pulse" />
                  Real-time monitoring • {device}
                </p>
              </div>
            </div>

            {/* Animated Stats Cards */}
            <div
              ref={statsRef}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              style={{
                animation: mounted ? 'slideInUp 0.8s ease-out 0.2s both' : 'none'
              }}
            >
              {/* Total Inputs Card */}
              <Card className="relative overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md hover:scale-105 transition-all duration-500 group shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="p-6 relative">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Inputs</p>
                      <p className="text-4xl font-bold text-gray-900 dark:text-white mt-1">{totalInputs}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Active Faults Card */}
              <Card className="relative overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md hover:scale-105 transition-all duration-500 group shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="p-6 relative">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/50 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative">
                      {activeFaults > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                      )}
                      <AlertCircle className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Active Faults</p>
                      <p className="text-4xl font-bold text-gray-900 dark:text-white mt-1">{activeFaults}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Normal Status Card */}
              <Card className="relative overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md hover:scale-105 transition-all duration-500 group shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="p-6 relative">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/50 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                      <CheckCircle2 className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Normal Status</p>
                      <p className="text-4xl font-bold text-gray-900 dark:text-white mt-1">{normalStatus}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content Card */}
          <Card
            ref={listRef}
            className="border-2 border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-2xl overflow-hidden"
            style={{
              animation: mounted ? 'slideInUp 0.8s ease-out 0.4s both' : 'none'
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <Shield className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  Input Status Overview
                </h2>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700">
                  <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Live Data</span>
                </div>
              </div>

              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {renderList()}
                </div>
              </ScrollArea>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  className="h-16 text-lg font-semibold border-2 hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 group relative overflow-hidden shadow-lg"
                  onClick={() => router.push(`/menu/outputs/${device}`)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <Gauge className="h-6 w-6 mr-3 group-hover:rotate-180 transition-transform duration-700" />
                  View Outputs
                </Button>
                <Button
                  variant="outline"
                  className="h-16 text-lg font-semibold border-2 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 group relative overflow-hidden shadow-lg"
                  onClick={() => router.push(`/menu/inputs/analog/${device}`)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <Settings className="h-6 w-6 mr-3 group-hover:rotate-180 transition-transform duration-700" />
                  Analog Inputs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
