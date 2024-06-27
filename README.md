# For Me

```
docker-compose up
docker-compose down
docker-compose up --build
docker ps // for the names

// [Server container] Seed the DB
docker exec -it server-app-1 bash
> yarn knex migrate:latest
> yarn knex seed:run

// [Server container] Confirm DB contents
docker exec -it server-postgres-1 bash
> psql -h localhost -p 5432 -U postgres
  > \dt

curl --location 'http://localhost:5001/knowledge-check-blocks'

rm yarn.lock
yarn install
yarn add cors
```

## Step 1: Project setup

### Make a ticket/Identify the work

Determine what the ask is and what work that entails. Extract for my notes:

**Blocks**- modular elements for responsive SPA (vertical-scrolling)

- Simple: text and image layouts, videos, image galleries
- Complex: interactive flash cards, tabbed modules and accordions

**AC**

- [ ] Decorate the knowledge block returned from `/server/src/index.ts:getKnowledgeCheckBlocks` with `questions`, `answers`, and `media` from DB
- [ ] Block must be interactive
- [ ] Populate block's configuration using provided REST API (`/server/src/`)
- [ ] Use `react` and TypeScript to create UI
- [ ] Use React to create UI components
- [ ] Block replicates the knowledge check block from sample lesson:
  - [ ] Block adheres to existing visual styles
- [ ] Block is responsive
- [ ] Extend the provided REST API to maintain visual state across page refreshe
  - I.e., if you interact with your block and then refresh the page, the UI state of your interactive block should stay the same.
  - Block's UI state must be persisted via the REST API (no storing it in localStorage, cookies, etc.)
- [ ] Once completed, push to the Github classroom for review.
- [ ] Include any additional setup steps (beyond the ones provided) that are required to run submission.

**Implementation notes**

- Only implement the box under the "Knowledge Check Block" heading

  - Use the image, choices, and feedback
  - Don't worry about implementing the sidebar or lesson header

- Interactive block implementation should live `/client` directory

  - App skeleton is provided

- REST API skeleton in `/server` and is reachable at http://localhost:5001
  - Currently only returns the parent `knowledgeCheckBlock`
    - No questions, answers, or media tied to it

## Step 2: Hook up the back

> Do the provided setup steps and take a look at what's provided, including the database.

Create a local git repo:

```
git init  // new local repo

// update .gitignore as needed

git add
git commit -m "msg"
```

**Client**

```
# Setup
cd client
nvm install
yarn install

# Run
yarn start
```

**Server**

```
# Make sure you're in the right dir!!
cd server

# Run server
docker-compose up

# Check db
docker exec -it server-postgres-1 bash
psql -h localhost -p 5432 -U postgres
\dt

localhost:7482

------------ HANDY QUERIES ------------
<!-- Grab all relevant tables & their cols to check out their relationship possibilities: -->
SELECT table_name, STRING_AGG(column_name, ', ') AS columns
FROM information_schema.columns
WHERE table_schema = 'public'
-- WHERE table_name IN (
--     SELECT tablename
-- 	FROM pg_tables
-- 	WHERE schemaname = 'public')
AND table_name NOT LIKE '%knex%'
GROUP BY table_name;



SET search_path=public;

SELECT
	kcb."id" AS kcb_id,
	a."id" AS a_id,
	a."isCorrect" AS a_is_corr,
	a."pos" AS a_pos,
	q.id AS q_id,
	m.id AS m_id,
	m.type AS m_type,
	m.url AS m_url,
	kcb."feedback",
	a."text" AS a_txt,
	q.text AS q_txt
	-- q."mediaId" AS q_mid,
	-- kcb."questionId" AS kcb_qid,
	-- a."knowledgeCheckBlockId" AS "a_kcb_id",
FROM "knowledgeCheckBlocks" AS "kcb"
	-- [knowledgeCheckBlocks] feedback, questionId, id
FULL JOIN answers AS "a"
	-- [answers] text, knowledgeCheckBlockId, isCorrect, pos, id
	ON kcb.id = a.id
FULL JOIN questions AS "q"
	-- [questions] text, mediaId, id
	ON kcb."questionId" = q.id
FULL JOIN media AS "m"
	-- [media] url, type, id
	ON q."mediaId" = m.id

/wq
/q
```

Docker installs and starts Yarn.

Yarn runs the scripts in package.json:

1. Spin up the Express server in `server/src/index.ts`
   - Listen on port 5001
   - Start in dev mode to get console logs
   - Route endpoints to their handlers (`http://localhost:5001/endpoint`)
     - GET `/knowledge-check-blocks` => `getKnowledgeCheckBlocks()`
       - Retrieves "knowledgeCheckBlocks" table data and returns the contents as JSON
2. Database (on port 5432)
   - Use Knex to migrate the db
   - Use Knex to seed the db
   - Start postGres
   - `yarn start`

Check the response when I hit the provided endpoint:

```
// curl --location 'http://localhost:5001/knowledge-check-blocks'
[
   {
       "id": "e50acfd3-a870-4cad-9ef2-a2ca30d24d81",
       "questionId": "a8ebfafd-d81a-42ec-b54c-c14d007cd54e",
       "feedback": "I just love cookies and a warm cup of coffee!"
   }
]
```

