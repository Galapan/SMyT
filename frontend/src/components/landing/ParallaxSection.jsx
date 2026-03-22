import { useScroll, useTransform, LazyMotion, domAnimation, m } from "framer-motion";
import { useRef } from "react";

export default function ParallaxSection({ id, className, intensity = 48, children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [intensity, -intensity]);

  return (
    <LazyMotion features={domAnimation}>
      <section id={id} ref={ref} className={`${className} relative overflow-hidden`}>
        <m.div style={{ y }} className="will-change-transform">
          {children}
        </m.div>
      </section>
    </LazyMotion>
  );
}
