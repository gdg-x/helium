

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
            get('https://www.googleapis.com/plus/v1/people/'+organizer.gplus_id+'?key=AIzaSyA3vAdAjs2SnXFcnhumM8VDwOswJeB-38s').
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
            get("https://picasaweb.google.com/data/feed/api/user/"+organizer.gplus_id+"?alt=json").
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

    $http.
        jsonp('http://api.gdg-x.com/v1/organizers?callback=JSON_CALLBACK').
        success(function(organizers){
            var tmp = [];
            for(i in organizers){
                if(organizers[i].chapter.country == "United States" || organizers[i].chapter.country == "Canada"){
                    tmp.push(organizers[i]);
                }

                $scope.organizers = tmp;
            }

            console.log($scope.organizers)

            for(var i=0;i<$scope.organizers.length;i++){
                $timeout(
                    (function(id, name){
                        return function(){
                            callback(id,name);
                        }
                    })( $scope.organizers[i])
                    , (30000*i) );
            }
        });

    function callback(organizer){
        fetchUser(organizer);
    }

});