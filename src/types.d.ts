declare global {
  interface TypeDataDepense {
    id?: number;
    name: string;
    prix: number | null;
    date?: string;
  };
  interface PropsResponsive {
  dataDepense: TypeDataDepense[];
  error: string | null;
};
interface TypeFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  depenseName: string;
  loading: boolean;
  depensePrix: null | number;
}
interface TypeUsers{
  nom:string;
  prenom:string;
  email:string;
  password:string
}
}
export {};
