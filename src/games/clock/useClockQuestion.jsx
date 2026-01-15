import { useCallback, useMemo, useState } from 'react';

function useClockQuestion({ minHour = 1, maxHour = 12, onQuestionGenerated }) {
    const [hour, setHour] = useState(null);

    const generateQuestion = useCallback(() => {
        const h =
            Math.floor(Math.random() * (maxHour - minHour + 1)) + minHour;
        setHour(h);
        onQuestionGenerated?.(h);
    }, [minHour, maxHour, onQuestionGenerated]);

    const currentTime = useMemo(() => {
        if (hour == null) return null;
        const d = new Date();
        d.setHours(hour);
        d.setMinutes(0);
        d.setSeconds(0);
        return d;
    }, [hour]);

    return {
        hour,
        correctAnswer: hour,
        currentTime,
        generateQuestion,
    };
}

export default useClockQuestion;
