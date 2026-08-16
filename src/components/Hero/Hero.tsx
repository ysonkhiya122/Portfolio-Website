import { motion } from "framer-motion";
import TypewriterText from "@/components/TypewriterText/TypewriterText";
import AnimatedCounter from "@/components/AnimatedCounter/AnimatedCounter";
import OpenToWork from "@/components/OpenToWork/OpenToWork";
import styles from "./Hero.module.scss";

const ROLES = [
  "Senior Frontend Engineer",
  "React & TypeScript Specialist",
  "Enterprise UI Architect",
  "GenAI-augmented Developer",
];

const STATS = [
  { value: 2, suffix: "+", label: "Years exp.", decimals: 0 },
  { value: 4, suffix: "", label: "Production apps", decimals: 0 },
  { value: 7, suffix: "", label: "Countries live", decimals: 0 },
  { value: 40, suffix: "%", label: "Defect reduction", decimals: 0 },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11 } },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export default function Hero() {
  const anchor = (e: React.MouseEvent<HTMLElement>, id: string) => {
    e.preventDefault();
    document
      .querySelector(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="hero" className={styles.hero}>
      <div className="container">
        <motion.div
          className={styles.inner}
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={item}>
            <OpenToWork />
          </motion.div>

          <motion.h1 className={styles.name} variants={item}>
            Yash Sonkhiya
          </motion.h1>

          <motion.div className={styles.roleRow} variants={item}>
            <TypewriterText phrases={ROLES} className={styles.role} />
          </motion.div>

          <motion.p className={styles.summary} variants={item}>
            Building enterprise-scale web applications for global clients across
            seven European markets. Two years of end-to-end production ownership
            spanning real-time systems, enterprise authentication, and
            GenAI-driven engineering workflows. Promoted to Senior SWE in{" "}
            <em>18 months</em>.
          </motion.p>

          <motion.div className={styles.actions} variants={item}>
            <a
              href="#contact"
              className="btn-primary"
              onClick={(e) => anchor(e, "#contact")}
            >
              Get in touch
            </a>
            <a
              href="#experience"
              className="btn-ghost"
              onClick={(e) => anchor(e, "#experience")}
            >
              View work
            </a>
            <a
              href="https://github.com/ysonkhiya122"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
              aria-label="GitHub"
              data-cursor-hover
            >
              Projects
            </a>
          </motion.div>

          <motion.div className={styles.stats} variants={item}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statValue}>
                  <AnimatedCounter
                    value={s.value}
                    suffix={s.suffix}
                    duration={1600}
                  />
                </span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.button
            type="button"
            className={styles.scrollCue}
            variants={item}
            aria-label="Scroll down to the About section"
            onClick={(e) => anchor(e, "#about")}
          >
            <div className={styles.scrollLine} aria-hidden="true" />
            <span className={styles.scrollLabel} aria-hidden="true">
              scroll
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
