"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams, useRouter } from "next/navigation";
import { useAutoData } from "@/hooks/useAutoData";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Power, Settings, Activity, AlertTriangle, CheckCircle, CircleDot, XCircle, Zap } from "lucide-react";
import {
  GTPL_156_157_DIGITAL_OUTPUT_ROWS,
  isGTPL156157,
  pickTagValue,
} from "@/lib/gtpl156157Config";
import ScreenHeader, { StatStrip } from "@/components/ScreenHeader";
import SignalRow from "@/components/SignalRow";

export default function OutputsPage() {
  const router = useRouter();
  const { outputs } = useParams();
  const device = outputs?.toString();
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  const { data, isConnected, error, formatValue } = useAutoData(device as string);

  // GSAP animations
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }

    // Animate items with stagger
    if (itemsRef.current.length > 0) {
      gsap.fromTo(itemsRef.current,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.08,
          delay: 0.3,
          ease: "power2.out"
        }
      );
    }
  }, [data]);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !itemsRef.current.includes(el)) {
      itemsRef.current.push(el);
    }
  };

  // Define outputs configuration based on device type
  const getOutputsConfig = (deviceType: string) => {
    if (deviceType === "GTPL-122-gT-1000T-S7-1200" || deviceType === "GTPL-121-gT-1000T-S7-1200" || deviceType === "GTPL-133-gT-650T-S7-1200" || deviceType === "GTPL-154-gT-650T-S7-1200" || deviceType === "GTPL-155-gT-650T-S7-1200" || deviceType === "GTPL-131-gT-650T-S7-1200" || deviceType === "GTPL-081-gT-650T-S7-1200" || deviceType === "GTPL-105-gT-650T-S7-1200" || deviceType === "GTPL-068-gT-650T-S7-1200" || deviceType === "GTPL-104-gT-650T-S7-1200") {
      return [
        { id: "Q0.0", description: "Compressor Start", dataKey: "Compressor_start_Q0_0" },
        { id: "Q0.1", description: "Compressor Module Reset", dataKey: "Compressor_module_reset_Q0_1" },
        { id: "Q0.2", description: "CR Valve 25% ON", dataKey: "CR_valve_25_percent_ON_Q0_2" },
        { id: "Q0.3", description: "CR Valve 50% ON", dataKey: "CR_valve_50_percent_ON_Q0_3" },
        { id: "Q0.4", description: "Solenoid Valve ON", dataKey: "Solenoid_valve_ON_Q0_4" },
        { id: "Q0.5", description: "Hot Gas Valve ON", dataKey: "Hot_gas_valve_ON_Q0_5" },
        { id: "Q0.6", description: "AHT Valve ON", dataKey: "AHT_valve_ON_Q0_6" },
        { id: "Q0.7", description: "Blower Drive Start", dataKey: "Blower_drive_start_Q0_7" },
        { id: "Q1.0", description: "System Warning", dataKey: "System_warning_Q1_0" },
        { id: "Q1.1", description: "Chiller Healthy", dataKey: "Chiller_healthy_Q1_1" },
        { id: "Q2.1", description: "Cond Fan 1 ON", dataKey: "Cond_fan_1_ON_Q2_1" },
        { id: "Q2.2", description: "CR Valve 75% ON", dataKey: "CR_valve_75_percent_ON_Q2_2" },
        { id: "Q2.3", description: "Chiller Fault", dataKey: "Chiller_fault_Q2_3" },
        { id: "Q2.4", description: "Cond Fan 2 ON", dataKey: "Cond_fan_2_ON_Q2_4" },
        { id: "Q2.5", description: "Cond Fan 3 ON", dataKey: "Cond_fan_3_ON_Q2_5" },
        { id: "Q2.6", description: "Cond Fan 4 ON", dataKey: "Cond_fan_4_ON_Q2_6" },
        { id: "Q2.7", description: "CR Valve 100% ON", dataKey: "CR_valve_100_percent_ON_Q2_7" },
        { id: "Q3.0", description: "Cond Fan 5 ON", dataKey: "Cond_fan_5_ON_Q3_0" },
        { id: "Q3.1", description: "Cond Fan 6 ON", dataKey: "Cond_fan_6_ON_Q3_1" },
      ];
    }
    // else if (device === "GTPL-121-gT-1000T-S7-1200") {
    //   return [
    //     { id: "1", description: "Compressor Start", dataKey: "Compressor Start" },
    //     { id: "2", description: "Compressor Module Reset", dataKey: "Compressor Module Reset" },
    //     { id: "3", description: "CR Valve 25% ON", dataKey: "CR Valve 25% ON" },
    //     { id: "4", description: "CR Valve 50% ON", dataKey: "CR Valve 50% ON" },
    //     { id: "5", description: "Solenoid Valve ON", dataKey: "Solenoid Valve ON" },
    //     { id: "6", description: "Hot Gas Valve ON", dataKey: "Hot Gas Valve ON" },
    //     { id: "7", description: "AHT Valve ON", dataKey: "AHT Valve ON" },
    //     { id: "8", description: "Blower Drive Start", dataKey: "Blower Drive Start" },
    //     { id: "9", description: "System Warning", dataKey: "System Warning" },
    //     { id: "10", description: "Chiller Healthy", dataKey: "Chiller Healthy" },
    //     { id: "11", description: "Cond Fan 1 ON", dataKey: "Cond Fan 1 ON" },
    //     { id: "12", description: "CR Valve 75% ON", dataKey: "CR Valve 75% ON" },
    //     { id: "13", description: "Chiller Fault", dataKey: "Chiller Fault" },
    //     { id: "14", description: "Cond Fan 2 ON", dataKey: "Cond Fan 2 ON" },
    //     { id: "15", description: "Cond Fan 3 ON", dataKey: "Cond Fan 3 ON" },
    //     { id: "16", description: "Cond Fan 4 ON", dataKey: "Cond Fan 4 ON" },
    //     { id: "17", description: "CR Valve 100% ON", dataKey: "CR Valve 100% ON" },
    //     { id: "18", description: "Cond Fan 5 ON", dataKey: "Cond Fan 5 ON" },
    //     { id: "19", description: "Cond Fan 6 ON", dataKey: "Cond Fan 6 ON" },
    //   ];
    // }
    else if (deviceType === "GTPL-118-gT-60T-S7-200" || deviceType === "GTPL-149-gT-60T-S7-1200") {
      return [
        { id: "Q0.0", description: "Compressor on", dataKey: "Compressor_on_Q0_0" },
        { id: "Q0.1", description: "Compressor motor reset", dataKey: "Compressor_motor_reset_Q0_1" },
        { id: "Q0.2", description: "Solenoid valve on", dataKey: "Solenoid_valve_on_Q0_2" },
        { id: "Q0.3", description: "Hot gas valve on", dataKey: "Hot_gas_valve_on_Q0_3" },
        { id: "Q0.4", description: "After heat valve on", dataKey: "After_heat_valve_on_Q0_4" },
        { id: "Q0.5", description: "Blower drive on", dataKey: "Blower_drive_on_Q0_5" },
        { id: "Q0.6", description: "Collective trouble signal", dataKey: "Collective_Trouble_Signal_Q0_6" },
        { id: "Q0.7", description: "Chiller healthy", dataKey: "Chiller_healthy_on_Q0_7" },
        { id: "Q1.0", description: "Condenser fan on", dataKey: "Condenser_fan_on_Q1_0" },
        { id: "Q1.1", description: "Chiller fault", dataKey: "Chiller_Fault_Q1_1" },
      ];
    }
    else if (deviceType === "GTPL-108-gT-40E-P-S7-200" || deviceType === "GTPL-109-gT-40E-P-S7-200" || deviceType === "GTPL-110-gT-40E-P-S7-200" || deviceType === "GTPL-111-gT-80E-P-S7-200" || deviceType === "GTPL-112-gT-80E-P-S7-200" || deviceType === "GTPL-113-gT-80E-P-S7-200") {
      return [
        { id: "1", description: "Blower Drive", dataKey: "BLOWER_DRIVE_ENABLE" },
        { id: "2", description: "Heater Drive", dataKey: "heater_on" },
        { id: "3", description: "Condensor", dataKey: "cond_fan_on" },
        { id: "4", description: "Compressor", dataKey: "COMPRESSOR_ON" },
        { id: "5", description: "Hot Gas Valve", dataKey: "HOT_GAS_VALVE_ON" },
        { id: "6", description: "After Heat Valve", dataKey: "AFTER_HEAT_VALVE_ON" },
        { id: "7", description: "Chiller Healthy", dataKey: "GREEN_LIGHT" },
        { id: "8", description: "Chiller Warning", dataKey: "YELLOW_LIGHT" },
        { id: "9", description: "Chiller Fault", dataKey: "RED_LIGHT" },
        { id: "10", description: "Buzzer on", dataKey: "BUZZER_ON" },
      ];
    }
    else if (deviceType === "GTPL-116-gT-240E-S7-1200" || deviceType === "GTPL-117-gT-320E-S7-1200") {
      return [
        { id: "1", description: "Blower drive on", dataKey: "Blower_drive_on_Q0_0" },
        { id: "2", description: "Condenser fan1 on", dataKey: "Condenser_fan1_on_Q0_1" },
        { id: "3", description: "Heater drive on", dataKey: "Heater_drive_on_Q0_2" },
        { id: "4", description: "Condenser fan drive on", dataKey: "Condenser_fan_drive_on_Q0_3" },
        { id: "5", description: "Compressor on", dataKey: "Compressor_on_Q0_4" },
        { id: "6", description: "Compressor reset on", dataKey: "Compressor_reset_on_Q0_5" },
        { id: "7", description: "Solenoid valve on", dataKey: "Solenoid_valve_on_Q0_6" },
        { id: "8", description: "Hot gas valve on", dataKey: "Hot_gas_valve_on_Q0_7" },
        { id: "9", description: "After heat motor valve on", dataKey: "After_heat_motor_valve_on_Q1_0" },
        { id: "10", description: "Chiller healthy on", dataKey: "Chiller_healthy_on_Q1_1" },
        { id: "11", description: "Chiller Fault on", dataKey: "Chiller_Fault_on_Q2_0" },
        { id: "12", description: "Collective Trouble Signal on", dataKey: "Collective_Trouble_Signal_on_Q2_1" },
        { id: "13", description: "Buzzer on", dataKey: "Buzzer_on_Q2_2" },
        { id: "14", description: "Condenser fan2 on", dataKey: "Condenser_fan2_on_Q2_3" },
      ];
    }
    else if (deviceType === "GTPL-115-gT-180E-S7-1200" || deviceType === 'GTPL-030-gT-180E-S7-1200' || deviceType === "GTPL-119-gT-180E-S7-1200" || deviceType === "GTPL-120-gT-180E-S7-1200" || deviceType === "GTPL-044-GT-140E-S7-1200") {
      return [
        { id: "1", description: "Blower drive", dataKey: "Blower_drive_on_Q0_0" },
        { id: "2", description: "Heater drive", dataKey: "Heater_drive_on_Q0_2" },
        { id: "3", description: "Condenser fan drive", dataKey: "Condenser_fan_drive_on_Q0_3" },
        { id: "4", description: "Compressor", dataKey: "Compressor_on_Q0_4" },
        { id: "5", description: "Compressor reset", dataKey: "Compressor_reset_on_Q0_5" },
        { id: "6", description: "Solenoid valve", dataKey: "Solenoid_valve_on_Q0_6" },
        { id: "7", description: "Hot gas valve", dataKey: "Hot_gas_valve_on_Q0_7" },
        { id: "8", description: "After heat motor valve", dataKey: "After_heat_motor_valve_on_Q1_0" },
        { id: "9", description: "Chiller healthy", dataKey: "Chiller_healthy_on_Q1_1" },
        { id: "10", description: "Chiller Fault", dataKey: "Chiller_Fault_on_Q2_0" },
        { id: "11", description: "Collective Trouble Signal", dataKey: "Collective_Trouble_Signal_on_Q2_1" },
        { id: "12", description: "Buzzer on", dataKey: "Buzzer_on_Q2_2" },
      ];
    }
    else if (deviceType === "GTPL-132-300-AP-S7-1200" || deviceType === 'GTPL-139-gT-300AP-S7-1200' || deviceType === 'GTPL-144-gT-300AP-S7-1200' || deviceType === 'GTPL-142-gT-450AP-S7-1200' || deviceType === 'GTPL-123-gT-450AP' || deviceType === 'GTPL-143-gT-450AP-S7-1200' || deviceType === 'GTPL-136-gT-450AP') {
      return [
        { id: "Q0.0", description: "Compressor_on", dataKey: "Compressor_on_Q0_0" },
        { id: "Q0.1", description: "Compressor_motor_reset", dataKey: "Compressor_motor_reset_Q0_1" },
        { id: "Q0.2", description: "CR_valve_25%_on", dataKey: "CR_valve_25_percent_on_Q0_2" },
        { id: "Q0.3", description: "CR_valve_50%_on", dataKey: "CR_valve_50_percent_on_Q0_3" },
        { id: "Q0.4", description: "Solenoid_valve_on", dataKey: "Solenoid_valve_on_Q0_4" },
        { id: "Q0.5", description: "Hot_gas_valve_on", dataKey: "Hot_gas_valve_on_Q0_5" },
        { id: "Q0.6", description: "After_heat_valve_on", dataKey: "After_heat_valve_on_Q0_6" },
        { id: "Q0.7", description: "Blower_drive_on", dataKey: "Blower_drive_on_Q0_7" },
        { id: "Q1.0", description: "Collective_trouble_signal", dataKey: "Collective_trouble_signal_Q1_0" },
        { id: "Q1.1", description: "Chiller_healthy_on", dataKey: "Chiller_healthy_on_Q1_1" },
        { id: "Q2.0", description: "Spare", dataKey: "Spare_Q2_0" },
        { id: "Q2.1", description: "Condenser_fan1_on", dataKey: "Condenser_fan1_on_Q2_1" },
        { id: "Q2.2", description: "CR valve 75% on", dataKey: "CR_valve_75_percent_on_Q2_2" },
        { id: "Q2.3", description: "Chiller_fault", dataKey: "Chiller_Fault_Q2_3" },
        { id: "Q2.4", description: "Condenser_fan2_on", dataKey: "Condenser_fan2_on_Q2_4" },
        { id: "Q2.5", description: "CR_valve_100%_on", dataKey: "CR_valve_100_percent_on_Q2_5" },
        { id: "Q2.6", description: "Spare", dataKey: "Spare_Q2_6" },
      ];
    }
    else if (deviceType === "GTPL-124-gT-450T-S7-1200") {
      return [
        { id: "1", description: "Compressor", dataKey: "Compressor_on_Q0_0" },
        { id: "2", description: "Compressor motor reset", dataKey: "Compressor_motor_reset_Q0_1" },
        { id: "3", description: "Spare", dataKey: "Spare_Q0_2" },
        { id: "4", description: "Spare", dataKey: "Spare_Q0_3" },
        { id: "5", description: "Solenoid valve", dataKey: "Solenoid_valve_on_Q0_4" },
        { id: "6", description: "Hot gas valve", dataKey: "Hot_gas_valve_on_Q0_5" },
        { id: "7", description: "After heat valve", dataKey: "After_heat_valve_on_Q0_6" },
        { id: "8", description: "Blower drive", dataKey: "Blower_drive_on_Q0_7" },
        { id: "9", description: "Collective trouble signal", dataKey: "Collective_trouble_signal_Q1_0" },
        { id: "10", description: "Chiller healthy", dataKey: "Chiller_healthy_on_Q1_1" },
        { id: "11", description: "Spare", dataKey: "Spare_Q2_0" },
        { id: "12", description: "Condenser fan 1", dataKey: "Condenser_fan1_on_Q2_1" },
        { id: "13", description: "Spare", dataKey: "Spare_Q2_2" },
        { id: "14", description: "Chiller fault", dataKey: "Chiller_fault_Q2_3" },
        { id: "15", description: "Condenser fan 2", dataKey: "Condenser_fan2_on_Q2_4" },
        { id: "16", description: "Condenser fan 3", dataKey: "Condenser_fan3_on_Q2_5" },
        { id: "17", description: "Condenser fan 4", dataKey: "Condenser_fan4_on_Q2_6" },
      ];
    }
    // GTPL-156 / 157 (Philippines silo) — digital outputs from the SILO I/O list
    else if (isGTPL156157(deviceType)) {
      return GTPL_156_157_DIGITAL_OUTPUT_ROWS.map((row) => ({
        id: row.id,
        description: row.description,
        dataKey: row.tag,
      }));
    }
    else if (deviceType === "GTPL-134-gT-450T-S7-1200" || deviceType === "GTPL-135-gT-450T-S7-1200" || deviceType === "GTPL-145-gT-450T-S7-1200" || deviceType === "GTPL-148-gT-450T-S7-1200") {
      return [
        { id: "Q0.0", description: "Compressor on", dataKey: "Compressor_on_Q0_0" },
        { id: "Q0.1", description: "Compressor motor reset", dataKey: "Compressor_motor_reset_Q0_1" },
        { id: "Q0.2", description: "CR 25% ON", dataKey: "CR_25_percent_ON_Q0_2" },
        { id: "Q0.3", description: "CR 50% ON", dataKey: "CR_50_percent_ON_Q0_3" },
        { id: "Q0.4", description: "Solenoid valve on", dataKey: "Solenoid_valve_on_Q0_4" },
        { id: "Q0.5", description: "Hot gas valve on", dataKey: "Hot_gas_valve_on_Q0_5" },
        { id: "Q0.6", description: "After heat valve on", dataKey: "After_heat_valve_on_Q0_6" },
        { id: "Q0.7", description: "Blower drive on", dataKey: "Blower_drive_on_Q0_7" },
        { id: "Q1.0", description: "Collective trouble signal", dataKey: "Collective_trouble_signal_Q1_0" },
        { id: "Q1.1", description: "Chiller healthy on", dataKey: "Chiller_healthy_on_Q1_1" },
        { id: "Q2.0", description: "Spare", dataKey: "Spare_Q2_0" },
        { id: "Q2.1", description: "Condenser fan1 on", dataKey: "Condenser_fan1_on_Q2_1" },
        { id: "Q2.2", description: "CR valve 75% on", dataKey: "CR_valve_75_percent_on_Q2_2" },
        { id: "Q2.3", description: "Chiller fault", dataKey: "Chiller_fault_Q2_3" },
        { id: "Q2.4", description: "Condenser fan2 on", dataKey: "Condenser_fan2_on_Q2_4" },
        { id: "Q2.5", description: "Condenser fan3 on", dataKey: "Condenser_fan3_on_Q2_5" },
        { id: "Q2.6", description: "Condenser fan4 on", dataKey: "Condenser_fan4_on_Q2_6" },
        { id: "Q2.7", description: "CR 100% ON", dataKey: "CR_100_percent_ON_Q2_7" },
      ];
    }
    else if (deviceType === "GTPL-137-gT-450T-S7-1200" || deviceType === "GTPL-138-gT-450T-S7-1200") {
      return [
        { id: "1", description: "Compressor", dataKey: "Compressor_on_Q0_0" },
        { id: "2", description: "Compressor motor reset", dataKey: "Compressor_motor_reset_Q0_1" },
        { id: "3", description: "Spare", dataKey: "Spare_Q0_2" },
        { id: "4", description: "Spare", dataKey: "Spare_Q0_3" },
        { id: "5", description: "Solenoid valve", dataKey: "Solenoid_valve_on_Q0_4" },
        { id: "6", description: "Hot gas valve", dataKey: "Hot_gas_valve_on_Q0_5" },
        { id: "7", description: "After heat valve", dataKey: "After_heat_valve_on_Q0_6" },
        { id: "8", description: "Blower drive", dataKey: "Blower_drive_on_Q0_7" },
        { id: "9", description: "Collective trouble signal", dataKey: "Collective_trouble_signal_Q1_0" },
        { id: "10", description: "Chiller healthy", dataKey: "Chiller_healthy_on_Q1_1" },
        { id: "11", description: "Spare", dataKey: "Spare_Q2_0" },
        { id: "12", description: "Condenser fan 1", dataKey: "Condenser_fan1_on_Q2_1" },
        { id: "13", description: "CR valve 75% on", dataKey: "CR valve 75% on_Q2_2" },
        { id: "14", description: "Chiller fault", dataKey: "Chiller_fault_Q2_3" },
        { id: "15", description: "Condenser fan 2", dataKey: "Condenser_fan2_on_Q2_4" },
        { id: "16", description: "Condenser fan 3", dataKey: "Condenser_fan3_on_Q2_5" },
        { id: "17", description: "Condenser fan 4", dataKey: "Condenser_fan4_on_Q2_6" },
      ];
    }
    else if (deviceType === "GTPL-061-gT-450T-S7-1200") {
      return [
        { id: "Q0.0", description: "Compressor on", dataKey: "Compressor_on_Q0_0" },
        { id: "Q0.1", description: "Compressor motor reset", dataKey: "Compressor_motor_reset_Q0_1" },
        { id: "Q0.2", description: "CR 25% ON", dataKey: "CR_25%_ON_Q0_2" },
        { id: "Q0.3", description: "CR 50% ON", dataKey: "CR_50%_ON_Q0_3" },
        { id: "Q0.4", description: "Solenoid valve on", dataKey: "Solenoid_valve_on_Q0_4" },
        { id: "Q0.5", description: "Hot gas valve on", dataKey: "Hot_gas_valve_on_Q0_5" },
        { id: "Q0.6", description: "After heat valve on", dataKey: "After_heat_valve_on_Q0_6" },
        { id: "Q0.7", description: "Blower drive on", dataKey: "Blower_drive_on_Q0_7" },
        { id: "Q1.0", description: "Collective trouble signal", dataKey: "Collective_trouble_signal_Q1_0" },
        { id: "Q1.1", description: "Chiller healthy on", dataKey: "Chiller_healthy_on_Q1_1" },
        { id: "Q2.0", description: "Spare", dataKey: "Spare_Q2_0" },
        { id: "Q2.1", description: "Condenser fan1 on", dataKey: "Condenser_fan1_on_Q2_1" },
        { id: "Q2.2", description: "CR valve 75% on", dataKey: "CR valve 75% on_Q2_2" },
        { id: "Q2.3", description: "Chiller fault", dataKey: "Chiller_fault_Q2_3" },
        { id: "Q2.4", description: "Condenser fan2 on", dataKey: "Condenser_fan2_on_Q2_4" },
        { id: "Q2.5", description: "Condenser fan3 on", dataKey: "Condenser_fan3_on_Q2_5" },
        { id: "Q2.6", description: "Condenser fan4 on", dataKey: "Condenser_fan4_on_Q2_6" },
        { id: "Q2.7", description: "CR 100% ON", dataKey: "CR_100%_ON_Q2_7" },
      ];
    }
    else if (deviceType === "GTPL-139-gT-300AP-S7-1200" || deviceType === "GTPL-144-gT-300AP-S7-1200") {
      return [
        { id: "Q0.0", description: "Compressor on", dataKey: "Compressor_on_Q0_0" },
        { id: "Q0.1", description: "Compressor motor reset", dataKey: "Compressor_motor_reset_Q0_1" },
        { id: "Q0.2", description: "CR valve 25% on", dataKey: "CR_valve_25_on_Q0_2" },
        { id: "Q0.3", description: "CR valve 50% on", dataKey: "CR_valve_50_on_Q0_3" },
        { id: "Q0.4", description: "Solenoid valve on", dataKey: "Solenoid_valve_on_Q0_4" },
        { id: "Q0.5", description: "Hot gas valve on", dataKey: "Hot_gas_valve_on_Q0_5" },
        { id: "Q0.6", description: "After heat valve on", dataKey: "After_heat_valve_on_Q0_6" },
        { id: "Q0.7", description: "Blower drive on", dataKey: "Blower_drive_on_Q0_7" },
        { id: "Q1.0", description: "Collective Trouble Signal", dataKey: "Collective_Trouble_Signal_Q1_0" },
        { id: "Q1.1", description: "Chiller healthy on", dataKey: "Chiller_healthy_on_Q1_1" },
        { id: "Q2.0", description: "Spare", dataKey: "Spare_Q2_0" },
        { id: "Q2.1", description: "Condenser fan1 on", dataKey: "Condenser_fan1_on_Q2_1" },
        { id: "Q2.2", description: "CR valve 75% on", dataKey: "CR_valve_75_on_Q2_2" },
        { id: "Q2.3", description: "Chiller Fault", dataKey: "Chiller_Fault_Q2_3" },
        { id: "Q2.4", description: "Condenser fan2 on", dataKey: "Condenser_fan2_on_Q2_4" },
        { id: "Q2.5", description: "Spare", dataKey: "Spare_Q2_5" },
        { id: "Q2.6", description: "Spare", dataKey: "Spare_Q2_6" },
        { id: "Q2.7", description: "CR valve 100% on", dataKey: "CR_valve_100_on_Q2_7" },
      ];
    }

    return [];
  };

  const outputsData = getOutputsConfig(device || "");

  // Dynamically resolve dataKey: try exact match first, then try alternative CR valve naming conventions
  const resolveDataKey = (dataKey: string): unknown => {
    if (!data) return undefined;
    if (data[dataKey] !== undefined) return data[dataKey];

    // Try alternative CR valve naming patterns
    const crPatterns: Record<string, string[]> = {
      // 25% variants
      "CR_valve_25_percent_on_Q0_2": ["CR_25_percent_ON_Q0_2", "CR_valve_25_percent_ON_Q0_2", "CR_25%_ON_Q0_2", "CR_valve_25_on_Q0_2"],
      "CR_25_percent_ON_Q0_2": ["CR_valve_25_percent_on_Q0_2", "CR_valve_25_percent_ON_Q0_2", "CR_25%_ON_Q0_2", "CR_valve_25_on_Q0_2"],
      "CR_valve_25_percent_ON_Q0_2": ["CR_valve_25_percent_on_Q0_2", "CR_25_percent_ON_Q0_2", "CR_25%_ON_Q0_2", "CR_valve_25_on_Q0_2"],
      "CR_25%_ON_Q0_2": ["CR_valve_25_percent_on_Q0_2", "CR_25_percent_ON_Q0_2", "CR_valve_25_percent_ON_Q0_2", "CR_valve_25_on_Q0_2"],
      "CR_valve_25_on_Q0_2": ["CR_valve_25_percent_on_Q0_2", "CR_25_percent_ON_Q0_2", "CR_valve_25_percent_ON_Q0_2", "CR_25%_ON_Q0_2"],
      // 50% variants
      "CR_valve_50_percent_on_Q0_3": ["CR_50_percent_ON_Q0_3", "CR_valve_50_percent_ON_Q0_3", "CR_50%_ON_Q0_3", "CR_valve_50_on_Q0_3"],
      "CR_50_percent_ON_Q0_3": ["CR_valve_50_percent_on_Q0_3", "CR_valve_50_percent_ON_Q0_3", "CR_50%_ON_Q0_3", "CR_valve_50_on_Q0_3"],
      "CR_valve_50_percent_ON_Q0_3": ["CR_valve_50_percent_on_Q0_3", "CR_50_percent_ON_Q0_3", "CR_50%_ON_Q0_3", "CR_valve_50_on_Q0_3"],
      "CR_50%_ON_Q0_3": ["CR_valve_50_percent_on_Q0_3", "CR_50_percent_ON_Q0_3", "CR_valve_50_percent_ON_Q0_3", "CR_valve_50_on_Q0_3"],
      "CR_valve_50_on_Q0_3": ["CR_valve_50_percent_on_Q0_3", "CR_50_percent_ON_Q0_3", "CR_valve_50_percent_ON_Q0_3", "CR_50%_ON_Q0_3"],
      // 75% variants
      "CR_valve_75_percent_on_Q2_2": ["CR_75_percent_ON_Q2_2", "CR_valve_75_percent_ON_Q2_2", "CR valve 75% on_Q2_2", "CR_valve_75_on_Q2_2"],
      "CR_75_percent_ON_Q2_2": ["CR_valve_75_percent_on_Q2_2", "CR_valve_75_percent_ON_Q2_2", "CR valve 75% on_Q2_2", "CR_valve_75_on_Q2_2"],
      "CR_valve_75_percent_ON_Q2_2": ["CR_valve_75_percent_on_Q2_2", "CR_75_percent_ON_Q2_2", "CR valve 75% on_Q2_2", "CR_valve_75_on_Q2_2"],
      "CR valve 75% on_Q2_2": ["CR_valve_75_percent_on_Q2_2", "CR_75_percent_ON_Q2_2", "CR_valve_75_percent_ON_Q2_2", "CR_valve_75_on_Q2_2"],
      "CR_valve_75_on_Q2_2": ["CR_valve_75_percent_on_Q2_2", "CR_75_percent_ON_Q2_2", "CR_valve_75_percent_ON_Q2_2", "CR valve 75% on_Q2_2"],
      // 100% variants
      "CR_valve_100_percent_on_Q2_5": ["CR_100_percent_ON_Q2_7", "CR_valve_100_percent_ON_Q2_7", "CR_100%_ON_Q2_7", "CR_valve_100_on_Q2_7", "CR_valve_100_percent_on_Q2_7"],
      "CR_100_percent_ON_Q2_7": ["CR_valve_100_percent_on_Q2_5", "CR_valve_100_percent_ON_Q2_7", "CR_100%_ON_Q2_7", "CR_valve_100_on_Q2_7", "CR_valve_100_percent_on_Q2_7"],
      "CR_valve_100_percent_ON_Q2_7": ["CR_valve_100_percent_on_Q2_5", "CR_100_percent_ON_Q2_7", "CR_100%_ON_Q2_7", "CR_valve_100_on_Q2_7"],
      "CR_100%_ON_Q2_7": ["CR_valve_100_percent_on_Q2_5", "CR_100_percent_ON_Q2_7", "CR_valve_100_percent_ON_Q2_7", "CR_valve_100_on_Q2_7"],
      "CR_valve_100_on_Q2_7": ["CR_valve_100_percent_on_Q2_5", "CR_100_percent_ON_Q2_7", "CR_valve_100_percent_ON_Q2_7", "CR_100%_ON_Q2_7"],
      // Collective trouble signal variants
      "Collective_trouble_signal_Q1_0": ["Collective_Trouble_Signal_Q1_0"],
      "Collective_Trouble_Signal_Q1_0": ["Collective_trouble_signal_Q1_0"],
      // Chiller fault variants
      "Chiller_fault_Q2_3": ["Chiller_Fault_Q2_3"],
      "Chiller_Fault_Q2_3": ["Chiller_fault_Q2_3"],
    };

    const alternatives = crPatterns[dataKey];
    if (alternatives) {
      for (const alt of alternatives) {
        if (data[alt] !== undefined) return data[alt];
      }
    }

    // SILO (156/157) PLC tag name -> logged column name
    const siloRow = GTPL_156_157_DIGITAL_OUTPUT_ROWS.find((r) => r.tag === dataKey);
    if (siloRow) return pickTagValue(data, siloRow.keys);

    return undefined;
  };

  const totalOutputs = outputsData?.length ?? 0;
  const getStatus = (dataKey: string) => {
    if (!data) return false;
    const value = resolveDataKey(dataKey);

    if (device === "GTPL-118-gT-60T-S7-200" || device === "GTPL-149-gT-60T-S7-1200") {
      return value === "tr";
    }

    if (device === "GTPL-122-gT-1000T-S7-1200" || device === "GTPL-133-gT-650T-S7-1200" || device === "GTPL-154-gT-650T-S7-1200" || device === "GTPL-155-gT-650T-S7-1200" || device === "GTPL-131-gT-650T-S7-1200" || device === "GTPL-081-gT-650T-S7-1200" || device === "GTPL-105-gT-650T-S7-1200" || device === "GTPL-068-gT-650T-S7-1200" || device === "GTPL-104-gT-650T-S7-1200") {
      return value === "true" || value === 1 || value === "1" || value === true || value === "True";
    }

    if (device === "GTPL-115-gT-180E-S7-1200") {
      return value === true || value === 1 || value === "1" || value === "True" || value === "true";
    }

    if (device === "GTPL-116-gT-240E-S7-1200") {
      return value === true || value === 1 || value === "1" || value === "True" || value === "true";
    }
    if (device === "GTPL-136-gT-450AP") {
      return value === true || value === 1 || value === "1" || value === "True" || value === "true";
    }

    if (device === "GTPL-139-gT-300AP-S7-1200") {
      return value === true || value === 1 || value === "1" || value === "True" || value === "true";
    }

    return value === true || value === 1 || value === "1" || value === "tr" || value === "True" || value === "true";
  };



  const activeOutputs =
    outputsData?.filter((o) => getStatus(o.dataKey)).length ?? 0;
  const idleOutputs = totalOutputs - activeOutputs;


  if (!outputsData || outputsData.length === 0) {
    return (
      <div className="bg-background flex min-h-screen flex-col">
        <main className="flex-1 container py-8">
          <div className="mb-8">
            <h1 className="gradient-text mb-2 text-3xl font-semibold tracking-tight">OUTPUTS</h1>
            <p className="text-yellow-600">No outputs configuration found for device: {device}</p>
          </div>
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                No outputs available for this device type.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
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

      <main
        className="relative z-10 mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-8"
        ref={containerRef}
      >
        <div className="animate-fade-in-up">
          <ScreenHeader
            icon={Power}
            eyebrow="Digital outputs"
            title="Output Control"
            machine={device as string}
            connected={isConnected}
            onBack={() => router.push(`/menu/${device}`)}
          />
          {error && (
            <div className="border-destructive/30 bg-destructive/10 text-destructive mt-4 rounded-lg border px-3 py-2 text-sm">
              {error}
            </div>
          )}
        </div>

        <StatStrip
          stats={[
            { label: "Total outputs", value: totalOutputs, icon: Power },
            { label: "Energised", value: activeOutputs, icon: Zap, tone: "success" },
            { label: "Idle", value: idleOutputs, icon: CircleDot },
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
              <Power className="text-primary h-3.5 w-3.5" />
              <span className="text-[10px] font-bold tracking-[0.22em] uppercase">
                Output status overview
              </span>
              <span className="bg-border/70 h-px flex-1" />
            </div>

            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-2.5">
                {outputsData?.map((output, index) => (
                  <SignalRow
                    key={output.id}
                    id={output.id}
                    description={output.description}
                    active={getStatus(output.dataKey)}
                    index={index}
                    tone="energised"
                    activeLabel={output.dataKey}
                    idleLabel={output.dataKey}
                  />
                ))}
              </div>
            </ScrollArea>

            <div className="border-border/70 mt-6 grid gap-3 border-t pt-5 md:grid-cols-2">
              <Button
                variant="outline"
                className="depth-lift h-12 text-sm font-semibold"
                onClick={() => router.push(`/menu/inputs/${device}`)}
              >
                <Activity className="h-4 w-4" />
                INPUTS
              </Button>
              <Button
                variant="outline"
                className="depth-lift h-12 text-sm font-semibold"
                onClick={() => router.push(`/menu/inputs/analog/${device}`)}
              >
                <Settings className="h-4 w-4" />
                ANALOG
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
