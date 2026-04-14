#!/bin/bash
cd "/Users/chenruidong/Documents/New project" || exit 1

if [ ! -f ".env" ]; then
  cp ".env.example" ".env"
fi

open -a TextEdit ".env"
