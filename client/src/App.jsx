import { RouterProvider, createBrowserRouter } from "react-router-dom";

// Root Routes
import Username from "./components/Username";
import PageNotFound from "./components/PageNotFound";
import Password from "./components/Password";
import Profile from "./components/Profile";
import Recovery from "./components/Recovery";
import Register from "./components/Register";
import Reset from "./components/Reset";
import { AuthorizeUser, ProtectRoute } from "./middleware/auth";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Username />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/password",
        element: (
            <ProtectRoute>
                <Password />
            </ProtectRoute>
        ),
    },
    {
        path: "/profile",
        element: (
            <AuthorizeUser>
                <Profile />
            </AuthorizeUser>
        ),
    },
    {
        path: "/recovery",
        element: <Recovery />,
    },
    {
        path: "/reset",
        element: <Reset />,
    },
    {
        path: "*",
        element: <PageNotFound />,
    },
]);

function App() {
    return (
        <main>
            <RouterProvider router={router}></RouterProvider>
        </main>
    );
}

export default App;
