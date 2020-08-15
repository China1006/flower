// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"scroll.js":[function(require,module,exports) {
var navBar = document.querySelector('.nav-bar');
var menu = document.querySelectorAll('.nav-bar li');
var scrollContainer = document.querySelector('body');
var needFixed = true; // 这是body的paddingTop，因为导航栏的offsetParent不是body，因为要减去body的paddingTop才能用来跟导航栏的offsetTop做比较

var extraFixed = -24; // 55 - 24：导航栏高度 - body的paddingTop
// 在不吸顶的情况下，导航指定的内容只要滚动到body顶部就算到了该内容了的导航了，即滚动了【内容的offsetTop + body的paddingTop】的距离
// 但是吸顶之后，只要滚动到吸顶导航栏底部就算到了指定导航内容了，所以相当于只要滚动【内容的offsetTop + body的paddingTop - 吸顶导航栏的高度】的距离就会到达临界值
// 转换成公式来理解，c代表导航内容的offsetTop，s代表滚动的距离，body的paddingTop为24，吸顶导航栏高度为55。只要滚动距离大于等于上面说的临界值，即肯定到达了对应导航。
// 因此公式为： s >= c + 24 - 55， 即 s + 31 >= c 时，到达条件成立，因此滚动容器的scrollTop都要加上31，才是拿来判断的值

var extraScroll = 31;
var offsetTops = {};
console.log(offsetTops);
var isSupportSticky = validateSticky();
calcTop(true);
scrollContainer.addEventListener('scroll', handleScroll);
window.addEventListener('resize', hanldeResize);
/**
 * 计算页面的各个offsetTop
 */

function calcTop(recalNav) {
  recalNav && (offsetTops.navBar = navBar.offsetTop);
  var contents = ['content1', 'content2', 'content3'];

  for (var j = 0; j < contents.length; j++) {
    offsetTops[contents[j]] = document.querySelector('.' + contents[j]).offsetTop;
  }
}
/**
 * 选择标题跳到对应内容
 */


x = function selectNav() {
  resetNavSelect();
  menu.className = 'active';
  scrollContainer.scrollTop = offsetTops[menu.getAttribute('data-content')] - extraScroll;
};
/**
 * 重置导航栏激活样式
 */


function resetNavSelect() {
  for (var i = 0; i < menu.length; i++) {
    menu[i].className = '';
  }
}
/**
 * 检查浏览器是否有支持的sticky值，没有返回false，有就添加sticky相关css，实现吸顶
 */


function validateSticky() {
  var supportStickyValue = valiateCssValue('position', 'sticky');

  if (supportStickyValue) {
    var navBarWrap = document.querySelector('.nav-bar-wrap');
    navBarWrap.style.position = supportStickyValue;
    navBarWrap.style.top = '-16px';
    return true;
  }

  return false;
}
/**
 * 监听滚动事件，实现吸顶和滚动导航
 */


function handleScroll() {
  var top = scrollContainer.scrollTop;
  var fixedBaseTop = top + extraScroll; // 这是吸顶之后用来做衡量的scrollTop

  var menuLength = menu.length;

  if (needFixed && !isSupportSticky) {
    // 这是控制导航栏吸顶 - 吸顶
    if (top + extraFixed >= offsetTops.navBar) {
      navBar.style.position = 'fixed';
      navBar.style.top = 0;
      navBar.style.left = '124px';
      navBar.style.width = '300px';
      navBar.style.height = '55px';
    } // 这是控制导航栏吸顶 - 取消吸顶


    if (top + extraFixed < offsetTops.navBar) {
      navBar.style.position = 'static';
      navBar.style.width = '100%';
      navBar.style.height = '100%';
    }
  }

  resetNavSelect(); // 滚动条到达底部就选中最后一个导航

  if (top + scrollContainer.clientHeight >= scrollContainer.scrollHeight) {
    menu[menuLength - 1].className = 'active';
    return;
  } // 以下都为依据滚动自动选择对应导航


  for (var i = 0; i < menuLength - 1; i++) {
    if (fixedBaseTop >= offsetTops['content' + (i + 1)] && fixedBaseTop < offsetTops['content' + (i + 2)]) {
      menu[i].className = 'active';
      return;
    }
  }

  if (fixedBaseTop >= offsetTops['content' + (menuLength - 1)]) {
    menu[menuLength - 1].className = 'active';
    return;
  }

  menu[0].className = 'active';
}
/**
 * 监听resize事件，变化时重新计算offsetTop
 */


function hanldeResize() {
  calcTop(true);
}
/**
 * 检查浏览器是否支持某个css属性值
 */


function valiateCssValue(key, value) {
  var prefix = ['-o-', '-ms-', '-moz-', '-webkit-', ''];
  var prefixValue = [];

  for (var i = 0; i < prefix.length; i++) {
    prefixValue.push(prefix[i] + value);
  }

  var element = document.createElement('div');
  var eleStyle = element.style;

  for (var j = 0; j < prefixValue.length; j++) {
    eleStyle[key] = prefixValue[j];
  }

  return eleStyle[key];
}
},{}],"../../AppData/Local/Yarn/Data/global/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57274" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../AppData/Local/Yarn/Data/global/node_modules/parcel/src/builtins/hmr-runtime.js","scroll.js"], null)
//# sourceMappingURL=/scroll.62f5c327.js.map