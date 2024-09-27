import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAtom } from 'jotai'
import { authAtom } from "../../atoms/auth";
import EmailPasswordForm from './EmailPasswordForm'
import ThemeSwitch from '../theme/ThemeSwitch';
import LanguageSwitch from '../i18n/LanguageSwitch';

const Login = () => {
  const { t } = useTranslation()
  const [{ token }, _] = useAtom(authAtom)

  if (token.length > 0) {
    return <Navigate to="/app/servers" />
  }

  const style = {
    // backgroundImage: `url(https://placeimg.com/1920/1080/any)`,
    backgroundImage: `url(/img/aurora.jpg)`,
  }
  return (
    <div className="hero min-h-screen bg-base-200" style={style}>
      <div className='absolute top-0 right-0 h-12 w-24'>
        <ThemeSwitch />
        <LanguageSwitch />
      </div>
      <div className="hero-overlay bg-opacity-20"></div>
      <div className="hero-content flex-col space-y-8 lg:flex-row-reverse lg:space-x-4 w-full">
        <article className="prose lg:prose-xl text-center lg:text-left min-w-max rounded-box bg-base-100/10 px-10 py-10">
          <h1 className="text-primary-content">{t("Aurora Admin Panel")}</h1>
          <p className="py-0 text-secondary-content">{t("One-click Multi-User Rental Multi-Application Deployment Panel")}</p>
        </article>
        <EmailPasswordForm />
      </div>
    </div>
  )
}

export default Login
