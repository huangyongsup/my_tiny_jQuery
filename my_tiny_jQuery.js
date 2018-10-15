//模仿并实现jQuery的部分功能
//IE8及以上可用
(function (window, undefined) {
    var push = Array.prototype.push;
    var slice = Array.prototype.slice;
    var splice = Array.prototype.splice;

    var NodeTypeError = function (message) {
        this.name = "NodeTypeError";
        this.message = message;
    };

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
    var isArray = function (obj) {
        //注释掉的部分在IE8中测试失败 error:对象不支持isArray()  不知道是为什么  明明用了'||'
        // return Array.isArray(obj) || Object.prototype.toString.call(obj) === "[object Array]";
        if(Array.isArray){
            return Array.isArray(obj);
        }else{
            return Object.prototype.toString.call(obj) === "[object Array]";
        }
    };
    var isWindow = function( obj ) {
        //window === window.window
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
    //IE8很奇怪，无法调用我重写的trim方法，只能向String.prototype里添加trim方法
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
                return jQuery();
            }else {
                return jQuery(this.get(num));
            }
        },
        first: function () {
            return this.eq(0);
        },
        last: function () {
            return this.eq(-1);
        },
        each: function (callback) {
            return jQuery.each(this, callback);
        },
        map: function (callback) {
            return jQuery.map(this, function (value, key) {
                return callback.call(value, key, value);
            });
        },
    };
    jQuery.prototype.init.prototype = jQuery.prototype;
    jQuery.extend = jQuery.prototype.extend = function(obj){
            for(var name in obj){
                this[name] = obj[name];
            }
    };
    //jQuery的拓展函数
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
            if(isArray(obj) || isArrayLike(obj)){
                for(var index = 0, len = obj.length; index < len; ++index){
                    //若回调函数返回false则终止，返回true则可跳过对当前值的回调处理
                    //将this值更改为obj中当前属性值即(key-value中的value值)
                    if(callback.call(obj[index], index, obj[index])=== false){
                        break;
                    }
                }
            }else if(isObject(obj)){
                for(var name in obj){
                    if(callback.call(obj[name], name, obj[name]) === false){
                        break;
                    }
                }
            }
            return obj;
        },
        map: function (obj, callback) {
            var arr = [];
            var result;
            if(isArray(obj) || isArrayLike(obj)){
                for(var index = 0, len = obj.length; index < len; ++index){
                    result = callback(obj[index], index);
                    if(result){
                        arr.push(result);
                    }
                }
            }else if(isObject(obj)){
                for(var name in obj){
                    result = callback(obj[name], name);
                    if(result){
                        arr.push(result);
                    }
                }
            }
            return arr;
        },
    });
    //jQuery.prototype的拓展函数
    //对DOM进行操作
    jQuery.prototype.extend({
        empty: function () {
           this.each(function (key, value) {
               if (value.nodeType === 1) {
                   value.innerHTML = "";
               }
           });
            return this;
        },
        remove: function (selector) {
            //未传入选择器时，将调用者全部删除
            if(arguments.length === 0){
                this.each(function (key, value) {
                    if(value.nodeType === 0){
                        value.parentNode.removeChild(value);
                    }
                });
            }else {
                //TODO
                console.log("尚未实现此功能");
            }
            return this;
        },
        html: function (content) {
            if(arguments.length === 0){
                if(this[0].nodeType === 1){
                    return this[0].innerHTML;
                }else {
                    throw new NodeTypeError("nodeType should be 1");
                }
            }else {
                this.each(function (key, value) {
                    if(value.nodeType === 1){
                        value.innerHTML = content;
                    }else {
                        throw new NodeTypeError("节点类型错误,应使用ELEMENT_NODE来调用此方法");
                    }
                })
            }
            return this;
        },
        text: function (content) {
            //TODO
            //此方法很多地方还不完善
            if(arguments.length === 0){
                var result = "";
                this.each(function (key, value) {
                    var nodeType = value.nodeType;
                    if(nodeType === 1 || nodeType === 9 || nodeType ===11){
                        result += value.textContent;
                    }else if(nodeType ===3 || nodeType ===4){
                        result += value.nodeValue;
                    }
                });
                return result;
            }else {
                this.empty().each(function () {
                    var nodeType = this.nodeType;
                    if(nodeType === 1 || nodeType === 9 || nodeType === 11){
                        this.textContent = content;
                    }
                });
            }
            return this;
        },
        appendTo: function (target) {

            return this;
        },
    });
    window.$ = jQuery;
})(window);