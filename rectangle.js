function Rectangle(x,y,z,l,b,h,t,a)
{
    this.l = l;
    this.b = b;
    this.h = h;
    this.position = {'x' : x, 'y' : y, 'z': z};
    this.initial_pos = {'x' : x, 'y' : y, 'z': z};
    this.angular_velocity = a;
    this.rotation = t;
    var rectangle_array = [
       -l/2.0,-b/2.0,-h/2.0, // triangle 1 : begin
       -l/2.0,-b/2,  h/2.0,
       -l/2.0, b/2, h/2.0, // triangle 1 : end
        l/2.0, b/2.0,-h/2.0, // triangle 2 : begin
       -l/2.0,-b/2.0,-h/2.0,
       -l/2.0, b/2.0,-h/2.0, // triangle 2 : end
        l/2.0,-b/2.0, h/2.0,
       -l/2.0,-b/2.0,-h/2.0,
        l/2.0,-b/2.0,-h/2.0,
        l/2.0, b/2.0,-h/2.0,
        l/2.0,-b/2.0,-h/2.0,
       -l/2.0,-b/2.0,-h/2.0,
       -l/2.0,-b/2.0,-h/2.0,
       -l/2.0, b/2.0, h/2.0,
       -l/2.0, b/2.0,-h/2.0,
        l/2.0,-b/2.0, h/2.0,
       -l/2.0,-b/2.0, h/2.0,
       -l/2.0,-b/2.0,-h/2.0,
       -l/2.0, b/2.0, h/2.0,
       -l/2.0,-b/2.0, h/2.0,
        l/2.0,-b/2.0, h/2.0,
        l/2.0, b/2.0, h/2.0,
        l/2.0,-b/2.0,-h/2.0,
        l/2.0, b/2.0,-h/2.0,
        l/2.0,-b/2.0,-h/2.0,
        l/2.0, b/2.0, h/2.0,
        l/2.0,-b/2.0, h/2.0,
        l/2.0, b/2.0, h/2.0,
        l/2.0, b/2.0,-h/2.0,
       -l/2.0, b/2.0,-h/2.0,
        l/2.0, b/2.0, h/2.0,
       -l/2.0, b/2.0,-h/2.0,
       -l/2.0, b/2.0, h/2.0,
        l/2.0, b/2.0, h/2.0,
];
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rectangle_array), gl.STATIC_DRAW);


    var faceColors = [
      [1.0,  1.0,  1.0,  1.0],    // Front face: white
      [1.0,  0.0,  0.0,  1.0],    // Back face: red
      [0.0,  1.0,  0.0,  1.0],    // Top face: green
      [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
      [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
      [1.0,  0.0,  1.0,  1.0],
      [0.0,  1.0,  1.0,  1.0],
      [0.2,  0.2,  0.2,  1.0],
      [0.2,  0.1,  0.2,  1.0]    // Left face: purple    // Left face: purple
      // Left face: purple
    ];

    var colors = [];
    //colors.concat(c);
    //var a = Math.floor(Math.random() * 6);
    //shuffle(faceColors);
    for (var j = 0; j < 6  ; j++) {
      //var a = Math.floor(Math.random() * 10);
      var c = faceColors[getRandomInt(5)];     // returns a number between 0 and 9 ];
      colors = colors.concat(c,c,c,c,c,c);
    }

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    var rectangle_indices = [];
    for(var i=0;i<6*2*3;i+=3)
    {
      rectangle_indices.push(i,i+1,i+2);
    }

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(rectangle_indices), gl.STATIC_DRAW);

    this.buffers = {
      position: positionBuffer,
      color: colorBuffer,
      indices: indexBuffer,
    };

}

Rectangle.prototype.tick = function()
{
  this.rotation += this.angular_velocity*3.1415/180;
}
Rectangle.prototype.set_position = function(x,y,z)
{
  this.position = {'x':x,'y':y,'z':z};
}
Rectangle.prototype.draw = function(gl, programInfo, deltaTime, projectionMatrix) {
  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  var buffers = this.buffers;
  var modelViewMatrix = mat4.create();

  // Now move the drawi ng position a bit to where we want to
  // start drawing the square.
/*
glm::mat4 translate_to_original_pos = glm::translate(this->initial_pos);
  glm::mat4 translate_back_from_inital_pos = glm::translate(-this->initial_pos);
  glm::mat4 translate = glm::translate (this->position);
  glm::mat4 rotate    = glm::rotate((float) (this->rotation), glm::vec3(0, 1, 0));

  Matrices.model *= (translate * translate_back_from_inital_pos * rotate * translate_to_original_pos );
  glm::mat4 MVP = VP * Matrices.model;
*/
  mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 [this.position.x, this.position.y, this.position.z]);
  mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 [-this.initial_pos.x, -this.initial_pos.y, -this.initial_pos.z]);    // amount to translate*/
  mat4.rotate(modelViewMatrix,  // destination matrix
                  modelViewMatrix,  // matrix to rotate
                  this.rotation,     // amount to rotate in radians
                  [0, 0, 1]);       // axis to rotate around (Z)
  mat4.translate(modelViewMatrix,     // destination matrix
                  modelViewMatrix,     // matrix to translate
                  [this.initial_pos.x, this.initial_pos.y, this.initial_pos.z]);    // amount to translate*/
  /*mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 [this.position.x, this.position.y, this.position.z]);
*/
  this.model = modelViewMatrix;
  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL how to pull out the colors from the color buffer
  // into the vertexColor attribute.
  {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexColor);
  }

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // Tell WebGL to use our program when drawing

  gl.useProgram(programInfo.program);

  // Set the shader uniforms

  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);

  {
    const vertexCount = 36;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }

  // Update the rotation for the next draw

  //cubeRotation += 0;
}
Rectangle.prototype.bounder = function()
{
  return {
    'x':this.position.x,
    'y':this.position.y,
    'z':this.position.z,
    'l':this.l,
    'b':this.b,
    'h':this.h,
    't':this.rotation,
  }
}
