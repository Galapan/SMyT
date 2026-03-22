import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import LogoSMyT from "../../assets/logo_smyt.png";
import LogoTlax from "../../assets/LogoTlax.png";

const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#modulos", label: "Módulos" },
  { href: "#caracteristicas", label: "Características" },
  { href: "#roles", label: "Roles" },
  { href: "#tecnologia", label: "Tecnología" },
];

// Animaciones para el overlay de pantalla completa
const overlayVariants = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1,
    transition: { duration: 0.25 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  },
};

const menuContentVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.04,
      delayChildren: 0
    }
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.15 }
  }
};

const menuItemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
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
    setIsOpen(false);
    document.body.style.overflow = "";
    const section = document.querySelector(href);
    if (section) setTimeout(() => section.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  return (
    <LazyMotion features={domAnimation}>
      <>
        {/* Overlay de Pantalla Completa */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop con glassmorphism */}
              <m.div
                key="backdrop"
                variants={overlayVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-white/60 backdrop-blur-2xl z-50"
              />

              {/* Contenido del Menú */}
              <m.div
                key="menu"
                variants={menuContentVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="fixed inset-0 z-50 flex flex-col pointer-events-none"
              >
                {/* Header - Logo y Botón Cerrar */}
                <div className="flex items-center justify-between px-6 py-4 pointer-events-auto">
                  <img src={LogoTlax} alt="Gobierno de Tlaxcala" className="h-9 w-9 object-contain" />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-full transition-all"
                  >
                    <X size={24} strokeWidth={2} />
                  </button>
                </div>

                {/* Enlaces Centrados */}
                <div className="flex-1 flex flex-col items-center justify-center pointer-events-auto pb-20">
                  <nav className="flex flex-col items-center gap-1">
                    {navLinks.map((link) => (
                      <m.a
                        key={link.href}
                        variants={menuItemVariants}
                        href={link.href}
                        onClick={(e) => scrollToSection(e, link.href)}
                        className="text-2xl sm:text-3xl font-semibold text-gray-800 hover:text-primary transition-colors"
                      >
                        {link.label}
                      </m.a>
                    ))}
                  </nav>

                  {/* Botón Iniciar Sesión */}
                  <m.button
                    variants={menuItemVariants}
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/login");
                    }}
                    className="mt-6 bg-primary hover:bg-primary/90 px-8 py-3 rounded-lg text-white font-medium transition-all"
                  >
                    Iniciar Sesión
                  </m.button>
                </div>
              </m.div>
            </>
          )}
        </AnimatePresence>

        {/* Navbar Principal */}
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
