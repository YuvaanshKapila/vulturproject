# Vultur — Take-Home Assessment Notes

## Part 1:
evne though claude built it its still important to understand what it does and understand what steps its actually taking to do
### Task 1
- Load all the contacts and parse
    - I outlined the instructions I want it to do making sure to split the first part into 3 tasks, then outliend it for task 1, told it to take the csv, use papaparse, define the contact in types, and use the contact worker function to open the csv, use paraparse to tokenize, then cleans it into a list and returns the new list. 
### Task 2
- Scrape from the live website and parse
    - the readme told me that its built off of React SPA, so I shouldnt try and scrape it form the live html instead look at the source data 
    - found that the website actually has a posting api https://api.ashbyhq.com/posting-api/job-board/stackone but wanting to follow the readme ill jsut get the web data from the source data
    - added Role to types.ts, then made a worker that extrcts the embedded window.__appData from each page, uses JSON.parse to read it, and strips the HTML description into clean text

### Task 3
- Type
    - alredy  defined the ts types in types.ts with sub types as well explained in previous notes 
    - defines the typescript types like contact and role with subtypes like experience and education for btoh worker functiosn to use. 

## Part 2:

### Task 1
- Profile text
    - qwen takes plain text, not json so converted each contact and role into one text string (profiletext.ts)
    - left out noise from it like linkedin url  id and only relevent fields and skipped empty fields

### Task 2
- Embed the contacts with Qwen
- ran all contact profile texts through qwen3 embedding model with ollama and saved the vectors to a json, chose 4b over 0.6b for better semantics
- never have to rerun cause its a static file not live like the webiste
- turns a live role into a vector using the same qwen model as the
contacts. unlike contacts (embedded once and saved), roles are embedded fresh
each time it runs
### Task 3
- Cosine similarity
- all math, comapares 2 vectors and returns, how close they point, the model makes the vectors this measures them, used fake inputs, results came out well
### Task 4
- Scoring function
- this part i have to decide fully myself as respected by the readme, so if i had to choose 5 signals i wanted to explain why something matched i would say 
1. is semantics most important because you have to see if they acutally match the rating, proven it works through tests
2. experience relevance to see if past job titles actually match the role
3. seniroity juinor vs seinor roles
4. location not as important as most jobs now a day can be hybrid or remote 
5. avaialbiltiy more important as someone needs to be open to work
- I also hjave ot giver them waitings 
- combines 5 signals into one final score (0-100) with a breakdown so the ui can
- semantic match i would weigh at 50%
- experience relevance at 25%
- availability at 10 % 
- seinority at 10%
- location at 5%
total = 100 × ( semantic×0.50 + experience×0.25 + seniority×0.10 + location×0.05 + availability×0.10 )

### Task 5
- Rank
- now makes a funciton that runs everything toghether adn returns the top prospect, instead of running on one role. 

## Part 3:
- precomputed the role vectors into a json so if the persosn grading doesnt have ollama it still works, and if a new role isnt cached it falls back to embeding it live with ollama

### Task 1
- Roles list (home page)

### Task 2
- Ranked candidates for a selected role

### Task 3
- Score breakdown (why they matched)

### Task 4
- Styling / brand colors
