export function createProfileNotification() {
  const existingNotification = document.getElementById("profile-notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement("div");
  notification.id = "profile-notification";
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 999999;
    background: linear-gradient(135deg, #f59e0b, #ea580c);
    color: white;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    padding: 16px;
    cursor: pointer;
    font-family: system-ui, -apple-system, sans-serif;
    max-width: 350px;
    animation: slideIn 0.3s ease-out;
  `;

  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <span style="font-size: 20px;">⚠️</span>
      <div style="flex: 1;">
        <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">
          ¡Perfil incompleto!
        </div>
        <div style="font-size: 12px; opacity: 0.9;">
          Faltan datos en tu perfil. Haz clic para completar.
        </div>
      </div>
      <button id="close-notification" style="
        background: none;
        border: none;
        color: rgba(255,255,255,0.7);
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
      ">×</button>
    </div>
  `;

  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);

  notification.addEventListener("click", function (e) {
    if (e.target.id !== "close-notification") {
      window.location.href = "/home/ajustes";
    }
  });

  const closeBtn = notification.querySelector("#close-notification");
  closeBtn.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  // Agregar al bod
  document.body.appendChild(notification);

  return notification;
}

// Función para remover la notificación
export function removeProfileNotification() {
  const notification = document.getElementById("profile-notification");
  if (notification) {
    notification.remove();
  }
}
