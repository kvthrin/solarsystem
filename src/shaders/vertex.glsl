varying vec2 vertexUV; // Saving UV coordinates
varying vec3 vertexNormal; // Saving Normal coordinates

void main() {

    vertexUV = uv;
    vertexNormal = normalize(normalMatrix * normal); // Transforimg vector from object space to camera space and then normalized
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); // vertex pos
}