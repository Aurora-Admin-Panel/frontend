import { useTranslation } from 'react-i18next'
import EmailPasswordForm from './EmailPasswordForm'
import ThemeSwitch from '../theme/ThemeSwitch';
import LanguageSwitch from '../i18n/LanguageSwitch';

const CreateAccount = () => {
  const { t } = useTranslation()

  const style = {
    backgroundImage: `url(/img/aurora.jpg)`,
  }

  return (
    <div className="hero min-h-screen bg-base-200" style={style}>
            <div className='absolute top-0 right-0 h-12 w-24'>
        <ThemeSwitch />
        <LanguageSwitch />
      </div>
      <div className="hero-overlay bg-opacity-20"></div>
      <div className="hero-content flex-col md:flex-row-reverse w-full">
        <article className="prose md:prose-xl text-center md:text-left min-w-max">
          <h1 className="text-primary-content">{t("Aurora Admin Panel")}</h1>
          <p className="py-0 text-secondary-content">{t("One-click Multi-User Rental Multi-Application Deployment Panel")}</p>
        </article>
        <EmailPasswordForm create />
      </div>
    </div>
  )
}
export default CreateAccount