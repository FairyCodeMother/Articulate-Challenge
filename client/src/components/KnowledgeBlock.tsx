/**
 * client/src/components/KnowledgeBlock.tsx
 *
 * Opportunities:
 *  - Add loading state while fetching blocks
 *  - Improve error handling and display to user
 *  - Optimize handleSubmit for when many returned blocks
 * Test cases:
 *  - State changes
 *  - Renders correctly
 */
import React, { useState, useEffect } from "react";
import { getFullBlocksApi } from "../api";
import Media from "./Media";
import Answer from "./Answer";
import Feedback from "./Feedback";
import Question from "./Question";
import "./KnowledgeBlock.css";

interface KnowledgeCheckBlock {
    question: {
        questionId: string;
        questionText: string;
    };
    media: {
        mediaId: string;
        mediaUrl: string;
        mediaType: string;
    };
    block: {
        blockId: string;
        feedback: string;
    } | null;
    answers: {
        answerId: string;
        answerText: string;
        isCorrect: boolean;
    }[];
}

const KnowledgeBlock: React.FC = () => {
    const [blocks, setBlocks] = useState<KnowledgeCheckBlock[]>([]);
    const [selectedAnswers, setSelectedAnswers] = useState<{
        [key: string]: string | null;
    }>({});
    const [correctAnswers, setCorrectAnswers] = useState<{
        [key: string]: boolean;
    }>({});
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        async function fetchBlocks() {
            try {
                const blocksData = await getFullBlocksApi();
                setBlocks(blocksData);
            } catch (err) {
                console.error("[ERROR] Error fetching blocks via Api:", err);
            }
        }

        fetchBlocks();
    }, []);

    const handleAnswerChange = (questionId: string, answerId: string) => {
        setSelectedAnswers((prevSelectedAnswers) => ({
            ...prevSelectedAnswers,
            [questionId]: answerId
        }));
    };

    const handleSubmit = () => {
        const newCorrectAnswers: { [key: string]: boolean } = {};

        Object.keys(selectedAnswers).forEach((questionId) => {
            const selectedAnswerId = selectedAnswers[questionId];

            if (selectedAnswerId) {
                const block = blocks.find(
                    (block) => block.question.questionId === questionId
                );
                const selectedAnswer = block?.answers.find(
                    (answer) => answer.answerId === selectedAnswerId
                );

                if (selectedAnswer) {
                    newCorrectAnswers[questionId] = selectedAnswer.isCorrect;
                    if (selectedAnswer.isCorrect) {
                        console.log(`Question ${questionId}: Correct`);
                    } else {
                        console.log(`Question ${questionId}: Incorrect`);
                    }
                }
            } else {
                console.warn(`Question ${questionId}: No answer selected`);
            }
        });
        setCorrectAnswers(newCorrectAnswers);
        setSubmitted(true);
    };

    const handleReset = () => {
        setSelectedAnswers({});
        setCorrectAnswers({});
        setSubmitted(false);
    };

    return (
        <div className="block-knowledge__container">
            {blocks.map((block) => {
                const { questionText } = block.question;
                const { mediaUrl, mediaType } = block.media || {};
                const answers = block.answers;
                const feedback = block.block?.feedback;

                return (
                    <div
                        key={block.block?.blockId || block.question.questionId}
                        className="knowledge-block"
                    >
                        <Question questionText={questionText} />
                        {mediaUrl && (
                            <Media mediaUrl={mediaUrl} mediaType={mediaType} />
                        )}
                        <div className="answers">
                            {answers.map((answer) => (
                                <Answer
                                    key={answer.answerId}
                                    questionId={block.question.questionId}
                                    answerId={answer.answerId}
                                    answerText={answer.answerText}
                                    isSelected={
                                        selectedAnswers[
                                            block.question.questionId
                                        ] === answer.answerId
                                    }
                                    handleAnswerChange={handleAnswerChange}
                                />
                            ))}
                        </div>
                        {submitted && (
                            <Feedback
                                isCorrect={
                                    correctAnswers[block.question.questionId]
                                }
                                feedback={feedback || ""}
                            />
                        )}
                    </div>
                );
            })}
            {!submitted ? (
                <button onClick={handleSubmit}>Submit</button>
            ) : (
                <button onClick={handleReset}>Reset</button>
            )}
        </div>
    );
};

export default KnowledgeBlock;
