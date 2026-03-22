import { LazyMotion, domAnimation, m } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";
import ParallaxSection from "./ParallaxSection";
import { staggerSlow, fadeUp, fadeUpStrong, scaleIn } from "./landingVariants";
import { stats } from "./landingData";
import LogoSMyT from "../../assets/logo_smyt.png";
import LogoTlax from "../../assets/LogoTlax.png";

/** Exact Tech Stack card hover — glow spotlight + spring y/scale */
const techHover = {
  whileHover: { y: -6, scale: 1.06 },
  transition: { type: "spring", stiffness: 420, damping: 22, mass: 0.6 },
};

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <ParallaxSection
      id="inicio"
      className="min-h-screen flex items-center justify-center bg-white pt-16 relative"
      intensity={28}
    >
      <div className="absolute inset-0 pointer-events-none bg-white" />

      <LazyMotion features={domAnimation}>
        <m.div className="max-w-4xl mx-auto px-4 sm:px-6 text-center py-20 relative z-10">
          {/* Logos */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex justify-center items-center gap-4 mb-10"
          >
            <m.img
              src={LogoTlax}
              alt="Gobierno de Tlaxcala"
              className="h-16 w-16 object-contain"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="h-8 w-px bg-linear-to-b from-transparent via-gray-200 to-transparent" />
            <m.img
              src={LogoSMyT}
              alt="SMyT"
              className="h-10 w-auto object-contain"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
          </m.div>

          <m.div variants={staggerSlow} initial="hidden" animate="show">
            {/* Badge */}
            <m.div>
            </m.div>

            {/* Title */}
            <m.h1
              variants={fadeUpStrong}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight leading-tight"
            >
              Secretaría de{" "}
              <span className="text-primary">Movilidad y Transporte</span>
            </m.h1>

            <m.p variants={fadeUp} className="text-lg text-gray-400 mb-3">
              Tlaxcala, México
            </m.p>

            <m.p
              variants={fadeUp}
              className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Plataforma integral para la gestión de depósitos vehiculares,
              concesionarios y auditoría de inventarios.
            </m.p>

            {/* CTAs — exact same animation as Tech Stack cards */}
            <m.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              {/* Primary CTA */}
              <m.button
                onClick={() => navigate("/login")}
                {...techHover}
                className="group relative overflow-hidden bg-primary hover:bg-primary/90 px-7 py-3 rounded-lg text-white font-medium transition-colors duration-200 shadow-sm hover:shadow hover:shadow-primary/20 inline-flex items-center gap-2"
              >
                <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="absolute -top-10 -left-10 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                  <span className="absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
                </span>
                Acceder al Sistema
              </m.button>

              {/* Secondary CTA */}
              <m.a
                href="#modulos"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#modulos")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                {...techHover}
                className="group relative overflow-hidden px-7 py-3 rounded-lg text-primary hover:bg-primary/5 font-medium transition-colors duration-200 inline-flex items-center gap-2"
              >
                <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="absolute -top-10 -left-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                  <span className="absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-gray-900/5 blur-2xl" />
                </span>
                Conocer más
              </m.a>
            </m.div>

            {/* Stats */}
            <m.div
              variants={scaleIn}
              className="grid grid-cols-2 md:grid-cols-4 border border-gray-200 rounded-xl overflow-hidden divide-x divide-y md:divide-y-0 divide-gray-200 max-w-3xl mx-auto shadow-sm"
            >
              {stats.map((stat) => (
                <div key={stat.id} className="bg-white py-6 px-4 text-center hover:bg-gray-50 transition-colors">
                  <div className="text-3xl font-bold text-primary mb-1">{stat.number}</div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </m.div>
          </m.div>
        </m.div>
      </LazyMotion>
    </ParallaxSection>
  );
}
