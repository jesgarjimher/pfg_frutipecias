import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
const INACTIVITY_LIMIT = Number(process.env.REACT_APP_INACTIVITY_LIMIT) || 300000; 
const SESSION_MAX_LIMIT = Number(process.env.REACT_APP_SESSION_MAX_LIMIT) || 1200000;
// NACTIVITY_LIMIT_ENV = 5 * 60 * 1000;
// SESSION_MAX_LIMIT_ENV = 20 * 60 * 1000;

const AutoLogout = ({ children, setUser, user }) => {
  const navigate = useNavigate();
  const timerRef = useRef(null);
  
  

  const handleLogout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.setItem("msgLogout", "Tu sesión ha caducado")
    setUser(null);
    navigate("/login");
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
}, [user, handleLogout]); 

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