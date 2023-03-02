
class QuadTreeNode {
  
  constructor(x, y, d) { this.x = x; this.y = y; this.value = d; }
  
  
}

class QuadTree {
  
  constructor(ax, ay, bx, by, max_nodes) {
    this._subdivs    = Array(4)                  ;
    this._bounds     = new AABB2(ax, ay, bx, by) ;
    this._max_nodes  = max_nodes                 ;
    this._nodes      = [                       ] ;
    this._is_divided = false ;
  }
  
  query(shape) {
    let res = [ ] ;
    if (this._bounds.overlaps(shape)) {
      for (let i = 0; i < this._nodes.length; i++) {
        let node = nodes[i] ;
        
        if (shape.contains(node.x, node.y)) {
          
        }
      }
    }
    return res ;
  }
  
}
