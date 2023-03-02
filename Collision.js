class Collider2D {
  
  get cx() { return this._cx || 0; }
  set cx(v) { this._cx = v; }
  get cy() { return this._cy || 0; }
  set cy(v) { this._cy = v; }
  
  overlaps(other) { return false; }
  contains(x, y) { return false; }
  
}
class NullCollider2D extends Collider2D { constructor() { } }
class AABB2 extends Collider2D {
  
  get ax() { return this.a.x; }
  get ay() { return this.a.y; }
  get bx() { return this.b.x; }
  get by() { return this.b.y; }
  get cx() { return (this.b.x - this.a.x) * 0.5 + this.a.x; }
  get width() { return this.bx - this.ax; }
  get height() { return this.by - this.ay; }
  set cx(v) {
    let hw = this.width * 0.5 ;
    this.a.x = v - hw ;
    this.b.x = v + hw ;
  }
  get cy() { return (this.b.y - this.a.y) * 0.5 + this.a.y; }
  set cy(v) {
    let hh = this.height * 0.5 ;
    this.a.y = v - hh ;
    this.b.y = v + hh ;
  }
  
  constructor(ax, ay, bx, by) {
    super() ;
    
    this.a = new Vec3(ax, ay, 0) ;
    this.b = new Vec3(bx, by, 0) ;
  }
  
  contains(x, y) {
    if (x instanceof Vec3)
      ({ x, y } = x) ;
    
    return x >= this.a.x && x <= this.b.x && y >= this.a.y && y <= this.b.y ;
  }
  overlaps(other) {
    if (other instanceof AABB2) {
      return !(this.ax  > other.bx || this.ay  > other.by
        ||     other.ax > this.bx  || other.ay > this.by) ;
    } else if (other instanceof Circle) {
      let cx = other._cx      ;
      let cy = other._cy      ;
      let cr = other.radius ;
      let rr = cr * cr      ;
      
      let dx = cx - Math.max(this.ax, Math.min(cx, this.bx)) ;
      let dy = cy - Math.max(this.ay, Math.min(cy, this.by)) ;
    }
  }
  
}
class Circle extends Collider2D {
  
  get cx() { return this._cx; }
  set cx(v) { this._cx = v; }
  get cy() { return this._cy; }
  set cy(v) { this._cy = v; }
  
  constructor(x, y, r) {
    super() ;
    
    this._cx    = x ;
    this._cy    = y ;
    this.radius = r ;
  }
  
  constains(x, y) {
    if (x instanceof Vec3)
      ({ x, y } = x) ;
    
    let dx = x - this._cx    ;
    let dy = y - this._cy    ;
    let rr = this.r * this.r ;
    
    return dx * dx + dy * dy <= rr ;
  }
  overlaps(other) {
    if (other instanceof Circle) {
      let rs = this.radius + other.radius ;
      let rs2 = rs * rs ;
      let dx  = this._cx - other._cx ;
      let dy  = this._cy - other._cy ;
      
      return dx * dx + dy * dy <= rs2 ;
    } else if (other instanceof AABB2) {
      return other.overlaps(this) ;
    }
  }
  
}
