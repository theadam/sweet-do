#lang 'sweet.js';

export syntaxrec do = function (ctx) {
  const block = ctx.next().value;
  function bodyBy(path = []) {
    const body = block.inner();
    path.forEach(p => {
        body.next(p);
    });
    return body;
  }

  const path = [];
  let start = #``;

  while (!bodyBy(path).next().done) {
    if (start.size === 0 && bodyBy(path).next().value.val() === ';') {
      path.push(undefined);
      continue;
    }
    const body = bodyBy(path);
    const stx = body.next().value;
    const a = body.next().value;
    const b = body.next().value;
    if(stx.isIdentifier() && a && b && a.val() + b.val() === '<-') {
      const monad = body.next('expr').value;
      const chain = #`${monad}.chain(function(${stx}) {
        return do {
          ${body}
        }
      })`;
      if (start.size === 0) return chain;
      return #`((function() {${start}})(), ${chain})`;
    } else {
      start = start.concat(#`${bodyBy(path).next().value}`);
      path.push(undefined);
    }
  }

  return #`(function(){${start}})()`
}
