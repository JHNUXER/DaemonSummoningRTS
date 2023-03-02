
class EventBus {
  
  constructor() {
    this._handlers = { } ;
  }
  
  push(event) {
    let handlers = this._handlers[event.event_type] ;
    
    if (handlers) {
      for (let h of handlers)
        h(event) ;
    }
  }
  subscribe(type, handler) {
    let handlers = this._handlers[type] ;
    
    if (!handlers)
      handlers = new Set() ;
    
    return handlers.add(handler) ;
  }
  unsubscribe(type, handler) {
    let handlers = this._handlers[type] ;
    
    if (!handlers)
      return false ;
    
    handlers.delete(handler) ;
    
    if (handlers.size < 1)
      delete this._handlers[type] ;
    
    return true ;
  }
  
}
