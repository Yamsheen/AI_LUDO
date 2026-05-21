import { execSync } from "node:child_process";
import process from "node:process";

const port = Number(process.env.PORT || 8000);

const killPid = (pid: string) => {
  if (process.platform === "win32") {
    execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
    return;
  }
  execSync(`kill -9 ${pid}`, { stdio: "ignore" });
};

const getPidsUsingPort = (targetPort: number): string[] => {
  try {
    if (process.platform === "win32") {
      try {
        const psOutput = execSync(
          `powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort ${targetPort} -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess"`,
          { encoding: "utf-8", stdio: ["pipe", "pipe", "ignore"] },
        );
        const fromPs = psOutput
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((pid) => /^\d+$/.test(pid));
        if (fromPs.length > 0) {
          return [...new Set(fromPs)];
        }
      } catch {
        // fallback below
      }

      const output = execSync("netstat -ano", { encoding: "utf-8" });
      const fromNetstat = output
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.includes(`:${targetPort}`) && line.includes("LISTENING"))
        .map((line) => line.split(/\s+/).at(-1) || "")
        .filter((pid) => /^\d+$/.test(pid));
      return [...new Set(fromNetstat)];
    }

    const output = execSync(`lsof -ti:${targetPort}`, { encoding: "utf-8" });
    return output
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => /^\d+$/.test(line));
  } catch {
    return [];
  }
};

const pids = getPidsUsingPort(port);
if (pids.length === 0) {
  console.log(`Port ${port} already free`);
  process.exit(0);
}

console.log(`Port ${port} in use. Killing ${pids.length} process(es)...`);
for (const pid of pids) {
  try {
    killPid(pid);
    console.log(`Killed PID ${pid}`);
  } catch {
    console.log(`Could not kill PID ${pid}`);
  }
}

const remaining = getPidsUsingPort(port);
if (remaining.length > 0) {
  console.log(`Port ${port} still in use by PID(s): ${remaining.join(", ")}`);
  process.exit(1);
}

console.log(`Port ${port} is now free`);
