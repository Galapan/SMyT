import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import ParallaxSection from "./ParallaxSection";
import SectionHeader from "./SectionHeader";
import { stagger, fadeUp, vp } from "./landingVariants";
import { systemModules } from "./landingData";

export default function ModulesSection() {
  return (
    <ParallaxSection
      id="modulos"
      className="min-h-screen flex flex-col justify-center py-20 px-4 sm:px-6 bg-gray-50"
      intensity={56}
    >
      <div className="max-w-6xl mx-auto w-full">
        <SectionHeader
          label="Módulos del Sistema"
          title="Funcionalidades Completas"
          description="Cuatro módulos principales para cubrir todas las necesidades operativas."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={vp}
          className="grid md:grid-cols-2 gap-5"
        >
          {systemModules.map((module, i) => {
            const usePrimary = i % 2 === 0;
            const accentColor = usePrimary ? "primary" : "verde";
            const bgColorClass = usePrimary ? "bg-primary" : "bg-verde";

            return (
              <motion.div
                key={i}
                variants={{ hidden: fadeUp.hidden, show: fadeUp.show, hover: { y: -2, scale: 1.005 } }}
                whileHover="hover"
                transition={{ type: "spring", stiffness: 420, damping: 22, mass: 0.6 }}
                className="group relative bg-white rounded-xl p-6 ring-1 ring-gray-100 shadow-[0_1px_2px_rgba(17,24,39,0.04)] hover:shadow-[0_8px_20px_rgba(17,24,39,0.06)] transition-shadow duration-200 overflow-hidden"
              >
                <motion.div
                  variants={{ hidden: { rotate: 0, scale: 1 }, show: { rotate: 0, scale: 1 }, hover: { rotate: -6, scale: 1.06 } }}
                  transition={{ type: "spring", stiffness: 500, damping: 26 }}
                  className={`w-9 h-9 rounded-lg ${bgColorClass}/15 flex items-center justify-center mb-4`}
                >
                  <module.icon className={`w-5 h-5 text-${accentColor}`} />
                </motion.div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{module.title}</h3>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">{module.description}</p>
                <ul className="space-y-1.5">
                  {module.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${j % 2 === 0 ? `text-${accentColor}` : "text-verde"}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </ParallaxSection>
  );
}
