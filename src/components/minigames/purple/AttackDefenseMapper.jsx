import React, { useState, useContext } from 'react';
import { GameContext } from '../../../context/GameContext';

export const AttackDefenseMapper = () => {
  const { updateXP, completeMission, completedMissions } = useContext(GameContext);

  // Definición de vectores (Lado Izquierdo)
  const attacks = [
    { id: 'sqli', name: 'SQL Injection (SQLi)', desc: 'Explotación de entrada a base de datos' },
    { id: 'phishing', name: 'Phishing por Correo', desc: 'Suplantación de identidad en stand' },
    { id: 'bruteforce', name: 'Fuerza Bruta SSH', desc: 'Ataques de diccionario repetitivos' }
  ];

  // Definición de controles (Lado Derecho)
  const defenses = [
    { id: 'param', name: 'Consultas Parametrizadas', desc: 'Precompilar sentencias SQL sanitizadas' },
    { id: 'filter', name: 'Filtros de Correo + Capacitación', desc: 'Detección heurística de spam y concientización' },
    { id: 'ratelimit', name: 'Rate Limiting + MFA', desc: 'Restricción de intentos fallidos y doble factor' }
  ];

  // Mapeo correcto de vectores y defensas
  const correctMapping = {
    'sqli': 'param',
    'phishing': 'filter',
    'bruteforce': 'ratelimit'
  };

  const [selectedAttack, setSelectedAttack] = useState(null);
  const [selectedDefense, setSelectedDefense] = useState(null);
  const [mappedPairs, setMappedPairs] = useState({}); // Mapeo de attackId -> defenseId
  const [logs, setLogs] = useState([
    { text: '[MAPPER STATUS: AGENTE DE INTEGRACIÓN INTEGRITY CONTROL ACTIVE]', type: 'info' },
    { text: '>> Consigna: Seleccione un vector de ataque y luego su control defensivo de mitigación correcto.', type: 'warning' }
  ]);
  const [errorFlash, setErrorFlash] = useState(false);

  const isAlreadyCompleted = completedMissions.includes('mission_mapper');
  const isFinished = Object.keys(mappedPairs).length === 3;

  const addLog = (text, type) => {
    setLogs(prev => [...prev, { text, type }]);
  };

  const handleAttackClick = (attackId) => {
    if (mappedPairs[attackId] || isFinished) return;
    setSelectedAttack(attackId);

    if (selectedDefense) {
      evaluatePair(attackId, selectedDefense);
    }
  };

  const handleDefenseClick = (defenseId) => {
    if (Object.values(mappedPairs).includes(defenseId) || isFinished) return;
    setSelectedDefense(defenseId);

    if (selectedAttack) {
      evaluatePair(selectedAttack, defenseId);
    }
  };

  const evaluatePair = (attackId, defenseId) => {
    const isCorrect = correctMapping[attackId] === defenseId;

    if (isCorrect) {
      const updatedPairs = { ...mappedPairs, [attackId]: defenseId };
      setMappedPairs(updatedPairs);
      
      const attName = attacks.find(a => a.id === attackId).name;
      const defName = defenses.find(d => d.id === defenseId).name;
      addLog(`[VÍNCULO CORRECTO]: "${attName}" mitigado con "${defName}".`, 'success');

      // Si conectó las 3
      if (Object.keys(updatedPairs).length === 3) {
        setTimeout(() => {
          if (!isAlreadyCompleted) {
            completeMission('mission_mapper');
            updateXP(100);
            addLog('>> ¡TODOS LOS CONTROLES MAPEADOS CORRECTAMENTE! (+100 XP)', 'success');
          } else {
            addLog('>> Mitigación completada con éxito (Bono de XP ya cobrado).', 'info');
          }
        }, 300);
      }
    } else {
      setErrorFlash(true);
      updateXP(-25);
      
      const attName = attacks.find(a => a.id === attackId).name;
      const defName = defenses.find(d => d.id === defenseId).name;
      addLog(`[FALLO DE MITIGACIÓN]: "${attName}" no se detiene con "${defName}". Penalizando.`, 'error');

      setTimeout(() => {
        setErrorFlash(false);
      }, 500);
    }

    setSelectedAttack(null);
    setSelectedDefense(null);
  };

  const handleReset = () => {
    setMappedPairs({});
    setSelectedAttack(null);
    setSelectedDefense(null);
    setErrorFlash(false);
    setLogs([
      { text: '[MAPPER STATUS: AGENTE DE INTEGRACIÓN INTEGRITY CONTROL ACTIVE]', type: 'info' },
      { text: '>> Consigna: Seleccione un vector de ataque y luego su control defensivo de mitigación correcto.', type: 'warning' }
    ]);
  };

  return (
    <div className={`cyber-card glow ${errorFlash ? 'red-team' : ''}`} style={{ flex: 1, borderTop: '4px solid var(--theme-color)', padding: '20px' }}>
      
      {/* Cabecera */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '15px' }}>
        <div style={{ fontFamily: 'var(--font-display)', color: 'var(--theme-color)', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
          🟣 PURPLE_LAB_01: MAPEADOR DE ATAQUE Y DEFENSA
        </div>
        <div style={{ fontSize: '0.75rem', color: isAlreadyCompleted || isFinished ? 'var(--neon-green)' : 'var(--neon-yellow)', textTransform: 'uppercase', fontWeight: 'bold' }}>
          {isAlreadyCompleted || isFinished ? '[ CONTROLES LISTOS ]' : '[ POR MITIGAR ]'}
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: '#a0aec0', marginBottom: '16px', lineHeight: '1.4' }}>
        Como operador de Purple Team, debes mapear e implementar las defensas correctas para neutralizar cada vector de ataque detectado en los sistemas perimetrales de la UNASAM.
      </p>

      {/* Tablero */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '20px' }}>
        
        {/* Ataques */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ color: 'var(--theme-color)', fontSize: '0.7rem', fontFamily: 'var(--font-display)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px', textAlign: 'center' }}>
            [ VECTOR DE ENTRADA ]
          </div>
          {attacks.map((att) => {
            const isConnected = !!mappedPairs[att.id];
            const isSelected = selectedAttack === att.id;

            let borderStyle = 'rgba(255, 255, 255, 0.1)';
            if (isConnected) {
              borderStyle = 'var(--neon-green)';
            } else if (isSelected) {
              borderStyle = 'var(--theme-color)';
            }

            return (
              <div
                key={att.id}
                onClick={() => handleAttackClick(att.id)}
                className="cyber-card"
                style={{
                  cursor: isConnected ? 'default' : 'pointer',
                  padding: '12px 14px',
                  background: isConnected ? 'rgba(5, 255, 161, 0.05)' : isSelected ? 'rgba(0, 240, 255, 0.05)' : 'rgba(10, 10, 15, 0.8)',
                  borderColor: borderStyle,
                  borderLeftWidth: '3px',
                  opacity: isConnected ? 0.75 : 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 'bold', color: isConnected ? 'var(--neon-green)' : '#fff' }}>
                    {att.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#718096' }}>{att.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Defensas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ color: 'var(--theme-color)', fontSize: '0.7rem', fontFamily: 'var(--font-display)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px', textAlign: 'center' }}>
            [ CONTROL MITIGADOR ]
          </div>
          {defenses.map((def) => {
            const connectedAttackId = Object.keys(mappedPairs).find(key => mappedPairs[key] === def.id);
            const isConnected = !!connectedAttackId;
            const isSelected = selectedDefense === def.id;

            let borderStyle = 'rgba(255, 255, 255, 0.1)';
            if (isConnected) {
              borderStyle = 'var(--neon-green)';
            } else if (isSelected) {
              borderStyle = 'var(--theme-color)';
            }

            return (
              <div
                key={def.id}
                onClick={() => handleDefenseClick(def.id)}
                className="cyber-card"
                style={{
                  cursor: isConnected ? 'default' : 'pointer',
                  padding: '12px 14px',
                  background: isConnected ? 'rgba(5, 255, 161, 0.05)' : isSelected ? 'rgba(0, 240, 255, 0.05)' : 'rgba(10, 10, 15, 0.8)',
                  borderColor: borderStyle,
                  borderLeftWidth: '3px',
                  opacity: isConnected ? 0.75 : 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 'bold', color: isConnected ? 'var(--neon-green)' : '#fff' }}>
                    {def.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#718096' }}>{def.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Controladores */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--theme-color)', textTransform: 'uppercase', fontWeight: 'bold' }}>
          CONTROLES VINCULADOS: {Object.keys(mappedPairs).length} / 3
        </div>
        <button
          onClick={handleReset}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--neon-magenta)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          REINICIAR VÍNCULOS
        </button>
      </div>

      {/* Terminal de Logs */}
      <div>
        <div style={{ fontSize: '0.7rem', color: 'var(--theme-color)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 'bold' }}>
          📟 CORRELACIÓN DE CONTROLES CIBERSEC (PURPLE_CORRELATION)
        </div>
        <div className="cyber-terminal" style={{ height: '80px' }}>
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
export default AttackDefenseMapper;
