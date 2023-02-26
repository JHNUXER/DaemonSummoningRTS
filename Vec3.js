class Vec3 {
  
  get lengthSquared() { let { x, y, z } = this; return x * x + y * y + z * z; }
  get length() { let { x, y, z } = this; return Math.sqrt(x * x + y * y + z * z); }
  set length(value) {
    let n = value / this.length ;
    
    this.x *= n ;
    this.y *= n ;
    this.z *= n ;
  }
  
  constructor(x, y, z) {
    if (x instanceof Vec3) {
      this.x = x.x ;
      this.y = x.y ;
      this.z = x.z ;
    } else if (typeof x === "number" && typeof y === "number" && typeof z === "number") {
      this.x = x ;
      this.y = y ;
      this.z = z ;
    }
  }
  
  distanceSquared(ox, oy, oz) {
    if (ox instanceof Vec3) {
      oz = ox.z ;
      oy = ox.y ;
      ox = ox.x ;
    }
    
    let dx = ox - this.x ;
    let dy = oy - this.y ;
    let dz = oz - this.z ;
    
    return dx * dx + dy * dy + dz * dz ;
  }
  distance(ox, oy, oz) {
    if (ox instanceof Vec3) {
      oz = ox.z ;
      oy = ox.y ;
      ox = ox.x ;
    }
    
    let dx = ox - this.x ;
    let dy = oy - this.y ;
    let dz = oz - this.z ;
    
    return Math.sqrt(dx * dx + dy * dy + dz * dz) ;
  }
  
}