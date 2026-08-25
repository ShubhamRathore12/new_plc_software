/**
 * Single source of truth for the machine list.
 * Used by the devices page and by the registration form, which derives its
 * location options from these devices.
 */
export interface Device {
  name: string;
  location: string;
  image: string;
  plc: string;
  chillerModel: string;
}

export const ALL_DEVICES: Device[] = [
    {
      name: "GTPL-30-gT-180E-S7-1200",
      location: "Germany",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-140E",
    },
    {
      name: "GTPL-044-GT-140E-S7-1200",
      location: "Germany",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-140E",
    },
    {
      name: "GTPL-061-gT-450T-S7-1200",
      location: "Turkey",
      image: "/images/450.jpeg",
      plc: "S7-1200",
      chillerModel: "gT-450T",
    },
    {
      name: "GTPL-081-gT-650T-S7-1200",
      location: "Dharuhera",
      image: "/images/650.jpeg",
      plc: "S7-1200",
      chillerModel: "GT-650T",
    },
    {
      name: "GTPL-105-gT-650T-S7-1200",
      location: "Dharuhera",
      image: "/images/650.jpeg",
      plc: "S7-1200",
      chillerModel: "GT-650T",
    },
    {
      name: "GTPL-068-gT-650T-S7-1200",
      location: "Keshwana, Rajasthan",
      image: "/images/650.jpeg",
      plc: "S7-1200",
      chillerModel: "GT-650T",
    },
    {
      name: "GTPL-104-gT-650T-S7-1200",
      location: "Keshwana, Rajasthan",
      image: "/images/650.jpeg",
      plc: "S7-1200",
      chillerModel: "GT-650T",
    },
    {
      name: "GTPL-108-gT-40E-P-S7-200",
      location: "Germany",
      image: "/images/200.jpg",
      plc: "S7-200",
      chillerModel: "gT-40E-P",
    },
    {
      name: "GTPL-109-gT-40E-P-S7-200",
      location: "Germany",
      image: "/images/200.jpg",
      plc: "S7-200",
      chillerModel: "gT-40E-P",
    },
    {
      name: "GTPL-110-gT-40E-P-S7-200",
      location: "Germany",
      image: "/images/200.jpg",
      plc: "S7-200",
      chillerModel: "gT-40E-P",
    },
    {
      name: "GTPL-111-gT-80E-P-S7-200",
      location: "Germany",
      image: "/images/200.jpg",
      plc: "S7-200",
      chillerModel: "gT-80E-P",
    },
    {
      name: "GTPL-112-gT-80E-P-S7-200",
      location: "Germany",
      image: "/images/200.jpg",
      plc: "S7-200",
      chillerModel: "gT-80E-P",
    },
    {
      name: "GTPL-113-gT-80E-P-S7-200",
      location: "Germany",
      image: "/images/200.jpg",
      plc: "S7-200",
      chillerModel: "gT-80E-P",
    },
    {
      name: "GTPL-115-gT-180E-S7-1200",
      location: "Germany",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-180E",
    },
    {
      name: "GTPL-116-gT-240E-S7-1200",
      location: "Germany",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-240E",
    },
    {
      name: "GTPL-117-gT-320E-S7-1200",
      location: "Germany",
      image: "/images/320.jpeg",
      plc: "S7-1200",
      chillerModel: "gT-320E",
    },
    {
      name: "GTPL-118-gT-60T-S7-200",
      location: "Telangana",
      image: "/images/200.jpg",
      plc: "S7-200",
      chillerModel: "gT-80E-P",
    },
    {
      name: "GTPL-149-gT-60T-S7-1200",
      location: "Telangana",
      image: "/images/200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-60T",
    },
    {
      name: "GTPL-119-gT-180E-S7-1200",
      location: "Germany",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-180E",
    },
    {
      name: "GTPL-120-gT-180E-S7-1200",
      location: "Germany",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-180E",
    },
    {
      name: "GTPL-121-gT-1000T-S7-1200",
      location: "kanpur",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-1000T",
    },
    {
      name: "GTPL-122-gT-1000T-S7-1200",
      location: "kanpur",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-1000T",
    },
    {
      name: "GTPL-123-gT-450AP",
      location: "Raichur, Karnataka",
      image: "/images/450.jpeg",
      plc: "S7-1200",
      chillerModel: "gt-450AP",
    },
    {
      name: "GTPL-124-gT-450T-S7-1200",
      location: "Indonesia",
      image: "/images/450.jpeg",
      plc: "S7-1200",
      chillerModel: "gT-450T",
    },
    {
      name: "GTPL-131-gT-650T-S7-1200",
      location: "Ganganagar, Rajasthan",
      image: "/images/650.jpeg",
      plc: "S7-1200",
      chillerModel: "gT-650T",
    },
    {
      name: "GTPL-132-300-AP-S7-1200",
      location: "Salem (Tamil Nadu)",
      image: "/images/300.jpeg",
      plc: "S7-1200",
      chillerModel: "gT-300AP",
    },
    {
      name: "GTPL-133-gT-650T-S7-1200",
      location: "Vietnam",
      image: "/images/650.jpeg",
      plc: "S7-1200",
      chillerModel: "gT-650T",
    },
    {
      name: "GTPL-154-gT-650T-S7-1200",
      location: "Ganga Nagar",
      image: "/images/650.jpeg",
      plc: "S7-1200",
      chillerModel: "GT-650T",
    },
    {
      name: "GTPL-155-gT-650T-S7-1200",
      location: "Rajasthan",
      image: "/images/650.jpeg",
      plc: "S7-1200",
      chillerModel: "GT-650T",
    },
    {
      name: "GTPL-134-gT-450T-S7-1200",
      location: "Kakinada (AP)",
      image: "/images/450.jpeg",
      plc: "S7-1200",
      chillerModel: "gT-450T",
    },
    {
      name: "GTPL-135-gT-450T-S7-1200",
      location: "Bihar",
      image: "/images/450.jpeg",
      plc: "S7-1200",
      chillerModel: "gT-450T",
    },
    {
      name: "GTPL-136-gT-450AP",
      location: "Srilanka",
      image: "/images/450.jpeg",
      plc: "S7-1200",
      chillerModel: "gT-450AP",
    },
    {
      name: "GTPL-137-gT-450T-S7-1200",
      location: "Thailand",
      image: "/images/450.jpeg",
      plc: "S7-1200",
      chillerModel: "gT-450T",
    },
    {
      name: "GTPL-138-gT-450T-S7-1200",
      location: "Thailand",
      image: "/images/450.jpeg",
      plc: "S7-1200",
      chillerModel: "gT-450T",
    },
    {
      name: "GTPL-139-gT-300AP-S7-1200",
      location: "Pondicherry",
      image: "/images/300.jpeg",
      plc: "S7-1200",
      chillerModel: "GT-300AP",
    },
    {
      name: "GTPL-142-gT-450AP-S7-1200",
      location: "A.P.",
      image: "/images/450.jpeg",
      plc: "S7-1200",
      chillerModel: "gT-450AP",
    },
    {
      name: "GTPL-143-gT-450AP-S7-1200",
      location: "A.P.",
      image: "/images/450.jpeg",
      plc: "S7-1200",
      chillerModel: "gT-450AP",
    },
    {
      name: "GTPL-144-gT-300AP-S7-1200",
      location: "Tamil Nadu",
      image: "/images/300.jpeg",
      plc: "S7-1200",
      chillerModel: "GT-300AP",
    },
    {
      name: "GTPL-145-gT-450T-S7-1200",
      location: "Tamil Nadu",
      image: "/images/450.jpeg",
      plc: "S7-1200",
      chillerModel: "gT-450T",
    },
    {
      name: "GTPL-148-gT-450T-S7-1200",
      location: "Tamil Nadu",
      image: "/images/450.jpeg",
      plc: "S7-1200",
      chillerModel: "gT-450T",
    },
  ];

/** Unique machine locations, alphabetically sorted. */
export function getDeviceLocations(): string[] {
  return Array.from(new Set(ALL_DEVICES.map((d) => d.location)))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}
