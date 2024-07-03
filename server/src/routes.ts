import { Router, Request, Response, NextFunction, json } from "express";
import knex from "./knex"; // Interacts with database
import { errorHandler } from "./middleware/errorHandler";
import { transformKnowledgeCheckBlocks } from "./controllers/knowledgeCheckBlockController";

const router = Router();

/**
SELECT
  q.id AS "questionId", q.text AS "questionText"
, m.id AS "mediaId", m.url AS "mediaUrl", m.type AS "mediaType"
, kcb.id AS "blockId", kcb.feedback AS "feedback"
, ARRAY_AGG(a.id) AS "answerIds"
, ARRAY_AGG(a.text) AS "answerTexts"
, ARRAY_AGG(a."isCorrect") AS "isCorrects"
, ARRAY_AGG(a."pos") AS "POSs"
FROM questions AS q
LEFT JOIN "knowledgeCheckBlocks" AS kcb ON q.id = kcb."questionId"
LEFT JOIN answers AS a ON kcb.id = a."knowledgeCheckBlockId"
LEFT JOIN media AS m ON q."mediaId" = m.id
GROUP BY q.id, q.text, m.id, m.url, m.type, kcb.id, kcb.feedback
 */
const fetchKnowledgeCheckBlocks = async () => {
    return await knex("questions")
        .select(
            "questions.id as questionId",
            "questions.text as questionText",
            "media.id as mediaId",
            "media.url as mediaUrl",
            "media.type as mediaType",
            "knowledgeCheckBlocks.id as blockId",
            "knowledgeCheckBlocks.feedback as feedback",
            knex.raw(`array_agg(answers.id) as "answerIds"`),
            knex.raw(`array_agg(answers.text) as "answerTexts"`),
            knex.raw(`array_agg(answers."isCorrect") as "isCorrects"`),
            knex.raw(`array_agg(answers.pos) as "POSs"`)
        )
        .leftJoin(
            "knowledgeCheckBlocks",
            "questions.id",
            "knowledgeCheckBlocks.questionId"
        )
        .leftJoin(
            "answers",
            "knowledgeCheckBlocks.id",
            "answers.knowledgeCheckBlockId"
        )
        .leftJoin("media", "questions.mediaId", "media.id")
        .groupBy(
            "questions.id",
            "questions.text",
            "media.id",
            "media.url",
            "media.type",
            "knowledgeCheckBlocks.id",
            "knowledgeCheckBlocks.feedback"
        );
};

const getFullBlocks = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const queryResponse = await fetchKnowledgeCheckBlocks();
        const parsedBlock = transformKnowledgeCheckBlocks(queryResponse);

        res.send.bind(res)(parsedBlock);
    } catch (err) {
        next(err);
    }
};

// Ex: curl --location 'http://localhost:5001/knowledge-check-blocks'
router.get("/knowledge-check-blocks", getFullBlocks);

router.use(errorHandler);

export default router;
