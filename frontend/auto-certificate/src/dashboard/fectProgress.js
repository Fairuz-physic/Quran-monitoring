export async function fetchProgres() {

  try {

    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:5001/auth/login/getProgres",
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