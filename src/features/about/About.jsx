import React from "react";

import ProfileImg from "../../assets/img/profile.jpg";

function About() {
  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-8">
          <img
            src={ProfileImg}
            className="max-w-sm rounded-lg shadow-2xl w-64"
          />
          <div>
            <h1 className="text-5xl font-bold">
              极光面板 {import.meta.env.VITE_APP_VERSION}
            </h1>
            <p className="py-2">
              觉得不错的话，欢迎
              <a
                className="text-blue-500"
                href="https://github.com/aurora-admin-panel"
              >
                star
              </a>
            </p>
            <p className="leading-relaxed">
              有什么问题，可以来
              <a
                className="text-blue-500"
                href="http://t.me/aurora_admin_panel"
              >
                telegram
              </a>
              讨论
            </p>
            <p className="mt-1 leading-relaxed">当然，也可以请我喝杯咖啡</p>
            <div className="mt-4 flex flex-col justify-center space-y-2 w-80">
              <div className="flex flex-row space-x-2">
                <a
                  className="btn btn-primary text-lg"
                  href="https://paypal.me/leishi1313"
                >
                  PayPal
                </a>
                <a
                  className="btn btn-secondary text-lg"
                  href="https://github.com/sponsors/LeiShi1313/"
                >
                  Github
                </a>
                <a
                  className="btn btn-accent text-lg"
                  href="https://buy.stripe.com/eVacQl8Xvd51cAU000"
                >
                  Stripe
                </a>
              </div>
              <div className="flex flex-row space-x-2">
                <a
                  className="btn btn-ghost bg-yellow-300 text-lg text-primary-content"
                  href="https://github.com/sponsors/LeiShi1313/"
                >
                  BTC
                </a>
                <a
                  className="btn btn-ghost bg-blue-400 text-lg text-primary-content"
                  href="https://github.com/sponsors/LeiShi1313/"
                >
                  ETH
                </a>
                <a
                  className="btn btn-ghost bg-red-400 text-lg text-primary-content"
                  href="https://github.com/sponsors/LeiShi1313/"
                >
                  USDT
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
