#!/bin/sh
set -eu
variant=$1
case "$variant" in scheme|guile|guix) ;; *) exit 2 ;; esac
tmpdir=$(mktemp -d)
trap 'rm -rf "$tmpdir"' EXIT HUP INT TERM
cp -R grammar "$tmpdir/grammar"
sed 's#../../grammar/#./grammar/#' "variants/$variant/grammar.js" > "$tmpdir/grammar.js"
cp -R "generated/$variant/src" "$tmpdir/src"
mkdir -p "$tmpdir/test/corpus"
cp test/corpus/common.scm test/corpus/r5rs.scm test/corpus/r6rs.scm \
  test/corpus/r7rs.scm test/corpus/ext.scm "$tmpdir/test/corpus/"
if test "$variant" != scheme; then cp test/corpus/guile.scm "$tmpdir/test/corpus/"; fi
cd "$tmpdir"
if test "$variant" = guile; then
  tree-sitter test --exclude 'Guix G-expressions|G-expression intertoken space|native G-expression escapes'
else
  tree-sitter test
fi
