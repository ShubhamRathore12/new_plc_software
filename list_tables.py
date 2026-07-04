#!/usr/bin/env python3
import os
import sys
from dotenv import load_dotenv
import mysql.connector

# Load environment variables from .env.local
load_dotenv('.env.local')

# Get credentials
host = os.getenv('DATABASE_HOST')
port = int(os.getenv('DATABASE_PORT', 3306))
user = os.getenv('DATABASE_USER')
password = os.getenv('DATABASE_PASSWORD')
database = os.getenv('DATABASE_NAME')

print(f"Connecting to {host}:{port} as {user}...")

try:
    # Connect to MySQL
    conn = mysql.connector.connect(
        host=host,
        port=port,
        user=user,
        password=password,
        database=database
    )
    
    cursor = conn.cursor()
    
    # Query to get all tables
    query = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = %s ORDER BY TABLE_NAME"
    cursor.execute(query, (database,))
    
    tables = cursor.fetchall()
    
    print(f"\n✅ Connected successfully to database: {database}\n")
    print("=" * 60)
    print(f"TABLES IN DATABASE '{database}' ({len(tables)} tables)")
    print("=" * 60)
    
    for idx, (table_name,) in enumerate(tables, 1):
        print(f"{idx:2d}. {table_name}")
    
    print("\n" + "=" * 60)
    
    # Now get detailed info for each table
    print("\nDETAILED TABLE INFORMATION:\n")
    
    for table_name, in tables:
        cursor.execute(f"DESCRIBE {table_name}")
        columns = cursor.fetchall()
        
        print(f"\n📋 Table: {table_name}")
        print(f"   Columns ({len(columns)}):")
        for col in columns:
            col_name, col_type, nullable, key, default, extra = col
            print(f"      - {col_name}: {col_type} {'(NULL)' if nullable == 'YES' else '(NOT NULL)'} {key} {extra}")
    
    cursor.close()
    conn.close()
    
except mysql.connector.Error as err:
    print(f"❌ Error connecting to MySQL: {err}")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
