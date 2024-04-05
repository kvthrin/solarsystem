uniform sampler2D colorTexture; // planet texture
uniform vec3 color; // Color of atmosphere around the planet
varying vec2 vertexUV; // uv coordinates
varying vec3 vertexNormal; // normal coordinates

void main() {
    float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)); // dot = measures angle between vectors, bigger result when fragments normal is more aligned with upward direction
    vec3 atmosphere = color * pow(intensity, 1.5);

    gl_FragColor =vec4(atmosphere + texture2D(colorTexture, vertexUV).xyz, 1.0);
}