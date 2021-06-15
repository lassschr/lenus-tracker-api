const { Client } = require('pg');

module.exports = async (parent, args, context, resolveInfo) => {
    const client = new Client(process.env.DB_URL);
    const fields = [ "date_measured", "weight", "happiness" ];

    if(typeof args.id === 'undefined') {
        throw new Error('Input field missing: id');
    }

    let setValues = [];
    for (let i = 0; i < Object.keys(args).length; i++) {
        const fieldName = Object.keys(args)[i];
        
        if(fields.includes(fieldName)) {
            setValues.push(`${fieldName} = ${typeof args[fieldName] === 'string' ? `'${args[fieldName]}'` : args[fieldName]}`);
        }
    }
    
    const queryString = `UPDATE measurements SET ${setValues.join(', ')} WHERE id = ($1) RETURNING *;`;
    return await client.connect()
        .then(async () => {
            return await client.query(queryString, [ args.id ])
                .then(result => {
                    client.end();
                    return result.rows.length === 1 ? result.rows[0] : null;
                })
                .catch(error => {
                    return console.error('Error running query', error);
                });
        })
        .catch(error => {
            return console.error('Could not connect to postgres', error);
        });
}