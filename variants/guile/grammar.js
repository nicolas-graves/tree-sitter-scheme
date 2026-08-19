const makeGrammar = require("../../grammar/make-grammar");
const guile = require("../../grammar/guile");

module.exports = makeGrammar({name: "guile", extensions: [guile]});
