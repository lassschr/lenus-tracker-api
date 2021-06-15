const { Client } = require('pg');

module.exports = async (parent, args, context, resolveInfo) => {
    const queryString = 'DELETE FROM measurements WHERE id=($1) RETURNING *';
    
    if(typeof args.id === 'undefined') {
        throw new Error('Missing input field: id');
    }

    const values = [ args.id ];

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