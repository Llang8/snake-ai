// initial model definition
const model = tf.sequential();
// Initialize output layer
model.add(tf.layers.dense({units: 1, inputShape: [3], activation: 'linear'}));
const adamOpt = tf.train.adam(.1);
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
  for (var i = 0; i < moveRecord.length - 1; ++i) {
     var posArr = moveRecord[i];
     console.log(posArr);
     const expected = tf.tensor1d([posArr[3]]);
     posArr.pop();
     posArr = tf.tensor2d([posArr]);
     const h = await model.fit(posArr, expected, {
         batchSize: 3,
         epochs: 1
     });
     console.log("Loss after Epoch " + i + " : " + h.history.loss[0]);
  }
}

function makePrediction(input) {
  input.pop();
  let inputs = tf.tensor2d([input]);
  const outputs = model.predict(inputs);
  console.log(outputs.print());
  return tf.argMax(outputs, 1).dataSync()-1;
}
