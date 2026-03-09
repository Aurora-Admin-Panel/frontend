import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import ProfileImg from "../../assets/img/profile.jpg";

const communityLinks = [
  { label: "GitHub", href: "https://github.com/aurora-admin-panel", desc: "aurora-admin-panel" },
  { label: "Telegram", href: "http://t.me/aurora_admin_panel", desc: "@aurora_admin_panel" },
];

const supportLinks = [
  { label: "PayPal", href: "https://paypal.me/leishi1313" },
  { label: "GitHub Sponsors", href: "https://github.com/sponsors/LeiShi1313/" },
  { label: "Stripe", href: "https://buy.stripe.com/eVacQl8Xvd51cAU000" },
];

const cryptoLinks = [
  { label: "BTC", href: "https://github.com/sponsors/LeiShi1313/" },
  { label: "ETH", href: "https://github.com/sponsors/LeiShi1313/" },
  { label: "USDT", href: "https://github.com/sponsors/LeiShi1313/" },
];

function About() {
  const { t } = useTranslation();
  const version = import.meta.env.VITE_APP_VERSION;

  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-baseline gap-3">
          <h1 className="text-4xl font-black tracking-tight">Aurora</h1>
          {version && (
            <span className="text-xs font-medium opacity-30">{version}</span>
          )}
        </div>
        <p className="mt-2 text-sm leading-relaxed opacity-50">
          {t("One-click Multi-User Rental Multi-Application Deployment Panel")}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mt-10"
      >
        <h2 className="text-[11px] font-medium uppercase tracking-widest opacity-30">
          {t("Community")}
        </h2>
        <div className="mt-3 space-y-1">
          {communityLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-base-content/5"
            >
              <span className="text-sm font-medium">{link.label}</span>
              <span className="flex items-center gap-1.5 text-xs opacity-30 transition-opacity group-hover:opacity-60">
                {link.desc}
                <ExternalLink className="h-3 w-3" />
              </span>
            </a>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="mt-10"
      >
        <h2 className="text-[11px] font-medium uppercase tracking-widest opacity-30">
          {t("Author")}
        </h2>
        <div className="mt-3 flex items-center gap-3 px-3">
          <img
            src={ProfileImg}
            alt="Lei Shi"
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className="text-sm font-medium">Lei Shi</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="mt-10"
      >
        <h2 className="text-[11px] font-medium uppercase tracking-widest opacity-30">
          {t("Support")}
        </h2>
        <p className="mt-3 px-3 text-sm opacity-50">
          {t("If you find Aurora useful, consider supporting the project.")}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 px-3">
          {supportLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-primary"
            >
              {s.label}
            </a>
          ))}
        </div>
        <div className="mt-3 flex gap-3 px-3 text-xs">
          {cryptoLinks.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-30 transition-opacity hover:opacity-60"
            >
              {c.label}
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default About;
