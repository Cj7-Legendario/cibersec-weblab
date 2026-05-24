import React, { useState, useEffect, useContext } from 'react';
import { GameContext } from '../../../context/GameContext';

export const PayloadBuilder = () => {
  const { updateXP, completeMission, completedMissions } = useContext(GameContext);

  // Bloques y secuencia correcta
  const correctSequence = ["<script>", "alert(", "1", ")", "</script>"];
  const [shuffledBlocks, setShuffledBlocks] = useState([]);
  const [builtChain, setBuiltChain] = useState([]);
  const [logs, setLogs] = useState([
    { text: '[XSS BUILDER STATUS: DISPOSITIVO ESPERANDO COMPILACIÓN DE EXPLOIT]', type: 'info' },
    { text: '>> Objetivo: Construir un script Cross-Site Scripting básico seleccionando los bloques correctos.', type: 'warning' }
  ]);
  const [errorFlash, setErrorFlash] = useState(false);

  // Barajar los bloques
  const shuffleBlocks = () => {
    const blocks = ["alert(", "</script>", "1", "<script>", ")"];
    for (let i = blocks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
    }
    setShuffledBlocks(blocks);
  };

  useEffect(() => {
    shuffleBlocks();
  }, []);

  const isAlreadyCompleted = completedMissions.includes('mission_payload');

  const addLog = (text, type) => {
    setLogs(prev => [...prev, { text, type }]);
  };

  const handleBlockClick = (block) => {
    // Si ya completó, salir
    if (builtChain.length === correctSequence.length) return;

    const nextIndex = builtChain.length;
    const expectedBlock = correctSequence[nextIndex];

    if (block === expectedBlock) {
      // Correcto
      const updatedChain = [...builtChain, block];
      setBuiltChain(updatedChain);
      addLog(`>> ACOPLADO BLOQUE: "${block}" [STATUS: OK]`, 'success');

      // Si se completó el payload completo
      if (updatedChain.length === correctSequence.length) {
        addLog(`>> PAYLOAD FINAL CONSTRUIDO: ${updatedChain.join('')}`, 'success');
        addLog('>> [STATUS: ATTACK VECTOR LOADED] - INYECTANDO XSS EN CLIENTE...', 'success');
        
        setTimeout(() => {
          addLog('>> [BYPASS SUCCESS]: VENTANA POPUP DE EJECUCIÓN DETECTADA.', 'success');
          if (!isAlreadyCompleted) {
            updateXP(100);
            completeMission('mission_payload');
            addLog('>> SISTEMA: Bonificación otorgada: +100 XP y Misión Payload Registrada.', 'info');
          } else {
            addLog('>> SISTEMA: Laboratorio ya resuelto. No se acumula XP adicional.', 'info');
          }
        }, 500);
      }
    } else {
      // Incorrecto
      setErrorFlash(true);
      setTimeout(() => setErrorFlash(false), 500);
      
      addLog(`>> [CRITICAL BUG]: ERROR DE SINTAXIS. BLOQUE INYECTADO: "${block}". SE ESPERABA: "${expectedBlock}".`, 'error');
      addLog('>> SISTEMA: Cadena rota. Limpiando búfer de exploit... recargando.', 'error');
      
      // Limpiar cadena
      setBuiltChain([]);
      shuffleBlocks();
    }
  };

  const handleResetGame = () => {
    setBuiltChain([]);
    shuffleBlocks();
    setLogs([
      { text: '[XSS BUILDER STATUS: DISPOSITIVO ESPERANDO COMPILACIÓN DE EXPLOIT]', type: 'info' },
      { text: '>> Objetivo: Construir un script Cross-Site Scripting básico seleccionando los bloques correctos.', type: 'warning' }
    ]);
  };

  return (
    <div className={`cyber-card glow ${errorFlash ? 'red-team' : ''}`} style={{ flex: 1, borderTop: '4px solid var(--theme-color)', padding: '20px' }}>
      
      {/* Cabecera */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '15px' }}>
        <div style={{ fontFamily: 'var(--font-display)', color: 'var(--theme-color)', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
          🔴 RED_LAB_03: CONSTRUCTOR DE PAYLOADS XSS
        </div>
        <div style={{ fontSize: '0.75rem', color: isAlreadyCompleted || builtChain.length === correctSequence.length ? 'var(--neon-green)' : 'var(--neon-yellow)', textTransform: 'uppercase', fontWeight: 'bold' }}>
          {isAlreadyCompleted || builtChain.length === correctSequence.length ? '[ EXPLOIT COMPILADO ]' : '[ COMPILANDO ]'}
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: '#a0aec0', marginBottom: '16px', lineHeight: '1.4' }}>
        Las entradas del foro del stand son vulnerables a Cross-Site Scripting. Reordena y enlaza los bloques sintácticos del script de alerta para evadir los filtros WAF en caliente.
      </p>

      {/* Cadena construida visualmente */}
      <div style={{ background: '#020204', border: '1px solid #1a1a24', padding: '16px', borderRadius: '4px', display: 'flex', gap: '8px', minHeight: '60px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
        <span style={{ color: '#4a5568', fontSize: '0.75rem', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginRight: '8px' }}>
          BUFFER:
        </span>
        {builtChain.length === 0 ? (
          <span style={{ color: '#4a5568', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>[ BÚFER DE EXPLOIT VACÍO - SELECCIONE BLOQUES ]</span>
        ) : (
          builtChain.map((blk, idx) => (
            <span
              key={idx}
              style={{
                background: 'rgba(255, 42, 109, 0.1)',
                border: '1px solid var(--neon-magenta)',
                color: '#fff',
                padding: '4px 10px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                borderRadius: '2px',
                textShadow: '0 0 4px var(--neon-magenta)'
              }}
            >
              {blk}
            </span>
          ))
        )}
      </div>

      {/* Botones de bloques barajados */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '20px' }}>
        {shuffledBlocks.map((block, idx) => {
          // El botón se deshabilita si es que el bloque ya fue inyectado (para obligar selección secuencial limpia sin duplicar si ya se inyectó)
          // Pero el usuario puede cliquear los mismos si es parte de la cadena, sin embargo en esta cadena todos son únicos.
          const isUsed = builtChain.includes(block);

          return (
            <button
              key={idx}
              type="button"
              disabled={isUsed || builtChain.length === correctSequence.length}
              onClick={() => handleBlockClick(block)}
              className="cyber-btn btn-magenta"
              style={{
                fontFamily: 'var(--font-mono)',
                textTransform: 'none',
                fontSize: '0.95rem',
                padding: '8px 16px',
                borderColor: isUsed ? '#4a5568' : 'var(--neon-magenta)',
                color: isUsed ? '#4a5568' : '#fff',
                opacity: isUsed ? 0.3 : 1
              }}
            >
              {block}
            </button>
          );
        })}
      </div>

      {/* Controladores */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--theme-color)', textTransform: 'uppercase', fontWeight: 'bold' }}>
          PROGRESO EN CADENA: {builtChain.length} / 5
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
          RESETEAR BÚFER
        </button>
      </div>

      {/* Terminal de logs */}
      <div>
        <div style={{ fontSize: '0.7rem', color: 'var(--theme-color)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 'bold' }}>
          📟 SALIDA DE CARGA ÚTIL (EXPLOIT_CONSTRUCT)
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
export default PayloadBuilder;
