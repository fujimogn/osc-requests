module.exports = function(config) {
    config.set({
        frameworks: ['jasmine', 'browserify'],
        browsers: ['PhantomJS'],

        preprocessors: {
            'src/**/*.js': ['browserify'],
            'test/**/*.js': ['browserify']
        },

        browserify: {
            debug: true,
            transform: [ 'babelify' ]
        },

        files: [
            'test/**/*-spec.js',
            'src/**/*.js'
        ],

        singleRun: true,
        autoWatch: true,

        phantomjsLauncher: {
            // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
            exitOnResourceError: true
        }
    });
};