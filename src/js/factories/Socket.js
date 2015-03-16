app.factory('Socket', function (socketFactory) {
	return {
		connect: function(path) {
			return socketFactory({
				ioSocket: io.connect(path)
			});
		}
	}
});
