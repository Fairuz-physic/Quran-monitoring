export async function fetchAllProgress() {

  try {

    const res = await fetch(
      "https://quran-monitoring-cq7u.vercel.app/auth/login/getAllProgress",
    );

    const data = await res.json();

    return data;

  } catch (err) {

    console.log(err);

    return null;
  }
}
