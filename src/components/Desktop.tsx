{/* Version Desktop - Tableau  */}
function Desktop({ dataDepense, error }: PropsResponsive) {
  return (
    <div className="hidden sm:block overflow-x-auto font-semibold">
      <div className="rounded-xl border border-base-300 bg-base-100 shadow-sm overflow-hidden font-['Inter']">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent border-b border-base-300">
                <th className="py-4 px-6 text-left font-semibold text-base">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>Nom de la dépense</span>
                  </div>
                </th>
                <th className="py-4 px-6 text-left font-semibold text-base">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Montant</span>
                  </div>
                </th>
                <th className="py-4 px-6 text-left font-semibold text-base">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Date</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-200 font-semibold">
              {dataDepense.map((depense, index) => (
                <tr
                  key={index}
                  className={`
                group hover:bg-primary/5 transition-all duration-200
                ${index % 2 === 0 ? "bg-base-50/50" : "bg-base-100"}
              `}
                >
                  <td className="py-4 px-6 font-semibold">
                    <div className="flex items-center gap-3 font-semibold">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <span className="font-bold text-primary ">
                          {depense.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="tracking-wide font-semibold">
                        {depense.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-primary font-['Inter']">
                        {depense.prix}
                      </span>
                      <span className="text-sm font-bold text-gray-500">
                        fcfa
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-base-200 group-hover:bg-base-300 transition-colors">
                      <span className="text-sm  font-bold">
                        {depense.date
                          ? new Date(depense.date).toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "Aujourd'hui"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {dataDepense.length === 0 && !error && (
          <div className="text-center py-16 px-4">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-base-200 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Aucune dépense enregistrée
              </h3>
              <p className="text-gray-500">
                Commencez par ajouter votre première dépense ci-dessus
              </p>
            </div>
          </div>
        )}

        {dataDepense.length > 0 && (
          <div className="border-t border-base-300 bg-base-100 px-6 py-3 hover:bg-black">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {dataDepense.length} dépense
                {dataDepense.length > 1 ? "s" : ""}
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
      </div>
    </div>
  );
}

export default Desktop;
