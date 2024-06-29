// server/src/routes.ts
import { Router, Request, Response, NextFunction, json } from 'express';
import knex from './knex'; // Interacts with database
import { errorHandler } from './middleware/errorHandler';
import { transformKnowledgeCheckBlocks } from './controllers/knowledgeCheckBlockController';
import { logger } from './middleware/loggers';

const router = Router();

/**
 * 
SELECT
    q."id" AS "questionId",
    q."text" AS "questionText",
    m."id" AS "mediaId",
    m."url" AS "mediaUrl",
    m."type" AS "mediaType",
    kcb."id" AS "blockId",
    kcb."feedback" AS "feedback",
    ARRAY_AGG(a."id") AS "answerIds",
    ARRAY_AGG(a."text") AS "answerTexts",
    ARRAY_AGG(a."isCorrect") AS "isCorrects",
    ARRAY_AGG(a."pos") AS "POSs"
FROM "questions" AS q
LEFT JOIN "knowledgeCheckBlocks" AS kcb ON q."id" = kcb."questionId"
LEFT JOIN "answers" AS a ON kcb."id" = a."knowledgeCheckBlockId"
LEFT JOIN "media" AS m ON q."mediaId" = m."id"
GROUP BY
    q."id", q."text", m."id", m."url", m."type", kcb."id", kcb."feedback"
HAVING
    COUNT(a."id") > 0  -- Filter out rows where there are no non-null answerIds
 *
 */
const fetchKnowledgeCheckBlocks = async () => {
    const queryResponse = await knex('questions')
        .select(
            'questions.id as questionId',
            'questions.text as questionText',
            'media.id as mediaId',
            'media.url as mediaUrl',
            'media.type as mediaType',
            'knowledgeCheckBlocks.id as blockId',
            'knowledgeCheckBlocks.feedback as feedback',
            knex.raw('array_agg(answers.id) as "answerIds"'),
            knex.raw('array_agg(answers.text) as "answerTexts"'),
            knex.raw('array_agg(answers."isCorrect") as "isCorrects"'),
            knex.raw('array_agg(answers.pos) as "POSs"')
        )
        .leftJoin(
            'knowledgeCheckBlocks',
            'questions.id',
            'knowledgeCheckBlocks.questionId'
        )
        .leftJoin(
            'answers',
            'knowledgeCheckBlocks.id',
            'answers.knowledgeCheckBlockId'
        )
        .leftJoin('media', 'questions.mediaId', 'media.id')
        .groupBy(
            'questions.id',
            'questions.text',
            'media.id',
            'media.url',
            'media.type',
            'knowledgeCheckBlocks.id',
            'knowledgeCheckBlocks.feedback'
        )
        .havingRaw('COUNT("answers"."id") > 0'); // Filter out rows where there are no non-null answerIds

    return queryResponse;
};

const getKnowledgeCheckBlocks = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const blocksData = await fetchKnowledgeCheckBlocks();

        console.info(
            ' !!!! GINASAURUS: fetchKnowledgeCheckBlocks RESPONSE: \n' +
                JSON.stringify(blocksData)
        );

        res.send(blocksData);
    } catch (err) {
        next(err);
    }
};

// const getKnowledgeCheckBlocks = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const fullBlocks = await knex("questions")
//       // [questions] text, mediaId, id
//       .select(
//         "questions.id as questionId",
//         "questions.text as questionText",
//         "media.id as mediaId",
//         "media.url as mediaUrl",
//         "media.type as mediaType",
//         "knowledgeCheckBlocks.id as blockId",
//         "knowledgeCheckBlocks.feedback as feedback",
//         knex.raw(`array_agg(answers.id) as "answerIds"`),
//         knex.raw(`array_agg(answers.text) as "answerTexts"`),
//         knex.raw(`array_agg(answers."isCorrect") as "isCorrects"`),
//         knex.raw(`array_agg(answers.pos) as "POSs"`),
//         // "answers.id as answerId",
//         // "answers.text as answerText",
//         // "answers.isCorrect as isCorrect",
//       )
//       // [knowledgeCheckBlocks] feedback, questionId, id
//       .leftJoin(
//         "knowledgeCheckBlocks",
//         "questions.id",
//         "knowledgeCheckBlocks.questionId",
//       )
//       // [answers] text, knowledgeCheckBlockId, isCorrect, pos, id
//       .leftJoin(
//         "answers",
//         "knowledgeCheckBlocks.id",
//         "answers.knowledgeCheckBlockId",
//       )
//       // [media] url, type, id
//       .leftJoin("media", "questions.mediaId", "media.id")
//       .groupBy(
//         "questions.id",
//         "questions.text",
//         "media.id",
//         "media.url",
//         "media.type",
//         "knowledgeCheckBlocks.id",
//         "knowledgeCheckBlocks.feedback",
//       );

