$(document).ready(function() {
	$.material.init();
});


var app = angular.module('srt-tube', ['youtube-embed']);
app.controller('SubCtrl', function ($scope, $interval, $http) {
	$scope.time = 0;
	$scope.lastTime = 0;
	
	$scope.isPlaying = false;
	
	$scope.player = null;
	$scope.videoId;
	$scope.subs = [];
	
	$interval(function() {
		var now = new Date().getTime();
		if ($scope.isPlaying) {
			if (now > $scope.lastTime) {
				$scope.time += (now - $scope.lastTime);
				$scope.lastTime = now;
			}
		} else {
			$scope.lastTime = now
			$scope.time = 0;
		}
    }, 1);
	
	$scope.uploadFile = function(files) {
		var fd = new FormData();
		//Take the first selected file
		fd.append("file", files[0]);
		
		if (files[0] == null) return;
		

		$http.post('/sub/upload', fd, {
			withCredentials: true,
			headers: {'Content-Type': undefined },
			transformRequest: angular.identity
		}).success(function (data) {
			$scope.subs = data;
		}).error(function (data) {
			window.alert('Error mate!');
			console.log(data);
		});

	}
	
	$scope.togglePlay = function () {
		$scope.isPlaying = !$scope.isPlaying;
	  	$scope.time = 0;

	  if ($scope.isPlaying) {
		if ($scope.player)
		  $scope.player.playVideo();
	  } else {
		  if ($scope.player)
			  $scope.player.stopVideo();
	  }
	}
	
	$scope.isDisplay = function (line) {
	  return $scope.time >= line.startTime && $scope.time <= line.endTime;
	}
});