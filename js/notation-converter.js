var notationConverter = {
	_div: function (decimalVector, divider) {
		var quotient = new Array();		
		var f = false;
		var x = 0;
		var position = 0;
	    for (var i = decimalVector.length - 1; i >= 0; i--) {
	        x = x * 10 + decimalVector[i];
	        if ((x >= divider) || f) {
	            quotient[position] = ~~(x / divider);
	            position++;
	            f = true;
	            x = ~~(x % divider);
	        }
	    }
	    if (!f) {
	    	quotient[0] = 0;
	    }
	    return quotient;
	},

	_rem: function (decimalVector, divider) {	
	    var rem =  0;
	    for (var i = decimalVector.length - 1; i >= 0; i--) {
	        rem = (rem * 10 + decimalVector[i]) % divider;	    	
	    }
	    return rem;
	}
};
alert(notationConverter._div([5, 2], 10)); //2
alert(notationConverter._rem([5, 2], 10)); //5
