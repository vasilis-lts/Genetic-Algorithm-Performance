var bruteForce = {};

bruteForce.targetNotFound = true;
bruteForce.best;
bruteForce.Generation = 0;
bruteForce.startTime;
bruteForce.endTime;
bruteForce.ElementPool = [];

var generationBFelem = document.getElementById("generationBF");

bruteForce.generatePopulationBF = function() {
  this.ElementPool = [];
  for (let i = 0; i < totalPopulation; i++) {
    const genome = createRandomPopulation();
    this.ElementPool.push({ genome });
  }
};

bruteForce.calculateFitness = function() {
  // console.log(this.ElementPool);

  for (var i = 0; i < this.ElementPool.length; i++) {
    if (bruteForce.targetNotFound) {
      var score = 0;
      const element = this.ElementPool[i].genome;

      for (let j = 0; j < element.length; j++) {
        if (element[j] === target[j]) {
          score++;
        }
      }
      if (score / target.length === 1) {
        console.log(
          "BruteForce Found Target! at Genome " +
            i +
            " Generation " +
            generation
        );
        const descriptionElem = document.getElementById("descriptionBF");
        descriptionElem.innerHTML = "Found target!";
        console.log(performance.now());
        bruteForce.endTime = performance.now();
        bruteForce.BFTime =
          Math.floor(bruteForce.endTime - bruteForce.startTime) / 1000;
        const BFTimeElem = document.getElementById("BFTime");
        BFTimeElem.innerHTML = `in ${bruteForce.BFTime} seconds`;
        bruteForce.targetNotFound = false;
      }
      this.ElementPool[i].fitness = score / target.length;
    }
  }
};

bruteForce.evaluate = function() {
  let worldrecord = 0.0;
  let index = 0;
  for (let i = 0; i < this.ElementPool.length; i++) {
    if (this.ElementPool[i].fitness > worldrecord) {
      index = i;
      worldrecord = this.ElementPool[i].fitness;
    }
  }

  this.best = this.ElementPool[index];
  if (worldrecord === this.perfectScore) {
    this.finished = true;
  }
  this.displayInfo();
};

bruteForce.displayInfo = function() {
  const generationElemBF = document.getElementById("bestGenomeBF");
  generationElemBF.innerHTML = this.best.genome;
};

function bruteForceLoop() {
  setTimeout(() => {
    bruteForce.Generation++;
    generationBFelem.innerHTML = bruteForce.Generation;

    bruteForce.generatePopulationBF();
    bruteForce.calculateFitness();
    bruteForce.evaluate();

    if (bruteForce.targetNotFound) {
      bruteForceLoop();
    }
  }, 50);
}

function initializeBruteForceAlgorithm() {
  bruteForce.ElementPool = [];
  bruteForce.best = {};
  bruteForce.targetNotFound = true;
  bruteForce.Generation = 0;
  descriptionBF.innerHTML = "Closest match in Generation:";

  bruteForce.startTime = performance.now();
  const targetElemBF = document.getElementById("targetBF");
  targetElemBF.innerHTML = target;

  bruteForceLoop();
}
