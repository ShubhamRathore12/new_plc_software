#!/usr/bin/env python3
"""
Alarm Handler System
Maps fault codes to alarms across all machine tables and manages active alarm states
with role-based configuration handling.
"""

import os
import sys
from dotenv import load_dotenv
import mysql.connector
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from datetime import datetime

# Load environment variables from .env.local
load_dotenv('.env.local')

# Database credentials
DB_CONFIG = {
    'host': os.getenv('DATABASE_HOST'),
    'port': int(os.getenv('DATABASE_PORT', 3306)),
    'user': os.getenv('DATABASE_USER'),
    'password': os.getenv('DATABASE_PASSWORD'),
    'database': os.getenv('DATABASE_NAME')
}

@dataclass
class MachineConfig:
    """Machine configuration and RBL (Role-Based Limits)"""
    machine_id: str
    machine_type: str
    table_name: str
    max_alarm_threshold: int = 5
    critical_alarms: List[str] = None
    rbl_permissions: Dict = None
    
    def __post_init__(self):
        if self.critical_alarms is None:
            self.critical_alarms = [
                'Compressor_circuit_breaker_fault',
                'High_pressure_fault',
                'Oil_pressure_low',
                'Three_phase_monitor_fault'
            ]
        if self.rbl_permissions is None:
            self.rbl_permissions = {
                'admin': ['read', 'write', 'reset', 'override'],
                'operator': ['read', 'write', 'reset'],
                'viewer': ['read']
            }

@dataclass
class AlarmEntry:
    """Active alarm entry"""
    alarm_code: int
    machine_id: str
    alarm_type: str
    severity: str  # 'critical', 'warning', 'info'
    timestamp: str
    description: str
    status: str = 'active'  # 'active', 'acknowledged', 'resolved'


class DatabaseConnection:
    """Handle database connections and queries"""
    
    def __init__(self, config: Dict):
        self.config = config
        self.conn = None
    
    def connect(self) -> bool:
        """Establish database connection"""
        try:
            self.conn = mysql.connector.connect(**self.config)
            print(f"✅ Connected to database: {self.config['database']}")
            return True
        except mysql.connector.Error as err:
            print(f"❌ Database connection error: {err}")
            return False
    
    def disconnect(self):
        """Close database connection"""
        if self.conn:
            self.conn.close()
            print("✅ Database connection closed")
    
    def get_cursor(self):
        """Get database cursor"""
        if self.conn:
            return self.conn.cursor()
        return None
    
    def execute_query(self, query: str, params: Tuple = None) -> List:
        """Execute a query and return results"""
        try:
            cursor = self.get_cursor()
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            results = cursor.fetchall()
            cursor.close()
            return results
        except mysql.connector.Error as err:
            print(f"❌ Query error: {err}")
            return []
    
    def execute_update(self, query: str, params: Tuple = None) -> bool:
        """Execute an update query"""
        try:
            cursor = self.get_cursor()
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            self.conn.commit()
            cursor.close()
            return True
        except mysql.connector.Error as err:
            print(f"❌ Update error: {err}")
            self.conn.rollback()
            return False


