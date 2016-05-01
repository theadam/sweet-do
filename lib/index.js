#lang "sweet.js"

export syntaxrec do = function (ctx) {
  const block = ctx.next().value;
  const body = block.inner();

  for (let stx of body) {
    if (stx.isIdentifier()) {
      let [oper] = body;
      if (oper && oper.val() === "<=") {
        let monad = body.next('expr').value
        return #`${monad}.bind(function(${stx}) {
          return do {
            ${body}
          }
        })`;
      }
    }
  }

  return #`(function()${block})()`;
}
