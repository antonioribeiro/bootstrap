#!/usr/bin/env node

'use strict'

const path = require('path')
const sh = require('shelljs')
sh.config.fatal = true

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

  sh.echo('Finding unused variables. This might take some time...')

  const sassFiles = sh.find(path.join(dir, '*.scss'))
  // String of all Sass variables
  const variables = sh.grep(/^\$[a-zA-Z0-9_-][^:]*/g, sassFiles)
                      .sed(/(\$[a-zA-Z0-9_-][^:]*).*/g, '$1')
                      .uniq()
  //sh.echo(variables)
  // Convert string into an array
  const variablesArr = Array.from(variables.split('\n'))
  //sh.echo(variablesArr)
  // Loop through each variable
  variablesArr.forEach((variable) => {
    //sh.echo(variable)
    sh.grep(new RegExp(variable, 'g'), sassFiles)
  })

}

lintVars(process.argv.slice(1))
