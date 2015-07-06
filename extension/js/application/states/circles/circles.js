app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('circles', {
        url: '/circles',
        controller: 'circlesController',
        templateUrl: 'js/application/states/circles/circles.html'
    });

});

app.controller('circlesController', function ($scope, $modal, $log, BackgroundFactory) {

$scope.oneAtATime = true;


  //userfactory.getmycircles.then
  $scope.groups = [
    {
      name: 'Dynamic Group Header - 1',
      status: true,
      id: 24,
      members: ['member 1', 'member 2']
    },
    {
      name: 'Dynamic Group Header - 2',
      status: false,
      id: 6,
      members: ['john', 'joe']
    }
  ];

/*******************************/

  $scope.createCircle = function() {

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'js/application/states/circles/modals/createCircleModal.html',
        controller: 'createCircleModalCtrl',
        size: 'sm'
      }); // end modal open

    modalInstance.result.then(function (circleName) {

      $log.info('recieved from modal',circleName)
      
      $scope.groups.unshift({name:circleName, status:true, id:12})

    })
    .then(null,  function () {
      $log.info('Modal dismissed at: ' + new Date());
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

      $log.info('recieved from modal',circleId)
      
      for(var i=0; i<$scope.groups.length; i++){
        if($scope.groups[i].id === circleId){
          $scope.groups.splice(i,1);
        }
      }

    })
    .then(null,  function () {
      $log.info('Modal dismissed at: ' + new Date());
    });

  }; // end $scope.deleteCircle

/*****************************************/
  $scope.addMember = function(circleId) {
    $log.info('this is addMember',circleId);

      var modalInstance = $modal.open({
        animation: false,
        templateUrl: 'js/application/states/circles/modals/addmembertocirclemodal.html',
        controller: 'addMemberModalCtrl',
        size: 'sm'
        // resolve: {
        //   items: function () {
        //     return $scope.items;
        //   }
        // }
      }); // end modal open

    modalInstance.result.then(function (emailToAdd) {

      $log.info('recieved from modal',emailToAdd)
      
      $scope.groups.forEach(function (group) {

        if (group.id === circleId) {
          //FIXME -- save added member
          group.members.push(emailToAdd);
        };
      });

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
      $scope.deleteMemb = true;
  }

  $scope.deleteMember = function(groupId,memId){

  }

});