var direction = ['left', 'forward', 'right'];

// initial model definition
const model = tf.sequential();
// Initialize output layer
model.add(tf.layers.dense({units: 3, inputShape: [3], activation: 'linear'}));


let directionTensor = tf.tensor1d(direction, 'int32');;
directionTensor.dispose();


const adamOpt = tf.train.adam(.001);
model.compile({
  optimizer: adamOpt,
  loss: 'meanSquaredError'
});
//var arrInput = getPosArr();
//arrInput.pop();
//let inputs = tf.tensor2d([arrInput]);

//let outputs = model.predict(inputs);
//console.log(tf.argMax(outputs, 1).dataSync());
//keyPush(tf.argMax(outputs, 1).dataSync()-1);
//outputs.print();


async function fitModel(moveRecord) {
  console.log(moveRecord);
  for (var i = 0; i < moveRecord.length; i++) {
     var posArr = moveRecord[i];
     const expected = tf.oneHot(tf.tensor1d([posArr[3]], 'int32'), 3).cast('float32');
     //console.log(expected);
     posArr.pop();
     posArr = tf.tensor2d([posArr]);
     const h = await model.fit(posArr, expected, {
         batchSize: 3,
         epochs: 1
     });
     //console.log("Loss after Epoch " + i + " : " + h.history.loss[0]);
     expected.dispose();
     posArr.dispose();
  }
}

function makePrediction(input) {
  input.pop();
  let inputs = tf.tensor2d([input]);
  const outputs = model.predict(inputs);
  return direction[outputs.argMax(1).dataSync()[0]];

}
