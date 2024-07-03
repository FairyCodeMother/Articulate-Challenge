/**
 * server/src/controllers/knowledgeCheckBlockController.ts
 *
 * Opportunities:
 *  - Using hashing/memoization for faster lookups to handle larger datasets
 *  - Error handling for missing/incomplete 'data'
 *  - Refactor forEach loop (poss Array.reduce)
 * Test cases:
 *  - Behavior and edge cases of transformKnowledgeCheckBlocks
 */
import { Request, Response, NextFunction } from "express";

// Normally would break these out
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
    answers: Answer[]; // Grouped answers
}

export const transformKnowledgeCheckBlocks = (
    data: {
        questionId: string;
        questionText: string;
        mediaId: string;
        mediaUrl: string;
        mediaType: string;
        blockId: string | null;
        feedback: string | null;
        answerIds: string[];
        answerTexts: string[];
        isCorrects: boolean[];
    }[]
): KnowledgeCheckBlock[] => {
    const groupedBlocks: { [key: string]: KnowledgeCheckBlock } = {};

    data.forEach((item) => {
        const blockId = item.blockId || "";

        if (!groupedBlocks[blockId]) {
            groupedBlocks[blockId] = {
                question: {
                    questionId: item.questionId,
                    questionText: item.questionText
                },
                media: {
                    mediaId: item.mediaId,
                    mediaUrl: item.mediaUrl,
                    mediaType: item.mediaType
                },
                block: item.blockId
                    ? {
                          blockId: item.blockId,
                          feedback: item.feedback || ""
                      }
                    : null,
                answers: item.answerIds.map((answerId, index) => ({
                    answerId,
                    answerText: item.answerTexts[index],
                    isCorrect: item.isCorrects[index]
                }))
            };
        } else {
            item.answerIds.forEach((answerId, index) => {
                if (
                    answerId &&
                    groupedBlocks[blockId].answers.length <
                        item.answerIds.length
                ) {
                    groupedBlocks[blockId].answers.push({
                        answerId,
                        answerText: item.answerTexts[index],
                        isCorrect: item.isCorrects[index]
                    });
                }
            });
        }
    });

    return Object.values(groupedBlocks);
};
