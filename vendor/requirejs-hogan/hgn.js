define(['text', 'hogan'], function(text, hogan) {

    var buildCache = {};
    var buildCompileTemplate = 'define("{{pluginName}}!{{moduleName}}", ["hogan"], function(hogan){return new hogan.Template({{{fn}}});});';
    var buildTemplate;

    var load = function(moduleName, parentRequire, load, config) {

        text.get(parentRequire.toUrl(moduleName), function(data) {

            if(config.isBuild) {
                buildCache[moduleName] = data;
                load();
            } else {
                load(hogan.compile(data));
            }
        });
    };

    var write = function(pluginName, moduleName, write) {

        if(moduleName in buildCache) {

            if(!buildTemplate) {
                buildTemplate = hogan.compile(buildCompileTemplate);
            }

            write(buildTemplate.render({
                pluginName: pluginName,
                moduleName: moduleName,
                fn: hogan.compile(buildCache[moduleName], {asString: true})
            }));
        }
    };

    return {
        load: load,
        write: write
    };

});