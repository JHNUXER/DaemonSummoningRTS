
class Player {
  
  get name() { return this._name; }
  get color() { return this._color; }
  get mana() { return this._mana; }
  get silver() { return this._silver; }
  get food() { return this._food; }
  get stone() { return this._stone; }
  set mana(v) { this._mana = v; }
  set silver(v) { this._silver = v; }
  set food(v) { this._food = v; }
  set stone(v) { this._stone = v; }
  
  constructor(name, color) {
    this._name   = name  ;
    this._color  = color ;
    this._mana   = 0     ; // This will probably function like "power" in CnC-style RTS games.
    this._silver = 0     ;
    this._food   = 0     ;
    this._stone  = 0     ;
  }
  
}

class UnitLostEvent {
  
  constructor(unit, killed_by) {
    Object.defineProperties(this, {
      unit: {
        value: unit,
        writable: false
      },
      killed_by: { value: killed_by, writable: false }
    });
  }
  
}

class LocalPlayer extends Player {
  
  constructor(name, color) {
    super(name, color) ;
  }
  
  onOwnUnitLost() { }
  onOwnBuildingLost() { }
  
}
