'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        uglify: {
            pkg: grunt.file.readJSON('package.json'),
            all: {
                src: ['./static/js/config.js', './static/js/main.js'],
                dest: './static/js/all.min.js'
            }
        },
        sass: {
            all: {
                options: {
                    style: 'compressed'
                },
                src: './static/css/main.scss',
                dest: './static/css/all.min.css'
            }
        },
        watch: {
            js: {
                files: '<%= uglify.all.src %>',
                tasks: ['uglify']
            },
            css: {
                files: '<%= sass.all.src %>',
                tasks: ['sass']
            }
        },
        clean: {
            build: ['./.sass-cache']
        },
        copy: {
            css: {
                expand: true,
                src: ['<%= sass.all.dest %>'],
                dest: './'
            },
            js: {
                expand: true,
                src: ['<%= uglify.all.dest %>'],
                dest: './'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['clean:build', 'uglify', 'sass', 'copy']);
};
