const { Client } = require('pg');

module.exports = async (parent, args, context, resolveInfo) => {
    const queryString = 'INSERT INTO measurements(date_measured, weight, happiness) VALUES($1, $2, $3) RETURNING *';
    const values = [];

    // validate input
    const fields = [ "date_measured", "weight", "happiness" ];
    fields.forEach(field => {
        if(typeof args[field] === 'undefined') {
            throw new Error(`Input field missing: ${field}`);
        }
    });

    values[0] = args['date_measured'];
    values[1] = args['weight'];
    values[2] = args['happiness'];

    const client = new Client(process.env.DB_URL);
    return await client.connect()
        .then(async () => {
            return await client.query(queryString, values)
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