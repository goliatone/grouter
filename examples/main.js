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

	grouter.match('/home', function home(e){
		console.debug('HOME', e);
	});

	grouter.match('/product/\\d+', function productDetail(e){
		console.debug('PRODUCT 23', e);
	});

	grouter.match('/unhandled/example', function productDetail(e){
		console.error('THIS SHOULD NOT FIRE', e);
	});

	grouter.not('/home', function notHome(e){
		console.log('NOT HOME');
	});

	grouter.unhandled(function(e){
		console.info('\nUNHANDLED', e.path);
	});

	grouter.matcher('/home', {userID:23});
	grouter.matcher('/product/23', {userID:23});
	grouter.matcher('/product/566', {userID:23});
	grouter.matcher('/product/something', {userID:23});
});