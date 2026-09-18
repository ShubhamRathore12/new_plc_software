"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams, useRouter } from "next/navigation";
import { useAutoData } from "@/hooks/useAutoData";
import ScreenHeader, { StatStrip } from "@/components/ScreenHeader";
import SignalRow from "@/components/SignalRow";
import { AlertCircle, CheckCircle2, Gauge, Zap, Settings, TrendingUp, Shield } from "lucide-react";
import {
  GTPL_156_157_DIGITAL_INPUT_ROWS,
  isGTPL156157,
  pickTagValue,
} from "@/lib/gtpl156157Config";

export default function InputsPage() {
  const router = useRouter();
  const { inputs } = useParams();
  const device = inputs?.toString();

  const isGTPL118 = device === "GTPL-118-gT-60T-S7-200" || device === "GTPL-149-gT-60T-S7-1200";
  const isGT80E = !isGTPL118 && ['108', '109', '110', '111', '112', '113'].some(code => device?.includes(code));
  const isGtpl122 = ['122', '121', '133', '154', '155', '131','068','104','081','105'].some(code => device?.includes(code))
  const isGtpl1200_02 = device === "Gtpl-S7-1200-02";
  const isGtpl115 = device === "GTPL-115-gT-180E-S7-1200" || device === "GTPL-30-gT-180E-S7-1200" || device === 'GTPL-119-gT-180E-S7-1200' || device === "GTPL-120-gT-180E-S7-1200" || device === "GTPL-044-GT-140E-S7-1200";
  const isGtpl124 = device === "GTPL-124-gT-450T-S7-1200";
  const isGTPL116 = device === "GTPL-116-gT-240E-S7-1200" || device === "GTPL-117-gT-320E-S7-1200"
  const isGTPL132 = device === "GTPL-132-300-AP-S7-1200" || device === "GTPL-142-gT-450AP-S7-1200" || device === "GTPL-123-gT-450AP" || device === "GTPL-143-gT-450AP-S7-1200"
  const isGTPL136 = device === "GTPL-136-gT-450AP"
  const isGTPL137 = device === "GTPL-137-gT-450T-S7-1200"
  const isGTPL138 = device === "GTPL-138-gT-450T-S7-1200"
  const isGTPL134_135 = device === "GTPL-134-gT-450T-S7-1200" || device === "GTPL-135-gT-450T-S7-1200" || device === "GTPL-145-gT-450T-S7-1200" || device === "GTPL-148-gT-450T-S7-1200"
  const isGTPL061 = device === "GTPL-061-gT-450T-S7-1200"
  const isGTPL139 = device === "GTPL-139-gT-300AP-S7-1200"
  const isGTPL144 = device === "GTPL-144-gT-300AP-S7-1200"
  const isGTPL156_157 = isGTPL156157(device)
  const { data, isConnected } = useAutoData(device as string);

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

  const gtpl_134_135_faultStatus = [
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

  // GTPL-156 / 157 (Philippines silo) — digital inputs from the SILO I/O list
  const gtpl_156_157_faultStatus = GTPL_156_157_DIGITAL_INPUT_ROWS.map((row) => ({
    id: row.id,
    description: row.description,
    status: pickTagValue(data, row.keys),
  }));

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

  const gtpl_144_faultStatus = [
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

  const gtpl_118_faultStatus = [
    { id: "I0.0", description: "Compressor circuit breaker", status: data?.Compressor_circuit_breaker_I0_0 },
    { id: "I0.1", description: "Compressor overheat", status: data?.Compressor_overheat_I0_1 },
    { id: "I0.2", description: "Compressor in operation", status: data?.Compressor_in_operation_I0_2 },
    { id: "I0.3", description: "Blower drive fault", status: data?.Blower_drive_fault_I0_3 },
    { id: "I0.4", description: "Blower drive in operation", status: data?.Blower_drive_in_operation_I0_4 },
    { id: "I0.5", description: "Blower circuit breaker", status: data?.Blower_circuit_breaker_I0_5 },
    { id: "I0.6", description: "Condenser fan TOP fault", status: data?.Condenser_fan_TOP_fault_I0_6 },
    { id: "I0.7", description: "Condenser fan circuit breaker", status: data?.Condenser_fan_circuit_breaker_I0_7 },
    { id: "I1.0", description: "Low pressure fault", status: data?.Low_pressure_fault_I1_0 },
    { id: "I1.1", description: "High Pressure Fault", status: data?.High_Pressure_Fault_I1_1 },
    { id: "I1.2", description: "Three phase monitor fault", status: data?.Three_phase_monitor_fault_I1_2 },
    { id: "I1.3", description: "Condenser fan door open", status: data?.Condenser_fan_door_open_I1_3 },
  ];

  const renderList = () => {
    const selectedList =
      isGTPL118 ? gtpl_118_faultStatus :
      isGT80E ? s7_200_faultStatus :
        isGtpl115 ? gtpl_115_faultStatus :
          isGtpl124 ? gtpl_124_faultStatus :
            (isGtpl122 || isGtpl1200_02) ? s7_1200_faultStatus :
              isGTPL116 ? gtpl_116_faultStatus :
                isGTPL132 ? gtpl_132_faultStatus :
                  isGTPL134_135 ? gtpl_134_135_faultStatus :
                    isGTPL136 ? gtpl_136_faultStatus :
                      isGTPL137 ? gtpl_137_faultStatus :
                      isGTPL138 ? gtpl_138_faultStatus :
                        isGTPL061 ? gtpl_061_faultStatus :
                          isGTPL139 ? gtpl_139_faultStatus :
                            isGTPL144 ? gtpl_144_faultStatus :
                              isGTPL156_157 ? gtpl_156_157_faultStatus :
                            [];

    return selectedList.map((item, index) => {
      const isFault = isStatusFault(item.status);
      const isCondenserFan1TopFault = isGTPL132 && (item.id === 'I0.2' || item.id === 'I1.2' || item.id === "I2.0");
      const shouldShowRed = isCondenserFan1TopFault ? !isFault : isFault;

      return (
        <SignalRow
          key={item.id}
          id={item.id}
          description={item.description}
          active={shouldShowRed}
          index={index}
          tone="fault"
        />
      );
    });
  };

  const selectedList =
    isGTPL118 ? gtpl_118_faultStatus :
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
                          isGTPL144 ? gtpl_144_faultStatus :
                            isGTPL156_157 ? gtpl_156_157_faultStatus :
                          [];

  const totalInputs = selectedList.length;
  const activeFaults = selectedList.filter(item => isStatusFault(item.status)).length;
  const normalStatus = totalInputs - activeFaults;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient ground - static, so it costs one paint and never repaints */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute top-0 left-1/4 h-96 w-96 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in oklch, var(--primary) 14%, transparent), transparent)",
          }}
        />
        <div
          className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in oklch, var(--chart-2) 13%, transparent), transparent)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl space-y-6 px-4 py-8">
        <div className="animate-fade-in-up">
          <ScreenHeader
            icon={Zap}
            eyebrow="Digital inputs"
            title="System Inputs"
            machine={device as string}
            connected={isConnected}
            onBack={() => router.push(`/menu/${device}`)}
          >
            <span className="border-primary/30 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 font-mono text-xs font-semibold tracking-[0.18em]">
              <TrendingUp className="h-3.5 w-3.5" />
              LIVE DATA
            </span>
          </ScreenHeader>
        </div>

        <StatStrip
          stats={[
            { label: "Total inputs", value: totalInputs, icon: Zap },
            {
              label: "Active faults",
              value: activeFaults,
              icon: AlertCircle,
              tone: activeFaults > 0 ? "danger" : "default",
            },
            { label: "Normal", value: normalStatus, icon: CheckCircle2, tone: "success" },
          ]}
        />

        <div className="surface glow-edge relative overflow-hidden">
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--primary), color-mix(in oklch, var(--chart-2) 80%, transparent), transparent)",
            }}
          />

          <div className="relative p-5">
            <div className="mb-4 flex items-center gap-2.5">
              <Shield className="text-primary h-3.5 w-3.5" />
              <span className="text-[10px] font-bold tracking-[0.22em] uppercase">
                Input status overview
              </span>
              <span className="bg-border/70 h-px flex-1" />
            </div>

            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-2.5">{renderList()}</div>
            </ScrollArea>

            <div className="border-border/70 mt-6 grid gap-3 border-t pt-5 md:grid-cols-2">
              <Button
                variant="outline"
                className="depth-lift h-12 text-sm font-semibold"
                onClick={() => router.push(`/menu/outputs/${device}`)}
              >
                <Gauge className="h-4 w-4" />
                View Outputs
              </Button>
              <Button
                variant="outline"
                className="depth-lift h-12 text-sm font-semibold"
                onClick={() => router.push(`/menu/inputs/analog/${device}`)}
              >
                <Settings className="h-4 w-4" />
                Analog Inputs
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
