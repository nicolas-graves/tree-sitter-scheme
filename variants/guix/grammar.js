const makeGrammar = require("../../grammar/make-grammar");
const guile = require("../../grammar/guile");
const guix = require("../../grammar/guix");

module.exports = makeGrammar({name: "guix", extensions: [guile, guix]});
