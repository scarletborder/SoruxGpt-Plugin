// ==UserScript==
// @name         gmCookie
// @author       cxxjackie
// @version      1.0.1
// ==/UserScript==

function gmCookie(url) {
    if (!window.GM_cookie) return console.error('缺少GM_cookie，请先通过@grant引入！');
    return new Promise((resolve, reject) => {
        GM_cookie('list', { url }, (cookie, error) => {
            if (error || !Array.isArray(cookie)) {
                reject(error);
            } else {
                const promises = [];
                async function alldone() {
                    await Promise.all(promises);
                    promises.length = 0;
                }
                function proxySet(target, prop, value) {
                    if (prop !== 'name' && target[prop] !== value) {
                        promises.push(new Promise(resolve => {
                            GM_cookie('set', { ...target, url }, resolve);
                        }));
                        target[prop] = value;
                    }
                }
                const cookieObj = { $alldone: alldone };
                for (const item of cookie) {
                    cookieObj[item.name] = new Proxy(item, { set: proxySet });
                }
                resolve(new Proxy(cookieObj, {
                    set: function (target, prop, value) {
                        value.name = prop;
                        promises.push(new Promise(resolve => {
                            GM_cookie('set', { ...value, url }, resolve);
                        }));
                        target[prop] = new Proxy(value, { set: proxySet });
                    },
                    deleteProperty: function (target, prop) {
                        promises.push(new Promise(resolve => {
                            GM_cookie('delete', { ...target[prop], url }, resolve);
                        }));
                        return delete target[prop];
                    }
                }));
            }
        });
    });
}

const originFetch = fetch;

