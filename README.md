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

Other front end dependencies include:

* **[Material Design](http://fezvrasta.github.io/bootstrap-material-design/)** as the BootStrap theme.

* **[noUiSlider](http://refreshless.com/nouislider/)** for progress bars and such.

## How to install
To install the Node.js dependencies, open a terminal and execute the following command :

    npm install
	
To install the Bower dependencies, install [bower-installer](https://github.com/blittle/bower-installer) with `npm install -g bower-installer` and then run:

    bower-installer

## How to run
Execute this command to start the application:

    node app.js
	
## Live version	
A live version is available on [srttube.cloudcontrolled.com](http://srttube.cloudcontrolled.com/).

Note that it might not be updated with the latest commits.