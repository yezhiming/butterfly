define([], function(){

	return {
		setLocale: function(locale, reload){
			window.localStorage.lang = locale;

			requirejs.config({
				config: {
					i18n: {
						locale: window.localStorage.lang
					}
				}
			});

			if (reload) window.location.reload();
		},

		getLocale: function(){
			return window.localStorage.lang;
		}
	};
	
});