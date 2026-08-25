'use strict';

const definitionHeads = new Set(['define', 'define-public', 'define*', 'define-method']);
const ignoredHeads = new Set([
  'define', 'define-public', 'define*', 'define-method', 'define-module',
  'use-modules', 'quote', 'quasiquote', 'syntax', 'quasisyntax',
]);

function text(node, source) {
  return source.slice(node.startIndex, node.endIndex);
}

function symbol(node, source) {
  return node && node.type === 'symbol' ? text(node, source) : undefined;
}

function listParts(node) {
  return node.namedChildren;
}

function moduleName(node, source) {
  if (!node || node.type !== 'list') return undefined;
  const parts = listParts(node).map((child) => symbol(child, source)).filter(Boolean);
  return parts.length ? parts.join(' ') : undefined;
}

function position(node) {
  return { line: node.startPosition.row + 1, column: node.startPosition.column };
}

const schemeExtractor = {
  functionTypes: [], classTypes: [], methodTypes: [], interfaceTypes: [],
  structTypes: [], enumTypes: [], typeAliasTypes: [], importTypes: [],
  callTypes: [], variableTypes: [],
  nameField: 'name', bodyField: 'body', paramsField: 'parameters',

  visitNode(node, ctx) {
    // Quoted forms are data. G-expressions remain walkable because their
    // ungexp forms often contain real host-side Guile calls.
    if (['quote', 'quasiquote', 'syntax', 'quasisyntax'].includes(node.type)) return true;
    if (node.type !== 'list') return false;

    const parts = listParts(node);
    const head = symbol(parts[0], ctx.source);
    if (!head) return false;

    if (head === 'define-module') {
      const name = moduleName(parts[1], ctx.source);
      if (name) ctx.createNode('namespace', name, node, {
        qualifiedName: `(${name})`, signature: text(node, ctx.source).split('\n')[0], exported: true,
      });
      for (let i = 2; i < parts.length - 1; i++) {
        if (parts[i].type !== 'keyword' || text(parts[i], ctx.source) !== '#:use-module') continue;
        const item = parts[++i];
        const imported = moduleName(item, ctx.source);
        if (!imported) continue;
        const imp = ctx.createNode('import', imported, item, { signature: text(item, ctx.source) });
        const fromNodeId = ctx.nodeStack[ctx.nodeStack.length - 1];
        if (imp && fromNodeId) ctx.addUnresolvedReference({
          fromNodeId, referenceName: imported, referenceKind: 'imports', ...position(item),
        });
      }
      return true;
    }

    if (head === 'use-modules') {
      for (const item of parts.slice(1)) {
        const name = moduleName(item, ctx.source);
        if (!name) continue;
        const imp = ctx.createNode('import', name, item, { signature: text(item, ctx.source) });
        const fromNodeId = ctx.nodeStack[ctx.nodeStack.length - 1];
        if (imp && fromNodeId) ctx.addUnresolvedReference({
          fromNodeId, referenceName: name, referenceKind: 'imports', ...position(item),
        });
      }
      return true;
    }

    if (definitionHeads.has(head)) {
      const target = parts[1];
      const callable = target?.type === 'list';
      const nameNode = callable ? listParts(target)[0] : target;
      const name = symbol(nameNode, ctx.source);
      if (!name) return false;
      const created = ctx.createNode(callable || head === 'define-method' ? 'function' : 'constant', name, node, {
        signature: callable ? text(target, ctx.source) : undefined,
        isExported: head === 'define-public',
        visibility: head === 'define-public' ? 'public' : undefined,
      });
      if (created) ctx.pushScope(created.id);
      // Visit values/bodies while attributing calls to the surrounding binding.
      for (const child of parts.slice(2)) ctx.visitNode(child);
      if (created) ctx.popScope();
      return true;
    }

    // Every unquoted list with a static symbol head is an application.
    if (!ignoredHeads.has(head)) {
      const fromNodeId = ctx.nodeStack[ctx.nodeStack.length - 1];
      if (fromNodeId) ctx.addUnresolvedReference({
        fromNodeId, referenceName: head, referenceKind: 'calls', ...position(parts[0]),
      });
    }
    for (const child of parts.slice(1)) ctx.visitNode(child);
    return true;
  },
};

module.exports = {
  apiVersion: 1,
  name: '@codegraph/tree-sitter-guix',
  languages: [{
    id: 'scheme',
    displayName: 'Scheme / Guile / Guix',
    extensions: ['.scm', '.ss', '.sld'],
    grammar: './tree-sitter-guix.wasm',
    extractor: schemeExtractor,
  }],
};
