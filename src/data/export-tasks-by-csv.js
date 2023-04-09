import { parse } from 'csv-parse';
import fs from 'fs'

const csvPath = new URL('./tasks.csv', import.meta.url)

const parser = parse({
  delimiter: ',',
  columns: true
});

parser.on('readable', function() {
    let record;
    while ((record = parser.read()) !== null) {
        postData(record)
    }
});

fs.createReadStream(csvPath).pipe(parser);


parser.on('error', function(err) {
    console.error(err.message);
});


parser.on('end', function() {
    console.log('CSV finalizado');
});

function postData(record) {   
    const body = {
        title: record.title,
        description: record.description,
    }

    fetch('http://localhost:3333/tasks', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        res.text().then(data => console.log(data))
    }).catch(err => console.log(err))
}
  