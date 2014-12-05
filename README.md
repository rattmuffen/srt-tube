# srt-tube
srt-tube is a web application for displaying SRT subtitles with YouTube videos.

It's built with [AngularJS](http://angularjs.org/) and [Bootstrap](http://getbootstrap.com/) on the frontend, and [Node.js](http://nodejs.org/) with [Express](http://expressjs.com/) on the backend.

## Dependencies
srt-tube uses the following Node.js dependencies:

* **Express** as web framework.

* **[formidable](https://github.com/felixge/node-formidable)** for handling SRT file uploads.

* **[subtitles-parser](https://github.com/bazh/subtitles-parser)** for parsing SRT files.

and the following Angular modules:

* **[angular-youtube-embed](https://github.com/brandly/angular-youtube-embed)** for embedding YouTube videos.

The BootStrap theme is [Material Design](http://fezvrasta.github.io/bootstrap-material-design/).

## How to install and run
Open a terminal and execute the following command to install the Node.js dependencies:

    npm install

Execute this command to start the application:

    node app.js
	
## Live version	
A live version is available on [srttube.cloudcontrolled](http://srttube.cloudcontrolled.com/).

Note that it might not be updated with the latest commits.