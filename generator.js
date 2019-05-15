const fs = require('fs');

const saveBets = bets => {
    const theresFolder = fs.existsSync('./jogos');
    if (!theresFolder) {
        fs.mkdir('./jogos');
    }

    const lastPath = './jogos/last.json';
    const theresLast = fs.existsSync(lastPath);
    if (theresLast) {
        fs.copyFileSync(lastPath, `./jogos/${new Date().toISOString()}.json`);
    }
    fs.writeFileSync(lastPath, JSON.stringify(bets));
};

const extractArgs = () => {
    const desiredArgs = [
        '-jogos',
        '-numeros',
        '-ultimo'
    ];

    const defaults = {
        [desiredArgs[0]]: 1,
        [desiredArgs[1]]: '',
        [desiredArgs[2]]: ''
    };

    const input = process.argv;

    const mapArgsInput = input
        .filter(inputArg => desiredArgs.some(lockedArg => inputArg.startsWith(`${lockedArg}=`)))
        .reduce((map, arg) => {
            const [name, value] = arg.split('=');
            map[name] = value;
            return map;
        }, {});

    const mapArgs = { ...defaults, ...mapArgsInput };

    return mapArgs;
}

const shuffle = arr => {
    const genIndex = () => Math.round(Math.random() * (arr.length - 1));
    const newArr = [...arr];
    newArr.forEach((e, i) => {
        const newIndex = genIndex();
        const temp = newArr[newIndex];
        newArr[newIndex] = e;
        newArr[i] = temp;
    });
    return newArr;
};

const generateNewBet = (base, available, betSize, bets) => {
    if (bets <= 0) return [];
    const newBet = base
        .concat(shuffle(available))
        .slice(0, betSize)
        .sort((a, b) => Number(a) - Number(b));
    const otherBets = generateNewBet(base, available, betSize, bets - 1);

    if (otherBets.some(fullBet => JSON.stringify(fullBet) === JSON.stringify(newBet))) {
        console.log('Avoiding repeated');
        return [...otherBets, ...generateNewBet(base, available, betSize, 1)];
    }
    return [...otherBets, newBet];
};

const generateBets = (args, size = 25, betSize = 15) => {
    const allNumbers = 'n '.repeat(size).split(' ').map((e, i) => i + 1);
    const baseNumbers = args['-numeros'].split(',').filter(i => i).map(Number);
    const totalBets = Number(args['-jogos']);

    const availableNumbers = allNumbers.filter(n => !baseNumbers.some(nbase => nbase === n));

    return generateNewBet(baseNumbers, availableNumbers, betSize, totalBets);
};

const bets = generateBets(extractArgs());

saveBets(bets);
