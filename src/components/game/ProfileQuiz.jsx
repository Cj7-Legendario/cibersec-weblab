import React, { useState, useContext } from 'react';
import { GameContext } from '../../context/GameContext';

export const ProfileQuiz = () => {
  const { nickname, institution, location, setOperatorTeam, updateXP } = useContext(GameContext);

  // Estado del cuestionario
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [detectedTeam, setDetectedTeam] = useState(null);

  // Cuestionario de personalidad camuflado para el stand (2 preguntas simplificadas)
  const questions = [
    {
      id: 1,
      title: 'FASE I: ANÁLISIS DE FILOSOFÍA OPERATIVA',
      text: 'En un videojuego de estrategia o combate, ¿cuál es tu estilo de juego preferido?',
      options: [
        {
          text: 'Atacar de frente, buscar vulnerabilidades y romper las defensas enemigas.',
          role: 'red'
        },
        {
          text: 'Fortificar la base, proteger los recursos y anticipar las trampas del rival.',
          role: 'blue'
        },
        {
          text: 'Analizar los datos de ambos bandos, coordinar el contraataque y optimizar los recursos.',
          role: 'purple'
        }
      ]
    },
    {
      id: 2,
      title: 'FASE II: PROTOCOLO ANTE CRISIS DE SISTEMAS',
      text: 'Si un sistema informático empieza a parpadear con alertas rojas, tu instinto te dice:',
      options: [
        {
          text: 'Hackear la señal de origen para ver quién está detrás.',
          role: 'red'
        },
        {
          text: 'Activar el protocolo de contención y cerrar todos los accesos externos.',
          role: 'blue'
        },
        {
          text: 'Monitorear el tráfico para entender cómo entraron y parcharlos en caliente.',
          role: 'purple'
        }
      ]
    }
  ];

  // Manejar la selección de una opción
  const handleAnswerSelect = (role) => {
    const updatedAnswers = [...answers, role];
    setAnswers(updatedAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateProfile(updatedAnswers);
    }
  };

  // Calcular el rol dominante a partir de las respuestas
  const calculateProfile = (finalAnswers) => {
    const counts = { red: 0, blue: 0, purple: 0 };
    finalAnswers.forEach((ans) => {
      counts[ans] = (counts[ans] || 0) + 1;
    });

    let winner = 'purple'; // Valor por defecto en caso de empate general

    if (counts.red > counts.blue && counts.red > counts.purple) {
      winner = 'red';
    } else if (counts.blue > counts.red && counts.blue > counts.purple) {
      winner = 'blue';
    } else if (counts.purple > counts.red && counts.purple > counts.blue) {
      winner = 'purple';
    } else {
      // En caso de empate (por ejemplo, 1 red y 1 blue) asignamos purple como el balance
      winner = 'purple';
    }

    setDetectedTeam(winner);
    setQuizFinished(true);
  };

  // Confirmar y aplicar el rol al estado global
  const handleApplyRole = () => {
    setOperatorTeam(detectedTeam);
    updateXP(200); // Bonificación por perfilamiento
  };

  const teamStyles = {
    red: {
      name: 'RED TEAM (OFENSIVO)',
      code: 'OPERADOR_ROJO_COBALT',
      desc: 'Analista de intrusión con enfoque ofensivo. Destacas por encontrar brechas y simular ataques reales para retar la seguridad del sistema.',
      glowClass: 'red-team',
      color: '#ff2a6d'
    },
    blue: {
      name: 'BLUE TEAM (DEFENSIVO)',
      code: 'OPERADOR_AZUL_CENTINELA',
      desc: 'Especialista en contención e inmunización de red. Tu foco es el monitoreo activo, respuesta rápida ante incidentes y protección incondicional.',
      glowClass: 'blue-team',
      color: '#00f0ff'
    },
    purple: {
      name: 'PURPLE TEAM (ESTRATEGA)',
      code: 'OPERADOR_PURPURA_ORQUESTADOR',
      desc: 'Auditor de resiliencia táctica. Integras lo mejor del ataque y la defensa para orquestar planes eficientes de respuesta y optimización.',
      glowClass: 'purple-team',
      color: '#9d4edd'
    }
  };

  const activeTeamInfo = quizFinished && detectedTeam ? teamStyles[detectedTeam] : null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 60px)', padding: '20px' }}>
      <div className={`cyber-card glow ${activeTeamInfo ? activeTeamInfo.glowClass : ''}`} style={{ width: '100%', maxWidth: '700px' }}>
        
        {/* Cabecera del Panel */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px', marginBottom: '20px' }}>
          <div style={{ fontFamily: 'var(--font-display)', color: 'var(--theme-color)', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
            [ PERFILAMIENTO DE OPERADOR EN STAND ]
          </div>
          <div style={{ color: '#718096', fontSize: '0.8rem' }}>
            OPERADOR: {nickname.toUpperCase()}
          </div>
        </div>

        {!quizFinished ? (
          // Vista del Cuestionario
          <div>
            {/* Barra de progreso */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  style={{
                    flex: 1,
                    height: '4px',
                    backgroundColor: idx <= currentQuestion ? 'var(--theme-color)' : 'rgba(255, 255, 255, 0.1)',
                    boxShadow: idx <= currentQuestion ? '0 0 6px var(--theme-color)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>

            {/* Pregunta Activa */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ color: 'var(--theme-color)', fontSize: '0.8rem', fontFamily: 'var(--font-display)', marginBottom: '8px', letterSpacing: '1px' }}>
                {questions[currentQuestion].title}
              </div>
              <h2 style={{ fontSize: '1.25rem', color: '#fff', lineHeight: '1.4', fontFamily: 'var(--font-display)' }}>
                {questions[currentQuestion].text}
              </h2>
            </div>

            {/* Opciones de respuesta */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {questions[currentQuestion].options.map((opt, idx) => (
                <div
                  key={idx}
                  onClick={() => handleAnswerSelect(opt.role)}
                  className="cyber-card"
                  style={{
                    cursor: 'pointer',
                    padding: '18px 20px',
                    background: 'rgba(15, 15, 25, 0.6)',
                    borderColor: 'rgba(255, 255, 255, 0.08)',
                    borderLeftWidth: '3px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--theme-color)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.background = 'rgba(15, 15, 25, 0.6)';
                  }}
                >
                  <div style={{ fontSize: '0.95rem', color: '#cbd5e0', lineHeight: '1.4' }}>
                    {opt.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Instrucción Táctica */}
            <div style={{ marginTop: '24px', fontSize: '0.75rem', color: '#718096', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Fase {currentQuestion + 1} de {questions.length} // Selecciona la opción que mejor defina tu actitud
            </div>
          </div>
        ) : (
          // Resultados del Perfilamiento
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ color: 'var(--neon-green)', fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center', animation: 'blink 1.5s infinite' }}>
              ¡ANÁLISIS DE PERFIL COMPLETADO CON ÉXITO!
            </div>

            {/* Tarjeta de identificación militar */}
            <div
              className={`cyber-card glow ${detectedTeam}-team`}
              style={{
                width: '100%',
                maxWidth: '460px',
                padding: '24px',
                background: 'rgba(5, 5, 8, 0.95)',
                border: '2px solid ' + activeTeamInfo.color,
                borderRadius: '8px',
                boxShadow: '0 0 30px ' + activeTeamInfo.color + '33',
                position: 'relative',
                marginBottom: '24px'
              }}
            >
              {/* Encabezado */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.65rem', color: '#a0aec0', letterSpacing: '1px' }}>CREDENCIAL OPERATIVA LOCAL</span>
                <span
                  style={{
                    background: activeTeamInfo.color,
                    color: '#000',
                    fontSize: '0.65rem',
                    fontWeight: 'bold',
                    padding: '2px 8px',
                    fontFamily: 'var(--font-display)'
                  }}
                >
                  SECURE CODES
                </span>
              </div>

              {/* Contenido principal */}
              <div style={{ display: 'flex', gap: '20px' }}>
                {/* Avatar neón */}
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    border: '2px solid ' + activeTeamInfo.color,
                    background: activeTeamInfo.color + '15',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-display)',
                    fontSize: '2rem',
                    color: '#fff',
                    textShadow: '0 0 10px ' + activeTeamInfo.color,
                    clipPath: 'polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)'
                  }}
                >
                  {nickname.substring(0, 2).toUpperCase()}
                </div>

                {/* Datos del visitante */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ fontSize: '0.65rem', color: '#718096', textTransform: 'uppercase' }}>OPERADOR</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: '#fff', textTransform: 'uppercase', textShadow: '0 0 5px ' + activeTeamInfo.color }}>
                    {nickname}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '6px' }}>
                    <div>
                      <div style={{ fontSize: '0.55rem', color: '#718096', textTransform: 'uppercase' }}>INSTITUCIÓN</div>
                      <div style={{ fontSize: '0.75rem', color: '#e2e8f0', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {institution}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.55rem', color: '#718096', textTransform: 'uppercase' }}>PROCEDENCIA</div>
                      <div style={{ fontSize: '0.75rem', color: '#e2e8f0', fontWeight: 'bold' }}>
                        {location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rol Asignado */}
              <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.6rem', color: '#718096', textTransform: 'uppercase', marginBottom: '2px' }}>ROL ASIGNADO EN EL STAND</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, color: activeTeamInfo.color, fontSize: '0.95rem', letterSpacing: '1px', textShadow: '0 0 5px ' + activeTeamInfo.color + '66' }}>
                  {activeTeamInfo.name}
                </div>
                <p style={{ fontSize: '0.75rem', color: '#cbd5e0', marginTop: '4px', lineHeight: '1.4' }}>
                  {activeTeamInfo.desc}
                </p>
              </div>

              {/* Footer credencial */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '0.55rem', color: '#718096' }}>
                <span>ID: CS-STAND-F1</span>
                <span>LVL 1 // METRIC: READY</span>
              </div>
            </div>

            {/* Acción de avance */}
            <button
              type="button"
              className="cyber-btn glow"
              onClick={handleApplyRole}
              style={{
                width: '100%',
                maxWidth: '460px',
                padding: '16px',
                fontSize: '1rem',
                borderWidth: '2px',
                borderColor: activeTeamInfo.color,
                letterSpacing: '2px',
              }}
            >
              INGRESAR A LA ESTACIÓN CENTRAL
            </button>
            <div style={{ fontSize: '0.7rem', color: '#718096', marginTop: '8px', textTransform: 'uppercase' }}>
              Bonificación por registro militar: +200 XP añadidos a la red
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ProfileQuiz;
