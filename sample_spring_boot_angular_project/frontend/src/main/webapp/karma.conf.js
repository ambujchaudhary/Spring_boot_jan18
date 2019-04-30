// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
               basePath: '',
               frameworks: ['jasmine', '@angular-devkit/build-angular'],
               plugins: [
                 require('karma-jasmine'),
                 require('karma-chrome-launcher'),
                 require('karma-jasmine-html-reporter'),
                 require('karma-coverage-istanbul-reporter'),
                 require('@angular-devkit/build-angular/plugins/karma')
               ],
               client: {
                 clearContext: false // leave Jasmine Spec Runner output visible in browser
               },
               coverageIstanbulReporter: {
                 dir: require('path').join(__dirname, 'coverage'),
                 reports: ['html', 'lcovonly'],
                 //skipFilesWithNoCoverage: false,
                 fixWebpackSourcePaths: true,
                 thresholds: {
                   statements: 0,
                   lines: 0,
                   branches: 0,
                   functions: 0
                 }
               },
               angularCli: {
                 environment: 'dev'
               },
               reporters: ['progress', 'kjhtml'],
               port: 9876,
               colors: true,
               logLevel: config.LOG_INFO,
               autoWatch: false,
               browsers: ['Chrome'],
               browserDisconnectTimeout: 20000,
               browserDisconnectTolerance: 3,
               browserNoActivityTimeout: 60000,
               flags: [
                 '--disable-browser-side-navigation',
                 '--disable-web-security',
                 '--disable-gpu',
                 '--no-sandbox',
                 'window-size=1920, 1080'
               ],
               singleRun: true
             });
};