export async function fecthAllUser() {

  try {

    const res = await fetch(
      "http://localhost:5001/auth/login/getAllUser",
    );

    const data = await res.json();

    return data;

  } catch (err) {

    console.log(err);

    return null;
  }
}
