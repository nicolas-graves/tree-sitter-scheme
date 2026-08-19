#!/bin/sh
set -eu

source_dir=$1
test -d "$source_dir" || { echo "not a directory: $source_dir" >&2; exit 2; }
source_dir=$(cd "$source_dir" && pwd)

tmpdir=$(mktemp -d)
trap 'rm -rf "$tmpdir"' EXIT HUP INT TERM
cp -R grammar "$tmpdir/grammar"
sed 's#../../grammar/#./grammar/#' variants/guix/grammar.js > "$tmpdir/grammar.js"
cp -R generated/guix/src "$tmpdir/src"

count=$(find "$source_dir" -type f -name '*.scm' | wc -l)
test "$count" -gt 0 || { echo 'no Scheme files found' >&2; exit 1; }

cd "$tmpdir"
find "$source_dir" -type f -name '*.scm' -print0 |
  xargs -0 tree-sitter parse --quiet >/dev/null
echo "Parsed $count/$count Scheme files"
