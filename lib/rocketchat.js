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

	post: function(channel, title, footer, instrument, tickSize, date, n, close, c2cModel, yzModel, callback){

		const _parent = this;

		const c2cSigmas = {
		    threeUp: close + ((c2cModel.mean + c2cModel.stdDev) * 3),
		    twoUp: close + ((c2cModel.mean + c2cModel.stdDev) * 2),
		    oneUp: close + (c2cModel.mean + c2cModel.stdDev),
		    oneDown: close - (c2cModel.mean + c2cModel.stdDev),
		    twoDown: close - ((c2cModel.mean + c2cModel.stdDev) * 2),
		    threeDown: close - ((c2cModel.mean + c2cModel.stdDev) * 3),
		};

		const yzSigmas = {
		    threeUp: close + ((yzModel.mean + yzModel.stdDev) * 3),
		    twoUp: close + ((yzModel.mean + yzModel.stdDev) * 2),
		    oneUp: close + (yzModel.mean + yzModel.stdDev),
		    oneDown: close - (yzModel.mean + yzModel.stdDev),
		    twoDown: close - ((yzModel.mean + yzModel.stdDev) * 2),
		    threeDown: close - ((yzModel.mean + yzModel.stdDev) * 3),
		};


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
					text: `*${title}*`,
					attachments: [

					{
				      "color": "#fffff",
				      "text": '*Close-to-Close*',
				    },
				    {
				      "color": "#5AC24D",
				      "fields": [
				        {
				          "title": "3 Sigma UP",
				          "value": stats.display(c2cSigmas.threeUp, tickSize)
				        },
				        {
				          "title": "2 Sigma UP",
				          "value": stats.display(c2cSigmas.twoUp, tickSize)
				        },
				        {
				          "title": "1 Sigma UP",
				          "value": stats.display(c2cSigmas.oneUp, tickSize)
				        }
				      ],
				    },
				    {
				      "color": "#ffffff",
				      "fields": [
				        {
				          "title": "Last Close",
				          "value": stats.display(close, tickSize)
				        }
				      ]
				    },
				    {
				      "color": "#ff0000",
				      "fields": [
				        {
				          "title": "1 Sigma DOWN",
				          "value": stats.display(c2cSigmas.oneDown, tickSize)
				        },
				        {
				          "title": "2 Sigma DOWN",
				          "value": stats.display(c2cSigmas.twoDown, tickSize)
				        },
				        {
				          "title": "3 Sigma DOWN",
				          "value": stats.display(c2cSigmas.threeDown, tickSize)
				        }
				      ]
				    },

					{
				      "color": "#ffffff",
				      "text": '---',
				    },


					{
				      "color": "#ffffff",
				      "text": '*Yang-Zhang*',
				    },
				    {
				      "color": "#5AC24D",
				      "fields": [
				        {
				          "title": "3 Sigma UP",
				          "value": stats.display(yzSigmas.threeUp, tickSize)
				        },
				        {
				          "title": "2 Sigma UP",
				          "value": stats.display(yzSigmas.twoUp, tickSize)
				        },
				        {
				          "title": "1 Sigma UP",
				          "value": stats.display(yzSigmas.oneUp, tickSize)
				        }
				      ],
				    },
				    {
				      "color": "#ffffff",
				      "fields": [
				        {
				          "title": "Last Close",
				          "value": stats.display(close, tickSize)
				        }
				      ]
				    },
				    {
				      "color": "#ff0000",
				      "fields": [
				        {
				          "title": "1 Sigma DOWN",
				          "value": stats.display(yzSigmas.oneDown, tickSize)
				        },
				        {
				          "title": "2 Sigma DOWN",
				          "value": stats.display(yzSigmas.twoDown, tickSize)
				        },
				        {
				          "title": "3 Sigma DOWN",
				          "value": stats.display(yzSigmas.threeDown, tickSize)
				        }
				      ]
				    },

					{
				      "color": "#ffffff",
				      "text": '---',
				    },

					{
				      "color": "#ffffff",
				      "text": `** ${footer}`,
				    }

				    ]
				}
			}, function(er, re, bo){
				console.log('Rocketchat Post response:');
				console.log({er, re, bo});
			});

  		});
  		

	}

};