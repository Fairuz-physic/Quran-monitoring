export async function loginUser(email, password) {
  const res = await fetch("https://quran-monitoring-cq7u.vercel.app/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  return data; // return the data
}