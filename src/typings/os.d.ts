declare namespace OS {
  type OS = {
    runtime: runtime;
    disk: disk;
    cpu: cpu;
    memory: memory;
  };

  type runtime = {
    os: string;
    arch: string;
    nodeVersion: string;
    npmVersion: string;
  };
  type disk = { size: number; used: number; available: number };
  type cpu = {
    manufacturer: string;
    brand: string;
    physicalCores: number;
    model: string;
    speed: number;
    rawCurrentLoad: number;
    rawCurrentLoadIdle: number;
    coresLoad: Array<{
      rawLoad: number;
      rawLoadIdle: number;
    }>;
  };
  type memory = { total: number; available: number; active: number };
}
