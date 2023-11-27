import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    

    async function registerUser(ev) {
        ev.preventDefault();
        try {
            await axios.post('/register', {
                name,
                email,
                password,
            });

            alert('Registrad@ con éxito. Ya puedes iniciar sesión')

        } catch (error) {
            alert('La direccion de correo electrónico ya se encuentra registrada.')
        }
        
    }
    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Registro</h1>
                <form className="max-w-md mx-auto" onSubmit={registerUser}>
                    <input type="text" 
                        placeholder="nombre"
                        value={name}
                        onChange={ev => setName(ev.target.value)} 
                        />
                    <input type="email" 
                        placeholder="correo@gmail.com"
                        value={email}
                        onChange={ev => setEmail(ev.target.value)} 
                        />
                    <input type="password" 
                        placeholder="contraseña"
                        value={password} 
                        onChange={ev => setPassword(ev.target.value)} />
                    
                    <button className="primary">Registrar</button>
                    <div className="text-center py-2 text-gray-500">
                        ¿Ya estás registrado? <Link className="underline text-black" to={'/login'}>Iniciar sesión</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterPage;