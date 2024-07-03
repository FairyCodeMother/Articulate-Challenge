/**
 * client/src/components/Feedback.tsx
 *
 * Opportunities:
 *  - Validate `feedback` is string
 *  - Validate `isCorrect` is boolean
 *  - Accessibility attributes
 * Test cases:
 *  - Displayed feedback wrt isCorrect
 */
import React from "react";

interface FeedbackProps {
    isCorrect: boolean;
    feedback: string;
}

const Feedback: React.FC<FeedbackProps> = ({ isCorrect, feedback }) => {
    return (
        <div className="feedback">
            {isCorrect ? `CORRECT:\n ${feedback}` : `INCORRECT:\n ${feedback}`}
        </div>
    );
};

export default Feedback;
