import React, { useState, useContext } from 'react';
import { GameContext } from '../../../context/GameContext';

export const PhishingFlagger = () => {
  const { updateXP, completeMission, completedMissions } = useContext(GameContext);

  // Zonas del correo
  const [flaggedZones, setFlaggedZones] = useState({
    sender: false,
    urgency: false,
    link: false
  });
  const [logs, setLogs] = useState([
    { text: '[PHISHING FLAGGER STATUS: BANDEJA DE CORREO INSPECCIONADA]', type: 'info' },
    { text: '>> Objetivo: Identifica y haz clic en los 3 elementos fraudulentos del correo para reportar la brecha.', type: 'warning' }
  ]);
  const [errorFlash, setErrorFlash] = useState(false);

  const isAlreadyCompleted = completedMissions.includes('mission_phishing');
  const isFinished = flaggedZones.sender && flaggedZones.urgency && flaggedZones.link;

  const addLog = (text, type) => {
    setLogs(prev => [...prev, { text, type }]);
  };

  // Clic en zonas fraudulentas correctas
  const handleFraudClick = (zoneName, friendlyName) => {
    if (flaggedZones[zoneName] || isFinished) return;

    const newFlags = { ...flaggedZones, [zoneName]: true };
    setFlaggedZones(newFlags);
    updateXP(50);
    
    addLog(`>> [ALERTA DE INDICADOR DETECTADO]: ${friendlyName.toUpperCase()} (+50 XP)`, 'success');

    // Verificar si encontró todos
    if (newFlags.sender && newFlags.urgency && newFlags.link) {
      addLog('>> [STATUS: CORREO EXPUESTO] - REPORTE DE PHISHING SINCRONIZADO.', 'success');
      setTimeout(() => {
        if (!isAlreadyCompleted) {
          completeMission('mission_phishing');
          addLog('>> SISTEMA: Misión Phishing completada con éxito. Registrada en base de datos.', 'info');
        }
      }, 300);
    }
  };

  // Clic en zonas seguras (falsos clics)
  const handleSafeClick = (friendlyName) => {
    if (isFinished) return;
    setErrorFlash(true);
    setTimeout(() => setErrorFlash(false), 500);

    updateXP(-20);
    addLog(`>> [ERROR DE ANÁLISIS]: El elemento "${friendlyName}" es parte de una estructura legítima de correo. (-20 XP)`, 'error');
  };

  return (
    <div className={`cyber-card glow ${errorFlash ? 'red-team' : ''}`} style={{ flex: 1, borderTop: '4px solid var(--theme-color)', padding: '20px' }}>
      
      {/* Cabecera */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '15px' }}>
        <div style={{ fontFamily: 'var(--font-display)', color: 'var(--theme-color)', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
          🔵 BLUE_LAB_02: ANALIZADOR DE CORREOS DE FRAUDE (PHISHING)
        </div>
        <div style={{ fontSize: '0.75rem', color: isAlreadyCompleted || isFinished ? 'var(--neon-green)' : 'var(--neon-yellow)', textTransform: 'uppercase', fontWeight: 'bold' }}>
          {isAlreadyCompleted || isFinished ? '[ REPORTADO ]' : '[ POR REVISAR ]'}
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: '#a0aec0', marginBottom: '16px', lineHeight: '1.4' }}>
        Un presunto mail de actualización de cuentas de la UNASAM ha llegado a la bandeja de soporte. Haz clic directamente sobre los 3 vectores de fraude sospechosos para reportar el correo al SOC.
      </p>

      {/* Tarjeta del Correo Electrónico Simulado */}
      <div style={{ background: '#0d0d12', border: '1px solid #1a1a24', padding: '16px', borderRadius: '4px', margin: '20px 0', fontFamily: 'sans-serif' }}>
        
        {/* Cabecera del correo */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', marginBottom: '12px', fontSize: '0.85rem', color: '#a0aec0' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontWeight: 'bold', color: '#fff' }}>De:</span>
            <span
              onClick={() => handleFraudClick('sender', 'Remitente fraudulento')}
              style={{
                cursor: isFinished ? 'default' : 'pointer',
                color: flaggedZones.sender ? 'var(--neon-green)' : '#cbd5e0',
                background: flaggedZones.sender ? 'rgba(5, 255, 161, 0.05)' : 'transparent',
                border: flaggedZones.sender ? '1px solid var(--neon-green)' : '1px dashed transparent',
                padding: '2px 6px',
                borderRadius: '2px',
                textDecoration: flaggedZones.sender ? 'none' : 'underline'
              }}
            >
              soporte-unasam@unasam-seguridad-admin.com
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ fontWeight: 'bold', color: '#fff' }}>Para:</span>
            <span onClick={() => handleSafeClick('Para: Destinatario')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
              estudiantes@unasam.edu.pe
            </span>
          </div>
        </div>

        {/* Cuerpo del correo */}
        <div style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: '1.5' }}>
          {/* Asunto */}
          <div style={{ fontWeight: 'bold', marginBottom: '12px', color: '#fff' }}>
            Asunto:{' '}
            <span
              onClick={() => handleFraudClick('urgency', 'Asunto con urgencia artificial')}
              style={{
                cursor: isFinished ? 'default' : 'pointer',
                color: flaggedZones.urgency ? 'var(--neon-green)' : '#e2e8f0',
                background: flaggedZones.urgency ? 'rgba(5, 255, 161, 0.05)' : 'transparent',
                border: flaggedZones.urgency ? '1px solid var(--neon-green)' : '1px dashed transparent',
                padding: '2px 6px',
                borderRadius: '2px'
              }}
            >
              ⚠️ ¡URGENTE! Su cuenta de intranet corporativa UNASAM será suspendida en 5 minutos
            </span>
          </div>

          <p style={{ marginBottom: '12px' }} onClick={() => handleSafeClick('Cuerpo de correo legítimo')}>
            Estimado estudiante del campus. Hemos detectado múltiples accesos fallidos en su cuenta institucional.
          </p>

          <p style={{ marginBottom: '16px' }} onClick={() => handleSafeClick('Instrucción')}>
            Para evitar que sus archivos, notas y accesos de red sean purgados de forma permanente del mainframe de la UNASAM, es obligatorio que verifique sus credenciales de acceso ingresando de forma inmediata en el siguiente portal táctico de contingencia:
          </p>

          {/* Enlace Sospechoso */}
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <span
              onClick={() => handleFraudClick('link', 'Enlace de destino sospechoso')}
              style={{
                cursor: isFinished ? 'default' : 'pointer',
                color: flaggedZones.link ? 'var(--neon-green)' : 'var(--neon-magenta)',
                background: flaggedZones.link ? 'rgba(5, 255, 161, 0.05)' : 'rgba(255, 42, 109, 0.05)',
                border: flaggedZones.link ? '1px solid var(--neon-green)' : '1px dashed var(--neon-magenta)',
                padding: '10px 20px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                display: 'inline-block',
                borderRadius: '4px',
                textDecoration: 'underline'
              }}
            >
              http://unasam.edu.pe-login-verification.xyz/accounts/reset-pwd
            </span>
          </div>

          <p style={{ fontSize: '0.75rem', color: '#718096' }} onClick={() => handleSafeClick('Firma de pie')}>
            Atentamente, Departamento de Soporte Informático Global de la Universidad UNASAM.
          </p>
        </div>

      </div>

      {/* Estadísticas de Banderas */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--theme-color)', textTransform: 'uppercase', fontWeight: 'bold' }}>
          INDICADORES DETECTADOS: {Object.values(flaggedZones).filter(Boolean).length} / 3
        </div>
        <div style={{ fontSize: '0.75rem', color: '#718096' }}>
          FALLOS COMETIDOS: restan XP en caliente
        </div>
      </div>

      {/* Terminal de Logs */}
      <div>
        <div style={{ fontSize: '0.7rem', color: 'var(--theme-color)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 'bold' }}>
          📟 VOLCADO DE DETECCIÓN SOC (PHISHING_SOC_ALERTS)
        </div>
        <div className="cyber-terminal" style={{ height: '90px' }}>
          {logs.map((log, index) => (
            <div key={index} className={`terminal-line ${log.type}`}>
              {log.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default PhishingFlagger;
