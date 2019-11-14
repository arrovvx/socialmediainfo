/* Hatchway Backend Assessment server.js */
'use strict';
const log = console.log;
const express = require('express')
const request = require("request");


// Express
const port = process.env.PORT || 3000
const app = express();


function fetchTagObj(name){
	return {
		url:`https://hatchways.io/api/assessment/blog/posts?tag=${name}`
	};
}


/* 
GET /api/posts
Request query expects:
{
	"tags": <A comma separated list of tags>
	"sortBy": (optional) <id,reads,likes,popularity>
	"direction": (optional) <desc,asc>
}
*/
app.get('/api/posts', (req, res) => {
	
	//Assign the queried value or the default value
	const tags = req.query.tags ? req.query.tags.split(','):[]; 
	const sortBy = req.query.sortBy ? req.query.sortBy: "id";
	const direction = req.query.direction ? req.query.direction: "asc";
	
	//check query values for errors
	if (req.query.tags === undefined) 
		res.status(400).send({error:"Tags parameter is required"});
	
	else if (!["id", "reads", "likes", "popularity"].includes(sortBy)) 
		res.status(400).send({error:"sortBy parameter is invalid"});
	
	else if (!["desc", "asc"].includes(direction)) 
		res.status(400).send({error:"direction parameter is invalid"});
	
	else { 
		//all parameters are valid, querying hatchways API
		log("Querying Hatchways for tags:", tags);
	
		//Query hatchways API asynchronous 
		let promises = [];
		
		for (let i = 0; i < tags.length; i++){
			promises.push(new Promise(function(resolve, reject) {
				request.get(fetchTagObj(tags[i]), function(err, res) {
					
					if (err)
						reject();
					else 
						resolve(res.request.response.body);
					
				});
			}));
		}
		
		//handle async when all promises are returned
		Promise.all(promises).then(function(results) {
			
			let allResults = JSON.parse(results[0]).posts
			for (let i = 1; i < results.length; i++){
				allResults.push(...JSON.parse(results[i]).posts)
			}
			
			//create a set that only contains unique values of the concatenated array
			//and sort it using the compare function and the acquired direction parameter
			res.send({posts:[...new Set(allResults.map(JSON.stringify))].map(JSON.parse).sort(
				(a,b) => {
					return (direction == 'desc') ? b[sortBy] - a[sortBy]:a[sortBy] - b[sortBy];
				}
			)});
		}).catch((err) => {
			
			log("Error Querying Hatchways for tags:", err);
			res.status(400).send({error:"Hatchways API failed to return query"})
		});
	}	
})

// GET /api/ping
app.get('/api/ping', (req, res) => {
	
	res.send({success:true})
})

//Start server on specified port
app.listen(port, () => {
	
	log(`Listening on port ${port}...`)
});
