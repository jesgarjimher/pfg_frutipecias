import {Navigate, Outlet} from "react-router-dom";


const ProtectedRoute = ({ isAdmin, redirectPath = "/login"}) => {
    if(!isAdmin) {
        return <Navigate to={redirectPath} replace />
    }

    return <Outlet/>
}

export default ProtectedRoute;