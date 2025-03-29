export interface GrainMonitorData {
  id: string;
  aht: number;
  hgs: number;
  temperatures: {
    t0: number;
    t1: number;
    t2: number;
    deltaT: number;
  };
  blowerSpeed: number;
  fans: boolean[];
  compressor: {
    hp: number;
    lp: number;
  };
}
