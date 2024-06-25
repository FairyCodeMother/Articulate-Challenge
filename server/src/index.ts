import express, { Request, Response } from 'express'
import morgan from 'morgan'   // HTTP request logging middleware (maybe make a middleware dir later)
import knex from './knex'     // Interacts with database


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

const getFullBlocks = async (req: Request, res: Response) => {
  const fullBlocks = await knex('knowledgeCheckBlocks')
    .join('answers', 'answers.knowledgeCheckBlockId', 'knowledgeCheckBlocks.id')
    .join('questions', 'questions.id', 'knowledgeCheckBlocks.questionId')
    .join('media', 'media.id', 'questions.mediaId')

  console.log(' ### GINASAURUS: getBlocks: ' + fullBlocks);
  return res.send.bind(res)(fullBlocks)
}


const app = express()
const port = 5001

app.use(morgan('dev'))  // Starts server in dev mode (logs to console)

// Routes the GET endpoints to handlers (ex: curl --location 'http://localhost:5001/knowledge-check-blocks')
app.get('/knowledge-check-blocks', getKnowledgeCheckBlocks)
app.get('/knowledge-check-blocks-id', getKnowledgeCheckBlocksId)
app.get('/answers', getAnswers)
app.get('/media', getMedia)
app.get('/questions', getQuestions)
app.get('/get-blocks', getFullBlocks)


console.log(" ### GINASAURUS: server/src/index ---");
app.listen(port, () => console.log(`Listening on port ${port}`))  // Listens & logs