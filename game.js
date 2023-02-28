if (!Math.TAU) {
  Object.defineProperty(Math, "TAU", { value: Math.PI * 2, writable: false });
}

function randomAngleVector(start_x, start_y, min_angle, max_angle, min_dist, max_dist) {
  start_x   = start_x   || 0        ;
  start_y   = start_y   || 0        ;
  min_angle = min_angle || 0        ;
  max_angle = max_angle || Math.TAU ;
  min_dist  = min_dist  || 0        ;
  max_dist  = max_dist  || 500      ;
  
  const dist = Math.random() * (max_dist  - min_dist ) + min_dist  ;
  const ang  = Math.random() * (max_angle - min_angle) + min_angle ;
  const cos  = Math.cos(ang) * dist ;
  const sin  = Math.sin(ang) * dist ;
  
  return new Vec3(sin, -cos, 0) ;
}


class GameObject {
  
  get x() { return this._pos.x; }
  set x(v) { this._pos.x = v; }
  get y() { return this._pos.y; }
  set y(v) { this._pos.y = v; }
  get z() { return this._pos.z; }
  set z(v) { this._pos.z = v; }
  get is_real() { return !this._is_marked; }
  get position() { return new Vec3(this.x, this.y, this.z); }
  
  constructor(x, y, z) {
    this._pos = new Vec3(x || 0, y || 0, z || 0) ;
    this._is_marked = false ;
  }
  
  loadData(dat) { }
  markForDeletion() { this._is_marked = true; }
  onUpdate(t) { }
  
  static factory() {
    const clazz = this ;
    
    return function(x, y, z, data) {
      let obj = new clazz(x, y, z) ;
      obj.loadData(data) ;
      return obj ;
    }
  }
  static exists(obj) { return obj instanceof GameObject && obj.is_real; }
  
}
class Creature extends GameObject {
  
  constructor(x, y, z, max_health) {
    super(x, y, z) ;
    
    this._max_health = max_health || 100 ;
  }
  
  loadData(data) {
    this._health = data.health || this._max_health ;
  }
  
}

function spawnClusterHoriz(level, factory, cx, cy, radius, count) {
  if (factory.prototype instanceof GameObject) {
    factory = factory.factory() ;
  }
  for (let i = 0; i < count; i++) {
    let ang = Math.random() * Math.TAU ;
    let dst = Math.random() * radius   ;
    let cos = Math.cos(ang) * dst      ;
    let sin = Math.sin(ang) * dst      ;
    let obj = factory(cos + cx, sin + cy, 0, null) ;
    
    if (!obj)
      console.error("BAD FACTORY", factory) ;
    
    level.addObject(obj) ;
  }
}
class ClusterSpawnerObject extends GameObject {
  
  set _level(value) {
    this.markForDeletion() ;
    for (let obj of this._objs)
      value.addObject(obj) ;
  }
  
  constructor(x, y, z, objects) {
    super(x, y, z) ;
    
    this._objs = objects ;
  }
  
}
function clusterSpawner(level, factory, min_count, max_count, min_radius, max_radius) {
  return function(x, y, z, d) {
    let list = [ ] ;
    let count = Math.floor(Math.random() * (max_count - min_count) + min_count) ;
    for (let i = 0; i < count; i++) {
      let dist = Math.random() * (max_radius - min_radius) + min_radius ;
      let ang  = Math.random() * Math.TAU ;
      let ox   = Math.cos(ang) * dist ;
      let oy   = Math.sin(ang) * dist ;
      
      list.push(factory(x + ox, y + oy, z, d)) ;
    }
    return new ClusterSpawnerObject(x, y, z, list) ;
  }
}

class Building extends GameObject {
  
  get width() { return this._width; }
  get height() { return this._height; }
  
  constructor(x, y, z, w, h) {
    super(x, y, z) ;
    
    this._width  = w ;
    this._height = h ;
  }
  
}
class Daemon extends Creature {
  
  constructor(x, y, z) {
    super(x, y, z, 250) ;
    
    this.color = "#F00"                          ;
    this.hull  = new Circle(this.x, this.y, 3.5) ;
  }
  
