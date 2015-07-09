app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('circles', {
        url: '/circles',
        controller: 'circlesController',
        templateUrl: 'js/application/states/circles/circles.html'
    });

});

app.controller('circlesController', function ($scope, $modal, $log, CircleFactory, BackgroundFactory) {

$scope.oneAtATime = true;
$scope.groups = {};

BackgroundFactory.checkLoggedIn()
.then(function(response){
  return $scope.user = response.user;
})
.then(function(user){
  BackgroundFactory.getUserCircles().then(function(circlesInfo){
    var own = [], part = [];

    $log.info('this is circle info on circle.js', circlesInfo, user)

    for(var i=0; i<circlesInfo.length; i++){

      console.log(circlesInfo[i], typeof circlesInfo[i].creator._id, typeof user._id)

      if(circlesInfo[i].creator._id === $scope.user._id) { 
        
        own.push(circlesInfo[i])
        console.log('hit if func own', own)

      }else {part.push(circlesInfo[i]); console.log('hit else func part', part);}
    }
    $scope.groups.owned = own;
    $scope.groups.part = part;
    console.log('this is circles', $scope.groups)
    return $scope.groups
  })
  
})
.then(null, function(err){
  throw new Error('Error retrieving user and group data from factory')
})

/*******************************/

  $scope.createCircle = function() {

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'js/application/states/circles/modals/createCircleModal.html',
        controller: 'createCircleModalCtrl',
        size: 'sm',
        resolve: {
          user: function () {
            return $scope.user;
          }
        }
      }); // end modal open

    modalInstance.result.then(function (circleName) {
      CircleFactory.createCircle(circleName)
      .then(function(res){
        $log.info('hit modal createcircle', res)
        $scope.groups.owned.unshift(res);
      })
      .then(null, function(err){
        $log.info('Modal dismissed at: ' + new Date());
      })
    });

  }; // end $scope.createCircle

/*************************************/
  $scope.deleteCircle = function(circleId) {

    var modalInstance = $modal.open({
      animation: true,
      templateUrl: 'js/application/states/circles/modals/deleteCircleModal.html',
      controller: 'deleteCircleModalCtrl',
      size: 'sm',
      resolve: {
          circleId: function () {
            return circleId;
          }
        }
    }); // end modal open

    modalInstance.result.then(function (circleId) {
      CircleFactory.deleteCircle(circleId)
      .then(function(stat){
          $log.info('recieved from modal',circleId)
          for(var i=0; i<$scope.groups.length; i++){
            if($scope.groups[i]._id === circleId) $scope.groups.splice(i,1);
          }     
      }) 
      .then(null,  function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
  })
}; // end $scope.deleteCircle

/*****************************************/
  $scope.addMember = function(circleId) {
    $log.info('this is addMember',circleId);

      var modalInstance = $modal.open({
        animation: false,
        templateUrl: 'js/application/states/circles/modals/addmembertocirclemodal.html',
        controller: 'addMemberModalCtrl',
        size: 'sm',
        resolve: {
          circleId: function () {
            return circleId;
          },
          groups: function(){
            return $scope.groups;
          }
        }
      }); // end modal open

    modalInstance.result.then(function (memberEmail) {
      CircleFactory.editMember(circleId, memberEmail, 'add')
      .then(function(newMember){
        $scope.groups.forEach(function (group) {
          if (group._id.toString() === circleId) {
            group.members.push(newMember)
          };
        }); 
      })
    })
    .then(null,  function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }; // end $scope.addMember

  $scope.status = {
    isFirstOpen: true,
    isFirstDisabled: false
  };

/*******************************/

  $scope.deleteMemb = false;
  $scope.showDelete = function(){
    if($scope.deleteMemb === false)
      $scope.deleteMemb = true;
    else
      $scope.deleteMemb = false;
  }

  $scope.deleteMember = function(circleId, memEmail){
    CircleFactory.editMember(circleId, memEmail, 'delete')
      .then(function(newMember){
        for(var i=0; i<$scope.groups.length; i++){
          if($scope.groups[i]._id === circleId){
            for(var j=0; j<$scope.groups[i].members.length; j++){
              if($scope.groups[i].members[j]._id === newMember._id){
                $scope.groups[i].members.splice(j,1);
              }
            }
          }
        }
        
      })
  }

});