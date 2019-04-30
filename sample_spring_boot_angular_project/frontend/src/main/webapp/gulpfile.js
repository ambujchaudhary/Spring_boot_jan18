var gulp = require('gulp');
// Regular users will call 'require('sonarqube-scanner')' - but not here: eat your own dog food! :-)
// var sonarqubeScanner = require('sonarqube-scanner').customScanner;
var sonarqubeScanner = require('sonarqube-scanner');

gulp.task('default', function (callback) {
  console.log('gulp argumets:', process.argv);

  const args = parseArguments(process.argv) ;
  console.log('gulp processed argumets:', args);

  // We just run a SonarQube analysis and push it to SonarCloud
  sonarqubeScanner({
      serverUrl: 'http://192.168.2.192:9000',
      token: 'eb1146d57066b8f509219be8ffe92b6fcfd9b11a',
      options: {
        "sonar.projectName": "Shootzu-Frontend",
        "sonar.typescript.lcov.reportPaths": "./coverage/lcov.info",
        'sonar.sources': 'web/src,mobile/src,../../../../backend/src/main/,../../../../backend/src/test',
        'sonar.exclusions': 'web/src/**/*.spec.ts,web/src/karma.conf.js,mobile/src/**/*.spec.ts,mobile/src/karma.conf.js,mobile/src/coverage/**',
        'sonar.test.inclusions': 'web/src/**/*.spec.ts,mobile/src/**/*.spec.ts'
      }
    },
    callback
  )
  // ----------------------------------------------------
});

// convert arguments array to object
function parseArguments(argList) {

  let arg = {}, a, opt, thisOpt, curOpt;
  for (a = 0; a < argList.length; a++) {

    thisOpt = argList[a].trim();
    opt = thisOpt.replace(/^\-+/, '');

    if (opt === thisOpt) {

      // argument value
      if (curOpt) arg[curOpt] = opt;
      curOpt = null;

    } else {

      // argument name
      curOpt = opt;
      arg[curOpt] = true;

    }

  }

  return arg;
}
