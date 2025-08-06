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
} from "@/lib/faultConfig";

interface FaultCode {
  code: number;
  description: string;
}

export default function FaultPage() {
  const [currentView, setCurrentView] = useState("faultLogs");
  const [selectedFault, setSelectedFault] = useState<FaultCode | null>(null);
  const router = useRouter();
  const { fault } = useParams();

  // Resolve machine name using the configuration
  const machineName = resolveMachineName(fault as string);
  const { data, isConnected, error, formatValue } = useAutoData(machineName);

  // Get machine configuration
  const machineConfig = getMachineConfig(machineName);
  const machineType = getMachineType(machineName);
  const faultCodes = getFaultCodesForMachine(machineName);
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
                <h3 className="text-lg font-semibold mb-2">Fault Information</h3>
                <div className="bg-muted p-4 rounded-lg mb-6">
                  <p><strong>Fault Code:</strong> {selectedFault.code}</p>
                  <p><strong>Description:</strong> {selectedFault.description}</p>
                  <p><strong>Model:</strong> {machineType}</p>
                  <p><strong>Machine Name:</strong> {machineName}</p>
                  <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
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
              Active Alarms - {machineType}
            </h1>
            <p className="text-muted-foreground">
              Current active fault tags for {machineName}
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
              <div className="mb-4">
                <h3 className="text-lg font-semibold">
                  Active Tags 
                </h3>
                <p className="text-sm text-muted-foreground">
                  Showing currently active fault conditions
                </p>
              </div>
              
              <ActiveTagsTable tags={currentTags} />
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            FAULT CODES - {machineType}
          </h1>
          <p className="text-muted-foreground">
            System fault codes and descriptions for {machineName}
          </p>
          {machineConfig && (
            <div className="mt-2 flex gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Table: {machineConfig.table}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Type: {machineConfig.type}
              </span>
            </div>
          )}
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
                View Active Alarms
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