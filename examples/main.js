/*global define:true requirejs:true*/
/* jshint strict: false */
requirejs.config({
    paths: {
        'grouter': 'grouter',
        'gpub':'gpub/gpub',
        'pathtoregexp':'pathtoregexp/pathtoregexp',
        'extend':'gextend/extend'
    }
});

define(['grouter', 'gpub', 'pathtoregexp'], function (GRouter, GPub, pathtoregexp) {
    console.log('Loading');

    GPub.observable(GRouter);


	var grouter = new GRouter({
		pathToRegexp:pathtoregexp
	});

	grouter.route('home', function home(e){
		console.log('\n=========================');
		console.debug('HOME', e.path);
	});

	grouter.route('product/:id(\\d+)', function productDetail(e){
		console.log('\n=========================');
		console.debug('PRODUCT:', e.params.id);
	});

	grouter.route('unhandled/example', function productDetail(e){
		console.log('\n=========================');
		console.error('THIS SHOULD NOT FIRE', e);
	});

	grouter.on('all', function(target, e){
		// console.log('HERE ALL IS', e.path, e.params);
	});

	grouter.route(/route\/president_(.*)/, function(e) {
		console.log('\n=========================');
        console.warn('MATCHING ANY ROUTE', e.path);
    });

	grouter.unhandled(function(e){
		console.info('===> UNHANDLED', e.path);
	});

	grouter.match('home');
	grouter.match('product/23', {userID:23});
	grouter.match('product/566', {userID:23});
	grouter.match('product/unhandled');
	grouter.match('route/president_bill_sign');
	grouter.match('route/president_veto');
	grouter.match('route/president_veto_override_vote_start');

	window.rt = grouter;
});