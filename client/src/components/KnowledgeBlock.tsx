import React, { useState, useEffect } from 'react';
import { getFullBlocksApi } from '../api';
import { clientLogger } from './ClientLogger';
import './KnowledgeBlock.css';

//   let blockExample = {
//     questionId: "a8ebfafd-d81a-42ec-b54c-c14d007cd54e",
//     questionText: "What is this a picture of?",
//     mediaId: "9b18dff4-8891-4874-a43d-ccc00477a19b",
//     mediaUrl:
//       "https://images.articulate.com/f:jpg%7Cpng,a:retain,b:fff/rise/courses/S3jQ2LjHDoRsPUQmR7dp6hA7-IaoYPA4/d229V-nstxA6tZdi.gif",
//     mediaType: "image",
//     blockId: "e50acfd3-a870-4cad-9ef2-a2ca30d24d81",
//     feedback: "I just love cookies and a warm cup of coffee!",
//     answerIds: [
//       "023d3f04-194a-484e-aad4-800ee04de372",
//       "e676187a-4b38-4d7c-8274-89c7e7c2fed6",
//     ],
//     answerTexts: ["Cookies and coffee", "Donuts and cider"],
//     isCorrects: [true, false],
//     POSs: [0, 1],
//   };

// Normally modularize these out
interface Question {
    questionId: string;
    questionText: string;
}

interface Media {
    mediaId: string;
    mediaUrl: string;
    mediaType: string;
}

interface Block {
    blockId: string;
    feedback: string;
}

interface Answer {
    answerId: string;
    answerText: string;
    isCorrect: boolean;
}

interface KnowledgeCheckBlock {
    question: Question;
    media: Media;
    block: Block | null;
    answers: Answer[];
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

                clientLogger(
                    'client/KnowledgeBlock:useEffect() blocksData[0]\n',
                    blocksData[0]
                );

                setBlocks(blocksData);
            } catch (err) {
                console.error('Error fetching blocks:', err);
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
                // Destructure for testing
                const { questionText } = block.question;
                const { mediaUrl, mediaType } = block.media || {};
                const answers = block.answers;
                const feedback = block.block?.feedback;

                clientLogger(
                    ' GINASAURUS: client/src/components/KnowledgeBlock\n',
                    block
                );

                return (
                    <div
                        key={block.block?.blockId || block.question.questionId}
                        className="knowledge-block"
                    >
                        <div className="question">{questionText}</div>
                        {mediaUrl && (
                            <div className="media">
                                <img
                                    className="img-img"
                                    src={mediaUrl}
                                    alt={mediaType}
                                />
                            </div>
                        )}
                        <div className="answers">
                            {answers.map((answer) => (
                                <label
                                    key={answer.answerId}
                                    className="answer-label"
                                >
                                    <input
                                        type="radio"
                                        name={block.question.questionId}
                                        value={answer.answerId}
                                        onChange={() =>
                                            handleAnswerChange(
                                                block.question.questionId,
                                                answer.answerId
                                            )
                                        }
                                        checked={
                                            selectedAnswers[
                                                block.question.questionId
                                            ] === answer.answerId
                                        }
                                    />
                                    {answer.answerText}
                                </label>
                            ))}
                        </div>
                        {submitted && (
                            <div className="feedback">
                                {correctAnswers[block.question.questionId]
                                    ? `CORRECT:\n ${feedback}`
                                    : `INCORRECT:\n ${feedback}`}
                            </div>
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
