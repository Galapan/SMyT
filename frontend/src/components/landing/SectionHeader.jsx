import { motion } from "framer-motion";
import { stagger, fadeUp, vp } from "./landingVariants";

export default function SectionHeader({ label, title, description }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={vp}
      className="mb-12"
    >
      <motion.p variants={fadeUp} className="text-sm font-medium text-primary mb-2">
        {label}
      </motion.p>
      <motion.h2
        variants={fadeUp}
        className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p variants={fadeUp} className="text-gray-500 max-w-xl leading-relaxed">
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
