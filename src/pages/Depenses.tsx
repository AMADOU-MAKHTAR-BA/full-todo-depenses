import { useState, useEffect } from "react";
import Desktop from "../components/Desktop.tsx";
import Android from "../components/Android.tsx";
import Form from "../components/Form.tsx";
function Depenses() {
  const [dataDepense, setDataDepense] = useState<TypeDataDepense[]>([]);
  const [depenseInput, setDepenseInput] = useState<TypeDataDepense>({
    name: "",
    prix: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    console.log("useEffect exécuté");
    fetch("http://localhost:8000/depenses")
      .then((res) => {
        console.log("Réponse reçue, statut:", res.status);
        if (!res.ok) {
          throw new Error(`Erreur HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Données recues du serveur:", data);
        setDataDepense(data);
      })
      .catch((err) => {
        console.error("Erreur fetch :", err);
        setError(err.message);
      });
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDepenseInput((prev) => ({
      ...prev,
      [name]:
        name === "prix" ? (value === "" ? null : parseFloat(value)) : value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!depenseInput.name.trim() || depenseInput.prix === null) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/depenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(depenseInput),
      });
      console.log("Réponse serveur (POST) :", res.status);
      if (!res.ok) {
        const error = await res.json();
        console.error("Erreur backend :", error);
        setError(error.error || "Erreur lors de l'ajout");
        return;
      }
      const newDepense = await res.json();
      console.log("Nouvelle dépense ajoutée:", newDepense);
      setDataDepense((prev) => [newDepense, ...prev]);
      setDepenseInput({ name: "", prix: null });
    } catch (err) {
      console.error("Erreur réseau :", err);
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };
  console.log(
    "Tout s'est bienn passe et la nouvelle depense ajoutee est : ",
    dataDepense,
  );
  return (
    <div className="flex flex-col p-2 sm:p-4 md:p-6">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 md:mb-6 text-center">
        Bienvenue dans l'app de gestion de vos depenses
      </h1>
      <Form
        onSubmit={handleSubmit}
        onChange={handleChange}
        depenseName={depenseInput.name}
        depensePrix={depenseInput.prix}
        loading={loading}
      />
      {error && (
        <div className="alert alert-error mb-3 sm:mb-4 text-sm sm:text-base flex justify-center items-center">
          <span>{error}</span>
        </div>
      )}
      <Desktop dataDepense={dataDepense} error={error} />
      <Android dataDepense={dataDepense} error={error} />
    </div>
  );
}
export default Depenses;
