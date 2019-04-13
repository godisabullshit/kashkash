let _now, _then = Date.now(), _delta
export default class Time {
    static getDelta() {
        _now = Date.now()
        _delta = (_now - _then) / 1000
        _then = _now
    
        return Number(_delta)
    }
}
