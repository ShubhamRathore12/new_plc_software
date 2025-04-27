import { useMemo } from "react";

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

export function useFieldVisibility(userData: UserData) {
  const visibility = useMemo(() => {
    return {
      showDropdownButton: userData.accountType === "manufactura",
      showEmailField: userData.email ? true : false,
      showPhoneField: userData.phoneNumber ? true : false,
      showMonitorAccessSection: userData.monitorAccess === 1,
      showCompanyField: userData.company || "",
      isAdmin: userData.accountType === "admin",
      // Add more visibility rules as needed
    };
  }, [userData]);

  return visibility;
}
