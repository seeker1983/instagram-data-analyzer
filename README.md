# Description
    Analyzes relations from instagram data.
## How it works.
    Source csv file should be provided. Example *example.csv*

## Installation
1. Install [node.js](https://nodejs.org)
2. Clone this repository.

    git clone https://github.com/seeker1983/instagram-data-analyzer.git
    
3. Enter repository folder

    cd instagram-data-analyzer
    
4. Install dependencies

    npm install
    
5. Try example file:

    node analyze.js example.csv
    
## Using analyzer

Upload you own file and try it

    node analyze.js <YOUR-DATA-FILE.csv>

Data file example is *example.csv*

If everything is correct, following files should be created
- user_mentions.csv
- mention_users.csv
- user_partners.csv
- partner_users.csv


## Using filter

Upload input and user list and try it

    node filter.js <YOUR-DATA-FILE.csv> <USER-LIST.csv>

Data file example is *example.csv*

User file example is *example_users.csv*

If everything is correct, following files should be created
- user_relations.csv
- user_posts.csv




