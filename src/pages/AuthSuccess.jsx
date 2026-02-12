import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Extract the token from the URL (sent from backend)
    const token = searchParams.get("token");

    if (token) {
      // 2. Save to localStorage so your Axios interceptors can find it
      localStorage.setItem("token", token);
      
      // 3. Optional: Trigger a state update in your AuthContext here
      // dispatch({ type: 'LOGIN_SUCCESS', payload: token });

      // 4. Redirect to home or dashboard
      navigate("/");
    } else {
      // Handle error if no token is found
      navigate("/login?error=no_token");
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="text-center">
        {/* Your Frosted Glass Loading Spinner */}
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-white/60 font-medium tracking-widest uppercase text-xs">
          Authenticating with NovelHub...
        </p>
      </div>
    </div>
  );
};

export default AuthSuccess;