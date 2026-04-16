
global.sap = {
  ui: {
    define: function (deps, factory) {
      const resolvedDeps = deps.map(dep => require(dep));
      return factory(...resolvedDeps);
    }
  }
};
