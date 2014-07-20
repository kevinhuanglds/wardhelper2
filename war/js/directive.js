app.directive('onReadFile', function ($parse) {
   return {
      restrict: 'A',
      scope: false,
      link: function(scope, element, attrs) {
         var fn = $parse(attrs.onReadFile);
 
         element.on('change', function(onChangeEvent) {
            var reader = new FileReader();
 
            reader.onload = function(onLoadEvent) {
               scope.$apply(function() {
                  fn(scope, {$fileContent:onLoadEvent.target.result});
               });
            };
 
            reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
         });
      }
   };
});


// Add this directive where you keep your directives
app.directive('onLongPress', function($timeout) {
   return {
      restrict: 'A',
      link: function($scope, $elm, $attrs) {
         $elm.bind('touchstart', function(evt) {
            // Locally scoped variable that will keep track of the long press
            $scope.longPress = true;
 
            // We'll set a timeout for 600 ms for a long press
            $timeout(function() {
               if ($scope.longPress) {
                  // If the touchend event hasn't fired,
                  // apply the function given in on the element's on-long-press attribute
                  $scope.$apply(function() {
                     $scope.$eval($attrs.onLongPress)
                  });
               }
            }, 600);
         });
 
         $elm.bind('touchend', function(evt) {
            // Prevent the onLongPress event from firing
            $scope.longPress = false;
            // If there is an on-touch-end function attached to this element, apply it
            if ($attrs.onTouchEnd) {
               $scope.$apply(function() {
                  $scope.$eval($attrs.onTouchEnd)
               });
            }
         });
      }
   };
})
