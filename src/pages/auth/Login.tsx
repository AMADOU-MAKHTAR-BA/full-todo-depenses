import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

import Error from "../../components/Error.tsx";

const passwordRules = {
  minLength: 8,
  lowercase: /[a-z]/,
  uppercase: /[A-Z]/,
  digit: /\d/,
  special: /[^A-Za-z0-9]/,
};

type PasswordError =
  | "minLength"
  | "lowercase"
  | "uppercase"
  | "digit"
  | "special";

function validatePassword(password: string): PasswordError[] {
  const errors: PasswordError[] = [];

  if (password.length < passwordRules.minLength) errors.push("minLength");
  if (!passwordRules.lowercase.test(password)) errors.push("lowercase");
  if (!passwordRules.uppercase.test(password)) errors.push("uppercase");
  if (!passwordRules.digit.test(password)) errors.push("digit");
  if (!passwordRules.special.test(password)) errors.push("special");

  return errors;
}

function Connexion() {
  const [formConnexionData, setFormConnexionData] = useState({
    email: "",
    password: "",
  });
  const [voirMotDePasse, setVoirMotDePasse] = useState(false);

  const passwordErrors = validatePassword(formConnexionData.password);
  const isPasswordValid = passwordErrors.length === 0;
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormConnexionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formConnexionData.email.trim() ||
      !formConnexionData.password.trim() ||
      !isPasswordValid
    ) {
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        credentials: "include", // 🔥
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formConnexionData),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Erreur backend :", error);
        return;
      }
      const data = await res.json();
      document.cookie = `accessToken=${data.accessToken}; path=/; max-age=300`;

      setFormConnexionData({ email: "", password: "" });
      console.table([formConnexionData]);
      // ici tu peux rediriger ou afficher un message
      console.log("Connexion reussi avec success")
      navigate("/");
    } catch (err) {
      console.error("Erreur réseau :", err);
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-col justify-center items-center gap-7 myAnimationImg">
      <div className="flex flex-col justify-center items-center w-full gap-5">
        <form
          className="flex flex-col justify-center items-center w-full gap-4"
          onSubmit={handleSubmit}
        >
          {/* Email */}
          <div className="mb-4 w-full flex flex-col justify-center items-center">
            <label htmlFor="email">Veuillez resaisir votre e-mail</label>
            <input
              className="input input-bordered input-accent w-[75%] text-sm sm:text-base my-1"
              type="email"
              name="email"
              value={formConnexionData.email}
              placeholder="email@gmail.com"
              onChange={handleChange}
            />
          </div>

          {/* Mot de passe */}
          <div className="mb-4 w-full flex flex-col justify-center items-center">
            <label className="mb-1">Veuillez resaisir votre mot de passe</label>
            <input
              className="input input-bordered input-accent w-[75%] text-sm sm:text-base"
              type={voirMotDePasse ? "text" : "password"}
              name="password"
              value={formConnexionData.password}
              placeholder="**********************"
              onChange={handleChange}
            />

            <div className="mt-2 flex items-center gap-2 cursor-pointer select-none text-sm opacity-80 hover:opacity-100">
              <input
                title="input"
                id="togglePassword"
                type="checkbox"
                className="checkbox checkbox-sm checkbox-primary w-6 h-6"
                checked={voirMotDePasse}
                onChange={(e) => setVoirMotDePasse(e.target.checked)}
              />
              <span>
                {voirMotDePasse ? "🙈 Masquer" : "👁️ Afficher"} le mot de passe
              </span>
            </div>

            <p className="w-full text-center text-lg text-blue-500 mt-3">
              Le mot de passe doit contenir :
            </p>
            <div className="flex flex-col mt-1 w-[75%] justify-center items-center">
              <Error ok={!passwordErrors.includes("minLength")}>
                Au moins 8 caractères
              </Error>
              <Error ok={!passwordErrors.includes("lowercase")}>
                Une lettre minuscule
              </Error>
              <Error ok={!passwordErrors.includes("uppercase")}>
                Une lettre majuscule
              </Error>
              <Error ok={!passwordErrors.includes("digit")}>Un chiffre</Error>
              <Error ok={!passwordErrors.includes("special")}>
                Un caractère spécial
              </Error>
            </div>
          </div>

          {/* Bouton soumettre */}
          <div className="my-2 w-full flex justify-center items-center">
            <button
              type="submit"
              disabled={!isPasswordValid}
              className="font-bold bg-blue-500 p-4 rounded-2xl w-[75%]
                         hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Soumettre
            </button>
          </div>
        </form>
      </div>

      {/* Lien vers inscription */}
      <div className="text-sm">
        Vous n'avez pas encore de compte ?{" "}
        <span className="text-blue-600 font-bold">
          <NavLink to="/inscription">Créer votre compte</NavLink>
        </span>
      </div>
    </main>
  );
}

export default Connexion;
