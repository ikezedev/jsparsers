const firstOf = <A>(arrays: Array<A>, cmp: (a: A) => boolean) => {
  for (const a of arrays) {
    if (cmp(a)) return a;
  }
};
