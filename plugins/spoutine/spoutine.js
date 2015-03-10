module.exports = function(options, imports, register) {
	var db = imports.db;
    var spoutine = {
		check: function() {
			
		},
		// Return a random number between 1 and 42424242424242
		random: function() {
			return Math.floor(Math.random() * 42424242424242) + 1)
		}
	}
    register(null, {
        "spoutine": spoutine
    })
}
