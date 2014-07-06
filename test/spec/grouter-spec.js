/*global define:true, describe:true , it:true , expect:true,
beforeEach:true, sinon:true, spyOn:true , expect:true */
/* jshint strict: false */
define(['grouter'], function(GRouter) {

    describe('just checking', function() {

        it('GRouter should be loaded', function() {
            expect(GRouter).toBeTruthy();
            var grouter = new GRouter();
            expect(grouter).toBeTruthy();
        });

        it('GRouter should initialize', function() {
            var grouter = new GRouter();
            var output = grouter.init();
            var expected = 'This is just a stub!';
            expect(output).toEqual(expected);
        });

    });

});