module.exports=[46925,e=>{"use strict";var t=e.i(25005),r=e.i(11181),o=e.i(56020),n=e.i(50345),a=e.i(21211),s=e.i(97760),i=e.i(31455),l=e.i(36517),d=e.i(16922),p=e.i(57026),c=e.i(80176),u=e.i(67045),f=e.i(3881),g=e.i(13764),h=e.i(78403),x=e.i(6175),y=e.i(93695);e.i(19079);var m=e.i(48551),b=e.i(53226),E=e.i(67123);let v=new b.Resend(process.env.RESEND_API_KEY);async function R(e){try{let{email:t,type:r,code:o,data:n}=await e.json();if(!process.env.RESEND_API_KEY)return E.NextResponse.json({error:"Server configuration error"},{status:500});let a="",s="#10b981",i="",l="",d="";if("VERIFY_SIGNUP"===r)a=`🏰 ${o} is your Storelink verification code`,i="VERIFY YOUR IDENTITY",l="Welcome to the inner circle. Use the secure code below to activate your storefront and begin your journey.",d=`
        <div style="background-color: #f9fafb; border-radius: 24px; padding: 32px; border: 2px dashed #e5e7eb; margin-bottom: 24px; text-align: center;">
          <span style="font-family: 'Courier New', Courier, monospace; font-size: 48px; font-weight: 900; letter-spacing: 12px; color: #111827;">${o}</span>
        </div>
        <p style="margin: 0 0 32px 0; font-size: 11px; font-weight: 800; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; text-align: center;">Expires in 15 minutes</p>

        <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 20px; padding: 24px; text-align: left;">
          <p style="margin: 0 0 10px 0; font-size: 10px; font-weight: 800; color: #b45309; text-transform: uppercase; letter-spacing: 0.1em;">🛡️ IMPORTANT: DON'T MISS SALES</p>
          <p style="margin: 0; font-size: 13px; color: #92400e; line-height: 1.5; font-weight: 500;">
            To ensure you receive <strong>Instant Sale Alerts</strong> and <strong>Customer Manifests</strong>, please mark this email as <strong>"Not Spam"</strong> or move it to your <strong>Primary Inbox</strong> right now. 
            <br/><br/>
            This ensures important StoreLink emails reach your inbox.
          </p>
        </div>
      `;else if("PASSWORD_RESET"===r)a=`🔒 ${o} is your password reset code`,i="PASSWORD RESET",l="Security matters. Use the secure code below to update your access credentials.",s="#f59e0b",d=`
        <div style="background-color: #f9fafb; border-radius: 24px; padding: 32px; border: 2px dashed #e5e7eb; margin-bottom: 32px; text-align: center;">
          <span style="font-family: 'Courier New', Courier, monospace; font-size: 48px; font-weight: 900; letter-spacing: 12px; color: #111827;">${o}</span>
        </div>
      `;else if("WELCOME_DAY_1"===r)a=`🏰 Welcome to the Inner Circle, Founder!`,i="YOU ARE LIVE",l=`Your storefront <strong>${n.storeName}</strong> is live on StoreLink. 
      <br/><br/>
      <strong>The workflow:</strong> You share your link, buyers checkout in-app, and you fulfill with a clean order record. Simple. Professional. Scalable.`,d=`
        <div style="text-align:center; margin-bottom: 30px;">
          <a href="https://storelink.ng/dashboard" style="display: inline-block; background:#10b981; color:#fff; padding:18px 36px; border-radius:16px; text-decoration:none; font-weight:bold; text-transform:uppercase; font-size:12px;">Enter My Dashboard</a>
        </div>
        
        <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 20px; padding: 24px; text-align: left;">
          <p style="margin: 0 0 10px 0; font-size: 10px; font-weight: 800; color: #b45309; text-transform: uppercase; letter-spacing: 0.1em;">🛡️ ACTION REQUIRED: SECURE YOUR SALE ALERTS</p>
          <p style="margin: 0; font-size: 13px; color: #92400e; line-height: 1.5; font-weight: 500;">
            To ensure you never miss an <strong>Order Manifest</strong> or <strong>Payment Notification</strong>, please do this now:
            <br/><br/>
            1. <strong>Move to Primary:</strong> If this is in your 'Promotions' tab, drag it to 'Primary'.<br/>
            2. <strong>Mark as Safe:</strong> Click the three dots (⋮) and select <strong>'Not Spam'</strong> or <strong>'Add to Contacts'</strong>.
            <br/><br/>
            This ensures the StoreLink Engine can reach you the moment a customer wants to pay.
          </p>
        </div>
      `;else if("PRODUCT_NUDGE"===r||"WELCOME_DAY_3"===r)a=`🚀 Expand your warehouse, ${n?.storeName||"Founder"}!`,i="THE 15-PRODUCT SECRET",l=`Your warehouse currently has ${n?.count||0} products. Data shows that founders with <strong>15+ products</strong> generate 3x more revenue. A full store builds instant trust. Stock up today to dominate your niche.`,d=`
        <div style="text-align: center;">
          <a href="https://storelink.ng/dashboard" style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 18px 36px; border-radius: 16px; text-decoration: none; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px;">Upload Products</a>
        </div>
      `;else if("EXPIRY_REMINDER"===r){let e=n?.daysLeft<=3;a=`${e?"⚠️ FINAL NOTICE":"📅 SUBSCRIPTION STATUS"}: Plan expiring`,n?.daysLeft,i=e?"ACTION REQUIRED: RENEWAL":"SUBSCRIPTION STATUS",l=`Your access for <strong>${n?.storeName}</strong> expires in ${n?.daysLeft} days. To prevent your link from breaking and losing customers, please go to <strong>Dashboard > Subscription</strong> to renew your plan.`,s=e?"#ef4444":"#f59e0b",d=`
        <div style="text-align: center;">
          <a href="https://storelink.ng/dashboard/subscription" style="display: inline-block; background-color: ${s}; color: #ffffff; padding: 18px 36px; border-radius: 16px; text-decoration: none; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px;">Renew My Access</a>
        </div>
      `}else if("WELCOME_DAY_1"===r)a=`🏰 Welcome to the Inner Circle, Founder!`,i="YOU ARE LIVE",l=`Your storefront <strong>${n.storeName}</strong> is live on StoreLink. 
      <br/><br/>
      <strong>The workflow:</strong> You share your link, buyers checkout in-app, and you fulfill with a clean order record. Simple. Professional. Scalable.`,d=`
        <div style="text-align:center; margin-bottom: 30px;">
          <a href="https://storelink.ng/dashboard" style="display: inline-block; background:#10b981; color:#fff; padding:18px 36px; border-radius:16px; text-decoration:none; font-weight:bold; text-transform:uppercase; font-size:12px;">Enter My Dashboard</a>
        </div>
        
        <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 20px; padding: 24px; text-align: left;">
          <p style="margin: 0 0 10px 0; font-size: 10px; font-weight: 800; color: #b45309; text-transform: uppercase; letter-spacing: 0.1em;">🛡️ SECURE YOUR SALE ALERTS</p>
          <p style="margin: 0; font-size: 13px; color: #92400e; line-height: 1.5; font-weight: 500;">
            To ensure you receive your <strong>Sale Manifests</strong> and <strong>Growth Tips</strong>, please mark this email as <strong>"Not Spam"</strong> or drag it to your <strong>Primary Inbox</strong>. This tells your email provider that you are a serious Founder.
          </p>
        </div>
      `;else if("WELCOME_DAY_5"===r)a="⚡ The Power of the Flash Drop",i="CREATE A SURGE",l="Ever want to clear stock in minutes? The <strong>Flash Drop</strong> feature creates an automated countdown on your store. It forces customers to act NOW. Use it for weekend sales or limited arrivals.",d='<div style="text-align:center;"><a href="https://storelink.ng/dashboard" style="display: inline-block; background:#ef4444; color:#fff; padding:18px 36px; border-radius:16px; text-decoration:none; font-weight:900; font-size:12px; text-transform:uppercase; letter-spacing:0.1em;">Setup My First Drop using the flash icon in dashboard</a></div>';else if("WELCOME_DAY_7"===r)a="🪙 The Store Coin advantage",i="REWARD YOUR LOYALS",l=`StoreLink isn't just a link; it's an ecosystem. When customers buy from the marketplace, they earn <strong>Store Coins</strong>. They can spend those coins as discounts in YOUR store—bringing repeat buyers back to you.`,d='<div style="text-align:center;"><a href="https://storelink.ng/dashboard/loyalty" style="display: inline-block; background:#f59e0b; color:#fff; padding:18px 36px; border-radius:16px; text-decoration:none; font-weight:900; font-size:12px; text-transform:uppercase; letter-spacing:0.1em;">Check Loyalty Settings</a></div>';else if("WELCOME_DAY_10"===r)a="💎 Why the Greats go Diamond",i="SCALE YOUR STOREFRONT",l=`The <strong>Diamond Plan</strong> is designed for the top 1% of vendors. You get priority placement in the Marketplace, access to <strong>AI Background Removal</strong>, and the ability to verify your store with the <strong>"Diamond Badge."</strong> Don't just sell—dominate.`,d='<div style="text-align:center;"><a href="https://storelink.ng/dashboard/subscription" style="display: inline-block; background:#111827; color:#fff; padding:18px 36px; border-radius:16px; text-decoration:none; font-weight:900; font-size:12px; text-transform:uppercase; letter-spacing:0.1em;">See Diamond Benefits</a></div>';else if("WELCOME_DAY_13"===r)a="💎 Ready to scale visibility for your storefront?",i="STANDARD IS FREE — DIAMOND BOOSTS YOU",l=`Your storefront <strong>${n.storeName}</strong> stays online on Standard at no cost. If you want higher marketplace visibility and Diamond-only tools, you can upgrade anytime—no trial countdown, no forced expiry on your link.`,d='<div style="text-align:center;"><a href="https://storelink.ng/dashboard/subscription" style="display: inline-block; background:#ef4444; color:#fff; padding:18px 36px; border-radius:16px; text-decoration:none; font-weight:900; font-size:12px; text-transform:uppercase; letter-spacing:0.1em;">See Diamond benefits</a></div>';else if("RESCUE_DAY_14"===r)a="📢 Where is your link? Let's get your first sale!",i="THE VISIBILITY GAP",l=`Your store is ready, but your customers might not know where to find it. 
      <br/><br/>
      <strong>The Founder's Checklist:</strong><br/>
      • <strong>Instagram:</strong> Put your link in your Bio.<br/>
      • <strong>Status &amp; Stories:</strong> Share your storefront link where your buyers already scroll.<br/>
      • <strong>TikTok:</strong> Add your link to your profile and mention it in every video.<br/>
      Don't let your storefront sit invisible. Share the link now.`,d='<div style="text-align:center;"><a href="https://storelink.ng/dashboard" style="display: inline-block; background:#111827; color:#fff; padding:18px 36px; border-radius:16px; text-decoration:none; font-weight:900; font-size:12px; text-transform:uppercase; letter-spacing:0.1em;">Copy My Link</a></div>';else if("SUBSCRIBER_PULSE"===r){let e=[{t:"The Power of Content",d:"Record a 'Pack an order with me' video for TikTok or IG Reels. Seeing the human side of your brand builds 10x more trust than a static photo."},{t:"Flash Drop Urgency",d:"Running a weekend sale? Use the <strong>Flash Drop</strong> feature to add a live countdown. Urgency is the fastest way to turn 'lookers' into 'buyers'."},{t:"The Review Loop",d:"When you mark an order as complete, ask your customer for a public shoutout or review. It’s free, high-trust marketing that scales your link."},{t:"Store Coin retention",d:"Make sure your Loyalty Settings are active. When customers earn <strong>Store Coins</strong> in your store, they are financially incentivized to come back to you."}],t=e[Math.floor(Math.random()*e.length)];a=`💎 Growth tip: ${t.t}`,i="SCALING YOUR STORE",l=t.d,d=`
        <div style="text-align:center;">
          <a href="https://storelink.ng/dashboard" style="display: inline-block; background:#111827; color:#fff; padding:18px 36px; border-radius:16px; text-decoration:none; font-weight:900; font-size:12px; text-transform:uppercase; letter-spacing:0.1em;">Open My Dashboard</a>
        </div>
      `}else if("CHECKOUT_ALERT"===r){let e=Array.isArray(n?.productName)?n.productName:[n?.productName],t=e.length>1;a=`💰 NEW SALE INTENT: ${t?e.length+" Items":e[0]}!`,i="YOU HAVE A LEAD! 🚀",l=`A customer has just initiated a checkout for <strong>${t?e.length+" items":e[0]}</strong>. 
      <br/><br/>
      <strong style="color: #111827;">✅ NEXT STEPS:</strong><br/>
      1. Confirm payment and availability in <strong>Dashboard &gt; Orders</strong>.<br/>
      2. Fulfill and update status so your buyer sees progress in-app.<br/>
      3. Mark the order as <strong>"Complete"</strong>. This generates a professional digital receipt for your buyer automatically.`;let r=e.map(e=>`
        <div style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 14px; font-weight: 700; text-align: left;">
          • ${e}
        </div>
      `).join("");d=`
        <div style="background-color: #f9fafb; border-radius: 24px; padding: 24px; border: 1px solid #e5e7eb; margin-bottom: 32px;">
          <p style="margin: 0 0 10px 0; font-size: 10px; font-weight: 800; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; text-align: left;">Items in Cart:</p>
          ${r}
        </div>
        <div style="text-align: center;">
           <a href="https://storelink.ng/dashboard/orders" style="display: inline-block; background-color: #111827; color: #ffffff; padding: 18px 36px; border-radius: 16px; text-decoration: none; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Manage Orders</a>
        </div>
      `}let p=`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 500px; background-color: #ffffff; border-radius: 32px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); border: 1px solid #f3f4f6;">
                  <tr>
                    <td align="center" style="padding: 40px 40px 20px 40px;">
                      <h1 style="margin: 0; font-size: 22px; font-weight: 900; color: #111827; letter-spacing: -0.05em; text-transform: uppercase;">
                        STORELINK
                      </h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 0 40px 40px 40px; text-align: center;">
                      <div style="height: 1px; background-color: #f3f4f6; margin-bottom: 30px;"></div>
                      <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 800; color: #111827; text-transform: uppercase; letter-spacing: 0.1em;">${i}</h2>
                      <p style="margin: 0 0 32px 0; font-size: 14px; line-height: 1.6; color: #6b7280; font-weight: 500;">${l}</p>
                      ${d}
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #111827; padding: 24px; text-align: center;">
                      <p style="margin: 0; font-size: 10px; font-weight: 800; color: #ffffff; text-transform: uppercase; letter-spacing: 0.2em;">&copy; 2026 Storelink Engine • Lagos, Nigeria</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,{data:c,error:u}=await v.emails.send({from:"Storelink <hello@storelink.ng>",to:t,subject:a,html:p});if(u)return E.NextResponse.json({error:u},{status:400});return E.NextResponse.json({success:!0,id:c?.id})}catch(e){return E.NextResponse.json({error:"Internal Server Error"},{status:500})}}e.s(["POST",()=>R],90222);var k=e.i(90222);let w=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/send-email/route",pathname:"/api/send-email",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/storelink-app-and-web/store-link-storefront/app/api/send-email/route.ts",nextConfigOutput:"",userland:k}),{workAsyncStorage:S,workUnitAsyncStorage:T,serverHooks:A}=w;function C(){return(0,o.patchFetch)({workAsyncStorage:S,workUnitAsyncStorage:T})}async function N(e,t,o){w.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let b="/api/send-email/route";b=b.replace(/\/index$/,"")||"/";let E=await w.prepare(e,t,{srcPage:b,multiZoneDraftMode:!1});if(!E)return t.statusCode=400,t.end("Bad Request"),null==o.waitUntil||o.waitUntil.call(o,Promise.resolve()),null;let{buildId:v,params:R,nextConfig:k,parsedUrl:S,isDraftMode:T,prerenderManifest:A,routerServerContext:C,isOnDemandRevalidate:N,revalidateOnlyGenerated:O,resolvedPathname:I,clientReferenceManifest:D,serverActionsManifest:P}=E,U=(0,l.normalizeAppPath)(b),_=!!(A.dynamicRoutes[U]||A.routes[I]),L=async()=>((null==C?void 0:C.render404)?await C.render404(e,t,S,!1):t.end("This page could not be found"),null);if(_&&!T){let e=!!A.routes[I],t=A.dynamicRoutes[U];if(t&&!1===t.fallback&&!e){if(k.experimental.adapterPath)return await L();throw new y.NoFallbackError}}let M=null;!_||w.isDev||T||(M="/index"===(M=I)?"/":M);let Y=!0===w.isDev||!_,$=_&&!Y;P&&D&&(0,s.setReferenceManifestsSingleton)({page:b,clientReferenceManifest:D,serverActionsManifest:P,serverModuleMap:(0,i.createServerModuleMap)({serverActionsManifest:P})});let z=e.method||"GET",F=(0,a.getTracer)(),W=F.getActiveScopeSpan(),H={params:R,prerenderManifest:A,renderOpts:{experimental:{authInterrupts:!!k.experimental.authInterrupts},cacheComponents:!!k.cacheComponents,supportsDynamicResponse:Y,incrementalCache:(0,n.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:k.cacheLife,waitUntil:o.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,o)=>w.onRequestError(e,t,o,C)},sharedContext:{buildId:v}},j=new d.NodeNextRequest(e),B=new d.NodeNextResponse(t),q=p.NextRequestAdapter.fromNodeNextRequest(j,(0,p.signalFromNodeResponse)(t));try{let s=async e=>w.handle(q,H).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=F.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==c.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let o=r.get("next.route");if(o){let t=`${z} ${o}`;e.setAttributes({"next.route":o,"http.route":o,"next.span_name":t}),e.updateName(t)}else e.updateName(`${z} ${b}`)}),i=!!(0,n.getRequestMeta)(e,"minimalMode"),l=async n=>{var a,l;let d=async({previousCacheEntry:r})=>{try{if(!i&&N&&O&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let a=await s(n);e.fetchMetrics=H.renderOpts.fetchMetrics;let l=H.renderOpts.pendingWaitUntil;l&&o.waitUntil&&(o.waitUntil(l),l=void 0);let d=H.renderOpts.collectedTags;if(!_)return await (0,f.sendResponse)(j,B,a,H.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),t=(0,g.toNodeOutgoingHttpHeaders)(a.headers);d&&(t[x.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==H.renderOpts.collectedRevalidate&&!(H.renderOpts.collectedRevalidate>=x.INFINITE_CACHE)&&H.renderOpts.collectedRevalidate,o=void 0===H.renderOpts.collectedExpire||H.renderOpts.collectedExpire>=x.INFINITE_CACHE?void 0:H.renderOpts.collectedExpire;return{value:{kind:m.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:o}}}}catch(t){throw(null==r?void 0:r.isStale)&&await w.onRequestError(e,t,{routerKind:"App Router",routePath:b,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:$,isOnDemandRevalidate:N})},C),t}},p=await w.handleResponse({req:e,nextConfig:k,cacheKey:M,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:A,isRoutePPREnabled:!1,isOnDemandRevalidate:N,revalidateOnlyGenerated:O,responseGenerator:d,waitUntil:o.waitUntil,isMinimalMode:i});if(!_)return null;if((null==p||null==(a=p.value)?void 0:a.kind)!==m.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==p||null==(l=p.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});i||t.setHeader("x-nextjs-cache",N?"REVALIDATED":p.isMiss?"MISS":p.isStale?"STALE":"HIT"),T&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,g.fromNodeOutgoingHttpHeaders)(p.value.headers);return i&&_||c.delete(x.NEXT_CACHE_TAGS_HEADER),!p.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,h.getCacheControlHeader)(p.cacheControl)),await (0,f.sendResponse)(j,B,new Response(p.value.body,{headers:c,status:p.value.status||200})),null};W?await l(W):await F.withPropagatedContext(e.headers,()=>F.trace(c.BaseServerSpan.handleRequest,{spanName:`${z} ${b}`,kind:a.SpanKind.SERVER,attributes:{"http.method":z,"http.target":e.url}},l))}catch(t){if(t instanceof y.NoFallbackError||await w.onRequestError(e,t,{routerKind:"App Router",routePath:U,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:$,isOnDemandRevalidate:N})}),_)throw t;return await (0,f.sendResponse)(j,B,new Response(null,{status:500})),null}}e.s(["handler",()=>N,"patchFetch",()=>C,"routeModule",()=>w,"serverHooks",()=>A,"workAsyncStorage",()=>S,"workUnitAsyncStorage",()=>T],46925)}];

//# sourceMappingURL=6171c_next_dist_esm_build_templates_app-route_06ab5141.js.map