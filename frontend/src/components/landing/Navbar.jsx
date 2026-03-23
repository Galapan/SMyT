import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import LogoSMyT from "../../assets/logo_smyt.png";
import LogoTlax from "../../assets/LogoTlax.png";

const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#modulos", label: "Módulos" },
  { href: "#caracteristicas", label: "Características" },
  { href: "#roles", label: "Roles" },
  { href: "#tecnologia", label: "Tecnología" },
];

/* ─── Animaciones del overlay móvil ─── */
const overlayVariants = {
  hidden: {
    clipPath: "circle(0% at calc(100% - 36px) 32px)",
    opacity: 0,
  },
  show: {
    clipPath: "circle(150% at calc(100% - 36px) 32px)",
    opacity: 1,
    transition: {
      clipPath: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      opacity: { duration: 0.15 },
    },
  },
  exit: {
    clipPath: "circle(0% at calc(100% - 36px) 32px)",
    opacity: 0,
    transition: {
      clipPath: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
      opacity: { duration: 0.3, delay: 0.15 },
    },
  },
};

const menuListVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

const menuItemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.15 },
  },
};

const ctaVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 25, delay: 0.45 },
  },
  exit: {
    opacity: 0,
    y: 16,
    transition: { duration: 0.15 },
  },
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const container = document.getElementById("scroll-container");
    if (!container) return;
    const handleScroll = () => setScrolled(container.scrollTop > 50);
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = prevOverflow;
    return () => { document.body.style.overflow = prevOverflow; };
  }, [isOpen]);

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const wasOpen = isOpen;
    setIsOpen(false);
    const section = document.querySelector(href);
    if (section) {
      if (wasOpen) {
        // Esperar a que termine la animación de cierre del menú móvil
        setTimeout(() => {
          document.body.style.overflow = "";
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 450);
      } else {
        // Desktop: scroll instantáneo, sin retraso
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <>
        {/* ═══ Overlay Móvil a Pantalla Completa ═══ */}
        <AnimatePresence>
          {isOpen && (
            <m.div
              key="mobile-menu"
              variants={overlayVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="fixed inset-0 z-50 flex flex-col bg-white/70 backdrop-blur-2xl"
            >
              {/* ── Header: misma estructura que navbar para alinear logo ── */}
              <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={LogoTlax} alt="Gobierno de Tlaxcala" className="h-9 w-9 object-contain" />
                  </div>
                  <m.button
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.15 }}
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-500 hover:text-gray-900 hover:bg-white/60 rounded-full transition-colors"
                  >
                    <X size={24} strokeWidth={2} />
                  </m.button>
                </div>
              </div>

              {/* ── Links de Navegación ── */}
              <m.nav
                variants={menuListVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="flex-1 flex flex-col justify-center px-10 sm:px-16 -mt-10"
              >
                {navLinks.map((link, i) => (
                  <m.a
                    key={link.href}
                    variants={menuItemVariants}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="group flex items-center gap-4 py-3 border-b border-gray-200/60 last:border-b-0"
                  >
                    {/* Número decorativo */}
                    <span className="text-xs font-mono text-gray-300 group-hover:text-primary/50 transition-colors w-5 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Label con underline animado */}
                    <span className="relative text-2xl sm:text-3xl font-semibold text-gray-800 group-hover:text-primary transition-colors duration-200">
                      {link.label}
                      <span
                        className="absolute bottom-0 left-0 h-0.5 bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                        style={{ width: "100%" }}
                      />
                    </span>

                    {/* Flecha al hacer hover */}
                    <ArrowRight
                      size={18}
                      className="ml-auto text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    />
                  </m.a>
                ))}
              </m.nav>

              {/* ── CTA Botón Iniciar Sesión ── */}
              <m.div
                variants={ctaVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="px-10 sm:px-16 pb-12"
              >
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/login");
                  }}
                  className="w-full bg-primary hover:bg-primary/90 active:scale-[0.98] px-8 py-4 rounded-2xl text-white font-semibold text-lg transition-all duration-200 shadow-lg shadow-primary/20"
                >
                  Iniciar Sesión
                </button>
              </m.div>
            </m.div>
          )}
        </AnimatePresence>

        {/* ═══ Navbar Principal ═══ */}
        <m.nav
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
            scrolled
              ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20"
              : "bg-white/70 backdrop-blur-lg border-b border-white/10"
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <img src={LogoTlax} alt="Gobierno de Tlaxcala" className="h-9 w-9 md:hidden object-contain" />
                <img src={LogoSMyT} alt="SMyT" className="hidden md:block h-10 w-auto object-contain" />
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="text-gray-500 hover:text-primary text-sm font-medium transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              {/* Desktop Login Button */}
              <button
                onClick={() => navigate("/login")}
                className="hidden md:block bg-primary hover:bg-primary/90 px-5 py-2 rounded-lg text-white font-medium transition-all"
              >
                Iniciar Sesión
              </button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-all"
                onClick={() => setIsOpen(!isOpen)}
              >
                <Menu size={24} strokeWidth={2} />
              </button>
            </div>
          </div>
        </m.nav>
      </>
    </LazyMotion>
  );
}
