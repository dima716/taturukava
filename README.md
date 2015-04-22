## Project Stub

A project stub for making web sites with BEM methodology.
Kindly adapted from [getbem](https://github.com/getbem).

It uses next technologies:  

1. **Jade** - templating language for HTML
2. **Sass** - preprocessor for CSS
3. **Browserify** - for managing JS
4. **Gulp** - streaming build system

Each BEM block has its own jade, scss and js realisation.
Then, using Gulp and its plugins for BEM development all blocks are compiled in one html file, one js file and one css file.

Every page is compiled from different BEM blocks. Thus we only have necessary js,css,html code and nothing more :)

To know which BEM blocks should be compiled for a page and which shouldn't one can use dependencies files like `index.deps.js` where we describe BEM blocks that our BEM block depends on.
