const AuthForm = ({
  showSignup,
  setShowSignup,
  loginForm,
  signupForm,
  loginError,
  signupError,
  alert,
  handleLoginChange,
  handleSignupChange,
  handleLoginSubmit,
  handleSignupSubmit
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        {alert && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
            {alert}
          </div>
        )}
        <form
          onSubmit={showSignup ? handleSignupSubmit : handleLoginSubmit}
          className="bg-white p-8 rounded-lg shadow-xl"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            {showSignup ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-gray-600 text-center mb-6">
            {showSignup ? "Join us today!" : "Sign in to continue"}
          </p>

          {showSignup && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">Full Name</label>
                <input
                  name="name"
                  placeholder="John Doe"
                  value={signupForm.name}
                  onChange={handleSignupChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
                <input
                  name="email"
                  placeholder="john@example.com"
                  type="email"
                  value={signupForm.email}
                  onChange={handleSignupChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              {showSignup ? "Choose a Username" : "Username"}
            </label>
            <input
              name="username"
              placeholder={showSignup ? "johndoe123" : "Enter your username"}
              value={showSignup ? signupForm.username : loginForm.username}
              onChange={showSignup ? handleSignupChange : handleLoginChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              {showSignup ? "Create a Password" : "Password"}
            </label>
            <input
              name="password"
              type="password"
              placeholder={showSignup ? "••••••••" : "••••••••"}
              value={showSignup ? signupForm.password : loginForm.password}
              onChange={showSignup ? handleSignupChange : handleLoginChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={6}
            />
            {showSignup && (
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            )}
          </div>

          {loginError && !showSignup && (
            <p className="text-red-500 text-sm mb-4 text-center">{loginError}</p>
          )}
          {signupError && showSignup && (
            <p className="text-red-500 text-sm mb-4 text-center">{signupError}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {showSignup ? "Sign Up" : "Login"}
          </button>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setShowSignup(!showSignup)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition duration-200"
            >
              {showSignup
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;