import { Router, Request, Response } from 'express'
import knex from './knex' // Interacts with database

const router = Router()

// FETCHERS: Retrieves table data and returns contents as JSON
const getKnowledgeCheckBlocks = async (req: Request, res: Response) => {
    const knowledgeCheckBlocks = await knex('knowledgeCheckBlocks')
    res.setHeader('Access-Control-Allow-Origin', '*')
    console.log(' ### GINASAURUS: getKnowledgeCheckBlocks: ' + knowledgeCheckBlocks);
    return res.send.bind(res)(knowledgeCheckBlocks)
  }
  
  const getKnowledgeCheckBlocksId = async (req: Request, res: Response) => {
    const knowledgeCheckBlocksId = await knex('knowledgeCheckBlocks').select('id');
    res.setHeader('Access-Control-Allow-Origin', '*')
    console.log(' ### GINASAURUS: getKnowledgeCheckBlocksId: ' + knowledgeCheckBlocksId);
    return res.send.bind(res)(knowledgeCheckBlocksId)
  }
  
  const getMedia = async (req: Request, res: Response) => {
    const media = await knex('media').select('media.id', 'type', 'url')
    res.setHeader('Access-Control-Allow-Origin', '*')
    console.log(' ### GINASAURUS: getMedia: ' + media);
    return res.send.bind(res)(media)
  }
  
  const getAnswers = async (req: Request, res: Response) => {
    const answers = await knex('answers').select('answers.id', 'knowledgeCheckBlockId', 'text', 'isCorrect', 'pos')
    res.setHeader('Access-Control-Allow-Origin', '*')
    console.log(' ### GINASAURUS: getAnswers: ' + answers);
    return res.send.bind(res)(answers)
  }
  
  const getQuestions = async (req: Request, res: Response) => {
    const questions = await knex('questions').select('questions.id', 'text', 'mediaId')
    res.setHeader('Access-Control-Allow-Origin', '*')
    console.log(' ### GINASAURUS: getQuestions: ' + questions);
    return res.send.bind(res)(questions)
  }
  
  // SELECT
  // 	q.id AS q_id
  // 	, a."id" AS a_id
  // 	, m.id AS m_id
  // 	, kcb."id" AS kcb_id
  // 	, a."isCorrect" AS a_is_corr
  // 	, a."pos" AS a_pos
  // 	, a."text" AS a_txt
  // 	, q.text AS q_txt
  // 	, m.url AS m_url
  // 	, m.type AS m_type
  // 	, kcb."feedback"	
  // FROM questions AS q
  // FULL JOIN "knowledgeCheckBlocks" AS "kcb" ON "q".id = "kcb"."questionId"
  // FULL JOIN answers AS "a" ON kcb.id = a."knowledgeCheckBlockId"
  // FULL JOIN media AS "m" ON q."mediaId" = m.id
const getFullBlocks = async (req: Request, res: Response) => {
    const fullBlocks = await knex('questions').select(
        'questions.id', 'answers.id',
        'media.id', 'knowledgeCheckBlockId',
        'answers.text', 'answers.isCorrect', 'answers.pos',
        'questions.text', 'media.url', 'media.type', 'feedback'
    )
    .fullOuterJoin('knowledgeCheckBlocks', 'questions.id', 'knowledgeCheckBlocks.questionId')
    .fullOuterJoin('answers', 'knowledgeCheckBlocks.id', 'answers.knowledgeCheckBlockId')
    .fullOuterJoin('media', 'questions.mediaId', 'media.id')
  
    console.log(' ### GINASAURUS: getBlocks: ' + fullBlocks);
    return res.send.bind(res)(fullBlocks)
}

// Route endpoints to handlers (ex: curl --location 'http://localhost:5001/knowledge-check-blocks')
router.get('/knowledge-check-blocks', getKnowledgeCheckBlocks)
router.get('/knowledge-check-blocks-id', getKnowledgeCheckBlocksId)
router.get('/answers', getAnswers)
router.get('/media', getMedia)
router.get('/questions', getQuestions)
// router.get('/get-blocks', getFullBlocks)
router.get('/get-full-blocks', getFullBlocks)

export default router
