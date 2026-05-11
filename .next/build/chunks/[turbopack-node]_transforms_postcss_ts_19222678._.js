module.exports = [
"[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/storelink-app-and-web/store-link-storefront/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "chunks/6171c_c4090065._.js",
  "chunks/[root-of-the-server]__cea21604._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/storelink-app-and-web/store-link-storefront/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript)");
    });
});
}),
];