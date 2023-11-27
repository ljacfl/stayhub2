import { useContext, useState } from "react";
import { UserContext } from "../UserContext.jsx";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage.jsx";
import AccountNav from "../AccountNav.jsx";


const ProfilePage = () => {
    const [redirect, setRedirect] = useState(null);
    const { ready, user, setUser } = useContext(UserContext);

    let { subpage } = useParams();

    if (subpage === undefined) {
        subpage = 'profile';
    }

    async function logout() {
        await axios.post('/logout');
        setRedirect('/');
        setUser(null);
    }

    if (!ready) {
        return 'Cargando ...';
    }
    if (ready && !user && !redirect) {
        return <Navigate to={'/login'} />
    }
   

    if (redirect) {
        return <Navigate to={redirect} />
    }
    return (
        <div>
            <AccountNav/>
            {subpage === 'profile' && (
                <div className="text-center max-w-lg mx-auto">
                    Iniciaste como {user.name} ({user.email})
                    <button onClick={logout} className="primary max-w-sm mt-2">Cerrar sesión</button>
                </div>
            )}

            {subpage === 'places' && (
                <PlacesPage />
            )}

        </div>
    )
}

export default ProfilePage;