import React, { useRef, useState } from 'react';

export default function CameraCapture({ onPhotoCaptured }) {
  const fileInputRef = useRef(null);
  const [localPreview, setLocalPreview] = useState(null);

  const handleTriggerCamera = () => {
    // Simula el clic en el input oculto al presionar tu botón neón
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Crea un stream de memoria temporal para renderizar la foto al instante
      const objectUrl = URL.createObjectURL(file);
      setLocalPreview(objectUrl);
      
      // Enviamos el archivo y la url al componente padre (ResultScreen)
      if (onPhotoCaptured) {
        onPhotoCaptured(file, objectUrl);
      }
    }
  };

  return (
    <div className="camera-capture-box" style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', alignItems: 'center' }}>
      {/* ⚠️ INPUT NATIVO CONTROLADO Y OCULTO */}
      <input
        type="file"
        accept="image/*"
        capture="user" // 👈 'user' fuerza la cámara frontal. Si quisieras la trasera usarías 'environment'
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }} 
      />

      {/* BOTÓN ESTILIZADO DE INTERFAZ */}
      <button 
        type="button" 
        onClick={handleTriggerCamera} 
        className="cyber-btn btn-green glow"
        style={{ width: '100%', fontSize: '0.85rem', padding: '12px 14px', letterSpacing: '2px' }}
      >
        📸 CAPTURAR ESCÁNER BIOMÉTRICO (SELFIE)
      </button>

      {/* VISTA PREVIA CON ESTILO MATRIZ CYBERPUNK */}
      {localPreview && (
        <div style={{ position: 'relative', marginTop: '8px', border: '1px solid var(--theme-color)', padding: '4px', background: '#000', overflow: 'hidden', width: '100%', maxWidth: '280px', borderRadius: '4px' }}>
          <img 
            src={localPreview} 
            alt="Operador Detectado" 
            style={{ width: '100%', height: '180px', objectFit: 'cover', opacity: 0.85, filter: 'contrast(1.2) brightness(1.1) sepia(0.1)' }} 
          />
          {/* Capas estéticas de rejilla sobre la foto */}
          <div className="scanline-hologram" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'var(--neon-green)', opacity: 0.5, pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.8)', color: 'var(--theme-color)', fontSize: '8px', fontFamily: 'var(--font-mono)', padding: '2px 6px', border: '1px solid var(--theme-color)', textTransform: 'uppercase' }}>
            REC // OP_BIOMETRIC_OK
          </div>
        </div>
      )}
    </div>
  );
}
