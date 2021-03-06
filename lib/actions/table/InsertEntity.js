'use strict';

const AzuriteTableResponse = require('./../../model/table/AzuriteTableResponse'),
    tableStorageManager = require('./../../core/table/TableStorageManager'),
    N = require('./../../core/HttpHeaderNames');

class InsertEntity {
    constructor() {
    }

    process(request, res) {
        tableStorageManager.insertEntity(request)
            .then((response) => {
                response.addHttpProperty(N.ETAG, response.proxy.etag);                
                if (request.httpProps[N.PREFER] === 'return-no-content') {
                    response.addHttpProperty(N.PREFERENCE_APPLIED, 'return-no-content');
                    res.status(204).send();
                    return;
                }
                response.addHttpProperty(N.PREFERENCE_APPLIED, 'return-content');
                res.set(response.httpProps);
                res.status(201).send(response.proxy.odata(request.accept));
            });
    }
}

module.exports = new InsertEntity;