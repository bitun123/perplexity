import React, { useState } from 'react'
import { useNavigate, Link, replace, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useSelector } from "react-redux";

function Login() {
  const [email, setemail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { user, loading, errors = {} } = useSelector((state) => state.auth)
  const { handleLogin, handleRecentVerifiedEmail } = useAuth()

  const recentVerifyedEmail = async () => {
    try {
      await handleRecentVerifiedEmail();
    } catch (error) {
      console.log(error.message)
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin({ email, password });
      navigate("/");
    } catch (error) {
      return console.log(error.message)
    }
  }


  if (!loading && user) {
    return <Navigate to="/" replace={true} />
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>


        <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
          <form className="space-y-5"
            onSubmit={handleSubmit}>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-lg bg-gray-700 border transition-colors duration-200 outline-none ${errors.email || errors.submit
                  ? 'border-red-500 focus:border-red-400'
                  : 'border-gray-600 focus:border-[#60A6AF]'
                  } text-white placeholder-gray-400`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>


            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-lg bg-gray-700 border transition-colors duration-200 outline-none ${errors.password || errors.submit
                  ? 'border-red-500 focus:border-red-400'
                  : 'border-gray-600 focus:border-[#60A6AF]'
                  } text-white placeholder-gray-400`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-3 rounded-lg bg-red-900 border border-red-700">
                <p className="text-red-200 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Verify Email Button */}
            <button
              type="button"
              onClick={() => recentVerifyedEmail()}
              className="w-full px-4 py-2 rounded-lg border border-[#60A6AF] text-[#60A6AF] font-medium hover:bg-[#60A6AF]/10 transition-colors duration-200"
            >
              Verify Email
            </button>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg bg-[#60A6AF] text-white font-semibold hover:bg-[#4a8a92] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⚙️</span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer - Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-[#60A6AF] hover:text-[#4a8a92] font-medium transition-colors duration-200"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Extra Info */}
        <p className="text-center text-gray-500 text-xs mt-6">
          © 2024 Your Company. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default Login