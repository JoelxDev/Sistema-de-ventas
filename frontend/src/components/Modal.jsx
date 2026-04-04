import '../css/Modal.css';

export function Modal({ isOpen, onClose, onCancelar, titulo, children, className }) {
  const handleClose = onClose || onCancelar;
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className={`modal-content${className ? ` ${className}` : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{titulo}</h2>
          <button className="modal-close" onClick={handleClose}>&times;</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}