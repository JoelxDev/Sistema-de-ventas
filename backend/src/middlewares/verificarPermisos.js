export function verificarPermisos(modulo, permiso) {
    return (req, res, next) =>{
        const permisos = req.usuario.permisos;

        if(!permisos || !permisos[modulo]){
            return res.status(403).json({
                mensaje: `Acceso denegado: No tienes permisos para acceder a este módulo "${modulo}"`
            })
        }

        if(!permisos[modulo].includes(permiso)){
            return res.status(403).json({
                mensaje: `No tienes permiso para "${permiso}" en "${modulo}"`
            })
        }
        next();
    }
}