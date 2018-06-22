
var cubeRotation = 0.0;
var gl;
const pi =  Math.PI;
var eye_z = -10;
var eye_speed = 0.3;
var cam_init_radius;
var cam_radius = cam_init_radius = 0.8;
var cam_theta = 270;
var omega = 4;
var then = 0;
var eye = [cam_radius*Math.cos(pi*cam_theta/180.0),cam_radius*Math.sin(pi*cam_theta/180),eye_z];
var look;
var up;
var cam_speed = 0;
var key_input = [];
main();

function main() {
  const canvas = document.querySelector('#glcanvas');
  gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }
  document.addEventListener('keydown',tick_input);

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

  // Fragment shader program

  const fsSource = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
  `;

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

// All global  declarations of variables
  //var roct = new Rectangle(0,4,0,0.2,4,0.2,45*Math.PI/180.0);
  //var roct = new Rectangle(0,1.5,2,3,3,0.4,0.394);
  var oct = new Triangle(0,-1.3,10,1,0.25,0,2);
  var octagon_array = [];
  var long_array = [];
  var wedge_array = [];
  var tri_array = [];
  for(var i = 0; i < 100; i++)
  {
    octagon_array.push(new Octagon(0,0,-20.0 + 0.4*i,1,0.2));
  }
  /*for(var i = 0; i < 3; i++)
  {
    octagon_array.push(new Octagon(0,0,-5.0 + 0.4*i,1,0.2));
  }*/

  // Draw the scene repeatedly
  function render(now) {
    //console.log(now);
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    var projectionMatrix = mat4.create();
    var viewMatrix = mat4.create();
    var VPMatrix = mat4.create();
    mat4.perspective(projectionMatrix,
                     fieldOfView,
                     aspect,
                     zNear,
                     zFar);
    //drawScene(gl, programInfo, deltaTime)
    eye = [cam_radius*Math.cos(pi*cam_theta/180.0),cam_radius*Math.sin(pi*cam_theta/180),eye_z];
    look = [0,0,10000 + eye_z];
    up = [-eye[0],-eye[1],0];
    //var up = [-eye[0],-eye[1],0];
    if(eye_z  <  5)
    {
      eye_z += eye_speed;
      //console.log(detect_rectangle_collision(roct.bounder(),eye));
      console.log(detect_triangle_collision(oct.bounder(), eye));
    }
    //cam_theta += omega;
    // ticks
    camera_tick();
    oct.tick();
    for(i = 0; i < long_array.length; i++)
    {
      long_array[i].tick();
    }
    for(i = 0; i < wedge_array.length; i++)
    {
      wedge_array[i].tick();
    }
    for(i = 0; i < tri_array.length; i++)
    {
      tri_array[i].tick();
    }
    //roct.tick();
    // ticks
    tick_input();
    //console.log(eye[1]);
    delete_invalid_cones(octagon_array);
    create_cones(octagon_array);
    create_longs(long_array);
    delete_invalid_longs(long_array);
    create_wedges(wedge_array);
    delete_invalid_wedges(wedge_array);
    create_tris(tri_array);
    delete_invalid_tris(tri_array);
    //mat4.lookAt(viewMatrix,cam.eye,cam.look,cam.up);
    //console.log(cam.eye,cam.target,cam.up);
    mat4.lookAt(viewMatrix,eye,look,up);
    mat4.multiply(VPMatrix, projectionMatrix, viewMatrix);
    //roct.draw(gl, programInfo, deltaTime, VPMatrix);
    oct.draw(gl, programInfo, deltaTime, VPMatrix);
    for(i = 0; i < octagon_array.length; i++)
    {
      octagon_array[i].draw(gl, programInfo, deltaTime, VPMatrix);
    }
    for(i = 0; i < long_array.length; i++)
    {
      long_array[i].draw(gl, programInfo, deltaTime, VPMatrix);
    }
    for(i = 0; i < wedge_array.length; i++)
    {
      wedge_array[i].draw(gl, programInfo, deltaTime, VPMatrix);
    }
    for(i = 0; i < tri_array.length; i++)
    {
      tri_array[i].draw(gl, programInfo, deltaTime, VPMatrix);
    }
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}



function drawScene(gl, programInfo, buffers, deltaTime) {
  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  var projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);


}

function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  // Send the source to the shader object
  gl.shaderSource(shader, source);
  // Compile the shader program
  gl.compileShader(shader);
  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

var tick_input = function() {
    if (key_input[37] == true) {
        cam_theta += omega;
    }
    if (key_input[39] == true) {
        cam_theta -= omega;
    }
    if(key_input[38] == true)
    {
      eye_z -= 1;
    }
    if (key_input[32] == true)
    {
        if(cam_radius == cam_init_radius)
        {
            //cam_speed = 0.2;
            cam_radius -= 0.002;
            cam_speed = 0.1;
            //console.log(eye[1]);
            //console.log(Math.sqrt((eye[0]*eye[0] + eye[1]*eye[1])));

        }
    }
}

var camera_tick = function()
{
  if(cam_radius <  cam_init_radius)
  {
      cam_radius -= cam_speed;
      cam_speed -= 0.01;
  }
  if(cam_radius >= cam_init_radius)
  {
      cam_radius = cam_init_radius;
      cam_speed = 0;
  }
};
window.onkeyup = function(e){key_input[e.keyCode] = false};
window.onkeydown = function(e){key_input[e.keyCode] = true};

function detect_rectangle_collision(a,b)
{
  //multiplyMatrixAndPoint(a.mat,b) ;
  //b.push(1.0);
  var theta = -a.t;
  //console.log(b.t);
  px = Math.cos(theta) * (b[0]) - Math.sin(theta) * (b[1]);
  py = Math.sin(theta) * (b[0]) + Math.cos(theta) * (b[1]);
  return (Math.abs(a.x - px) < (a.l)/2.0) &&
         (Math.abs(a.y - py)  < (a.b)/2.0) &&
         (Math.abs(a.z - b[2]) < (a.h));
}

var tri_area = function(x1, y1, x2, y2,x3,y3)
{
   return Math.abs((x1*(y2-y3) + x2*(y3-y1)+ x3*(y1-y2))/2.0);
}

/* A function to check whether point P(x, y) lies inside the triangle formed
   by A(x1, y1), B(x2, y2) and C(x3, y3) */
//bool isInside(int x1, int y1, int x2, int y2, int x3, int y3, int x)
function isInside(x1,x2,x3,y1,y2,y3,x,y)
{
   /* Calculate area of triangle ABC */
   var A = tri_area (x1, y1, x2, y2, x3, y3);

   /* Calculate area of triangle PBC */
   var A1 = tri_area (x, y, x2, y2, x3, y3);

   /* Calculate area of triangle PAC */
   var A2 = tri_area (x1, y1, x, y, x3, y3);

   /* Calculate area of triangle PAB */
   var A3 = tri_area (x1, y1, x2, y2, x, y);

   /* Check if sum of A1, A2 and A3 is same as A */
   //console.log(A);
   return (A == A1 + A2 + A3);
}

function detect_triangle_collision(a,b)
{
  //multiplyMatrixAndPoint(a.mat,b) ;
  //b.push(1.0);
  var theta = -a.t;
  var px = Math.cos(theta) * (b[0]) - Math.sin(theta) * (b[1]);
  var py = Math.sin(theta) * (b[0]) + Math.cos(theta) * (b[1]);

  var x1 = a.x + a.triangle_array[0];
  var x2 = a.x + a.triangle_array[6];
  var x3 = a.x + a.triangle_array[12];
  var y1 = a.y + a.triangle_array[1];
  var y2 = a.y + a.triangle_array[7];
  var y3 = a.y + a.triangle_array[13];
  var tmp = isInside(x1,x2,x3,y1,y2,y3,px,py);
  return (tmp) &&
         (Math.abs(a.z - b[2]) < (a.h));
}
