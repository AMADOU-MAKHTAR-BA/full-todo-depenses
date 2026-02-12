import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Desktop from "../components/Desktop.tsx";
import Android from "../components/Android.tsx";
import Form from "../components/Form.tsx";
function Depenses() {
  const navigate = useNavigate();
  const [dataDepense, setDataDepense] = useState<TypeDataDepense[]>([]);
  const [depenseInput, setDepenseInput] = useState<TypeDataDepense>({
    name: "",
    prix: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Dans un fichier api.ts ou directement dans Depenses.tsx
  async function fetchWithAuth(url: string, options: RequestInit = {}) {
    let response = await fetch(url, {
      ...options,
      credentials: "include",
    });

    // Si le token a expiré (401), essayer de le rafraîchir
    if (response.status === 401) {
      try {
        const refreshResponse = await fetch(
          "http://localhost:8000/api/refresh",
          {
            method: "POST",
            credentials: "include",
          },
        );

        if (refreshResponse.ok) {
          // Réessayer la requête originale
          response = await fetch(url, {
            ...options,
            credentials: "include",
          });
        } else {
          // Rediriger vers la connexion si le refresh échoue
          globalThis.location.href = "/inscription";
        }
      } catch (error) {
        globalThis.location.href = "/inscription";
        console.error(error);
      }
    }

    return response;
  }

  // Dans Depenses.tsx, modifions le useEffect :
  useEffect(() => {
    fetch("/api/depenses", {
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 401) {
          // Token invalide ou expiré → redirection vers inscription
          navigate("/inscription");
          throw new Error("Non authentifié");
        }
        if (!res.ok) {
          throw new Error(`Erreur HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setDataDepense(data))
      .catch((err) => {
        if (err.message !== "Non authentifié") {
          console.error(err);
          setError(err.message);
        }
      });
  }, [navigate]);
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
      const res = await fetchWithAuth("/api/depenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(depenseInput),
      });

      if (!res.ok) {
        const error = await res.json();
        setError(error.error || "Erreur lors de l'ajout");
        return;
      }

      const newDepense = await res.json();
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
