import React, { useState, useContext } from 'react';
import { GameContext } from '../../context/GameContext';

export const WireConnectGame = () => {
  const { updateXP, completeMission, completedMissions } = useContext(GameContext);

  // Definición de puertos (Lado Izquierdo)
  const ports = [
    { id: '80', name: 'PORT_80 (HTTP)', desc: 'Servicio Web Plano' },
    { id: '443', name: 'PORT_443 (HTTPS)', desc: 'Servicio Web Cifrado' },
    { id: '22', name: 'PORT_22 (SSH)', desc: 'Acceso Consola Remota' },
    { id: '53', name: 'PORT_53 (DNS)', desc: 'Resolución de Nombres' }
  ];

  // Definición de reglas de firewall (Lado Derecho)
  const rules = [
    { id: 'drop', name: 'DROP_UNENCRYPTED', desc: 'Denegar tráfico sin cifrar' },
    { id: 'allow', name: 'ALLOW_SECURE_WEB', desc: 'Permitir tráfico TLS/SSL' },
    { id: 'mfa', name: 'REQUIRE_MFA_KEY', desc: 'Exigir llave física MFA' },
    { id: 'ddos', name: 'ANTIDDOS_FILTER', desc: 'Mitigación de inundaciones UDP' }
  ];

  // Mapeo correcto de conexiones lógicas
  const correctConnections = {
    '80': 'drop',
    '443': 'allow',
    '22': 'mfa',
    '53': 'ddos'
  };

  // Estados de selección y conexión
  const [selectedPort, setSelectedPort] = useState(null);
  const [selectedRule, setSelectedRule] = useState(null);
  const [connections, setConnections] = useState({}); // Mapeo de portId -> ruleId
  const [errorFlash, setErrorFlash] = useState(false);
  const [successLogs, setSuccessLogs] = useState([]);

  // Verificar si ya se completó el laboratorio
  const isAlreadyCompleted = completedMissions.includes('mission_firewall');

  // Manejar el clic en un puerto
  const handlePortClick = (portId) => {
    // Si ya está conectado, no hacer nada
    if (connections[portId]) return;

    setSelectedPort(portId);

    // Si ya se había seleccionado una regla, evaluar la conexión
    if (selectedRule) {
      evaluateConnection(portId, selectedRule);
    }
  };

  // Manejar el clic en una regla
  const handleRuleClick = (ruleId) => {
    // Si la regla ya está siendo usada por alguna conexión, no hacer nada
    if (Object.values(connections).includes(ruleId)) return;

    setSelectedRule(ruleId);

    // Si ya se había seleccionado un puerto, evaluar la conexión
    if (selectedPort) {
      evaluateConnection(selectedPort, ruleId);
    }
  };

  // Evaluar si la conexión del par es correcta
  const evaluateConnection = (portId, ruleId) => {
    const isCorrect = correctConnections[portId] === ruleId;

    if (isCorrect) {
      // Registrar conexión exitosa
      const updatedConnections = { ...connections, [portId]: ruleId };
      setConnections(updatedConnections);
      updateXP(50); // Otorgar +50 XP por cableado exitoso
      
      const portName = ports.find(p => p.id === portId).name;
      const ruleName = rules.find(r => r.id === ruleId).name;
      setSuccessLogs(prev => [...prev, `[ENLACE CONECTADO]: ${portName} ──> ${ruleName} (+50 XP)`]);

      // Comprobar si se completaron las 4 conexiones
      if (Object.keys(updatedConnections).length === 4) {
        setTimeout(() => {
          if (!isAlreadyCompleted) {
            completeMission('mission_firewall');
            updateXP(50); // Bono de finalización
            setSuccessLogs(prev => [...prev, '>> ¡CORTAFUEGOS CONFIGURADO CORRECTAMENTE! (+50 XP BONUS)']);
          } else {
            setSuccessLogs(prev => [...prev, '>> Cortafuegos configurado correctamente (Bono de XP ya cobrado).']);
          }
        }, 300);
      }
    } else {
      // Fallo de conexión
      setErrorFlash(true);
      updateXP(-25); // Penalización
      
      const portName = ports.find(p => p.id === portId).name;
      const ruleName = rules.find(r => r.id === ruleId).name;
      setSuccessLogs(prev => [...prev, `[CORTOCIRCUITO ERRÓNEO]: ${portName} X ${ruleName} (-25 XP)`]);

      setTimeout(() => {
        setErrorFlash(false);
      }, 600);
    }

    // Limpiar selecciones
    setSelectedPort(null);
    setSelectedRule(null);
  };

  const handleResetGame = () => {
    setConnections({});
    setSelectedPort(null);
    setSelectedRule(null);
    setErrorFlash(false);
    setSuccessLogs([]);
  };

  return (
    <div className={`cyber-card glow ${errorFlash ? 'red-team' : ''}`} style={{ flex: 1, borderTop: '4px solid var(--theme-color)', padding: '20px' }}>
      
      {/* Cabecera del Lab */}
      <div style={{ display: 'flex', justifyContent: 'between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '15px' }}>
        <div style={{ fontFamily: 'var(--font-display)', color: 'var(--theme-color)', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
          🛡️ LAB 02: PARCHEO LÓGICO DEL FIREWALL
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '0.75rem', color: isAlreadyCompleted || Object.keys(connections).length === 4 ? 'var(--neon-green)' : 'var(--neon-yellow)', textTransform: 'uppercase', fontWeight: 'bold' }}>
          {isAlreadyCompleted || Object.keys(connections).length === 4 ? '[ CONFIGURADO ]' : '[ POR RECONFIGURAR ]'}
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: '#a0aec0', marginBottom: '16px', lineHeight: '1.4' }}>
        El firewall perimetral tiene las políticas de red caídas. Asocia cada uno de los puertos abiertos con su regla operativa correcta para detener los exploits y restablecer la protección de red.
      </p>

      {/* Instrucciones de Juego */}
      <div style={{ background: 'rgba(5, 255, 161, 0.04)', border: '1px dashed rgba(5, 255, 161, 0.2)', padding: '10px 14px', borderRadius: '4px', marginBottom: '20px', fontSize: '0.8rem' }}>
        <span style={{ color: 'var(--neon-green)', fontWeight: 'bold', textTransform: 'uppercase' }}>Instrucciones Tácticas:</span>
        <div style={{ color: '#cbd5e0', marginTop: '4px' }}>
          Haz clic en un puerto a la izquierda y luego en su regla lógica correcta a la derecha. Cada par correcto suma <span style={{ color: 'var(--neon-green)' }}>+50 XP</span>. Cada error resta <span style={{ color: 'var(--neon-magenta)' }}>-25 XP</span>.
        </div>
      </div>

      {/* Tablero de Conexión */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '20px', position: 'relative' }}>
        
        {/* Lado Izquierdo: Puertos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ color: 'var(--theme-color)', fontSize: '0.7rem', fontFamily: 'var(--font-display)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px', textAlign: 'center' }}>
            [ PUERTOS DE ORIGEN ]
          </div>
          {ports.map((port) => {
            const isConnected = !!connections[port.id];
            const isSelected = selectedPort === port.id;

            let borderStyle = 'rgba(255, 255, 255, 0.1)';
            let textGlow = 'none';
            if (isConnected) {
              borderStyle = 'var(--neon-green)';
            } else if (isSelected) {
              borderStyle = 'var(--theme-color)';
            }

            return (
              <div
                key={port.id}
                onClick={() => handlePortClick(port.id)}
                className="cyber-card"
                style={{
                  cursor: isConnected ? 'default' : 'pointer',
                  padding: '12px 14px',
                  background: isConnected ? 'rgba(5, 255, 161, 0.05)' : isSelected ? 'rgba(0, 240, 255, 0.05)' : 'rgba(10, 10, 15, 0.8)',
                  borderColor: borderStyle,
                  borderLeftWidth: '3px',
                  opacity: isConnected ? 0.75 : 1,
                  display: 'flex',
                  justifyContent: 'between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 'bold', color: isConnected ? 'var(--neon-green)' : '#fff' }}>
                    {port.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#718096' }}>{port.desc}</div>
                </div>
                {isConnected && (
                  <div style={{ marginLeft: 'auto', color: 'var(--neon-green)', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    ✔ LNK
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Lado Derecho: Reglas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ color: 'var(--theme-color)', fontSize: '0.7rem', fontFamily: 'var(--font-display)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px', textAlign: 'center' }}>
            [ POLÍTICAS DE ACCESO ]
          </div>
          {rules.map((rule) => {
            // Verificar si alguna conexión apunta a esta regla
            const connectedPortId = Object.keys(connections).find(key => connections[key] === rule.id);
            const isConnected = !!connectedPortId;
            const isSelected = selectedRule === rule.id;

            let borderStyle = 'rgba(255, 255, 255, 0.1)';
            if (isConnected) {
              borderStyle = 'var(--neon-green)';
            } else if (isSelected) {
              borderStyle = 'var(--theme-color)';
            }

            return (
              <div
                key={rule.id}
                onClick={() => handleRuleClick(rule.id)}
                className="cyber-card"
                style={{
                  cursor: isConnected ? 'default' : 'pointer',
                  padding: '12px 14px',
                  background: isConnected ? 'rgba(5, 255, 161, 0.05)' : isSelected ? 'rgba(0, 240, 255, 0.05)' : 'rgba(10, 10, 15, 0.8)',
                  borderColor: borderStyle,
                  borderLeftWidth: '3px',
                  opacity: isConnected ? 0.75 : 1,
                  display: 'flex',
                  justifyContent: 'between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 'bold', color: isConnected ? 'var(--neon-green)' : '#fff' }}>
                    {rule.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#718096' }}>{rule.desc}</div>
                </div>
                {isConnected && (
                  <div style={{ marginLeft: 'auto', color: 'var(--neon-green)', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    ✔ LNK
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Terminal de Eventos de Conexión */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--theme-color)', textTransform: 'uppercase', fontWeight: 'bold' }}>
            📟 TELEMETRÍA DE RED DE CORTAFUEGOS (FIREWALL_SYS)
          </span>
          <button
            onClick={handleResetGame}
            style={{
              marginLeft: 'auto',
              background: 'transparent',
              border: 'none',
              color: 'var(--neon-magenta)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            REINICIAR CABLEADO
          </button>
        </div>
        <div className="cyber-terminal" style={{ height: '100px' }}>
          {successLogs.length === 0 ? (
            <div style={{ color: '#718096' }}>[ EN ESPERA DE CONEXIÓN DE PUERTOS FÍSICOS... ]</div>
          ) : (
            successLogs.map((log, index) => {
              let typeClass = 'success';
              if (log.includes('CORTOCIRCUITO')) typeClass = 'error';
              else if (log.includes('SISTEMA') || log.includes('bonus')) typeClass = 'info';

              return (
                <div key={index} className={`terminal-line ${typeClass}`}>
                  {log}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
export default WireConnectGame;
