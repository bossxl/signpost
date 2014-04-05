module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-shell');
  grunt.initConfig({
    pkg: {
      main: grunt.file.readJSON("../src/package.json");
    },
    uglify: {
      main: {
        options: {
          banner: '/*! <%= pkg.main.name %> v<%= pkg.main.version %> created: <%= grunt.template.today("yyyy-mm-dd") %>*/'
        },
        files: [{
          expand: true,
          cwd: '../src',
          src: '**/*.js',
          dest: '../lib/js'
        }]
      }
    },
    shell: {
      main: {
        command: [
          "node ../lib/main/index.js",
          "node ../lib/digger/index.js",
          "node ../lib/finder/index.js",
        ]
      }
    }
  })
  grunt.registerTask('default', [ 'uglify:main', 'shell:main']);
}
