type RuleProps = {
  ok: boolean;
  children: React.ReactNode;
};

function Rule({ ok, children }: RuleProps) {
  return (
    <li
      className={`flex items-center gap-2 text-sm transition-colors duration-200 ${
        ok ? "text-green-500" : "text-red-500"
      }`}
    >
      <span className="font-bold">{ok ? "✔" : "✘"}</span>
      <span>{children}</span>
    </li>
  );
}
export default Rule;
