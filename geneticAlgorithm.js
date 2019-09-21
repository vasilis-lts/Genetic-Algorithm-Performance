var population = {};
var targetNotFound = true;

var best;

population.startTime;
population.endTime;

population.ElementPool;
population.Genes = [];
population.fitness = 0;
population.Generation = 0;

function createRandomPopulation() {
  var result = "";
  var targetLength = target.length;
  // "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < targetLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function generatePopulation() {
  let populationPool = [];
  for (let i = 0; i < totalPopulation; i++) {
    const genome = createRandomPopulation();
    populationPool.push({ genome });
  }
  startLoop(populationPool);
}

// calculate percentage of correct characters (fitness)
function calculateFitness(populationPool) {
  // console.log(populationPool);
  for (var i = 0; i < populationPool.length; i++) {
    if (targetNotFound) {
      var score = 0;
      const element = populationPool[i].genome;

      for (let j = 0; j < element.length; j++) {
        if (element[j] === target[j]) {
          score++;
        }
      }
      if (score / target.length === 1) {
        bestGenomeGA.innerHTML = element;
        // console.log(
        //   "Found Target! at Genome " + i + " Generation " + generation
        // );
        const descriptionElem = document.getElementById("descriptionGA");
        descriptionElem.innerHTML = "Found target!";
        // console.log(performance.now());
        population.endTime = performance.now();
        population.GATime =
          Math.floor(population.endTime - population.startTime) / 1000;
        const GATimeElem = document.getElementById("GATime");
        GATimeElem.innerHTML = `in ${population.GATime} seconds`;
        targetNotFound = false;
      }
      populationPool[i].fitness = score / target.length;
    }
  }

  if (targetNotFound) {
    evaluate(populationPool);
    selection(populationPool);
  }
}

function evaluate(populationPool) {
  let worldrecord = 0.0;
  let index = 0;
  for (let i = 0; i < populationPool.length; i++) {
    if (populationPool[i].fitness > worldrecord) {
      index = i;
      worldrecord = populationPool[i].fitness;
    }
  }

  best = populationPool[index];
  if (worldrecord === 1) {
    console.log("found");
    this.finished = true;
  }
  displayInfo();
}

function selection(populationPool) {
  let mutatedPopulationPool = [];
  let matingPool = [];

  let maxFitness = 0;
  for (let i = 0; i < populationPool.length; i++) {
    if (populationPool[i].fitness > maxFitness) {
      maxFitness = populationPool[i].fitness;
    }
  }

  const filteredPool = populationPool.filter(
    element => element.fitness === maxFitness
  );

  for (let i = 0; i < filteredPool.length; i++) {
    let n = Math.floor(filteredPool[i].fitness * 100);
    for (let j = 0; j < n; j++) {
      matingPool.push(filteredPool[i]);
    }
  }

  for (let i = 0; i < populationPool.length; i++) {
    let a = Math.floor(Math.random() * matingPool.length);
    let b = Math.floor(Math.random() * matingPool.length);
    let partnerA = matingPool[a];
    let partnerB = matingPool[b];

    let child = crossover(partnerA, partnerB);
    let mutatedChild = mutate(child);

    mutatedPopulationPool[i] = mutatedChild;
  }

  if (targetNotFound) {
    startLoop(mutatedPopulationPool);
  }
}

function crossover(partnerA, partnerB) {
  let child = {};
  let genome = [];

  let midpoint = Math.floor(Math.random(target.length));

  for (let i = 0; i < target.length; i++) {
    if (i > midpoint) {
      genome[i] = partnerA.genome[i];
    } else {
      genome[i] = partnerB.genome[i];
    }
  }
  child.genome = genome.join("");
  return child;
}

function mutate(child) {
  let genome = child.genome.split("");
  for (let i = 0; i < target.length; i++) {
    if (Math.random(1) < mutationRate) {
      genome[i] = characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }
  }
  child.genome = genome.join("");
  return child;
}

function startLoop(populationPool) {
  setTimeout(() => {
    generation++;
    const generationElem = document.getElementById("generationGA");
    generationElem.innerHTML = generation;

    calculateFitness(populationPool);
  }, 50);
}

function displayInfo() {
  const generationElem = document.getElementById("bestGenomeGA");
  generationElem.innerHTML = best.genome;
}

function initializeGeneticAlgorithm() {
  best = {};
  targetNotFound = true;
  generation = 0;
  descriptionGA.innerHTML = "Closest match in Generation:";

  generatePopulation();
  // console.log(performance.now());
  population.startTime = performance.now();
  const targetElemGA = document.getElementById("targetGA");
  targetElemGA.innerHTML = target;
}
