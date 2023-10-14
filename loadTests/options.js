// Smoke
const smoke = {
  vus: 5,
  duration: "1m",
};

// Load
const load = {
  stages: [
    { target: 50, duration: "5m" },
    { target: 100, duration: "10m" },
    { target: 50, duration: "5m" },
  ],
};

// Stress
const stress = {
  stages: [
    { target: 100, duration: "5m" },
    { target: 250, duration: "10m" },
    { target: 100, duration: "5m" },
  ],
};

// Spike
const spike = {
  stages: [
    { target: 1000, duration: "1m" },
    { target: 0, duration: "10s" },
  ],
};

// Soak
const soak = {
  stages: [
    { target: 50, duration: "5m" },
    { target: 100, duration: "1h" },
    { target: 50, duration: "5m" },
  ],
};

// Breakpoint
const breakpoint = {
  stages: [{ target: 10000, duration: "2h" }],
  tresholds: {
    http_req_duration: {
      treshold: ["p(95) < 200", "p(99) < 1000"],
      abortOnFail: true,
      delayAbortEval: "10s",
    },
    http_req_failed: {
      treshold: ["rate<0.02"],
      abortOnFail: true,
      delayAbortEval: "10s",
    },
  },
};

export { smoke, load, stress, spike, soak, breakpoint };
