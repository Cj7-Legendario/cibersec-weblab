import React, { useState, useRef, useEffect, useContext } from 'react';
import { GameContext } from '../../../context/GameContext';

export const SQLInjectionLab = () => {
  const { updateXP, completeMission, completedMissions } = useContext(GameContext);

  const [payload, setPayload] = useState('');
  const [password, setPassword] = useState('*********'); // Simulado
  const [logs, setLogs] = useState([
    { text: '[MAINFRAME STATUS: INGRESE CREDENCIALES DE ADMINISTRACIÓN]', type: 'info' },
    { text: 'SQL QUERY: SELECT * FROM operators WHERE nickname = \'[NICKNAME]\' AND password = \'[PASS]\';', type: 'warning' }
  ]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorGlow, setErrorGlow] = useState(false);

  const logsEndRef = useRef(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Verificar si ya se completó la misión
  const isAlreadyCompleted = completedMissions.includes('mission_sqli');

  const addLog = (text, type) => {
    setLogs((prev) => [...prev, { text, type }]);
  };

  const handleLaunchAttack = (e) => {
    e.preventDefault();
    if (!payload.trim()) {
      addLog('>> [ERR: PAYLOAD VACÍO. ABORTANDO INYECCIÓN]', 'error');
      return;
    }

    addLog(`>> EJECUTANDO PAYLOAD INYECCIÓN: ${payload}`, 'info');

    // Sanitizar y validar payloads estrictamente
    const cleanPayload = payload.trim().replace(/\s+/g, ' ');
    const validPayloads = ["' OR '1'='1", "admin' --"];

    const isMatch = validPayloads.some(
      (valid) => cleanPayload.toLowerCase().includes(valid.toLowerCase())
    );

    if (isMatch) {
      setIsSuccess(true);
      setErrorGlow(false);
      
      addLog('>> [LOG: COMPILANDO SENTENCIA SQL MODIFICADA...]', 'warning');
      setTimeout(() => {
        addLog(`>> SQL MODIFIED: SELECT * FROM operators WHERE nickname = '' OR '1'='1' AND password = '${password}';`, 'warning');
      }, 300);
      
      setTimeout(() => {
        addLog('>> [STATUS: EVALUANDO SENTENCIA LOGICAL TRUTH... "1=1" COMPROBADO TRUE]', 'info');
      }, 700);

      setTimeout(() => {
        addLog('>> [STATUS: INVENTARIO DE BASE DE DATOS RETORNADO. REGISTRO CORRESPONDIENTE A ADMIN ENCONTRADO]', 'success');
      }, 1100);

      setTimeout(() => {
        addLog('>> [FIREWALL BYPASSED]: INTRUSIÓN EXITOSA. CONEXIÓN COMO ROOT ESTABLECIDA.', 'success');
        if (!isAlreadyCompleted) {
          updateXP(100); // 100 XP según especificación Fase 1.5
          completeMission('mission_sqli');
          addLog('>> SISTEMA: Bonificación otorgada: +100 XP y Misión SQLi Registrada.', 'info');
        } else {
          addLog('>> SISTEMA: Laboratorio ya resuelto. No se acumula XP adicional.', 'info');
        }
      }, 1500);

    } else {
      setErrorGlow(true);
      setTimeout(() => setErrorGlow(false), 800);
      
      addLog(`>> SQL QUERY EXECUTED: SELECT * FROM operators WHERE nickname = '${payload}' AND password = '${password}';`, 'warning');
      
      setTimeout(() => {
        addLog('>> [SQL ENGINE ERROR]: Syntax error or unhandled token near payload query structure.', 'error');
      }, 300);

      setTimeout(() => {
        addLog('>> [ALERT]: Intento de inicio de sesión denegado. Credenciales erróneas.', 'error');
        updateXP(-50);
        addLog('>> SISTEMA: Penalización por brecha errónea detectada: -50 XP.', 'error');
      }, 700);
    }
  };

  const handleResetLab = () => {
    setPayload('');
    setIsSuccess(false);
    setErrorGlow(false);
    setLogs([
      { text: '[MAINFRAME STATUS: INGRESE CREDENCIALES DE ADMINISTRACIÓN]', type: 'info' },
      { text: 'SQL QUERY: SELECT * FROM operators WHERE nickname = \'[NICKNAME]\' AND password = \'[PASS]\';', type: 'warning' }
    ]);
  };

  return (
    <div className={`cyber-card glow ${errorGlow ? 'red-team' : ''}`} style={{ flex: 1, borderTop: '4px solid var(--theme-color)', padding: '20px' }}>
      
      {/* Cabecera del Lab */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '15px' }}>
        <div style={{ fontFamily: 'var(--font-display)', color: 'var(--theme-color)', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
          🔴 RED_LAB_01: BYPASS DE AUTENTICACIÓN SQLi
        </div>
        <div style={{ fontSize: '0.75rem', color: isAlreadyCompleted ? 'var(--neon-green)' : 'var(--neon-yellow)', textTransform: 'uppercase', fontWeight: 'bold' }}>
          {isAlreadyCompleted ? '[ RESUELTO ]' : '[ INCOMPLETO ]'}
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: '#a0aec0', marginBottom: '16px', lineHeight: '1.4' }}>
        El portal del Firewall del stand está expuesto. Encuentra un bypass SQL de escape para saltar la validación y entrar como root.
      </p>

      {/* Consigna */}
      <div style={{ background: 'rgba(255, 42, 109, 0.04)', border: '1px dashed rgba(255, 42, 109, 0.2)', padding: '10px 14px', borderRadius: '4px', marginBottom: '20px', fontSize: '0.8rem' }}>
        <span style={{ color: 'var(--neon-magenta)', fontWeight: 'bold', textTransform: 'uppercase' }}>Consigna Ofensiva:</span>
        <div style={{ color: '#cbd5e0', marginTop: '4px' }}>
          Prueba inyectar: <code style={{ color: 'var(--neon-cyan)', background: 'rgba(0,0,0,0.3)', padding: '2px 6px' }}>' OR '1'='1</code> o <code style={{ color: 'var(--neon-cyan)', background: 'rgba(0,0,0,0.3)', padding: '2px 6px' }}>admin' --</code>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleLaunchAttack} style={{ marginBottom: '20px' }}>
        <div className="cyber-input-group">
          <label className="cyber-label" style={{ fontSize: '0.65rem' }}>Usuario / Payload SQLi</label>
          <input
            type="text"
            className="cyber-input"
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            disabled={isSuccess}
            placeholder="Introduce tu payload de inyección SQL"
            style={{ fontFamily: 'var(--font-mono)' }}
          />
        </div>

        <div className="cyber-input-group" style={{ opacity: 0.5 }}>
          <label className="cyber-label" style={{ fontSize: '0.65rem' }}>Contraseña (Cifrada del sistema)</label>
          <input
            type="text"
            className="cyber-input"
            value={password}
            disabled={true}
            style={{ letterSpacing: '3px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="submit"
            className="cyber-btn"
            disabled={isSuccess}
            style={{ flex: 1, padding: '10px 14px', borderColor: isSuccess ? '#718096' : 'var(--theme-color)', color: isSuccess ? '#718096' : '#fff' }}
          >
            INYECTAR CARGA ÚTIL
          </button>
          
          {isSuccess && (
            <button
              type="button"
              className="cyber-btn btn-magenta"
              onClick={handleResetLab}
              style={{ padding: '10px 14px' }}
            >
              REINICIAR LAB
            </button>
          )}
        </div>
      </form>

      {/* Terminal */}
      <div>
        <div style={{ fontSize: '0.7rem', color: 'var(--theme-color)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 'bold' }}>
          📟 REGISTRO DE CONEXIÓN DE BASE DE DATOS (SYS_LOGS)
        </div>
        <div className="cyber-terminal" style={{ height: '120px' }}>
          {logs.map((log, index) => (
            <div key={index} className={`terminal-line ${log.type}`}>
              {log.text}
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
};
export default SQLInjectionLab;
