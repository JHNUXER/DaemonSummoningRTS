class Mouse {
  
  get x() { return this._x; }
  get y() { return this._y; }
  get world_x() { return this._world_x; }
  get world_y() { return this._world_y; }
  
  constructor(canvas, camera) {
    this._x       = 0 ;
    this._y       = 0 ;
    this._world_x = 0 ;
    this._world_y = 0 ;
    this._camera  = 0 ;
    // let canvas = document.getElementById(canvas) ;
    canvas.addEventListener("mousemove", this.mouseMoved.bind(this))   ;
    canvas.addEventListener("mousedown", this.mousePressed.bind(this)) ;
    canvas.addEventListener("mouseup", this.mouseReleased.bind(this))  ;
    // canvas.addEventListener("mouseout");
    // enter, leave, move, out, over, up, down
  }
  
  mouseMoved(event) {
    let px = event.offsetX ;
    let py = event.offsetY ;
    
    if ((event.buttons & 1) === 1) {
      let mx = px - this._x ;
      let my = py - this._y ;
      
      // TODO: Add dragging functionality
    }
    
    this._x = px ;
    this._y = py ;
    this._world_x = px + camera.x ;
    this._world_y = py + camera.y ;
  }
  mousePressed(event) { }
  mouseReleased(event) { }
  
}
