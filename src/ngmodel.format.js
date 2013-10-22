;
(function () {
    angular.module('ngmodel.format', [])
        .constant("modelFormatConfig", {
            "currency": {
                "formatter": function (args) {
                    var modelValue = args.$modelValue, filter = args.$filter;
                    return  filter("currency")(modelValue);
                },
                "parser": function (args) {
                    var viewValue = args.$viewValue;
                    var num = viewValue.replace(/[^0-9.]/g, '');
                    var result = parseFloat(num, 10);
                    return isNaN(result) ? undefined : parseFloat(result.toFixed(2));
                },
                "isEmpty": function (value) {
                    return !value.$modelValue;
                },
                "keyDown": function (args) {
                    var event = args.$event, viewValue = args.$viewValue, modelValue = args.$modelValue;

                    if (!(smallKeyBoard(event) || numberKeyBpoard(event) || functionKeyBoard(event) || currencyKeyBoard(event, viewValue) || floatKeyBoard(event, viewValue) )) {
                        event.stopPropagation();
                        event.preventDefault();
                    }
                }
            },
            "digit": {
                "formatter": function (args) {
                    return args.$modelValue;
                },
                "parser": function (args) {
                    return args.$viewValue ? args.$viewValue.replace(/[^0-9]/g, '') : undefined;
                },
                "isEmpty": function (value) {
                    return !value.$modelValue;
                },
                "keyDown": function (args) {
                    var event = args.$event;

                    if (!(smallKeyBoard(event) || numberKeyBpoard(event) || functionKeyBoard(event))) {
                        event.stopPropagation();
                        event.preventDefault();
                    }
                }
            },
            "int": {
                "formatter": function (args) {
                    var modelValue = args.$modelValue, filter = args.$filter;
                    return  filter("number")(modelValue);
                },
                "parser": function (args) {
                    var val = parseInt(args.$viewValue.replace(/[^0-9]/g, ''), 10);
                    return isNaN(val) ? undefined : val;
                },
                "isEmpty": function (value) {
                    return !value.$modelValue;
                },
                "keyDown": function (args) {
                    var event = args.$event;

                    if (!(smallKeyBoard(event) || numberKeyBpoard(event) || functionKeyBoard(event))) {
                        event.stopPropagation();
                        event.preventDefault();
                    }
                }
            },
            "float": {
                "formatter": function (args) {
                    var modelValue = args.$modelValue, filter = args.$filter;
                    return  filter("number")(modelValue);
                },
                "parser": function (args) {
                    var val = parseFloat(args.$viewValue.replace(/[^0-9.]/g, ''));
                    return isNaN(val) ? undefined : parseFloat(val.toFixed(3));
                },
                "isEmpty": function (value) {
                    return !value.$modelValue;
                },
                "keyDown": function (args) {
                    var event = args.$event, viewValue = args.$viewValue;

                    if (!(smallKeyBoard(event) || numberKeyBpoard(event) || functionKeyBoard(event) || floatKeyBoard(event, viewValue) )) {
                        event.stopPropagation();
                        event.preventDefault();
                    }

                }
            }
        })
        .directive("modelFormat", ["modelFormatConfig", "$filter", "$parse", function (modelFormatConfig, $filter, $parse) {
            return {
                require: 'ngModel',
                link: function (scope, element, attrs, ctrl) {
                    var config = modelFormatConfig[attrs.modelFormat] || {};


                    var parseFuction = function (funKey) {
                        if (attrs[funKey]) {
                            var func = $parse(attrs[funKey]);
                            return (function (args) {
                                return func(scope, args);
                            });
                        }
                        return  config[funKey];
                    };

                    var formatter = parseFuction("formatter");
                    var parser = parseFuction("parser");
                    var isEmpty = parseFuction("isEmpty");
                    var keyDown = parseFuction("keyDown");
                    var getModelValue = function () {
                        return $parse(attrs.ngModel)(scope);
                    };

                    element.bind("blur",function () {
                        element.val(formatter({"$modelValue": getModelValue(), "$filter": $filter}));
                    }).bind("keydown", function (event) {
                            keyDown({"$event": event, "$viewValue": element.val(), "$modelValue": getModelValue()});
                        });

                    ctrl.$parsers.push(function (viewValue) {
                        return parser({"$viewValue": viewValue});
                    });

                    ctrl.$formatters.push(function (value) {
                        return formatter({"$modelValue": value, "$filter": $filter});
                    });

                    ctrl.$isEmpty = function (value) {
                        return isEmpty({"$modelValue": value});
                    };
                }
            };
        }]);


    var smallKeyBoard = function (event) {
        var which = event.which;
        return (which >= 96 && which <= 105);
    };

    var numberKeyBpoard = function (event) {
        var which = event.which;
        return (which >= 48 && which <= 57) && !event.shiftKey;
    };

    var functionKeyBoard = function (event) {
        var which = event.which;
        return (which <= 40) || (navigator.platform.indexOf("Mac") > -1 && event.metaKey) || (navigator.platform.indexOf("Win") > -1 && event.ctrlKey);
    };

    var currencyKeyBoard = function (event, viewValue) {
        var which = event.which;
        return  ( viewValue.toString().indexOf('$') === -1 && which === 52 && event.shiftKey);
    };

    var floatKeyBoard = function (event, viewValue) {
        var which = event.which;
        return [188].indexOf(which) != -1 || ( which === 190 || which === 110 ) && viewValue.toString().indexOf('.') === -1;
    }


})();

