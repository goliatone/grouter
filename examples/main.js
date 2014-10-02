/*global define:true requirejs:true*/
/* jshint strict: false */
requirejs.config({
    paths: {
        'grouter': 'grouter',
        'gpub':'gpub/gpub',
        'extend':'gextend/extend'
    }
});

define(['grouter', 'gpub'], function (GRouter, GPub) {
    console.log('Loading');

    GPub.observable(GRouter);


	var grouter = new GRouter();

	grouter.match('home', function home(e){
		console.debug('HOME', e);
	});

	grouter.match('product.:id(\\d+)', function productDetail(e){
		console.debug('PRODUCT ', e.params.id);
	});

	grouter.match('unhandled.example', function productDetail(e){
		console.error('THIS SHOULD NOT FIRE', e);
	});

	grouter.match('*', function notHome(e){
		console.warn('==> UNHANDLED', e.path);
	});

	grouter.unhandled(function(e){
		console.info('\nUNHANDLED', e.path);
	});

	grouter.on('all', function(target, e){
		console.log('HERE ALL IS', e.path, e.params)
	});

	grouter.not('home', function notHome(e){
		console.warn('NOT HOME', e.path);
	});

	grouter.matcher('home', {userID:23});
	grouter.matcher('product.23', {userID:23});
	grouter.matcher('product.566', {userID:23});
	grouter.matcher('product.unhandled', {userID:23});
});