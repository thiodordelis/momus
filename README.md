# Momus - A static site generator from Markdown files

## About ##
**Momus** is a simple and easy to use static site generator with emphasis on blogs.

## Philosophy ##
The philosopy of Momus is simple: You write your content in Markdown, prepare a template and run ``node index.js``. Your blog will be generated in a matter of seconds. 

## Features ##
* Handlebars.js templating 
* Support for metadata for every markdown(post) you write. 
* Include / exclude markdown files for final build
* Ready to use generated html files. Upload them to Github pages or host them on your own. 

## Demo ##
Check out my blog which is made with Momus: [https://thiodordelis.github.io/blog/blog.html](https://thiodordelis.github.io/blog/blog.html)

## Requirements ##
You need [Node.JS](https://nodejs.org) and [npm](https://npmjs.com)

## Getting started ##
Clone this repo:

    git clone https://github.com/thiodordelis/momus.git

Install dependencies with npm: 

    npm install showdown js-beautify glob handlebars parse-markdown-metadata chalk yargs

Write your HTML template ([sample](https://github.com/thiodordelis/momus/blob/master/sample/skeleton.html)), your posts in Markdown and create your blog with:  

    node index.js 

Your blog resides inside the **__public** folder

## Help ##
Run 

    node index.js -h

## Future ##
Right now, Momus will generate your blog in a single page with posts in their full length. I'm planning to add support for rendering posts with just the title and a preview text. Also, tags are coming in the next releases.

## Support ##
You can support my project by hitting the :star: button!