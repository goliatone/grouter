/*global define:true requirejs:true*/
/* jshint strict: false */
requirejs.config({
    paths: {
        'jquery': 'jquery/jquery',
        'grouter': 'grouter'
    }
});

define(['grouter', 'jquery'], function (GRouter, $) {
    console.log('Loading');
	var grouter = new GRouter();
});