
class Operation {
  
  get is_done() { return false; }
  get results() { return null; }
  
  resume() { }
  
}

class RadialSearchOperation extends Operation {
  
  get is_done() { return this._is_done; }
  get results() { return !this._is_done ? null : this._results; }
  
  constructor(level, x, y, z, radius, step_size) {
    this._center    = new Vec3(x, y, z) ;
    this._radius    = radius            ;
    this._rr        = radius * radius   ;
    this._level     = level             ;
    this._i         = 0                 ;
    this._results   = new Set()         ;
    this._is_done   = false             ;
    this._step_size = step_size || 256  ;
  }
  
  resume() {
    let { _center: center, _radius: radius, _level: level, _i: i, _results: results, _is_done: is_done, _step_size: step_size } = this ;
    
    for (let j = 0; j < step_size && !is_done; j++) {
      let obj = level._objects[i] ;
      
      if (obj.position.distanceSquared(center) <= this._rr)
        results.push(obj) ;
    }
    
    this._center  = center  ;
    this._radius  = radius  ;
    this._i       = i       ;
    this._is_done = is_done ;
  }
  
}
