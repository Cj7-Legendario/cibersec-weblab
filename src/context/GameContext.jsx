import React, { createContext, useState, useEffect } from 'react';

// Creación del contexto de juego
export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  // Inicialización del estado desde localStorage o valores por defecto
  const [nickname, setNickname] = useState(() => {
    return localStorage.getItem('cibersec_nickname') || 'GZ7';
  });

  const [institution, setInstitution] = useState(() => {
    return localStorage.getItem('cibersec_institution') || '';
  });

  const [location, setLocation] = useState(() => {
    return localStorage.getItem('cibersec_location') || 'Áncash (Huaraz/Otros)';
  });

  const [team, setTeam] = useState(() => {
    const savedTeam = localStorage.getItem('cibersec_team');
    return savedTeam === 'null' ? null : savedTeam;
  });

  const [xp, setXp] = useState(() => {
    const savedXp = localStorage.getItem('cibersec_xp');
    return savedXp ? parseInt(savedXp, 10) : 0;
  });

  const [completedMissions, setCompletedMissions] = useState(() => {
    const savedMissions = localStorage.getItem('cibersec_completed_missions');
    return savedMissions ? JSON.parse(savedMissions) : [];
  });

  // El nivel se calcula dinámicamente según la fórmula solicitada: Math.floor(xp / 500) + 1
  const level = Math.floor(xp / 500) + 1;

  // Efecto para sincronizar los metadatos y estado en localStorage y aplicar el color del tema CSS
  useEffect(() => {
    localStorage.setItem('cibersec_nickname', nickname);
    localStorage.setItem('cibersec_institution', institution);
    localStorage.setItem('cibersec_location', location);
    localStorage.setItem('cibersec_team', team || 'null');
    localStorage.setItem('cibersec_xp', xp.toString());
    localStorage.setItem('cibersec_completed_missions', JSON.stringify(completedMissions));

    // Lógica para cambiar la variable CSS '--theme-color' según el equipo asignado
    let themeColor = '#00f0ff'; // Default neón cyan
    if (team === 'red') {
      themeColor = '#ff2a6d'; // Neón magenta/rojo
    } else if (team === 'blue') {
      themeColor = '#00f0ff'; // Neón cian
    } else if (team === 'purple') {
      themeColor = '#9d4edd'; // Neón morado
    }
    
    document.documentElement.style.setProperty('--theme-color', themeColor);
  }, [nickname, institution, location, team, xp, completedMissions]);

  // Función para establecer la metadata inicial del operador
  const setOperatorMetadata = ({ newNickname, newInstitution, newLocation }) => {
    if (newNickname) setNickname(newNickname);
    if (newInstitution !== undefined) setInstitution(newInstitution);
    if (newLocation) setLocation(newLocation);
  };

  // Función para asignar el equipo/rol
  const setOperatorTeam = (teamName) => {
    if (['red', 'blue', 'purple', null].includes(teamName)) {
      setTeam(teamName);
    }
  };

  // Función para actualizar los puntos de XP (añadir o restar)
  const updateXP = (amount) => {
    setXp((prevXp) => {
      const nextXp = Math.max(0, prevXp + amount); // El XP no puede ser negativo
      return nextXp;
    });
  };

  // Función para registrar una misión completada si no se ha completado previamente
  const completeMission = (missionId) => {
    setCompletedMissions((prevMissions) => {
      if (!prevMissions.includes(missionId)) {
        return [...prevMissions, missionId];
      }
      return prevMissions;
    });
  };

  // Restablecer el juego por completo a los valores por defecto
  const resetGame = () => {
    setNickname('GZ7');
    setInstitution('');
    setLocation('Áncash (Huaraz/Otros)');
    setTeam(null);
    setXp(0);
    setCompletedMissions([]);
    localStorage.clear();
  };

  return (
    <GameContext.Provider
      value={{
        nickname,
        institution,
        location,
        team,
        xp,
        level,
        completedMissions,
        setOperatorMetadata,
        setOperatorTeam,
        updateXP,
        completeMission,
        resetGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
