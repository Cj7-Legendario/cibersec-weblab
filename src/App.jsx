import { useContext, useState, useEffect } from 'react';
import { GameProvider, GameContext } from './context/GameContext';
import { Landing } from './pages/Landing';
import { ProfileQuiz } from './components/game/ProfileQuiz';
import { ResultScreen } from './pages/ResultScreen';
import { VisitorWall } from './pages/VisitorWall';
import unasamLogo from './logos/unasam.webp';
import cibersecLogo from './logos/cibersec.webp';

// Red Team Labs (Ofensivo)
import { SQLInjectionLab } from './components/minigames/red/SQLInjectionLab';
import { NumberPwnGrid } from './components/minigames/red/NumberPwnGrid';
import { PayloadBuilder } from './components/minigames/red/PayloadBuilder';

// Blue Team Labs (Defensivo)
import { WireConnectGame } from './components/minigames/blue/WireConnectGame';
import { PhishingFlagger } from './components/minigames/blue/PhishingFlagger';
import { LogAnalyzer } from './components/minigames/blue/LogAnalyzer';

// Purple Team Labs (Estratega/Mitigación)
import { AttackDefenseMapper } from './components/minigames/purple/AttackDefenseMapper';
import { KillChainPuzzle } from './components/minigames/purple/KillChainPuzzle';
import { ReportBuilder } from './components/minigames/purple/ReportBuilder';

