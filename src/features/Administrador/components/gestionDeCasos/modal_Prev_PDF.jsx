// src/components/ModalDocumento.jsx
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

export default function ModalDocumento({ visible, onHide, url }) {
  return (
    <Dialog
      header="Documento"
      visible={visible}
      style={{ width: '60vw', maxWidth: 900 }}
      onHide={onHide}
      draggable={false}
      resizable={false}
      dismissableMask
      footer={
        <div>
          <Button
            label="Descargar"
            icon="pi pi-download"
            className="p-button-danger"
            onClick={() => window.open(url, '_blank')}
          />
          <Button
            label="Cerrar"
            icon="pi pi-times"
            className="p-button-text"
            onClick={onHide}
          />
        </div>
      }
    >
      {url ? (
        <iframe
          src={url}
          style={{
            width: '100%',
            height: '70vh',
            border: 'none',
            borderRadius: '10px',
            background: '#f7f7f7'
          }}
          title="Documento"
        />
      ) : (
        <div className="text-center text-gray-400">No se ha seleccionado un documento.</div>
      )}
    </Dialog>
  );
}
