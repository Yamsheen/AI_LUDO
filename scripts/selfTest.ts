import axios from "axios";

const baseURL = "http://localhost:8000/api";

const print = (ok: boolean, message: string) => {
  console.log(`${ok ? "✔" : "✘"} ${message}`);
};

const run = async () => {
  let backendOk = false;
  let dbOk = false;
  let authOk = false;
  let leaderboardOk = false;

  try {
    const health = await axios.get(`${baseURL}/health`);
    backendOk = health.data.server === "ok";
    dbOk = health.data.db === "ok";
    print(backendOk, "Health API working");
  } catch {
    print(false, "Health API working");
  }

  const username = `tester_${Date.now()}`;
  const password = "secret123";
  let cookie = "";

  try {
    const signupRes = await axios.post(
      `${baseURL}/auth/signup`,
      {
        username,
        password,
        confirmPassword: password,
        dob: "2000-01-01",
      },
      { validateStatus: () => true },
    );
    const setCookie = signupRes.headers["set-cookie"]?.[0];
    cookie = setCookie?.split(";")[0] || "";
    print(signupRes.status === 201, "Signup working");
  } catch {
    print(false, "Signup working");
  }

  try {
    const loginRes = await axios.post(
      `${baseURL}/auth/login`,
      { username, password },
      { validateStatus: () => true },
    );
    const setCookie = loginRes.headers["set-cookie"]?.[0];
    if (setCookie) {
      cookie = setCookie.split(";")[0];
    }
    print(loginRes.status === 200, "Login working");
  } catch {
    print(false, "Login working");
  }

  try {
    const meRes = await axios.get(`${baseURL}/auth/me`, {
      headers: cookie ? { Cookie: cookie } : {},
      validateStatus: () => true,
    });
    authOk = meRes.status === 200;
    print(authOk, "Auth middleware working");
  } catch {
    print(false, "Auth middleware working");
  }

  try {
    const lbRes = await axios.get(`${baseURL}/stats/leaderboard`, {
      headers: cookie ? { Cookie: cookie } : {},
      validateStatus: () => true,
    });
    leaderboardOk = lbRes.status === 200;
    print(leaderboardOk, "Leaderboard API working");
  } catch {
    print(false, "Leaderboard API working");
  }

  console.log("========== APP STATUS ==========");
  console.log(`Backend API: ${backendOk ? "OK" : "FAIL"}`);
  console.log(`Database: ${dbOk ? "OK" : "FAIL"}`);
  console.log(`Auth system: ${authOk ? "OK" : "FAIL"}`);
  console.log("Socket.IO: FAIL");
  console.log("Real-time system: FAIL");
  console.log("================================");

  if (!(backendOk && dbOk && authOk && leaderboardOk)) {
    process.exit(1);
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
