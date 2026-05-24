import React, { useState, useContext } from 'react';
import { GameContext } from '../../../context/GameContext';

export const LogAnalyzer = () => {
  const { updateXP, completeMission, completedMissions } = useContext(GameContext);

  // Definición de las líneas de logs del servidor
  const logLines = [
    { id: 1, text: '[2026-05-24T00:45:01] INFO: Connection established successfully on port 80 from IP 10.0.2.15', isAttack: false },
    { id: 2, text: '[2026-05-24T00:45:10] INFO: User "student_gz7" logged in from local subnet 10.0.2.22', isAttack: false },
    { id: 3, text: '[2026-05-24T00:45:12] WARNING: Privilege escalation detected from IP 192.168.10.42 on host mainframe', isAttack: true, name: 'Escalada de Privilegios' },
    { id: 4, text: '[2026-05-24T00:45:18] INFO: Database transaction completed successfully (commit: ok)', isAttack: false },
    { id: 5, text: '[2026-05-24T00:45:25] INFO: DNS query resolved for campus.unasam.edu.pe in 12ms', isAttack: false },
    { id: 6, text: '[2026-05-24T00:45:33] ALERT: Brute force attack on port 22 (SSH) from external IP 203.0.113.88', isAttack: true, name: 'Fuerza Bruta SSH' },
    { id: 7, text: '[2026-05-24T00:45:41] INFO: Automated backup script finalized (32.4 GB synchronized)', isAttack: false }
  ];

  const [selectedIds, setSelectedIds] = useState([]);
  const [terminalLogs, setTerminalLogs] = useState([
    { text: '[LOG ANALYZER STATUS: PARSING HOST EVENT LOGS IN SECURE CONSOLE]', type: 'info' },
    { text: '>> Objetivo: Localice e identifique las 2 alertas críticas de ataque real haciendo clic en ellas.', type: 'warning' }
  ]);
  const [errorFlash, setErrorFlash] = useState(false);

  const isAlreadyCompleted = completedMissions.includes('mission_logs');
  
  // Total de ataques correctos identificados
  const correctlyIdentifiedCount = selectedIds.filter(id => logLines.find(l => l.id === id).isAttack).length;
  const isFinished = correctlyIdentifiedCount === 2;

  const addTerminalLog = (text, type) => {
    setTerminalLogs(prev => [...prev, { text, type }]);
  };

  const handleLineClick = (line) => {
    // Si ya terminó, salir
    if (isFinished) return;

    // Si ya está seleccionada, ignorar
    if (selectedIds.includes(line.id)) return;

    if (line.isAttack) {
      // Acierto
      const newSelected = [...selectedIds, line.id];
      setSelectedIds(newSelected);
      updateXP(50);
      
      addTerminalLog(`>> [CRITICAL LOG FLAGGED]: ALERTA DE SEGURIDAD DETECTADA: ${line.name.toUpperCase()} (+50 XP)`, 'success');

      // Si identificó ambos
      if (newSelected.filter(id => logLines.find(l => l.id === id).isAttack).length === 2) {
        addTerminalLog('>> [ANALYSIS SUCCESSFUL]: TODOS LOS VECTORES DE INTRUSIÓN CAPTURADOS.', 'success');
        setTimeout(() => {
          if (!isAlreadyCompleted) {
            completeMission('mission_logs');
            addTerminalLog('>> SISTEMA: Misión Analizador de Logs Registrada en el Mainframe.', 'info');
          }
        }, 300);
      }
    } else {
      // Error
      setErrorFlash(true);
      setTimeout(() => setErrorFlash(false), 500);
      
      updateXP(-20);
      addTerminalLog(`>> [FALSO POSITIVO DETECTADO]: Log normal no malicioso de sistema. (-20 XP)`, 'error');
    }
  };

  const handleResetGame = () => {
    setSelectedIds([]);
    setTerminalLogs([
      { text: '[LOG ANALYZER STATUS: PARSING HOST EVENT LOGS IN SECURE CONSOLE]', type: 'info' },
      { text: '>> Objetivo: Localice e identifique las 2 alertas críticas de ataque real haciendo clic en ellas.', type: 'warning' }
    ]);
  };

  return (
    <div className={`cyber-card glow ${errorFlash ? 'red-team' : ''}`} style={{ flex: 1, borderTop: '4px solid var(--theme-color)', padding: '20px' }}>
      
      {/* Cabecera */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '15px' }}>
        <div style={{ fontFamily: 'var(--font-display)', color: 'var(--theme-color)', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
          🔵 BLUE_LAB_03: ANALIZADOR DE REGISTROS DE SERVIDOR (LOG ANALYZER)
        </div>
        <div style={{ fontSize: '0.75rem', color: isAlreadyCompleted || isFinished ? 'var(--neon-green)' : 'var(--neon-yellow)', textTransform: 'uppercase', fontWeight: 'bold' }}>
          {isAlreadyCompleted || isFinished ? '[ INMUNIZADO ]' : '[ INSPECCIONANDO ]'}
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: '#a0aec0', marginBottom: '16px', lineHeight: '1.4' }}>
        El SOC perimetral del stand reporta anomalías. Inspecciona la cola de Syslog e identifica haciendo clic de forma directa sobre las 2 entradas que representen brechas cibernéticas activas.
      </p>

      {/* Visor de Consola de Logs Interactiva */}
      <div style={{ background: '#020204', border: '1px solid #1a1a24', borderRadius: '4px', padding: '12px', margin: '20px 0', overflowX: 'auto', boxShadow: 'inset 0 0 15px rgba(0,0,0,0.9)' }}>
        <div style={{ color: 'var(--theme-color)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px', marginBottom: '10px' }}>
          console@unasam-soc:~# cat /var/log/auth.log
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '600px' }}>
          {logLines.map((line) => {
            const isSelected = selectedIds.includes(line.id);
            const isExpected = line.isAttack;

            let lineStyle = {
              cursor: isFinished ? 'default' : 'pointer',
              padding: '6px 10px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              borderRadius: '2px',
              background: 'transparent',
              borderLeft: '2px solid transparent',
              transition: 'all 0.15s ease'
            };

            if (isSelected) {
              lineStyle.background = 'rgba(5, 255, 161, 0.12)';
              lineStyle.borderColor = 'var(--neon-green)';
              lineStyle.color = 'var(--neon-green)';
            }

            return (
              <div
                key={line.id}
                onClick={() => handleLineClick(line)}
                style={lineStyle}
                onMouseEnter={(e) => {
                  if (!isSelected && !isFinished) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected && !isFinished) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
              >
                {line.text}
              </div>
            );
          })}
        </div>
      </div>

      {/* Controladores */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--theme-color)', textTransform: 'uppercase', fontWeight: 'bold' }}>
          ALERTAS HALLADAS: {correctlyIdentifiedCount} / 2
        </div>
        <button
          onClick={handleResetGame}
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
          REINICIAR ANÁLISIS
        </button>
      </div>

      {/* Terminal de Logs */}
      <div>
        <div style={{ fontSize: '0.7rem', color: 'var(--theme-color)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 'bold' }}>
          📟 ALERTAS DEL ANALIZADOR SOC (SOC_ANALYSIS_DUMP)
        </div>
        <div className="cyber-terminal" style={{ height: '95px' }}>
          {terminalLogs.map((log, index) => (
            <div key={index} className={`terminal-line ${log.type}`}>
              {log.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default LogAnalyzer;
