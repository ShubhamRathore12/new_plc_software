"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { MACHINE_CONFIG, MACHINE_NAME_ALIASES } from "@/lib/machineConfig";

interface FormData {
  deviceId: string;
  deviceName: string;
  location: string;
  siteName: string;
  latitude: string;
  longitude: string;
  installationDate: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  tablePrefix: string;
  type: string;
}

export default function DeviceRegistrationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    deviceId: "GTPL-156",
    deviceName: "",
    location: "Philippines",
    siteName: "",
    latitude: "",
    longitude: "",
    installationDate: new Date().toISOString().split("T")[0],
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    tablePrefix: "GTPL_156",
    type: "S7-1200",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const availableDevices = Object.keys(MACHINE_CONFIG).filter(
    (key) => key.includes("GTPL-156") || key.includes("GTPL-157")
  );

  const handleInputChange = (
    field: keyof FormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNum === 1) {
      if (!formData.deviceId)
        newErrors.deviceId = "Device ID is required";
      if (!formData.deviceName)
        newErrors.deviceName = "Device name is required";
      if (!formData.siteName) newErrors.siteName = "Site name is required";
    } else if (stepNum === 2) {
      if (!formData.latitude) newErrors.latitude = "Latitude is required";
      if (!formData.longitude) newErrors.longitude = "Longitude is required";
      if (
        formData.latitude &&
        (parseFloat(formData.latitude) < -90 ||
          parseFloat(formData.latitude) > 90)
      ) {
        newErrors.latitude = "Latitude must be between -90 and 90";
      }
      if (
        formData.longitude &&
        (parseFloat(formData.longitude) < -180 ||
          parseFloat(formData.longitude) > 180)
      ) {
        newErrors.longitude = "Longitude must be between -180 and 180";
      }
    } else if (stepNum === 3) {
      if (!formData.contactPerson)
        newErrors.contactPerson = "Contact person is required";
      if (!formData.contactEmail)
        newErrors.contactEmail = "Contact email is required";
      if (
        formData.contactEmail &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)
      ) {
        newErrors.contactEmail = "Invalid email format";
      }
      if (!formData.contactPhone)
        newErrors.contactPhone = "Contact phone is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(3)) return;

    try {
      const response = await fetch("/api/register-device", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/dashboard/devices/${formData.deviceId}`);
        }, 2000);
      } else {
        setErrors({ submit: "Failed to register device" });
      }
    } catch (error) {
      setErrors({ submit: "Error registering device: " + String(error) });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Register New Device
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Configure and register a new chiller system
          </p>
        </div>

        {success && (
          <Alert className="mb-6 bg-green-50 dark:bg-green-950 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Device registered successfully! Redirecting to device dashboard...
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardContent className="pt-6">
            <Tabs value={`step-${step}`} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger
                  value="step-1"
                  disabled={step < 1}
                  onClick={() => step >= 1 && setStep(1)}
                  className="cursor-pointer"
                >
                  Device Info
                </TabsTrigger>
                <TabsTrigger
                  value="step-2"
                  disabled={step < 2}
                  onClick={() => step >= 2 && setStep(2)}
                  className="cursor-pointer"
                >
                  Location
                </TabsTrigger>
                <TabsTrigger
                  value="step-3"
                  disabled={step < 3}
                  onClick={() => step >= 3 && setStep(3)}
                  className="cursor-pointer"
                >
                  Contact
                </TabsTrigger>
              </TabsList>

              <TabsContent value="step-1" className="space-y-6 min-h-96">
                <div>
                  <Label htmlFor="deviceId" className="text-base font-semibold">
                    Device ID *
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Select from available Philippines gT-450T devices
                  </p>
                  <Select
                    value={formData.deviceId}
                    onValueChange={(value) =>
                      handleInputChange("deviceId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDevices.map((device) => (
                        <SelectItem key={device} value={device}>
                          {device.split("-").slice(0, 3).join("-")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.deviceId && (
                    <p className="text-red-500 text-sm mt-1">{errors.deviceId}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="deviceName" className="text-base font-semibold">
                    Device Name *
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    e.g., "GTPL-156 Silo Chiller"
                  </p>
                  <Input
                    id="deviceName"
                    value={formData.deviceName}
                    onChange={(e) =>
                      handleInputChange("deviceName", e.target.value)
                    }
                    placeholder="Enter device name"
                  />
                  {errors.deviceName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.deviceName}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="siteName" className="text-base font-semibold">
                    Site Name *
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Facility or warehouse name
                  </p>
                  <Input
                    id="siteName"
                    value={formData.siteName}
                    onChange={(e) =>
                      handleInputChange("siteName", e.target.value)
                    }
                    placeholder="e.g., Manila Central Warehouse"
                  />
                  {errors.siteName && (
                    <p className="text-red-500 text-sm mt-1">{errors.siteName}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="type" className="text-base font-semibold">
                    PLC Type
                  </Label>
                  <Input
                    id="type"
                    value={formData.type}
                    disabled
                    className="bg-gray-100 dark:bg-gray-800"
                  />
                </div>

                <div>
                  <Label htmlFor="installationDate" className="text-base font-semibold">
                    Installation Date
                  </Label>
                  <Input
                    id="installationDate"
                    type="date"
                    value={formData.installationDate}
                    onChange={(e) =>
                      handleInputChange("installationDate", e.target.value)
                    }
                  />
                </div>
              </TabsContent>

              <TabsContent value="step-2" className="space-y-6 min-h-96">
                <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 dark:text-blue-200">
                    Use GPS coordinates or your facility map. Longitude (East):
                    positive, West: negative. Latitude (North): positive, South:
                    negative.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitude" className="text-base font-semibold">
                      Latitude *
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      -90 to 90
                    </p>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.000001"
                      min="-90"
                      max="90"
                      value={formData.latitude}
                      onChange={(e) =>
                        handleInputChange("latitude", e.target.value)
                      }
                      placeholder="14.5994"
                    />
                    {errors.latitude && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.latitude}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="longitude" className="text-base font-semibold">
                      Longitude *
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      -180 to 180
                    </p>
                    <Input
                      id="longitude"
                      type="number"
                      step="0.000001"
                      min="-180"
                      max="180"
                      value={formData.longitude}
                      onChange={(e) =>
                        handleInputChange("longitude", e.target.value)
                      }
                      placeholder="120.9842"
                    />
                    {errors.longitude && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.longitude}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="location" className="text-base font-semibold">
                    Region/Province
                  </Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) =>
                      handleInputChange("location", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Philippines">Philippines</SelectItem>
                      <SelectItem value="Metro Manila">Metro Manila</SelectItem>
                      <SelectItem value="Cebu">Cebu</SelectItem>
                      <SelectItem value="Davao">Davao</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="step-3" className="space-y-6 min-h-96">
                <div>
                  <Label htmlFor="contactPerson" className="text-base font-semibold">
                    Contact Person *
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Primary facility manager
                  </p>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) =>
                      handleInputChange("contactPerson", e.target.value)
                    }
                    placeholder="Full name"
                  />
                  {errors.contactPerson && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.contactPerson}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="contactEmail" className="text-base font-semibold">
                    Email Address *
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    For fault alerts and reports
                  </p>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) =>
                      handleInputChange("contactEmail", e.target.value)
                    }
                    placeholder="manager@facility.com"
                  />
                  {errors.contactEmail && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.contactEmail}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="contactPhone" className="text-base font-semibold">
                    Phone Number *
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    For emergency contact
                  </p>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) =>
                      handleInputChange("contactPhone", e.target.value)
                    }
                    placeholder="+63 9XX XXX XXXX"
                  />
                  {errors.contactPhone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.contactPhone}
                    </p>
                  )}
                </div>

                {errors.submit && (
                  <Alert className="bg-red-50 dark:bg-red-950 border-red-200">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800 dark:text-red-200">
                      {errors.submit}
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>

            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                onClick={handleBack}
                variant="outline"
                disabled={step === 1}
              >
                Back
              </Button>
              {step < 3 ? (
                <Button onClick={handleNext}>Next</Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                  Register Device
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
