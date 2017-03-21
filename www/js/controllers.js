angular.module('starter.controllers', [])

  .controller('AddCtrl', function ($scope, Expenses) {


    $scope.addExpense = function (amount, category) {
      //alert("adding expense " + amount);
      Expenses.add(amount, category);
    };

  })
  .controller('ListCtrl', function ($scope, Expenses) {
    Expenses.all((tx, err, results) => {
      if (!err) {
        $scope.expenses = results;
        $scope.$apply();
      }
    });
  })
  .controller('GraphCtrl', function ($scope, Expenses) {
    $scope.options = {
      chart: {
        type: 'pieChart',
        height: 500,
        x: function (d) {
          return d.category;
        },
        y: function (d) {
          return d.count;
        },
        showLabels: true,
        duration: 500,
        labelThreshold: 0.01,
        labelSunbeamLayout: true,
        legend: {
          margin: {
            top: 5,
            right: 35,
            bottom: 5,
            left: 0
          }
        }
      }
    };
    Expenses.categories((tx, err, results) => {
      if (!err) {
        $scope.data = results;
        $scope.$apply();
      }
    });

  });
