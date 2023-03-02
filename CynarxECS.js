
CynarxECS = { }
CynarxECS.World = class World {
  
  constructor() { }
  
};
CynarxECS.Entity = class Entity {
  
  get id() { return this._id; }
  
  constructor(world) {
    this._world      = world                    ;
    this._id         = world.generateEntityId() ;
    this._components = [                      ] ;
  }
  
  
  
};
CynarxECS.Component = class Component {
  
  constructor() { }
  
};
CynarxECS.System = class System {
  
  constructor() { }
  
  init() { }
  
};
