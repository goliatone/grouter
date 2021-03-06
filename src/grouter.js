/*
 * grouter
 * https://github.com/goliatone/grouter
 * Created with gbase.
 * Copyright (c) 2014 goliatone
 * Licensed under the MIT license.
 */
/* jshint strict: false, plusplus: true */
/*global define: false, require: false, module: false, exports: false */
(function(root, name, deps, factory) {
    "use strict";
    // Node
    if (typeof deps === 'function') {
        factory = deps;
        deps = [];
    }

    if (typeof exports === 'object') {
        module.exports = factory.apply(root, deps.map(require));
    } else if (typeof define === 'function' && 'amd' in define) {
        //require js, here we assume the file is named as the lower
        //case module name.
        define(name.toLowerCase(), deps, factory);
    } else {
        // Browser
        var d, i = 0,
            global = root,
            old = global[name],
            mod;
        while ((d = deps[i]) !== undefined) deps[i++] = root[d];
        global[name] = mod = factory.apply(global, deps);
        //Export no 'conflict module', aliases the module.
        mod.noConflict = function() {
            global[name] = old;
            return mod;
        };
    }
}(this, "GRouter", ['extend', 'keypath'], function(extend, Keypath) {

    /*
     *
     */
    var _extend = extend;

    /**
     * Shim console, make sure that if no console
     * available calls do not generate errors.
     * @return {Object} Console shim.
     */
    var _shimConsole = function(con) {

        if (con) return con;

        con = {};
        var empty = {},
            noop = function() {},
            properties = 'memory'.split(','),
            methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' +
                'groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,' +
                'table,time,timeEnd,timeStamp,trace,warn').split(','),
            prop,
            method;

        while (method = methods.pop()) con[method] = noop;
        while (prop = properties.pop()) con[prop] = empty;

        return con;
    };


    ///////////////////////////////////////////////////
    // CONSTRUCTOR
    ///////////////////////////////////////////////////

    var OPTIONS = {
        initialRoute: 'home',
        autoinitialize:true,
        matchers:{}
    };

    /**
     * GRouter constructor
     *
     * @param  {object} config Configuration object.
     */
    var GRouter = function(config) {
        config = config || {};

        config = _extend({}, this.constructor.DEFAULTS, config);

        if(config.autoinitialize) this.init(config);
    };

    GRouter.name = GRouter.prototype.name = 'GRouter';

    GRouter.VERSION = '0.0.3';

    /**
     * Make default options available so we
     * can override
     */
    GRouter.DEFAULTS = OPTIONS;

    ///////////////////////////////////////////////////
    // PRIVATE METHODS
    ///////////////////////////////////////////////////

    GRouter.prototype.init = function(config) {
        if (this.initialized) return;
        this.initialized = true;

        this.logger.log('GRouter Initializing', config);

        config = _extend(config, this.constructor.DEFAULTS);
        _extend(this, config);

        this.currentId = this.currentId || this.initialRoute;

        return this;
    };

    GRouter.prototype.handler = function(e) {
        var data = e.data;
        this.logger.warn('=============\nhandler\n=============', data);

        if(data.type === 'command'){
            return this.emit('command.' + data.name, data.payload);
        }

        //Store the current payload.
        this.event = e;
        this.data = data;

        //TODO: Remove this chunk, provide a generateTypes method
        var subscene = Keypath.get(data, 'payload.subscene', undefined);
        subscene && (subscene = ['route', data.scene, subscene[0]].join('.'));

        ['route', 'route.' + data.scene, subscene].forEach(function(type) {
            if (!type) return;
            this.logger.info('EMIT ROUTE:', type);
            this.emit(type, data);
        }, this);
    };

    GRouter.prototype.goto = function(id, options) {

        var oldId = this.currentId,
            isTransitioning = oldId !== id;

        /*
         * Event type fired before we exit a route.
         * Default route event is:
         * exit.home
         * goto.update or goto.change
         * goto.<SCENE_ID>.<update | change>
         */
        var exitType = isTransitioning ? 'exit.' + oldId : null,
            actionType = isTransitioning ? 'change' : 'update',
            actionSceneType = 'goto.' + id + '.' + actionType;

        this.currentId = id;

        [exitType, 'goto', 'goto.' + actionType, actionSceneType].forEach(function(type) {
            if (!type) return;

            this.logger.info('EMIT GOTO:', type);
            this.emit(type, {
                id: id,
                old: oldId,
                isTransitioning: isTransitioning,
                //TODO: Should we rename options to payload to make it
                //consistent?!!!
                options: options
            });
        }, this);
    };

    GRouter.prototype.emit = function() {
        this.logger.warn('emit not implemented', arguments);
    };


    GRouter.prototype.match = function(path, payload){
        var regexp,
            matched,
            values,
            params,
            matcher,
            path = this.sanitizePath(path);

        matched = Object.keys(this.matchers).some(function(m){
            matcher = m;
            regexp = this.matchers[matcher];
            values = path.match(regexp);
            if(!values) return false;
            values.shift();
            params = regexp.keys.reduce(function(output, key, i){
                output[key.name] = values[i];
                return output;
            }, {});

            this.emit(matcher, {payload:payload, path:path, params:params});

            return true;
        }, this);

        if(!matched && matcher !== '*') this.emit('unhandled', {payload:payload, path:path});
    };

    GRouter.prototype.route = function(path, handler){
        path = this.sanitizePath(path);
        this.matchers[path] = this.pathToRegexp(path, []);
        this.on(path, handler);
    };

    GRouter.prototype.unhandled = function(handler){
        this.on('unhandled', handler);
    };

    GRouter.prototype.sanitizePath = function(path){
        if(path instanceof RegExp) return path;
        if(path.indexOf('/') !== 0) return path;
        return path.substr(1);
    };

    /**
     * Logger method, meant to be implemented by
     * mixin. As a placeholder, we use console if available
     * or a shim if not present.
     */
    GRouter.prototype.logger = _shimConsole(console);

    return GRouter;
}));