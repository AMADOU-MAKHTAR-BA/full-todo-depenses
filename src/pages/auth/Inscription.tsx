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

function Inscription() {
  const [formConnexiondata, setFormconnexionData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
  });

  const [voirMotDePasse, setVoirMotDePasse] = useState(false);

  const passwordErrors = validatePassword(formConnexiondata.password);
  const isPasswordValid = passwordErrors.length === 0;
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormconnexionData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formConnexiondata.email.trim() ||
      !formConnexiondata.password.trim() ||
      !isPasswordValid
    ) {
      return;
    }

    try {
      const res = await fetch("/api/inscription", {
        method: "POST",
        credentials: "include", // 🔥
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formConnexiondata),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Erreur backend :", error);
        return;
      }
       const data = await res.json();
      document.cookie = `accessToken=${data.accessToken}; path=/; max-age=300`;
      setFormconnexionData({
        nom: "",
        prenom: "",
        email: "",
        password: "",
      });
      navigate("/");
      console.log("Inscription réussie ✅");
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
          <div className="w-full flex flex-col items-center">
            <label>Veuillez resaisir votre nom</label>
            <input
              className="input input-bordered input-accent w-[75%] my-1"
              type="text"
              name="nom"
              value={formConnexiondata.nom}
              placeholder="NOM"
              onChange={handleChange}
            />
          </div>

          <div className="w-full flex flex-col items-center">
            <label>Veuillez resaisir votre prénom</label>
            <input
              className="input input-bordered input-accent w-[75%] my-1"
              type="text"
              name="prenom"
              value={formConnexiondata.prenom}
              placeholder="PRÉNOM"
              onChange={handleChange}
            />
          </div>

          <div className="w-full flex flex-col items-center">
            <label>Veuillez resaisir votre e-mail</label>
            <input
              className="input input-bordered input-accent w-[75%] my-1"
              type="email"
              name="email"
              value={formConnexiondata.email}
              placeholder="email@gmail.com"
              onChange={handleChange}
            />
          </div>

          <div className="w-full flex flex-col items-center">
            <label>Veuillez resaisir votre mot de passe</label>

            <input
              className="input input-bordered input-accent w-[75%] my-1"
              type={voirMotDePasse ? "text" : "password"}
              name="password"
              value={formConnexiondata.password}
              placeholder="**************"
              onChange={handleChange}
            />

            <div className="mt-2 flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                title="input"
                type="checkbox"
                className="checkbox checkbox-sm checkbox-primary"
                checked={voirMotDePasse}
                onChange={(e) => setVoirMotDePasse(e.target.checked)}
              />
              <span>
                {voirMotDePasse ? "🙈 Masquer" : "👁️ Afficher"} le mot de passe
              </span>
            </div>

            <ul className="mt-3 space-y-1">
              <li className="flex flex-col gap-2 ">
                <p className="w-full text center text-2xl text-blue-500">
                  Le mot de passe doit contenir :{" "}
                </p>
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
              </li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={!isPasswordValid}
            className="font-bold bg-blue-500 p-4 rounded-2xl w-[75%]
                       hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Soumettre
          </button>
        </form>
      </div>

      {/* LIEN LOGIN */}
      <div>
        Vous avez déjà un compte ?
        <NavLink to="/login" className="text-blue-600 font-bold ml-1">
          Se connecter
        </NavLink>
      </div>
    </main>
  );
}

export default Inscription;
