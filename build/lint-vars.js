#!/usr/bin/env node

'use strict'

const path = require('path')
const sh = require('shelljs')
sh.config.fatal = true
//sh.config.verbose = true

function lintVars(args) {
  if (args.length !== 2) {
    sh.echo('Usage: lint-vars.js folder')
    sh.exit(1)
  }

  const dir = args[1]

  if (!sh.test('-d', dir)) {
    sh.echo('Not a valid directory.')
    sh.exit(1)
  }

  sh.echo('Finding unused variables...')

  const sassFiles = sh.find(path.join(dir, '*.scss'))
  // String of all Sass variables
  const variables = sh.grep(/^\$[a-zA-Z0-9_-][^:]*/g, sassFiles)
                      .sed(/\$([a-zA-Z0-9_-][^:]*).*/g, '$1')
                      .uniq()
                      .trim()

  // Convert string into an array
  const variablesArr = Array.from(variables.split('\n'))
  // Loop through each variable and each file
  variablesArr.forEach((variable) => {
    sassFiles.forEach((file) => {
      const re = `$${variable}`
      sh.grep(new RegExp(re, 'g'), file)
    })
  })

}

lintVars(process.argv.slice(1))