  onUpdate(t) {
    let ang = Math.random() * Math.PI * 2 ;
    let cos = Math.cos(ang) * 100 ;
    let sin = Math.sin(ang) * 100 ;
    this.x += t * cos ;
    this.y += t * sin ;
    
    this.hull._cx = this.x ;
    this.hull.cy = this.y ;
  }
  
}

class Ent extends Creature {
  
  constructor(x, y, z) {
    super(x, y, z, 450) ;
    
    this._move_dir = Math.random() * Math.TAU ;
    this.color  = "#FC0" ;
    this._life  = 30     ;
    this._speed = 100    ;
  }
  
  move(dx, dy, dz) {
    this.x += dx || 0 ;
    this.y += dy || 0 ;
    this.z += dz || 0 ;
  }
  moveAngular(angle, dist) {
    this.x += Math.sin(angle) * dist ;
    this.y -= Math.cos(angle) * dist ;
  }
  onUpdate(t) {
    if ((this._life -= t) <= 0) {
      this.markForDeletion() ;
      return ;
    }
    
    this.moveAngular(this._move_dir, this._speed * t) ;
    this._move_dir += (Math.random() * Math.PI * 0.5) - Math.PI * 0.25 ;
    let { x, y } = this ;
    const rr = 10 ** 2 ;
    for (let ent of this._level._objects) {
      let dx = x - ent.x ;
      let dy = y - ent.y ;
      
      if (!(ent instanceof Ent) && dx * dx + dy * dy <= rr) {
        if (ent instanceof Creature) {
          ent._health -= (Math.floor(Math.random() * 3) + 1) * t ;
          if (ent._health <= 0) {
            ent.markForDeletion() ;
          }
        }
      }
    }
  }
  
}

class Zombie extends Creature {
  
  constructor(x, y, z) {
    super(x, y, z) ;
    
    this._energy = 10 ;
    this._speed = 50 ;
    this.color  = "#080" ;
  }
  
  onUpdate(t) {
    if ((this._energy -= t) <= 0) {
      this.markForDeletion() ;
      return ;
    }
    
    let targ = this._targ ;
    
    if (!(targ && targ.is_real)) {
      targ = undefined ;
      
      let poss_targs = [ ] ;
      
      for (let obj of this._level._objects) {
        // console.log(obj) ;
        if (/*obj !== this && */obj instanceof Daemon) {
          poss_targs.push(obj) ;
          // targ = obj ;
          // break ;
        }
      }
      const mypos = this._pos ;
      poss_targs.sort(function(a, b) {
        return a._pos.distanceSquared(mypos) - b._pos.distanceSquared(mypos) ;
      });
      targ = poss_targs[0] ;
      if (!targ) {
        let ang = Math.random() * Math.PI * 2 ;
        let cos = Math.cos(ang) * this._speed ;
        let sin = Math.sin(ang) * this._speed ;
        this.x += t * cos ;
        this.y += t * sin ;
      }
    } else {
      let max_distance = ((targ.width || 7) + (targ.height || 7)) * 0.5 + 10  ;
      let min_distance = ((targ.width || 7) + (targ.height || 7)) * 0.5 + 3.5 ;
      // console.log(`MIN D: ${min_distance}, MAX D: ${max_distance}`) ;
      // max_distance *= max_distance ;
      // min_distance *= min_distance ;
      let dx    = targ.x - this.x ;
      let dy    = targ.y - this.y ;
      let dist = Math.sqrt(dx * dx + dy * dy) ;
      // console.log(`ACTUAL D: ${Math.sqrt(dist)}`);
      
      if (dist > max_distance) {
        // Move towards target...
        let vx = targ.x - this.x ;
        let vy = targ.y - this.y ;
        let om = Math.sqrt(vx * vx + vy * vy) ;
        let nm = Math.min(dist - min_distance, t * this._speed) / om ;
        this.x += nm * vx ;
        this.y += nm * vy ;
      } else if (dist < min_distance) {
        // Move away from target...
        let vx = this.x - targ.x ;
        let vy = this.y - targ.y ;
        let om = Math.sqrt(vx * vx + vy * vy) ;
        let nm = (t * this._speed) / om ;
        this.x += nm * vx ;
        this.y += nm * vy ;
      } else {
        // Attack the target...
        targ.markForDeletion() ;
        
        this._energy += 100 ;
      }
    }
    
    this._targ = targ ;
  }
  
}

