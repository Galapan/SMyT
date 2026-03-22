import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import ParallaxSection from "./ParallaxSection";
import SectionHeader from "./SectionHeader";
import { stagger, fadeUp, vp } from "./landingVariants";
import { features, accentColors, bgAccentColors } from "./landingData";

export default function FeaturesSection() {
  return (
    <LazyMotion features={domAnimation}>
      <ParallaxSection
        id="caracteristicas"
        className="min-h-screen flex flex-col justify-center py-20 px-4 sm:px-6 bg-white"
        intensity={52}
      >
        <div className="max-w-6xl mx-auto w-full">
          <SectionHeader
            label="Características"
            title="Todo lo que Necesitas"
            description="Funcionalidades completas para la administración vehicular estatal."
          />

          <m.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={vp}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((feature) => {
              const accentColor = accentColors[features.indexOf(feature) % accentColors.length];
              const bgColorClass = bgAccentColors[features.indexOf(feature) % bgAccentColors.length];

              return (
                <m.div
                  key={feature.id}
                  variants={{ hidden: fadeUp.hidden, show: fadeUp.show, hover: { y: -2, scale: 1.005 } }}
                  whileHover="hover"
                  transition={{ type: "spring", stiffness: 420, damping: 22, mass: 0.6 }}
                  className="group relative bg-white rounded-xl p-6 ring-1 ring-gray-100 shadow-[0_1px_2px_rgba(17,24,39,0.04)] hover:shadow-[0_8px_20px_rgba(17,24,39,0.06)] transition-shadow duration-200 overflow-hidden"
                >
                  <m.div
                    variants={{ hidden: { rotate: 0, scale: 1 }, show: { rotate: 0, scale: 1 }, hover: { rotate: -6, scale: 1.06 } }}
                    transition={{ type: "spring", stiffness: 500, damping: 26 }}
                    className={`w-9 h-9 rounded-lg ${bgColorClass}/15 flex items-center justify-center mb-4`}
                  >
                    <feature.icon className={`w-5 h-5 text-${accentColor}`} />
                  </m.div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 leading-relaxed">{feature.description}</p>
                  <ul className="space-y-1.5">
                    {feature.details.map((detail, j) => (
                      <li key={j} className="flex items-center gap-2 text-xs text-gray-400">
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 bg-${accentColors[j % accentColors.length]}`} />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </m.div>
              );
            })}
          </m.div>
        </div>
      </ParallaxSection>
    </LazyMotion>
  );
}
