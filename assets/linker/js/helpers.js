$.fn.serializeObject = function(){
    var self = this,
        json = {},
        push_counters = {},
        patterns = {
            "validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
            "key":      /[a-zA-Z0-9_]+|(?=\[\])/g,
            "push":     /^$/,
            "fixed":    /^\d+$/,
            "named":    /^[a-zA-Z0-9_]+$/
        };
    this.build = function(base, key, value){
        base[key] = value;
        return base;
    };
    this.push_counter = function(key){
        if(push_counters[key] === undefined){
            push_counters[key] = 0;
        }
        return push_counters[key]++;
    };
    $.each($(this).serializeArray(), function(){
        // skip invalid keys
        if(!patterns.validate.test(this.name)){
            return;
        }
        var k,
            keys = this.name.match(patterns.key),
            merge = this.value,
            reverse_key = this.name;

        while((k = keys.pop()) !== undefined){
            // adjust reverse_key
            reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');
            // push
            if(k.match(patterns.push)){
                merge = self.build([], self.push_counter(reverse_key), merge);
            }
            // fixed
            else if(k.match(patterns.fixed)){
                merge = self.build([], k, merge);
            }
            // named
            else if(k.match(patterns.named)){
                merge = self.build({}, k, merge);
            }
        }

        json = $.extend(true, json, merge);
    });

    return json;
};

var prototypeSel = "#element_prototypes";

function socket_request(url, data, responseField, options, redirect) {
    opts = _.merge({
        before: function() {},
        after: function() {}
    }, options || {});
    responseField.html('').removeClass('success failure');
    opts.before();
    socket.post(url, data, function(res) {
        responseField.html(res.message).addClass(res.status ? 'success' : 'failure');
        opts.after();
        if(redirect && res.status) { window.location.href = redirect };
    });
};

function preloader(visibility) {
    switch ( visibility ) {
        case 'show':
            var parentWidth = this.outerWidth();
            var parentHeight = this.outerHeight();
            $(prototypeSel).find(".preloader-wrap")
                .clone()
                .removeClass("prototype")
                .css({
                marginTop: -1 * parentHeight,
                height: parentHeight,
                width: parentWidth
            }).show().insertAfter(this);
            break;
        case 'hide':
            $(".preloader-wrap:not(.prototype)").remove();
            break;
        default:
            break;
    }
}
