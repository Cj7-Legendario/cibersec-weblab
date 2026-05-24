import React, { useState, useEffect } from 'react';
import { listenToVisitorWall } from '../services/firebase';

export const VisitorWall = ({ onBackToLanding }) => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Escuchar a Firestore en tiempo real al montar
  useEffect(() => {
    const unsubscribe = listenToVisitorWall((data) => {
      setVisitors(data);
      setLoading(false);
    });

    // Desuscribirse al desmontar
    return () => unsubscribe();
  }, []);

  // Función nativa para renderizar y descargar la credencial en PNG mediante HTML5 Canvas
  const downloadCredentialPNG = (visitor) => {
    const canvas = document.createElement('canvas');
    canvas.width = 450;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    // 1. Dibujar Fondo Oscuro
    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, 450, 600);

    // 2. Dibujar Rejilla Tecnológica Cyberpunk
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 15) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 15) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // 3. Determinar color del bando
    const teamColors = {
      red: '#ff2a6d',
      blue: '#00f0ff',
      purple: '#9d4edd'
    };
    const teamNames = {
      red: 'RED TEAM (OFENSIVO)',
      blue: 'BLUE TEAM (DEFENSIVO)',
      purple: 'PURPLE TEAM (ESTRATEGA)'
    };
    const themeColor = teamColors[visitor.team] || '#00f0ff';
    const teamName = teamNames[visitor.team] || 'OPERADOR';

    // 4. Dibujar Borde Neón Brillante con esquinas biseladas cortadas
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(30, 15);
    ctx.lineTo(420, 15);
    ctx.lineTo(435, 30);
    ctx.lineTo(435, 570);
    ctx.lineTo(420, 585);
    ctx.lineTo(30, 585);
    ctx.lineTo(15, 570);
    ctx.lineTo(15, 30);
    ctx.closePath();
    ctx.stroke();

    // Sombreado de resplandor neón perimetral
    ctx.shadowColor = themeColor;
    ctx.shadowBlur = 15;
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.stroke();
    
    // Quitar sombras para dibujar textos
    ctx.shadowBlur = 0;

    // 5. Encabezado de la Credencial
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '900 12px monospace';
    ctx.fillText("✦ OPERADOR EXCELENCIA CIBERSEC 2.0 ✦", 40, 45);

    // Badge de Nivel
    ctx.fillStyle = themeColor;
    ctx.fillRect(345, 27, 65, 22);
    ctx.fillStyle = '#000';
    ctx.font = '900 10px sans-serif';
    ctx.fillText(`LEVEL ${visitor.level}`, 354, 42);

    // 6. Cargar y dibujar Foto en Base64
    const img = new Image();
    img.onload = () => {
      // Dibujar marco de imagen
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(39, 79, 122, 152);
      
      // Dibujar imagen comprimida
      ctx.drawImage(img, 40, 80, 120, 150);

      // 7. Escribir Datos del Operador
      ctx.fillStyle = '#718096';
      ctx.font = '700 9px monospace';
      ctx.fillText("APODO OPERATIVO", 185, 95);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 18px sans-serif';
      ctx.fillText(visitor.nickname.toUpperCase(), 185, 118);

      ctx.fillStyle = '#718096';
      ctx.font = '700 9px monospace';
      ctx.fillText("INSTITUCIÓN DECLARADA", 185, 150);
      
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '700 11px monospace';
      // Truncar nombre largo de institución si excede espacio
      let instText = visitor.institution;
      if (instText.length > 25) instText = instText.substring(0, 23) + '..';
      ctx.fillText(instText, 185, 168);

      ctx.fillStyle = '#718096';
      ctx.font = '700 9px monospace';
      ctx.fillText("PROCEDENCIA DE RED", 185, 200);
      ctx.fillStyle = '#cbd5e0';
      ctx.font = '700 11px monospace';
      ctx.fillText(visitor.location, 185, 218);

      // 8. Recuadro de Estadísticas de Gamificación
      ctx.fillStyle = 'rgba(5, 255, 161, 0.03)';
      ctx.fillRect(40, 260, 370, 70);
      ctx.strokeStyle = 'rgba(5, 255, 161, 0.15)';
      ctx.strokeRect(40, 260, 370, 70);

      ctx.fillStyle = '#05ffa1';
      ctx.font = '700 9px monospace';
      ctx.fillText("XP MÁXIMO OBTENIDO", 55, 285);
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 15px sans-serif';
      ctx.fillText(`${visitor.xp} XP`, 55, 310);

      ctx.fillStyle = '#05ffa1';
      ctx.font = '700 9px monospace';
      ctx.fillText("ROL ASIGNADO EN STAND", 220, 285);
      ctx.fillStyle = themeColor;
      ctx.font = '900 12px sans-serif';
      ctx.fillText(teamName, 220, 310);

      // 9. Bloque de Auditoría y Marcas Corporativas
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.fillRect(40, 355, 370, 160);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.strokeRect(40, 355, 370, 160);

      ctx.fillStyle = themeColor;
      ctx.font = '900 11px monospace';
      ctx.fillText("📄 REPORTE DE SISTEMA:", 55, 380);

      ctx.fillStyle = '#cbd5e0';
      ctx.font = '700 10px monospace';
      ctx.fillText(`> OPERADOR REGISTRADO: ${visitor.nickname}`, 55, 410);
      ctx.fillText(`> ORIGEN DETECTADO: HASH_STAND_CIBERSEC`, 55, 430);
      ctx.fillText(`> MITIGACIÓN COMPLETA: CORTAFUEGOS INMUNIZADO`, 55, 450);
      ctx.fillText(`> LOGS STATUS: SECURE_ENVIRONMENT_ON`, 55, 470);
      ctx.fillText(`> VERIFICACIÓN: BIOMETRIC_VERIFIED_OK`, 55, 490);

      // 10. Firmas y Hash de Pie
      ctx.fillStyle = '#718096';
      ctx.font = '700 9px monospace';
      ctx.fillText("CIBERSEC 2.0 // EXPOSICIÓN STAND", 40, 560);
      ctx.fillText("UNASAM HUARAZ", 335, 560);

      // 11. Descargar la imagen
      const dataUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `CRED_CIBERSEC_${visitor.nickname.toUpperCase()}.png`;
      downloadLink.href = dataUrl;
      downloadLink.click();
    };

    // Si tiene foto cargada en Base64, dibujarla en la credencial
    img.src = visitor.photoBase64 || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="150" viewBox="0 0 120 150"><rect width="100%" height="100%" fill="%230f0f15"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23718096" font-size="10" font-family="monospace">NO_PHOTO</text></svg>';
  };

  const getTeamColor = (team) => {
    if (team === 'red') return '#ff2a6d';
    if (team === 'blue') return '#00f0ff';
    if (team === 'purple') return '#9d4edd';
    return '#00f0ff';
  };

  return (
    <div style={{ padding: '24px', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Láser de barrido */}
      <div className="scan-laser"></div>

      {/* Cabecera del Muro */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--theme-color)', paddingBottom: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Avatar decorativo */}
          <div className="hud-avatar" style={{ animation: 'blink 2s infinite' }}>
            SOC
          </div>
          <div>
            <h1 className="glitch-text" style={{ fontFamily: 'var(--font-display)', color: 'var(--theme-color)', fontSize: '1.8rem', letterSpacing: '2px' }}>
              MURO DE OPERADORES REGISTRADOS
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
              Monitoreo y Registro de Credenciales en Tiempo Real • CIBERSEC UNASAM
            </p>
          </div>
        </div>

        {/* Botón de retorno para administración del stand */}
        <button
          onClick={onBackToLanding}
          className="cyber-btn btn-magenta"
          style={{ padding: '10px 20px', fontSize: '0.8rem', letterSpacing: '1px' }}
        >
          🔐 TERMINAL DE REGISTRO
        </button>
      </header>

      {loading ? (
        // Pantalla de carga
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
          <span className="blink-cursor" style={{ width: '20px', height: '28px', backgroundColor: 'var(--theme-color)' }}></span>
          <div style={{ fontFamily: 'var(--font-display)', color: 'var(--theme-color)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '3px' }}>
            Estableciendo conexión en tiempo real con Firestore...
          </div>
        </div>
      ) : visitors.length === 0 ? (
        // Sin registros
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          <div style={{ fontSize: '1.5rem', color: '#718096', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
            [ Ningún operador registrado en el stand aún ]
          </div>
          <p style={{ color: '#4a5568', fontSize: '0.85rem' }}>
            Completa las misiones en una terminal y registra tu foto para aparecer en este panel gigante.
          </p>
        </div>
      ) : (
        // Grilla interactiva del muro
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', flex: 1 }}>
          {visitors.map((visitor) => {
            const teamColor = getTeamColor(visitor.team);
            const teamName = visitor.team ? visitor.team.toUpperCase() : 'OPERADOR';

            return (
              <div
                key={visitor.id}
                className="cyber-card"
                style={{
                  borderLeftColor: teamColor,
                  borderColor: `${teamColor}44`,
                  background: 'rgba(5, 5, 8, 0.95)',
                  boxShadow: `0 4px 20px ${teamColor}15`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px',
                  padding: '20px'
                }}
              >
                {/* Cabecera Tarjeta */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '0.65rem', color: '#718096', fontFamily: 'var(--font-mono)' }}>
                    ID: {visitor.id.substring(0, 8).toUpperCase()}
                  </span>
                  <span
                    style={{
                      background: teamColor,
                      color: '#000',
                      fontSize: '0.6rem',
                      fontWeight: 'bold',
                      padding: '1px 6px',
                      fontFamily: 'var(--font-display)'
                    }}
                  >
                    LVL {visitor.level}
                  </span>
                </div>

                {/* Cuerpo Tarjeta */}
                <div style={{ display: 'flex', gap: '15px' }}>
                  {/* Foto Decodificada Base64 */}
                  <div
                    style={{
                      width: '75px',
                      height: '95px',
                      border: `1px solid ${teamColor}`,
                      background: 'rgba(0,0,0,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      borderRadius: '2px'
                    }}
                  >
                    {visitor.photoBase64 ? (
                      <img
                        src={visitor.photoBase64}
                        alt={visitor.nickname}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <span style={{ color: '#718096', fontSize: '0.55rem', textTransform: 'uppercase' }}>NO_PIC</span>
                    )}
                  </div>

                  {/* Metadatos */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'center' }}>
                    <div style={{ fontSize: '0.6rem', color: '#718096', textTransform: 'uppercase' }}>Operador</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 'bold', fontSize: '1rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {visitor.nickname}
                    </div>
                    
                    <div style={{ fontSize: '0.75rem', color: '#cbd5e0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {visitor.institution}
                    </div>
                    
                    <div style={{ fontSize: '0.72rem', color: '#a0aec0' }}>
                      {visitor.location}
                    </div>
                  </div>
                </div>

                {/* Footer Tarjeta / Estadísticas */}
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                  <div>
                    <span style={{ color: '#718096', fontSize: '0.6rem', display: 'block', textTransform: 'uppercase' }}>Puntaje</span>
                    <span style={{ fontWeight: 'bold', color: '#fff' }}>{visitor.xp} XP</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: '#718096', fontSize: '0.6rem', display: 'block', textTransform: 'uppercase' }}>Bando</span>
                    <span style={{ fontWeight: 'bold', color: teamColor }}>{teamName}</span>
                  </div>
                </div>

                {/* Botón de descarga de credencial física PNG */}
                <button
                  type="button"
                  onClick={() => downloadCredentialPNG(visitor)}
                  className="cyber-btn glow"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    fontSize: '0.72rem',
                    borderColor: teamColor,
                    color: '#fff',
                    letterSpacing: '1px',
                    boxShadow: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#fff';
                    e.currentTarget.style.boxShadow = `0 0 10px ${teamColor}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = teamColor;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  📥 DESCARGAR CREDENCIAL PNG
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default VisitorWall;
