varying vec3 vertexNormal;

void main() {
    vertexNormal =  normalize(normalMatrix * normal); // Transforimg vector from object space to camera space and then normalized
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); // vertex pos
}