import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { MapPin, Clock } from "lucide-react";
import { fadeUp, vp } from "./landingVariants";
import LogoSMyT from "../../assets/logo_smyt.png";
import LogoTlax from "../../assets/LogoTlax.png";

const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#modulos", label: "Módulos" },
  { href: "#caracteristicas", label: "Características" },
  { href: "#roles", label: "Roles" },
  { href: "#tecnologia", label: "Tecnología" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <LazyMotion features={domAnimation}>
      <m.footer
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={vp}
        className="py-12 px-4 sm:px-6 bg-white border-t border-gray-100"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <img src={LogoTlax} alt="Gobierno de Tlaxcala" className="h-8 w-8 object-contain md:hidden" />
                <img src={LogoSMyT} alt="SMyT" className="hidden md:block h-7 lg:h-8 w-auto object-contain" />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Plataforma oficial para la gestión vehicular del estado de Tlaxcala.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Navegación</h4>
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a key={link.href} href={link.href} className="text-sm text-gray-400 hover:text-primary transition-colors w-fit">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Contacto</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="w-4 h-4 shrink-0" />
                  Tlaxcala, México
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4 shrink-0" />
                  Lunes a Viernes 9:00 – 18:00
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-400 text-center sm:text-left">
              <div>© {currentYear} SMyT. Todos los derechos reservados.</div>
              <div className="text-xs mt-0.5">Gobierno del Estado de Tlaxcala</div>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <button className="hover:text-primary transition-colors">Privacidad</button>
              <button className="hover:text-primary transition-colors">Términos</button>
            </div>
          </div>
        </div>
      </m.footer>
    </LazyMotion>
  );
}
