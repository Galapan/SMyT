import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { stagger, fadeUp, vp } from "./landingVariants";

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <LazyMotion features={domAnimation}>
      <section className="flex-1 flex flex-col items-center justify-center py-16 px-4 sm:px-6 bg-gray-50 w-full">
        <div className="max-w-2xl mx-auto text-center w-full">
          <m.div variants={stagger} initial="hidden" whileInView="show" viewport={vp}>
            <m.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight"
            >
              ¿Listo para comenzar?
            </m.h2>
            <m.p variants={fadeUp} className="text-gray-500 mb-8 leading-relaxed">
              Accede a la plataforma SMyT para gestionar vehículos, depósitos y
              concesionarios de manera eficiente y segura.
            </m.p>
            <m.div variants={fadeUp}>
              <button
                onClick={() => navigate("/login")}
                className="group bg-primary hover:opacity-90 px-7 py-3 rounded-lg text-white font-medium transition-opacity inline-flex items-center gap-2"
              >
                Iniciar Sesión
                <ArrowRight className="group-hover:translate-x-0.5 transition-transform" size={17} />
              </button>
            </m.div>
            <m.div variants={fadeUp} className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              {["Acceso seguro", "Soporte 24/7", "Actualizaciones constantes"].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-verde" />
                  {item}
                </span>
              ))}
            </m.div>
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
}