class MachineRegistry:
    """Registry of all machines and their configurations"""
    
    def __init__(self):
        self.machines: Dict[str, MachineConfig] = {}
        self._initialize_machines()
    
    def _initialize_machines(self):
        """Initialize all machine configurations from schema"""
        machine_tables = [
            'GTPL_061_GT_450T_S7_1200',
            'GTPL_068_GT_650T_S7_1200',
            'GTPL_081_GT_650T_S7_1200',
            'GTPL_104_GT_650T_S7_1200',
            'GTPL_105_GT_650T_S7_1200',
            'GTPL_108_gT_40E_P_S7_200_Germany',
            'GTPL_109_gT_40E_P_S7_200_Germany',
            'GTPL_110_gT_40E_P_S7_200_Germany',
            'GTPL_111_gT_80E_P_S7_200_Germany',
            'GTPL_112_gT_80E_P_S7_200_Germany',
            'GTPL_113_gT_80E_P_S7_200_Germany',
            'GTPL_114_GT_140E_S7_1200',
            'GTPL_115_GT_180E_S7_1200',
            'GTPL_116_GT_240E_S7_1200',
            'GTPL_117_GT_320E_S7_1200',
            'GTPL_118_API_TEST_MOCK',
            'GTPL_118_GT_60T_S7_1200',
            'GTPL_119_GT_180E_S7_1200',
            'GTPL_120_GT_180E_S7_1200',
            'GTPL_121_GT1000T',
            'gtpl_122_s7_1200_01',
            'GTPL_123_GT_450AP_S7_1200',
            'GTPL_124_GT_450T_S7_1200',
            'GTPL_131_GT_650T_S7_1200',
            'GTPL_132_GT300AP',
            'GTPL_133_GT_650T_S7_1200',
            'GTPL_134_GT_450T_S7_1200',
            'GTPL_135_GT_450T_S7_1200',
            'GTPL_136_GT_450AP_S7_1200',
            'GTPL_137_GT_450T_S7_1200',
            'GTPL_138_GT_450T_S7_1200',
            'GTPL_139_GT300AP',
            'GTPL_142_GT_450AP_S7_1200',
            'GTPL_143_GT_450AP_S7_1200',
            'GTPL_144_GT_300AP_S7_1200',
            'GTPL_145_GT_450T_S7_1200',
            'GTPL_148_GT_450T_S7_1200',
            'GTPL_154_GT_650T_S7_1200',
            'GTPL_155_GT_650T_S7_1200',
        ]
        
        for table in machine_tables:
            machine_id = table.split('_')[1] if '_' in table else table
            self.machines[machine_id] = MachineConfig(
                machine_id=machine_id,
                machine_type=self._extract_type(table),
                table_name=table
            )
    
    @staticmethod
    def _extract_type(table_name: str) -> str:
        """Extract machine type from table name"""
        parts = table_name.split('_')
        if len(parts) > 2:
            return '_'.join(parts[2:4])  # e.g., GT_450T
        return 'Unknown'
    
    def get_machine(self, machine_id: str) -> Optional[MachineConfig]:
        """Get machine configuration"""
        return self.machines.get(machine_id)
    
    def list_machines(self) -> Dict[str, MachineConfig]:
        """List all registered machines"""
        return self.machines


class FaultCodeMapper:
    """Map fault codes to alarm descriptions and severity"""
    
    # Fault code to alarm mapping
    FAULT_CODE_MAP = {
        1: {'name': 'Compressor_circuit_breaker_fault', 'severity': 'critical'},
        2: {'name': 'Oil_pressure_low', 'severity': 'critical'},
        3: {'name': 'Blower_drive_fault', 'severity': 'warning'},
        4: {'name': 'Blower_circuit_breaker_fault', 'severity': 'warning'},
        5: {'name': 'Three_phase_monitor_fault', 'severity': 'critical'},
        6: {'name': 'High_pressure_fault', 'severity': 'critical'},
        7: {'name': 'Ambient_temp_lower_than_set_temp', 'severity': 'warning'},
        8: {'name': 'Ambient_temp_over_45C', 'severity': 'warning'},
        9: {'name': 'Compressor_motor_winding_temp_high', 'severity': 'critical'},
        10: {'name': 'Low_pressure_1_fault', 'severity': 'warning'},
        11: {'name': 'Compressure_feedback_error', 'severity': 'info'},
        12: {'name': 'Low_pressure_2_fault', 'severity': 'warning'},
        13: {'name': 'Condenser_fan_1_TOP_fault', 'severity': 'warning'},
        14: {'name': 'Condenser_fan_2_TOP_fault', 'severity': 'warning'},
        15: {'name': 'Condenser_fan_3_TOP_fault', 'severity': 'warning'},
        16: {'name': 'Condenser_fan_4_TOP_fault', 'severity': 'warning'},
        17: {'name': 'Condenser_fan_circuit_breaker_fault', 'severity': 'critical'},
        18: {'name': 'Ambient_air_sensor_open', 'severity': 'info'},
        19: {'name': 'Ambient_air_sensor_short_circuit', 'severity': 'info'},
        20: {'name': 'Cold_air_sensor_open', 'severity': 'info'},
        21: {'name': 'Cold_air_sensor_short_circuit', 'severity': 'info'},
        22: {'name': 'Air_outlet_sensor_open', 'severity': 'info'},
        23: {'name': 'Air_outlet_sensor_short_circuit', 'severity': 'info'},
    }
    
    @classmethod
    def get_alarm_info(cls, fault_code: int) -> Dict:
        """Get alarm info from fault code"""
        return cls.FAULT_CODE_MAP.get(fault_code, {
            'name': f'Unknown_Fault_{fault_code}',
            'severity': 'info'
        })


