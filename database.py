import sqlite3
import os
import json
from datetime import datetime, timedelta

DB_PATH = os.path.join(os.path.dirname(__file__), 'ecotrack.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Reports table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS reports (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        severity TEXT NOT NULL, -- Critical, High, Medium, Low
        status TEXT NOT NULL,   -- Pending, Assigned, In Progress, Resolved
        location TEXT NOT NULL,
        ward_zone TEXT NOT NULL,
        submitted_at TEXT NOT NULL,
        resolved_at TEXT,
        ai_confidence INTEGER NOT NULL,
        description TEXT,
        assigned_to TEXT,
        latitude REAL,
        longitude REAL,
        image_url TEXT,
        citizen_name TEXT,
        citizen_phone TEXT
    )
    ''')
    
    # Activities table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        report_id TEXT NOT NULL,
        action TEXT NOT NULL,
        detail TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        type TEXT NOT NULL -- status_change, assignment, new_report, resolved
    )
    ''')
    
    conn.commit()
    
    cursor.execute('SELECT COUNT(*) FROM reports')
    if cursor.fetchone()[0] == 0:
        seed_data(conn)
        
    conn.close()

def seed_data(conn):
    cursor = conn.cursor()
    now = datetime.now()
    
    sample_reports = [
        (
            "REF-ET-1048",
            "Overflowing bins near bus stop",
            "Household & Plastic",
            "Critical",
            "Assigned",
            "Bus Depot Terminal 2, Pedestrian Plaza",
            "Smart Zone 4-A",
            (now - timedelta(minutes=20)).isoformat(),
            None,
            94,
            "Three 240L municipal bins completely overflowing onto sidewalk. High citizen footfall, immediate compactor clearance required.",
            "Sanitation Crew #07 (Indore Central)",
            22.7196, 75.8577,
            "static/images/sample_bin1.svg",
            "Pooja Verma",
            "+91 98260 12345"
        ),
        (
            "REF-ET-1042",
            "Waste accumulation near market",
            "Organic & Packaging",
            "High",
            "In Progress",
            "Vegetable Mandi Gate 3, Sector 8",
            "Smart Zone 4-A",
            (now - timedelta(hours=1)).isoformat(),
            None,
            89,
            "Substantial pile of decomposing organic produce and wooden crates near storm drain. Risk of blockage before evening.",
            "Quick Response Vehicle #03",
            22.7240, 75.8625,
            "static/images/sample_bin2.svg",
            "Anil Sharma",
            "+91 94250 88219"
        ),
        (
            "REF-ET-1037",
            "Public bin needs collection",
            "Mixed Municipal Solid Waste",
            "High",
            "Pending",
            "Nehru Park East Promenade Entrance",
            "Smart Zone 4-A",
            (now - timedelta(hours=2)).isoformat(),
            None,
            86,
            "Litter bin tilted, plastic wrappers and beverage cups scattered within 10 meter radius around public benches.",
            None,
            22.7150, 75.8710,
            "static/images/sample_bin3.svg",
            "Vikas Dubey",
            "+91 97531 44520"
        ),
        (
            "REF-ET-1020",
            "Construction debris dumped on roadside",
            "Construction & Demolition",
            "Medium",
            "Resolved",
            "Ring Road Service Lane, Ward 9",
            "Smart Zone 4-B",
            (now - timedelta(hours=3)).isoformat(),
            (now - timedelta(minutes=30)).isoformat(),
            91,
            "Broken bricks, cement sack bags, and plaster debris removed by JCB Loader #04 and transported to processing plant.",
            "C&D Recovery Team #2",
            22.7090, 75.8820,
            "static/images/sample_bin1.svg",
            "Ramesh Patel",
            "+91 91100 56789"
        ),
        (
            "REF-ET-1015",
            "E-waste scrap bin capacity breach",
            "Electronic Waste",
            "Medium",
            "Pending",
            "IT Park Hub 1, Green Collection Kiosk",
            "Smart Zone 4-C",
            (now - timedelta(hours=5)).isoformat(),
            None,
            93,
            "Designated e-waste drop-off container has reached 100% capacity. Safe recycling transfer protocol needed.",
            None,
            22.7290, 75.8900,
            "static/images/sample_bin2.svg",
            "Sneha Kulkarni",
            "+91 99260 77112"
        ),
        (
            "REF-ET-1008",
            "Commercial cartons and plastic wrappers",
            "Commercial Recyclables",
            "Low",
            "Resolved",
            "Main Market Commercial Arcade",
            "Smart Zone 4-A",
            (now - timedelta(hours=8)).isoformat(),
            (now - timedelta(hours=1)).isoformat(),
            88,
            "Cardboard packaging sorted and collected for dry-waste MRF facility.",
            "Dry Waste Collector #11",
            22.7175, 75.8520,
            "static/images/sample_bin3.svg",
            "Sunil Jain",
            "+91 98930 22340"
        ),
        (
            "REF-ET-0994",
            "Residential green waste accumulation",
            "Horticultural Waste",
            "Low",
            "Resolved",
            "Gulmohar Colony Avenue 4",
            "Smart Zone 4-B",
            (now - timedelta(days=1)).isoformat(),
            (now - timedelta(hours=6)).isoformat(),
            95,
            "Pruned tree branches and lawn clippings cleared by composting collection unit.",
            "Green Waste Unit #01",
            22.7020, 75.8650,
            "static/images/sample_bin1.svg",
            "Dr. Meera Iyer",
            "+91 93000 67890"
        ),
        (
            "REF-ET-0988",
            "Bio-medical waste improper segregation",
            "Biohazard / Medical",
            "Critical",
            "In Progress",
            "Civil Hospital Back Alley, Sector 2",
            "Smart Zone 4-A",
            (now - timedelta(minutes=45)).isoformat(),
            None,
            98,
            "Yellow color-coded medical bags found unattended near public boundary wall. Hazmat sanitary protocols initiated.",
            "Specialized Bio-Sanitation Unit",
            22.7210, 75.8670,
            "static/images/sample_bin2.svg",
            "Citizen Alert Desk",
            "1800-180-1969"
        )
    ]
    
    cursor.executemany('''
    INSERT INTO reports (
        id, title, category, severity, status, location, ward_zone,
        submitted_at, resolved_at, ai_confidence, description,
        assigned_to, latitude, longitude, image_url, citizen_name, citizen_phone
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', sample_reports)
    
    sample_activities = [
        ("REF-ET-1048", "Status changed to Assigned", "Sanitation Crew #07 assigned by Smart Dispatch Engine", (now - timedelta(minutes=20)).isoformat(), "assignment"),
        ("REF-ET-1042", "Status changed to In Progress", "Quick Response Vehicle #03 arrived at Vegetable Mandi Gate 3", (now - timedelta(hours=1)).isoformat(), "status_change"),
        ("REF-ET-1037", "New report submitted", "AI verified: High severity overflowing municipal bin", (now - timedelta(hours=2)).isoformat(), "new_report"),
        ("REF-ET-1020", "Status changed to Resolved", "C&D recovery complete; verified with timestamped photo", (now - timedelta(hours=3)).isoformat(), "resolved"),
        ("REF-ET-0988", "Status changed to In Progress", "Specialized Bio-Sanitation Unit en route to Sector 2", (now - timedelta(minutes=35)).isoformat(), "status_change")
    ]
    
    cursor.executemany('''
    INSERT INTO activities (report_id, action, detail, timestamp, type)
    VALUES (?, ?, ?, ?, ?)
    ''', sample_activities)
    
    conn.commit()
