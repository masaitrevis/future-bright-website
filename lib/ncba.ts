import { NextResponse } from "next/server";

export async function POST() {
  const username = process.env.NCBA_USERNAME || "";
  const password = process.env.NCBA_PASSWORD || "";
  const baseUrl = (process.env.NCBA_BASE_URL || "https://c2bapis.ncbagroup.com").replace(/\/+$/, "");
  
  const results: any[] = [];

  // Method 1: GET with Basic Auth (what your code does)
  try {
    const basic = Buffer.from(`${username}:${password}`, "utf8").toString("base64");
    const res = await fetch(`${baseUrl}/payments/api/v1/auth/token`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${basic}`,
        Accept: "application/json",
      },
      redirect: "manual",
    });
    const body = await res.text();
    results.push({
      method: "GET + Basic Auth header",
      status: res.status,
      headersSent: `Authorization: Basic ${basic.slice(0, 20)}...`,
      response: body.slice(0, 200),
    });
  } catch (e: any) {
    results.push({ method: "GET + Basic Auth header", error: e.message });
  }

  // Method 2: POST with Basic Auth header + empty JSON body
  try {
    const basic = Buffer.from(`${username}:${password}`, "utf8").toString("base64");
    const res = await fetch(`${baseUrl}/payments/api/v1/auth/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({}),
      redirect: "manual",
    });
    const body = await res.text();
    results.push({
      method: "POST + Basic Auth + empty JSON body",
      status: res.status,
      headersSent: `Authorization: Basic ${basic.slice(0, 20)}...`,
      response: body.slice(0, 200),
    });
  } catch (e: any) {
    results.push({ method: "POST + Basic Auth + empty JSON body", error: e.message });
  }

  // Method 3: POST with username/password in JSON body
  try {
    const res = await fetch(`${baseUrl}/payments/api/v1/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ username, password }),
      redirect: "manual",
    });
    const body = await res.text();
    results.push({
      method: "POST + JSON body auth (no Basic header)",
      status: res.status,
      response: body.slice(0, 200),
    });
  } catch (e: any) {
    results.push({ method: "POST + JSON body auth", error: e.message });
  }

  // Method 4: POST with form data
  try {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    const res = await fetch(`${baseUrl}/payments/api/v1/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: formData.toString(),
      redirect: "manual",
    });
    const body = await res.text();
    results.push({
      method: "POST + form data auth",
      status: res.status,
      response: body.slice(0, 200),
    });
  } catch (e: any) {
    results.push({ method: "POST + form data auth", error: e.message });
  }

  // Method 5: GET with URL-encoded credentials as query params
  try {
    const res = await fetch(
      `${baseUrl}/payments/api/v1/auth/token?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
        redirect: "manual",
      }
    );
    const body = await res.text();
    results.push({
      method: "GET + query params",
      status: res.status,
      response: body.slice(0, 200),
    });
  } catch (e: any) {
    results.push({ method: "GET + query params", error: e.message });
  }

  return NextResponse.json({
    env: {
      usernameSet: !!process.env.NCBA_USERNAME,
      passwordSet: !!process.env.NCBA_PASSWORD,
      passwordLength: password.length,
      baseUrl,
    },
    results,
  });
}
