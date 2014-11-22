$(document).ready(function() {
	$.material.init();
});

var app = angular.module('srt-tube', ['youtube-embed']);

app.controller('SubCtrl', function ($scope, $interval, $http) {
	$scope.PlaybackState = {
		PLAYING : 0,
		PAUSED : 1,
		STOPPED : 2
	}
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
	});
	
	$scope.$on('youtube.player.ended', function ($event, player) {
		$scope.state = $scope.PlaybackState.STOPPED;
	});	
	
	$scope.$on('youtube.player.playing', function ($event, player) {
		$scope.state = $scope.PlaybackState.PLAYING;
	});
		
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
		switch($scope.state) {
			case $scope.PlaybackState.PLAYING:
				// Pause video.
				$scope.player.pauseVideo();
				$scope.state = $scope.PlaybackState.PAUSED;
				break;
			case $scope.PlaybackState.PAUSED:
			case $scope.PlaybackState.STOPPED:
				if ($scope.player) {
					// Play video.
					$scope.player.playVideo();
					$scope.state = $scope.PlaybackState.PLAYING;
				}
				break;
		}
	}
	
	$scope.isDisplay = function (line) {
		if ($scope.state == $scope.PlaybackState.STOPPED) return false;
		return $scope.time >= line.startTime && $scope.time <= line.endTime;
	}
	
	$scope.getPlaybackIcon = function () {
		switch($scope.state) {
			case $scope.PlaybackState.PLAYING:
				return 'mdi-av-pause';
			case $scope.PlaybackState.PAUSED:
			case $scope.PlaybackState.STOPPED:
				return 'mdi-av-play-arrow';
		}

	}
});