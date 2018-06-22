var eye_z = -10;
function shuffle(a) {
        var j, x, i;
            for (i = a.length - 1; i > 0; i--) {
                        j = Math.floor(Math.random() * (i + 1));
                                x = a[i];
                                        a[i] = a[j];
                                                a[j] = x;
                                            }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

/*function multiplyMatrixAndPoint(matrix, point) {

  //Give a simple variable name to each part of the matrix, a column and row number
  var c0r0 = matrix[ 0], c1r0 = matrix[ 1], c2r0 = matrix[ 2], c3r0 = matrix[ 3];
  var c0r1 = matrix[ 4], c1r1 = matrix[ 5], c2r1 = matrix[ 6], c3r1 = matrix[ 7];
  var c0r2 = matrix[ 8], c1r2 = matrix[ 9], c2r2 = matrix[10], c3r2 = matrix[11];
  var c0r3 = matrix[12], c1r3 = matrix[13], c2r3 = matrix[14], c3r3 = matrix[15];

  //Now set some simple names for the point
  var x = point[0];
  var y = point[1];
  var z = point[2];
  var w = point[3];

  //Multiply the point against each part of the 1st column, then add together
  var resultX = (x * c0r0) + (y * c0r1) + (z * c0r2) + (w * c0r3);

  //Multiply the point against each part of the 2nd column, then add together
  var resultY = (x * c1r0) + (y * c1r1) + (z * c1r2) + (w * c1r3);

  //Multiply the point against each part of the 3rd column, then add together
  var resultZ = (x * c2r0) + (y * c2r1) + (z * c2r2) + (w * c2r3);

  //Multiply the point against each part of the 4th column, then add together
  var resultW = (x * c3r0) + (y * c3r1) + (z * c3r2) + (w * c3r3);

  return [resultX, resultY, resultZ, resultW];
}*/
/*
var matrix_inverse = function(arr)
{
  console.log(arr);
  var s0 = a[0] * a[5] - a[4] * a[1];
  var s1 = a[0] * a[6] - a[4] * a[2];
  var s2 = a[0] * a[7] - a[4] * a[3];
  var s3 = a[1] * a[6] - a[5] * a[2];
  var s4 = a[1] * a[7] - a[5] * a[3];
  var s5 = a[2] * a[7] - a[6] * a[3];

  var c5 = a[10] * a[15] - a[14] * a[11];
  var c4 = a[9] * a[15] - a[13] * a[11];
  var c3 = a[9] * a[14] - a[13] * a[10];
  var c2 = a[8] * a[15] - a[12] * a[11];
  var c1 = a[8] * a[14] - a[12] * a[10];
  var c0 = a[8] * a[13] - a[12] * a[9];

  //console.log(c5,s5,s4);

  // Should check for 0 determinant
  var invdet = 1.0 / (s0 * c5 - s1 * c4 + s2 * c3 + s3 * c2 - s4 * c1 + s5 * c0);

  var b = [[],[],[],[]];

  b[0] = ( a[5] * c5 - a[6] * c4 + a[7] * c3) * invdet;
  b[1] = (-a[1] * c5 + a[2] * c4 - a[3] * c3) * invdet;
  b[2] = ( a[13] * s5 - a[14] * s4 + a[15] * s3) * invdet;
  b[3] = (-a[9] * s5 + a[10] * s4 - a[11] * s3) * invdet;

  b[4] = (-a[4] * c5 + a[6] * c2 - a[7] * c1) * invdet;
  b[5] = ( a[0] * c5 - a[2] * c2 + a[3] * c1) * invdet;
  b[6] = (-a[12] * s5 + a[14] * s2 - a[15] * s1) * invdet;
  b[7] = ( a[8] * s5 - a[10] * s2 + a[11] * s1) * invdet;

  b[8] = ( a[4] * c4 - a[5] * c2 + a[7] * c0) * invdet;
  b[9] = (-a[0] * c4 + a[1] * c2 - a[3] * c0) * invdet;
  b[10] = ( a[12] * s4 - a[13] * s2 + a[15] * s0) * invdet;
  b[11] = (-a[8] * s4 + a[9] * s2 - a[11] * s0) * invdet;

  b[12] = (-a[4] * c3 + a[5] * c1 - a[6] * c0) * invdet;
  b[13] = ( a[0] * c3 - a[1] * c1 + a[2] * c0) * invdet;
  b[14] = (-a[12] * s3 + a[13] * s1 - a[14] * s0) * invdet;
  b[15] = ( a[8] * s3 - a[9] * s1 + a[10] * s0) * invdet;

  return b;
}*/

function delete_invalid_cones(looper)
{
    var i;
   for(i=0; i< looper.length;i++){
      if(eye_z - looper[i].position.z > 0.1)
        {
            looper.splice(i,1);
            return;
        }
    }
}

function create_cones(looper)
{
    if(looper.length < 100 && looper.length > 0)
    {
        var temp_z = looper[looper.length -1].position.z;
        looper.push(new Octagon(0,0,temp_z + 0.4,1,0.2));
    }
    return;
}

function create_longs(looper)
{
  if(looper.length < 3)
  {
      var i = 40*Math.random();
      //ar temp_z = looper[looper.length -1].position.z;
      looper.push(new Rectangle(0,0,eye_z + 20 + i,0.2,4,0.2,2*Math.random()*Math.PI, Math.random()*10));
  }
  return;
}

function delete_invalid_longs(looper)
{
    var i;
   for(i=0; i< looper.length;i++){
      if(eye_z - looper[i].position.z > 2)
        {
            looper.splice(i,1);
            return;
        }
    }
}

function create_wedges(looper)
{
  if(looper.length < 3)
  {
      var i = 50*Math.random();
      //ar temp_z = looper[looper.length -1].position.z;
      looper.push(new Rectangle(0,1.5,eye_z + 15 + i,2,3,3,2*Math.random()*Math.PI, Math.random()*10));
      //var roct = new Rectangle(0,1.5,2,3,3,0.4,0.394);
  }
  return;
}

function delete_invalid_wedges(looper)
{
    var i;
   for(i=0; i< looper.length;i++){
      if(eye_z - looper[i].position.z > 2)
        {
            looper.splice(i,1);
            return;
        }
    }
}

function create_tris(looper)
{
  if(looper.length < 3){
    var i = 50*Math.random();

    for(var j=0;j<3;j++)
  {
      //ar temp_z = looper[looper.length -1].position.z;
      //var oct = new Triangle(0,-1.3,10,1,0.25,0,2);

      looper.push(new Triangle(0,-1.3,eye_z + 20 + i,1,0.25,j*120,1));
      //var roct = new Rectangle(0,1.5,2,3,3,0.4,0.394);
  }
}
  return;
}

function delete_invalid_tris(looper)
{
    var i;
   for(i=0; i< looper.length;i++){
      if(eye_z - looper[i].position.z > 2)
        {
            looper.splice(i,1);
            return;
        }
    }
}
