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
      __DAMAGE_TYPE: { value: true, writable: false },
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
  return obj ;
});

GLOB.Damage = class Damage {
  
  get type() { return this._type; }
  get value() { return this._value; }
  
  constructor(type, value) {
    this._type  = (type.__DAMAGE_TYPE) ? type : DamageType[type] ;
    this._value = value                                          ;
  }
  
};
