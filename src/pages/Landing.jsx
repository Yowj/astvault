import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const Landing = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2940&auto=format&fit=crop')`,
        }}
      >
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <Sparkles className="w-7 h-7 text-white" />
          <span className="font-display text-xl md:text-2xl font-bold tracking-wider text-white uppercase">
            Liber Reverie
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 md:gap-4"
        >
          <Link
            to="/login"
            className="px-4 py-2 md:px-6 md:py-2.5 text-sm md:text-base font-medium text-white/90 hover:text-white transition-colors duration-300 tracking-wide"
          >
            Sign In
          </Link>
          <Link
            to="/home"
            className="group px-4 py-2 md:px-6 md:py-2.5 bg-white text-black text-sm md:text-base font-semibold tracking-wide hover:bg-white/90 transition-all duration-300 flex items-center gap-2"
          >
            <span>Explore</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col justify-center min-h-[calc(100vh-100px)] px-6 md:px-12 lg:px-20 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl"
        >
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-white/60 text-sm md:text-base tracking-[0.3em] uppercase mb-6 font-medium"
          >
            Template Management Platform
          </motion.p>

          {/* Main Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-8">
            <span className="block">CREATE ONCE,</span>
            <span className="block text-white/90">REUSE FOREVER</span>
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-white/70 text-base md:text-lg lg:text-xl max-w-xl leading-relaxed mb-10"
          >
            Store, organize, and access your code templates with AI-powered enhancements.
            Your personal library of reusable code, always at your fingertips.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/home"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-semibold text-base tracking-wide hover:bg-white/90 transition-all duration-300"
            >
              <span>Browse Templates</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-medium text-base tracking-wide hover:bg-white/10 hover:border-white/50 transition-all duration-300"
            >
              <span>Sign In to Create</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
        >
          <span className="text-white/40 text-xs tracking-[0.2em] uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent"
          />
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 bg-black/80 backdrop-blur-sm border-t border-white/10">
        <div className="px-6 md:px-12 lg:px-20 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
          >
            {/* Feature 1 */}
            <div className="group">
              <div className="text-white/30 text-5xl md:text-6xl font-display font-bold mb-4 group-hover:text-white/50 transition-colors duration-300">
                01
              </div>
              <h3 className="text-white text-lg md:text-xl font-semibold mb-3 tracking-wide">
                Organize & Categorize
              </h3>
              <p className="text-white/60 text-sm md:text-base leading-relaxed">
                Keep your templates organized with categories and powerful search. Find what you need instantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group">
              <div className="text-white/30 text-5xl md:text-6xl font-display font-bold mb-4 group-hover:text-white/50 transition-colors duration-300">
                02
              </div>
              <h3 className="text-white text-lg md:text-xl font-semibold mb-3 tracking-wide">
                AI-Powered Tools
              </h3>
              <p className="text-white/60 text-sm md:text-base leading-relaxed">
                Enhance your code with AI grammar improvements and get instant help from our AI assistant.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group">
              <div className="text-white/30 text-5xl md:text-6xl font-display font-bold mb-4 group-hover:text-white/50 transition-colors duration-300">
                03
              </div>
              <h3 className="text-white text-lg md:text-xl font-semibold mb-3 tracking-wide">
                Access Anywhere
              </h3>
              <p className="text-white/60 text-sm md:text-base leading-relaxed">
                Your templates sync across all devices. Access your library from anywhere, anytime.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 bg-black border-t border-white/10">
        <div className="px-6 md:px-12 lg:px-20 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Liber Reverie</span>
          </div>
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
