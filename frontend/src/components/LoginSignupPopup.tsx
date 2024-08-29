import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const clientId = "939883123761-up76q4mal36sd3quh558ssccr1cqc035.apps.googleusercontent.com";
interface LoginSignupPopupProps {
  isOpen: boolean;
  isLoginView: boolean;
  toggleView: () => void;
  closePopup: () => void;
  handleGoogleLoginSuccess: (credentialResponse: unknown) => void;
}

const LoginSignupPopup: React.FC<LoginSignupPopupProps> = ({
  isOpen,
  isLoginView,
  toggleView,
  closePopup,
  handleGoogleLoginSuccess,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-semibold mb-4">
          {isLoginView ? "Login" : "Sign Up"}
        </h2>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="w-full border rounded-md py-2 px-3"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600">
              Password:
            </label>
            <input
              type="password"
              id="password"
              className="w-full border rounded-md py-2 px-3"
            />
          </div>

          {/* Confirm Password field for Sign-Up */}
          {!isLoginView && (
            <div className="mb-4">
              <label
                htmlFor="confirm-password"
                className="block text-gray-600"
              >
                Confirm Password:
              </label>
              <input
                type="password"
                id="confirm-password"
                className="w-full border rounded-md py-2 px-3"
              />
            </div>
          )}

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            {isLoginView ? "Login" : "Sign Up"}
          </button>
          <button
            type="button"
            className="text-gray-600 ml-4"
            onClick={closePopup}
          >
            Cancel
          </button>
        </form>
        <div className="mt-4">
          <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </GoogleOAuthProvider>
        </div>
        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-blue-500"
            onClick={toggleView}
          >
            {isLoginView
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginSignupPopup;
