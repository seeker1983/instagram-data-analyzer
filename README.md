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
    
If everything is correct, following files should be created
- user_mentions.csv
- mention_users.csv
- user_partners.csv
- partner_users.csv

6. Upload you own file and try it

    node analyze.js <YOUR-FILE.csv>