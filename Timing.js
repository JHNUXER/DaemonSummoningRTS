class Timing {
  
  static now() { return performance.now() * 1e-3; }
  static since(t) { return this.now() - t; }
  
}

class GameTime {
  
  constructor(frame_id, first_frame, prev_frame, prev_update) {
    let now = Timing.now() ;
    
    this.frame_id          = frame_id          ;
    this.prev_frame        = prev_frame        ;
    this.since_prev_frame  = now - prev_frame  ;
    this.first_frame       = first_frame       ;
    this.since_first_frame = now - first_frame ;
    this.prev_update       = prev_update       ;
    this.since_prev_update = now - prev_update ;
  }
  
}
