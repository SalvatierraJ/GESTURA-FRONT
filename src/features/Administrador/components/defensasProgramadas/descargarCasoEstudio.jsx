import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';

function getFileName(url = "") {
  try {
    return decodeURIComponent(url.split("/").pop().split("?")[0]);
  } catch {
    return "archivo";
  }
}

export default function ArchivoDefensa({ url }) {
  if (!url) return <span className="italic text-gray-400">Sin archivo</span>;

  const fileName = getFileName(url);

  return (
    <div className="flex items-center gap-2">
      {/* Nombre del archivo, truncado si es muy largo */}
      <span
        className="truncate max-w-[120px] text-gray-900"
        title={fileName}
      >
        {fileName}
      </span>
      {/* Botón de ver/abrir */}
      <Button
        icon="pi pi-eye"
        className="p-button-rounded p-button-text p-button-sm p-button-info"
        tooltip="Ver archivo"
        tooltipOptions={{ position: "top" }}
        onClick={() => window.open(url, "_blank")}
        aria-label="Previsualizar"
      />
      {/* Botón de descarga */}
      <Button
        icon="pi pi-download"
        className="p-button-rounded p-button-text p-button-sm p-button-danger"
        tooltip="Descargar"
        tooltipOptions={{ position: "top" }}
        onClick={() => {
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}
        aria-label="Descargar"
      />
    </div>
  );
}
