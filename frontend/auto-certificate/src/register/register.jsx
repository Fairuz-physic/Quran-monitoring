import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState(null)
  const [error, errorMessage] = useState(null)


  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        errorMessage(null);
      }, 1500);

    return () => clearTimeout(timer);
  }
}, [error]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);

    return () => clearTimeout(timer);
  }
}, [message]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // penting banget, biar page ga reload

    if (form.password !== form.confirmPassword) {
      errorMessage({ type: "error", text: "The passwords don't match" })
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      console.log("W response:", data);

      if(res.ok){
        setMessage({ type: "success", text: "User has been created, please log in!" });
        setForm({ name: "", email: "", password: "", confirmPassword: "" });
      }else{
        setMessage({ type: "error", text: data.message || "Something went wrong, try again" });
      }
    } catch (err) {
      console.error("L moment:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* BACKGROUND EFFECT */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-green-500/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-500/10 blur-3xl rounded-full" />

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-md border-b border-green-500/20">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-black text-green-400">
            Khatam Al-Qur'an
          </h1>

          <div className="flex gap-8 text-lg">
            <a
              href="/"
              className="hover:text-green-400 transition duration-300"
            >
              Home
            </a>

            <a
              href="/login"
              className="hover:text-green-400 transition duration-300"
            >
              Login
            </a>
          </div>
        </div>
      </nav>

      {/* MAIN SECTION */}
      <section className="min-h-screen flex items-center justify-center px-6 py-32 relative z-10">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="uppercase tracking-[0.3em] text-green-400 text-sm">
              Join The Journey
            </p>

            <h1 className="text-5xl md:text-7xl font-black leading-tight mt-6">
              Start Your
              <br />
              Qur'an
              <br />
              Progress.
            </h1>

            <p className="text-gray-300 mt-8 text-lg leading-relaxed max-w-xl">
              Create your account to monitor your Qur'an reading journey,
              receive admin approvals, and automatically generate your khatam
              certificate beautifully.
            </p>

            {/* AYAH CARD */}
            <div className="mt-12 bg-white/5 border border-green-500/20 rounded-3xl p-8 backdrop-blur-md">
              <p className="text-green-400 font-bold">
                QS. Al-'Alaq : 1
              </p>

              <p className="text-4xl text-center leading-loose mt-6 font-semibold">
                ٱقْرَأْ بِٱسْمِ رَبِّكَ ٱلَّذِى خَلَقَ
              </p>

              <p className="text-gray-300 mt-6 text-center leading-relaxed">
                “Read in the name of your Lord who created.”
              </p>
            </div>
          </motion.div>

          {/* RIGHT SIDE */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="bg-white/5 border border-green-500/20 rounded-[2rem] p-10 md:p-14 backdrop-blur-xl shadow-[0_0_50px_rgba(34,197,94,0.15)]"
          >
            <div className="mb-10">
              <h2 className="text-5xl font-black text-green-400">
                Register
              </h2>

              <p className="text-gray-400 mt-4 text-lg">
                Begin your khatam Qur'an journey today.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-2xl px-5 py-4 border ${
                    error.type === "success"
                      ? "bg-green-500/10 border-green-500/30 text-green-400"
                      : "bg-red-500/10 border-red-500/30 text-red-400"
                  }`}
                >
                  {error.text}
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-2xl px-5 py-4 border ${
                    message.type === "success"
                      ? "bg-green-500/10 border-green-500/30 text-green-400"
                      : "bg-red-500/10 border-red-500/30 text-red-400"
                  }`}
                >
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>
              {/* FULL NAME */}
              <div>
                <label className="block mb-3 text-gray-300">
                  Full Name
                </label>

                <input
                  type="name"
                  name="name"
                  placeholder="Enter your full name"
                  className="w-full bg-black/60 border border-green-500/20 focus:border-green-400 outline-none rounded-2xl px-5 py-4 text-white transition"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block mb-3 text-gray-300">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full bg-black/60 border border-green-500/20 focus:border-green-400 outline-none rounded-2xl px-5 py-4 text-white transition"
                  value={form.email}
                  onChange={handleChange}
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
                  placeholder="Create your password"
                  className="w-full bg-black/60 border border-green-500/20 focus:border-green-400 outline-none rounded-2xl px-5 py-4 text-white transition"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="block mb-3 text-gray-300">
                  Confirm Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  className="w-full bg-black/60 border border-green-500/20 focus:border-green-400 outline-none rounded-2xl px-5 py-4 text-white transition"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-400 transition duration-300 text-black font-bold py-4 rounded-2xl shadow-[0_0_25px_rgba(34,197,94,0.4)]"
              >
                Create Account
              </button>
            </form>

            {/* LOGIN LINK */}
            <p className="text-gray-400 mt-8 text-center">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-green-400 hover:text-green-300"
              >
                Login
              </a>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}