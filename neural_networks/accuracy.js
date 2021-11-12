module.exports = {
	accuracy: function(yPred, yTrue) {
		const predictions = yPred.argmax(1);
		let accy = 0;
		for (let j = 0; j < predictions.length; ++j) {
			accy += Number(predictions[j] === yTrue[j]);
		}
		return accy / predictions.length;
	}
}