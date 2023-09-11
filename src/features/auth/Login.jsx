import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import EmailPasswordForm from './EmailPasswordForm'

const Login = () => {
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)

  if (token.length > 0) {
    return <Navigate to="/app" />
  }

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
        <EmailPasswordForm />
      </div>
    </div>

  )
}

export default Login
