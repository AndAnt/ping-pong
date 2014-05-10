module.exports.express = {

    customMiddleware: function(app) {

        app.use(function(req, res, next) {
            var _render = res.render;
            var urlSpl = req.url.toLowerCase().split("/");
            var viewPath = (urlSpl.length > 2 ? urlSpl[1] + "/" : "");
            res.render = function(view, options, callback) {
                console.log("[DEBUG] Rendering template '" + viewPath + view + ".jade'");
                _render.call(res, viewPath + view, options, callback);
            };
            next();
        });

    }

};