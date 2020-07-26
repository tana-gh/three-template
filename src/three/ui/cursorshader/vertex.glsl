attribute vec2 coord;
varying   vec2 v_coord;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    v_coord     = coord;
}
