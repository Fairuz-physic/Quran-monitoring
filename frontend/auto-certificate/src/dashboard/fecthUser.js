export async function fetchUser() {

  try {

    const token = localStorage.getItem("token");

    const res = await fetch(
      "https://quran-monitoring-cq7u.vercel.app/auth/login/me",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    return data;

  } catch (err) {

    console.log(err);

    return null;
  }
}