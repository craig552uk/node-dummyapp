var Sequelize = require('sequelize');
var log       = require('./logger').child({scope:"Sequelize"});
var httperror = require('./httperror');
var config    = require('./config')['database'];

// Setup common config
config.logging = function(msg){ log.info(msg); }
config.define  = {instanceMethods:{}};

/**
 * Return an object representation of an instance formatted for a jsonapi response
 */
config.define.instanceMethods.jsonapi = function(){
    var modelName = this.$modelOptions.name.plural;
    var host = 'https://app.craig-russell.co.uk';
    return {
        type:       modelName,
        id:         this.id,
        properties: this.dataValues,
        links:{
            self: `${host}/api/${modelName}/${this.id}/`
        }
    }
}

// Construct instance with connection config and model defaults
log.info({config: config});
var sequelize = new Sequelize(config.database, config.username, config.password, config);

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
function handleItems(req, res, next){
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
function handleItem(req, res, next){
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


module.exports.Sequelize   = Sequelize;
module.exports.sequelize   = sequelize;
module.exports.handleItems = handleItems;
module.exports.handleItem  = handleItem;