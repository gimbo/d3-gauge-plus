JS_SOURCES		=	d3-gauge-plus.js demo/js/d3-gauge-plus-demo.js demo/js/d3-gauge-plus-demo-disk.js

default:			lint hint

lint:
				jslint $(JS_SOURCES)

hint:
				jshint $(JS_SOURCES)