class SpawnerTower extends Building {
  
  constructor(x, y, z, factory) {
    super(x - 25, y - 25, z, 50, 50) ;
    
    if (typeof factory !== "function")
      throw `Expected function, got ${typeof factory}` ;
    
    this.color     = "#CCC"  ;
    this._interval = 5       ;
    this._t        = 0       ;
    this._factory  = factory ;
  }
  
  onUpdate(t) {
    super.onUpdate(t) ;
    
    if ((this._t += t) >= 1) {
      const count = Math.floor(this._t / 1) ;
      this._t     %= 1 ;
      
      for (let i = 0; i < count; i++) {
        let ang = Math.random() *  Math.TAU       ;
        let d   = Math.random() * (200 - 75) + 75 ;
        let cos = Math.cos(ang) * d ;
        let sin = Math.sin(ang) * d ;
        
        this._level.spawnObject(this._factory, this.x + cos, this.y + sin, this.z) ;
      }
    }
  }
  
}

class Level {
  
  constructor() {
    this._objects   = new Set()  ;
    this._to_delete = Array(256) ;
    this._to_delete_ndx = 0 ;
  }
  
  queryRadius2(x, y, radius) {
    const rr  = radius * radius ;
    const res = [             ] ;
    
    for (let ent of this._objects) {
      if (ent.position.distanceSquared(x, y, ent.position.z) <= rr)
        res.push(ent) ;
    }
    
    return res ;
  }
  queryRadius3(x, y, z, radius) {
    const rr  = radius * radius ;
    const res = [             ] ;
    
    for (let ent of this._objects) {
      if (ent.position.distanceSquared(x, y, z) <= rr)
        res.push(ent) ;
    }
    
    return res ;
  }
  spawnObject(factory, x, y, z, data) {
    data = data || { } ;
    
    if (typeof factory !== "function")
      throw `ERROR: function expected, got ${typeof factory}!`;
    
    let object = factory(x, y, z, data) ;
    
    return [ this.addObject(object), object ] ;
  }
  addObject(obj) {
    if (!obj)
      throw `Bad argument #1 to 'addObject' (GameObject expected, got ${obj})` ;
    
    if (this._objects.add(obj)) {
      obj._level = this ;
      return true ;
    }
    return false ;
  }
  queueDelete(obj) {
    let   ndx = this._to_delete_ndx ;
    const arr = this._to_delete     ;
    
    if (ndx < arr.length)
      arr[ndx++] = obj ;
    
    this._to_delete_ndx = ndx ;
  }
  update(t) {
    for (let obj of this._objects) {
      if (!GameObject.exists(obj))
        this.queueDelete(obj) ;
      else
        obj.onUpdate(t) ;
    }
    for (let i = 0; i < this._to_delete_ndx; i++) {
      const obj = this._to_delete[i] ;
      
      this._objects.delete(obj) ;
      delete obj._level ;
      delete this._to_delete[i]        ;
    }
    this._to_delete_ndx = 0 ;
  }
  
}



function getCookie(name) {
  let xname = `${name}=` ;
  let dcookie = decodeURIComponent(document.cookie) ;
  let array   = dcookie.split(/(\s*;\s)*/) ;
  for (const part of array) {
    if (part.startsWith(xname))
      return part.substring(xname.length, part.length) ;
  }
  return "" ;
}

class Renderer {
  
  constructor(canvas) {
    this._canvas = canvas         ;
    this._camera = null           ;
    this._mouse  = { x: 0, y: 0 } ;
    this._level  = null           ;
  }
  
