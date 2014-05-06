
var app = angular.module("GDGNAOrganizers", []);

app.controller("PhotoControl", function($scope, $http, $window, $timeout, $location){

    $scope.photoContainerStyle = {
        "width" : ($window.innerWidth + 100) + "px"
    }

    var viewCount = parseInt( parseInt($window.innerWidth/100)*parseInt($window.innerHeight/100)*4.5 );

    $scope.id = '114658228251375812131';

    function fetchUser(organizer){
        $scope.loaded = false;
        $http.
            get('https://www.googleapis.com/plus/v1/people/'+organizer+'?key=AIzaSyA3vAdAjs2SnXFcnhumM8VDwOswJeB-38s').
            success(function(response){




                fetchPhotos(organizer, {
                    name : response.displayName,
                    picture : response.image.url+"0",
                    occupation : findOccupation(response.organizations),
                    about : response.aboutMe,
                    lives : findLives(response.placesLived),
                    chapter : organizer.chapter.name
                });
            });
    }

    function fetchPhotos(organizer, profile){
        $http.
            get("https://picasaweb.google.com/data/feed/api/user/"+organizer+"?alt=json").
            success(function(response){
                var tmp = [];

                var index = 0;

                for(var i=0; i<viewCount; i++){

                    if(index>=response.feed.entry.length-1){
                        index = 0;
                    }else{
                        index++;
                    }

                    tmp.push(response.feed.entry[index]);
                }

                $scope.photos = tmp;
                $scope.profile = profile;
                $scope.loaded = true;
            });
    }

    function findOccupation(orgs){
        if(orgs)
        for(var i=0;i<orgs.length;i++){
            if(orgs[i].type == "work" && orgs[i].primary)
                return orgs[i];
        }
    }

    function findLives(places){
        if(places)
        for(var i=0;i<places.length;i++){
            if(places[i].primary)
                return places[i].value;
        }
    }


    /**
     * here is your list of Google+ IDs
     * you can replace this ajax call with a hard coded array of Google+ IDs 
     * 
     */
    $http.
        jsonp('https://hub.gdgx.io/api/v1/chapters/country/us,ca?perpage=10000&callback=JSON_CALLBACK').
        success(function(response){
            var tmp = [];
            for(var i=0;i<response.items.length;i++){
                for(var o=0;o<response.items[i].organizers.length;o++){
                    tmp.push(response.items[i].organizers[o])
                }
            }
            initSlides(tmp);
        });
        
    function initSlides(list){
         for(var i=0;i<list.length;i++){
                $timeout(
                    (function(id){
                        return function(){
                            callback(id);
                        }
                    })( list[i] )
                    , (30000*i) );
            }
    }    

    function callback(organizer){
        fetchUser(organizer);
    }

});
