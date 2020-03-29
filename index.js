'use strict'
// an async function fails early in Node.js versions prior to 8.
async function requiresNode8OrGreater () {}
requiresNode8OrGreater()

const fs = require('fs');
const glob = require('glob');
const beautify = require('js-beautify').html;
const showdown  = require('showdown');
const ParseMarkdownMetadata = require('parse-markdown-metadata');
const Handlebars = require("handlebars");
const yargs = require('yargs');
const chalk = require('chalk');

// Default options
let publicFolder = '_public';
let outputFilename = 'index.html'
let skeletonFile = 'skeleton.html';
let markdownFolder = '';
let dateLocale = 'en-US';
let excludedFiles = [];

// Command line argumens parsing
const argv = yargs
    .option('public', {
        alias: 'p',
        description: 'Output folder for generated HTML',
        type: 'string',
    })
    .option('outfile', {
        alias: 'o',
        description: 'Generated HTML filename',
        type: 'string',
    })
    .option('markdown', {
        alias: 'm',
        description: 'Directory to scan for markdown files',
        type: 'string',
    })
    .option('skeleton', {
        alias: 's',
        description: 'HTML template to use for layout',
        type: 'string',
    })
    .option('defaults', {
        alias: 'd',
        description: 'Show default options',
        type: 'boolean',
    })
    .option('datelocale', {
        alias: 'l',
        description: 'Date locale',
        type: 'string',
    })
    .option('exclude', {
        alias: 'e',
        description: 'Exclude markdown files',
        type: 'array',
    })
    .help()
    .alias('help', 'h')
    .argv;

if(argv.outfile) {
    outputFilename = argv.outfile;
}

if(argv.public) {
    publicFolder = argv.public;
}

if(argv.markdown) {
    markdownFolder = argv.markdown;
}

if(argv.skeleton) {
    skeletonFile = argv.skeleton;
}

if(argv.datelocale) {
    dateLocale = argv.datelocale;
}

if(argv.exclude) {
    argv.exclude.forEach(function (file) {
        excludedFiles.push('**/'+file);
    });
}


if(argv.defaults) {
    if(markdownFolder=='') {
        markdownFolder = __dirname;
    }
    console.log(chalk`
    Output folder for generated HTML:   {bold ${__dirname+'/'+publicFolder}}
    Generated HTML filename:            {bold ${outputFilename}}
    Folder to scan for markdown files:  {bold ${markdownFolder}}
    HTML template to use for layout:    {bold ${skeletonFile}}
    Date locale:                        {bold ${dateLocale}}
    `);
    process.exit(0);
}

if (!fs.existsSync(publicFolder)){
    fs.mkdirSync(publicFolder);
}

let converter = new showdown.Converter({emoji: true});
converter.setFlavor('vanilla');

// We could add options for the user to set date format + locale
Handlebars.registerHelper("prettifyDate", function(timestamp) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(timestamp).toLocaleDateString(dateLocale, options)
});

// Read the html skeleton file
let html = fs.readFileSync(skeletonFile).toString();
let template = Handlebars.compile(html);
let data = {"posts":[]};

glob(__dirname +'/'+markdownFolder+'/*.md', {ignore:excludedFiles}, (err, files)=>{
    if(err) throw err;
    let mdfile,md;
    files.forEach(function (file) {
        mdfile = fs.readFileSync(file).toString();
        md = new ParseMarkdownMetadata(mdfile);
        md.props.date = new Date(md.props.date);
        md.props.content = converter.makeHtml(md.content);
        data.posts.push(md.props);
    });
    data.posts.sort((b, a) => a.date - b.date);
    let result = template(data);
    let stream = fs.createWriteStream(publicFolder+'/'+outputFilename);

    stream.once('open', function(fd) {
        stream.end(beautify(result, { indent_size: 2, space_in_empty_paren: true }));   
        stream.end(console.log(chalk.green('Finished')));   
    });
});
