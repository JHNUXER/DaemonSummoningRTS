GLOB.DamageType = (function() {
  let types = [
    "CUTTING",
    "PIERCING",
    "BLUNT",
    "BURNING",
    "FREEZING",
    "EXPLOSION",
    "CORROSIVE",
    "TOXIC",
    "CRUSHING",
  ];
  let obj = { } ;
  let i = 0;
  for (let type_name of types) {
    let t = Object.defineProperties({}, {
      name: {
        value: type_name,
        writable: false,
      },
      ordinal: { value: i++, writable: false },
      toString: { value() { return this.name; }, writable:false },
    });
    Object.defineProperty(obj, type_name, { value: t, writable: false }) ;
    Object.defineProperty(i-1, type_name, { value: t, writable: false }) ;
  }
});
