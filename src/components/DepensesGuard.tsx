import { useNavigate } from "react-router-dom";
import { useEffect, type ReactNode } from "react";

type TypeChildren = {
  children: ReactNode;
};

export default function AuthHooks({ children }: TypeChildren) {
  const navigate = useNavigate();
  const testAuth = false;

  useEffect(() => {
    if (!testAuth) {
      navigate("/inscription");
    }
  }, [testAuth, navigate]);

  if (!testAuth) return null;

  return <>{children}</>;
}
