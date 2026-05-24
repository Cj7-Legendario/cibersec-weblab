import React, { useState, useContext } from 'react';
import { GameContext } from '../../../context/GameContext';

export const ReportBuilder = () => {
  const { nickname, updateXP, completeMission, completedMissions } = useContext(GameContext);

  // Estados de los campos del formulario táctico
  const [vulnerability, setVulnerability] = useState('');
  const [impact, setImpact] = useState('');
  const [priority, setPriority] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedHash, setGeneratedHash] = useState('');
  const [logs, setLogs] = useState([
    { text: '[REPORT BUILDER STATUS: AUDITING SYSTEM CONNECTED]', type: 'info' },
    { text: '>> Consigna: Formule su reporte de auditoría táctico seleccionando los campos requeridos.', type: 'warning' }
  ]);

  const isAlreadyCompleted = completedMissions.includes('mission_report');

  const addLog = (text, type) => {
    setLogs(prev => [...prev, { text, type }]);
  };

  const handleGenerateReport = (e) => {
    e.preventDefault();
    if (!vulnerability || !impact || !priority) {
      addLog('>> [ALERTA]: Todos los campos de auditoría del formulario son de registro obligatorio.', 'warning');
      return;
    }

    setIsSuccess(true);
    
    // Generar un hash hexadecimal simulado en caliente
    const simulatedHash = 'SHA256_' + Math.random().toString(36).substring(2, 10).toUpperCase() + Math.random().toString(36).substring(2, 10).toUpperCase();
    setGeneratedHash(simulatedHash);

    addLog('>> [COMPILANDO REPORTE DE INCIDENTE]: Auditoría oficial...', 'info');
    
    setTimeout(() => {
      addLog(`>> VULNERABILIDAD DOCUMENTADA: ${vulnerability.toUpperCase()}`, 'info');
      addLog(`>> NIVEL DE IMPACTO DE NEGOCIO: ${impact.toUpperCase()}`, 'info');
      addLog(`>> PRIORIDAD DE PARCHEO DECLARADA: ${priority.toUpperCase()}`, 'info');
    }, 300);

    setTimeout(() => {
      addLog(`>> [FIRMA DE AUDITOR INTEGRADA]: OPERADOR "${nickname.toUpperCase()}"`, 'success');
      addLog(`>> HASH GENERADO: ${simulatedHash}`, 'success');
    }, 700);

    setTimeout(() => {
      addLog('>> [STATUS: AUDIT COMPLETE] - REPORTE DE SEGURIDAD ALMACENADO CORRECTAMENTE.', 'success');
      if (!isAlreadyCompleted) {
        completeMission('mission_report');
        updateXP(100);
        addLog('>> SISTEMA: Bonificación otorgada: +100 XP y Misión Reporte Registrada.', 'info');
      } else {
        addLog('>> SISTEMA: Laboratorio ya resuelto. No se acumula XP adicional.', 'info');
      }
    }, 1200);
  };

  const handleReset = () => {
    setVulnerability('');
    setImpact('');
    setPriority('');
    setIsSuccess(false);
    setGeneratedHash('');
    setLogs([
      { text: '[REPORT BUILDER STATUS: AUDITING SYSTEM CONNECTED]', type: 'info' },
      { text: '>> Consigna: Formule su reporte de auditoría táctico seleccionando los campos requeridos.', type: 'warning' }
    ]);
  };

  return (
    <div className="cyber-card glow" style={{ flex: 1, borderTop: '4px solid var(--theme-color)', padding: '20px' }}>
      
      {/* Cabecera */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '15px' }}>
        <div style={{ fontFamily: 'var(--font-display)', color: 'var(--theme-color)', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
          🟣 PURPLE_LAB_03: GENERADOR DE INFORMES DE SEGURIDAD (REPORT BUILDER)
        </div>
        <div style={{ fontSize: '0.75rem', color: isAlreadyCompleted || isSuccess ? 'var(--neon-green)' : 'var(--neon-yellow)', textTransform: 'uppercase', fontWeight: 'bold' }}>
          {isAlreadyCompleted || isSuccess ? '[ FIRMADO ]' : '[ POR REDACTAR ]'}
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: '#a0aec0', marginBottom: '16px', lineHeight: '1.4' }}>
        Para documentar la postura ante riesgos del campus, compila y firma el reporte formal clasificando la brecha, determinando el impacto de negocio en la UNASAM y asignando su nivel de urgencia.
      </p>

      {/* Formulario de selección por botones */}
      <form onSubmit={handleGenerateReport} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
        
        {/* Selector 1: Vulnerability */}
        <div>
          <label className="cyber-label" style={{ fontSize: '0.65rem' }}>1. Vulnerabilidad Identificada</label>
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            {['Inyección SQL (SQLi)', 'Phishing por Correo', 'Fuerza Bruta SSH'].map((vuln) => {
              const active = vulnerability === vuln;
              return (
                <button
                  key={vuln}
                  type="button"
                  disabled={isSuccess}
                  onClick={() => setVulnerability(vuln)}
                  className="cyber-btn"
                  style={{
                    flex: 1,
                    fontSize: '0.75rem',
                    padding: '8px 10px',
                    borderColor: active ? 'var(--theme-color)' : 'rgba(255,255,255,0.1)',
                    background: active ? 'rgba(157, 78, 237, 0.15)' : 'transparent',
                    color: active ? '#fff' : '#718096'
                  }}
                >
                  {vuln}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selector 2: Impact */}
        <div>
          <label className="cyber-label" style={{ fontSize: '0.65rem' }}>2. Impacto de Negocio en UNASAM</label>
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            {['Alto (Fuga Crítica)', 'Medio (Servicio Local)', 'Bajo (Informativo)'].map((imp) => {
              const active = impact === imp;
              return (
                <button
                  key={imp}
                  type="button"
                  disabled={isSuccess}
                  onClick={() => setImpact(imp)}
                  className="cyber-btn"
                  style={{
                    flex: 1,
                    fontSize: '0.75rem',
                    padding: '8px 10px',
                    borderColor: active ? 'var(--theme-color)' : 'rgba(255,255,255,0.1)',
                    background: active ? 'rgba(157, 78, 237, 0.15)' : 'transparent',
                    color: active ? '#fff' : '#718096'
                  }}
                >
                  {imp}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selector 3: Priority */}
        <div>
          <label className="cyber-label" style={{ fontSize: '0.65rem' }}>3. Prioridad de Parcheo Requerida</label>
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            {['Crítica (Parche en Caliente)', 'Alta (Próximo Sprint)', 'Media (Auditoría Rutinaria)'].map((prio) => {
              const active = priority === prio;
              return (
                <button
                  key={prio}
                  type="button"
                  disabled={isSuccess}
                  onClick={() => setPriority(prio)}
                  className="cyber-btn"
                  style={{
                    flex: 1,
                    fontSize: '0.75rem',
                    padding: '8px 10px',
                    borderColor: active ? 'var(--theme-color)' : 'rgba(255,255,255,0.1)',
                    background: active ? 'rgba(157, 78, 237, 0.15)' : 'transparent',
                    color: active ? '#fff' : '#718096'
                  }}
                >
                  {prio}
                </button>
              );
            })}
          </div>
        </div>

        {/* Acciones */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
          <button
            type="submit"
            disabled={!vulnerability || !impact || !priority || isSuccess}
            className="cyber-btn glow"
            style={{
              flex: 1,
              padding: '10px 14px',
              borderColor: !vulnerability || !impact || !priority || isSuccess ? '#4a5568' : 'var(--theme-color)',
              color: !vulnerability || !impact || !priority || isSuccess ? '#4a5568' : '#fff'
            }}
          >
            GENERAR INFORME Y FIRMAR HASH
          </button>
          
          {isSuccess && (
            <button
              type="button"
              className="cyber-btn btn-magenta"
              onClick={handleReset}
              style={{ padding: '10px 14px' }}
            >
              NUEVO REPORTE
            </button>
          )}
        </div>
      </form>

      {/* Visualizador de HASH si se completó */}
      {isSuccess && generatedHash && (
        <div style={{ background: 'rgba(5, 255, 161, 0.05)', border: '1px solid var(--neon-green)', padding: '10px 14px', borderRadius: '4px', marginBottom: '20px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>🧾 DOCUMENT_HASH: <span style={{ color: 'var(--neon-green)', textShadow: '0 0 4px var(--neon-green)' }}>{generatedHash}</span></span>
        </div>
      )}

      {/* Terminal */}
      <div>
        <div style={{ fontSize: '0.7rem', color: 'var(--theme-color)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 'bold' }}>
          📟 COMPILADOR DE INFORMES CIBERSEC (REPORT_COMPILER)
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
export default ReportBuilder;
