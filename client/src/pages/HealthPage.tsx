import { useEffect, useState } from "react";
import api from "../services/api.ts";

type HealthPayload = {
  server: string;
  db: string;
  time: string;
};

const HealthPage = () => {
  const [health, setHealth] = useState<HealthPayload | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/health")
      .then((res) => setHealth(res.data))
      .catch((err) => setError(err.message || "Health check failed"));
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <h2>System Health</h2>
      {error ? <p style={{ color: "red" }}>{error}</p> : null}
      {health ? (
        <>
          <p>Server status: {health.server}</p>
          <p>DB status: {health.db}</p>
          <p>API reachable: yes</p>
          <p>Time: {health.time}</p>
        </>
      ) : (
        <p>Checking health...</p>
      )}
    </div>
  );
};

export default HealthPage;
