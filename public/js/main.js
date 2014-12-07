/* jslint node: true */
'use strict';

$(document).ready(function () {
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
	$scope.displayState = false;
    $scope.time = 0;
    $scope.lastTime = 0;

    $scope.player = null;
    $scope.playerOptions = {
        autohide: 1,
        modestbranding: 1
    };
    $scope.videoId = null;
    $scope.subs = [];

    $scope.hasAlreadyThrownErrorMessageInUsersFace = false;

    $scope.fontSize = 24;

    $scope.fontFamily = 'inherit';
    $scope.fontFamilies = ['inherit','sans-serif','serif','monospace','fantasy','cursive'];

    $scope.fontColor = 'white';
    $scope.fontColors = ['white','yellow','red','green','blue','black'];
	
	$scope.subtitleBackground = false;

    $scope.timeOffset = 0;
    $scope.currentSrt = '';

    // Here we have our subtitle sync timer, which is fired every millisecond.
    // However, because some update interval inaccuracies may occur we have to
    // also manually check that we are in sync.
    $interval(function () {
        var now = Date.now();
        switch ($scope.state) {
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

    // YouTube player events.

    $scope.$on('youtube.player.paused', function ($event, player) {
        $scope.state = $scope.PlaybackState.PAUSED;
        console.log('event: PAUSED');
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

    $scope.uploadFile = function (files) {
        var srtFile = files[0];
        var fd = new FormData();
        fd.append('file', srtFile);

        if (!srtFile || srtFile === $scope.currentSrt) {
            return;
        }

        $scope.currentSrt = srtFile;

        $http.post('/sub/upload', fd, {
            withCredentials: true,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
        }).success(function (data) {
            $scope.subs = data;
        }).error(function (data) {
            if (!$scope.hasAlreadyThrownErrorMessageInUsersFace) {
                window.alert('Error mate!');
                $scope.hasAlreadyThrownErrorMessageInUsersFace = true;
            }
            console.log('error:', data);
        });
    };

    $scope.isSubtitleLineDisplayed = function (line) {
        if ($scope.state === $scope.PlaybackState.STOPPED) {
            return false;
        }
        
        var adjustedTime = $scope.time + $scope.timeOffset;
        return adjustedTime >= line.startTime &&
               adjustedTime <= line.endTime;
    };

    $scope.isValidId = function () {
        // An empty field counts as a valid id.
        if (!$scope.player || $scope.player === undefined ||
            $scope.videoId === null || $scope.videoId === '') {
            return true;
        }

        // If the function getDuration() is not present in our player object,
        // then it is probably not a valid id.
        return typeof $scope.player.getDuration === 'function';
    };
});