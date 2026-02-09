import Depenses from "./pages/Depenses.tsx";
import LayoutPage from "./pages/LayoutPage.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/auth/Login.tsx";
import Inscription from "./pages/auth/Inscription.tsx";
import DepensesGuard from './components/DepensesGuard.tsx'
const App = () => {
  const myRouter = createBrowserRouter([
    {
      path: "/",
      element: <LayoutPage />,
      children: [
        { index: true, element: <DepensesGuard>
           <Depenses />
        </DepensesGuard> },
        { path: "/login", element: <Login /> },
        { path: "/inscription", element: <Inscription /> },
      ],
    },
  ]);
  return <RouterProvider router={myRouter} />;
};
export default App;
