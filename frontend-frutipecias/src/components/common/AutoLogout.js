import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const AutoLogout = ({ children, setUser, user }) => {
  const navigate = useNavigate();
  const timerRef = useRef(null);
  
  
  const INACTIVITY_LIMIT = 5 * 60 * 1000; 
  const SESSION_MAX_LIMIT = 10 * 60 * 1000; 

  const handleLogout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
    alert("Tu sesión ha caducado por seguridad.");
  }, [navigate, setUser]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(handleLogout, INACTIVITY_LIMIT);
  }, [handleLogout]);

  useEffect(() => {
    if (!user) return;

    //timer de sesi'on
    const maxSessionTimer = setTimeout(() => {
        console.log("Tiempo máximo alcanzado");
        handleLogout();
    }, SESSION_MAX_LIMIT);

    return () => clearTimeout(maxSessionTimer);
}, [user]); 

useEffect(() => {
    if (!user) return;

    //timer de inactividad
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer(); 

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
}, [user, resetTimer]); //reinicio por cada evento de actividad

  return children;
};

export default AutoLogout;