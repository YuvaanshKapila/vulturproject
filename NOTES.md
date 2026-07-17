# Vultur — Take-Home Assessment Notes

## Part 1:

### Task 1
- Load all the contacts and parse
    - evne though claude built it its still important to understand what it does and understand what steps its actually taking to do
    - I outlined the instructions I want it to do making sure to split the first part into 3 tasks, then outliend it for task 1, told it to take the csv, use paraparse, define the contact in types, and use the contact worker function to open the csv, use paraparse to tokenize, then turns it into a list and returns the new list. saved to memory 
### Task 2
- Scrape from the live website and parse
    - the readme told me that its built off of React SPA, so I shouldnt try and scrape it form the live html instead look at the source data 
    - found that the website actually has a posting api https://api.ashbyhq.com/posting-api/job-board/stackone but wanting to follow the readme ill jsut get the web data from the source data
    - added roles to types.ts and then made anohter worker file that has extracts the app data by downlaoding the page, strips the html into text, then used paraparse to make it clean by using build in json.parse
