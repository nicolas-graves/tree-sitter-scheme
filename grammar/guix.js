module.exports = Object.freeze({
  datumRules: [
    "gexp", "ungexp", "ungexp_splicing", "ungexp_native",
    "ungexp_native_splicing",
  ],
  rules: {
    gexp: $ => seq("#~", repeat($._intertoken), $._datum),
    ungexp: $ => seq("#$", repeat($._intertoken), $._datum),
    ungexp_splicing: $ => seq("#$@", repeat($._intertoken), $._datum),
    ungexp_native: $ => seq("#+", repeat($._intertoken), $._datum),
    ungexp_native_splicing: $ =>
      seq("#+@", repeat($._intertoken), $._datum),
  },
});
