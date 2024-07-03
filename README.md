# Welcome to the Rise Developer Challenge!

## Part 1: The Coding Challenge

Rise allows customers to create responsive single page, vertically scrolling lessons which include a variety of modular elements called Blocks. These Blocks can be as simple as text and image layouts, videos, image galleries, to more complex components like interactive flash cards, tabbed modules and accordions.

Your goal is to implement one of Rise's interactive blocks (see [this Rise lesson](https://rise.articulate.com/share/YaZWnWdc2El8-M-4gcZ9eQD0lB9iRXDn#/lessons/lZ0qX7FvbGICXnk-30conqfR_JAFagbh) for an example).

At a minimum, your implementation should:

-   [ ] Decorate the knowledge block returned from [`getKnowledgeCheckBlocks`](/server/src/index.ts) with `questions`, `answers`, and `media` from the Postgress Database.
-   [ ] Populate your interactive block's configuration from the provided REST API (see [`/server`](/server/src/))
-   [ ] Use `react` and TypeScript to create a UI that replicates [the knowledge check block from this sample lesson](https://rise.articulate.com/share/YaZWnWdc2El8-M-4gcZ9eQD0lB9iRXDn#/lessons/lZ0qX7FvbGICXnk-30conqfR_JAFagbh)
    -   You must use React for your UI components
-   [ ] Please stick to the visual styles we have in place. It's important that you implement the feature in full, so pay close attention to the details including how your block behaves across screen sizes. Responsiveness is a core component of Rise.
-   [ ] In addition to implementing the knowledge check block, your solution must also maintain its visual state across page refreshes. I.e., if you interact with your block and then refresh the page, the UI state of your interactive block should be the same. Extend the provided REST API to achieve this
    -   Your interactive block's UI state must be persisted via the REST API (no storing it in localStorage, cookies, etc.)
-   [ ] Once completed, push your solution to the Github classroom for us to review. If additional setup steps beyond the ones provided are required, please include them in your submission.

What you choose to implement from there is up to you. :)

### Implementation notes

-   You only need to implement the box under the "Knowledge Check Block" heading with the image, choices, and feedback; don't worry about implementing the sidebar or lesson header.
-   Your interactive block implementation should live in the [`/client`](/client) directory, an app skeleton has been provided in the directory
-   The beginnings of a REST API lives in [`/server`](/server/src/) and is reachable at http://localhost:5001
    -   The REST API currently only returns the parent `knowledgeCheckBlock` with no questions, answers, or media tied to it.

### Getting started

The challenge should take between 3 and 5 hours depending on experience level and we prefer you not devote more time than that. Instead, we ask that you either self-review your PR or share notes in the "Candidate Notes" section below about features or other details that were omitted due to time constraints. This will give our team the opportunity to see how you prioritize you work and should limit the time commitment required.

Lastly, a "Feedback" pull request is automatically created by GitHub Classroom; please commit your work to the `master` branch and **do not merge** the pull request. When you are satisfied with your solution, share the link to the Feedback pull request with the recruiter. Reviewers will be able to review the diff in the pull request in GitHub.

#### Install Docker

Install [Docker Community Edition](https://hub.docker.com/search?q=&type=edition&offering=community)

-   :apple: [macOS](https://hub.docker.com/editions/community/docker-ce-desktop-mac)
-   :penguin: [Linux](https://hub.docker.com/search/?type=edition&offering=community&operating_system=linux)
-   🪟 [Windows](https://hub.docker.com/editions/community/docker-ce-desktop-windows)

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

### Project setup

Determine what the ask is and what work that entails. Extract for my notes, including an updated AC list for myself:

**AC**

-   [ ] Decorate the knowledge block returned from `/server/src/index.ts:getKnowledgeCheckBlocks` with `questions`, `answers`, and `media` from DB
-   [ ] Block must be interactive
-   [ ] Populate block's configuration using provided REST API (`/server/src/`)
-   [ ] Use `react` and TypeScript to create UI
-   [ ] Use React to create UI components
-   [ ] Block replicates the knowledge check block from sample lesson:
    -   [ ] Block adheres to existing visual styles
-   [ ] Block is responsive
-   [ ] Extend the provided REST API to maintain visual state across page refreshe
    -   I.e., if you interact with your block and then refresh the page, the UI state of your interactive block should stay the same.
    -   Block's UI state must be persisted via the REST API (no storing it in localStorage, cookies, etc.)
-   [ ] Once completed, push to the Github classroom for review.
-   [ ] Include any additional setup steps (beyond the ones provided) that are required to run submission.

Grab all relevant tables and determine relationship possibilities that serve this problem Goal: everything in a single query.

-   A question can have:
    -   Many answers
    -   One media item
    -   One feedback item (displayed regardless of answer)
-   Answers are right or wrong

Process & Steps:

-   Phase 1
    -   Backend
        -   Spin it up and kick the tires
            -   Add errorHandling for TDD, etc
            -   Break out the routing so the frontend can hit it via api
            -   Refactor index to use new routes
    -   Frontend
        -   Create Logger for tracking payload
        -   Create api.ts to use new routes
        -   Start components/KnowledgeBlock
            -   Try to follow styling, conventions, etc from example
            -   Uses the API
        -   Use new KnowledgeBlock in App
-   Phase 2
    -   Surfacing block values
    -   Refine styling
    -   Add interfaces for the question block parts
    -   Add catches
    -   Have separate routes for queries and frontend
    -   Add controller and logger
-   Phase 3
    -   Refine query
    -   Use the final route version
    -   Destructure components
    -   Optimizations
    -   State management & handles
    -   Clean up
    -   Commenting
