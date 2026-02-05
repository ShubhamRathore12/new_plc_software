"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams, useRouter } from "next/navigation";
import { useAutoData } from "@/hooks/useAutoData";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { Power, Settings, Activity, AlertTriangle, CheckCircle, XCircle, Zap } from "lucide-react";

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
    if (deviceType === "GTPL-122-gT-1000T-S7-1200" || deviceType === "GTPL-121-gT-1000T-S7-1200" || deviceType === "GTPL-131-GT-650T-S7-1200") {
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
    else if (deviceType === "GTPL-118-gT-80E-P-S7-200" || deviceType === "GTPL-108-gT-40E-P-S7-200" || deviceType === "GTPL-109-gT-40E-P-S7-200" || deviceType === "GTPL-110-gT-40E-P-S7-200" || deviceType === "GTPL-111-gT-80E-P-S7-200" || deviceType === "GTPL-112-gT-80E-P-S7-200" || deviceType === "GTPL-113-gT-80E-P-S7-200") {
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
    else if (deviceType === "GTPL-115-gT-180E-S7-1200" || deviceType === 'GTPL-30-gT-180E-S7-1200') {
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
    else if (deviceType === "GTPL-132-300-AP-S7-1200" || deviceType === 'GTPL-139-GT-300AP-S7-1200') {
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
    else if (deviceType === "GTPL-124-GT-450T-S7-1200") {
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
    else if (deviceType === "GTPL-136-gT-450AP") {
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
        { id: "Q2.5", description: "Condenser fan3 on", dataKey: "Condenser_fan3_on_Q2_5" },
        { id: "Q2.6", description: "Condenser fan4 on", dataKey: "Condenser_fan4_on_Q2_6" },
        { id: "Q2.7", description: "CR valve 100% on", dataKey: "CR_valve_100_on_Q2_7" },
      ];
    }
    else if (deviceType === "GTPL-137-GT-450T-S7-1200" || deviceType === "GTPL-138-GT-450T-S7-1200") {
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
    else if (deviceType === "GTPL-139-GT-300AP-S7-1200") {
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

  const getStatus = (dataKey: string) => {
    if (!data) return false;
    const value = data[dataKey];

    if (device === "GTPL-118-gT-80E-P-S7-200") {
      return value === "tr";
    }

    if (device === "GTPL-122-gT-1000T-S7-1200" || device === "GTPL-131-GT-650T-S7-1200") {
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

    if (device === "GTPL-139-GT-300AP-S7-1200") {
      return value === true || value === 1 || value === "1" || value === "True" || value === "true";
    }

    return value === true || value === 1 || value === "1" || value === "tr" || value === "True" || value === "true";
  };

  const getStatusIcon = (key: string, status: boolean) => {
    if (key.includes("healthy") || key.includes("Healthy")) {
      return status ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />;
    }
    if (key.includes("fault") || key.includes("Fault")) {
      return status ? <XCircle className="w-4 h-4 text-red-500" /> : <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    if (key.includes("warning") || key.includes("Warning")) {
      return status ? <AlertTriangle className="w-4 h-4 text-yellow-500" /> : <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    return status ? <Power className="w-4 h-4 text-green-500" /> : <Power className="w-4 h-4 text-gray-400" />;
  };

  const getStatusColor = (key: string, status: boolean) => {
    if (key.includes("healthy") || key.includes("Healthy")) {
      return status ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-red-500 bg-red-50 dark:bg-red-900/20";
    }
    if (key.includes("fault") || key.includes("Fault")) {
      return status ? "border-red-500 bg-red-50 dark:bg-red-900/20" : "border-green-500 bg-green-50 dark:bg-green-900/20";
    }
    if (key.includes("warning") || key.includes("Warning")) {
      return status ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20" : "border-green-500 bg-green-50 dark:bg-green-900/20";
    }
    return status ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-gray-300 bg-gray-50 dark:bg-gray-800/20";
  };

  const getOutputIcon = (description: string) => {
    if (description.toLowerCase().includes('compressor')) return <Zap className="w-4 h-4 text-blue-500" />;
    if (description.toLowerCase().includes('fan')) return <Activity className="w-4 h-4 text-cyan-500" />;
    if (description.toLowerCase().includes('valve')) return <Settings className="w-4 h-4 text-purple-500" />;
    if (description.toLowerCase().includes('blower')) return <Activity className="w-4 h-4 text-green-500" />;
    if (description.toLowerCase().includes('heater')) return <Zap className="w-4 h-4 text-orange-500" />;
    return <Power className="w-4 h-4 text-gray-500" />;
  };

  if (!outputsData || outputsData.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <main className="flex-1 container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">OUTPUTS</h1>
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <main className="flex-1 container py-8" ref={containerRef}>
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-600">
              <Power className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                OUTPUT CONTROL
              </h1>
              <p className="text-muted-foreground mt-1">
                Real-time system outputs and control signals • {device}
                {!isConnected && (
                  <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full dark:bg-red-900 dark:text-red-300">
                    Disconnected
                  </span>
                )}
                {error && (
                  <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full dark:bg-red-900 dark:text-red-300">
                    Error: {error}
                  </span>
                )}
              </p>
            </div>
          </div>
        </motion.div>

        <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-0 shadow-2xl">
          <CardContent className="p-8">
            <ScrollArea className="h-[600px] pr-4">
              <div className="grid gap-4">
                {outputsData?.map((output, index) => {
                  const status = getStatus(output.dataKey);

                  return (
                    <motion.div
                      key={output.id}
                      ref={addToRefs}
                      className={`group flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-[1.02] ${getStatusColor(output.dataKey, status)}`}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                            <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300">
                              {output.id}
                            </span>
                          </div>
                          {getOutputIcon(output.description)}
                        </div>
                        <div>
                          <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                            {output.description}
                          </span>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {output.dataKey}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(output.dataKey, status)}
                          <span className={`text-sm font-bold ${status ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                            {status ? 'ON' : 'OFF'}
                          </span>
                        </div>
                        {status && (
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </ScrollArea>

            <motion.div
              className="flex gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button
                variant="outline"
                className="flex-1 h-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-800/30 dark:hover:to-purple-800/30 transition-all duration-300"
                onClick={() => router.push(`/menu/inputs/${device}`)}
              >
                <Activity className="w-4 h-4 mr-2" />
                INPUTS
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-12 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-700 hover:from-orange-100 hover:to-red-100 dark:hover:from-orange-800/30 dark:hover:to-red-800/30 transition-all duration-300"
                onClick={() => router.push(`/menu/inputs/analog/${device}`)}
              >
                <Settings className="w-4 h-4 mr-2" />
                ANALOG
              </Button>
            </motion.div>
          </CardContent>

          <div className="p-6 pt-0">
            <Button
              variant="outline"
              className="w-full h-12 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-700 dark:hover:to-slate-600 transition-all duration-300"
              onClick={() => router.push(`/menu/${device}`)}
            >
              ← BACK TO MENU
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}