// initial model definition
const model = tf.sequential();
// Initialize output layer
model.add(tf.layers.dense({units: 1, inputShape: [4], activation: 'linear'}));
const adamOpt = tf.train.adam(.1);
model.compile({
  optimizer: adamOpt,
  loss: 'meanSquaredError'
});

let inputs = tf.tensor2d([getPosArr()]);

let outputs = model.predict(inputs);
console.log(tf.argMax(outputs, 1).dataSync());
keyPush(tf.argMax(outputs, 1).dataSync()-1);
outputs.print();

fitModel();

async function fitModel() {
  for (let i = 1; i < 1000 ; ++i) {
     var posArr = getPosArr();
     const expected = posArr[3];
     posArr.pop();
     const h = await model.fit(posArr, expected, {
         batchSize: 3,
         epochs: 5
     });
     console.log("Loss after Epoch " + i + " : " + h.history.loss[0]);
  }
}
