app.factory('database', function() {
    var linkConnection = [
        {link: 'https://jsworkshop.000webhostapp.com/?model=category&callback=JSON_CALLBACK'},
        {link: 'https://jsworkshop.000webhostapp.com/?model=product&callback=JSON_CALLBACK'},
        {link: 'https://jsworkshop.000webhostapp.com/?model=shop&callback=JSON_CALLBACK'}
    ]
    var category;
    var product;
    var shop;
    var productShop;
    var characteristicCategory;
    var categoryCheck = false;
    var productCheck = false;
    var shopCheck = false;
    var productShopCheck = false;
    var priceMin = 0;
    var priceMax = 0;
    var priceMinSale = 0;
    var priceMaxSale = 0;
    var priceFirst = false;
    var sliderMin = 0;
    var sliderMax = 0;
    var slideSale = true;
    var selectedItem = [];
    var selectedShops = [];
    var buyProduct = false;
    return {
        updateDatabase: function($http) {
            getDatabase(linkConnection[0].link, $http, 0);
            getDatabase(linkConnection[1].link, $http, 1);
            getDatabase(linkConnection[2].link, $http, 2);
        },
        checkDatabase: function() {
            if((categoryCheck == true) && (productCheck == true) && (shopCheck == true)){
                return true;
            } else
            {
                return false;
            }
        },
        checkCategory: function() {
            return categoryCheck;
        },
        checkProduct: function() {
            return productCheck;
        },
        checkShop: function() {
            return shopCheck;
        },
        getDatabaseCategory: function() {
            return category;
        },
        getDatabaseProduct: function() {
            return product;
        },
        getDatabaseShop: function() {
            return shop;
        },
        makeDatabase: function() {
            makeNewDatabase();
        },
        getProductShop: function() {
            return productShop;
        },
        generateCharacteristic: function(category)
        {
            var characteristicCategory = [];
            for (var i = 0; i < productShop.length; i++){
                for (var j = 0; j < productShop[i].category.length; j++) {
                    if (productShop[i].category[j].name == category) {
                        for(var z = 0; z < productShop[i].characteristic.length; z++){
                            characteristicCategory.push(productShop[i].characteristic[z]);
                        }
                    }
                }
            }
            return characteristicCategory;
        },
        generatePrice : function (shops, category) {
            priceMin = 0;
            priceMax = 0;
            priceMinSale = 0;
            priceMaxSale = 0;
            priceFirst = false;
            var cacheshops = [];
            if(shops.length == 0){
                for (var i = 0; i < shop.length; i++){
                    cacheshops.push(shop[i].name);
                }
            } else
            {
                cacheshops = shops;
            }
            for (var i = 0; i < productShop.length; i++) {
                if((productShop[i].category[0].name == category) || (productShop[i].category[1].name == category)){
                    for (var j = 0; j < productShop[i].shop.length; j++){
                        for (var z = 0; z < cacheshops.length; z++){
                            if(productShop[i].shop[j].name == cacheshops[z]){
                                if(priceFirst == false){
                                    priceFirst = true;
                                    priceMax = productShop[i].shop[j].cost;
                                    priceMin = productShop[i].shop[j].cost;
                                    priceMaxSale = productShop[i].shop[j].cost - (productShop[i].shop[j].cost * productShop[i].shop[j].sale);
                                    priceMinSale = productShop[i].shop[j].cost - (productShop[i].shop[j].cost * productShop[i].shop[j].sale);
                                } else {
                                    if(priceMax < productShop[i].shop[j].cost) {
                                        priceMax = productShop[i].shop[j].cost;
                                    }
                                    if(priceMin > productShop[i].shop[j].cost) {
                                        priceMin = productShop[i].shop[j].cost;
                                    }
                                    if(priceMaxSale < (productShop[i].shop[j].cost - (productShop[i].shop[j].cost * productShop[i].shop[j].sale))){
                                        priceMaxSale = productShop[i].shop[j].cost - (productShop[i].shop[j].cost * productShop[i].shop[j].sale);
                                    }
                                    if(priceMinSale > (productShop[i].shop[j].cost - (productShop[i].shop[j].cost * productShop[i].shop[j].sale))){
                                        priceMinSale = productShop[i].shop[j].cost - (productShop[i].shop[j].cost * productShop[i].shop[j].sale);
                                    }
                                    }
                                }
                            }
                        }
                    }
                }
            return true;
            },
        getMaxPrice : function() {
            return priceMax;
        },
        getMinPrice : function() {
            return priceMin;
        },
        getMaxSalePrice : function() {
            return priceMaxSale;
        },
        getMinSalePrice : function() {
            return  priceMinSale;
        },
        getSliderMax : function() {
            return sliderMax;
        },
        setSliderMax : function (value) {
            if(value != undefined){
                sliderMax = value;
            }
        },
        getSliderMin : function() {
            return sliderMin;
        },
        setSliderMin : function (value) {
            if(value != undefined){
                sliderMin = value;
            }
        },        
        getSlideSale : function() {
            return slideSale;
        },
        setSlideSale : function (value) {
            slideSale = value;
        },
        getItemSelected : function () {
            return selectedItem;
        },
        setItemSelected : function (value) {
            selectedItem = value;
        },
        getSelectedShops : function () {
            return selectedShops;
        },
        setSelectedShops : function (value) {
            selectedShops = value;
        },
        getBuyProduct : function () {
            return buyProduct;
        },
        makeBuyProduct : function () {
            buyProduct = false;
        },
        setBuyProduct : function (value) {
            buyProduct = value;
        }
    }

     function getDatabase(link, $http, check){
        $http.get(link)
            .success(function(data) {
                if(check == 0) {category = data;}
                if(check == 1) {product = data;}
                if(check == 2) {shop = data; makeNewDatabase()};
            })
            .error(function(data) {
                return getDatabase(link, $http, check);
            })
            .finally(function () {
                if(check == 0) {categoryCheck = true;}
                if(check == 1) {productCheck = true;}
                if(check == 2) {shopCheck = true;}
            })
     }

    function  makeNewDatabase() {
        if(productShopCheck == false)
        {
            productShopCheck == true;
            productShop = product;
            for (var i = 0; i < productShop.length; i++){
                productShop[i].shop = [];
                for (var j = 0; j < shop.length; j++){
                    objectCacheShop = [];
                    objectCacheShop.name = "";
                    objectCacheShop.sale = 0;
                    objectCacheShop.cost = 0;
                    objectCacheShop.count = 0;

                    objectCacheShop.name = shop[j].name;
                    objectCacheShop.sale = shop[j].sale;
                    objectCacheShop.cost = shop[j].stock[i].cost;
                    objectCacheShop.count = shop[j].stock[i].count;

                    productShop[i].shop.push(objectCacheShop);
                }
            }
        }
    }
});


