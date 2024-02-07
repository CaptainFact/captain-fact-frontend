#!/bin/bash

npx depcheck --ignores="animate.scss,babel-polyfill,browserslist,webpack-dev-server" "$@"
