#!/bin/bash

echo "Building TypeScript..."
tsc --project ./cmd/server/web

echo "Minifying JS with ESBuild..."
JS_DIR="./cmd/server/web/static/compiled-js"

for file in "$JS_DIR"/*.js; do
    # Check if the file is a regular file
    if [[ -f $file ]]; then
        echo "Minifying $file..."
        # Run esbuild to minify the file and overwrite the original
        esbuild "$file" --allow-overwrite --minify --outfile="$file"
    fi
done

echo "Building and running server..."
go run ./cmd/server