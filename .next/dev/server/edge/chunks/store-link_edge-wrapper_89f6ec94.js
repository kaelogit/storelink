(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/store-link_edge-wrapper_89f6ec94.js",
"[project]/store-link/edge-wrapper.js { MODULE => \"[project]/store-link/node_modules/next/dist/esm/build/templates/edge-app-route.js { INNER_ROUTE_ENTRY => \\\"[project]/store-link/node_modules/next/dist/esm/build/templates/app-route.js { INNER_APP_ROUTE => \\\\\\\"[project]/store-link/app/icon--route-entry.js [app-edge-route] (ecmascript)\\\\\\\" } [app-edge-route] (ecmascript)\\\" } [app-edge-route] (ecmascript)\" } [app-edge-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

self._ENTRIES ||= {};
const modProm = Promise.resolve().then(()=>__turbopack_context__.i('[project]/store-link/node_modules/next/dist/esm/build/templates/edge-app-route.js { INNER_ROUTE_ENTRY => "[project]/store-link/node_modules/next/dist/esm/build/templates/app-route.js { INNER_APP_ROUTE => \\"[project]/store-link/app/icon--route-entry.js [app-edge-route] (ecmascript)\\" } [app-edge-route] (ecmascript)" } [app-edge-route] (ecmascript)'));
modProm.catch(()=>{});
self._ENTRIES["middleware_app/icon/route"] = new Proxy(modProm, {
    get (modProm, name) {
        if (name === "then") {
            return (res, rej)=>modProm.then(res, rej);
        }
        let result = (...args)=>modProm.then((mod)=>(0, mod[name])(...args));
        result.then = (res, rej)=>modProm.then((mod)=>mod[name]).then(res, rej);
        return result;
    }
});
}),
]);

//# sourceMappingURL=store-link_edge-wrapper_89f6ec94.js.map