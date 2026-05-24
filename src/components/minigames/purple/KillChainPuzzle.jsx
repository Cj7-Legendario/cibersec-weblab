import React, { useState, useEffect, useContext } from 'react';
import { GameContext } from '../../../context/GameContext';

export const KillChainPuzzle = () => {
  const { updateXP, completeMission, completedMissions } = useContext(GameContext);

  const correctOrder = ["Reconocimiento", "Acceso Inicial", "Persistencia", "Exfiltración"];
  const [sourceItems, setSourceItems] = useState([]);
  const [targetItems, setTargetItems] = useState([]);
  const [logs, setLogs] = useState([
    { text: '[KILL CHAIN PUZZLE STATUS: CYBER KILL CHAIN ANALYSIS ACTIVE]', type: 'info' },
    { text: '>> Consigna: Ordene las 4 fases fundamentales del ciclo de vida del ataque cibernético.', type: 'warning' }
  ]);
  const [errorFlash, setErrorFlash] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Inicializar y barajar elementos
  const initPuzzle = () => {
    const scrambled = ["Persistencia", "Reconocimiento", "Exfiltración", "Acceso Inicial"];
    setSourceItems(scrambled);
    setTargetItems([]);
    setIsSuccess(false);
  };

  useEffect(() => {
    initPuzzle();
  }, []);

  const isAlreadyCompleted = completedMissions.includes('mission_killchain');

  const addLog = (text, type) => {
    setLogs(prev => [...prev, { text, type }]);
  };

  // Mover elemento de izquierda a derecha (añadir al orden)
  const handleAddToTarget = (item) => {
    if (isSuccess) return;
    setSourceItems(prev => prev.filter(i => i !== item));
    setTargetItems(prev => [...prev, item]);
  };

  // Mover elemento de derecha a izquierda (remover del orden)
  const handleRemoveFromTarget = (item) => {
    if (isSuccess) return;
    setTargetItems(prev => prev.filter(i => i !== item));
    setSourceItems(prev => [...prev, item]);
  };

  // Validar secuencia
  const handleValidate = () => {
    if (targetItems.length < 4) {
      addLog('>> [ALERTA]: Debes mover las 4 fases al bloque táctico de ordenamiento.', 'warning');
      return;
    }

    const isValid = targetItems.every((item, idx) => item === correctOrder[idx]);

    if (isValid) {
      setIsSuccess(true);
      setErrorGlow(false);
      addLog('>> [VALIDACIÓN EXITOSA]: Secuencia Cyber Kill Chain correcta.', 'success');
      addLog(`>> ORDEN: ${targetItems.join(' ──> ')}`, 'success');
      
      setTimeout(() => {
        if (!isAlreadyCompleted) {
          completeMission('mission_killchain');
          updateXP(100);
          addLog('>> SISTEMA: Bonificación otorgada: +100 XP y Misión Kill Chain Registrada.', 'info');
        } else {
          addLog('>> SISTEMA: Laboratorio ya resuelto. No se acumula XP adicional.', 'info');
        }
      }, 300);
    } else {
      setErrorFlash(true);
      updateXP(-25);
      addLog('>> [VALIDACIÓN INCORRECTA]: La secuencia lógica de ataque tiene incoherencias.', 'error');
      addLog(`>> FALLÓ EN EL ORDEN: ${targetItems.join(' ──> ')}`, 'error');
      addLog('>> SISTEMA: Penalización aplicada: -25 XP. Reiniciando bloques.', 'error');

      setTimeout(() => {
        setErrorFlash(false);
        initPuzzle();
      }, 800);
    }
  };

  // Soporte para compatibilidad con setErrorGlow
  const setErrorGlow = (val) => {};

  return (
    <div className={`cyber-card glow ${errorFlash ? 'red-team' : ''}`} style={{ flex: 1, borderTop: '4px solid var(--theme-color)', padding: '20px' }}>
      
      {/* Cabecera */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '15px' }}>
        <div style={{ fontFamily: 'var(--font-display)', color: 'var(--theme-color)', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
          🟣 PURPLE_LAB_02: SECUENCIADOR DE CYBER KILL CHAIN
        </div>
        <div style={{ fontSize: '0.75rem', color: isAlreadyCompleted || isSuccess ? 'var(--neon-green)' : 'var(--neon-yellow)', textTransform: 'uppercase', fontWeight: 'bold' }}>
          {isAlreadyCompleted || isSuccess ? '[ ORDENADO ]' : '[ POR ORDENAR ]'}
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: '#a0aec0', marginBottom: '16px', lineHeight: '1.4' }}>
        Para auditar una intrusión en caliente, un operador de Purple Team debe ordenar cronológicamente las fases de ataque del adversario dentro de la Cyber Kill Chain de la UNASAM.
      </p>

      {/* Visor de Bloques del Puzzle */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', margin: '20px 0' }}>
        
        {/* Bloque Izquierdo: Fases Libres */}
        <div className="cyber-card" style={{ padding: '12px', background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.03)' }}>
          <div style={{ color: '#718096', fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 'bold', textAlign: 'center' }}>
            [ FASES DISPONIBLES ]
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '180px' }}>
            {sourceItems.length === 0 && !isSuccess && (
              <div style={{ color: '#4a5568', fontSize: '0.75rem', textAlign: 'center', marginTop: '40px' }}>
                [ TODOS LOS BLOQUES COLOCADOS ]
              </div>
            )}
            {sourceItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleAddToTarget(item)}
                className="cyber-card"
                style={{
                  cursor: 'pointer',
                  padding: '10px 14px',
                  background: 'rgba(15, 15, 25, 0.9)',
                  borderColor: 'rgba(255,255,255,0.06)',
                  textAlign: 'center',
                  fontSize: '0.8rem',
                  color: '#fff',
                  borderLeftWidth: '3px',
                  borderLeftColor: 'var(--theme-color)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--theme-color)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Bloque Derecho: Secuencia Propuesta */}
        <div className="cyber-card" style={{ padding: '12px', background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.03)' }}>
          <div style={{ color: 'var(--neon-green)', fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 'bold', textAlign: 'center' }}>
            [ SECUENCIA CRONOLÓGICA PROPUESTA ]
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '180px' }}>
            {targetItems.length === 0 && (
              <div style={{ color: '#4a5568', fontSize: '0.75rem', textAlign: 'center', marginTop: '40px' }}>
                [ HAZ CLIC A LA IZQUIERDA PARA AGREGAR ]
              </div>
            )}
            {targetItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleRemoveFromTarget(item)}
                className="cyber-card"
                style={{
                  cursor: isSuccess ? 'default' : 'pointer',
                  padding: '10px 14px',
                  background: 'rgba(5, 255, 161, 0.05)',
                  borderColor: 'var(--neon-green)',
                  textAlign: 'center',
                  fontSize: '0.8rem',
                  color: '#fff',
                  display: 'flex',
                  justifyContent: 'between',
                  alignItems: 'center'
                }}
              >
                <span style={{ color: 'var(--neon-green)', fontWeight: 'bold', marginRight: '6px' }}>
                  Fase {idx + 1}:
                </span>
                <span style={{ flex: 1 }}>{item}</span>
                {!isSuccess && <span style={{ color: 'var(--neon-magenta)', fontSize: '0.7rem' }}>✖</span>}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Controladores */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
        <button
          type="button"
          onClick={handleValidate}
          disabled={targetItems.length < 4 || isSuccess}
          className="cyber-btn"
          style={{
            flex: 1,
            padding: '10px 14px',
            borderColor: targetItems.length < 4 || isSuccess ? '#4a5568' : 'var(--theme-color)',
            color: targetItems.length < 4 || isSuccess ? '#4a5568' : '#fff'
          }}
        >
          VALIDAR SECUENCIA TÁCTICA
        </button>
        
        <button
          type="button"
          onClick={initPuzzle}
          className="cyber-btn btn-magenta"
          style={{ padding: '10px 14px' }}
        >
          LIMPIAR
        </button>
      </div>

      {/* Terminal */}
      <div>
        <div style={{ fontSize: '0.7rem', color: 'var(--theme-color)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 'bold' }}>
          📟 HUELLA CRONOLÓGICA (KILL_CHAIN_PUZZLE_LOGS)
        </div>
        <div className="cyber-terminal" style={{ height: '70px' }}>
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
export default KillChainPuzzle;
