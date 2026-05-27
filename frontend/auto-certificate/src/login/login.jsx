import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";



export default function Login() { 
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
     
      const res = await fetch("http://localhost:5001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // kalau user ga exist atau password salah
        setError(data.message || "invalid password or email");
        return;
      }

      // simpan token ke localStorage
      localStorage.setItem("token", data.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(data.data.user)
      );

      console.log("ts is shit",data.data.user.role)

      // redirect ke MainPage
      const role = data.data.user.role;
      if(role === "ADMIN"){
        navigate("/admin");
      }else{
        navigate("/main");
      }
      

    } catch (err) {
      setError("Something went wrong, try again");
      console.error("L moment:", err);
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <div className="bg-black text-white min-h-screen overflow-hidden relative">
      {/* BACKGROUND BLUR */}
      <div className="absolute inset-0 -z-0">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-green-500/20 rounded-full blur-[140px]" />

        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-green-500/20 rounded-full blur-[140px]" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[180px]" />
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-md border-b border-green-500/20">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-black text-green-400">
            Khatam Al-Qur'an
          </h1>

          <div className="flex gap-8 text-lg">
            <Link
              to="/"
              className="hover:text-green-400 transition duration-300"
            >
              Home
            </Link>

            <Link
              to="/register"
              className="hover:text-green-400 transition duration-300"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* LOGIN SECTION */}
      <section className="min-h-screen flex items-center justify-center px-6 py-32">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="uppercase tracking-[0.3em] text-green-400 text-sm">
              Welcome Back
            </p>

            <h1 className="text-5xl md:text-7xl font-black leading-tight mt-6">
              Continue Your
              <br />
              Qur'an
              <br />
              Journey.
            </h1>

            <p className="text-gray-300 mt-8 text-lg leading-relaxed max-w-xl">
              Log in to continue tracking your Qur'an reading progress,
              monitor approvals, and complete your khatam journey beautifully.
            </p>

            {/* HADITH CARD */}
            <div className="mt-12 border border-green-500/30 bg-white/[0.03] backdrop-blur-xl rounded-3xl p-8 shadow-[0_0_30px_rgba(34,197,94,0.08)]">
              <p className="text-green-400 font-bold">
                HR. Muslim
              </p>

              <p className="text-3xl text-center leading-loose mt-6 font-semibold">
                خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ
              </p>

              <p className="text-gray-300 mt-6 text-center leading-relaxed">
                “The best among you are those who learn the Qur'an and teach it.”
              </p>
            </div>
          </motion.div>

          {/* RIGHT SIDE */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="border border-green-500/30 bg-white/[0.03] backdrop-blur-xl rounded-[2rem] p-10 md:p-14 shadow-[0_0_40px_rgba(34,197,94,0.12)]"
          >
            <div className="mb-10">
              <h2 className="text-5xl font-black text-green-400">
                Login
              </h2>

              <p className="text-gray-400 mt-4 text-lg">
                Continue your khatam Qur'an journey.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6"> 
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-4 text-red-400">
                {error}
              </div>
              )}

              {/* EMAIL */}
              <div>
                <label className="block mb-3 text-gray-300">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="w-full bg-black/60 border border-green-500/20 focus:border-green-400 outline-none rounded-2xl px-5 py-4 text-white transition"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block mb-3 text-gray-300">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full bg-black/60 border border-green-500/20 focus:border-green-400 outline-none rounded-2xl px-5 py-4 text-white transition"
                />
              </div>

              {/* REMEMBER */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-3 text-gray-400">
                  <input
                    type="checkbox"
                    name="remember"
                    className="accent-green-500"
                  />
                  Remember me
                </label>

                <a
                  href="#"
                  className="text-green-400 hover:text-green-300"
                >
                  Forgot password?
                </a>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                diabled={loading}
                className="w-full bg-green-500 hover:bg-green-400 transition duration-300 text-black font-bold py-4 rounded-2xl shadow-[0_0_25px_rgba(34,197,94,0.4)]"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* REGISTER */}
            <p className="text-gray-400 mt-8 text-center">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-green-400 hover:text-green-300"
              >
                Register
              </Link>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
