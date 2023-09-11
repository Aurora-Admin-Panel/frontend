import React, { useState } from 'react'
// import { Link, Navigate } from 'react-router-dom'
// import { useSelector, useDispatch } from 'react-redux'
// import { Input, Label, Button } from '@windmill/react-ui'

// import { signUp } from '../redux/reducers/auth'
// import ImageLight from '../assets/img/create-account-office.jpeg'
// import ImageDark from '../assets/img/create-account-office-dark.jpeg'
import EmailPasswordForm from './EmailPasswordForm'

const CreateAccount = () => {
  // const dispatch = useDispatch()
  // const token = useSelector(state => state.auth.token)
  // const [email, setEmail] = useState('')
  // const [password, setPassword] = useState('')
  // const [password2, setPassword2] = useState('')
  // const validEmail = () => { return email === '' || email.includes('@')}
  // const validPassword = () => { return password === '' || password.length >= 8}
  // const validPassword2 = () => { return (password === '' && password2 === '') || password2 === password }

  // const submitForm = (e) => {
  //   e.preventDefault();
  //   if (!(email.length > 0) || !(password.length > 0)) {
  //     // TODO: set modal or error message.
  //     throw new Error('Email or password was not provided');
  //   }
  //   dispatch(signUp({email, password}))
  // }

  // if (token.length > 0) {
  //   return <Navigate to="/app" />
  // }
  const style = {
    // backgroundImage: `url(https://placeimg.com/1920/1080/any)`,
    backgroundImage: `url(/img/aurora.jpg)`,
  }

  return (
    <div className="hero min-h-screen bg-base-200" style={style}>
      <div className="hero-overlay bg-opacity-20"></div>
      <div className="hero-content flex-col md:flex-row-reverse w-full">
        <article className="prose md:prose-xl text-center md:text-left min-w-max">
          <h1 className="text-primary-content">极光面板</h1>
          <p className="py-0 text-secondary-content">一键式多用户租用多应用部署面板</p>
        </article>
        <EmailPasswordForm create />
      </div>
    </div>
  )
}
export default CreateAccount