function AppContent() {
  const {
    nickname,
    institution,
    location,
    team,
    xp,
    level,
    completedMissions,
    resetGame
  } = useContext(GameContext);

  // Lógica de navegación basada en el estado global
  const isRegistered = institution && institution.trim() !== '';
  const hasTeam = team !== null;

  // Estado local para controlar la pantalla activa ('game' o 'muro')
  const [screen, setScreen] = useState('game');

  // Estado local para la pestaña de laboratorio activa
  // Para Red Team iniciará en 'sqli', para Blue en 'firewall', para Purple en 'mapper'
  const [activeTab, setActiveTab] = useState('sqli');

  // Ajustar la pestaña activa inicial en base al equipo cuando se asigne
  useEffect(() => {
    if (team === 'red') {
      setActiveTab('sqli');
    } else if (team === 'blue') {
      setActiveTab('firewall');
    } else if (team === 'purple') {
      setActiveTab('mapper');
    }
  }, [team]);

  // Si está en modo proyección de muro, mostrar la VisitorWall
  if (screen === 'muro') {
    return <VisitorWall onBackToLanding={() => setScreen('game')} />;
  }

  // Si no está registrado, ir a la Landing
  if (!isRegistered) {
    return <Landing onProjectWall={() => setScreen('muro')} />;
  }

  // Si no tiene equipo, ir al cuestionario de inducción
  if (!hasTeam) {
    return <ProfileQuiz />;
  }

  // Definición de misiones requeridas por bando para finalizar el juego
  const missionsByTeam = {
    red: ['mission_sqli', 'mission_pwn_grid', 'mission_payload'],
    blue: ['mission_firewall', 'mission_phishing', 'mission_logs'],
    purple: ['mission_mapper', 'mission_killchain', 'mission_report']
  };

  const requiredMissions = missionsByTeam[team] || [];
  
  // Validar si el operador ha completado el número total de misiones asignadas a su bando (3 de 3)
  const isFinished = requiredMissions.length > 0 && requiredMissions.every(m => completedMissions.includes(m));

  // Si ya completó sus 3 misiones exclusivas, se despliega la pantalla de celebración final
  if (isFinished) {
    return (
      <ResultScreen
        nickname={nickname}
        institution={institution}
        location={location}
        xp={xp}
        level={level}
        team={team}
        onReset={() => {
          resetGame();
          setActiveTab('sqli');
        }}
      />
    );
  }

  // Configuración estética del HUD por bando
  const teamDetails = {
    red: { name: 'RED TEAM', label: 'Ofensivo', badgeClass: 'red-team', color: '#ff2a6d' },
    blue: { name: 'BLUE TEAM', label: 'Defensivo', badgeClass: 'blue-team', color: '#00f0ff' },
    purple: { name: 'PURPLE TEAM', label: 'Estratega', badgeClass: 'purple-team', color: '#9d4edd' }
  };

  const currentTeamInfo = teamDetails[team] || { name: 'S/D', label: 'Operador', badgeClass: '', color: '#00f0ff' };
  const teamRgb = {
    red: '255, 42, 109',
    blue: '0, 240, 255',
    purple: '157, 78, 237'
  };

  // Progreso de XP para el nivel actual (500 XP por nivel)
  const xpInCurrentLevel = xp % 500;
  const xpProgressPercentage = Math.min(100, (xpInCurrentLevel / 500) * 100);

  // Cantidad de misiones resueltas para este bando
  const resolvedMissionsCount = requiredMissions.filter(m => completedMissions.includes(m)).length;

  return (
    <div
      className={`app-container theme-${team || 'blue'}`}
      style={{
        '--theme-color': currentTeamInfo.color,
        '--theme-rgb': teamRgb[team] || '0, 240, 255'
      }}
    >
      {/* Laser de escaneo de fondo */}
      <div className="scan-laser"></div>

      {/* ==========================================
          HUD SUPERIOR MILITARIZADO AVANZADO CON LOGOS
          ========================================== */}
      <header className="cyber-hud">
        
        {/* Lado Izquierdo: Credenciales de Operador & Logos */}
        <div className="hud-operator-card">
          <div className="hud-avatar" style={{ borderColor: currentTeamInfo.color, textShadow: `0 0 10px ${currentTeamInfo.color}` }}>
            {nickname.substring(0, 2).toUpperCase()}
          </div>
          <div className="hud-details">
            <span className="hud-name" style={{ color: currentTeamInfo.color, textShadow: `0 0 4px ${currentTeamInfo.color}44` }}>
              {nickname}
            </span>
            <span className="hud-meta">
              {institution} | {location}
            </span>
          </div>

          {/* Logos institucionales con opacidad neón */}
          <div className="hud-logo-dock" aria-label="Logos institucionales">
            <img
              src={unasamLogo}
              alt="UNASAM"
              onError={(e) => e.target.style.display = 'none'}
              className="hud-logo hud-logo-unasam"
            />
            <img
              src={cibersecLogo}
              alt="CIBERSEC"
              onError={(e) => e.target.style.display = 'none'}
              className="hud-logo hud-logo-cibersec"
            />
          </div>
        </div>

        {/* Centro: Barra de progreso de XP neón */}
        <div className="hud-xp-container">
          <div className="xp-header" style={{ color: currentTeamInfo.color }}>
            <span>Rango Operativo: Nivel {level}</span>
            <span>{xpInCurrentLevel} / 500 XP</span>
          </div>
          <div className="xp-bar-bg">
            <div
              className="xp-bar-fill"
              style={{
                width: `${xpProgressPercentage}%`,
                background: `linear-gradient(90deg, ${currentTeamInfo.color}88, ${currentTeamInfo.color})`,
                boxShadow: `0 0 12px ${currentTeamInfo.color}`
              }}
            />
          </div>
        </div>

        {/* Lado Derecho: Estadísticas en tiempo real */}
        <div className="hud-stats">
          <div className="stat-box">
            <div className="stat-label">Nivel</div>
            <div className="stat-value" style={{ color: currentTeamInfo.color }}>{level}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Puntos XP</div>
            <div className="stat-value" style={{ color: currentTeamInfo.color }}>{xp}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Bando</div>
            <div className="stat-value team-badge" style={{ color: currentTeamInfo.color }}>
              {currentTeamInfo.name}
            </div>
          </div>
        </div>
      </header>

      {/* ==========================================
          CUERPO PRINCIPAL DEL DASHBOARD
          ========================================== */}
      <main className="dashboard-grid">
        
        {/* Panel Lateral: Lista de misiones de bando y Reset */}
        <section className="sidebar-panel">
          
          {/* Estatus del bando */}
          <div className="cyber-card glow" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--theme-color)', fontSize: '0.9rem', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              📊 MISIONES DISPONIBLES
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Renderizar misiones exclusivas de RED TEAM */}
              {team === 'red' && (
                <>
                  {/* SQL Injection */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 'bold', color: completedMissions.includes('mission_sqli') ? 'var(--neon-green)' : '#cbd5e0' }}>
                        SQL Injection Bypass
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#718096' }}>Recompensa: +100 XP</div>
                    </div>
                    <button
                      onClick={() => setActiveTab('sqli')}
                      className="cyber-btn"
                      style={{ padding: '4px 10px', fontSize: '0.6rem', letterSpacing: '1px', borderColor: completedMissions.includes('mission_sqli') ? 'var(--neon-green)' : 'var(--neon-yellow)', color: completedMissions.includes('mission_sqli') ? 'var(--neon-green)' : 'var(--neon-yellow)' }}
                    >
                      {completedMissions.includes('mission_sqli') ? 'OK' : 'IR'}
                    </button>
                  </div>

                  {/* Pwn Grid */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 'bold', color: completedMissions.includes('mission_pwn_grid') ? 'var(--neon-green)' : '#cbd5e0' }}>
                        Secuenciador Grid
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#718096' }}>Recompensa: +100 XP</div>
                    </div>
                    <button
                      onClick={() => setActiveTab('pwn_grid')}
                      className="cyber-btn"
                      style={{ padding: '4px 10px', fontSize: '0.6rem', letterSpacing: '1px', borderColor: completedMissions.includes('mission_pwn_grid') ? 'var(--neon-green)' : 'var(--neon-yellow)', color: completedMissions.includes('mission_pwn_grid') ? 'var(--neon-green)' : 'var(--neon-yellow)' }}
                    >
                      {completedMissions.includes('mission_pwn_grid') ? 'OK' : 'IR'}
                    </button>
                  </div>

                  {/* Payload Builder */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 'bold', color: completedMissions.includes('mission_payload') ? 'var(--neon-green)' : '#cbd5e0' }}>
                        Constructor XSS
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#718096' }}>Recompensa: +100 XP</div>
                    </div>
                    <button
                      onClick={() => setActiveTab('payload')}
                      className="cyber-btn"
                      style={{ padding: '4px 10px', fontSize: '0.6rem', letterSpacing: '1px', borderColor: completedMissions.includes('mission_payload') ? 'var(--neon-green)' : 'var(--neon-yellow)', color: completedMissions.includes('mission_payload') ? 'var(--neon-green)' : 'var(--neon-yellow)' }}
                    >
                      {completedMissions.includes('mission_payload') ? 'OK' : 'IR'}
                    </button>
                  </div>
                </>
              )}

              {/* Renderizar misiones exclusivas de BLUE TEAM */}
              {team === 'blue' && (
                <>
                  {/* Wire Connect */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 'bold', color: completedMissions.includes('mission_firewall') ? 'var(--neon-green)' : '#cbd5e0' }}>
                        Cableado Firewall
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#718096' }}>Recompensa: +100 XP</div>
                    </div>
                    <button
                      onClick={() => setActiveTab('firewall')}
                      className="cyber-btn"
                      style={{ padding: '4px 10px', fontSize: '0.6rem', letterSpacing: '1px', borderColor: completedMissions.includes('mission_firewall') ? 'var(--neon-green)' : 'var(--neon-yellow)', color: completedMissions.includes('mission_firewall') ? 'var(--neon-green)' : 'var(--neon-yellow)' }}
                    >
                      {completedMissions.includes('mission_firewall') ? 'OK' : 'IR'}
                    </button>
                  </div>

                  {/* Phishing Flagger */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 'bold', color: completedMissions.includes('mission_phishing') ? 'var(--neon-green)' : '#cbd5e0' }}>
                        Detección Phishing
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#718096' }}>Recompensa: +100 XP</div>
                    </div>
                    <button
                      onClick={() => setActiveTab('phishing')}
                      className="cyber-btn"
                      style={{ padding: '4px 10px', fontSize: '0.6rem', letterSpacing: '1px', borderColor: completedMissions.includes('mission_phishing') ? 'var(--neon-green)' : 'var(--neon-yellow)', color: completedMissions.includes('mission_phishing') ? 'var(--neon-green)' : 'var(--neon-yellow)' }}
                    >
                      {completedMissions.includes('mission_phishing') ? 'OK' : 'IR'}
                    </button>
                  </div>

                  {/* Log Analyzer */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 'bold', color: completedMissions.includes('mission_logs') ? 'var(--neon-green)' : '#cbd5e0' }}>
                        Analizador de Logs
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#718096' }}>Recompensa: +100 XP</div>
                    </div>
                    <button
                      onClick={() => setActiveTab('logs')}
                      className="cyber-btn"
                      style={{ padding: '4px 10px', fontSize: '0.6rem', letterSpacing: '1px', borderColor: completedMissions.includes('mission_logs') ? 'var(--neon-green)' : 'var(--neon-yellow)', color: completedMissions.includes('mission_logs') ? 'var(--neon-green)' : 'var(--neon-yellow)' }}
                    >
                      {completedMissions.includes('mission_logs') ? 'OK' : 'IR'}
                    </button>
                  </div>
                </>
              )}

              {/* Renderizar misiones exclusivas de PURPLE TEAM */}
              {team === 'purple' && (
                <>
                  {/* Attack Defense Mapper */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 'bold', color: completedMissions.includes('mission_mapper') ? 'var(--neon-green)' : '#cbd5e0' }}>
                        Mapeador Controles
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#718096' }}>Recompensa: +100 XP</div>
                    </div>
                    <button
                      onClick={() => setActiveTab('mapper')}
                      className="cyber-btn"
                      style={{ padding: '4px 10px', fontSize: '0.6rem', letterSpacing: '1px', borderColor: completedMissions.includes('mission_mapper') ? 'var(--neon-green)' : 'var(--neon-yellow)', color: completedMissions.includes('mission_mapper') ? 'var(--neon-green)' : 'var(--neon-yellow)' }}
                    >
                      {completedMissions.includes('mission_mapper') ? 'OK' : 'IR'}
                    </button>
                  </div>

                  {/* Kill Chain Puzzle */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 'bold', color: completedMissions.includes('mission_killchain') ? 'var(--neon-green)' : '#cbd5e0' }}>
                        Secuenciador KillChain
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#718096' }}>Recompensa: +100 XP</div>
                    </div>
                    <button
                      onClick={() => setActiveTab('killchain')}
                      className="cyber-btn"
                      style={{ padding: '4px 10px', fontSize: '0.6rem', letterSpacing: '1px', borderColor: completedMissions.includes('mission_killchain') ? 'var(--neon-green)' : 'var(--neon-yellow)', color: completedMissions.includes('mission_killchain') ? 'var(--neon-green)' : 'var(--neon-yellow)' }}
                    >
                      {completedMissions.includes('mission_killchain') ? 'OK' : 'IR'}
                    </button>
                  </div>

                  {/* Report Builder */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 'bold', color: completedMissions.includes('mission_report') ? 'var(--neon-green)' : '#cbd5e0' }}>
                        Redactor de Informe
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#718096' }}>Recompensa: +100 XP</div>
                    </div>
                    <button
                      onClick={() => setActiveTab('report')}
                      className="cyber-btn"
                      style={{ padding: '4px 10px', fontSize: '0.6rem', letterSpacing: '1px', borderColor: completedMissions.includes('mission_report') ? 'var(--neon-green)' : 'var(--neon-yellow)', color: completedMissions.includes('mission_report') ? 'var(--neon-green)' : 'var(--neon-yellow)' }}
                    >
                      {completedMissions.includes('mission_report') ? 'OK' : 'IR'}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Progreso */}
            <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.75rem', color: '#a0aec0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Misiones de Bando:</span>
                <span style={{ marginLeft: 'auto', fontWeight: 'bold', color: 'var(--theme-color)' }}>
                  {resolvedMissionsCount} / 3
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Bando Resolviendo:</span>
                <span style={{ marginLeft: 'auto', fontWeight: 'bold', color: currentTeamInfo.color }}>
                  {team.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Reset */}
          <div className="cyber-card" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--neon-magenta)', fontSize: '0.9rem', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              ⚠️ PROTOCOLO DE SALIDA
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '16px', lineHeight: '1.4' }}>
              Al pulsar el botón inferior borrarás toda la huella digital del navegador local para permitir que otro visitante se registre en el stand de exhibición.
            </p>
            <button
              onClick={() => {
                if (window.confirm('¿Seguro que deseas restablecer el simulador? Esto borrará todo tu XP, nivel y misiones completadas.')) {
                  resetGame();
                  setActiveTab('sqli');
                }
              }}
              className="cyber-btn btn-magenta"
              style={{ width: '100%', fontSize: '0.75rem', padding: '10px' }}
            >
              RESETEAR SISTEMA
            </button>
          </div>
        </section>

        {/* Panel Central: Laboratorios Dinámicos por Bando */}
        <section className="main-content">
          
          {/* Pestañas de RED TEAM */}
          {team === 'red' && (
            <div className="tabs-container">
              <button
                onClick={() => setActiveTab('sqli')}
                className={`cyber-tab ${activeTab === 'sqli' ? 'active' : ''}`}
              >
                LAB_01 // SQL_INJECTION
                {completedMissions.includes('mission_sqli') && <span className="completed-badge-tab">[OK]</span>}
              </button>
              
              <button
                onClick={() => setActiveTab('pwn_grid')}
                className={`cyber-tab ${activeTab === 'pwn_grid' ? 'active' : ''}`}
              >
                LAB_02 // PWN_GRID
                {completedMissions.includes('mission_pwn_grid') && <span className="completed-badge-tab">[OK]</span>}
              </button>

              <button
                onClick={() => setActiveTab('payload')}
                className={`cyber-tab ${activeTab === 'payload' ? 'active' : ''}`}
              >
                LAB_03 // XSS_BUILD
                {completedMissions.includes('mission_payload') && <span className="completed-badge-tab">[OK]</span>}
              </button>
            </div>
          )}

          {/* Pestañas de BLUE TEAM */}
          {team === 'blue' && (
            <div className="tabs-container">
              <button
                onClick={() => setActiveTab('firewall')}
                className={`cyber-tab ${activeTab === 'firewall' ? 'active' : ''}`}
              >
                LAB_01 // FIREWALL_WIRE
                {completedMissions.includes('mission_firewall') && <span className="completed-badge-tab">[OK]</span>}
              </button>
              
              <button
                onClick={() => setActiveTab('phishing')}
                className={`cyber-tab ${activeTab === 'phishing' ? 'active' : ''}`}
              >
                LAB_02 // PHISH_FLAG
                {completedMissions.includes('mission_phishing') && <span className="completed-badge-tab">[OK]</span>}
              </button>

              <button
                onClick={() => setActiveTab('logs')}
                className={`cyber-tab ${activeTab === 'logs' ? 'active' : ''}`}
              >
                LAB_03 // LOG_ANALYZE
                {completedMissions.includes('mission_logs') && <span className="completed-badge-tab">[OK]</span>}
              </button>
            </div>
          )}

          {/* Pestañas de PURPLE TEAM */}
          {team === 'purple' && (
            <div className="tabs-container">
              <button
                onClick={() => setActiveTab('mapper')}
                className={`cyber-tab ${activeTab === 'mapper' ? 'active' : ''}`}
              >
                LAB_01 // SEC_MAPPER
                {completedMissions.includes('mission_mapper') && <span className="completed-badge-tab">[OK]</span>}
              </button>
              
              <button
                onClick={() => setActiveTab('killchain')}
                className={`cyber-tab ${activeTab === 'killchain' ? 'active' : ''}`}
              >
                LAB_02 // KILL_CHAIN
                {completedMissions.includes('mission_killchain') && <span className="completed-badge-tab">[OK]</span>}
              </button>

              <button
                onClick={() => setActiveTab('report')}
                className={`cyber-tab ${activeTab === 'report' ? 'active' : ''}`}
              >
                LAB_03 // REPORT_BUILD
                {completedMissions.includes('mission_report') && <span className="completed-badge-tab">[OK]</span>}
              </button>
            </div>
          )}

          {/* Renderizado Condicional con Animación */}
          <div className="tab-content-wrapper" key={`${team}-${activeTab}`} style={{ minHeight: '400px' }}>
            {/* RED TEAM LABS */}
            {team === 'red' && activeTab === 'sqli' && <SQLInjectionLab />}
            {team === 'red' && activeTab === 'pwn_grid' && <NumberPwnGrid />}
            {team === 'red' && activeTab === 'payload' && <PayloadBuilder />}

            {/* BLUE TEAM LABS */}
            {team === 'blue' && activeTab === 'firewall' && <WireConnectGame />}
            {team === 'blue' && activeTab === 'phishing' && <PhishingFlagger />}
            {team === 'blue' && activeTab === 'logs' && <LogAnalyzer />}

            {/* PURPLE TEAM LABS */}
            {team === 'purple' && activeTab === 'mapper' && <AttackDefenseMapper />}
            {team === 'purple' && activeTab === 'killchain' && <KillChainPuzzle />}
            {team === 'purple' && activeTab === 'report' && <ReportBuilder />}
          </div>
        </section>

      </main>
      
      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '16px', color: '#4a5568', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        CIBERSEC 2.0 • EXPOSICIÓN ACADÉMICA UNASAM • STAND LOCAL FA1.5
      </footer>
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
