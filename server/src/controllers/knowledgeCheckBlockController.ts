// server/src/controllers/knowledgeCheckBlockController.ts
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
  data: any[],
): KnowledgeCheckBlock[] => {
  const groupedBlocks: { [key: string]: KnowledgeCheckBlock } = {};

  data.forEach((item) => {
    const blockId = item.blockId;

    // Check if the blockId exists and if it has multiple answerIds
    if (
      !groupedBlocks[blockId] &&
      item.answerIds &&
      item.answerIds.length > 1
    ) {
      groupedBlocks[blockId] = {
        question: {
          questionId: item.questionId,
          questionText: item.questionText,
        },
        media: {
          mediaId: item.mediaId,
          mediaUrl: item.mediaUrl,
          mediaType: item.mediaType,
        },
        block: item.blockId
          ? {
              blockId: item.blockId,
              feedback: item.feedback,
            }
          : null,
        answers: item.answerIds.map((answerId: string, index: number) => ({
          // Explicitly typing answerId as string
          answerId,
          answerText: item.answerTexts[index],
          isCorrect: item.isCorrects[index],
        })),
      };
    } else if (groupedBlocks[blockId]) {
      // If blockId already exists, add additional answers if they exist
      item.answerIds.forEach((answerId: string, index: number) => {
        // Explicitly typing answerId as string
        if (
          answerId &&
          groupedBlocks[blockId].answers.length < item.answerIds.length
        ) {
          groupedBlocks[blockId].answers.push({
            answerId,
            answerText: item.answerTexts[index],
            isCorrect: item.isCorrects[index],
          });
        }
      });
    }
  });

  return Object.values(groupedBlocks);
};
