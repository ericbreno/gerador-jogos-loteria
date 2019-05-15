const fs = require('fs');

const lastPath = './jogos/last.json';
const theresLast = fs.existsSync(lastPath);
if (!theresLast) {
    throw new Error('File not found for last');
}

const last = require(lastPath);

const [result] = process.argv.filter(arg => arg.startsWith('-nums='));
if (result === undefined) {
    throw new Error('Missing -nums= arg');
}

const numbersResult = result.split(',').map(Number);

const checked = last.map((bet) => {
    const hit = bet.reduce((total, number) => numbersResult.includes(number) ? total + 1 : total, 0);
    return {
        aposta: bet,
        acertos: hit
    };
}).sort((a, b) => a.hit - b.hit);

const resultsFolder = './resultados';
const theresFolder = fs.existsSync(resultsFolder);
if (!theresFolder) {
    fs.mkdirSync(resultsFolder);
}

fs.writeFileSync(resultsFolder + '/lastChecked.json', JSON.stringify(checked, null, 2));

const best = checked[checked.length - 1];
console.log('--------------------------------');
console.log('Melhor resultado:', best.acertos);
console.log('Jogo:', best.aposta);
console.log('--------------------------------');