  render(time) {
    const canvas = this._canvas            ;
    const g      = canvas.getContext("2d") ;
    const w      = canvas.width            ;
    const h      = canvas.height           ;
    const tx = w / 2 ;
    const ty = h / 2 ;
    
    g.fillStyle = "#808080" ;
    g.fillRect(0, 0, w, h)  ;
    if (!!this._level) {
      g.translate( tx,  ty)   ;
      
      for (let ent of this._level._objects) {
        let dw   = ent.width  || 7 ;
        let dh   = ent.height || 7 ;
        let hdw  = dw / 2 ;
        let hdh  = dh / 2 ;
        let dx   = ent.x - hdw ;
        let dy   = ent.y - hdh ;
        
        g.fillStyle   = ent.color || "#F00" ;
        g.strokeStyle = "#000" ;
        
        g.beginPath() ;
        g.rect(dx, dy, dw, dw) ;
        g.fill() ;
        g.stroke() ;
        g.closePath() ;
      }
      
      g.translate(-tx, -ty)   ;
    }
  }
  
}

function checkerFactoryWrapper(factory) {
  return function(x, y, z, d) {
    let obj = factory(x, y, z, d) ;
    if (!obj)
      console.error("BAD FACTORY", factory);
    return obj ;
  }
}
function multiFactory(...classes) {
  const factories = Array(classes.length) ;
  for (let i = 0; i < classes.length; i++) {
    factories[i] = classes[i].factory() ;
  }
  return function(x, y, z, data) {
    const factory = factories[Math.floor(Math.random() * factories.length)] ;
    
    return factory(x, y, z, data) ;
  }
}

class Game {
  
  get is_running() { return this._is_running; }
  
  constructor(canvas) {
    this._canvas           = canvas                       ;
    this._level            = new Level()                  ;
    this._renderer         = new Renderer(this._canvas)   ;
    this._renderer._level  = this._level ;
    this._is_running       = false                        ;
    this._target_framerate = 60                           ;
    this._target_tickrate  = 20                           ;
    this._frame_delay      = 1.0 / this._target_framerate ;
    this._update_delay     = 1.0 / this._target_tickrate  ;
    this._last_frame       = Timing.now() - this._frame_delay    ;
    this._last_tick        = Timing.now() - this._update_delay   ;
    
    let game = this ;
    let fact = multiFactory(Daemon, Zombie, Zombie, Zombie, Ent) ;
    let fact2 = clusterSpawner(game._level, fact, 1, 6, 20, 100) ;
    
    this._level.addObject(new SpawnerTower(0,0,0, fact2));
  }
  
  render(t) {
    this._renderer.render(t) ;
    
    this._last_frame = Timing.now() ;
    object_counter.innerText = `${this._level._objects.size} Objects` ;
  }
  update(t) {
    this._level.update(t) ;
    
    this._last_tick = Timing.now() ;
  }
  stop() {
    if (this._is_running) {
      this._is_running = false ;
      
      clearInterval(this._render_timer) ;
      // clearInterval(this._update_timer) ;
    }
  }
  start() {
    if (!this._is_running) {
      this._is_running = true ;
      
      const game = this ;
      
      // console.log(`Frame Delay: ${this._frame_delay}, Update Delay: ${this._update_delay}`) ;
      
      this._render_timer = setInterval(function() {
        const t = Timing.now() - game._last_frame ;
        
        game.render(t) ;
        game.update(t) ;
      }, Math.round(this._frame_delay * 1000)) ;
      // this._update_timer = setInterval(()=>game.update(Timing.now() - game._last_tick), Math.round(this._update_delay * 1000)) ;
    }
  }
  load() {
    let save_data = JSON.parse(getCookie("save_data")) ;
    // TODO: Process save_data...
  }
  
}

GLOB.game = new Game(game_canvas) ;
stop_game_btn.onclick = function() {
  if (GLOB.game.is_running) {
    GLOB.game.stop() ;
    stop_game_btn.innerText = "RESUME" ;
  } else {
    GLOB.game.start() ;
    stop_game_btn.innerText = "SUSPEND" ;
  }
};
step_game_btn.onclick = function() {
  if (GLOB.game.is_running)
    GLOB.game.stop() ;
  
  GLOB.game.render(GLOB.game._frame_delay)  ;
  GLOB.game.update(GLOB.game._update_delay) ;
};
game.start() ;
