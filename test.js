//Require the dev-dependencies
process.env.NODE_ENV = 'test';
const chai = require('chai');
const request = require("request");
const expect = require("chai").expect;
const port = 3000;

//check query values for errors
const tagError = "Tags parameter is required";
const sortError = "sortBy parameter is invalid";
const directionError = "direction parameter is invalid";

const tags = "history,tech";
const sort = "id";
const direction = "asc"

describe('Testing GET /restaurants', function () {
	
	it('Empty tag test', function(done) {
		
		request.get(
			{url:`http://localhost:${port}/api/posts?direction=${direction}&sortBy=${sort}`},
			
			function(error, res, body) {
				expect(res.statusCode).to.equal(400);
				expect(JSON.parse(body).error).to.equal(tagError);
				done();
		});
		
	});
	
	it('Bad sortBy value', function(done) {
		request.get(
			{url:`http://localhost:${port}/api/posts?tags=${tags}&direction=${direction}&sortBy=dne`},
			
			function(error, res, body) {
				expect(res.statusCode).to.equal(400);
				expect(JSON.parse(body).error).to.equal(sortError);
				done();
			}
		);
		
	});
	
	it('Bad direction value', function(done) {
		
		request.get(
			{url:`http://localhost:${port}/api/posts?tags=${tags}&direction=ascdne&sortBy=${sort}`},
			
			function(error, res, body) {
				expect(res.statusCode).to.equal(400);
				expect(JSON.parse(body).error).to.equal(directionError);
				done();
		});
		
	});
});


	
	

