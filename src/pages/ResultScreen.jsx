import React, { useState } from 'react';
import CameraCapture from '../components/game/CameraCapture';
import { registerVisitorSession } from '../services/firebase';

export const ResultScreen = ({ nickname, institution, location, xp, level, team, onReset }) => {
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState(null);
  const [capturedPhotoFile, setCapturedPhotoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusText, setStatusText] = useState('');

  const handlePhotoCaptured = (file, objectUrl) => {
    setCapturedPhotoUrl(objectUrl);
    setCapturedPhotoFile(file);
  };

  // Enviar datos del stand a la nube de Firestore
  const handleTerminalRelease = async () => {
    setIsSubmitting(true);
    setStatusText('CONECTANDO CON LA NUBE CIBERSEC NoSQL...');

    try {
      setStatusText('PROCESANDO COMPRESIÓN BIOMÉTRICA EN CANVAS (JPEG 0.7)...');
      
      // Registrar la sesión (este método internamente comprime y genera el String Base64)
      await registerVisitorSession({
        nickname,
        institution,
        location,
        team,
        xp,
        level
      }, capturedPhotoFile);

      setStatusText('¡REGISTRO EXITOSO EN EL MURO DEL STAND! LIBERANDO TERMINAL...');
      
      // Esperar un segundo para que el participante vea el logro
      setTimeout(() => {
        onReset();
      }, 1200);

    } catch (error) {
      console.error("Error al registrar operador en la nube: ", error);
      setStatusText('ERROR AL SINCRONIZAR CON FIRESTORE CLOUD.');

      // Fallback a prueba de fallos para stand físico: no bloquear la cola de visitantes en caso de fallos de red
      const skip = window.confirm(
        '¡Fallo de red al conectar con Firebase! ¿Deseas saltar el registro en la nube y liberar la terminal de todos modos para permitir el acceso al siguiente operador?'
      );

      if (skip) {
        onReset();
      } else {
        setIsSubmitting(false);
      }
    }
  };

  // Mapear temas de color de los equipos
  const teamStyles = {
    red: { name: 'RED TEAM', label: 'Operador Ofensivo', color: '#ff2a6d' },
    blue: { name: 'BLUE TEAM', label: 'Operador Defensivo', color: '#00f0ff' },
    purple: { name: 'PURPLE TEAM', label: 'Operador Estratega', color: '#9d4edd' }
  };

  const activeTeamInfo = teamStyles[team] || { name: 'OPERADOR', label: 'Visitante', color: '#00f0ff' };

  return (
    <div className="victory-screen" style={{ width: '100%', maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Encabezado del Logro */}
      <div style={{ marginBottom: '30px' }}>
        <h1 className="glitch-text" style={{ fontFamily: 'var(--font-display)', color: 'var(--neon-green)', fontSize: '2.5rem', letterSpacing: '4px', textShadow: '0 0 15px rgba(5, 255, 161, 0.4)' }}>
          ¡CORTAFUEGOS TOTALMENTE CONFIGURADO!
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#a0aec0', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '3px' }}>
          Sistema de seguridad de red robustecido al 100% • UNASAM Stand
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '30px', width: '100%', alignItems: 'start' }}>
        
        {/* Lado Izquierdo: Captura de Foto Biométrica */}
        <div className="cyber-card" style={{ borderColor: 'rgba(255,255,255,0.08)', padding: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--theme-color)', fontSize: '0.95rem', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            [ REGISTRO BIOMÉTRICO STAND ]
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e0', marginBottom: '20px', lineHeight: '1.4' }}>
            ¡Felicitaciones, Operador! Has resuelto todos los desafíos de la Fase 1.5 en el stand de CIBERSEC 2.0. Inmortaliza tu récord capturando tu selfie táctica para imprimir y publicar tus credenciales.
          </p>

          <CameraCapture onPhotoCaptured={handlePhotoCaptured} />
        </div>

        {/* Lado Derecho: Credencial Operativa Holográfica de Victoria */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <div className="operator-badge glow">
            {/* Escáner láser holográfico interactivo */}
            <div className="scanline-hologram" />

            {/* Encabezado de la credencial */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.6rem', color: 'var(--neon-green)', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                ✦ OPERADOR EXCELENCIA CIBERSEC 2.0 ✦
              </span>
              <span
                style={{
                  background: 'var(--neon-green)',
                  color: '#000',
                  fontSize: '0.6rem',
                  fontWeight: 'bold',
                  padding: '2px 8px',
                  fontFamily: 'var(--font-display)',
                  borderRadius: '2px'
                }}
              >
                LEVEL {level}
              </span>
            </div>

            {/* Cuerpo de la Credencial */}
            <div style={{ display: 'flex', gap: '20px' }}>
              {/* Contenedor del Selfie o Avatar por Defecto */}
              <div
                style={{
                  width: '120px',
                  height: '150px',
                  border: `2px solid ${activeTeamInfo.color}`,
                  background: 'rgba(0,0,0,0.6)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)'
                }}
              >
                {capturedPhotoUrl ? (
                  <img
                    src={capturedPhotoUrl}
                    alt="Foto de Operador"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'contrast(1.2) brightness(1.1) grayscale(0.2) sepia(0.1)'
                    }}
                  />
                ) : (
                  // Avatar de Reemplazo
                  <div style={{ textAlign: 'center', color: activeTeamInfo.color, padding: '10px' }}>
                    <div style={{ fontSize: '2.5rem', textShadow: `0 0 8px ${activeTeamInfo.color}` }}>?</div>
                    <div style={{ fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>
                      ESCANEO REQUERIDO
                    </div>
                  </div>
                )}
                
                {/* Cuadrículas decorativas sobre la imagen */}
                <div style={{ position: 'absolute', top: 4, left: 4, right: 4, bottom: 4, border: '1px dashed rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
              </div>

              {/* Datos Impresos del Operador */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.55rem', color: '#718096', textTransform: 'uppercase', letterSpacing: '1px' }}>APODO OPERATIVO</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: '#fff', textTransform: 'uppercase', textShadow: `0 0 5px ${activeTeamInfo.color}` }}>
                    {nickname}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.55rem', color: '#718096', textTransform: 'uppercase', letterSpacing: '1px' }}>INSTITUCIÓN EN STAND</div>
                  <div style={{ fontSize: '0.8rem', color: '#e2e8f0', fontWeight: 'bold' }}>
                    {institution}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.55rem', color: '#718096', textTransform: 'uppercase', letterSpacing: '1px' }}>PROCEDENCIA DE RED</div>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e0' }}>
                    {location}
                  </div>
                </div>
              </div>
            </div>

            {/* Estadísticas de Misión y Puntuación Total */}
            <div style={{ marginTop: '20px', background: 'rgba(5, 255, 161, 0.03)', border: '1px solid rgba(5, 255, 161, 0.1)', padding: '12px', borderRadius: '4px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '0.55rem', color: 'var(--neon-green)', textTransform: 'uppercase' }}>XP MÁXIMO OBTENIDO</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: '#fff' }}>
                    {xp} XP
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.55rem', color: 'var(--neon-green)', textTransform: 'uppercase' }}>RANGO MILITAR</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, color: activeTeamInfo.color, fontSize: '0.9rem', letterSpacing: '1px' }}>
                    {activeTeamInfo.name}
                  </div>
                </div>
              </div>
            </div>

            {/* Firma Táctica Digital */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', fontSize: '0.55rem', color: '#718096' }}>
              <span>CIBERSEC 2.0 // ESTACIÓN LOCAL</span>
              <span>VERIFICACIÓN: BIOMETRIC_SUCCESS</span>
            </div>
          </div>

          {/* Estado de sincronización Firebase */}
          {isSubmitting && statusText && (
            <div
              className="cyber-card"
              style={{
                width: '100%',
                maxWidth: '450px',
                padding: '10px 14px',
                background: 'rgba(0, 240, 255, 0.05)',
                borderColor: 'var(--neon-cyan)',
                color: '#fff',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                textAlign: 'center',
                marginTop: '10px',
                letterSpacing: '1px'
              }}
            >
              <span className="blink-cursor" style={{ width: '8px', height: '12px', backgroundColor: 'var(--neon-cyan)', marginRight: '6px' }}></span>
              {statusText}
            </div>
          )}

          {/* Botón de reset de la terminal */}
          <button
            type="button"
            disabled={isSubmitting}
            className="cyber-btn btn-magenta glow"
            onClick={handleTerminalRelease}
            style={{
              width: '100%',
              maxWidth: '450px',
              padding: '16px 20px',
              fontSize: '1rem',
              letterSpacing: '3px',
              marginTop: '15px',
              borderColor: isSubmitting ? '#4a5568' : 'var(--neon-magenta)',
              color: isSubmitting ? '#4a5568' : '#fff',
              cursor: isSubmitting ? 'default' : 'pointer'
            }}
          >
            🔓 LIBERAR TERMINAL & ENVIAR REGISTRO
          </button>
          <div style={{ fontSize: '0.7rem', color: '#718096', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Esto subirá tu credencial al Muro en tiempo real y limpiará el stand
          </div>
        </div>

      </div>

    </div>
  );
};
export default ResultScreen;
