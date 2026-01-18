import { useCallback, useMemo, useState } from 'react';

function useClockQuestion({ minHour = 1, maxHour = 12, includeMinutes = false, onQuestionGenerated }) {
    const [hour, setHour] = useState(null);
    const [minute, setMinute] = useState(null);

    const generateQuestion = useCallback(() => {
        const h =
            Math.floor(Math.random() * (maxHour - minHour + 1)) + minHour;
        const m = includeMinutes ? Math.floor(Math.random() * 12) * 5 : 0;

        setHour(h);
        setMinute(m);
        onQuestionGenerated?.({ hour: h, minute: m });
    }, [minHour, maxHour, includeMinutes, onQuestionGenerated]);

    const currentTime = useMemo(() => {
        if (hour == null) return null;
        const minutes = includeMinutes ? minute : 0;
        return new Date(2000, 0, 1, hour, minutes, 0);
    }, [hour, minute, includeMinutes]);

    return {
        hour,
        minute,
        correctAnswer: { hour, minute },
        currentTime,
        generateQuestion,
    };
}

export default useClockQuestion;
