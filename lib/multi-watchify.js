#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var watchify = require('watchify');
var browserify = require('browserify');
var mksubdir = require('mksubdir');


function MultiWatchify(opts) {
  if (!(this instanceof MultiWatchify)) {
    throw new TypeError("MultiWatchify constructor cannot be called as a function.");
  }

  if (!opts.indir) {
    throw new Error("Missing/Empty args input directory [indir]");
  }

  if (!opts.outdir) {
    throw new Error("Missing/Empty args ouput directory [outdir]");
  }


  this.indir = path.normalize(opts.indir);
  this.outdir = path.normalize(opts.outdir);
  this.sourcemaps = opts.sourcemaps;
  this.validExt = ['.js'];
}


MultiWatchify.prototype = {
  constructor: MultiWatchify,

  opts: function() {
    return {
      indir: this.indir,
      outdir: this.outdir,
      sourcemaps: this.sourcemaps,
      validExt: this.validExt
    }
  },

  // Walk through files in directory and run callback function.
  walk: function(currentDirPath, callback) {
    var self = this;

    fs.readdirSync(currentDirPath).forEach(function(name) {
      var filePath = path.join(currentDirPath, name);
      var stat = fs.statSync(filePath);
      if (stat.isFile()) {
        callback(filePath, self.opts());
      } else if (stat.isDirectory()) {
        self.walk(filePath, callback);
      }
    });
  },

  process: function() {
    this.walk(this.indir, browserified);
  }
};


function browserified(filePath, opts) {
  if (opts.validExt.indexOf(path.extname(filePath)) === -1) {
    console.log("Skipping invalid file extension: " + filePath +
      "\nAccepted extension: " + opts.validExt.join(", "));
    return
  }

  var newPath = path.join(outdir, filePath.replace(indir, ""));
  mksubdir(path.dirname(newPath));
  processFile(filePath, newPath, opts);
};


function processFile(inFile, outFile, opts) {
  var browserifyOpts = watchify.args;
  if (opts.sourcemaps) {
    browserifyOpts.debug = true;
  }

  var w = watchify(browserify(inFile, browserifyOpts));

  function updateBundle() {
    return w.bundle().pipe(fs.createWriteStream(outFile));
  }

  w.on('update', updateBundle);
  w.bundle().on('data', updateBundle);
}


module.exports = MultiWatchify;