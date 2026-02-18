import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const authenticate = async () => {
      const token = searchParams.get("token");

      if (!token) {
        navigate("/login?error=no_token", { replace: true });
        return;
      }

      await login({},token);

      navigate("/", { replace: true });
    };

    authenticate();
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-white/60 font-medium tracking-widest uppercase text-xs">
          Authenticating with NovelNest...
        </p>
      </div>
    </div>
  );
};

export default AuthSuccess;
