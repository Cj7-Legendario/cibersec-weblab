import { useState, useEffect, useRef, useContext } from 'react';
import { GameContext } from '../context/GameContext';
import unasamLogo from '../logos/unasam.webp';
import cibersecLogo from '../logos/cibersec.webp';

export const Landing = ({ onProjectWall }) => {
  const { nickname, institution, location, setOperatorMetadata } = useContext(GameContext);

  // Estados locales para el formulario
  const [localNickname, setLocalNickname] = useState(nickname || 'GZ7');
  const [localInstitution, setLocalInstitution] = useState(institution || '');
  const [localLocation, setLocalLocation] = useState(location || 'Áncash (Huaraz/Otros)');
  
  // Estados para controlar el flujo de la animación de terminal
  const [isVerifying, setIsVerifying] = useState(false);
  const [logs, setLogs] = useState([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  const terminalEndRef = useRef(null);

  // Desplazar terminal hacia abajo al añadir logs
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Lista de regiones para el selector
  const regionOptions = [
    'Áncash (Huaraz/Otros)',
    'Áncash (Chimbote)',
    'Lima Metropolitana',
    'La Libertad (Trujillo)',
    'Arequipa',
    'Cusco',
    'Cajamarca',
    'Piura',
    'Lambayeque',
    'Ica',
    'Loreto',
    'Otra Región de Perú',
    'Internacional'
  ];

  // Logs simulados que se irán mostrando en cascada
  const simulationLogs = [
    { text: '>> INICIANDO PROTOCOLO DE CONEXIÓN MILITAR CIBERSEC 2.0...', type: 'warning', delay: 400 },
    { text: '>> CONFIGURANDO INTERFAZ DE RED LOCAL Y SOCKETS TÁCTICOS...', type: 'info', delay: 700 },
    { text: '>> DETECTANDO DISPOSITIVO VIRTUAL E INJECTANDO CAPA CRIPTOGRÁFICA...', type: 'info', delay: 1100 },
    { text: `>> IDENTIDAD DE OPERADOR DECLARADA: [NICKNAME: "${localNickname.toUpperCase()}"]`, type: 'success', delay: 1500 },
    { text: `>> INSTITUCIÓN DE ORIGEN: [${localInstitution.toUpperCase()}]`, type: 'info', delay: 1900 },
    { text: `>> GEOLOCALIZACIÓN REQUERIDA: [PROCEDENCIA: "${localLocation.toUpperCase()}"]`, type: 'warning', delay: 2300 },
    { text: '>> ENLAZANDO SERVIDOR DE CREDENCIALES LOCALES...', type: 'info', delay: 2800 },
    { text: '>> ESCANEANDO EN TORNO A FIRMAS DE SEGURIDAD ACTIVAS...', type: 'info', delay: 3300 },
    { text: '>> ¡HUELLA DIGITAL DE VISITANTE SINCRONIZADA CORRECTAMENTE!', type: 'success', delay: 3800 },
    { text: '>> STATUS: ACCESO PERMITIDO. MAINFRAME DESBLOQUEADO.', type: 'success', delay: 4300 }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!localNickname.trim()) {
      alert('Por favor ingrese un apodo/nickname.');
      return;
    }
    if (!localInstitution.trim()) {
      alert('Por favor ingrese su institución educativa, colegio o universidad.');
      return;
    }

    setIsVerifying(true);
    setLogs([]);
    setIsUnlocked(false);

    // Iniciar la cascada de logs interactiva
    simulationLogs.forEach((log) => {
      setTimeout(() => {
        setLogs((prevLogs) => [...prevLogs, log]);
      }, log.delay);
    });

    // Desbloquear el mainframe tras finalizar los logs
    setTimeout(() => {
      setIsUnlocked(true);
    }, 4800);
  };

  const handleStartInduction = () => {
    // Sincronizar con el estado global de GameContext
    setOperatorMetadata({
      newNickname: localNickname,
      newInstitution: localInstitution,
      newLocation: localLocation
    });
  };

  return (
    <div className="landing-shell">
      <div className="cyber-card glow landing-mainframe">
        
        {/* Cabecera del Mainframe */}
        <div className="landing-header">
          {/* Logos institucionales con opacidad neón y bordes retroiluminados */}
          {/* ⚠️ Reubicado en src/logos/ por Fase 2 */}
          <div className="brand-orbit" aria-label="Logos institucionales">
            <img
              src={unasamLogo}
              alt="Logo UNASAM"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
              className="brand-logo brand-logo-unasam"
            />
            <img
              src={cibersecLogo}
              alt="Logo CIBERSEC"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
              className="brand-logo brand-logo-cibersec"
            />
          </div>
          <h1 className="glitch-text" style={{ fontFamily: 'var(--font-display)', color: 'var(--theme-color)', fontSize: '2rem', letterSpacing: '3px' }}>
            CIBERSEC 2.0
          </h1>
          <p style={{ fontSize: '0.8rem', color: '#a0aec0', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Sistema de Inducción de Operadores y Ciberlaboratorios
          </p>
        </div>

        {!isVerifying ? (
          // Formulario de Registro Inicial
          <form onSubmit={handleSubmit}>
            <div style={{ color: 'var(--theme-color)', fontSize: '0.85rem', textTransform: 'uppercase', borderLeft: '2px solid var(--theme-color)', paddingLeft: '8px', marginBottom: '20px' }}>
              [ REGISTRO DE VISITANTE TÁCTIL OBLIGATORIO ]
            </div>

            <div className="cyber-input-group">
              <label className="cyber-label">Nickname / Operador</label>
              <input
                type="text"
                className="cyber-input"
                value={localNickname}
                onChange={(e) => setLocalNickname(e.target.value)}
                placeholder="Ej. GZ7"
                maxLength={20}
                required
              />
            </div>

            <div className="cyber-input-group">
              <label className="cyber-label">Institución / Universidad / Colegio</label>
              <input
                type="text"
                className="cyber-input"
                value={localInstitution}
                onChange={(e) => setLocalInstitution(e.target.value)}
                placeholder="Ej. Universidad Nacional del Santa / Colegio Gran Unidad"
                maxLength={50}
                required
              />
            </div>

            <div className="cyber-input-group">
              <label className="cyber-label">Procedencia de Red</label>
              <select
                className="cyber-select"
                value={localLocation}
                onChange={(e) => setLocalLocation(e.target.value)}
              >
                {regionOptions.map((opt, index) => (
                  <option key={index} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="cyber-btn" style={{ width: '100%', marginTop: '10px' }}>
              VERIFICAR METADATOS Y ACCEDER
            </button>

            {/* Botón de acceso de administración para proyectar el Muro en Stand */}
            <div style={{ textAlign: 'center', marginTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '16px' }}>
              <button
                type="button"
                onClick={onProjectWall}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--neon-magenta)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  letterSpacing: '1px'
                }}
              >
                🖥️ PROYECTAR MURO EN TIEMPO REAL DEL STAND
              </button>
            </div>
          </form>
        ) : (
          // Visualizador de Logs y desbloqueo
          <div>
            <div style={{ color: 'var(--theme-color)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', justifyContent: 'between' }}>
              <span>PROCESANDO ENTRADA HUELLA DIGITAL...</span>
              <span className="blink-cursor" style={{ marginLeft: 'auto' }}></span>
            </div>

            {/* Consola de logs táctica */}
            <div className="cyber-terminal" style={{ height: '240px' }}>
              {logs.map((log, index) => (
                <div key={index} className={`terminal-line ${log.type}`}>
                  {log.text}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Botón de desbloqueo */}
            {isUnlocked ? (
              <div style={{ marginTop: '24px', textAlign: 'center', animation: 'blink 0.5s step-end 4' }}>
                <button
                  type="button"
                  className="cyber-btn btn-green glow"
                  onClick={handleStartInduction}
                  style={{ width: '100%', fontSize: '1.1rem', padding: '16px 20px', letterSpacing: '4px' }}
                >
                  INICIAR INDUCCIÓN
                </button>
                <div style={{ color: 'var(--neon-green)', fontSize: '0.75rem', marginTop: '8px', textTransform: 'uppercase' }}>
                  Acceso Concedido - Prepárate para el Perfilamiento
                </div>
              </div>
            ) : (
              <div style={{ marginTop: '24px', textAlign: 'center', color: '#718096', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                Verificando origen... por favor espere
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default Landing;
