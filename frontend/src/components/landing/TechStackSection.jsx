import { motion, AnimatePresence } from "framer-motion";
import ParallaxSection from "./ParallaxSection";
import SectionHeader from "./SectionHeader";
import { stagger, fadeUp, vp } from "./landingVariants";
import { frontendStack, backendStack } from "./landingData";

export default function TechStackSection() {
  const allTech = [...frontendStack, ...backendStack];

  return (
    <ParallaxSection
      id="tecnologia"
      className="min-h-screen flex flex-col justify-center py-20 px-4 sm:px-6 bg-white"
      intensity={58}
    >
      <div className="max-w-6xl mx-auto w-full">
        <SectionHeader
          label="Stack Tecnológico"
          title="Tecnología Moderna"
          description="Stack de última generación para una plataforma rápida, segura y escalable."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={vp}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {allTech.map((tech, i) => (
            <motion.div
              key={i}
              variants={{ hidden: fadeUp.hidden, show: fadeUp.show, hover: { y: -6, scale: 1.06 } }}
              whileHover="hover"
              transition={{ type: "spring", stiffness: 420, damping: 22, mass: 0.6 }}
              className="group relative flex flex-col items-center justify-center gap-2.5 p-5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50/60 hover:border-gray-400 transition-colors duration-200 overflow-hidden"
            >
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <div className="absolute -top-10 -left-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                <div className="absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-gray-900/5 blur-2xl" />
              </motion.div>

              <motion.div
                variants={{ hidden: { rotate: 0, scale: 1 }, show: { rotate: 0, scale: 1 }, hover: { rotate: -6, scale: 1.06 } }}
                transition={{ type: "spring", stiffness: 500, damping: 26 }}
                className="w-11 h-11 flex items-center justify-center text-gray-400 group-hover:text-gray-800 transition-colors duration-200"
              >
                <tech.Logo size={40} className="w-full h-full drop-shadow-sm" />
              </motion.div>

              <span className="text-xs font-semibold text-gray-600 text-center group-hover:text-gray-900 transition-colors duration-200">
                {tech.name}
              </span>

              <AnimatePresence>
                <motion.p
                  key="desc"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="text-[11px] leading-snug text-gray-500 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  {tech.description}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </ParallaxSection>
  );
}
