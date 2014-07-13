var numberSystemConverter = {
	/**
	 * Converts vector number to the readable string.
	 * @param {Array} vector
	 * @return {String} number
	 */
	vectorToNumber: function(vector) {
		var number = vector.slice(0);
		for (var i = 0; i < number.length; i++) {
			number[i] = number[i].toString(16);
		};
		return number.reverse().join('');
	},

	/**
	 * Converts readable number (string from user input) to the vector number.
	 * @param {String} number string from user input
	 * @return {Array} vector
	 */
	numberToVector: function(number) {
		return number.split('').reverse();
	},

	/**
	 * Converts source vector from source base to target base.
	 * @param {Array} srcVector source vector to convert
	 * @param {Number} srcBase source vector base
	 * @param {Number} targetBase target vector base
	 * @return {Array} result converted vector
	 */
	convertBase: function(srcVector, srcBase, targetBase) {
		var srcDecimalVector = this._vectorToDecimalVector(srcVector, srcBase);
		var resultVector = new Array();
		var i = 0;
		do {
			var digit = this._mod(srcDecimalVector, targetBase);
			resultVector[i] = digit;
			srcDecimalVector = this._div(srcDecimalVector, targetBase);
			i++;
		} while (!this._isZeroVector(srcDecimalVector));
		return resultVector;
	},

	_vectorToDecimalVector: function(vector, base) {
		var decimalVector = [0];
		for (var i = 0; i < vector.length; i++) {
			decimalVector = this._sum(decimalVector, this._decimalToVector(this._digitToInt(vector[i]) * Math.pow(base, i)));
		}
		return decimalVector;
	},

	_digitToInt: function(digit) {
		return parseInt(digit, 16);
	},

	_decimalToVector: function(decimal) {
		var resultVector = new Array();
		var i = 0;
		do {
			resultVector[i] = Math.floor(decimal % 10);
			decimal = decimal / 10;			
			i++;
		} while (Math.round(decimal) > 0);
		return resultVector;
	},

	/**
	 * Add two decimal vectors.
	 * @return {Array} result decimal vector
	 */
	_sum: function(decimalVector1, decimalVector2) {
		var resultVectorLength = Math.max(decimalVector1.length, decimalVector2.length) + 1;
		for (var i = decimalVector1.length; i < resultVectorLength; i++) {
			decimalVector1[i] = 0;
		}
		for (var i = decimalVector2.length; i < resultVectorLength; i++) {
			decimalVector2[i] = 0;
		}
		var resultVector = decimalVector2.slice(0);
		for (var i = 0; i < resultVectorLength; i++) {
			resultVector[i] += decimalVector1[i];
			resultVector[i + 1] += Math.floor(resultVector[i] / 10);
			resultVector[i] %= 10;
		}
		resultVectorLength = resultVector[resultVectorLength-1] ? resultVectorLength : resultVectorLength-1;
		return resultVector.slice(0, resultVectorLength);
	},

	/**
	 * Division of decimal vector by number.
	 * @return {Array} result decimal vector
	 */
	_div: function (decimalVector, divider) {
		var quotient = new Array();	
		var f = false;
		var x = 0;
		var position = 0;
		for (var i = decimalVector.length - 1; i >= 0; i--) {
			x = x * 10 + decimalVector[i];
			if ((x >= divider) || f) {
				quotient[position] = Math.floor(x / divider);
				position++;
				f = true;
				x = Math.floor(x % divider);
			}
		}
		if (!f) {
			quotient[0] = 0;
		}
		return quotient.reverse();
	},

	/**
	 * Modulo operation finds the remainder of division of decimal vector by number.
	 * @return {Number} result number
	 */
	_mod : function (decimalVector, divider) {	
	    var rem = 0;
	    for (var i = decimalVector.length - 1; i >= 0; i--) {
	        rem = (rem * 10 + decimalVector[i]) % divider;	    	
	    }
	    return rem;
	},

	_isZeroVector: function(vector) {
		return ~~vector[vector.length-1] == 0;
	}
};

var convertNumberBase = function() {
	var numberVector = numberSystemConverter.numberToVector(document.getElementById('number').value);
	var srcBase = parseInt(document.getElementById('srcBase').value);
	var targetBase = parseInt(document.getElementById('targetBase').value);
	var errorMessage = '';
	if (isNaN(srcBase)) {
		errorMessage += 'Specify source base. ';
	}
	if (isNaN(targetBase)) {
		errorMessage += 'Specify target base. ';
	}
	if (srcBase < 2 || srcBase > 16 || targetBase < 2 || targetBase > 16) {
		errorMessage += 'Supported bases: 2..16. ';
	}
	if (errorMessage != '') {
		document.getElementById('errorMessage').innerHTML = errorMessage;
	} else {
		document.getElementById('errorMessage').innerHTML = '';
		var resultVector = numberSystemConverter.convertBase(numberVector, srcBase, targetBase);
		document.getElementById('resultNumber').value = numberSystemConverter.vectorToNumber(resultVector);
	}
}