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
Guix G-expressions
===

#~(string-append #$coreutils "/bin/uname")
#~(list #$@(list coreutils grep) #$grep)
#~'(one #$two #$@(three four))

---
(program
  (gexp
    (list
      (symbol)
      (ungexp
        (symbol))
      (string)))
  (gexp
    (list
      (symbol)
      (ungexp_splicing
        (list
          (symbol)
          (symbol)
          (symbol)))
      (ungexp
        (symbol))))
  (gexp
    (quote
      (list
        (symbol)
        (ungexp
          (symbol))
        (ungexp_splicing
          (list
            (symbol)
            (symbol)))))))

===
G-expression intertoken space
===

#~ ; body follows a comment
  (list #$ value #$@ (list one two))

---
(program
  (gexp
    (comment)
    (list
      (symbol)
      (ungexp
        (symbol))
      (ungexp_splicing
        (list
          (symbol)
          (symbol)
          (symbol))))))

===
native G-expression escapes and extended symbols
===

#~(list #+native #+@(list one two))
'(#{.}# #{}# #{ mapm %state-monad instance}#)

---
(program
  (gexp
    (list
      (symbol)
      (ungexp_native
        (symbol))
      (ungexp_native_splicing
        (list
          (symbol)
          (symbol)
          (symbol)))))
  (quote
    (list
      (symbol)
      (symbol)
      (symbol))))

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
