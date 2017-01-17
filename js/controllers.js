var isDlgOpen;

app.controller('preloadPage', function($scope, $http, database, $timeout, $location){
    database.updateDatabase($http);
    repeater();
    function repeater () {
        $scope.showCheck = {
            category : '',
            product : '',
            shop : ''
        };
        if(database.checkCategory()) { $scope.showCheck.category = 'category'; }
        if(database.checkProduct()) { $scope.showCheck.product = 'product';}
        if(database.checkShop()) { $scope.showCheck.shop = 'shop';}
        if(database.checkShop()){
            $timeout(function () {
                $location.path('/home');
            }, 500);

        } else {
            $timeout(function () {
                repeater();
            }, 500);
        }
    }
})

app.controller('AppCtrl', function($rootScope, $scope, $http, $timeout, $mdSidenav, $log, database, $location, $timeout, $modal, $mdDialog, $mdToast, $localStorage, $window) {
    repeater();
    function repeater () {
        if(database.checkDatabase()){
            showCustomToast();
        } else {
            $location.path('/');
            $timeout(function () {
                repeater();
            }, 500);
        }
    }
    $scope.showLogo = true;
    $scope.hideLogo = function (){
        $scope.showLogo = false;
    }
    $scope.categoryNavBar = database.getDatabaseCategory();
    $scope.productShop = database.getProductShop();
    $scope.productShopBrand = database.getProductShop();
    $scope.shops = database.getDatabaseShop();
    $scope.buyedLength = $window.localStorage.length;
    $scope.selectedBrands = [];
    $scope.selectedShops = [];
    $scope.selectedCharasteristic = [];
    $scope.searchName = "";
    $scope.bool = true;
    $scope.boolMenu = false;
    $scope.data = {cb1: true};
    $scope.visibleBuyedlength = true;

    $scope.showHideMenu = function() {
        $scope.boolMenu = !$scope.boolMenu;
    }

    $scope.upToMenu = function() {
        window.scroll(0 ,0);
    }

    $scope.search = function (item) {
        if(($scope.categoryNavBar[$scope.selectedIndex].name == item.category[0].name)
            ||($scope.categoryNavBar[$scope.selectedIndex].name == item.category[1].name))
        {
            if(item.image.length == 0) {
                item.image.push("img/noimage.png");
            }
            
            var brandCheck = false;
            var characteristicCheck = false;
            var nameCheck = false;
            var priceCheck = false;
            if($scope.selectedBrands.length == 0){
                brandCheck = true;
            } else {
                for (var i = 0; i < $scope.selectedBrands.length; i++){
                    if($scope.selectedBrands[i] == item.brand){
                        brandCheck = true;
                        break;
                    }
                }
            }
            if($scope.selectedCharasteristic.length == 0){
                characteristicCheck = true;
            } else {
                for (var i = 0; i < item.characteristic.length; i++){
                    for (var j = 0; j < $scope.selectedCharasteristic.length; j++){
                        if($scope.selectedCharasteristic[j].value == item.characteristic[i].value){
                            characteristicCheck = true;
                            break;
                        }
                    }
                }
            }

            if($scope.searchName == "") {
                nameCheck = true;
            } else {
                if(item.name.toUpperCase().indexOf($scope.searchName.toUpperCase()) != -1) {
                    nameCheck = true;
                }
            }

            var minPriceSelected = 0;
            var maxPriceSelected = 0;
            minPriceSelected = database.getSliderMin();
            maxPriceSelected = database.getSliderMax();
            if(maxPriceSelected == 0){
                maxPriceSelected = database.getMaxPrice();
            }
            if(minPriceSelected == 0){
                minPriceSelected = database.getMinPrice();
            }
            for (var i = 0; i < item.shop.length; i++) {
                if ($scope.selectedShops.length == 0) {
                    if($scope.data.cb1 == true){
                        if (((item.shop[i].cost-item.shop[i].cost*item.shop[i].sale) <= maxPriceSelected) && ((item.shop[i].cost-item.shop[i].cost*item.shop[i].sale) >= minPriceSelected)) {
                            priceCheck = true;
                        }
                    } else {
                        if ((item.shop[i].cost <= maxPriceSelected) && (item.shop[i].cost >= minPriceSelected)) {
                            priceCheck = true;
                        }
                    }
                } else {
                    if($scope.data.cb1 == true){
                        for (var j = 0; j < $scope.selectedShops.length; j++){
                            if($scope.selectedShops[j] == item.shop[i].name){
                                if (((item.shop[i].cost-item.shop[i].cost*item.shop[i].sale) <= maxPriceSelected) && ((item.shop[i].cost-item.shop[i].cost*item.shop[i].sale) >= minPriceSelected)) {
                                    priceCheck = true;
                                    break;
                                }
                            }
                        }
                    } else {
                        for (var j = 0; j < $scope.selectedShops.length; j++){
                            if($scope.selectedShops[j] == item.shop[i].name){
                                if ((item.shop[i].cost <= maxPriceSelected) && (item.shop[i].cost >= minPriceSelected)) {
                                    priceCheck = true;
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            if((brandCheck == true) && (characteristicCheck == true) && (nameCheck == true) && (priceCheck == true)) {
                return true;
            } else {
                return false;
            }
        } else
        {
            return false;
        }
    }

    $scope.searchShopsPrice = function (item) {
        if ($scope.selectedShops.length == 0) {
            return true;
        } else {
            for (var i = 0; i < $scope.selectedShops.length; i++){
                if($scope.selectedShops[i] == item.name){
                    return true;
                }
            }
            return false;
        }
    }

    $scope.filterValues = function(selectedBrands, selectedShops) {
        $scope.$broadcast('sliderRangeEvent');
        $scope.selectedBrands = selectedBrands;
        $scope.selectedShops = selectedShops;
        database.setSelectedShops(selectedShops);
    }

    $scope.selectedCategory = function (value) {
        $scope.bool = false;
        $scope.boolMenu = true;
        $scope.selectedIndex = value;
        $scope.$broadcast('cleanerEvent');
        $scope.$broadcast('sliderRangeEvent');
        $scope.characteristicFilter = database.generateCharacteristic($scope.categoryNavBar[value].name);
        $scope.selectedBrands = [];
        $scope.selectedShops = [];
        $scope.selectedCharasteristic = [];
        $scope.searchName = "";
        window.scroll(0 ,0);
    }

    $scope.toggleLeft = buildDelayedToggler('left');
    $scope.toggleRight = buildToggler('right');
    $scope.isOpenRight = function(){
        return $mdSidenav('right').isOpen();
    };

    function debounce(func, wait, context) {
        var timer;
        return function debounced() {
            var context = $scope,
                args = Array.prototype.slice.call(arguments);
            $timeout.cancel(timer);
            timer = $timeout(function() {
                timer = undefined;
                func.apply(context, args);
            }, wait || 10);
        };
    }

    function buildDelayedToggler(navID) {
        return debounce(function() {
            $mdSidenav(navID)
                .toggle()
                .then(function () {
                });
        }, 200);
    }

    function buildToggler(navID) {
        return function() {
            $mdSidenav(navID)
                .toggle()
                .then(function () {
                });
        }
    }

    $scope.showAlert = function(ev) {
        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Поздравляю')
                .textContent('Товар успешно добавлен в корзину')
                .ok('Я умница')
                .targetEvent(ev)
        )
    };

    $scope.showTabDialog = function(ev, item) {
        database.setItemSelected(item);
        $scope.visibleBuyedlength = false;
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'template/product.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
        })
            .then(function(answer) {
                $scope.visibleBuyedlength = true;
            }, function() {
                if(database.getBuyProduct()){
                    $scope.buyedLength = $window.localStorage.length;
                    $scope.showAlert();
                    database.makeBuyProduct();
                    $scope.visibleBuyedlength = true;
                } else {
                    $scope.visibleBuyedlength = true;
                }
            });
    };

    function DialogController($scope, $mdDialog, database, $localStorage, $window) {
        $scope.selectedItem = database.getItemSelected();
        $scope.filterAll = true;
        $scope.buyedList = [];
        for (var i = 0; i< $window.localStorage.length; i++) {
            $scope.buyedList.push(JSON.parse($window.localStorage[$window.localStorage.key(i)]));
            console.log($scope.buyedList);
        }


        $scope.searchBuyed = function (item) {
            if($scope.filterAll == true){
                return true;
            } else {
                if(item.date == $scope.checkToday){
                    return true;
                } else {
                    return false;
                }
            }
        }

        $scope.myDate = new Date();
        $scope.checkToday = (new Date($scope.myDate.getFullYear(), $scope.myDate.getMonth(), $scope.myDate.getDate()+1)).toISOString().replace("T21:00:00.000Z","");
        $scope.minDate = new Date(
            $scope.myDate.getFullYear(),
            $scope.myDate.getMonth(),
            $scope.myDate.getDate());
        $scope.maxDate = new Date(
            $scope.myDate.getFullYear(),
            $scope.myDate.getMonth(),
            $scope.myDate.getDate()+7);

        $scope.buyProduct = function(value) {
            if($scope.myDate != ""){
                database.setBuyProduct(true);
                var obj = Math.floor((Math.random()*1000000)+1).toString();
                $scope.selectedItem.price = $scope.selectedItem.shop[value].cost - $scope.selectedItem.shop[value].cost * $scope.selectedItem.shop[value].sale;
                $scope.selectedItem.date = (new Date($scope.myDate.getFullYear(), $scope.myDate.getMonth(), $scope.myDate.getDate()+1)).toISOString().replace("T21:00:00.000Z","")
                $window.localStorage.setItem(obj, JSON.stringify($scope.selectedItem));
                $mdDialog.cancel();
            }
        }

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };
    }

    function showCustomToast() {
        $mdToast.show({
            hideDelay   : 3000,
            position    : 'bottom left',
            controller  : 'ToastCtrl',
            templateUrl : 'template/toast.html'
        });
    };

    $scope.showAdvanced = function(ev) {
        $scope.visibleBuyedlength = false;
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'template/myProduct.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
            .then(function(answer) {
                $scope.visibleBuyedlength = true;
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.visibleBuyedlength = true;
                $scope.status = 'You cancelled the dialog.';
            });
    };
})

    .controller('ToastCtrl', function($scope, $mdToast, $mdDialog) {
        $scope.closeToast = function() {
            if (isDlgOpen) return;
            $mdToast
                .hide()
                .then(function() {
                    isDlgOpen = false;
                });
        };
    })

    .controller('LeftCtrl', function ($rootScope, $scope, $timeout, $mdSidenav, $log, database) {
        $scope.close = function () {
            $mdSidenav('left').close()
                .then(function () {
                });
        };

        $scope.minValue = 0;
        $scope.maxValue = 90;
        $scope.rangeSlider = {
            options: {
                floor: 0,
                ceil: 100,
                step: 1,
                onChange : onSlider
            }
        };

        function onSlider()
        {
            database.setSliderMax($scope.maxValue);
            database.setSliderMin($scope.minValue);
        }

        $scope.searchBrandFilter = function (item) {
            if(($scope.categoryNavBar[$scope.selectedIndex].name == item.category[0].name)
                ||($scope.categoryNavBar[$scope.selectedIndex].name == item.category[1].name))
            {
                return true;
            } else {
                return false;
            }
        }

        $scope.addCharacteristic = function (value) {
            if(value != null) {
                if($scope.selectedCharasteristic == []){
                    $scope.selectedCharasteristic.push(value);
                } else {
                    var flag = false;
                    for (var i = 0; i < $scope.selectedCharasteristic.length; i++){
                        if(value == $scope.selectedCharasteristic[i]){
                            flag = true;
                        }
                    }
                    if(flag == false ){
                        $scope.selectedCharasteristic.push(value);
                    }
                }
            }
            $scope.ctrl.searchText = "";
        }

        $scope.switchSale = function () {
            $scope.$broadcast('sliderRangeEvent');
            database.setSliderMax($scope.maxValue);
            database.setSliderMin($scope.minValue);
        }

        $scope.clearCharacteristic = function (value) {
            $scope.selectedCharasteristic = [];
        }

        $scope.$on('sliderRangeEvent', function() {
            database.generatePrice($scope.selectedShops , $scope.categoryNavBar[$scope.selectedIndex].name);

            function onSlider()
            {
                database.setSliderMax($scope.maxValue);
                database.setSliderMin($scope.minValue);
            }

            if($scope.data.cb1 == true){
                $scope.minValue = database.getMinPrice();
                $scope.maxValue = database.getMaxPrice();
                $scope.rangeSlider = {
                    options: {
                        floor: database.getMinPrice(),
                        ceil: database.getMaxPrice(),
                        step: 1,
                        onChange: onSlider
                    }
                };
            } else {
                $scope.minValue = database.getMinSalePrice();
                $scope.maxValue = database.getMaxSalePrice();
                $scope.rangeSlider = {
                    options: {
                        floor: database.getMinSalePrice(),
                        ceil: database.getMaxSalePrice(),
                        step: 1,
                        onChange: onSlider
                    }
                };
            }
        });

        $scope.$on('cleanerEvent', function() {
            $scope.selectedShops = [];
            $scope.ctrl.searchText = "";
            $timeout(function () {
                $scope.selectedBrands = [];
            }, 700);
        });
    })

    .controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
        $scope.close = function () {
            $mdSidenav('right').close()
                .then(function () {
                });
        };
    })


