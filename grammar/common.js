module.exports = Object.freeze({
  symbolElement: /[^ \r\n\t\f\v\p{Zs}\p{Zl}\p{Zp}#;"'`,\(\)\{\}\[\]\\\|]/,
  datumRules: [
    "boolean", "character", "string", "number", "symbol", "vector",
    "byte_vector", "list", "quote", "quasiquote", "unquote",
    "unquote_splicing", "syntax", "quasisyntax", "unsyntax",
    "unsyntax_splicing", "keyword",
  ],
});
