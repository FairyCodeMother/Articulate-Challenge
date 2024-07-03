/**
 * client/src/components/Answer.tsx
 *
 * Opportunities:
 *  - Validate all props provided
 *  - Validate props are correct type
 *  - Accessibility attributes
 * Test cases:
 *  - handleAnswerChange uses correct args
 */
import React from "react";

interface AnswerProps {
    questionId: string;
    answerId: string;
    answerText: string;
    isSelected: boolean;
    handleAnswerChange: (questionId: string, answerId: string) => void;
}

const Answer: React.FC<AnswerProps> = ({
    questionId,
    answerId,
    answerText,
    isSelected,
    handleAnswerChange
}) => {
    return (
        <label className="answer-label">
            <input
                type="radio"
                name={questionId}
                value={answerId}
                onChange={() => handleAnswerChange(questionId, answerId)}
                checked={isSelected}
            />
            {answerText}
        </label>
    );
};

export default Answer;
