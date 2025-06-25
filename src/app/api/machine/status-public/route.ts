// app/api/machine/status-public/route.ts
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { getMachineSpecificResponse, hasIdChanged, MachineResponse } from '@/lib/machineUtils';

export async function GET() {
  try {
    const [gtplRows] = await pool.query<any[]>("SELECT * FROM gtpl_122_s7_1200_01 ORDER BY id DESC LIMIT 1");
    const [kaboRows] = await pool.query<any[]>("SELECT * FROM kabomachinedatasmart200 ORDER BY id DESC LIMIT 1");

    const currentTime = new Date();

    const gtpl = gtplRows[0];
    const kabo = kaboRows[0];

    const gtplTimestamp = gtpl?.created_on || gtpl?.timestamp || gtpl?.updated_at || gtpl?.date_created || currentTime;
    const kaboTimestamp = kabo?.created_on || kabo?.timestamp || kabo?.updated_at || kabo?.date_created || currentTime;

    const gtplIdChanged = hasIdChanged(gtpl?.id, null);
    const kaboIdChanged = hasIdChanged(kabo?.id, null);

    const gtplResponse: MachineResponse = {
      ...getMachineSpecificResponse('gtpl', gtplTimestamp, currentTime, gtplIdChanged),
      recordId: gtpl?.id || 0,
      lastUpdate: new Date(gtplTimestamp).toISOString(),
      hasNewData: gtplIdChanged,
      idChanged: gtplIdChanged,
    };

    const kaboResponse: MachineResponse = {
      ...getMachineSpecificResponse('kabo', kaboTimestamp, currentTime, kaboIdChanged),
      recordId: kabo?.id || 0,
      lastUpdate: new Date(kaboTimestamp).toISOString(),
      hasNewData: kaboIdChanged,
      idChanged: kaboIdChanged,
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
