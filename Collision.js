class Collider2D {
  
  overlaps(other) { return false; }
  contains(x, y) { return false; }
  
}
class AABB2 extends Collider2D {
  
  get ax() { return this.a.x; }
  get ay() { return this.a.y; }
  get bx() { return this.b.x; }
  get by() { return this.b.y; }
  get cx() { return (this.b.x - this.a.x) * 0.5 + this.a.x; }
  get cy() { return (this.b.y - this.a.y) * 0.5 + this.a.y; }
  
  constructor(ax, ay, bx, by) {
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
      let cx = other.x      ;
      let cy = other.y      ;
      let cr = other.radius ;
      let rr = cr * cr      ;
      
      let dx = cx - Math.max(this.ax, Math.min(cx, this.bx)) ;
      let dy = cy - Math.max(this.ay, Math.min(cy, this.by)) ;
    }
  }
  
}
class Circle extends Collider2D {
  
  constructor(x, y, r) {
    this.x      = x ;
    this.y      = y ;
    this.radius = r ;
  }
  
  constains(x, y) {
    if (x instanceof Vec3)
      ({ x, y } = x) ;
    
    let dx = x - this.x      ;
    let dy = y - this.y      ;
    let rr = this.r * this.r ;
    
    return dx * dx + dy * dy <= rr ;
  }
  overlaps(other) {
    if (other instanceof Circle) {
      let rs = this.radius + other.radius ;
      let rs2 = rs * rs ;
      let dx  = this.x - other.x ;
      let dy  = this.y - other.y ;
      
      return dx * dx + dy * dy <= rs2 ;
    } else if (other instanceof AABB2) {
      return other.overlaps(this) ;
    }
  }
  
}
