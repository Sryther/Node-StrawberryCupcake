module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                separator: ';'
            },
            dist: {
                src: ['src/**/*.js'],
                dest: 'public/assets/js/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                mangle: {
                    except: ['jQuery', 'Backbone']
                }
            },
            dist: {
                files: {
                    'public/assets/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        watch: {
            css: {
				files: 'src/scss/**/*.scss',
				tasks: ['sass']
			},
            js: {
                files: ['src/js/**/*.js'],
                tasks: ['concat', 'uglify']
            }
        },
        sass: {
            dist: {
                files: {
                    'public/assets/bootflat/css/custom-bootflat.min.css': 'src/scss/bootflat.scss'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify', 'watch']);
}
