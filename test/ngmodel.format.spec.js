describe('ngmodel.format', function () {

    beforeEach(module('ngmodel.format'));

    var $scope, $compile, elm;

    beforeEach(inject(function ($rootScope, _$compile_) {
        $scope = $rootScope;
        $compile = _$compile_;
    }));

    describe('currency format', function () {

        beforeEach(function () {
            var html = '<input type="text" ng-model="test" model-format="currency"/>';
            elm = $compile(angular.element(html))($scope);
            $scope.$digest();
        });

        it('should be format when blur', function () {
            elm.val("12345.123").trigger("input").trigger("blur");
            expect(elm.val()).toEqual("$12,345.12");
            expect($scope.test).toEqual(12345.12);
        });

        it('should be reject non-number', function () {
            elm.val("aa1.123").trigger("input").trigger("blur");
            expect(elm.val()).toEqual("$1.12");
            expect($scope.test).toEqual(1.12);
        });
    });

    describe('digit format', function () {

        beforeEach(function () {
            var html = '<input type="text" ng-model="test" model-format="digit"/>';
            elm = $compile(angular.element(html))($scope);
            $scope.$digest();
        });

        it('should be format when blur', function () {
            elm.val("12345123").trigger("input").trigger("blur");
            expect(elm.val()).toEqual("12345123");
            expect($scope.test).toEqual("12345123");
        });

        it('should be reject non-number', function () {
            elm.val("aa1.123").trigger("input").trigger("blur");
            expect(elm.val()).toEqual("1123");
            expect($scope.test).toEqual("1123");
        });
    });

    describe('int format', function () {

        describe(" default", function () {
            beforeEach(function () {
                var html = '<input type="text" ng-model="test" model-format="int"/>';
                elm = $compile(angular.element(html))($scope);
                $scope.$digest();
            });

            it('should be format when blur', function () {
                elm.val("12345123").trigger("input").trigger("blur");
                expect(elm.val()).toEqual("12,345,123");
                expect($scope.test).toEqual(12345123);
            });

            it('should be reject non-number', function () {
                elm.val("aa1.123").trigger("input").trigger("blur");
                expect(elm.val()).toEqual("1,123");
                expect($scope.test).toEqual(1123);
            });
        });

        describe("customerl", function () {
            beforeEach(function () {
                var html = '<input type="text" ng-model="test" formatter="formatter($modelValue,$filter);" model-format="int"/>';
                $scope.formatter = function () {
                    return "$0.00";
                };
                elm = $compile(angular.element(html))($scope);
                $scope.$digest();
            });

            it('should be format when blur by customer fomatter', function () {
                elm.val("12345123").trigger("input").trigger("blur");
                expect(elm.val()).toEqual("$0.00");
                expect($scope.test).toEqual(12345123);
            });

        });
    });

    describe('float format', function () {

        beforeEach(function () {
            var html = '<input type="text" ng-model="test" model-format="float"/>';
            elm = $compile(angular.element(html))($scope);
            $scope.$digest();
        });

        it('should be format when blur', function () {
            elm.val("12345.123").trigger("input").trigger("blur");
            expect(elm.val()).toEqual("12,345.123");
            expect($scope.test).toEqual(12345.123);
        });

        it('should be reject non-number', function () {
            elm.val("aa1.123").trigger("input").trigger("blur");
            expect(elm.val()).toEqual("1.123");
            expect($scope.test).toEqual(1.123);
        });
    });
});
