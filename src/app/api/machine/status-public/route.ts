import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { getMachineSpecificResponse, hasIdChanged, MachineResponse } from '@/lib/machineUtils';

// Store previous IDs and timestamps in memory
let previousGtplId: number | null = null;
let previousKaboId: number | null = null;
let previousGtplCreatedOn: string | null = null;
let previousKaboCreatedAt: string | null = null;

export async function GET() {
  try {
    const [gtplRows] = await pool.query<any[]>("SELECT * FROM gtpl_122_s7_1200_01 ORDER BY id DESC LIMIT 1");
    const [kaboRows] = await pool.query<any[]>("SELECT * FROM kabomachinedatasmart200 ORDER BY id DESC LIMIT 1");

    const currentTime = new Date();

    const gtpl = gtplRows[0];
    const kabo = kaboRows[0];

    // For GTPL: Use created_on specifically
    const gtplCreatedOn = gtpl?.created_on;
    const gtplTimestamp = gtplCreatedOn || currentTime;

    // For KABO: Use created_at specifically
    const kaboCreatedAt = kabo?.created_at;
    const kaboTimestamp = kaboCreatedAt || currentTime;

    // DEBUG LOGGING
    console.log('=== GTPL DEBUG ===');
    console.log('Current GTPL ID:', gtpl?.id);
    console.log('Previous GTPL ID:', previousGtplId);
    console.log('Current GTPL created_on:', gtplCreatedOn);
    console.log('Previous GTPL created_on:', previousGtplCreatedOn);

    console.log('=== KABO DEBUG ===');
    console.log('Current KABO ID:', kabo?.id);
    console.log('Previous KABO ID:', previousKaboId);
    console.log('Current KABO created_at:', kaboCreatedAt);
    console.log('Previous KABO created_at:', previousKaboCreatedAt);

    // Check if GTPL ID has increased from previous
    const gtplIdIncreased = gtpl?.id && previousGtplId ? gtpl.id > previousGtplId : false;
    
    // Check if GTPL created_on has changed
    const gtplCreatedOnChanged = gtplCreatedOn && previousGtplCreatedOn ? 
      new Date(gtplCreatedOn).getTime() !== new Date(previousGtplCreatedOn).getTime() : false;
    
    // GTPL returns true only if BOTH ID increased AND created_on changed
    const gtplHasNewData = gtplIdIncreased && gtplCreatedOnChanged;

    // Check if KABO ID has increased from previous
    const kaboIdIncreased = kabo?.id && previousKaboId ? kabo.id > previousKaboId : false;
    
    // Check if KABO created_at has changed
    const kaboCreatedAtChanged = kaboCreatedAt && previousKaboCreatedAt ? 
      new Date(kaboCreatedAt).getTime() !== new Date(previousKaboCreatedAt).getTime() : false;
    
    // KABO returns true only if BOTH ID increased AND created_at changed
    const kaboHasNewData = kaboIdIncreased && kaboCreatedAtChanged;

    // MORE DEBUG LOGGING
    console.log('=== COMPARISON RESULTS ===');
    console.log('GTPL ID Increased:', gtplIdIncreased);
    console.log('GTPL Created On Changed:', gtplCreatedOnChanged);
    console.log('GTPL Has New Data:', gtplHasNewData);
    console.log('KABO ID Increased:', kaboIdIncreased);
    console.log('KABO Created At Changed:', kaboCreatedAtChanged);
    console.log('KABO Has New Data:', kaboHasNewData);

    // Update stored values for next comparison
    previousGtplId = gtpl?.id || null;
    previousKaboId = kabo?.id || null;
    previousGtplCreatedOn = gtplCreatedOn || null;
    previousKaboCreatedAt = kaboCreatedAt || null;

    const gtplResponse: MachineResponse = {
      ...getMachineSpecificResponse('gtpl', gtplTimestamp, currentTime, gtplHasNewData),
      recordId: gtpl?.id || 0,
      lastUpdate: new Date(gtplTimestamp).toISOString(),
      hasNewData: gtplHasNewData,
      idChanged: gtplIdIncreased,
      createdOnChanged: gtplCreatedOnChanged,
    };

    const kaboResponse: MachineResponse = {
      ...getMachineSpecificResponse('kabo', kaboTimestamp, currentTime, kaboHasNewData),
      recordId: kabo?.id || 0,
      lastUpdate: new Date(kaboTimestamp).toISOString(),
      hasNewData: kaboHasNewData,
      idChanged: kaboIdIncreased,
      createdAtChanged: kaboCreatedAtChanged,
    };

    return NextResponse.json({
      success: true,
      message: 'Machine status retrieved successfully',
      data: {
        gtpl: gtplResponse,
        kabo: kaboResponse,
      },
      timestamp: currentTime.toISOString(),
    });
  } catch (err: any) {
    console.error('Error fetching status-public:', err);
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching machine status',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}