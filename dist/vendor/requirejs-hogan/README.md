# requirejs-hogan

Simple Hogan plugin for RequireJS.

* Requires the official `text!` plugin.
* Like the offical `text!` plugin, include the file extension in the module id.
* Make sure to include `template.js` from Hogan in your build (instead of e.g. `hogan-2.0.0.amd.js`).

## Example usage

    define(['hgn!myTemplate.tpl'], function(myTemplate) {

        var html = myTemplate.render({name:'John Doe'});

    });

## Example config

    require.config({
        paths: {
            'text': 'lib/requirejs-text/text',
            'hogan': 'lib/hogan/web/builds/2.0.0/hogan-2.0.0.amd',
            'hgn': 'lib/requirejs-hogan/hgn'
        },
        shim: {
            'hogan': {
                exports: 'Hogan'
            }
        }
    });
