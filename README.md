Wix Angular Seed
=========

Wix Angular Seed is a client-side environment built upon the AngularJS framework that lets you write expressive, readable
and testable web applications for the Wix App Market. As a client-side solution, you are free to choose your server-side
solution as you see fit ([our Symfony2 bundle is recommended](https://github.com/ranm8/WixFrameworkBundle)) and communicate
in a RESTful manner between your client and your server. It features a simple way to integrate deep linking into your Wix
application by always keeping your application state synchronized with Wix. It allows you to easily create links to your
backend (whether it's a Symfony2 backend, a plain PHP backend or any different backend) that includes Wix specific information
so that your backend can have access to it. It also enhances Wix's SDK to make it easier to work with.

By the nature of Wix applications, they require you to have a very rich and engaging client-side for your users. For this
reason, the Wix Angular Seed comes bundled with two extra modules: a UI module that integrates popular plugins into AngularJS
to allow you to easily create color-pickers, date-pickers, accordions, dialogs and more. The second module is a text extension
that help you truncate strings, wordwrap paragraphs and mroe.

On top of that the Wix Angular Seed includes .sass files required to create the feeling of an amazing Wix application.
You can choose to use it as it is to quickly make your application look like a Wix application should or you can extend it
to match it to your exact needs.

Getting started
---------

As a seed, you only need to clone the Git repository and you are on your feets. The seed has keeps a file structure similar
to the standard of the [AngularJS Seed](https://github.com/angular/angular-seed). Once you cloned the repository you can start
hacking...

Directory layout
---------

    app/                --> all of your application files
      css/              --> compiled css files, you are encouraged to compile your own css
        style.css       --> Elad...
        settings.css    --> Elad...
      images/           --> image files
      index.html        --> app layout file (the main html template file of the app)
      js/               --> javascript files
        app.js          --> application
        controllers/    --> application controllers
          demo.js       --> demo controller for a settings page
          view.js       --> basic controller for a view page
        directives.js   --> application directives
        filters.js      --> custom angular filters
        services.js     --> custom angular services
      lib/              --> angular and 3rd party javascript libraries
        angular/
          angular.js        --> the latest angular js
          angular.min.js    --> the latest minified angular js
          angular-*.js      --> angular add-on modules
          version.txt       --> version number
        bootstrap/          --> twitter bootstrap 3rd party files
        chosen/             --> chosen 3rd party files
        color-picker/       --> wix's color-picker 3rd party files
        jquery/             --> jquery
        jquery-ui/          --> jquery-ui
        text-extension/     --> core files for the text extension for angular
        ui-extension/       --> core files for the ui extension for angular
        wix/                --> core files for the wix extension for angular
      partials/             --> angular view partials (partial html templates)
        demo.html
        dialog.html
        view.html
        welcome.html

    config/testacular.conf.js        --> config file for running unit tests with Testacular
    config/testacular-e2e.conf.js    --> config file for running e2e tests with Testacular

    scripts/            --> handy shell/js/ruby scripts
      e2e-test.sh       --> runs end-to-end tests with Testacular (*nix)
      e2e-test.bat      --> runs end-to-end tests with Testacular (windows)
      test.bat          --> autotests unit tests with Testacular (windows)
      test.sh           --> autotests unit tests with Testacular (*nix)
      web-server.js     --> simple development webserver based on node.js

    test/               --> test source files and libraries
      e2e/              -->
        runner.html     --> end-to-end test runner (open in your browser to run)
        scenarios.js    --> end-to-end specs
      lib/
        angular/                --> angular testing libraries
          angular-mocks.js      --> mocks that replace certain angular services in tests
          angular-scenario.js   --> angular's scenario (end-to-end) test runner library
          version.txt           --> version file
      unit/                     --> unit level specs/tests
        js/                     --> application tests
          controllers/          --> controllers specs
            demo.js             --> demo controller specs
        lib/                    --> 3rd party tests
          text-extension/
            textSpec.js
          ui-extension/
            uiSpec.js
          wix/
            wixSpec.js