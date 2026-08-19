const common = require("./common");

module.exports = Object.freeze({
  datumRules: [{name: "nil", after: "boolean"}],
  intertokenRules: ["hash_bang_comment"],
  escapeAlternatives: [
    choice(
      /\\x[0-9a-fA-F]{2}/,
      /\\u[0-9a-fA-F]{4}/,
      /\\U[0-9a-fA-F]{6}/,
      /\\./),
  ],
  symbolAlternatives: [
    /#\{[^}]*\}#/,
    choice(
      "\\",
      seq(
        repeat1(common.symbolElement),
        repeat1(choice(common.symbolElement, /\\./, "#", "'")))),
  ],
  datumRuleDefinitions: {
    nil: _ => token("#nil"),
  },
  intertokenRuleDefinitions: {
    hash_bang_comment: _ => token(/#!([^!]|![^#])*!#/),
  },
  ruleOverrides: {
    directive: ({$, symbol}) => choice(
      token(prec(1, /#!(r6rs|fold-case|no-fold-case)/)),
      seq("#!", repeat($._intertoken), symbol)),
  },
});
