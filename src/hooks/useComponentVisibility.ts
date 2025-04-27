import { useState, useEffect } from "react";

interface UserData {
  id: number;
  accountType: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  company: string;
  monitorAccess: number;
  created_at: string;
}

interface ComponentVisibility {
  showEmail: boolean;
  showCompany: boolean;
  showLocations: boolean;
  showMonitorAccess: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  showCompanyDropdown: boolean;
  showLocationDropdown: boolean;
  showMonitorAccessDropdown: boolean;
}

export const useComponentVisibility = (userData: UserData | null) => {
  const [visibility, setVisibility] = useState<ComponentVisibility>({
    showEmail: true,
    showCompany: true,
    showLocations: true,
    showMonitorAccess: true,
    showPassword: true,
    showConfirmPassword: true,
    showCompanyDropdown: true,
    showLocationDropdown: true,
    showMonitorAccessDropdown: true,
  });

  useEffect(() => {
    if (userData) {
      setVisibility({
        // Show email field if not already set
        showEmail: !userData.email,
        // Show company field if not already set
        showCompany: !userData.company,
        // Show locations if company is not set
        showLocations: !userData.company,
        // Show monitor access if not set
        showMonitorAccess: userData.monitorAccess === 0,
        // Always show password fields
        showPassword: true,
        showConfirmPassword: true,
        // Show dropdowns based on data
        showCompanyDropdown: !userData.company,
        showLocationDropdown: !userData.company,
        showMonitorAccessDropdown: userData.monitorAccess === 0,
      });
    }
  }, [userData]);

  return visibility;
};
