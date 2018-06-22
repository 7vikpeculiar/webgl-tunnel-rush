function Triangle(x,y,z,l,h,t,a)
{
    this.l = l;
    this.h = h;
    this.position = {'x' : x, 'y' : y, 'z': z};
    this.initial_pos = {'x' : x, 'y' : y, 'z': z};
    this.speed = 0;
    this.rotation = t;
    this.angular_velocity = a;
    const pi = Math.PI;
    var triangle_array = [];
    var radi = l;
    var theta = 90;
    var oct_x = 0;
    var oct_y = 0;
    var half_thick = h;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    for(var iter = 0; iter < 3;iter ++)
    {
          oct_x = radi *Math.cos(pi*theta/180);
          oct_y = radi *Math.sin(pi*theta/180);
          // Tri1
          triangle_array.push(oct_x, oct_y, half_thick);
          triangle_array.push(oct_x, oct_y, -half_thick);
          theta += 120;
    }
    this.triangle_array = triangle_array;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangle_array), gl.STATIC_DRAW);


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
      //var a = Math.floor(Math.random() * 10);
      var c = faceColors[1];     // returns a number between 0 and 9 ];
      colors = colors.concat(c,c,c,c,c,c);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    var triangle_indices = [];
    triangle_indices.push(0,2,4);
    triangle_indices.push(1,3,5);
    triangle_indices.push(0,1,2);
    triangle_indices.push(1,3,2);
    triangle_indices.push(2,4,3);
    triangle_indices.push(4,3,5);
    triangle_indices.push(4,5,1);
    triangle_indices.push(0,1,4);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(triangle_indices), gl.STATIC_DRAW);

    this.buffers = {
      position: positionBuffer,
      color: colorBuffer,
      indices: indexBuffer,
    };

}

Triangle.prototype.tick = function()
{
  this.rotation += this.angular_velocity*3.1415/180;
}
Triangle.prototype.set_position = function(x,y,z)
{
  this.position = {'x':x,'y':y,'z':z};
}
Triangle.prototype.bounder = function()
{
   return {'triangle_array' :this.triangle_array,
            't':this.rotation,
            'h':this.h,
            'x':this.position.x,
            'y':this.position.y,
            'z':this.position.z
          };
}
Triangle.prototype.draw = function(gl, programInfo, deltaTime, projectionMatrix) {
  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  var buffers = this.buffers;
  const modelViewMatrix = mat4.create();

  // Now move the drawi ng position a bit to where we want to
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
                  [this.initial_pos.x, this.initial_pos.y, this.initial_pos.z]);
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
    const vertexCount = 24;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }

  // Update the rotation for the next draw

  //cubeRotation += 0.1*deltaTime;
  //cubeRotation += 0;
}
