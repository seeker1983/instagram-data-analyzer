const _ = require('lodash');
const fastcsv = require('fast-csv');
const fs = require('fs');

function is_ad_caption(s) {
  return s.match(/#(ad|partner|spon)/i);
}

function xd(v){console.log(v); process.exit();}

if(process.argv.length < 4) {
	xd(`Filter input file according to given file of users.
Example input: example.csv
Example users: example_users.csv

Usage: node filter.js <input.csv> <users.csv>
 - input: input csv file
 - users: users csv file
Output:
 - user_relations.csv - list of all relevant partner/mentions for each of the users specified
 - user_posts.csv - list of appropriate relevant posts
`)
}

const INPUT = process.argv[2];
const USERS_LIST = process.argv[3];

var user_list = fs.readFileSync(USERS_LIST, {encoding: 'utf-8'}).split('\n').map(Function.prototype.call, String.prototype.trim);

var user_map = _.zipObject(user_list, user_list);

var posts = _.zipObject(user_list, user_list.map(e => []));

const INPUT_CSV_DELIMITER = ';';
const OUTPUT_CSV_DELIMITER = ',';
const CHILD_DELIMITER = ' ';

var map = {};
var headers = false;

fs.createReadStream(INPUT)
  .pipe(fastcsv.parse({ headers: true, delimiter: INPUT_CSV_DELIMITER }))
  .on('data', row => {
    headers = headers || Object.keys(row);

    var user = row['username'];
    var caption = row['caption'];
    var mentions = row['mentions'];
    var partner = row['partner'];

    if(user in user_map) {
      if(partner != '') {
        _.set(map, ['user_relations', user, partner], 1);
        posts[user].push(_.concat('partner', _.values(row)));
      }

      if(is_ad_caption(caption))
        mentions.split(',').map(v => v.trim()).filter(_.identity).map(function(mention){
          _.set(map, ['user_relations', user, mention], 1);
          posts[user].push(_.concat('mention', _.values(row)));
        })      
    }
    
  })
  .on('end', () => {
  
      /* Flatten relations */
    var relations = _.mapValues(map, function(relation){
  	  return _.sortBy(_.map(_.mapValues(relation, Object.keys), (value, key) => _.concat(key, value.length, value.join(CHILD_DELIMITER)))
  	  	, 1).reverse()
  	})

      /* Save relations */
  	_.map(relations, (rows, relation) => {
	    var parent = relation.split('_')[0];
	    var child = relation.split('_')[1];
	    var headers = [parent, 'total ' + child, child];

  		var fname = relation + '.csv';

  		(function(fname) {
  		fastcsv.writeToPath(fname, rows, {headers: headers, delimiter: OUTPUT_CSV_DELIMITER })
  		    .on('error', err => console.error(err))
  		    .on('finish', () => console.log(fname + ' written.'));
  		})(fname)
  	})

    var rows = _.flatMap(posts);
      /* Save posts */
    (function(fname) {
      fastcsv.writeToPath(fname, rows, {headers: _.concat('relation_type', headers), delimiter: OUTPUT_CSV_DELIMITER })
        .on('error', err => console.error(err))
        .on('finish', () => console.log(fname + ' written.'));
    })('user_posts.csv')
  
  })



