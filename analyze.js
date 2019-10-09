const _ = require('lodash');
const fastcsv = require('fast-csv');
const fs = require('fs');

function is_ad_caption(s) {
  return s.match(/#(ad|partner|spon)/i);
}

function xd(v){console.log(v); process.exit();}

if(process.argv.length < 3) {
	xd('Processes input file and creates user/mention and user/partner pairs.\nExample input: example.csv\n\nUsage: node analyze.js <input>\n - input: input csv file')
}

//const INPUT = 'csv_small.csv';
const INPUT = process.argv[2];

const INPUT_CSV_DELIMITER = ';';
const OUTPUT_CSV_DELIMITER = ',';
const CHILD_DELIMITER = ' ';

var map = {};

fs.createReadStream(INPUT)
  .pipe(fastcsv.parse({ headers: true, delimiter: INPUT_CSV_DELIMITER }))
  .on('data', row => {
    var user = row['username'];
    var caption = row['caption'];
    var mentions = row['mentions'];
    var partner = row['partner'];
    
    if(partner != '') {
      _.set(map, ['user_partners', user, partner], 1);
      _.set(map, ['partner_users', partner, user], 1);
    }

    if(is_ad_caption(caption))
      mentions.split(',').map(v => v.trim()).filter(_.identity).map(function(mention){
          _.set(map, ['user_mentions', user, mention], 1);
          _.set(map, ['mention_users', mention, user], 1);
      })      
  })
  .on('end', () => {
	var relations = _.mapValues(map, function(relation){
	  return _.sortBy(_.map(_.mapValues(relation, Object.keys), (value, key) => _.concat(key, value.length, value.join(CHILD_DELIMITER)))
	  	, 1).reverse()
	})
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
  
  })



