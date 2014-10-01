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
		console.log('HOME', e);
	});

	grouter.match('/product/23', function productDetail(e){
		console.log('PRODUCT 23', e);
	});

	grouter.not('/home', function notHome(e){
		console.log('NOT HOME');
	});

	grouter.matcher('/home', {userID:23});
	grouter.matcher('/product/23', {userID:23});
	grouter.matcher('/product/something', {userID:23});
});