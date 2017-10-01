var app = angular.module("app", ["dndLists"]);

app.controller("ctrl", function ($scope, $http){
       
    localStorage.clear();
    if(localStorage.getItem('json') == null){
        //get JSON file by dint of $http
        $http.get('tasks.json').success(function(result){
            console.log('success', result);
            $scope.json = result;
            $scope.saveJson();
        })
        .error(function(result){
            console.log('error');
        });
            
    }else{
        $scope.json = JSON.parse(localStorage.getItem('json'));   
    }

    //present view
    $scope.currentView = "table";   
    
    //PUT request to save to backend
    $scope.saveJson = function () {
        localStorage.setItem("json", JSON.stringify($scope.json));
    }
    
    
                        //FOR LOGIN AND REGISTRATION
    $scope.bg = false;//fixed background 
    $scope.log = false;//form for login
    $scope.reg = false;//form for registration
    
    $scope.showForms = function(x,y,z){  //fuction for bg, log and reg
        $scope.bg = x;
        $scope.log = y;
        $scope.reg = z;
    }
    
    //create array with users
    if(localStorage.getItem('users') == null){
        $scope.users = [{"name":"Admin", "email":"admin@ua.fm", "pass":"1"}];
        localStorage.setItem("users", JSON.stringify($scope.users));
        console.log($scope.users);
    }else{
        $scope.users = JSON.parse(localStorage.getItem('users'));
        console.log($scope.users);
    }
    
    //add new users
    $scope.addNewUser = function (newUser) {
        $scope.existingName = false;//error - this name exists
        
        //check such name
        let notFound = true; 
        for(let i = 0; i<$scope.users.length; i++){
            if($scope.newUser.name.toUpperCase() == $scope.users[i].name.toUpperCase()){
                notFound = false;
                $scope.existingName = true;
            }
        }
        
        //if name like this didn't find, adds new user
        if(notFound){
            $scope.users.push(newUser); 
            $scope.bg = false;
            $scope.reg = false;
            localStorage.setItem("users", JSON.stringify($scope.users));
            console.log($scope.users);
        }
    }
    
    $scope.online = {"logged":true};//info about logged user
    
    $scope.logIn = function(){//for login into the site
        $scope.wrongPass = false;//hide error in the login
        
        let notFound = true; 
        for(let i = 0; i<$scope.users.length; i++){
            if($scope.user.name.toUpperCase() == $scope.users[i].name.toUpperCase()){
                if($scope.user.pass == $scope.users[i].pass){
                    $scope.online.logged = false;//check logged in or not
                    $scope.online.name = $scope.users[i].name;//add user name
                    notFound = false;//for error in the login
                    $scope.bg = false;
                    $scope.log = false;
                }else $scope.wrongPass = true;//show error in the password  
            }
        }
        
        if(notFound && !$scope.wrongPass) {//show error in the login
            $scope.wrongName = true;
        }
    }
    
    $scope.logOut = function(){//for log out from the site
        $scope.online.logged = true;
        $scope.currentView = "table";
    }
    
    
                        //FOR ERRORS WHEN FILLING THE FORMS
    $scope.getError = function (error, type) {
        if (angular.isDefined(error)) {
            if (error.required) {
                return "Fill the field";
            } else if (error.email) {
                return "Wrong email";
            } else if (error.pattern && type){
                return "Wrong password";
            }
        }
    } 
    
                        //OPTION FOR REGISTERED USERS
     
    //blocks the ability to move topics for unregistered users
    $scope.dragover = function (index, external, type, callback) {
        return !$scope.online.logged;
    }
    
    //select pressed item 
    $scope.show = function(item){
        if(!$scope.online.logged){
            $scope.info = item;
            $scope.currentView = "info"
        }else{
            $scope.bg = true; 
            $scope.log = true;
        }
    }
    
    //return to present view
    $scope.back = function(){
        $scope.currentView = "table";
    }

    //getting all the data from the model
    $scope.refresh = function () {
        //get JSON file by dint of $http
            $http.get('tasks.json').success(function(result){
                console.log('success', result);
                $scope.json = result;
                $scope.items = $scope.json[$scope.numOfGroup-1];
                $scope.saveJson();
            })
            .error(function(result){
                console.log('error');
            });
        return $scope.json;
    }

    //update element
    $scope.update = function (item) {
        for(var i = 0; i < $scope.json.length; i++) {
            for(var k = 0; k < $scope.json[i].tasks.length; k++) {
                if ($scope.json[i].tasks[k].id == item.id) {
                    $scope.json[i].tasks[k] = item;
                    break;
                }
            }
        }
        $scope.saveJson();
        $scope.info = item;
        $scope.currentView = "info"
    }

    //delete category from model
    $scope.deleteCategory = function (item) {
        console.log($scope.json[item]);
        $scope.json.splice(item, 1);
        $scope.currentView = "table";
        $scope.saveJson();  
    }

    //delete element from model
    $scope.deleteElement = function (item) {
        $scope.json.forEach(function (e, i) {
            if (e.tasks.indexOf(item) >= 0)
                e.tasks.splice(e.tasks.indexOf(item), 1);
        });
        $scope.currentView = "table";
        $scope.saveJson();
    }

    //edit or create new element
    $scope.showFlights = true;//show or hide select with flights
    $scope.editOrCreate = function (item, view, currentView, showFlights) {
        $scope.showFlights = showFlights;
        $scope.currentItem = item ? angular.copy(item) : {};
        $scope.currentView = currentView;
        $scope.view = view;
        $scope.saveJson();
    }

    //save changes
    $scope.saveEdit = function (item, planes) {
        if (angular.isDefined(item.id)) {
            $scope.update(item);
        } else {
            $scope.create(item, planes);
        }
    }
    
     //create new flight
    $scope.saveFlight = function (item) {
        if(item.title)
        item.tasks = new Array();
        $scope.json.push(item);
        $scope.currentView = "table";
        $scope.saveJson();        
    }
    
    //add new passenger
    $scope.create = function (item, planes) {
        $scope.json[$scope.json.indexOf(planes)].tasks.push(item);
        $scope.currentView = "table";
        $scope.saveJson();
    }

    //cancel changes and return to present table
    $scope.cancelEdit = function (item) {
        $scope.currentItem = {};
        $scope.currentView = $scope.view;
    }
});




