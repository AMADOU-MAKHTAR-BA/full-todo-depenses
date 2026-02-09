import { NavLink } from "react-router-dom";
import { useState } from "react";
function Inscription() {
  const [formConnexiondata, setFormconnexionData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
  });
  const [voirMotDePasse, setVoirMotDePasse] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormconnexionData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formConnexiondata.email.trim() || !formConnexiondata.password.trim()) {
      return;
    }
    console.table([formConnexiondata]);
    const res =await fetch("http://localhost:8000/api/inscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formConnexiondata),
    });
    if (!res.ok) {
      const error = await res.json();
        console.error("Erreur backend :", error);
        return;
    }
  };
  return (
    <main className="w-full min-h-screen flex flex-col justify-center items-center rounded-2xl gap-7 myAnimationImg">
      <div className=" flex flex-col justify-center items-center w-full gap-5 ">
        <form
          className="flex flex-col justify-center items-center w-full gap-4"
          onSubmit={handleSubmit}
        >
          <div className="mb-4 w-full flex flex-col justify-center items-center">
            <label htmlFor="nom">Veuillez resaisir votre nom</label>
            <input
              className="input input-bordered input-accent w-[75%] text-sm sm:text-base my-1"
              type="text"
              name="nom"
              value={formConnexiondata.nom}
              placeholder="NOM :"
              onChange={handleChange}
            />
          </div>
          <div className="mb-4 w-full flex flex-col justify-center items-center">
            <label htmlFor="nom">Veuillez resaisir votre prenom</label>
            <input
              className="input input-bordered input-accent w-[75%] text-sm sm:text-base my-1"
              type="text"
              name="prenom"
              value={formConnexiondata.prenom}
              placeholder="PRENOM :"
              onChange={handleChange}
            />
          </div>
          <div className="mb-4 w-full flex flex-col justify-center items-center">
            <label htmlFor="nom">Veuillez resaisir votre e-mail</label>
            <input
              className="input input-bordered input-accent w-[75%] text-sm sm:text-base my-1"
              type="text"
              name="email"
              value={formConnexiondata.email}
              placeholder="email@gmail.com"
              onChange={handleChange}
            />
          </div>
          <div className="mb-4 w-full flex flex-col justify-center items-center">
            <label htmlFor="nom">Veuillez resaisir votre mot de passe</label>
            <input
              className="input input-bordered input-accent w-[75%] text-sm sm:text-base my-1"
              type={voirMotDePasse ? "text" : "password"}
              name="password"
              value={formConnexiondata.password}
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
          </div>
          <div className="my-2 w-full flex justify-center items-center">
            <button
              type="submit"
              className=" font-bold bg-blue-500 p-4 rounded-2xl w-[75%] hover:bg-blue-600"
            >
              Soumettre
            </button>
          </div>
        </form>{" "}
      </div>
      <div>
        Vous avez deja un compte ?
        <span className=" text-blue-600 font-bold ">
          <NavLink to="/login"> Se connecter</NavLink>
        </span>
      </div>
    </main>
  );
}
export default Inscription;
