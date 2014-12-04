/* jslint node: true */
"use strict";

$(document).ready(function() {
	$.material.init();
});

var app = angular.module('srt-tube', ['youtube-embed','ngSanitize']);

app.controller('SubCtrl', function ($scope, $interval, $http) {
	$scope.PlaybackState = {
		PLAYING : 0,
		PAUSED : 1,
		STOPPED : 2
	};
	$scope.state = $scope.PlaybackState.STOPPED;

	$scope.displayTimer = false;
	$scope.time = 0;
	$scope.lastTime = 0;

	$scope.player = null;
	$scope.playerOptions = {
		autohide: 1,
		modestbranding: 1
	};
    $scope.videoId;
	$scope.subs = [];

    $scope.hasAlreadyThrownErrorMessageInUsersFace = false;

	$scope.fontSize = 24;
	
	$scope.fontFamily = 'inherit';
	$scope.fontFamilies = ['inherit','sans-serif','serif','monospaced','fantasy','cursive']
	
	$scope.fontColor = 'white';
	$scope.fontColors = ['white','yellow','red','green','blue','black']
    
    $scope.timeOffset = 0;
    $scope.currentSrt = '';

	// Timer.
	$interval(function() {
		var now = new Date().getTime();
		switch($scope.state) {
			case $scope.PlaybackState.PLAYING:
				if (now > $scope.lastTime) {
					$scope.time += (now - $scope.lastTime);
					$scope.lastTime = now;
				}
				break;
			case $scope.PlaybackState.STOPPED:
				$scope.lastTime = now;
				$scope.time = 0;
				break;
			case $scope.PlaybackState.PAUSED:
				$scope.lastTime = now;
				break;
		}
    }, 1);

	// Player events,
	$scope.$on('youtube.player.paused', function ($event, player) {
		$scope.state = $scope.PlaybackState.PAUSED;
        console.log('event: PAUSED');
//        console.log("Current time:", player.getCurrentTime());
	});

    $scope.$on('youtube.player.buffering', function ($event, player) {
        $scope.state = $scope.PlaybackState.PAUSED;
        console.log('event: BUFFERING');
    });

	$scope.$on('youtube.player.ended', function ($event, player) {
		$scope.state = $scope.PlaybackState.STOPPED;
        console.log('event: ENDED');		
	});

	$scope.$on('youtube.player.playing', function ($event, player) {
		$scope.state = $scope.PlaybackState.PLAYING;
        $scope.time = Math.floor(player.getCurrentTime() * 1000);
        console.log('event: PLAYING');
	});

	$scope.uploadFile = function(files) {
		var fd = new FormData();
		//Take the first selected file
		fd.append("file", files[0]);

		if (!files[0] || files[0] === $scope.currentSrt)
            return;

        $scope.currentSrt = files[0];

		$http.post('/sub/upload', fd, {
			withCredentials: true,
			headers: {'Content-Type': undefined },
			transformRequest: angular.identity
		}).success(function (data) {
			$scope.subs = data;
		}).error(function (data) {
            if (!$scope.hasAlreadyThrownErrorMessageInUsersFace) {
                window.alert('Error mate!');
                $scope.hasAlreadyThrownErrorMessageInUsersFace = true;
            }
			console.log(data);
		});
	};

	$scope.isDisplay = function (line) {
		if ($scope.state == $scope.PlaybackState.STOPPED) return false;
        var adjustedTime = $scope.time + $scope.timeOffset;
		return adjustedTime >= line.startTime &&
               adjustedTime <= line.endTime;
	};
	
	$scope.isValidId = function () {
		if (!$scope.player || $scope.player == 'undefined' || $scope.videoId == null || $scope.videoId == '') return true;
		
		return $scope.player.getDuration() != 0;
	}
});