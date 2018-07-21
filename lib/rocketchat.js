'use strict';
require('dotenv').config();
const request = require('request');
const stats = require('./stats.js');

module.exports = {

	urls: {
		login: process.env.ROCKETCHAT_API_URL + 'login',
		post: process.env.ROCKETCHAT_API_URL + 'chat.postMessage'
	},

	login: function(callback){

		request.post({ 
			url: this.urls.login, 
			headers: {
				'Content-type': 'application/json'
			},
			form: {
				user: process.env.ROCKETCHAT_USERNAME,
				password: process.env.ROCKETCHAT_PASSWORD
			}
		}, callback);

	},

	post: function(channel, text){

		const _parent = this;

		this.login(function(err, res, body){

			const data = JSON.parse(body).data;
  			const token = data.authToken;
  			const userId = data.userId;
  			
  			request.post({ 
				url: _parent.urls.post, 
				headers: {
					'Content-type': 'application/json',
					'X-Auth-Token': token,
					'X-User-Id': userId

				},
				form: {
					channel: channel,
					text: text
				}
			}, function(er, re, bo){
				console.log('Rocketchat Post response:');
				console.log({er, re, bo});
			});

  		});
  		
	}

};