module.exports = {

	standardDeviation: function(values){

	  var avg = this.average(values);
	  
	  var squareDiffs = values.map(function(value){
	    var diff = value - avg;
	    var sqrDiff = diff * diff;
	    return sqrDiff;
	  });
	  
	  var avgSquareDiff = this.average(squareDiffs);

	  return Math.sqrt(avgSquareDiff);

	},

	average: function(data){

	  var sum = data.reduce(function(sum, value){
	    return sum + value;
	  }, 0);

	  var avg = sum / data.length;
	  return avg;

	},

	mean: function(data){

	  data.sort((a, b) => a - b);
	  const lowMiddle = Math.floor((data.length - 1) / 2);
	  const highMiddle = Math.ceil((data.length - 1) / 2);

	  return (data[lowMiddle] + data[highMiddle]) / 2;

	},

	display: function(num){

		return (Math.round(num * 4) / 4).toFixed(2);

	}

};