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

