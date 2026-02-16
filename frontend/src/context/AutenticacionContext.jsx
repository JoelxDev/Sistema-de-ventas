import { createContext, useContext, useState, useEffect } from "react";
import { apiLogin, apiLogout, verificarSesion } from "../api/ApiLogin/ApiLogin";

const AuthContext = createContext();

export function AutenticacionProvider({ children }) {
    const [usuario, setUsuario] = useState(null)
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        verificarSesionActual();
    }, []);

    async function verificarSesionActual() {
        try {
            const data = await verificarSesion();
            setUsuario(data.usuario);
        } catch (error) {
            setUsuario(null);
        } finally {
            setCargando(false);
        }
    }

    async function login(nombre_usuario, contrasenia) {
        const data = await apiLogin(nombre_usuario, contrasenia);
        setUsuario(data.usuario);
        return data;
    }

    async function logout() {
        await apiLogout();
        setUsuario(null);
    }

    function tienePermiso(modulo, permiso){
        if(!usuario || !usuario.permisos) return false;
        const permisosModulos = usuario.permisos[modulo];
        if(!permisosModulos) return false;
        return permisosModulos.includes(permiso);
    }

    function tieneAccesoModulo(modulo){
        if(!usuario || !usuario.permisos) return false;
        return !!usuario.permisos[modulo];
    }

    return (
        <AuthContext.Provider value={{
            usuario,
            cargando,
            login,
            tienePermiso,
            tieneAccesoModulo,
            estaAutenticado: !!usuario
        }}>
            {children}
        </AuthContext.Provider>
    );
}
export function useAutenticacion() {
    return useContext(AuthContext);
}
