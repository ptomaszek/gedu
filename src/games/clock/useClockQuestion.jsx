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
        return new Date(2000, 0, 1, hour, 0, 0);
    }, [hour]);

    return {
        hour,
        correctAnswer: hour,
        currentTime,
        generateQuestion,
    };
}

export default useClockQuestion;
