export async function fecthAllUser() {

  try {

    const res = await fetch(
      "https://quran-monitoring-cq7u.vercel.app/auth/login/getAllUser",
    );

    const data = await res.json();

    return data;

  } catch (err) {

    console.log(err);

    return null;
  }
}