//     logger(fullBlocks[0], "server/routes:fullBlocks[0]");

//     // Both ON = 'Error: Cannot set headers after they are sent to the client'
//     // Response for Postman
//     // return res.send.bind(res)(fullBlocks);
//     // res.send.bind(res)(fullBlocks);
//     return fullBlocks;
//   } catch (err) {
//     next(err);
//   }
// };

const getFullBlocks = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const queryResponse = await fetchKnowledgeCheckBlocks();

        console.info(
            ' GINASAURUS: QUERY RESPONSE: \n' + JSON.stringify(queryResponse)
        );

        const parsedBlock = transformKnowledgeCheckBlocks(queryResponse);

        console.info(
            ' GINASAURUS: TRANSFORMED RESPONSE: \n' +
                JSON.stringify(parsedBlock)
        );

        console.info(
            ' GINASAURUS: PARSED RESPONSE: \n' + JSON.stringify(parsedBlock)
        );

        // Both ON = 'Error: Cannot set headers after they are sent to the client'
        // res.send.bind(res)(fullBlocks);
        // res.send.bind(res)(parsedBlock);
        // return parsedBlock;
        res.send(parsedBlock);
    } catch (err) {
        next(err);
    }
};

// Route endpoints to handlers (ex: curl --location 'http://localhost:5001/knowledge-check-blocks')
// router.get('/knowledge-check-blocks', getKnowledgeCheckBlocks)
// router.get('/knowledge-check-blocks-id', getKnowledgeCheckBlocksId)
// router.get('/answers', getAnswers)
// router.get('/media', getMedia)
// router.get('/questions', getQuestions)
// router.get('/get-blocks', getFullBlocks)
router.get('/get-full-blocks', getFullBlocks);
router.get('/knowledge-check-blocks', getKnowledgeCheckBlocks);

router.use(errorHandler);

export default router;

// FETCHERS: Retrieves table data and returns contents as JSON
// const getKnowledgeCheckBlocks = async (req: Request, res: Response) => {
//     const knowledgeCheckBlocks = await knex('knowledgeCheckBlocks')
//     res.setHeader('Access-Control-Allow-Origin', '*')
//     console.log(' ### GINASAURUS: getKnowledgeCheckBlocks: ' + knowledgeCheckBlocks);
//     return res.send.bind(res)(knowledgeCheckBlocks)
//   }

//   const getKnowledgeCheckBlocksId = async (req: Request, res: Response) => {
//     const knowledgeCheckBlocksId = await knex('knowledgeCheckBlocks').select('id');
//     res.setHeader('Access-Control-Allow-Origin', '*')
//     console.log(' ### GINASAURUS: getKnowledgeCheckBlocksId: ' + knowledgeCheckBlocksId);
//     return res.send.bind(res)(knowledgeCheckBlocksId)
//   }

//   const getMedia = async (req: Request, res: Response) => {
//     const media = await knex('media').select('media.id', 'type', 'url')
//     res.setHeader('Access-Control-Allow-Origin', '*')
//     console.log(' ### GINASAURUS: getMedia: ' + media);
//     return res.send.bind(res)(media)
//   }

//   const getAnswers = async (req: Request, res: Response) => {
//     const answers = await knex('answers').select('answers.id', 'knowledgeCheckBlockId', 'text', 'isCorrect', 'pos')
//     res.setHeader('Access-Control-Allow-Origin', '*')
//     console.log(' ### GINASAURUS: getAnswers: ' + answers);
//     return res.send.bind(res)(answers)
//   }

//   const getQuestions = async (req: Request, res: Response) => {
//     const questions = await knex('questions').select('questions.id', 'text', 'mediaId')
//     res.setHeader('Access-Control-Allow-Origin', '*')
//     console.log(' ### GINASAURUS: getQuestions: ' + questions);
//     return res.send.bind(res)(questions)
//   }
