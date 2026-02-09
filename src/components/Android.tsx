{/* Version Mobile */}
function Android({ dataDepense, error }: PropsResponsive) {
  return (
    <>
      <div className="sm:hidden space-y-3 divide-y divide-white font-['Inter'] font-semibold">
        {dataDepense.map((depense) => (
          <div
            key={depense.id}
            className="bg-base-100 p-4 rounded-lg shadow-sm border border-base-300 hover:bg-base-200"
          >
            <div className="flex justify-between items-start mb-2 ">
              <div className="font-semibold truncate max-w-[60%] text-lg text-shadow-base-200 ">
                {depense.name}
              </div>
              <div className="font-bold text-primary text-lg">
                {depense.prix} fcfa
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {depense.date
                ? new Date(depense.date).toLocaleDateString()
                : "Aujourd'hui"}
            </div>
          </div>
        ))}
        {dataDepense.length > 0 && (
          <div className="border-t border-base-300 bg-base-100 px-6 py-3 hover:bg-black">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {dataDepense.length} dépense{dataDepense.length > 1 ? "s" : ""}
              </div>
              <div className="text-lg font-bold text-primary">
                Total:{" "}
                {dataDepense.reduce(
                  (sum, depense) => sum + (depense.prix || 0),
                  0,
                )}{" "}
                fcfa
              </div>
            </div>
          </div>
        )}
        {dataDepense.length === 0 && !error && (
          <div className="text-center py-8 text-gray-500 text-base">
            Aucune dépense enregistrée
          </div>
        )}
      </div>

    </>
  )
}

export default Android