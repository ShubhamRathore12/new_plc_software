import React, { createContext, useContext, useState, ReactNode } from 'react';

// English-German translations for fault codes and UI elements
const translations = {
    'en-US': {
        // Fault codes
        'Compressor_circuit_breaker_fault': 'Compressor circuit breaker fault',
        'Condenser_fan_door_open': 'Condenser fan door open',
        'Blower_drive_fault': 'Blower drive fault',
        'Blower_circuit_breaker_fault': 'Blower circuit breaker fault',
        'Three_phase_monitor_fault': 'Three phase monitor fault',
        'Low_Pressure_Fault': 'Low Pressure Fault',
        'Ambient_temp_lower_than_set_temp': 'Ambient temp lower than set temp',
        'Ambient_temp_Over_43C': 'Ambient temp. Over 43°C',
        'Compressor_motor_overheat': 'Compressor motor overheat',
        'Heater_RCCB_fault': 'Heater RCCB fault',
        'Low_pressure_fault_Locked': 'Low Pressure fault Locked',
        'Anti_Freeze_Protection': 'Anti Freeze Protection',
        'High_pressure_fault_Locked': 'High Pressure fault Locked',
        'Ambient_temp_Over_40C': 'Ambient temp. Over 40°C',
        'Ambient_temp_Less_than_4C': 'Ambient temp. Less than 4°C',
        'Cond_Fan_circuit_breaker_fault': 'Cond Fan circuit breaker fault',
        'Cond_Fan_drive_fault': 'Cond Fan drive fault',
        'Cond_Fan_TOP': 'Cond Fan TOP',
        'High_Pressure_Fault': 'High Pressure Fault',
        'Heater_TOP_fault': 'Heater TOP fault',
        'Heater_drive_Fault': 'Heater drive Fault',
        'Heater_circuit_breaker_fault': 'Heater circuit breaker fault',
        'TH_Temp_more_than_50C': 'TH Air After Heater Temp more than 50 °C',
        'Delta_not_achieved_in_aeration_mode': 'Delta value not achieved in aeration mode',
        'Warning_LP_transducer_failure': 'Warning LP transducer failure',
        'Warning_HP_transducer_failure': 'Warning HP transducer failure',

        // UI elements
        'FAULT': 'FAULT',
        'ON': 'Active',
        'OFF': 'Inactive',
        'SEARCH': 'Search',
        'CLEAR': 'Clear',
        'NO_RESULTS': 'No active tags found',
        'LOADING': 'Loading...',
        'ERROR': 'Error',
        'SHOW_DEBUG': 'Show Debug Data',
        'HIDE_DEBUG': 'Hide',
        'NEXT': 'Next',
        'PREVIOUS': 'Previous',
    },
    'de-DE': {
        // Fault codes
        'Compressor_circuit_breaker_fault': 'Fehler: Verdichter-Leistungsschalter',
        'Condenser_fan_door_open': 'Tür (Kond. Lüfter) offen',
        'Blower_drive_fault': 'Fehler: Gebläseumrichter',
        'Blower_circuit_breaker_fault': 'Fehler: Gebläse-Leistungsschalter',
        'Three_phase_monitor_fault': 'Fehler: Drehstromüberwachung',
        'Low_Pressure_Fault': 'Fehler: Saugdruck zu niedrig',
        'Ambient_temp_lower_than_set_temp': 'Umgebungstemperatur niedriger als eingestellte Temperatur',
        'Ambient_temp_Over_43C': 'Umgebungstemp Über 43°C',
        'Compressor_motor_overheat': 'Fehler: Verdichtermotor überhitzt',
        'Heater_RCCB_fault': 'Fehler: Heizung RCCB',
        'Low_pressure_fault_Locked': 'Fehler: Saugdruck zu niedrig (gesperrt)',
        'Anti_Freeze_Protection': 'Fehler: Temperatur T1 unter 4°C (Vereisungsschutz)',
        'High_pressure_fault_Locked': 'Fehler: Hochdruckschalter (gesperrt)',
        'Ambient_temp_Over_40C': 'Umgebungstemp Über 40°C',
        'Ambient_temp_Less_than_4C': 'Umgebungstemp Weniger als 4 °C',
        'Cond_Fan_circuit_breaker_fault': 'Fehler: Kondensatorlüfter-Leistungsschalter',
        'Cond_Fan_drive_fault': 'Fehler: Kondensatorlüfter-Umrichter',
        'Cond_Fan_TOP': 'Kondlüfter überhitzt',
        'High_Pressure_Fault': 'Fehler: Hochdruckschalter',
        'Heater_TOP_fault': 'Fehler: Heizung überhitzt',
        'Heater_drive_Fault': 'Fehler: Heizungssteuerung',
        'Heater_circuit_breaker_fault': 'Fehler: Heizung-Leistungsschalter',
        'TH_Temp_more_than_50C': 'Fehler: TH Nachheizertemperatur über 50 °C',
        'Delta_not_achieved_in_aeration_mode': 'Nacherwärmung im Belüftungsbetrieb zu gering',
        'Warning_LP_transducer_failure': 'Warnung: Niederdrucksensor defekt',
        'Warning_HP_transducer_failure': 'Warnung: Hochdrucksensor defekt',

        // UI elements
        'FAULT': 'FEHLER',
        'ON': 'Aktiv',
        'OFF': 'Inaktiv',
        'SEARCH': 'Suchen',
        'CLEAR': 'Löschen',
        'NO_RESULTS': 'Keine aktiven Tags gefunden',
        'LOADING': 'Wird geladen...',
        'ERROR': 'Fehler',
        'SHOW_DEBUG': 'Debug-Daten anzeigen',
        'HIDE_DEBUG': 'Ausblenden',
        'NEXT': 'Weiter',
        'PREVIOUS': 'Zurück',
    }
};

interface LanguageContextType {
    language: string;
    setLanguage: (lang: string) => void;
    tFault: (key: string) => string;
    tUI: (key: string) => string;
    availableLanguages: string[];
}

const LanguageContext = createContext<LanguageContextType>({
    language: 'en-US',
    setLanguage: () => { },
    tFault: (key) => key,
    tUI: (key) => key,
    availableLanguages: ['en-US', 'de-DE'],
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState('en-US');

    // Translate fault codes
    const tFault = (key: string): string => {
        if (!key) return '';
        return translations[language as keyof typeof translations]?.[key as keyof typeof translations['en-US']] || key;
    };

    // Translate UI elements
    const tUI = (key: string): string => {
        if (!key) return '';
        return translations[language as keyof typeof translations]?.[key as keyof typeof translations['en-US']] || key;
    };

    return (
        <LanguageContext.Provider
            value={{
                language,
                setLanguage,
                tFault,
                tUI,
                availableLanguages: ['en-US', 'de-DE']
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
};