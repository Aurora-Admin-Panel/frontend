import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAtom } from 'jotai'
import { motion } from 'framer-motion'
import { authAtom } from "../../atoms/auth"
import EmailPasswordForm from './EmailPasswordForm'
import ThemeSwitch from '../theme/ThemeSwitch'
import LanguageSwitch from '../i18n/LanguageSwitch'

const Login = () => {
  const { t } = useTranslation()
  const [{ token }] = useAtom(authAtom)

  if (token.length > 0) {
    return <Navigate to="/app/servers" />
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Atmosphere — aurora image with brand text anchored bottom-left */}
      <div
        className="relative flex min-h-[30vh] items-end bg-cover bg-center lg:min-h-screen lg:w-[58%]"
        style={{ backgroundImage: 'url(/img/aurora.jpg)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 p-8 lg:p-12 lg:pb-16"
        >
          <h1 className="text-4xl font-black tracking-tight text-white lg:text-6xl">
            Aurora
          </h1>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/40 lg:mt-3">
            {t("One-click Multi-User Rental Multi-Application Deployment Panel")}
          </p>
        </motion.div>
      </div>

      {/* Form surface */}
      <div className="relative flex flex-1 flex-col bg-base-100 lg:w-[42%]">
        <div className="flex items-center justify-end gap-1 px-6 pt-4">
          <ThemeSwitch />
          <LanguageSwitch />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-1 items-center justify-center px-8 pb-12 lg:px-12"
        >
          <EmailPasswordForm />
        </motion.div>
      </div>
    </div>
  )
}

export default Login
