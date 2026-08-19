===
hexadecimal string escapes
===

"\x41\u03bb\U01f642"
"a\x00b \u0000 \U10ffff"

---
(program
  (string
    (escape_sequence)
    (escape_sequence)
    (escape_sequence))
  (string
    (escape_sequence)
    (escape_sequence)
    (escape_sequence)))

===
hexadecimal escape digit boundaries
===

"\x4 \x414 \u03b \u03bb5 \U01f64 \U01f6420"

---
(program
  (string
    (escape_sequence)
    (escape_sequence)
    (escape_sequence)
    (escape_sequence)
    (escape_sequence)
    (escape_sequence)))

===
terminated hash-bang comments
===

#! a single-line comment !#
#! ordinary ! and # characters are allowed !#
#! /usr/bin/env -S guile -e main -s
This is a multiline script preamble.
!#
(main)

---
(program
  (hash_bang_comment)
  (hash_bang_comment)
  (hash_bang_comment)
  (list
    (symbol)))

===
directives alongside hash-bang comments
===

#!r6rs
#!fold-case
#! a terminated comment !#
#!no-fold-case

---
(program
  (directive)
  (directive)
  (hash_bang_comment)
  (directive))

===
Guile nil and extended bare identifiers
===

(list #nil workaround-#1674 disable-c#-8.0-tests
      include-list\exclude-list exdir' \)

---
(program
  (list
    (symbol)
    (nil)
    (symbol)
    (symbol)
    (symbol)
    (symbol)
    (symbol)))

