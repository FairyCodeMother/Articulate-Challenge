import express, { Request, Response } from 'express'
import morgan from 'morgan'

import knex from './knex'

const getKnowledgeCheckBlocks = async (req: Request, res: Response) => {
  const knowledgeCheckBlocks = await knex('knowledgeCheckBlocks')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.send(knowledgeCheckBlocks)
}

const app = express()
const port = 5001

app.use(morgan('dev'))

app.get('/knowledge-check-blocks', getKnowledgeCheckBlocks)

app.listen(port, () => console.log(`Listening on port ${port}`))
