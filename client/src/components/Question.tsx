/**
 * client/src/components/Question.tsx
 *
 * Opportunities:
 *  - Validation to ensure `questionText` is a string
 *  - Add styling directly to component to improve encapsulation
 * Test cases:
 *  - Renders correctly
 *  - Handles different lengths of `questionText`
 */
import React from "react";

interface QuestionProps {
    questionText: string;
}

const Question: React.FC<QuestionProps> = ({ questionText }) => {
    return <div className="question">{questionText}</div>;
};

export default Question;
