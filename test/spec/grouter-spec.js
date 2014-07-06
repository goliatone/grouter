/*global define:true, describe:true , it:true , expect:true,
beforeEach:true, sinon:true, spyOn:true , expect:true */
/* jshint strict: false */
define(['grouter'], function(GRouter) {

    describe('GRouter', function() {
        var router;
        beforeEach(function() {
            router = new GRouter();
        });


        it('should be loaded', function() {
            expect(GRouter).toBeTruthy();
            var grouter = new GRouter();
            expect(grouter).toBeTruthy();
        });

        it('should have a DEFAULTS class property', function() {
            expect(GRouter.DEFAULTS).toBeTruthy();
        });

        it('should have an initialRoute by default', function() {
            GRouter.DEFAULTS.initialRoute = 'home';
            expect(router.initialRoute).toEqual('home');
        });

        it('currentId if not given as an option in config object should match initialRoute', function() {
            expect(router.currentId).toEqual(router.initialRoute);
        });


    });
});