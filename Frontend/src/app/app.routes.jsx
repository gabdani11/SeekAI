import {createBrowserRouter} from "react-router-dom";
import Login from "../feature/auth/pages/Login.jsx";
import Register from '../feature/auth/pages/Register.jsx';
import Dashboard from "../feature/chat/Dashboard.jsx";
import Protected from "../feature/auth/components/Protected.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Protected>
            <Dashboard/>
        </Protected>
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