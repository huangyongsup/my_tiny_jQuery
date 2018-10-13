//模仿实现jQuery的部分功能
(function (window, undefined) {
    var push = Array.prototype.push;
    var slice = Array.prototype.slice;
    var splice = Array.prototype.splice;

    var isFunction = function (obj) {
        //某些浏览器在对DOM节点<object>使用typeof时返回true
        return typeof obj === "function" && typeof obj.nodeType !== "number";
    };
    var isString = function (str) {
        return typeof str === "string";
    };
    var isHTML = function (str) {
        var len = str.length;
        return (len > 2 && str.charAt(0) === "<" && str.charAt(len - 1) === ">");
    };
    var isArray = function (str) {
        // return Array.isArray(str) || Object.prototype.toString.call(str) === "[object Array]";
        if(Array.isArray){
            return Array.isArray(str);
        }else{
            return Object.prototype.toString.call(str) === "[object Array]";
        }
    };
    var isWindow = function( obj ) {
        return obj != null && obj === obj.window;
    };
    var isArrayLike = function (obj) {
        return typeof obj === "object" && !isWindow(obj) && "length" in obj;
    };
    var isObject = function (obj) {
        return Object.prototype.toString.call(obj) === "[object Object]";
    };
    var trim = function () {
        if (!String.prototype.trim) {
            String.prototype.trim = function () {
                return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
            };
        }
        return String.prototype.trim;
    };
    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        };
    }

    var jQuery = function (selector) {
        return new jQuery.prototype.init(selector);
    };
    jQuery.prototype = {
        construct: jQuery,
        version: "my_tiny_jquery-1.0.0",
        length: 0,
        push: push,
        slice: slice,
        splice: splice,
        init: function (selector) {
            if(!selector){
                return this;
            }else if(isString(selector)){
                    selector = selector.trim();
                    if(isHTML(selector)){
                        //创建一个临时节点，将输入的代码片段插入临时节点中
                        var tempElement = document.createElement("div");
                        tempElement.innerHTML = selector;
                        push.apply(this, tempElement.children);
                    }else{
                        //根据选择器查询节点
                        var result = document.querySelectorAll(selector);
                        push.apply(this, result);
                    }
            }else if(isArray(selector)){
                push.apply(this, selector);
            }else if (isArrayLike(selector)){
                push.apply(this, slice.call(selector));
            } else if(isFunction(selector)){
                jQuery.ready(selector);
            }else{
                this[0] = selector;
                this.length = 1;
            }
            return this;
        },
        toArray: function () {
            return slice.call(this);
        },
        get: function (num) {
            // switch(num){
            //     case arguments.length === 0:
            //         return this.toArray();
            //     case (num >= 0 && num < this.length):
            //         return this[num];
            //     case num < 0:
            //         return this[num + this.length];
            //     default:
            //         return undefined;
            // }
            if(arguments.length === 0){
                return this.toArray();
            }else if(num >= 0 && num < this.length){
                return this[num];
            }else if(num < 0){
                return this[num + this.length];
            }else {
                return undefined;
            }
        },
        eq: function (num) {
            if(arguments.length === 0){
                return new jQuery();
            }else {
                return new jQuery(this.get(num));
            }
        },
        first: function () {
            return this.eq(0);
        },
        last: function () {
            return this.eq(-1);
        },
        each: function (callback) {
            jQuery.each(this, callback);
        },
    };
    jQuery.prototype.init.prototype = jQuery.prototype;
    jQuery.extend = jQuery.prototype.extend = function(obj){
            for(var name in obj){
                this[name] = obj[name];
            }
    };
    jQuery.extend({
        isString: isString,
        isHTML: isHTML,
        isArray: isArray,
        isWindow: isWindow,
        isArrayLike: isArray,
        isFunction: isFunction,
        trim: trim,
        ready: function (callback) {
            if(document.addEventListener){
                document.addEventListener("DOMContentLoaded", function () {
                    callback();
                })
            } else{
                document.attachEvent("onreadystatechange", function () {
                    if(document.readyState === "complete"){
                        callback();
                    }
                })
            }
        },
        each: function (obj, callback) {
            var result;
            if(isArray(obj) || isArrayLike(obj)){
                for(var index = 0, len = obj.length; index < len; ++index){
                    result = callback.call(obj[index], index, obj[index]);
                    if(result === true){
                        continue;
                    }else if(result === false){
                        break;
                    }
                }
            }
            if(isObject(obj) && !isArrayLike(obj)){
                for(var name in obj){
                    result = callback.call(obj[name], name, obj[name]);
                    if(result === true){
                        continue;
                    }else if(result === false){
                        break;
                    }
                }
            }
        },
        map: function (obj, callback) {

        },
    });
    window.$ = jQuery;
})(window);