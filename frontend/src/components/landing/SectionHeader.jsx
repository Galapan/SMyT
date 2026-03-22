import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { stagger, fadeUp, vp } from "./landingVariants";

export default function SectionHeader({ label, title, description }) {
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={vp}
        className="mb-12"
      >
        <m.p variants={fadeUp} className="text-sm font-medium text-primary mb-2">
          {label}
        </m.p>
        <m.h2
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight"
        >
          {title}
        </m.h2>
        {description && (
          <m.p variants={fadeUp} className="text-gray-500 max-w-xl leading-relaxed">
            {description}
          </m.p>
        )}
      </m.div>
    </LazyMotion>
  );
}
