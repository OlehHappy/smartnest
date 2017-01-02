module.exports = function(grunt) {

  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // watching for changes
    watch: {
      // server side
      jade: {
        files: ['code/server/views/**'],
        options: {
          livereload: true,
        }
      },
      js_server: {
        files: ['code/server/**/*.js', '!code/server/node_modules/**/*.js'],
        tasks: ['jshint'],
        options: {
          livereload: true,
        }
      },

      // client side
      js_client: {
        files: ['code/client/js/**'],
        tasks: ['concat', 'jshint'],
        options: {
          livereload: true,
        }
      },
      html: {
        files: ['code/client/views/**'],
        options: {
          livereload: true,
        }
      },
      less: {
        files: ['code/client/less/**'],
        tasks: ['less']
      },
      css: {
        files: ['code/client/css/**'],
        options: {
          livereload: true
        }
      }
    },

    // syntax validation
    jshint: {
      all: ['code/client/js/**/*.js', 'code/server/**/*.js', '!bin/**', '!node_modules/**', '!code/server/node_modules/**',  '!code/client/lib/**', '!code/client/concated/**', '!code/client/js/support/**', '!code/test/**'],
      options: {
        multistr: true
      }
    },

    // convert all LESS files in one CSS file
    less: {
      development: {
        files: [
          {
            expand: true,
            cwd: "code/client/less",
            src: ['style.less'],
            dest: "code/client/css",
            ext: ".css"
          }
        ]
      }
    },

    // concatenating all JS files into one file
    concat: {
      compile_js: {
        src: [
          /* jQuery NOTE: has to be imported before Angular and Bootstrap*/
          "code/client/lib/jquery/jquery.min.js",
          /* Underscore */
          "code/client/lib/underscore/underscore-min.js",
          /* Braintree client */
          "code/client/lib/braintree-web/dist/braintree.js",
          /* AngularJS */
          "code/client/lib/angular/angular.js",
          "code/client/lib/angular-animate/angular-animate.min.js",
          "code/client/lib/angular-messages/angular-messages.min.js",
          "code/client/lib/angular-route/angular-route.min.js",
          "code/client/lib/angular-cookies/angular-cookies.js",
          "code/client/lib/angular-resource/angular-resource.js",
          "code/client/lib/angular-truncate/src/truncate.js",
          "code/client/lib/angular-sanitize/angular-sanitize.min.js",
          "code/client/lib/angular-underscore-module/angular-underscore-module.js",
          "code/client/lib/angular-touch/angular-touch.min.js",
          "code/client/lib/ngUpload/ng-upload.js",
          "code/client/lib/moment/moment.js",
          "code/client/lib/angular-loading-bar/src/loading-bar.js",
          "code/client/lib/ngstorage/ngStorage.min.js",
          "code/client/lib/ngtoast/dist/ngToast.min.js",
          "code/client/lib/angular-md5/angular-md5.min.js",
          "code/client/lib/moment/moment.js",
          "code/client/js/support/moment-holidays.js",

          /* Angular UI */
          "code/client/lib/angular-bootstrap/ui-bootstrap-tpls.js",
          "code/client/lib/angular-ui-utils/modules/route/route.js",
          "code/client/lib/angular-ui-router/release/angular-ui-router.js",
          "code/client/lib/angular-ui-router.stateHelper/statehelper.js",
          "code/client/lib/angular-ui-select/dist/select.js",
          /* Bootstrap NOTE: remove it in future, Invite steps still require this */
          "code/client/lib/bootstrap/dist/js/bootstrap.min.js",
          "code/client/lib/mui/dist/js/mui.min.js",
          "code/client/lib/angular-payments/lib/angular-payments.min.js",

          /* Google Analytics */
          "code/client/lib/angular-google-analytics/dist/angular-google-analytics.js",

          /* phone verification */
          "code/client/lib/libphonenumber/dist/libphonenumber.js",

          /* Services */
          "code/client/js/services/index.js",
          "code/client/js/services/global.js",
          "code/client/js/services/residents.js",
          "code/client/js/services/contract.js",
          "code/client/js/services/user.js",
          "code/client/js/services/braintreeService.js",
          "code/client/js/services/validate.js",
          "code/client/js/services/transform.js",
          "code/client/js/services/country.js",
          "code/client/js/services/transaction.js",
          "code/client/js/services/hellosign.js",
          "code/client/js/services/check.js",
          "code/client/js/services/history.js",
          "code/client/js/services/filterStorage.js",
          "code/client/js/services/loader.js",
          "code/client/js/services/flashMessage.js",
          "code/client/js/services/pay.js",
          "code/client/js/services/time.js",

          /* Filters */
          "code/client/js/filters/filters.js",
          /* Directives */
          "code/client/js/directives/directives.js",
          "code/client/js/directives/braintree.js",
          /* System Module */
          "code/client/js/system.js",

          "code/client/js/header.js",

          /* Admin Controllers */
          "code/client/js/admin/controllers/index.js",
          "code/client/js/admin/controllers/users/edit.js",
          "code/client/js/admin/controllers/adminTools.js",

          /* smartnest.admin.residents */
          "code/client/js/admin/controllers/residents/index.js",
          "code/client/js/admin/controllers/residents/list.js",
          "code/client/js/admin/controllers/residents/detail.js",
          "code/client/js/admin/controllers/residents/edit.js",
          "code/client/js/admin/controllers/residents/add.js",
          "code/client/js/admin/controllers/residents/modals/delete.js",

          /* smartnest.admin.resident */
          "code/client/js/admin/controllers/resident/resident.js",
          "code/client/js/admin/controllers/resident/info.js",
          "code/client/js/admin/controllers/resident/edit.js",
          "code/client/js/admin/controllers/resident/contract.js",
          "code/client/js/admin/controllers/resident/editContract.js",
          "code/client/js/admin/controllers/resident/ledger.js",
          "code/client/js/admin/controllers/resident/modals/deleteResident.js",

          /* smartnest.admin.payments */
          "code/client/js/admin/controllers/payments/index.js",
          "code/client/js/admin/controllers/payments/list.js",
          "code/client/js/admin/controllers/payments/modals/editTransaction.js",

          /* Admin App Module */
          "code/client/js/admin/app.js",

          /* Resident Controllers */
          "code/client/js/resident/controllers/index.js",
          "code/client/js/resident/controllers/paymyrent.js",
          "code/client/js/resident/controllers/settings.js",
          "code/client/js/resident/controllers/changepassword.js",
          "code/client/js/resident/controllers/history.js",
          "code/client/js/resident/controllers/modals/pay.js",
          "code/client/js/resident/controllers/modals/recurringCancel.js",

          "code/client/js/resident/app.js",


          /* Public Controllers */
          "code/client/js/public/controllers/index.js",
          "code/client/js/public/controllers/general_modal.js",
          "code/client/js/public/controllers/signup.js",
          "code/client/js/public/controllers/signup/personal.js",
          "code/client/js/public/controllers/signup/rent.js",
          "code/client/js/public/controllers/signup/done.js",

          "code/client/js/public/app.js",


          /* Smartnest App Module */
          "code/client/js/app.js",
          /* Support */
          "code/client/js/support/ga.js",
          "code/client/js/support/uservoice.js",
          "code/client/js/support/FileSaver.js"
        ],
        dest: 'code/client/concated/smartnest-<%= pkg.version %>.js'
      }
    },

    // Minify the sources
    uglify: {
      options: {
        // prevent changes of variable and function names
        mangle: false
      },
      compile: {
        files: {
          '<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
        }
      }
    },

    // start server and keep watching...
    nodemon: {
      dev: {
        script: 'code/server/server.js',
        options: {
          args: [],
	        nodeArgs: ['--debug'],
          ignore: ['code/server/node_modules/**'],
          ext: 'js',
          watch: ['code/server/**/*.js'],
          debug: true,
          delayTime: 1,
          env: {
              PORT: 3000
          },
          cwd: __dirname
        }
      }
    },
    concurrent: {
      tasks: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },
    mochaTest: {
      test: {
        options: {
          //reporter: 'list'
          reporter: 'spec'
        },
        //src: ['../test/**/*.js', '!node_modules/**']
        src: ['code/server/tests/**/*.js']
      },
      jenkins: {
        options: {
          reporter: 'xunit-file'
        },
        src: ['test/**/*.js', '!node_modules/**']
      }
    },

    env: {
      test: {
        NODE_ENV: 'test'
      },
      jenkins: {
        NODE_ENV: 'test',
        XUNIT_FILE: 'test-results-server.xml'
      }
    }

  });

  // Load NPM tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');


  // Making grunt default to force in order not to break the project.
  //grunt.option('force', true);

  // Default task
  grunt.registerTask('default', ['less', 'concat', 'concurrent', 'jshint']);

  // Build task.
  grunt.registerTask('build', ['less', 'concat', 'jshint']);

  // Compile task.
  grunt.registerTask('compile', ['less', 'concat', 'uglify']);

  // Test task.
  grunt.registerTask('test', ['env:test', 'mochaTest:test']);
  grunt.registerTask('test:jenkins', ['env:jenkins', 'mochaTest:jenkins']);
};
