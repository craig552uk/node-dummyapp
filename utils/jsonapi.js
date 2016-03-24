// 
// Route handlers for managing Sequelize models as JSON API endpoints
// 

var httperror = require('../utils/httperror');

/**
 * Attempt to load a model module or throw 404
 */
function loadModel(modelName){
    try{
        var model = require('../models/'+modelName+'.js');
        model.modelName = modelName;
        return model;
    }catch(err){
        if(err.code == 'MODULE_NOT_FOUND') throw httperror.NotFound();
    }
}

/**
 * List all records for model
 */
function modelList(model){
    return model.findAll()
    .then(items => items.map(item => item.jsonapi()));
}

/**
 * Add record of type model
 */
function modelAdd(model, data){
    return model.create(data)
    .then(item => item.jsonapi())
}

/**
 * Get record with id for model
 */
function modelGet(model, id){
    return model.findById(id).then(item => {
        if(item) return item.jsonapi();
        throw httperror.NotFound();
    });
}

/**
 * Update record with id for model
 */
function modelUpdate(model, id, data){
    return model.findById(id).then(item => {
        if(item) return item.update(data);
        throw httperror.NotFound();
    }).then(item => item.jsonapi());
}

/**
 * Delete record with id for model
 */
function modelDelete(model, id){
    return model.destroy({where: {id: id}}).then(affected_rows => {
        if(affected_rows == 1) return {type: model.modelName, ids:[id]};
        throw httperror.NotFound();
    });
}

/**
 * Route handler for multiple items
 */
module.exports.handleItems = function(req, res, next){
    var model = loadModel(req.params.model);

    switch(req.method){
        case 'GET':  var query = modelList(model);    break;
        case 'POST': var query = modelAdd(model, req.body); break;
        default: throw httperror.MethodNotAllowed();
    }
    query.then(data => res.jsonp({data: data})).catch(err => next(err));
}

/**
 * Route handler for single item
 */
module.exports.handleItem = function(req, res, next){
    var model = loadModel(req.params.model);
    var id    = req.params.id;

    switch(req.method){
        case 'GET':    var query = modelGet(model, id); break;
        case 'POST':   var query = modelUpdate(model, id, req.body); break;
        case 'DELETE': var query = modelDelete(model, id); break;
        default: throw httperror.MethodNotAllowed();
    }
    query.then(data => res.jsonp({data: data})).catch(err => next(err));
}