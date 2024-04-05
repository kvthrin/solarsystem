varying vec3 vertexNormal;


void main() {
    float intensity = pow(0.5 - dot(vertexNormal, vec3(0, 0, 1.0)), 2.0); // raising intensity based on the angle between the normal vector and upward direction
    gl_FragColor =  vec4(1, 0.3, 0.1,0.5)* intensity;
}