class AlarmHandler:
    """Central alarm management system"""
    
    def __init__(self, db_connection: DatabaseConnection, machine_registry: MachineRegistry):
        self.db = db_connection
        self.machines = machine_registry
        self.active_alarms: Dict[str, List[AlarmEntry]] = {}
        self._initialize_alarms_table()
    
    def _initialize_alarms_table(self):
        """Create alarms tracking table if it doesn't exist"""
        query = """
        CREATE TABLE IF NOT EXISTS alarm_log (
            id INT AUTO_INCREMENT PRIMARY KEY,
            alarm_code INT NOT NULL,
            machine_id VARCHAR(50) NOT NULL,
            alarm_type VARCHAR(255) NOT NULL,
            severity VARCHAR(20) NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            description TEXT,
            status VARCHAR(20) DEFAULT 'active',
            acknowledged_by VARCHAR(100),
            acknowledged_at DATETIME,
            resolved_at DATETIME,
            INDEX idx_machine (machine_id),
            INDEX idx_status (status),
            INDEX idx_severity (severity)
        )
        """
        self.db.execute_update(query)
        print("✅ Alarm log table initialized")
    
    def fetch_machine_data(self, machine_id: str) -> Optional[Dict]:
        """Fetch latest data from machine table"""
        machine = self.machines.get_machine(machine_id)
        if not machine:
            return None
        
        query = f"SELECT * FROM {machine.table_name} ORDER BY id DESC LIMIT 1"
        results = self.db.execute_query(query)
        
        if results:
            columns = self._get_table_columns(machine.table_name)
            return dict(zip(columns, results[0]))
        return None
    
    def _get_table_columns(self, table_name: str) -> List[str]:
        """Get column names from table"""
        query = f"DESCRIBE {table_name}"
        results = self.db.execute_query(query)
        return [col[0] for col in results]
    
    def check_fault_codes(self, machine_id: str) -> List[AlarmEntry]:
        """Check for new fault codes in machine data"""
        data = self.fetch_machine_data(machine_id)
        if not data:
            return []
        
        fault_code = data.get('FAULT_CODE', 0)
        if fault_code == 0:
            return []
        
        alarm_info = FaultCodeMapper.get_alarm_info(fault_code)
        alarm = AlarmEntry(
            alarm_code=fault_code,
            machine_id=machine_id,
            alarm_type=alarm_info['name'],
            severity=alarm_info['severity'],
            timestamp=datetime.now().isoformat(),
            description=f"Fault code {fault_code}: {alarm_info['name']}"
        )
        
        return [alarm]
    
    def check_alarm_flags(self, machine_id: str) -> List[AlarmEntry]:
        """Check individual alarm flag columns in machine data"""
        data = self.fetch_machine_data(machine_id)
        if not data:
            return []
        
        machine = self.machines.get_machine(machine_id)
        alarms = []
        
        # Check all columns that match alarm patterns
        alarm_columns = [col for col in data.keys() if 'fault' in col.lower() or 'error' in col.lower()]
        
        for col_name in alarm_columns:
            if data.get(col_name) in [True, 'True', 1]:
                alarm_info = FaultCodeMapper.FAULT_CODE_MAP.get(
                    hash(col_name) % 23 + 1,
                    {'name': col_name, 'severity': 'warning'}
                )
                
                alarm = AlarmEntry(
                    alarm_code=hash(col_name) % 100,
                    machine_id=machine_id,
                    alarm_type=col_name,
                    severity=alarm_info.get('severity', 'warning'),
                    timestamp=datetime.now().isoformat(),
                    description=f"Alarm triggered: {col_name}"
                )
                alarms.append(alarm)
        
        return alarms
    
    def log_alarm(self, alarm: AlarmEntry) -> bool:
        """Log alarm to database"""
        query = """
        INSERT INTO alarm_log (alarm_code, machine_id, alarm_type, severity, description, status)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        return self.db.execute_update(query, (
            alarm.alarm_code,
            alarm.machine_id,
            alarm.alarm_type,
            alarm.severity,
            alarm.description,
            alarm.status
        ))
    
    def get_active_alarms(self, machine_id: str = None) -> List[Dict]:
        """Get all active alarms"""
        if machine_id:
            query = """
            SELECT * FROM alarm_log 
            WHERE status = 'active' AND machine_id = %s
            ORDER BY severity DESC, timestamp DESC
            """
            results = self.db.execute_query(query, (machine_id,))
        else:
            query = """
            SELECT * FROM alarm_log 
            WHERE status = 'active'
            ORDER BY severity DESC, timestamp DESC
            """
            results = self.db.execute_query(query)
        
        columns = ['id', 'alarm_code', 'machine_id', 'alarm_type', 'severity', 
                  'timestamp', 'description', 'status', 'acknowledged_by', 
                  'acknowledged_at', 'resolved_at']
        
        return [dict(zip(columns, row)) for row in results]
    
    def acknowledge_alarm(self, alarm_id: int, user: str) -> bool:
        """Acknowledge an alarm"""
        query = """
        UPDATE alarm_log 
        SET status = 'acknowledged', acknowledged_by = %s, acknowledged_at = NOW()
        WHERE id = %s
        """
        return self.db.execute_update(query, (user, alarm_id))
    
    def resolve_alarm(self, alarm_id: int) -> bool:
        """Resolve an alarm"""
        query = """
        UPDATE alarm_log 
        SET status = 'resolved', resolved_at = NOW()
        WHERE id = %s
        """
        return self.db.execute_update(query, (alarm_id,))
    
    def check_rbl_permission(self, user_role: str, action: str, machine_id: str) -> bool:
        """Check RBL permission for user"""
        machine = self.machines.get_machine(machine_id)
        if not machine:
            return False
        
        allowed_actions = machine.rbl_permissions.get(user_role, [])
        return action in allowed_actions
    
    def process_machine(self, machine_id: str) -> Dict:
        """Process alarms for a machine"""
        print(f"\n📊 Processing alarms for machine: {machine_id}")
        
        # Check fault codes
        fault_alarms = self.check_fault_codes(machine_id)
        
        # Check individual alarm flags
        flag_alarms = self.check_alarm_flags(machine_id)
        
        all_alarms = fault_alarms + flag_alarms
        
        logged_count = 0
        for alarm in all_alarms:
            if self.log_alarm(alarm):
                print(f"   ✅ Logged alarm: {alarm.alarm_type} (Severity: {alarm.severity})")
                logged_count += 1
        
        # Get active alarms for this machine
        active = self.get_active_alarms(machine_id)
        
        machine_config = self.machines.get_machine(machine_id)
        is_critical = any(alarm['severity'] == 'critical' for alarm in active)
        
        return {
            'machine_id': machine_id,
            'new_alarms': logged_count,
            'active_alarms': len(active),
            'critical_alarms': sum(1 for a in active if a['severity'] == 'critical'),
            'requires_attention': is_critical,
            'alarms': active
        }
    
    def process_all_machines(self) -> Dict:
        """Process alarms for all machines"""
        print("=" * 70)
        print("GLOBAL ALARM PROCESSING - All Machines")
        print("=" * 70)
        
        results = {}
        total_active = 0
        total_critical = 0
        
        for machine_id in self.machines.list_machines().keys():
            result = self.process_machine(machine_id)
            results[machine_id] = result
            total_active += result['active_alarms']
            total_critical += result['critical_alarms']
        
        print("\n" + "=" * 70)
        print("SUMMARY")
        print("=" * 70)
        print(f"Total Machines Processed: {len(self.machines.list_machines())}")
        print(f"Total Active Alarms: {total_active}")
        print(f"Total Critical Alarms: {total_critical}")
        
        return {
            'total_machines': len(self.machines.list_machines()),
            'total_active_alarms': total_active,
            'total_critical_alarms': total_critical,
            'machines': results
        }


class AlarmReporter:
    """Generate alarm reports and summaries"""
    
    def __init__(self, handler: AlarmHandler):
        self.handler = handler
    
    def print_machine_status(self, machine_id: str):
        """Print status for a specific machine"""
        alarms = self.handler.get_active_alarms(machine_id)
        machine = self.handler.machines.get_machine(machine_id)
        
        print(f"\n{'='*70}")
        print(f"MACHINE: {machine_id} ({machine.machine_type})")
        print(f"{'='*70}")
        
        if not alarms:
            print("✅ No active alarms")
            return
        
        print(f"\n⚠️  Active Alarms: {len(alarms)}")
        for alarm in alarms:
            severity_icon = '🔴' if alarm['severity'] == 'critical' else '🟡' if alarm['severity'] == 'warning' else '🔵'
            print(f"\n{severity_icon} [{alarm['alarm_type']}] - {alarm['severity'].upper()}")
            print(f"   Code: {alarm['alarm_code']}")
            print(f"   Timestamp: {alarm['timestamp']}")
            print(f"   Status: {alarm['status']}")
            print(f"   Description: {alarm['description']}")
    
    def print_critical_alarms_summary(self):
        """Print summary of critical alarms only"""
        query = """
        SELECT machine_id, alarm_type, COUNT(*) as count
        FROM alarm_log 
        WHERE status = 'active' AND severity = 'critical'
        GROUP BY machine_id, alarm_type
        ORDER BY count DESC
        """
        results = self.handler.db.execute_query(query)
        
        print(f"\n{'='*70}")
        print("CRITICAL ALARMS SUMMARY")
        print(f"{'='*70}")
        
        if not results:
            print("✅ No critical alarms")
            return
        
        for machine_id, alarm_type, count in results:
            print(f"🔴 {machine_id}: {alarm_type} ({count} active)")


def main():
    """Main execution"""
    # Initialize database connection
    db = DatabaseConnection(DB_CONFIG)
    if not db.connect():
        sys.exit(1)
    
    # Initialize machine registry
    machines = MachineRegistry()
    print(f"✅ Registered {len(machines.list_machines())} machines\n")
    
    # Initialize alarm handler
    handler = AlarmHandler(db, machines)
    
    # Process all machines and collect alarms
    results = handler.process_all_machines()
    
    # Generate reports
    reporter = AlarmReporter(handler)
    
    # Print critical alarms summary
    reporter.print_critical_alarms_summary()
    
    # Print detailed status for machines with active alarms
    print(f"\n{'='*70}")
    print("DETAILED MACHINE STATUS (Only machines with active alarms)")
    print(f"{'='*70}")
    
    for machine_id, result in results['machines'].items():
        if result['active_alarms'] > 0:
            reporter.print_machine_status(machine_id)
    
    # Close database connection
    db.disconnect()
    
    print(f"\n{'='*70}")
    print("✅ Alarm processing completed")
    print(f"{'='*70}\n")


if __name__ == '__main__':
    main()
