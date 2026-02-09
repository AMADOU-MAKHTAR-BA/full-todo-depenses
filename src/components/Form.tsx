const Form = ({
  onSubmit,
  onChange,
  depenseName,
  loading,
  depensePrix,
}: TypeFormProps)=> {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4 md:mb-6 rounded-lg"
    >
      <div className="flex-1 w-full sm:w-auto">
        <input
          onChange={onChange}
          name="name"
          value={depenseName}
          type="text"
          placeholder="Veuillez renseigner le nom de votre depense"
          className="input input-bordered input-primary w-full text-sm sm:text-base"
          disabled={loading}
        />
      </div>

      <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
        <div className="flex-1 min-w-0">
          <input
            onChange={onChange}
            name="prix"
            value={depensePrix === null ? "" : depensePrix}
            type="number"
            step="0.01"
            min="0"
            placeholder="Prix"
            className="input input-bordered input-accent w-full text-sm sm:text-base"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full xs:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm mr-2">
                {" "}
                Ajout...
              </span>
            </>
          ) : (
            "Ajouter"
          )}
        </button>
      </div>
    </form>
  );
}

export default Form;
