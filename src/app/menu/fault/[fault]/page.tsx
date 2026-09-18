"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAutoData } from "@/hooks/useAutoData";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import FaultLogsPaginated from "@/components/FaultLogsPaginated";
import { FaultCodeTable } from "@/components/FaultCodeTable";
import { ActiveTagsTable } from "@/components/ActiveTagsTable";
import {
  resolveMachineName,
  getMachineConfig,
  getFaultCodesForMachine,
  getTagsForMachine,
  getMachineType,
  isActiveTag,
  getActiveFaults,
  getActiveFaultColumns,
} from "@/lib/faultConfig";
import { useLanguage } from "@/providers/language-provider";
import ScreenHeader, { StatStrip } from "@/components/ScreenHeader";
import { AlertTriangle, ListFilter, ShieldAlert } from "lucide-react";

interface FaultCode {
  code: number;
  description: string;
  /** Authoritative time of the last occurrence, when the API supplies one.
   *  Absent today — never substitute the current time for it. */
  lastOccurrenceAt?: string | null;
}

export default function FaultPage() {
  const [currentView, setCurrentView] = useState("faultLogs");
  const [selectedFault, setSelectedFault] = useState<FaultCode | null>(null);
  const router = useRouter();
  const { fault } = useParams();

  // Resolve machine name using the configuration
  const machineName = resolveMachineName(fault as string);
  const { data, isConnected, error, formatValue } = useAutoData(machineName);
  const { t } = useLanguage();
  // Get machine configuration
  const machineConfig = getMachineConfig(machineName);
  const machineType = getMachineType(machineName);
  const faultCodes = getFaultCodesForMachine(machineName);
  const faultColumns = getActiveFaultColumns(machineName);
  
  // Get active faults from the fault columns in database
  const activeFaults = getActiveFaults(machineName, data);
  const currentTags = getTagsForMachine(machineName, data);

  const handleViewFaultCode = (faultItem: FaultCode) => {
    setSelectedFault(faultItem);
    setCurrentView("viewFaultCode");
  };

  const handleBackToMenu = () => {
    router.push(`/menu/${fault}`);
  };

  // View Fault Code Details Screen
  if (currentView === "viewFaultCode" && selectedFault) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              FAULT CODE DETAILS - {machineType}
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
                    <strong>Model:</strong> {machineType}
                  </p>
                  <p>
                    <strong>Machine Name:</strong> {machineName}
                  </p>
                  {/* The API does not yet return an authoritative event time
                      (lastOccurrenceAt is open backend work). Rendering
                      Date.now() here invented a fault time on a safety screen,
                      so the field states that nothing is recorded instead. */}
                  <p>
                    <strong>{t("last_occurrence")}:</strong>{" "}
                    {selectedFault.lastOccurrenceAt
                      ? new Date(selectedFault.lastOccurrenceAt).toLocaleString()
                      : t("no_occurrence_recorded")}
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-4">Active System Tags</h3>
              <ActiveTagsTable tags={currentTags} />
            </CardContent>

            <div className="p-6 pt-0">
              <Button
                variant="outline"
                onClick={() => setCurrentView("faultCodes")}
              >
                BACK TO FAULT CODES
              </Button>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  // Paginated Logs View
  if (currentView === "allPaginatedLogs") {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 container py-8">
          <FaultLogsPaginated machineName={machineName} />
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

  // Active Alarms/Fault Logs Screen
  if (currentView === "faultLogs") {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {t("Active Alarms")}
            </h1>
            <p className="text-muted-foreground">
              {t("Current active fault tags for")} {machineName}
            </p>
            {!isConnected && (
              <div className="mt-2 p-2 bg-yellow-100 text-yellow-800 rounded">
                Warning: Not connected to machine data
              </div>
            )}
            {error && (
              <div className="mt-2 p-2 bg-red-100 text-red-800 rounded">
                Error: {error}
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="mb-4 flex justify-end gap-2">
            {machineName === "GTPL-061-gT-450T-S7-1200" ||
            machineName === "GTPL-121-gT-1000T-S7-1200" ||
            machineName === "GTPL-122-gT-1000T-S7-1200" ||
            machineName === "GTPL-123-gT-450AP" ||
            machineName === "GTPL-124-gT-450T-S7-1200" ? (
              ""
            ) : (
              <Button
                variant="secondary"
                onClick={() => setCurrentView("faultCodes")}
              >
                {t("Fault Codes")}
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => setCurrentView("allPaginatedLogs")}
            >
              {t("Alarm History")}
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">{t("Active Tags")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("Showing currently active fault conditions")}
                </p>
              </div>

              <ActiveTagsTable tags={activeFaults.map(fault => ({
                tag: fault.column,
                value: fault.value,
              }))} />
            </CardContent>

            <div className="p-6 pt-0">
              <Button variant="outline" onClick={handleBackToMenu}>
                BACK TO MENU
              </Button>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  // Main Fault Codes Screen
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container py-8">
        <div className="animate-fade-in-up mb-8">
          <ScreenHeader
            icon={ShieldAlert}
            eyebrow="Diagnostics"
            title={t("Fault Codes")}
            machine={machineName}
            onBack={handleBackToMenu}
          />

          <div className="mt-5">
            <StatStrip
              stats={[
                { label: t("total"), value: faultCodes.length, icon: ListFilter },
                {
                  label: "Machine type",
                  value: machineType ?? "-",
                  icon: AlertTriangle,
                  tone: "warning",
                },
              ]}
            />
          </div>
        </div>

        <Card className="surface glow-edge">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-semibold tracking-tight">
                {t("Fault Codes")}
              </h3>
              <Button
                variant="secondary"
                onClick={() => setCurrentView("faultLogs")}
              >
                {t("View Active Alarms")}
              </Button>
            </div>

            <FaultCodeTable
              faultCodes={faultCodes}
              onViewDetails={handleViewFaultCode}
            />
          </CardContent>

          <div className="p-6 pt-0">
            <Button variant="outline" onClick={handleBackToMenu}>
              BACK TO MENU
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
