app.factory('HashFactory', function() {
    return {
        make: function(size) {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for( var i=0; i < size; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return CryptoJS.SHA512(text).toString(CryptoJS.enc.Hex);
        },
        hash: function(str) {
            return CryptoJS.SHA512(str).toString(CryptoJS.enc.Hex);
        }
    };
});
