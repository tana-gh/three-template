precision mediump float;

uniform float lineWeight;
uniform float lineInner;
uniform float lineOuter;
varying vec2  v_coord;

void main() {
    float abs_x = abs(v_coord.x);
    float abs_y = abs(v_coord.y);
    gl_FragColor = 
        abs_x <= lineWeight &&
        abs_y >= lineInner  &&
        abs_y <= lineOuter  ||
        abs_y <= lineWeight &&
        abs_x >= lineInner  &&
        abs_x <= lineOuter
        ? vec4(1.0) : vec4(0.0);
}
