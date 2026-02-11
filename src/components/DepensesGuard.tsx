import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type Props = { children: ReactNode };


// petit util pour lire le cookie
function getTokenFromCookie(): string | null {
  const match = document.cookie.match(new RegExp('(^| )accessToken=([^;]+)'));
  if (match) return match[2];
  return null;
}


  function AuthHooks({ children }: Props) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getTokenFromCookie();
    if (!token) {
      navigate("/inscription"); // pas de token → redirection
    }
  }, [navigate]);

  const token = getTokenFromCookie();
  if (!token) return null; // on n'affiche rien si pas connecté

  return <>{children}</>;
}

export { getTokenFromCookie , AuthHooks}