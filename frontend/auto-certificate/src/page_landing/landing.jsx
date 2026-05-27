import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function App() {
const hadiths = [
  {
    title: "QS. Al-'Alaq : 1",
    arabic: "ٱقْرَأْ بِٱسْمِ رَبِّكَ ٱلَّذِى خَلَقَ",
    text: "Read in the name of your Lord who created.",
  },
  {
    title: "HR. Muslim",
    arabic:
      "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    text: "The best among you are those who learn the Qur'an and teach it.",
  },
  {
    title: "QS. Al-Isra : 9",
    arabic:
      "إِنَّ هَٰذَا ٱلْقُرْءَانَ يَهْدِى لِلَّتِى هِىَ أَقْوَمُ",
    text: "Indeed, this Qur'an guides to that which is most suitable.",
  },
];
  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden relative w-full">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-green-500/20">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wide text-green-400">
            Khatam Al-Qur'an
          </h1>

          <div className="flex gap-8 text-lg">
            <Link to="/login" className="hover:text-green-400 transition duration-300">
              Login
            </Link>
            <Link to="/register" className="hover:text-green-400 transition duration-300">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
          <div className="absolute inset-0 -z-0">
          <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-green-500/20 rounded-full blur-[140px]" />
          
          <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-green-500/20 rounded-full blur-[140px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[180px]" />
          </div>
          <div className="max-w-6xl mx-auto px-6">
            
          </div>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center py-25">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-72 h-72 rounded-3xl border-2 border-green-500 bg-white/5 backdrop-blur-md overflow-hidden shadow-[0_0_40px_rgba(34,197,94,0.3)]">
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/049/069/603/small_2x/a-muslim-man-is-reading-the-quran-in-a-peaceful-setting-with-a-dim-and-serene-nighttime-background-photo.jpg"
                alt="Quran"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <p className="text-green-400 uppercase tracking-[0.3em] mb-4">
              Auto PDF Certificate Program
            </p>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              Read.
              <br />
              Track.
              <br />
              Complete Qur'an.
            </h1>

            <p className="text-gray-300 mt-8 text-lg leading-relaxed">
              A modern platform to monitor Qur'an reading progress, approve
              recitations, and automatically generate beautiful certificates
              after completing khatam Qur'an.
            </p>

            <div className="mt-10 flex gap-5 flex-wrap">
              <button className="bg-green-500 hover:bg-green-400 transition px-8 py-4 rounded-2xl text-black font-bold shadow-[0_0_25px_rgba(34,197,94,0.4)]">
                Start Reading
              </button>

              <button className="border border-green-500 hover:bg-green-500/10 transition px-8 py-4 rounded-2xl">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>


      {/* ABOUT */}
      {/* <section className="py-32 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 -z-0">
          <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-green-500/20 rounded-full blur-[140px]" />
          
          <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-green-500/20 rounded-full blur-[140px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[180px]" />
          </div> */}
          <div className="max-w-6xl mx-auto px-6 py-32">
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-green-600 font-semibold tracking-[0.3em] uppercase">
              About Program
            </p>

            <h2 className="text-5xl font-black mt-4">
              Why This Website Exists
            </h2>

            <p className="max-w-3xl mx-auto mt-8 text-lg text-gray-300 leading-relaxed">
              This website helps Muslims consistently read the Qur'an while
              keeping their progress organized. Admins can validate every
              reading session and users can instantly receive certificates after
              finishing their khatam journey.
            </p>
          </motion.div>
        </div>
      {/* </section> */}

      <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500/10 blur-3xl rounded-full" />

      {/* HADITH / AYAH */}
      {/* <section className="py-32 bg-black">
                <div className="absolute inset-0 -z-0">
          <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-green-500/20 rounded-full blur-[140px]" />
          
          <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-green-500/20 rounded-full blur-[140px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[180px]" />
          </div>
          <div className="max-w-6xl mx-auto px-6">
            
          </div> */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-green-400 uppercase tracking-[0.3em]">
              Reminder
            </p>

            <h2 className="text-5xl font-black mt-4">
              The Beauty of Reading Qur'an
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {hadiths.map((item, index) => (
              <motion.div
              key={index}
              whileHover={{scale: 1.03, y: -10,}}
              transition={{ duration: 0.1 }}
              className="border border-green-500/30 bg-white/[0.03] backdrop-blur-xl rounded-3xl p-10 shadow-[0_0_30px_rgba(34,197,94,0.08)] hover:shadow-[0_0_60px_rgba(34,197,94,0.25)] transition duration-300">
              
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-green-400 text-2xl mb-6">
                  <img src="https://img.icons8.com/?size=100&id=101343&format=png&color=000000" alt="moon" className="w-full h-full object-cover rounded-2xl" />
                </div>

                <h3 className="text-green-400 font-bold text-xl">
                  {item.title}
                </h3>
                
                <p className="text-2xl leading-loose text-center mt-6 font-semibold text-white">
                  {item.arabic}
                </p>

                <p className="text-gray-300 mt-5 leading-relaxed text-lg">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      {/* </section> */}

      {/* FEATURES */}
      {/* <section className="py-32 bg-black text-white relative overflow-hidden">

        <div className="absolute inset-0 -z-0">
          <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-green-500/20 rounded-full blur-[140px]" />
          
          <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-green-500/20 rounded-full blur-[140px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[180px]" />
          </div>
          <div className="max-w-6xl mx-auto px-6">

          </div> */}
        <div className="max-w-7xl mx-auto px-6 py-32">
          <div className="text-center mb-20">
            <p className="uppercase tracking-[0.3em] text-green-600">
              Features
            </p>

            <h2 className="text-5xl font-black mt-4">
              Everything You Need
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 ">
            {[
              "Track Qur'an progress",
              "Admin approval system",
              "Auto-generate PDF certificate",
            ].map((feature, index) => (
            <motion.div
            key={index}
            whileHover={{scale: 1.03, y: -10,}}
            transition={{ duration: 0.1 }}
            className="border border-green-500/30 bg-white/[0.03] backdrop-blur-xl rounded-3xl p-10 shadow-[0_0_30px_rgba(34,197,94,0.08)] hover:shadow-[0_0_60px_rgba(34,197,94,0.25)] transition duration-300">
                <div className="text-5xl mb-6 text-green-600">0{index + 1}</div>

                <h3 className="text-2xl font-bold">{feature}</h3>

                <p className="mt-4 text-gray-300">
                  Beautiful and simple system designed for Islamic learning
                  programs and khatam Qur'an activities.
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      {/* </section> */}

      {/* FOOTER */}
      <footer className="border-t border-green-500/20 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-green-400">
              Khatam Al-Qur'an
            </h2>

            <p className="text-gray-400 mt-3">
              Build with sincerity for Muslims around the world.
            </p>
          </div>

          <div className="text-gray-400">
            <p>Contact : 08xxx</p>
            <p className="mt-2">Instagram : @yourprogram</p>
          </div>
        </div>
      </footer>
    </div>
  );
}