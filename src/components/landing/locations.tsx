import { MapPin } from "lucide-react";
import { motion } from "motion/react";
import { Reveal, SectionHeading } from "./reveal";

const cities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Gurgaon",
  "Kolkata",
  "Noida",
  "Chandigarh",
  "Jaipur",
  "Surat",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Locations() {
  return (
    <section className="pb-20 sm:pb-28" id="how-it-works">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Serving Local Businesses Across India"
          subtitle="Local intent, local language, local ranking wins — city by city."
        />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="no-scrollbar -mx-4 mt-10 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
        >
          {cities.map((city) => (
            <motion.div
              key={city}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="flex shrink-0 snap-start items-center gap-2 rounded-full border border-border/70 bg-card px-5 py-3 text-sm font-semibold text-foreground shadow-soft transition-shadow duration-300 hover:border-primary/40 hover:shadow-lift"
            >
              <MapPin className="size-4 text-primary" />
              {city}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

