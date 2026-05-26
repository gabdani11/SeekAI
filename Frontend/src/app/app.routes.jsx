import {createBrowserRouter} from "react-router-dom";
import Login from "../feature/auth/pages/Login.jsx";
import Register from '../feature/auth/pages/Register.jsx';

const router = createBrowserRouter([
    {
        path: "/",
        element: <div>Home</div>
    },
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/register",
        element: <Register/>
    }
]);
export default router;