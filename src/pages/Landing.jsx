import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

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
          <span className="font-display text-xl md:text-2xl font-bold tracking-wider text-white uppercase">
            Liber Reverie
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-8"
        >
          <Link
            to="/login"
            className="group relative text-sm md:text-base font-light text-white/70 hover:text-white transition-colors duration-300 tracking-widest uppercase"
          >
            Sign In
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-500 ease-out" />
          </Link>
          <Link
            to="/home"
            className="group relative text-sm md:text-base font-light text-white tracking-widest uppercase flex items-center gap-2"
          >
            <span>Explore</span>
            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            <span className="absolute -bottom-1 left-0 w-full h-px bg-white/30 group-hover:bg-white transition-colors duration-500" />
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
            className="text-white/70 text-base md:text-lg lg:text-xl max-w-xl leading-relaxed mb-12"
          >
            Store, organize, and access your code templates with AI-powered enhancements. Your
            personal library of reusable templates, always at your fingertips.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex items-center gap-8"
          >
            {/* Primary - Corner brackets that expand */}
            <Link
              to="/home"
              className="group relative px-8 py-4"
            >
              {/* Top-left corner */}
              <span className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/50 group-hover:w-full group-hover:h-full group-hover:border-white transition-all duration-500 ease-out" />
              {/* Bottom-right corner */}
              <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/50 group-hover:w-full group-hover:h-full group-hover:border-white transition-all duration-500 ease-out" />
              <span className="relative text-white text-sm tracking-[0.2em] uppercase font-light">
                Browse Templates
              </span>
            </Link>

            {/* Secondary - Simple with arrow */}
            <Link
              to="/login"
              className="group flex items-center gap-3 text-white/50 hover:text-white transition-colors duration-300"
            >
              <span className="text-sm tracking-[0.2em] uppercase font-light">Sign In</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
