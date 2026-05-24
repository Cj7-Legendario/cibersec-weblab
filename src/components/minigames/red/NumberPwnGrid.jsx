import React, { useState, useEffect, useContext } from 'react';
import { GameContext } from '../../../context/GameContext';

export const NumberPwnGrid = () => {
  const { updateXP, completeMission, completedMissions } = useContext(GameContext);

  const [numbers, setNumbers] = useState([]);
  const [nextExpected, setNextExpected] = useState(1);
  const [clickedNumbers, setClickedNumbers] = useState([]);
  const [pwnLogs, setPwnLogs] = useState([
    { text: '[PWN GRID STATUS: MEMORY BLOCK INITIALIZED]', type: 'info' },
    { text: '>> Consigna: Bypass secuencial. Presione del 1 al 9 en orden estrictamente ascendente.', type: 'warning' }
  ]);
  const [errorFlash, setErrorFlash] = useState(false);

  // Mezclar los números del 1 al 9 aleatoriamente
  const shuffleGrid = () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setNumbers(arr);
  };

  useEffect(() => {
    shuffleGrid();
  }, []);

  const isAlreadyCompleted = completedMissions.includes('mission_pwn_grid');

  const addLog = (text, type) => {
    setPwnLogs(prev => [...prev, { text, type }]);
  };

  const handleNumberClick = (num) => {
    // Si ya se resolvió la cuadrícula, no hacer nada
    if (nextExpected > 9) return;

    // Si el número ya fue presionado en esta secuencia, ignorar
    if (clickedNumbers.includes(num)) return;

    if (num === nextExpected) {
      // Click correcto
      const updatedClicked = [...clickedNumbers, num];
      setClickedNumbers(updatedClicked);
      setNextExpected(nextExpected + 1);
      
      addLog(`>> SECTOR_${num} CORRUPTO: MEMORIA LEÍDA CON ÉXITO`, 'success');

      // Si llegó al final (9)
      if (num === 9) {
        addLog('>> [STATUS: PWN SUCCESSFUL] - CADENA DE MEMORIA SECUENCIAL CONTROLADA.', 'success');
        if (!isAlreadyCompleted) {
          updateXP(100);
          completeMission('mission_pwn_grid');
          addLog('>> SISTEMA: Bonificación otorgada: +100 XP y Misión Pwn Grid Registrada.', 'info');
        } else {
          addLog('>> SISTEMA: Laboratorio ya resuelto. No se acumula XP adicional.', 'info');
        }
      }
    } else {
      // Click incorrecto
      setErrorFlash(true);
      setTimeout(() => setErrorFlash(false), 500);
      
      addLog(`>> [CRITICAL FAULT] - PRESIONADO SECTOR_${num}. SE ESPERABA SECTOR_${nextExpected}.`, 'error');
      addLog('>> SISTEMA: Secuencia de memoria rota. Barajando y penalizando.', 'error');
      
      updateXP(-25);
      
      // Reiniciar progreso local
      setNextExpected(1);
      setClickedNumbers([]);
      shuffleGrid();
    }
  };

  const handleResetGame = () => {
    setNextExpected(1);
    setClickedNumbers([]);
    shuffleGrid();
    setPwnLogs([
      { text: '[PWN GRID STATUS: MEMORY BLOCK INITIALIZED]', type: 'info' },
      { text: '>> Consigna: Bypass secuencial. Presione del 1 al 9 en orden estrictamente ascendente.', type: 'warning' }
    ]);
  };

  return (
    <div className={`cyber-card glow ${errorFlash ? 'red-team' : ''}`} style={{ flex: 1, borderTop: '4px solid var(--theme-color)', padding: '20px' }}>
      
      {/* Cabecera del Lab */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '15px' }}>
        <div style={{ fontFamily: 'var(--font-display)', color: 'var(--theme-color)', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
          🔴 RED_LAB_02: SECUENCIADOR DE MEMORIA (PWN GRID)
        </div>
        <div style={{ fontSize: '0.75rem', color: isAlreadyCompleted || nextExpected > 9 ? 'var(--neon-green)' : 'var(--neon-yellow)', textTransform: 'uppercase', fontWeight: 'bold' }}>
          {isAlreadyCompleted || nextExpected > 9 ? '[ COMPLETADO ]' : '[ INCOMPLETO ]'}
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: '#a0aec0', marginBottom: '16px', lineHeight: '1.4' }}>
        Para saltarte las protecciones de espacio de direcciones aleatorio (ASLR), debes leer y sobreescribir los sectores lógicos de memoria del host en estricto orden ascendente del 1 al 9.
      </p>

      {/* Grid de Botones Neón */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', maxWidth: '360px', margin: '20px auto' }}>
        {numbers.map((num, idx) => {
          const isClicked = clickedNumbers.includes(num);
          const isFinished = nextExpected > 9;

          let btnColor = 'rgba(255, 255, 255, 0.15)';
          let bgStyle = 'rgba(10, 10, 15, 0.8)';
          if (isClicked || isFinished) {
            btnColor = 'var(--neon-magenta)';
            bgStyle = 'rgba(255, 42, 109, 0.15)';
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleNumberClick(num)}
              disabled={isFinished}
              className="cyber-btn"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                padding: '20px 0',
                border: `2px solid ${btnColor}`,
                color: isClicked || isFinished ? '#fff' : '#718096',
                background: bgStyle,
                boxShadow: isClicked || isFinished ? '0 0 10px rgba(255, 42, 109, 0.4)' : 'none',
                cursor: isFinished ? 'default' : 'pointer',
                clipPath: 'polygon(0 0, 80% 0, 100% 12px, 100% 100%, 0 100%)'
              }}
            >
              0{num}
            </button>
          );
        })}
      </div>

      {/* Controladores */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--theme-color)', textTransform: 'uppercase', fontWeight: 'bold' }}>
          SECUENCIA COMPLETADA: {nextExpected - 1} / 9
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
          REINICIAR MEMORIA
        </button>
      </div>

      {/* Terminal de Logs */}
      <div>
        <div style={{ fontSize: '0.7rem', color: 'var(--theme-color)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 'bold' }}>
          📟 VOLCADO DE BÚFER LÓGICO (PWN_DUMP)
        </div>
        <div className="cyber-terminal" style={{ height: '90px' }}>
          {pwnLogs.map((log, index) => (
            <div key={index} className={`terminal-line ${log.type}`}>
              {log.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default NumberPwnGrid;
