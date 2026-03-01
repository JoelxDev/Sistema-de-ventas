import { useAutenticacion } from '../../context/AutenticacionContext.jsx';

export function PerfilUsuario() {
  const { usuario } = useAutenticacion();

  if (!usuario) return <div className="estado-cargando">Cargando perfil...</div>;

  const iniciales = [
    usuario.nombre_per?.[0] ?? '',
    usuario.apellido_per?.[0] ?? ''
  ].join('').toUpperCase() || (usuario.nombre_usuario?.[0] ?? '👤').toUpperCase();

  return (
    <div className="pagina">
      <div className="pagina-header">
        <h1 className="pagina-titulo">Mi Perfil</h1>
      </div>

      <div className="perfil-grid">
        {/* Tarjeta avatar */}
        <div className="perfil-avatar-card">
          <div className="perfil-avatar">{iniciales}</div>
          <p className="perfil-nombre">
            {usuario.nombre_per} {usuario.apellido_per}
          </p>
          {usuario.nombre_rol && (
            <span className="perfil-rol">{usuario.nombre_rol}</span>
          )}
          {usuario.nombre_suc && (
            <span className="perfil-sucursal">🏪 {usuario.nombre_suc}</span>
          )}
        </div>

        {/* Información detallada */}
        <div className="perfil-info-card">
          <h2 className="perfil-section-titulo">Información de la cuenta</h2>
          <div className="perfil-campos">
            <div className="perfil-campo">
              <span className="perfil-campo-label">Usuario</span>
              <span className="perfil-campo-valor">{usuario.usuario ?? '—'}</span>
            </div>
            <div className="perfil-campo">
              <span className="perfil-campo-label">Rol</span>
              <span className="perfil-campo-valor">{usuario.rol ?? '—'}</span>
            </div>
            <div className="perfil-campo">
              <span className="perfil-campo-label">Nombre</span>
              <span className="perfil-campo-valor">{usuario.nombre ?? '—'}</span>
            </div>
            <div className="perfil-campo">
              <span className="perfil-campo-label">Apellido</span>
              <span className="perfil-campo-valor">{usuario.apellido ?? '—'}</span>
            </div>
            <div className="perfil-campo">
              <span className="perfil-campo-label">Teléfono</span>
              <span className="perfil-campo-valor">{usuario.telefono ?? '—'}</span>
            </div>
            <div className="perfil-campo">
              <span className="perfil-campo-label">Correo</span>
              <span className="perfil-campo-valor">{usuario.correo ?? '—'}</span>
            </div>
            <div className="perfil-campo">
              <span className="perfil-campo-label">Sucursal</span>
              <span className="perfil-campo-valor">{usuario.sucursal ?? 'Sin sucursal'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}