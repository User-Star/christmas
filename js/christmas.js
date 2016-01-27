/**
 * Created by Summer on 2016/1/26.
 */

/**
 * 切换页面
 * 模拟镜头效果
 * @return {[type]} [description]
 */
function changePage(element,effect,callback){
    element
        .addClass(effect)
        .one("animationend webkitAnimationEnd", function() {
            callback && callback();
        })
}
/**
 * 事件
 * 观察者模式
 */
var Observer = (function(slice) {

    function bind(event, fn) {
        var events = this.events = this.events || {},
            parts = event.split(/\s+/),
            i = 0,
            num = parts.length,
            part;

        if (events[event] && events[event].length) return this;

        for (; i < num; i++) {
            events[(part = parts[i])] = events[part] || [];
            events[part].push(fn);
        }
        return this;
    }

    function one(event, fn) {
        this.bind(event, function fnc() {
            fn.apply(this, slice.call(arguments));
            this.unbind(event, fnc);
        });
        return this;
    }

    function unbind(event, fn) {
        var events = this.events,
            eventName, i, parts, num;

        if (!events) return;

        parts = event.split(/\s+/);
        for (i = 0, num = parts.length; i < num; i++) {
            if ((eventName = parts[i]) in events !== false) {
                events[eventName].splice(events[eventName].indexOf(fn), 1);
                if (!events[eventName].length) { //修正没有事件直接删除空数组
                    delete events[eventName];
                }
            }
        }
        return this;
    }

    function trigger(event) {
        var events = this.events,
            i, args, falg;

        if (!events || event in events === false) return;

        args = slice.call(arguments, 1);
        for (i = events[event].length - 1; i >= 0; i--) {
            falg = events[event][i].apply(this, args);
        }
        return falg; //修正带返回
    }

    return function() {
        this.on =
            this.subscribe = bind;
        this.off =
            this.unsubscribe = unbind;
        this.trigger =
            this.publish = trigger;
        this.one = one;
        return this;
    };
})([].slice);


/**
 * 背景音乐
 * @param {[type]} url  [description]
 * @param {[type]} loop [description]
 */
function HTML5Audio(url, loop) {
    var audio = new Audio(url);
    audio.autoplay = true;
    audio.loop = loop || false; //是否循环
    audio.play();
    return {
        end: function(callback) {
            audio.addEventListener('ended', function() {
                callback()
            }, false);
        }
    }
}


/**
 * 中间调用
 */
var Christmas = function() {
    //页面容器元素
    var $pageA = $(".page-a");
    var $pageB = $(".page-b");
    var $pageC = $(".page-c");

    //切换切换
   /* $("#choose").on("change", function(e) {
     //页面名称
     var pageName = e.target.value;
     switch (pageName) {
     case "page-b":
     //切换到页面B，然后捕获到切换后的通知
     changePage($pageA, "effect-out", function() {
     new pageB()
     })
     break;
     case "page-c":
     //切换到页面C，然后捕获到切换后的通知
     changePage($pageC, "effect-in", function() {
     new pageC()
     })
     break;
     }
     })*/
    //观察着模式
    //观察者
    var observer = new Observer();

    //A场景页面
    new pageA($pageA);
   /* new pageA(function() {
        observer.publish("completeA");
    });*/
    //进入B场景
    observer.subscribe("pageB", function() {
        new pageB(function() {
            observer.publish("completeB");
        })
    });
    //进入C场景
    observer.subscribe("pageC", function() {
        new pageC()
    });


    //页面A-B场景切换
    observer.subscribe("completeA", function() {
        changePage($pageA, "effect-out", function() {
            observer.publish("pageB");
        })
    });
    //页面B-C场景切换
    observer.subscribe("completeB",function(){
        changePage($pageC,"effect-in",function(){
            observer.publish("pageC") ;
        })
    });
};

$(function() {
    //圣诞主题效果，开始
    Christmas()
});







