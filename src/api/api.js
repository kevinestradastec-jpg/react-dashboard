const API_URL =
  "https://script.google.com/macros/s/AKfycbyk8cnr6xm3833O727oIDda96M-YRFxWr7t2K0nQKSfzniVZKJf0bT4NuZ8kvSTRb4P/exec";

async function parseJsonResponse(res) {
  if (!res.ok) {
    throw new Error(`HTTP error ${res.status}`);
  }

  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Invalid JSON response:", text);
    throw new Error("Server did not return valid JSON.");
  }
}

export async function fetchProjects() {
  const res = await fetch(`${API_URL}?type=projects`);
  return parseJsonResponse(res);
}

export async function createProject(projectData) {
  const body = new URLSearchParams();
  body.append("action", "createProject");

  Object.entries(projectData || {}).forEach(([key, value]) => {
    body.append(key, value ?? "");
  });

  const res = await fetch(API_URL, {
    method: "POST",
    body,
  });

  return parseJsonResponse(res);
}

export async function deleteProject(projectId) {
  const body = new URLSearchParams();
  body.append("action", "deleteProject");
  body.append("projectId", projectId);

  const res = await fetch(API_URL, {
    method: "POST",
    body,
  });

  return parseJsonResponse(res);
}

export async function fetchTasks() {
  const res = await fetch(`${API_URL}?type=tasks`);
  return parseJsonResponse(res);
}

export async function fetchInvoices() {
  const res = await fetch(`${API_URL}?type=invoices`);
  return parseJsonResponse(res);
}

export async function fetchDashboard(projectId) {
  const res = await fetch(
    `${API_URL}?type=dashboard&projectId=${encodeURIComponent(projectId)}`
  );
  return parseJsonResponse(res);
}