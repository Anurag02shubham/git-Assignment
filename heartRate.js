const fs = require('fs');

function calculateStats(data) {
    const bpmValues = data.map(measurement => measurement.bpm).sort((a, b) => a - b);
    const min = bpmValues[0];
    const max = bpmValues[bpmValues.length - 1];
    const median = calculateMedian(bpmValues);
    const latestDataTimestamp = data[data.length - 1].timestamp;
    return { min, max, median, latestDataTimestamp };
}

function calculateMedian(arr) {
    const mid = Math.floor(arr.length / 2);
    const sortedArr = arr.slice().sort((a, b) => a - b);
    return arr.length % 2 !== 0 ? sortedArr[mid] : (sortedArr[mid - 1] + sortedArr[mid]) / 2;
}

function processData(inputData) {
    const dailyStats = [];
    const dailyMeasurements = {};

    // Group measurements by date
    inputData.forEach(measurement => {
        const date = measurement.timestamp.split('T')[0];
        if (!dailyMeasurements[date]) {
            dailyMeasurements[date] = [];
        }
        dailyMeasurements[date].push(measurement);
    });

    // Calculate stats for each day
    Object.entries(dailyMeasurements).forEach(([date, measurements]) => {
        const stats = calculateStats(measurements);
        dailyStats.push({ date, ...stats });
    });

    return dailyStats;
}

function writeOutputToFile(data) {
    fs.writeFileSync('output.json', JSON.stringify(data, null, 2));
}

// Read input data from input.json file
const inputData = JSON.parse(fs.readFileSync('input.json', 'utf-8'));

// Process data and calculate statistics
const dailyStats = processData(inputData);

// Write output to output.json file
writeOutputToFile(dailyStats);

console.log('Output has been written to output.json');
