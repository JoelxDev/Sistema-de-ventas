import { useEffect, useRef, useCallback } from "react";

const TIEMPO_INACTIVIDAD_MS = 2 * 60 * 60 * 1000; // 2 horas
const EVENTOS_ACTIVIDAD = ["mousemove", "keydown", "mousedown", "touchstart", "scroll", "click"];

export function useInactividad(onInactividad) {
    const timerRef = useRef(null);

    const reiniciarTimer = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            onInactividad();
        }, TIEMPO_INACTIVIDAD_MS);
    }, [onInactividad]);

    useEffect(() => {
        // Iniciar el timer al montar
        reiniciarTimer();

        // Reiniciar en cada evento de actividad
        EVENTOS_ACTIVIDAD.forEach(evento =>
            window.addEventListener(evento, reiniciarTimer)
        );

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            EVENTOS_ACTIVIDAD.forEach(evento =>
                window.removeEventListener(evento, reiniciarTimer)
            );
        };
    }, [reiniciarTimer]);
}