Add more fetchers: The server uses Knex to connect to, and seed, the database.
Tables to fetch from:

- answers
- knowledgeCheckBlocks
- media
- questions

Start taking the responses apart and seeing how the tables relate to each other. I want to reduce how often I'll need to call. Grab everything in one go with Knex query.

Break out a new `routes.ts` and a `middleware` directory. Setting up the backend as fully as possible to simplify implementing the frontend.

Frontend:

- Block- container
  - Block- col
    - Quiz- card
      - Card- row
      - Card- media
        - Media zoom
      - Card- horiz rule
      - Card- interactive
        - Answer- choices
        - Answer- submit
        - Answer- feedback
        - Answer- retake

<!--
## Part 1: The Coding Challenge

Rise allows customers to create responsive single page, vertically scrolling lessons which include a variety of modular elements called Blocks. These Blocks can be as simple as text and image layouts, videos, image galleries, to more complex components like interactive flash cards, tabbed modules and accordions.

Your goal is to implement one of Rise's interactive blocks (see [this Rise lesson](https://rise.articulate.com/share/YaZWnWdc2El8-M-4gcZ9eQD0lB9iRXDn#/lessons/lZ0qX7FvbGICXnk-30conqfR_JAFagbh) for an example).

At a minimum, your implementation should:
- [ ] Decorate the knowledge block returned from [`getKnowledgeCheckBlocks`](/server/src/index.ts) with `questions`, `answers`, and `media` from the Postgress Database.
- [ ] Populate your interactive block's configuration from the provided REST API (see [`/server`](/server/src/))
- [ ] Use `react` and TypeScript to create a UI that replicates [the knowledge check block from this sample lesson](https://rise.articulate.com/share/YaZWnWdc2El8-M-4gcZ9eQD0lB9iRXDn#/lessons/lZ0qX7FvbGICXnk-30conqfR_JAFagbh)
  - You must use React for your UI components
- [ ] Please stick to the visual styles we have in place. It's important that you implement the feature in full, so pay close attention to the details including how your block behaves across screen sizes. Responsiveness is a core component of Rise.
- [ ] In addition to implementing the knowledge check block, your solution must also maintain its visual state across page refreshes. I.e., if you interact with your block and then refresh the page, the UI state of your interactive block should be the same. Extend the provided REST API to achieve this
  - Your interactive block's UI state must be persisted via the REST API (no storing it in localStorage, cookies, etc.)
- [ ] Once completed, push your solution to the Github classroom for us to review. If additional setup steps beyond the ones provided are required, please include them in your submission.

What you choose to implement from there is up to you. :)

### Implementation notes

- You only need to implement the box under the "Knowledge Check Block" heading with the image, choices, and feedback; don't worry about implementing the sidebar or lesson header.
- Your interactive block implementation should live in the [`/client`](/client) directory, an app skeleton has been provided in the directory
- The beginnings of a REST API lives in [`/server`](/server/src/) and is reachable at http://localhost:5001
  - The REST API currently only returns the parent `knowledgeCheckBlock` with no questions, answers, or media tied to it.

### Getting started

The challenge should take between 3 and 5 hours depending on experience level and we prefer you not devote more time than that. Instead, we ask that you either self-review your PR or share notes in the "Candidate Notes" section below about features or other details that were omitted due to time constraints. This will give our team the opportunity to see how you prioritize you work and should limit the time commitment required.

Lastly, a "Feedback" pull request is automatically created by GitHub Classroom; please commit your work to the `master` branch and **do not merge** the pull request. When you are satisfied with your solution, share the link to the Feedback pull request with the recruiter. Reviewers will be able to review the diff in the pull request in GitHub.

#### Install Docker

Install [Docker Community Edition](https://hub.docker.com/search?q=&type=edition&offering=community)

- :apple: [macOS](https://hub.docker.com/editions/community/docker-ce-desktop-mac)
- :penguin: [Linux](https://hub.docker.com/search/?type=edition&offering=community&operating_system=linux)
- 🪟 [Windows](https://hub.docker.com/editions/community/docker-ce-desktop-windows)

#### To get the Client up and running on your dev machine:

1. `cd client`
1. `nvm install`
1. `yarn install` (or `npm install`)
1. `yarn start` (or `npm start`)
1. If `yarn start` is throwing errors, you may need to run: `npm_config_yes=true npx yarn-audit-fix`

The client will be available at port 3000

#### To get the REST API up and running on your dev machine:

1. `cd server`
1. `docker-compose up`

The server will be available at port 5001 and the database will be available at port 7482

### Rebuilding Docker Containers

If you install any new packages or add a new database migration file you'll want to rebuild the docker containers. To do so:

1. Stop your docker containers with `CMD + C` or `CTRL + C`
1. `docker-compose down`
1. `docker-compose up --build`

## Part 2: Discuss with Team

You will discuss your code and explain your decisions to a small group of developers and stakeholders at Articulate. The format is modeled after the way we conduct pairing sessions and is meant to give you a glimpse into the way we work. We are SUPER friendly and it will be a fun conversation.

# Candidate Notes

<your notes here> -->
