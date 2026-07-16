import React, { useEffect } from 'react';

export default function UserSelector({ currentUser, setCurrentUser }) {
  // Cargar usuario guardado en localStorage al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('hogar_user');
    if (savedUser === 'Ismael' || savedUser === 'Sandra') {
      setCurrentUser(savedUser);
    }
  }, [setCurrentUser]);

  const handleToggle = () => {
    const nextUser = currentUser === 'Ismael' ? 'Sandra' : 'Ismael';
    setCurrentUser(nextUser);
    localStorage.setItem('hogar_user', nextUser);
  };

  return (
    <div className="user-selector-container">
      <button
        onClick={handleToggle}
        className="user-btn-toggle"
        aria-label={`Cambiar usuario (actual: ${currentUser})`}
        title={`Usuario: ${currentUser}. Haz clic para cambiar.`}
      >
        <span className={`user-avatar-circle ${currentUser === 'Ismael' ? 'ismael-avatar' : 'sandra-avatar'}`}>
          {currentUser === 'Ismael' ? 'I' : 'S'}
        </span>
      </button>
    </div>
  );
}
