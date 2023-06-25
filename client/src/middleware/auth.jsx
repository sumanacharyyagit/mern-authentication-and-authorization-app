/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/store";

export const AuthorizeUser = ({ ...props }) => {
    const { children } = props;
    const token = localStorage.getItem("token");

    if (!token) return <Navigate to={"/"} replace={true} />;
    return children;
};

export const ProtectRoute = ({ ...props }) => {
    const { children } = props;
    const username = useAuthStore.getState().auth.username;
    if (!username) {
        return <Navigate to={"/"} replace={true}></Navigate>;
    }
    return children;
};
