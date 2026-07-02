const fs = require('fs');


const writeDataToJson = (data: any, filePath: string) => {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData, 'utf-8');
}