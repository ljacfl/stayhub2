import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";

const LoginPage = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [ redirect, setRedirect] = useState(false);
    const { setUser } = useContext(UserContext);

    async function handleLoginSubmit (ev) {
        ev.preventDefault();
        try {
            const {data} = await axios.post('/login', {email, password})
            setUser(data);
            alert('Inicio de sesión exitoso.') 
            setRedirect(true);
        } catch (error) {
            alert('Correo y/o contraseña incorrecta.')
        }
    }

    if( redirect ) {
        return <Navigate to={'/'}/>
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Iniciar sesión</h1>
                <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
                    <input 
                        type="email" 
                        placeholder="correo@gmail.com"
                        value={email}
                        onChange={ev => setEmail(ev.target.value)} 
                        />
                    <input 
                        type="password" 
                        placeholder="contraseña" 
                        value={password}
                        onChange={ev => setPassword(ev.target.value)}
                        />                    
                    <button className="primary">Iniciar sesión</button>
                    <div className="text-center py-2 text-gray-500">
                        ¿No estás registrado? <Link className="underline text-black" to={'/register'}>Registrarse</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginPage;