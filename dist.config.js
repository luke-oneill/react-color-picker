module.exports = {
    entry: './src/index.jsx',
    output: {
        path         : __dirname + "/dist",
        libraryTarget: 'umd',
        library      : 'ColorPicker',
        filename     : require('./DIST_FILE_NAME') + '.js'
    },
    module: {
        loaders: require('./loaders.config')
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    },
    resolve: {
        // Allow to omit extensions when requiring these files
        extensions: ['', '.js', '.jsx']
    }
}