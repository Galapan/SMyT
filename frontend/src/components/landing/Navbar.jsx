import { motion, AnimatePresence } from "framer-motion";
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

const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0, y: -10 },
  show: {
    opacity: 1,
    height: "auto",
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    y: -10,
    transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const mobileLinkVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const container = document.getElementById("scroll-container");
    if (!container) return;
    const handleScroll = () => setScrolled(container.scrollTop > 50);
    container.addEventListener("scroll", handleScroll);
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
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="md:hidden fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <motion.nav
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isOpen
            ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200"
            : scrolled
              ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20"
              : "bg-white/70 backdrop-blur-lg border-b border-white/10"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={LogoTlax} alt="Gobierno de Tlaxcala" className="h-9 w-9 object-contain md:hidden" />
              <img src={LogoSMyT} alt="SMyT" className="hidden md:block h-8 lg:h-9 w-auto object-contain" />
            </div>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="text-gray-500 hover:text-primary text-sm transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            <button
              onClick={() => navigate("/login")}
              className="hidden md:block bg-primary hover:bg-primary/90 px-5 py-2 rounded-lg text-white text-sm font-medium transition-colors shadow-sm"
            >
              Iniciar Sesión
            </button>

            <button className="md:hidden text-gray-600 p-1" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                variants={mobileMenuVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="md:hidden relative mt-4 pb-2 flex flex-col gap-1 overflow-hidden"
                style={{ zIndex: 50 }}
              >
                {navLinks.map((link) => (
                  <motion.a
                    key={link.href}
                    variants={mobileLinkVariants}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="group text-gray-500 hover:text-primary hover:bg-gray-50 text-sm py-2.5 px-3 rounded-lg transition-colors relative"
                  >
                    {link.label}
                    <span className="absolute bottom-1 left-3 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-10" />
                  </motion.a>
                ))}
                <motion.button
                  onClick={() => navigate("/login")}
                  whileHover={{ y: -6, scale: 1.06 }}
                  transition={{ type: "spring", stiffness: 420, damping: 22, mass: 0.6 }}
                  className="group relative overflow-hidden bg-primary hover:bg-primary/90 px-7 py-3 rounded-lg text-white font-medium transition-colors shadow-sm hover:shadow hover:shadow-primary/20 inline-flex items-center gap-2"
                >
                  <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="absolute -top-10 -left-10 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                    <span className="absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
                  </span>
                  Acceder al Sistema
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </>
  );
}
