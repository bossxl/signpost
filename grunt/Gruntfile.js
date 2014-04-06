module.exports = function(grunt) {
  grunt.file.setBase('..');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-shell-spawn');
  grunt.initConfig({
    pkg: {
      main: grunt.file.readJSON("src/package.json")
    },
    uglify: {
      main: {
        options: {
          banner: '/*! <%= pkg.main.name %> v<%= pkg.main.version %> created: <%= grunt.template.today("yyyy-mm-dd") %>*/'
        },
        files: [{
          expand: true,
          cwd: 'src',
          src: '**/*.js',
          dest: 'lib/js'
        }]
      }
    },
    shell: {
      proxy: {
        execOptions: {
          detached: true
        },
        command: "node ../lib/main/index.js"
      },
      digger: {
        execOptions: {
          detached: true
        },
        command: "node ../lib/digger/index.js"
      },
      finder: {
        execOptions: {
          detached: true
        },
        command: "node ../lib/finder/index.js"
      }
    }
  })
  grunt.registerTask('default', ['uglify:main', 'shell:proxy', 'shell:digger', 'shell:finder']);
}
