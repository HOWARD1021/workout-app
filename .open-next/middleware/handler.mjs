
import {Buffer} from "node:buffer";
globalThis.Buffer = Buffer;

import {AsyncLocalStorage} from "node:async_hooks";
globalThis.AsyncLocalStorage = AsyncLocalStorage;


const defaultDefineProperty = Object.defineProperty;
Object.defineProperty = function(o, p, a) {
  if(p=== '__import_unsupported' && Boolean(globalThis.__import_unsupported)) {
    return;
  }
  return defaultDefineProperty(o, p, a);
};

  
  
  globalThis.openNextDebug = false;globalThis.openNextVersion = "3.9.15";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/@opennextjs/aws/dist/utils/error.js
function isOpenNextError(e) {
  try {
    return "__openNextInternal" in e;
  } catch {
    return false;
  }
}
var init_error = __esm({
  "node_modules/@opennextjs/aws/dist/utils/error.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/adapters/logger.js
function debug(...args) {
  if (globalThis.openNextDebug) {
    console.log(...args);
  }
}
function warn(...args) {
  console.warn(...args);
}
function error(...args) {
  if (args.some((arg) => isDownplayedErrorLog(arg))) {
    return debug(...args);
  }
  if (args.some((arg) => isOpenNextError(arg))) {
    const error2 = args.find((arg) => isOpenNextError(arg));
    if (error2.logLevel < getOpenNextErrorLogLevel()) {
      return;
    }
    if (error2.logLevel === 0) {
      return console.log(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    if (error2.logLevel === 1) {
      return warn(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    return console.error(...args);
  }
  console.error(...args);
}
function getOpenNextErrorLogLevel() {
  const strLevel = process.env.OPEN_NEXT_ERROR_LOG_LEVEL ?? "1";
  switch (strLevel.toLowerCase()) {
    case "debug":
    case "0":
      return 0;
    case "error":
    case "2":
      return 2;
    default:
      return 1;
  }
}
var DOWNPLAYED_ERROR_LOGS, isDownplayedErrorLog;
var init_logger = __esm({
  "node_modules/@opennextjs/aws/dist/adapters/logger.js"() {
    init_error();
    DOWNPLAYED_ERROR_LOGS = [
      {
        clientName: "S3Client",
        commandName: "GetObjectCommand",
        errorName: "NoSuchKey"
      }
    ];
    isDownplayedErrorLog = (errorLog) => DOWNPLAYED_ERROR_LOGS.some((downplayedInput) => downplayedInput.clientName === errorLog?.clientName && downplayedInput.commandName === errorLog?.commandName && (downplayedInput.errorName === errorLog?.error?.name || downplayedInput.errorName === errorLog?.error?.Code));
  }
});

// node_modules/cookie/dist/index.js
var require_dist = __commonJS({
  "node_modules/cookie/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseCookie = parseCookie;
    exports.parse = parseCookie;
    exports.stringifyCookie = stringifyCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    exports.parseSetCookie = parseSetCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    var cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
    var cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
    var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
    var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
    var maxAgeRegExp = /^-?\d+$/;
    var __toString = Object.prototype.toString;
    var NullObject = /* @__PURE__ */ (() => {
      const C = function() {
      };
      C.prototype = /* @__PURE__ */ Object.create(null);
      return C;
    })();
    function parseCookie(str, options) {
      const obj = new NullObject();
      const len = str.length;
      if (len < 2)
        return obj;
      const dec = options?.decode || decode;
      let index = 0;
      do {
        const eqIdx = eqIndex(str, index, len);
        if (eqIdx === -1)
          break;
        const endIdx = endIndex(str, index, len);
        if (eqIdx > endIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        const key = valueSlice(str, index, eqIdx);
        if (obj[key] === void 0) {
          obj[key] = dec(valueSlice(str, eqIdx + 1, endIdx));
        }
        index = endIdx + 1;
      } while (index < len);
      return obj;
    }
    function stringifyCookie(cookie, options) {
      const enc = options?.encode || encodeURIComponent;
      const cookieStrings = [];
      for (const name of Object.keys(cookie)) {
        const val = cookie[name];
        if (val === void 0)
          continue;
        if (!cookieNameRegExp.test(name)) {
          throw new TypeError(`cookie name is invalid: ${name}`);
        }
        const value = enc(val);
        if (!cookieValueRegExp.test(value)) {
          throw new TypeError(`cookie val is invalid: ${val}`);
        }
        cookieStrings.push(`${name}=${value}`);
      }
      return cookieStrings.join("; ");
    }
    function stringifySetCookie(_name, _val, _opts) {
      const cookie = typeof _name === "object" ? _name : { ..._opts, name: _name, value: String(_val) };
      const options = typeof _val === "object" ? _val : _opts;
      const enc = options?.encode || encodeURIComponent;
      if (!cookieNameRegExp.test(cookie.name)) {
        throw new TypeError(`argument name is invalid: ${cookie.name}`);
      }
      const value = cookie.value ? enc(cookie.value) : "";
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`argument val is invalid: ${cookie.value}`);
      }
      let str = cookie.name + "=" + value;
      if (cookie.maxAge !== void 0) {
        if (!Number.isInteger(cookie.maxAge)) {
          throw new TypeError(`option maxAge is invalid: ${cookie.maxAge}`);
        }
        str += "; Max-Age=" + cookie.maxAge;
      }
      if (cookie.domain) {
        if (!domainValueRegExp.test(cookie.domain)) {
          throw new TypeError(`option domain is invalid: ${cookie.domain}`);
        }
        str += "; Domain=" + cookie.domain;
      }
      if (cookie.path) {
        if (!pathValueRegExp.test(cookie.path)) {
          throw new TypeError(`option path is invalid: ${cookie.path}`);
        }
        str += "; Path=" + cookie.path;
      }
      if (cookie.expires) {
        if (!isDate(cookie.expires) || !Number.isFinite(cookie.expires.valueOf())) {
          throw new TypeError(`option expires is invalid: ${cookie.expires}`);
        }
        str += "; Expires=" + cookie.expires.toUTCString();
      }
      if (cookie.httpOnly) {
        str += "; HttpOnly";
      }
      if (cookie.secure) {
        str += "; Secure";
      }
      if (cookie.partitioned) {
        str += "; Partitioned";
      }
      if (cookie.priority) {
        const priority = typeof cookie.priority === "string" ? cookie.priority.toLowerCase() : void 0;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError(`option priority is invalid: ${cookie.priority}`);
        }
      }
      if (cookie.sameSite) {
        const sameSite = typeof cookie.sameSite === "string" ? cookie.sameSite.toLowerCase() : cookie.sameSite;
        switch (sameSite) {
          case true:
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError(`option sameSite is invalid: ${cookie.sameSite}`);
        }
      }
      return str;
    }
    function parseSetCookie(str, options) {
      const dec = options?.decode || decode;
      const len = str.length;
      const endIdx = endIndex(str, 0, len);
      const eqIdx = eqIndex(str, 0, endIdx);
      const setCookie = eqIdx === -1 ? { name: "", value: dec(valueSlice(str, 0, endIdx)) } : {
        name: valueSlice(str, 0, eqIdx),
        value: dec(valueSlice(str, eqIdx + 1, endIdx))
      };
      let index = endIdx + 1;
      while (index < len) {
        const endIdx2 = endIndex(str, index, len);
        const eqIdx2 = eqIndex(str, index, endIdx2);
        const attr = eqIdx2 === -1 ? valueSlice(str, index, endIdx2) : valueSlice(str, index, eqIdx2);
        const val = eqIdx2 === -1 ? void 0 : valueSlice(str, eqIdx2 + 1, endIdx2);
        switch (attr.toLowerCase()) {
          case "httponly":
            setCookie.httpOnly = true;
            break;
          case "secure":
            setCookie.secure = true;
            break;
          case "partitioned":
            setCookie.partitioned = true;
            break;
          case "domain":
            setCookie.domain = val;
            break;
          case "path":
            setCookie.path = val;
            break;
          case "max-age":
            if (val && maxAgeRegExp.test(val))
              setCookie.maxAge = Number(val);
            break;
          case "expires":
            if (!val)
              break;
            const date = new Date(val);
            if (Number.isFinite(date.valueOf()))
              setCookie.expires = date;
            break;
          case "priority":
            if (!val)
              break;
            const priority = val.toLowerCase();
            if (priority === "low" || priority === "medium" || priority === "high") {
              setCookie.priority = priority;
            }
            break;
          case "samesite":
            if (!val)
              break;
            const sameSite = val.toLowerCase();
            if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
              setCookie.sameSite = sameSite;
            }
            break;
        }
        index = endIdx2 + 1;
      }
      return setCookie;
    }
    function endIndex(str, min, len) {
      const index = str.indexOf(";", min);
      return index === -1 ? len : index;
    }
    function eqIndex(str, min, max) {
      const index = str.indexOf("=", min);
      return index < max ? index : -1;
    }
    function valueSlice(str, min, max) {
      let start = min;
      let end = max;
      do {
        const code = str.charCodeAt(start);
        if (code !== 32 && code !== 9)
          break;
      } while (++start < end);
      while (end > start) {
        const code = str.charCodeAt(end - 1);
        if (code !== 32 && code !== 9)
          break;
        end--;
      }
      return str.slice(start, end);
    }
    function decode(str) {
      if (str.indexOf("%") === -1)
        return str;
      try {
        return decodeURIComponent(str);
      } catch (e) {
        return str;
      }
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]";
    }
  }
});

// node_modules/@opennextjs/aws/dist/http/util.js
function parseSetCookieHeader(cookies) {
  if (!cookies) {
    return [];
  }
  if (typeof cookies === "string") {
    return cookies.split(/(?<!Expires=\w+),/i).map((c) => c.trim());
  }
  return cookies;
}
function getQueryFromIterator(it) {
  const query = {};
  for (const [key, value] of it) {
    if (key in query) {
      if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    } else {
      query[key] = value;
    }
  }
  return query;
}
var init_util = __esm({
  "node_modules/@opennextjs/aws/dist/http/util.js"() {
    init_logger();
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/utils.js
function getQueryFromSearchParams(searchParams) {
  return getQueryFromIterator(searchParams.entries());
}
var init_utils = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/utils.js"() {
    init_util();
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/edge.js
var edge_exports = {};
__export(edge_exports, {
  default: () => edge_default
});
import { Buffer as Buffer2 } from "node:buffer";
var import_cookie, NULL_BODY_STATUSES, converter, edge_default;
var init_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/edge.js"() {
    import_cookie = __toESM(require_dist(), 1);
    init_util();
    init_utils();
    NULL_BODY_STATUSES = /* @__PURE__ */ new Set([101, 103, 204, 205, 304]);
    converter = {
      convertFrom: async (event) => {
        const url = new URL(event.url);
        const searchParams = url.searchParams;
        const query = getQueryFromSearchParams(searchParams);
        const headers = {};
        event.headers.forEach((value, key) => {
          headers[key] = value;
        });
        const rawPath = url.pathname;
        const method = event.method;
        const shouldHaveBody = method !== "GET" && method !== "HEAD";
        const body = shouldHaveBody ? Buffer2.from(await event.arrayBuffer()) : void 0;
        const cookieHeader = event.headers.get("cookie");
        const cookies = cookieHeader ? import_cookie.default.parse(cookieHeader) : {};
        return {
          type: "core",
          method,
          rawPath,
          url: event.url,
          body,
          headers,
          remoteAddress: event.headers.get("x-forwarded-for") ?? "::1",
          query,
          cookies
        };
      },
      convertTo: async (result) => {
        if ("internalEvent" in result) {
          const request = new Request(result.internalEvent.url, {
            body: result.internalEvent.body,
            method: result.internalEvent.method,
            headers: {
              ...result.internalEvent.headers,
              "x-forwarded-host": result.internalEvent.headers.host
            }
          });
          if (globalThis.__dangerous_ON_edge_converter_returns_request === true) {
            return request;
          }
          const cfCache = (result.isISR || result.internalEvent.rawPath.startsWith("/_next/image")) && process.env.DISABLE_CACHE !== "true" ? { cacheEverything: true } : {};
          return fetch(request, {
            // This is a hack to make sure that the response is cached by Cloudflare
            // See https://developers.cloudflare.com/workers/examples/cache-using-fetch/#caching-html-resources
            // @ts-expect-error - This is a Cloudflare specific option
            cf: cfCache
          });
        }
        const headers = new Headers();
        for (const [key, value] of Object.entries(result.headers)) {
          if (key === "set-cookie" && typeof value === "string") {
            const cookies = parseSetCookieHeader(value);
            for (const cookie of cookies) {
              headers.append(key, cookie);
            }
            continue;
          }
          if (Array.isArray(value)) {
            for (const v of value) {
              headers.append(key, v);
            }
          } else {
            headers.set(key, value);
          }
        }
        const body = NULL_BODY_STATUSES.has(result.statusCode) ? null : result.body;
        return new Response(body, {
          status: result.statusCode,
          headers
        });
      },
      name: "edge"
    };
    edge_default = converter;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js
var cloudflare_edge_exports = {};
__export(cloudflare_edge_exports, {
  default: () => cloudflare_edge_default
});
var cfPropNameMapping, handler, cloudflare_edge_default;
var init_cloudflare_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js"() {
    cfPropNameMapping = {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: [encodeURIComponent, "x-open-next-city"],
      country: "x-open-next-country",
      regionCode: "x-open-next-region",
      latitude: "x-open-next-latitude",
      longitude: "x-open-next-longitude"
    };
    handler = async (handler3, converter2) => async (request, env, ctx) => {
      globalThis.process = process;
      for (const [key, value] of Object.entries(env)) {
        if (typeof value === "string") {
          process.env[key] = value;
        }
      }
      const internalEvent = await converter2.convertFrom(request);
      const cfProperties = request.cf;
      for (const [propName, mapping] of Object.entries(cfPropNameMapping)) {
        const propValue = cfProperties?.[propName];
        if (propValue != null) {
          const [encode, headerName] = Array.isArray(mapping) ? mapping : [null, mapping];
          internalEvent.headers[headerName] = encode ? encode(propValue) : propValue;
        }
      }
      const response = await handler3(internalEvent, {
        waitUntil: ctx.waitUntil.bind(ctx)
      });
      const result = await converter2.convertTo(response);
      return result;
    };
    cloudflare_edge_default = {
      wrapper: handler,
      name: "cloudflare-edge",
      supportStreaming: true,
      edgeRuntime: true
    };
  }
});

// node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js
var pattern_env_exports = {};
__export(pattern_env_exports, {
  default: () => pattern_env_default
});
function initializeOnce() {
  if (initialized)
    return;
  cachedOrigins = JSON.parse(process.env.OPEN_NEXT_ORIGIN ?? "{}");
  const functions = globalThis.openNextConfig.functions ?? {};
  for (const key in functions) {
    if (key !== "default") {
      const value = functions[key];
      const regexes = [];
      for (const pattern of value.patterns) {
        const regexPattern = `/${pattern.replace(/\*\*/g, "(.*)").replace(/\*/g, "([^/]*)").replace(/\//g, "\\/").replace(/\?/g, ".")}`;
        regexes.push(new RegExp(regexPattern));
      }
      cachedPatterns.push({
        key,
        patterns: value.patterns,
        regexes
      });
    }
  }
  initialized = true;
}
var cachedOrigins, cachedPatterns, initialized, envLoader, pattern_env_default;
var init_pattern_env = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js"() {
    init_logger();
    cachedPatterns = [];
    initialized = false;
    envLoader = {
      name: "env",
      resolve: async (_path) => {
        try {
          initializeOnce();
          for (const { key, patterns, regexes } of cachedPatterns) {
            for (const regex of regexes) {
              if (regex.test(_path)) {
                debug("Using origin", key, patterns);
                return cachedOrigins[key];
              }
            }
          }
          if (_path.startsWith("/_next/image") && cachedOrigins.imageOptimizer) {
            debug("Using origin", "imageOptimizer", _path);
            return cachedOrigins.imageOptimizer;
          }
          if (cachedOrigins.default) {
            debug("Using default origin", cachedOrigins.default, _path);
            return cachedOrigins.default;
          }
          return false;
        } catch (e) {
          error("Error while resolving origin", e);
          return false;
        }
      }
    };
    pattern_env_default = envLoader;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js
var dummy_exports = {};
__export(dummy_exports, {
  default: () => dummy_default
});
var resolver, dummy_default;
var init_dummy = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js"() {
    resolver = {
      name: "dummy"
    };
    dummy_default = resolver;
  }
});

// node_modules/@opennextjs/aws/dist/utils/stream.js
import { ReadableStream as ReadableStream2 } from "node:stream/web";
function toReadableStream(value, isBase64) {
  return new ReadableStream2({
    pull(controller) {
      controller.enqueue(Buffer.from(value, isBase64 ? "base64" : "utf8"));
      controller.close();
    }
  }, { highWaterMark: 0 });
}
function emptyReadableStream() {
  if (process.env.OPEN_NEXT_FORCE_NON_EMPTY_RESPONSE === "true") {
    return new ReadableStream2({
      pull(controller) {
        maybeSomethingBuffer ??= Buffer.from("SOMETHING");
        controller.enqueue(maybeSomethingBuffer);
        controller.close();
      }
    }, { highWaterMark: 0 });
  }
  return new ReadableStream2({
    start(controller) {
      controller.close();
    }
  });
}
var maybeSomethingBuffer;
var init_stream = __esm({
  "node_modules/@opennextjs/aws/dist/utils/stream.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js
var fetch_exports = {};
__export(fetch_exports, {
  default: () => fetch_default
});
var fetchProxy, fetch_default;
var init_fetch = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js"() {
    init_stream();
    fetchProxy = {
      name: "fetch-proxy",
      // @ts-ignore
      proxy: async (internalEvent) => {
        const { url, headers: eventHeaders, method, body } = internalEvent;
        const headers = Object.fromEntries(Object.entries(eventHeaders).filter(([key]) => key.toLowerCase() !== "cf-connecting-ip"));
        const response = await fetch(url, {
          method,
          headers,
          body
        });
        const responseHeaders = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });
        return {
          type: "core",
          headers: responseHeaders,
          statusCode: response.status,
          isBase64Encoded: true,
          body: response.body ?? emptyReadableStream()
        };
      }
    };
    fetch_default = fetchProxy;
  }
});

// .next/server/edge-runtime-webpack.js
var require_edge_runtime_webpack = __commonJS({
  ".next/server/edge-runtime-webpack.js"() {
    "use strict";
    (() => {
      "use strict";
      var a = {}, b = {};
      function c(d) {
        var e = b[d];
        if (void 0 !== e) return e.exports;
        var f = b[d] = { exports: {} }, g = true;
        try {
          a[d](f, f.exports, c), g = false;
        } finally {
          g && delete b[d];
        }
        return f.exports;
      }
      c.m = a, c.amdO = {}, (() => {
        var a2 = [];
        c.O = (b2, d, e, f) => {
          if (d) {
            f = f || 0;
            for (var g = a2.length; g > 0 && a2[g - 1][2] > f; g--) a2[g] = a2[g - 1];
            a2[g] = [d, e, f];
            return;
          }
          for (var h = 1 / 0, g = 0; g < a2.length; g++) {
            for (var [d, e, f] = a2[g], i = true, j = 0; j < d.length; j++) (false & f || h >= f) && Object.keys(c.O).every((a3) => c.O[a3](d[j])) ? d.splice(j--, 1) : (i = false, f < h && (h = f));
            if (i) {
              a2.splice(g--, 1);
              var k = e();
              void 0 !== k && (b2 = k);
            }
          }
          return b2;
        };
      })(), c.n = (a2) => {
        var b2 = a2 && a2.__esModule ? () => a2.default : () => a2;
        return c.d(b2, { a: b2 }), b2;
      }, c.d = (a2, b2) => {
        for (var d in b2) c.o(b2, d) && !c.o(a2, d) && Object.defineProperty(a2, d, { enumerable: true, get: b2[d] });
      }, c.g = function() {
        if ("object" == typeof globalThis) return globalThis;
        try {
          return this || Function("return this")();
        } catch (a2) {
          if ("object" == typeof window) return window;
        }
      }(), c.o = (a2, b2) => Object.prototype.hasOwnProperty.call(a2, b2), c.r = (a2) => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(a2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(a2, "__esModule", { value: true });
      }, (() => {
        var a2 = { 149: 0 };
        c.O.j = (b3) => 0 === a2[b3];
        var b2 = (b3, d2) => {
          var e, f, [g, h, i] = d2, j = 0;
          if (g.some((b4) => 0 !== a2[b4])) {
            for (e in h) c.o(h, e) && (c.m[e] = h[e]);
            if (i) var k = i(c);
          }
          for (b3 && b3(d2); j < g.length; j++) f = g[j], c.o(a2, f) && a2[f] && a2[f][0](), a2[f] = 0;
          return c.O(k);
        }, d = self.webpackChunk_N_E = self.webpackChunk_N_E || [];
        d.forEach(b2.bind(null, 0)), d.push = b2.bind(null, d.push.bind(d));
      })();
    })();
  }
});

// node-built-in-modules:node:buffer
var node_buffer_exports = {};
import * as node_buffer_star from "node:buffer";
var init_node_buffer = __esm({
  "node-built-in-modules:node:buffer"() {
    __reExport(node_buffer_exports, node_buffer_star);
  }
});

// node-built-in-modules:node:async_hooks
var node_async_hooks_exports = {};
import * as node_async_hooks_star from "node:async_hooks";
var init_node_async_hooks = __esm({
  "node-built-in-modules:node:async_hooks"() {
    __reExport(node_async_hooks_exports, node_async_hooks_star);
  }
});

// .next/server/src/middleware.js
var require_middleware = __commonJS({
  ".next/server/src/middleware.js"() {
    "use strict";
    (self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([[550], { 18: (a, b, c) => {
      "use strict";
      let d;
      c.r(b), c.d(b, { default: () => jH });
      var e, f, g, h = {};
      c.r(h), c.d(h, { base64: () => cH, base64url: () => cI, bigint: () => cS, boolean: () => cV, browserEmail: () => cA, cidrv4: () => cF, cidrv6: () => cG, cuid: () => ci, cuid2: () => cj, date: () => cN, datetime: () => cQ, domain: () => cK, duration: () => co, e164: () => cL, email: () => cv, emoji: () => cB, extendedDuration: () => cp, guid: () => cq, hex: () => c$, hostname: () => cJ, html5Email: () => cw, idnEmail: () => cz, integer: () => cT, ipv4: () => cC, ipv6: () => cD, ksuid: () => cm, lowercase: () => cY, mac: () => cE, md5_base64: () => c2, md5_base64url: () => c3, md5_hex: () => c1, nanoid: () => cn, null: () => cW, number: () => cU, rfc5322Email: () => cx, sha1_base64: () => c5, sha1_base64url: () => c6, sha1_hex: () => c4, sha256_base64: () => c8, sha256_base64url: () => c9, sha256_hex: () => c7, sha384_base64: () => db, sha384_base64url: () => dc, sha384_hex: () => da, sha512_base64: () => de, sha512_base64url: () => df, sha512_hex: () => dd, string: () => cR, time: () => cP, ulid: () => ck, undefined: () => cX, unicodeEmail: () => cy, uppercase: () => cZ, uuid: () => cr, uuid4: () => cs, uuid6: () => ct, uuid7: () => cu, xid: () => cl });
      var i = {};
      c.r(i), c.d(i, { endsWith: () => fP, gt: () => fx, gte: () => fy, includes: () => fN, length: () => fJ, lowercase: () => fL, lt: () => fv, lte: () => fw, maxLength: () => fH, maxSize: () => fE, mime: () => fR, minLength: () => fI, minSize: () => fF, multipleOf: () => fD, negative: () => fA, nonnegative: () => fC, nonpositive: () => fB, normalize: () => fT, overwrite: () => fS, positive: () => fz, property: () => fQ, regex: () => fK, size: () => fG, slugify: () => fX, startsWith: () => fO, toLowerCase: () => fV, toUpperCase: () => fW, trim: () => fU, uppercase: () => fM });
      var j = {};
      c.r(j), c.d(j, { ZodISODate: () => f7, ZodISODateTime: () => f5, ZodISODuration: () => gb, ZodISOTime: () => f9, date: () => f8, datetime: () => f6, duration: () => gc, time: () => ga });
      var k = {};
      c.r(k), c.d(k, { ZodAny: () => hC, ZodArray: () => hM, ZodBase64: () => g4, ZodBase64URL: () => g6, ZodBigInt: () => hr, ZodBigIntFormat: () => ht, ZodBoolean: () => hp, ZodCIDRv4: () => g0, ZodCIDRv6: () => g2, ZodCUID: () => gM, ZodCUID2: () => gO, ZodCatch: () => iz, ZodCodec: () => iF, ZodCustom: () => iR, ZodCustomStringFormat: () => hc, ZodDate: () => hK, ZodDefault: () => ir, ZodDiscriminatedUnion: () => hX, ZodE164: () => g8, ZodEmail: () => gw, ZodEmoji: () => gI, ZodEnum: () => h9, ZodExactOptional: () => il, ZodFile: () => ie, ZodFunction: () => iP, ZodGUID: () => gy, ZodIPv4: () => gW, ZodIPv6: () => g$, ZodIntersection: () => hZ, ZodJWT: () => ha, ZodKSUID: () => gU, ZodLazy: () => iL, ZodLiteral: () => ic, ZodMAC: () => gY, ZodMap: () => h5, ZodNaN: () => iB, ZodNanoID: () => gK, ZodNever: () => hG, ZodNonOptional: () => iv, ZodNull: () => hA, ZodNullable: () => io, ZodNumber: () => hh, ZodNumberFormat: () => hj, ZodObject: () => hP, ZodOptional: () => ij, ZodPipe: () => iD, ZodPrefault: () => it, ZodPromise: () => iN, ZodReadonly: () => iH, ZodRecord: () => h1, ZodSet: () => h7, ZodString: () => gt, ZodStringFormat: () => gv, ZodSuccess: () => ix, ZodSymbol: () => hw, ZodTemplateLiteral: () => iJ, ZodTransform: () => ih, ZodTuple: () => h_, ZodType: () => gr, ZodULID: () => gQ, ZodURL: () => gF, ZodUUID: () => gA, ZodUndefined: () => hy, ZodUnion: () => hT, ZodUnknown: () => hE, ZodVoid: () => hI, ZodXID: () => gS, ZodXor: () => hV, _ZodString: () => gs, _default: () => is, _function: () => iQ, any: () => hD, array: () => hN, base64: () => g5, base64url: () => g7, bigint: () => hs, boolean: () => hq, catch: () => iA, check: () => iS, cidrv4: () => g1, cidrv6: () => g3, codec: () => iG, cuid: () => gN, cuid2: () => gP, custom: () => iT, date: () => hL, describe: () => iW, discriminatedUnion: () => hY, e164: () => g9, email: () => gx, emoji: () => gJ, enum: () => ia, exactOptional: () => im, file: () => ig, float32: () => hl, float64: () => hm, function: () => iQ, guid: () => gz, hash: () => hg, hex: () => hf, hostname: () => he, httpUrl: () => gH, instanceof: () => iY, int: () => hk, int32: () => hn, int64: () => hu, intersection: () => h$, ipv4: () => gX, ipv6: () => g_, json: () => i$, jwt: () => hb, keyof: () => hO, ksuid: () => gV, lazy: () => iM, literal: () => id, looseObject: () => hS, looseRecord: () => h4, mac: () => gZ, map: () => h6, meta: () => iX, nan: () => iC, nanoid: () => gL, nativeEnum: () => ib, never: () => hH, nonoptional: () => iw, null: () => hB, nullable: () => ip, nullish: () => iq, number: () => hi, object: () => hQ, optional: () => ik, partialRecord: () => h3, pipe: () => iE, prefault: () => iu, preprocess: () => i_, promise: () => iO, readonly: () => iI, record: () => h2, refine: () => iU, set: () => h8, strictObject: () => hR, string: () => gu, stringFormat: () => hd, stringbool: () => iZ, success: () => iy, superRefine: () => iV, symbol: () => hx, templateLiteral: () => iK, transform: () => ii, tuple: () => h0, uint32: () => ho, uint64: () => hv, ulid: () => gR, undefined: () => hz, union: () => hU, unknown: () => hF, url: () => gG, uuid: () => gB, uuidv4: () => gC, uuidv6: () => gD, uuidv7: () => gE, void: () => hJ, xid: () => gT, xor: () => hW });
      var l = {};
      async function m() {
        return "_ENTRIES" in globalThis && _ENTRIES.middleware_instrumentation && await _ENTRIES.middleware_instrumentation;
      }
      c.r(l), c.d(l, { config: () => jD, middleware: () => jC });
      let n = null;
      async function o() {
        if ("phase-production-build" === process.env.NEXT_PHASE) return;
        n || (n = m());
        let a10 = await n;
        if (null == a10 ? void 0 : a10.register) try {
          await a10.register();
        } catch (a11) {
          throw a11.message = `An error occurred while loading instrumentation hook: ${a11.message}`, a11;
        }
      }
      async function p(...a10) {
        let b10 = await m();
        try {
          var c10;
          await (null == b10 || null == (c10 = b10.onRequestError) ? void 0 : c10.call(b10, ...a10));
        } catch (a11) {
          console.error("Error in instrumentation.onRequestError:", a11);
        }
      }
      let q = null;
      function r() {
        return q || (q = o()), q;
      }
      function s(a10) {
        return `The edge runtime does not support Node.js '${a10}' module.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime`;
      }
      process !== c.g.process && (process.env = c.g.process.env, c.g.process = process);
      try {
        Object.defineProperty(globalThis, "__import_unsupported", { value: function(a10) {
          let b10 = new Proxy(function() {
          }, { get(b11, c10) {
            if ("then" === c10) return {};
            throw Object.defineProperty(Error(s(a10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          }, construct() {
            throw Object.defineProperty(Error(s(a10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          }, apply(c10, d10, e10) {
            if ("function" == typeof e10[0]) return e10[0](b10);
            throw Object.defineProperty(Error(s(a10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          } });
          return new Proxy({}, { get: () => b10 });
        }, enumerable: false, configurable: false });
      } catch {
      }
      r();
      class t extends Error {
        constructor({ page: a10 }) {
          super(`The middleware "${a10}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `);
        }
      }
      class u extends Error {
        constructor() {
          super(`The request.page has been deprecated in favour of \`URLPattern\`.
  Read more: https://nextjs.org/docs/messages/middleware-request-page
  `);
        }
      }
      class v extends Error {
        constructor() {
          super(`The request.ua has been removed in favour of \`userAgent\` function.
  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent
  `);
        }
      }
      let w = "_N_T_", x = { shared: "shared", reactServerComponents: "rsc", serverSideRendering: "ssr", actionBrowser: "action-browser", apiNode: "api-node", apiEdge: "api-edge", middleware: "middleware", instrument: "instrument", edgeAsset: "edge-asset", appPagesBrowser: "app-pages-browser", pagesDirBrowser: "pages-dir-browser", pagesDirEdge: "pages-dir-edge", pagesDirNode: "pages-dir-node" };
      function y(a10) {
        var b10, c10, d10, e10, f10, g10 = [], h10 = 0;
        function i10() {
          for (; h10 < a10.length && /\s/.test(a10.charAt(h10)); ) h10 += 1;
          return h10 < a10.length;
        }
        for (; h10 < a10.length; ) {
          for (b10 = h10, f10 = false; i10(); ) if ("," === (c10 = a10.charAt(h10))) {
            for (d10 = h10, h10 += 1, i10(), e10 = h10; h10 < a10.length && "=" !== (c10 = a10.charAt(h10)) && ";" !== c10 && "," !== c10; ) h10 += 1;
            h10 < a10.length && "=" === a10.charAt(h10) ? (f10 = true, h10 = e10, g10.push(a10.substring(b10, d10)), b10 = h10) : h10 = d10 + 1;
          } else h10 += 1;
          (!f10 || h10 >= a10.length) && g10.push(a10.substring(b10, a10.length));
        }
        return g10;
      }
      function z(a10) {
        let b10 = {}, c10 = [];
        if (a10) for (let [d10, e10] of a10.entries()) "set-cookie" === d10.toLowerCase() ? (c10.push(...y(e10)), b10[d10] = 1 === c10.length ? c10[0] : c10) : b10[d10] = e10;
        return b10;
      }
      function A(a10) {
        try {
          return String(new URL(String(a10)));
        } catch (b10) {
          throw Object.defineProperty(Error(`URL is malformed "${String(a10)}". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`, { cause: b10 }), "__NEXT_ERROR_CODE", { value: "E61", enumerable: false, configurable: true });
        }
      }
      ({ ...x, GROUP: { builtinReact: [x.reactServerComponents, x.actionBrowser], serverOnly: [x.reactServerComponents, x.actionBrowser, x.instrument, x.middleware], neutralTarget: [x.apiNode, x.apiEdge], clientOnly: [x.serverSideRendering, x.appPagesBrowser], bundled: [x.reactServerComponents, x.actionBrowser, x.serverSideRendering, x.appPagesBrowser, x.shared, x.instrument, x.middleware], appPages: [x.reactServerComponents, x.serverSideRendering, x.appPagesBrowser, x.actionBrowser] } });
      let B = Symbol("response"), C = Symbol("passThrough"), D = Symbol("waitUntil");
      class E {
        constructor(a10, b10) {
          this[C] = false, this[D] = b10 ? { kind: "external", function: b10 } : { kind: "internal", promises: [] };
        }
        respondWith(a10) {
          this[B] || (this[B] = Promise.resolve(a10));
        }
        passThroughOnException() {
          this[C] = true;
        }
        waitUntil(a10) {
          if ("external" === this[D].kind) return (0, this[D].function)(a10);
          this[D].promises.push(a10);
        }
      }
      class F extends E {
        constructor(a10) {
          var b10;
          super(a10.request, null == (b10 = a10.context) ? void 0 : b10.waitUntil), this.sourcePage = a10.page;
        }
        get request() {
          throw Object.defineProperty(new t({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new t({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      function G(a10) {
        return a10.replace(/\/$/, "") || "/";
      }
      function H(a10) {
        let b10 = a10.indexOf("#"), c10 = a10.indexOf("?"), d10 = c10 > -1 && (b10 < 0 || c10 < b10);
        return d10 || b10 > -1 ? { pathname: a10.substring(0, d10 ? c10 : b10), query: d10 ? a10.substring(c10, b10 > -1 ? b10 : void 0) : "", hash: b10 > -1 ? a10.slice(b10) : "" } : { pathname: a10, query: "", hash: "" };
      }
      function I(a10, b10) {
        if (!a10.startsWith("/") || !b10) return a10;
        let { pathname: c10, query: d10, hash: e10 } = H(a10);
        return "" + b10 + c10 + d10 + e10;
      }
      function J(a10, b10) {
        if (!a10.startsWith("/") || !b10) return a10;
        let { pathname: c10, query: d10, hash: e10 } = H(a10);
        return "" + c10 + b10 + d10 + e10;
      }
      function K(a10, b10) {
        if ("string" != typeof a10) return false;
        let { pathname: c10 } = H(a10);
        return c10 === b10 || c10.startsWith(b10 + "/");
      }
      let L = /* @__PURE__ */ new WeakMap();
      function M(a10, b10) {
        let c10;
        if (!b10) return { pathname: a10 };
        let d10 = L.get(b10);
        d10 || (d10 = b10.map((a11) => a11.toLowerCase()), L.set(b10, d10));
        let e10 = a10.split("/", 2);
        if (!e10[1]) return { pathname: a10 };
        let f10 = e10[1].toLowerCase(), g10 = d10.indexOf(f10);
        return g10 < 0 ? { pathname: a10 } : (c10 = b10[g10], { pathname: a10 = a10.slice(c10.length + 1) || "/", detectedLocale: c10 });
      }
      let N = /(?!^https?:\/\/)(127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1\]|localhost)/;
      function O(a10, b10) {
        return new URL(String(a10).replace(N, "localhost"), b10 && String(b10).replace(N, "localhost"));
      }
      let P = Symbol("NextURLInternal");
      class Q {
        constructor(a10, b10, c10) {
          let d10, e10;
          "object" == typeof b10 && "pathname" in b10 || "string" == typeof b10 ? (d10 = b10, e10 = c10 || {}) : e10 = c10 || b10 || {}, this[P] = { url: O(a10, d10 ?? e10.base), options: e10, basePath: "" }, this.analyze();
        }
        analyze() {
          var a10, b10, c10, d10, e10;
          let f10 = function(a11, b11) {
            var c11, d11;
            let { basePath: e11, i18n: f11, trailingSlash: g11 } = null != (c11 = b11.nextConfig) ? c11 : {}, h11 = { pathname: a11, trailingSlash: "/" !== a11 ? a11.endsWith("/") : g11 };
            e11 && K(h11.pathname, e11) && (h11.pathname = function(a12, b12) {
              if (!K(a12, b12)) return a12;
              let c12 = a12.slice(b12.length);
              return c12.startsWith("/") ? c12 : "/" + c12;
            }(h11.pathname, e11), h11.basePath = e11);
            let i10 = h11.pathname;
            if (h11.pathname.startsWith("/_next/data/") && h11.pathname.endsWith(".json")) {
              let a12 = h11.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/");
              h11.buildId = a12[0], i10 = "index" !== a12[1] ? "/" + a12.slice(1).join("/") : "/", true === b11.parseData && (h11.pathname = i10);
            }
            if (f11) {
              let a12 = b11.i18nProvider ? b11.i18nProvider.analyze(h11.pathname) : M(h11.pathname, f11.locales);
              h11.locale = a12.detectedLocale, h11.pathname = null != (d11 = a12.pathname) ? d11 : h11.pathname, !a12.detectedLocale && h11.buildId && (a12 = b11.i18nProvider ? b11.i18nProvider.analyze(i10) : M(i10, f11.locales)).detectedLocale && (h11.locale = a12.detectedLocale);
            }
            return h11;
          }(this[P].url.pathname, { nextConfig: this[P].options.nextConfig, parseData: true, i18nProvider: this[P].options.i18nProvider }), g10 = function(a11, b11) {
            let c11;
            if ((null == b11 ? void 0 : b11.host) && !Array.isArray(b11.host)) c11 = b11.host.toString().split(":", 1)[0];
            else {
              if (!a11.hostname) return;
              c11 = a11.hostname;
            }
            return c11.toLowerCase();
          }(this[P].url, this[P].options.headers);
          this[P].domainLocale = this[P].options.i18nProvider ? this[P].options.i18nProvider.detectDomainLocale(g10) : function(a11, b11, c11) {
            if (a11) for (let f11 of (c11 && (c11 = c11.toLowerCase()), a11)) {
              var d11, e11;
              if (b11 === (null == (d11 = f11.domain) ? void 0 : d11.split(":", 1)[0].toLowerCase()) || c11 === f11.defaultLocale.toLowerCase() || (null == (e11 = f11.locales) ? void 0 : e11.some((a12) => a12.toLowerCase() === c11))) return f11;
            }
          }(null == (b10 = this[P].options.nextConfig) || null == (a10 = b10.i18n) ? void 0 : a10.domains, g10);
          let h10 = (null == (c10 = this[P].domainLocale) ? void 0 : c10.defaultLocale) || (null == (e10 = this[P].options.nextConfig) || null == (d10 = e10.i18n) ? void 0 : d10.defaultLocale);
          this[P].url.pathname = f10.pathname, this[P].defaultLocale = h10, this[P].basePath = f10.basePath ?? "", this[P].buildId = f10.buildId, this[P].locale = f10.locale ?? h10, this[P].trailingSlash = f10.trailingSlash;
        }
        formatPathname() {
          var a10;
          let b10;
          return b10 = function(a11, b11, c10, d10) {
            if (!b11 || b11 === c10) return a11;
            let e10 = a11.toLowerCase();
            return !d10 && (K(e10, "/api") || K(e10, "/" + b11.toLowerCase())) ? a11 : I(a11, "/" + b11);
          }((a10 = { basePath: this[P].basePath, buildId: this[P].buildId, defaultLocale: this[P].options.forceLocale ? void 0 : this[P].defaultLocale, locale: this[P].locale, pathname: this[P].url.pathname, trailingSlash: this[P].trailingSlash }).pathname, a10.locale, a10.buildId ? void 0 : a10.defaultLocale, a10.ignorePrefix), (a10.buildId || !a10.trailingSlash) && (b10 = G(b10)), a10.buildId && (b10 = J(I(b10, "/_next/data/" + a10.buildId), "/" === a10.pathname ? "index.json" : ".json")), b10 = I(b10, a10.basePath), !a10.buildId && a10.trailingSlash ? b10.endsWith("/") ? b10 : J(b10, "/") : G(b10);
        }
        formatSearch() {
          return this[P].url.search;
        }
        get buildId() {
          return this[P].buildId;
        }
        set buildId(a10) {
          this[P].buildId = a10;
        }
        get locale() {
          return this[P].locale ?? "";
        }
        set locale(a10) {
          var b10, c10;
          if (!this[P].locale || !(null == (c10 = this[P].options.nextConfig) || null == (b10 = c10.i18n) ? void 0 : b10.locales.includes(a10))) throw Object.defineProperty(TypeError(`The NextURL configuration includes no locale "${a10}"`), "__NEXT_ERROR_CODE", { value: "E597", enumerable: false, configurable: true });
          this[P].locale = a10;
        }
        get defaultLocale() {
          return this[P].defaultLocale;
        }
        get domainLocale() {
          return this[P].domainLocale;
        }
        get searchParams() {
          return this[P].url.searchParams;
        }
        get host() {
          return this[P].url.host;
        }
        set host(a10) {
          this[P].url.host = a10;
        }
        get hostname() {
          return this[P].url.hostname;
        }
        set hostname(a10) {
          this[P].url.hostname = a10;
        }
        get port() {
          return this[P].url.port;
        }
        set port(a10) {
          this[P].url.port = a10;
        }
        get protocol() {
          return this[P].url.protocol;
        }
        set protocol(a10) {
          this[P].url.protocol = a10;
        }
        get href() {
          let a10 = this.formatPathname(), b10 = this.formatSearch();
          return `${this.protocol}//${this.host}${a10}${b10}${this.hash}`;
        }
        set href(a10) {
          this[P].url = O(a10), this.analyze();
        }
        get origin() {
          return this[P].url.origin;
        }
        get pathname() {
          return this[P].url.pathname;
        }
        set pathname(a10) {
          this[P].url.pathname = a10;
        }
        get hash() {
          return this[P].url.hash;
        }
        set hash(a10) {
          this[P].url.hash = a10;
        }
        get search() {
          return this[P].url.search;
        }
        set search(a10) {
          this[P].url.search = a10;
        }
        get password() {
          return this[P].url.password;
        }
        set password(a10) {
          this[P].url.password = a10;
        }
        get username() {
          return this[P].url.username;
        }
        set username(a10) {
          this[P].url.username = a10;
        }
        get basePath() {
          return this[P].basePath;
        }
        set basePath(a10) {
          this[P].basePath = a10.startsWith("/") ? a10 : `/${a10}`;
        }
        toString() {
          return this.href;
        }
        toJSON() {
          return this.href;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { href: this.href, origin: this.origin, protocol: this.protocol, username: this.username, password: this.password, host: this.host, hostname: this.hostname, port: this.port, pathname: this.pathname, search: this.search, searchParams: this.searchParams, hash: this.hash };
        }
        clone() {
          return new Q(String(this), this[P].options);
        }
      }
      var R = c(443);
      let S = Symbol("internal request");
      class T extends Request {
        constructor(a10, b10 = {}) {
          let c10 = "string" != typeof a10 && "url" in a10 ? a10.url : String(a10);
          A(c10), a10 instanceof Request ? super(a10, b10) : super(c10, b10);
          let d10 = new Q(c10, { headers: z(this.headers), nextConfig: b10.nextConfig });
          this[S] = { cookies: new R.RequestCookies(this.headers), nextUrl: d10, url: d10.toString() };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, nextUrl: this.nextUrl, url: this.url, bodyUsed: this.bodyUsed, cache: this.cache, credentials: this.credentials, destination: this.destination, headers: Object.fromEntries(this.headers), integrity: this.integrity, keepalive: this.keepalive, method: this.method, mode: this.mode, redirect: this.redirect, referrer: this.referrer, referrerPolicy: this.referrerPolicy, signal: this.signal };
        }
        get cookies() {
          return this[S].cookies;
        }
        get nextUrl() {
          return this[S].nextUrl;
        }
        get page() {
          throw new u();
        }
        get ua() {
          throw new v();
        }
        get url() {
          return this[S].url;
        }
      }
      class U {
        static get(a10, b10, c10) {
          let d10 = Reflect.get(a10, b10, c10);
          return "function" == typeof d10 ? d10.bind(a10) : d10;
        }
        static set(a10, b10, c10, d10) {
          return Reflect.set(a10, b10, c10, d10);
        }
        static has(a10, b10) {
          return Reflect.has(a10, b10);
        }
        static deleteProperty(a10, b10) {
          return Reflect.deleteProperty(a10, b10);
        }
      }
      let V = Symbol("internal response"), W = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
      function X(a10, b10) {
        var c10;
        if (null == a10 || null == (c10 = a10.request) ? void 0 : c10.headers) {
          if (!(a10.request.headers instanceof Headers)) throw Object.defineProperty(Error("request.headers must be an instance of Headers"), "__NEXT_ERROR_CODE", { value: "E119", enumerable: false, configurable: true });
          let c11 = [];
          for (let [d10, e10] of a10.request.headers) b10.set("x-middleware-request-" + d10, e10), c11.push(d10);
          b10.set("x-middleware-override-headers", c11.join(","));
        }
      }
      class Y extends Response {
        constructor(a10, b10 = {}) {
          super(a10, b10);
          let c10 = this.headers, d10 = new Proxy(new R.ResponseCookies(c10), { get(a11, d11, e10) {
            switch (d11) {
              case "delete":
              case "set":
                return (...e11) => {
                  let f10 = Reflect.apply(a11[d11], a11, e11), g10 = new Headers(c10);
                  return f10 instanceof R.ResponseCookies && c10.set("x-middleware-set-cookie", f10.getAll().map((a12) => (0, R.stringifyCookie)(a12)).join(",")), X(b10, g10), f10;
                };
              default:
                return U.get(a11, d11, e10);
            }
          } });
          this[V] = { cookies: d10, url: b10.url ? new Q(b10.url, { headers: z(c10), nextConfig: b10.nextConfig }) : void 0 };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, url: this.url, body: this.body, bodyUsed: this.bodyUsed, headers: Object.fromEntries(this.headers), ok: this.ok, redirected: this.redirected, status: this.status, statusText: this.statusText, type: this.type };
        }
        get cookies() {
          return this[V].cookies;
        }
        static json(a10, b10) {
          let c10 = Response.json(a10, b10);
          return new Y(c10.body, c10);
        }
        static redirect(a10, b10) {
          let c10 = "number" == typeof b10 ? b10 : (null == b10 ? void 0 : b10.status) ?? 307;
          if (!W.has(c10)) throw Object.defineProperty(RangeError('Failed to execute "redirect" on "response": Invalid status code'), "__NEXT_ERROR_CODE", { value: "E529", enumerable: false, configurable: true });
          let d10 = "object" == typeof b10 ? b10 : {}, e10 = new Headers(null == d10 ? void 0 : d10.headers);
          return e10.set("Location", A(a10)), new Y(null, { ...d10, headers: e10, status: c10 });
        }
        static rewrite(a10, b10) {
          let c10 = new Headers(null == b10 ? void 0 : b10.headers);
          return c10.set("x-middleware-rewrite", A(a10)), X(b10, c10), new Y(null, { ...b10, headers: c10 });
        }
        static next(a10) {
          let b10 = new Headers(null == a10 ? void 0 : a10.headers);
          return b10.set("x-middleware-next", "1"), X(a10, b10), new Y(null, { ...a10, headers: b10 });
        }
      }
      function Z(a10, b10) {
        let c10 = "string" == typeof b10 ? new URL(b10) : b10, d10 = new URL(a10, b10), e10 = d10.origin === c10.origin;
        return { url: e10 ? d10.toString().slice(c10.origin.length) : d10.toString(), isRelative: e10 };
      }
      let $ = "next-router-prefetch", _ = ["rsc", "next-router-state-tree", $, "next-hmr-refresh", "next-router-segment-prefetch"], aa = "_rsc";
      class ab extends Error {
        constructor() {
          super("Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers");
        }
        static callable() {
          throw new ab();
        }
      }
      class ac extends Headers {
        constructor(a10) {
          super(), this.headers = new Proxy(a10, { get(b10, c10, d10) {
            if ("symbol" == typeof c10) return U.get(b10, c10, d10);
            let e10 = c10.toLowerCase(), f10 = Object.keys(a10).find((a11) => a11.toLowerCase() === e10);
            if (void 0 !== f10) return U.get(b10, f10, d10);
          }, set(b10, c10, d10, e10) {
            if ("symbol" == typeof c10) return U.set(b10, c10, d10, e10);
            let f10 = c10.toLowerCase(), g10 = Object.keys(a10).find((a11) => a11.toLowerCase() === f10);
            return U.set(b10, g10 ?? c10, d10, e10);
          }, has(b10, c10) {
            if ("symbol" == typeof c10) return U.has(b10, c10);
            let d10 = c10.toLowerCase(), e10 = Object.keys(a10).find((a11) => a11.toLowerCase() === d10);
            return void 0 !== e10 && U.has(b10, e10);
          }, deleteProperty(b10, c10) {
            if ("symbol" == typeof c10) return U.deleteProperty(b10, c10);
            let d10 = c10.toLowerCase(), e10 = Object.keys(a10).find((a11) => a11.toLowerCase() === d10);
            return void 0 === e10 || U.deleteProperty(b10, e10);
          } });
        }
        static seal(a10) {
          return new Proxy(a10, { get(a11, b10, c10) {
            switch (b10) {
              case "append":
              case "delete":
              case "set":
                return ab.callable;
              default:
                return U.get(a11, b10, c10);
            }
          } });
        }
        merge(a10) {
          return Array.isArray(a10) ? a10.join(", ") : a10;
        }
        static from(a10) {
          return a10 instanceof Headers ? a10 : new ac(a10);
        }
        append(a10, b10) {
          let c10 = this.headers[a10];
          "string" == typeof c10 ? this.headers[a10] = [c10, b10] : Array.isArray(c10) ? c10.push(b10) : this.headers[a10] = b10;
        }
        delete(a10) {
          delete this.headers[a10];
        }
        get(a10) {
          let b10 = this.headers[a10];
          return void 0 !== b10 ? this.merge(b10) : null;
        }
        has(a10) {
          return void 0 !== this.headers[a10];
        }
        set(a10, b10) {
          this.headers[a10] = b10;
        }
        forEach(a10, b10) {
          for (let [c10, d10] of this.entries()) a10.call(b10, d10, c10, this);
        }
        *entries() {
          for (let a10 of Object.keys(this.headers)) {
            let b10 = a10.toLowerCase(), c10 = this.get(b10);
            yield [b10, c10];
          }
        }
        *keys() {
          for (let a10 of Object.keys(this.headers)) {
            let b10 = a10.toLowerCase();
            yield b10;
          }
        }
        *values() {
          for (let a10 of Object.keys(this.headers)) {
            let b10 = this.get(a10);
            yield b10;
          }
        }
        [Symbol.iterator]() {
          return this.entries();
        }
      }
      let ad = Object.defineProperty(Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available"), "__NEXT_ERROR_CODE", { value: "E504", enumerable: false, configurable: true });
      class ae {
        disable() {
          throw ad;
        }
        getStore() {
        }
        run() {
          throw ad;
        }
        exit() {
          throw ad;
        }
        enterWith() {
          throw ad;
        }
        static bind(a10) {
          return a10;
        }
      }
      let af = "undefined" != typeof globalThis && globalThis.AsyncLocalStorage;
      function ag() {
        return af ? new af() : new ae();
      }
      let ah = ag();
      class ai extends Error {
        constructor() {
          super("Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#options");
        }
        static callable() {
          throw new ai();
        }
      }
      class aj {
        static seal(a10) {
          return new Proxy(a10, { get(a11, b10, c10) {
            switch (b10) {
              case "clear":
              case "delete":
              case "set":
                return ai.callable;
              default:
                return U.get(a11, b10, c10);
            }
          } });
        }
      }
      let ak = Symbol.for("next.mutated.cookies");
      class al {
        static wrap(a10, b10) {
          let c10 = new R.ResponseCookies(new Headers());
          for (let b11 of a10.getAll()) c10.set(b11);
          let d10 = [], e10 = /* @__PURE__ */ new Set(), f10 = () => {
            let a11 = ah.getStore();
            if (a11 && (a11.pathWasRevalidated = true), d10 = c10.getAll().filter((a12) => e10.has(a12.name)), b10) {
              let a12 = [];
              for (let b11 of d10) {
                let c11 = new R.ResponseCookies(new Headers());
                c11.set(b11), a12.push(c11.toString());
              }
              b10(a12);
            }
          }, g10 = new Proxy(c10, { get(a11, b11, c11) {
            switch (b11) {
              case ak:
                return d10;
              case "delete":
                return function(...b12) {
                  e10.add("string" == typeof b12[0] ? b12[0] : b12[0].name);
                  try {
                    return a11.delete(...b12), g10;
                  } finally {
                    f10();
                  }
                };
              case "set":
                return function(...b12) {
                  e10.add("string" == typeof b12[0] ? b12[0] : b12[0].name);
                  try {
                    return a11.set(...b12), g10;
                  } finally {
                    f10();
                  }
                };
              default:
                return U.get(a11, b11, c11);
            }
          } });
          return g10;
        }
      }
      function am(a10, b10) {
        if ("action" !== a10.phase) throw new ai();
      }
      var an = function(a10) {
        return a10.handleRequest = "BaseServer.handleRequest", a10.run = "BaseServer.run", a10.pipe = "BaseServer.pipe", a10.getStaticHTML = "BaseServer.getStaticHTML", a10.render = "BaseServer.render", a10.renderToResponseWithComponents = "BaseServer.renderToResponseWithComponents", a10.renderToResponse = "BaseServer.renderToResponse", a10.renderToHTML = "BaseServer.renderToHTML", a10.renderError = "BaseServer.renderError", a10.renderErrorToResponse = "BaseServer.renderErrorToResponse", a10.renderErrorToHTML = "BaseServer.renderErrorToHTML", a10.render404 = "BaseServer.render404", a10;
      }(an || {}), ao = function(a10) {
        return a10.loadDefaultErrorComponents = "LoadComponents.loadDefaultErrorComponents", a10.loadComponents = "LoadComponents.loadComponents", a10;
      }(ao || {}), ap = function(a10) {
        return a10.getRequestHandler = "NextServer.getRequestHandler", a10.getServer = "NextServer.getServer", a10.getServerRequestHandler = "NextServer.getServerRequestHandler", a10.createServer = "createServer.createServer", a10;
      }(ap || {}), aq = function(a10) {
        return a10.compression = "NextNodeServer.compression", a10.getBuildId = "NextNodeServer.getBuildId", a10.createComponentTree = "NextNodeServer.createComponentTree", a10.clientComponentLoading = "NextNodeServer.clientComponentLoading", a10.getLayoutOrPageModule = "NextNodeServer.getLayoutOrPageModule", a10.generateStaticRoutes = "NextNodeServer.generateStaticRoutes", a10.generateFsStaticRoutes = "NextNodeServer.generateFsStaticRoutes", a10.generatePublicRoutes = "NextNodeServer.generatePublicRoutes", a10.generateImageRoutes = "NextNodeServer.generateImageRoutes.route", a10.sendRenderResult = "NextNodeServer.sendRenderResult", a10.proxyRequest = "NextNodeServer.proxyRequest", a10.runApi = "NextNodeServer.runApi", a10.render = "NextNodeServer.render", a10.renderHTML = "NextNodeServer.renderHTML", a10.imageOptimizer = "NextNodeServer.imageOptimizer", a10.getPagePath = "NextNodeServer.getPagePath", a10.getRoutesManifest = "NextNodeServer.getRoutesManifest", a10.findPageComponents = "NextNodeServer.findPageComponents", a10.getFontManifest = "NextNodeServer.getFontManifest", a10.getServerComponentManifest = "NextNodeServer.getServerComponentManifest", a10.getRequestHandler = "NextNodeServer.getRequestHandler", a10.renderToHTML = "NextNodeServer.renderToHTML", a10.renderError = "NextNodeServer.renderError", a10.renderErrorToHTML = "NextNodeServer.renderErrorToHTML", a10.render404 = "NextNodeServer.render404", a10.startResponse = "NextNodeServer.startResponse", a10.route = "route", a10.onProxyReq = "onProxyReq", a10.apiResolver = "apiResolver", a10.internalFetch = "internalFetch", a10;
      }(aq || {}), ar = function(a10) {
        return a10.startServer = "startServer.startServer", a10;
      }(ar || {}), as = function(a10) {
        return a10.getServerSideProps = "Render.getServerSideProps", a10.getStaticProps = "Render.getStaticProps", a10.renderToString = "Render.renderToString", a10.renderDocument = "Render.renderDocument", a10.createBodyResult = "Render.createBodyResult", a10;
      }(as || {}), at = function(a10) {
        return a10.renderToString = "AppRender.renderToString", a10.renderToReadableStream = "AppRender.renderToReadableStream", a10.getBodyResult = "AppRender.getBodyResult", a10.fetch = "AppRender.fetch", a10;
      }(at || {}), au = function(a10) {
        return a10.executeRoute = "Router.executeRoute", a10;
      }(au || {}), av = function(a10) {
        return a10.runHandler = "Node.runHandler", a10;
      }(av || {}), aw = function(a10) {
        return a10.runHandler = "AppRouteRouteHandlers.runHandler", a10;
      }(aw || {}), ax = function(a10) {
        return a10.generateMetadata = "ResolveMetadata.generateMetadata", a10.generateViewport = "ResolveMetadata.generateViewport", a10;
      }(ax || {}), ay = function(a10) {
        return a10.execute = "Middleware.execute", a10;
      }(ay || {});
      let az = /* @__PURE__ */ new Set(["Middleware.execute", "BaseServer.handleRequest", "Render.getServerSideProps", "Render.getStaticProps", "AppRender.fetch", "AppRender.getBodyResult", "Render.renderDocument", "Node.runHandler", "AppRouteRouteHandlers.runHandler", "ResolveMetadata.generateMetadata", "ResolveMetadata.generateViewport", "NextNodeServer.createComponentTree", "NextNodeServer.findPageComponents", "NextNodeServer.getLayoutOrPageModule", "NextNodeServer.startResponse", "NextNodeServer.clientComponentLoading"]), aA = /* @__PURE__ */ new Set(["NextNodeServer.findPageComponents", "NextNodeServer.createComponentTree", "NextNodeServer.clientComponentLoading"]);
      function aB(a10) {
        return null !== a10 && "object" == typeof a10 && "then" in a10 && "function" == typeof a10.then;
      }
      let aC = process.env.NEXT_OTEL_PERFORMANCE_PREFIX, { context: aD, propagation: aE, trace: aF, SpanStatusCode: aG, SpanKind: aH, ROOT_CONTEXT: aI } = d = c(817);
      class aJ extends Error {
        constructor(a10, b10) {
          super(), this.bubble = a10, this.result = b10;
        }
      }
      let aK = (a10, b10) => {
        (function(a11) {
          return "object" == typeof a11 && null !== a11 && a11 instanceof aJ;
        })(b10) && b10.bubble ? a10.setAttribute("next.bubble", true) : (b10 && (a10.recordException(b10), a10.setAttribute("error.type", b10.name)), a10.setStatus({ code: aG.ERROR, message: null == b10 ? void 0 : b10.message })), a10.end();
      }, aL = /* @__PURE__ */ new Map(), aM = d.createContextKey("next.rootSpanId"), aN = 0, aO = { set(a10, b10, c10) {
        a10.push({ key: b10, value: c10 });
      } };
      class aP {
        getTracerInstance() {
          return aF.getTracer("next.js", "0.0.1");
        }
        getContext() {
          return aD;
        }
        getTracePropagationData() {
          let a10 = aD.active(), b10 = [];
          return aE.inject(a10, b10, aO), b10;
        }
        getActiveScopeSpan() {
          return aF.getSpan(null == aD ? void 0 : aD.active());
        }
        withPropagatedContext(a10, b10, c10) {
          let d10 = aD.active();
          if (aF.getSpanContext(d10)) return b10();
          let e10 = aE.extract(d10, a10, c10);
          return aD.with(e10, b10);
        }
        trace(...a10) {
          var b10;
          let [c10, d10, e10] = a10, { fn: f10, options: g10 } = "function" == typeof d10 ? { fn: d10, options: {} } : { fn: e10, options: { ...d10 } }, h10 = g10.spanName ?? c10;
          if (!az.has(c10) && "1" !== process.env.NEXT_OTEL_VERBOSE || g10.hideSpan) return f10();
          let i10 = this.getSpanContext((null == g10 ? void 0 : g10.parentSpan) ?? this.getActiveScopeSpan()), j2 = false;
          i10 ? (null == (b10 = aF.getSpanContext(i10)) ? void 0 : b10.isRemote) && (j2 = true) : (i10 = (null == aD ? void 0 : aD.active()) ?? aI, j2 = true);
          let k2 = aN++;
          return g10.attributes = { "next.span_name": h10, "next.span_type": c10, ...g10.attributes }, aD.with(i10.setValue(aM, k2), () => this.getTracerInstance().startActiveSpan(h10, g10, (a11) => {
            let b11;
            aC && c10 && aA.has(c10) && (b11 = "performance" in globalThis && "measure" in performance ? globalThis.performance.now() : void 0);
            let d11 = false, e11 = () => {
              !d11 && (d11 = true, aL.delete(k2), b11 && performance.measure(`${aC}:next-${(c10.split(".").pop() || "").replace(/[A-Z]/g, (a12) => "-" + a12.toLowerCase())}`, { start: b11, end: performance.now() }));
            };
            if (j2 && aL.set(k2, new Map(Object.entries(g10.attributes ?? {}))), f10.length > 1) try {
              return f10(a11, (b12) => aK(a11, b12));
            } catch (b12) {
              throw aK(a11, b12), b12;
            } finally {
              e11();
            }
            try {
              let b12 = f10(a11);
              if (aB(b12)) return b12.then((b13) => (a11.end(), b13)).catch((b13) => {
                throw aK(a11, b13), b13;
              }).finally(e11);
              return a11.end(), e11(), b12;
            } catch (b12) {
              throw aK(a11, b12), e11(), b12;
            }
          }));
        }
        wrap(...a10) {
          let b10 = this, [c10, d10, e10] = 3 === a10.length ? a10 : [a10[0], {}, a10[1]];
          return az.has(c10) || "1" === process.env.NEXT_OTEL_VERBOSE ? function() {
            let a11 = d10;
            "function" == typeof a11 && "function" == typeof e10 && (a11 = a11.apply(this, arguments));
            let f10 = arguments.length - 1, g10 = arguments[f10];
            if ("function" != typeof g10) return b10.trace(c10, a11, () => e10.apply(this, arguments));
            {
              let d11 = b10.getContext().bind(aD.active(), g10);
              return b10.trace(c10, a11, (a12, b11) => (arguments[f10] = function(a13) {
                return null == b11 || b11(a13), d11.apply(this, arguments);
              }, e10.apply(this, arguments)));
            }
          } : e10;
        }
        startSpan(...a10) {
          let [b10, c10] = a10, d10 = this.getSpanContext((null == c10 ? void 0 : c10.parentSpan) ?? this.getActiveScopeSpan());
          return this.getTracerInstance().startSpan(b10, c10, d10);
        }
        getSpanContext(a10) {
          return a10 ? aF.setSpan(aD.active(), a10) : void 0;
        }
        getRootSpanAttributes() {
          let a10 = aD.active().getValue(aM);
          return aL.get(a10);
        }
        setRootSpanAttribute(a10, b10) {
          let c10 = aD.active().getValue(aM), d10 = aL.get(c10);
          d10 && d10.set(a10, b10);
        }
      }
      let aQ = (() => {
        let a10 = new aP();
        return () => a10;
      })(), aR = "__prerender_bypass";
      Symbol("__next_preview_data"), Symbol(aR);
      class aS {
        constructor(a10, b10, c10, d10) {
          var e10;
          let f10 = a10 && function(a11, b11) {
            let c11 = ac.from(a11.headers);
            return { isOnDemandRevalidate: c11.get("x-prerender-revalidate") === b11.previewModeId, revalidateOnlyGenerated: c11.has("x-prerender-revalidate-if-generated") };
          }(b10, a10).isOnDemandRevalidate, g10 = null == (e10 = c10.get(aR)) ? void 0 : e10.value;
          this._isEnabled = !!(!f10 && g10 && a10 && g10 === a10.previewModeId), this._previewModeId = null == a10 ? void 0 : a10.previewModeId, this._mutableCookies = d10;
        }
        get isEnabled() {
          return this._isEnabled;
        }
        enable() {
          if (!this._previewModeId) throw Object.defineProperty(Error("Invariant: previewProps missing previewModeId this should never happen"), "__NEXT_ERROR_CODE", { value: "E93", enumerable: false, configurable: true });
          this._mutableCookies.set({ name: aR, value: this._previewModeId, httpOnly: true, sameSite: "none", secure: true, path: "/" }), this._isEnabled = true;
        }
        disable() {
          this._mutableCookies.set({ name: aR, value: "", httpOnly: true, sameSite: "none", secure: true, path: "/", expires: /* @__PURE__ */ new Date(0) }), this._isEnabled = false;
        }
      }
      function aT(a10, b10) {
        if ("x-middleware-set-cookie" in a10.headers && "string" == typeof a10.headers["x-middleware-set-cookie"]) {
          let c10 = a10.headers["x-middleware-set-cookie"], d10 = new Headers();
          for (let a11 of y(c10)) d10.append("set-cookie", a11);
          for (let a11 of new R.ResponseCookies(d10).getAll()) b10.set(a11);
        }
      }
      let aU = ag();
      var aV = c(213), aW = c.n(aV);
      class aX extends Error {
        constructor(a10, b10) {
          super("Invariant: " + (a10.endsWith(".") ? a10 : a10 + ".") + " This is a bug in Next.js.", b10), this.name = "InvariantError";
        }
      }
      class aY {
        constructor(a10, b10, c10) {
          this.prev = null, this.next = null, this.key = a10, this.data = b10, this.size = c10;
        }
      }
      class aZ {
        constructor() {
          this.prev = null, this.next = null;
        }
      }
      class a$ {
        constructor(a10, b10, c10) {
          this.cache = /* @__PURE__ */ new Map(), this.totalSize = 0, this.maxSize = a10, this.calculateSize = b10, this.onEvict = c10, this.head = new aZ(), this.tail = new aZ(), this.head.next = this.tail, this.tail.prev = this.head;
        }
        addToHead(a10) {
          a10.prev = this.head, a10.next = this.head.next, this.head.next.prev = a10, this.head.next = a10;
        }
        removeNode(a10) {
          a10.prev.next = a10.next, a10.next.prev = a10.prev;
        }
        moveToHead(a10) {
          this.removeNode(a10), this.addToHead(a10);
        }
        removeTail() {
          let a10 = this.tail.prev;
          return this.removeNode(a10), a10;
        }
        set(a10, b10) {
          let c10 = (null == this.calculateSize ? void 0 : this.calculateSize.call(this, b10)) ?? 1;
          if (c10 <= 0) throw Object.defineProperty(Error(`LRUCache: calculateSize returned ${c10}, but size must be > 0. Items with size 0 would never be evicted, causing unbounded cache growth.`), "__NEXT_ERROR_CODE", { value: "E789", enumerable: false, configurable: true });
          if (c10 > this.maxSize) return void console.warn("Single item size exceeds maxSize");
          let d10 = this.cache.get(a10);
          if (d10) d10.data = b10, this.totalSize = this.totalSize - d10.size + c10, d10.size = c10, this.moveToHead(d10);
          else {
            let d11 = new aY(a10, b10, c10);
            this.cache.set(a10, d11), this.addToHead(d11), this.totalSize += c10;
          }
          for (; this.totalSize > this.maxSize && this.cache.size > 0; ) {
            let a11 = this.removeTail();
            this.cache.delete(a11.key), this.totalSize -= a11.size, null == this.onEvict || this.onEvict.call(this, a11.key, a11.data);
          }
        }
        has(a10) {
          return this.cache.has(a10);
        }
        get(a10) {
          let b10 = this.cache.get(a10);
          if (b10) return this.moveToHead(b10), b10.data;
        }
        *[Symbol.iterator]() {
          let a10 = this.head.next;
          for (; a10 && a10 !== this.tail; ) {
            let b10 = a10;
            yield [b10.key, b10.data], a10 = a10.next;
          }
        }
        remove(a10) {
          let b10 = this.cache.get(a10);
          b10 && (this.removeNode(b10), this.cache.delete(a10), this.totalSize -= b10.size);
        }
        get size() {
          return this.cache.size;
        }
        get currentSize() {
          return this.totalSize;
        }
      }
      c(356).Buffer, new a$(52428800, (a10) => a10.size), process.env.NEXT_PRIVATE_DEBUG_CACHE && console.debug.bind(console, "DefaultCacheHandler:"), process.env.NEXT_PRIVATE_DEBUG_CACHE && ((a10, ...b10) => {
        console.log(`use-cache: ${a10}`, ...b10);
      }), Symbol.for("@next/cache-handlers");
      let a_ = Symbol.for("@next/cache-handlers-map"), a0 = Symbol.for("@next/cache-handlers-set"), a1 = globalThis;
      function a2() {
        if (a1[a_]) return a1[a_].entries();
      }
      async function a3(a10, b10) {
        if (!a10) return b10();
        let c10 = a4(a10);
        try {
          return await b10();
        } finally {
          let b11 = function(a11, b12) {
            let c11 = new Set(a11.pendingRevalidatedTags), d10 = new Set(a11.pendingRevalidateWrites);
            return { pendingRevalidatedTags: b12.pendingRevalidatedTags.filter((a12) => !c11.has(a12)), pendingRevalidates: Object.fromEntries(Object.entries(b12.pendingRevalidates).filter(([b13]) => !(b13 in a11.pendingRevalidates))), pendingRevalidateWrites: b12.pendingRevalidateWrites.filter((a12) => !d10.has(a12)) };
          }(c10, a4(a10));
          await a6(a10, b11);
        }
      }
      function a4(a10) {
        return { pendingRevalidatedTags: a10.pendingRevalidatedTags ? [...a10.pendingRevalidatedTags] : [], pendingRevalidates: { ...a10.pendingRevalidates }, pendingRevalidateWrites: a10.pendingRevalidateWrites ? [...a10.pendingRevalidateWrites] : [] };
      }
      async function a5(a10, b10) {
        if (0 === a10.length) return;
        let c10 = [];
        b10 && c10.push(b10.revalidateTag(a10));
        let d10 = function() {
          if (a1[a0]) return a1[a0].values();
        }();
        if (d10) for (let b11 of d10) c10.push(b11.expireTags(...a10));
        await Promise.all(c10);
      }
      async function a6(a10, b10) {
        let c10 = (null == b10 ? void 0 : b10.pendingRevalidatedTags) ?? a10.pendingRevalidatedTags ?? [], d10 = (null == b10 ? void 0 : b10.pendingRevalidates) ?? a10.pendingRevalidates ?? {}, e10 = (null == b10 ? void 0 : b10.pendingRevalidateWrites) ?? a10.pendingRevalidateWrites ?? [];
        return Promise.all([a5(c10, a10.incrementalCache), ...Object.values(d10), ...e10]);
      }
      let a7 = Object.defineProperty(Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available"), "__NEXT_ERROR_CODE", { value: "E504", enumerable: false, configurable: true });
      class a8 {
        disable() {
          throw a7;
        }
        getStore() {
        }
        run() {
          throw a7;
        }
        exit() {
          throw a7;
        }
        enterWith() {
          throw a7;
        }
        static bind(a10) {
          return a10;
        }
      }
      let a9 = "undefined" != typeof globalThis && globalThis.AsyncLocalStorage, ba = a9 ? new a9() : new a8();
      class bb {
        constructor({ waitUntil: a10, onClose: b10, onTaskError: c10 }) {
          this.workUnitStores = /* @__PURE__ */ new Set(), this.waitUntil = a10, this.onClose = b10, this.onTaskError = c10, this.callbackQueue = new (aW())(), this.callbackQueue.pause();
        }
        after(a10) {
          if (aB(a10)) this.waitUntil || bc(), this.waitUntil(a10.catch((a11) => this.reportTaskError("promise", a11)));
          else if ("function" == typeof a10) this.addCallback(a10);
          else throw Object.defineProperty(Error("`after()`: Argument must be a promise or a function"), "__NEXT_ERROR_CODE", { value: "E50", enumerable: false, configurable: true });
        }
        addCallback(a10) {
          var b10;
          this.waitUntil || bc();
          let c10 = aU.getStore();
          c10 && this.workUnitStores.add(c10);
          let d10 = ba.getStore(), e10 = d10 ? d10.rootTaskSpawnPhase : null == c10 ? void 0 : c10.phase;
          this.runCallbacksOnClosePromise || (this.runCallbacksOnClosePromise = this.runCallbacksOnClose(), this.waitUntil(this.runCallbacksOnClosePromise));
          let f10 = (b10 = async () => {
            try {
              await ba.run({ rootTaskSpawnPhase: e10 }, () => a10());
            } catch (a11) {
              this.reportTaskError("function", a11);
            }
          }, a9 ? a9.bind(b10) : a8.bind(b10));
          this.callbackQueue.add(f10);
        }
        async runCallbacksOnClose() {
          return await new Promise((a10) => this.onClose(a10)), this.runCallbacks();
        }
        async runCallbacks() {
          if (0 === this.callbackQueue.size) return;
          for (let a11 of this.workUnitStores) a11.phase = "after";
          let a10 = ah.getStore();
          if (!a10) throw Object.defineProperty(new aX("Missing workStore in AfterContext.runCallbacks"), "__NEXT_ERROR_CODE", { value: "E547", enumerable: false, configurable: true });
          return a3(a10, () => (this.callbackQueue.start(), this.callbackQueue.onIdle()));
        }
        reportTaskError(a10, b10) {
          if (console.error("promise" === a10 ? "A promise passed to `after()` rejected:" : "An error occurred in a function passed to `after()`:", b10), this.onTaskError) try {
            null == this.onTaskError || this.onTaskError.call(this, b10);
          } catch (a11) {
            console.error(Object.defineProperty(new aX("`onTaskError` threw while handling an error thrown from an `after` task", { cause: a11 }), "__NEXT_ERROR_CODE", { value: "E569", enumerable: false, configurable: true }));
          }
        }
      }
      function bc() {
        throw Object.defineProperty(Error("`after()` will not work correctly, because `waitUntil` is not available in the current environment."), "__NEXT_ERROR_CODE", { value: "E91", enumerable: false, configurable: true });
      }
      function bd(a10) {
        let b10, c10 = { then: (d10, e10) => (b10 || (b10 = a10()), b10.then((a11) => {
          c10.value = a11;
        }).catch(() => {
        }), b10.then(d10, e10)) };
        return c10;
      }
      class be {
        onClose(a10) {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot subscribe to a closed CloseController"), "__NEXT_ERROR_CODE", { value: "E365", enumerable: false, configurable: true });
          this.target.addEventListener("close", a10), this.listeners++;
        }
        dispatchClose() {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot close a CloseController multiple times"), "__NEXT_ERROR_CODE", { value: "E229", enumerable: false, configurable: true });
          this.listeners > 0 && this.target.dispatchEvent(new Event("close")), this.isClosed = true;
        }
        constructor() {
          this.target = new EventTarget(), this.listeners = 0, this.isClosed = false;
        }
      }
      function bf() {
        return { previewModeId: process.env.__NEXT_PREVIEW_MODE_ID || "", previewModeSigningKey: process.env.__NEXT_PREVIEW_MODE_SIGNING_KEY || "", previewModeEncryptionKey: process.env.__NEXT_PREVIEW_MODE_ENCRYPTION_KEY || "" };
      }
      let bg = Symbol.for("@next/request-context");
      async function bh(a10, b10, c10) {
        let d10 = [], e10 = c10 && c10.size > 0;
        for (let b11 of ((a11) => {
          let b12 = ["/layout"];
          if (a11.startsWith("/")) {
            let c11 = a11.split("/");
            for (let a12 = 1; a12 < c11.length + 1; a12++) {
              let d11 = c11.slice(0, a12).join("/");
              d11 && (d11.endsWith("/page") || d11.endsWith("/route") || (d11 = `${d11}${!d11.endsWith("/") ? "/" : ""}layout`), b12.push(d11));
            }
          }
          return b12;
        })(a10)) b11 = `${w}${b11}`, d10.push(b11);
        if (b10.pathname && !e10) {
          let a11 = `${w}${b10.pathname}`;
          d10.push(a11);
        }
        return { tags: d10, expirationsByCacheKind: function(a11) {
          let b11 = /* @__PURE__ */ new Map(), c11 = a2();
          if (c11) for (let [d11, e11] of c11) "getExpiration" in e11 && b11.set(d11, bd(async () => e11.getExpiration(...a11)));
          return b11;
        }(d10) };
      }
      class bi extends T {
        constructor(a10) {
          super(a10.input, a10.init), this.sourcePage = a10.page;
        }
        get request() {
          throw Object.defineProperty(new t({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new t({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        waitUntil() {
          throw Object.defineProperty(new t({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      let bj = { keys: (a10) => Array.from(a10.keys()), get: (a10, b10) => a10.get(b10) ?? void 0 }, bk = (a10, b10) => aQ().withPropagatedContext(a10.headers, b10, bj), bl = false;
      async function bm(a10) {
        var b10;
        let d10, e10;
        if (!bl && (bl = true, "true" === process.env.NEXT_PRIVATE_TEST_PROXY)) {
          let { interceptTestApis: a11, wrapRequestHandler: b11 } = c(720);
          a11(), bk = b11(bk);
        }
        await r();
        let f10 = void 0 !== globalThis.__BUILD_MANIFEST;
        a10.request.url = a10.request.url.replace(/\.rsc($|\?)/, "$1");
        let g10 = a10.bypassNextUrl ? new URL(a10.request.url) : new Q(a10.request.url, { headers: a10.request.headers, nextConfig: a10.request.nextConfig });
        for (let a11 of [...g10.searchParams.keys()]) {
          let b11 = g10.searchParams.getAll(a11), c10 = function(a12) {
            for (let b12 of ["nxtP", "nxtI"]) if (a12 !== b12 && a12.startsWith(b12)) return a12.substring(b12.length);
            return null;
          }(a11);
          if (c10) {
            for (let a12 of (g10.searchParams.delete(c10), b11)) g10.searchParams.append(c10, a12);
            g10.searchParams.delete(a11);
          }
        }
        let h10 = process.env.__NEXT_BUILD_ID || "";
        "buildId" in g10 && (h10 = g10.buildId || "", g10.buildId = "");
        let i10 = function(a11) {
          let b11 = new Headers();
          for (let [c10, d11] of Object.entries(a11)) for (let a12 of Array.isArray(d11) ? d11 : [d11]) void 0 !== a12 && ("number" == typeof a12 && (a12 = a12.toString()), b11.append(c10, a12));
          return b11;
        }(a10.request.headers), j2 = i10.has("x-nextjs-data"), k2 = "1" === i10.get("rsc");
        j2 && "/index" === g10.pathname && (g10.pathname = "/");
        let l2 = /* @__PURE__ */ new Map();
        if (!f10) for (let a11 of _) {
          let b11 = i10.get(a11);
          null !== b11 && (l2.set(a11, b11), i10.delete(a11));
        }
        let m2 = g10.searchParams.get(aa), n2 = new bi({ page: a10.page, input: function(a11) {
          let b11 = "string" == typeof a11, c10 = b11 ? new URL(a11) : a11;
          return c10.searchParams.delete(aa), b11 ? c10.toString() : c10;
        }(g10).toString(), init: { body: a10.request.body, headers: i10, method: a10.request.method, nextConfig: a10.request.nextConfig, signal: a10.request.signal } });
        j2 && Object.defineProperty(n2, "__isData", { enumerable: false, value: true }), !globalThis.__incrementalCacheShared && a10.IncrementalCache && (globalThis.__incrementalCache = new a10.IncrementalCache({ CurCacheHandler: a10.incrementalCacheHandler, minimalMode: true, fetchCacheKeyPrefix: "", dev: false, requestHeaders: a10.request.headers, getPrerenderManifest: () => ({ version: -1, routes: {}, dynamicRoutes: {}, notFoundRoutes: [], preview: bf() }) }));
        let o2 = a10.request.waitUntil ?? (null == (b10 = function() {
          let a11 = globalThis[bg];
          return null == a11 ? void 0 : a11.get();
        }()) ? void 0 : b10.waitUntil), p2 = new F({ request: n2, page: a10.page, context: o2 ? { waitUntil: o2 } : void 0 });
        if ((d10 = await bk(n2, () => {
          if ("/middleware" === a10.page || "/src/middleware" === a10.page) {
            let b11 = p2.waitUntil.bind(p2), c10 = new be();
            return aQ().trace(ay.execute, { spanName: `middleware ${n2.method} ${n2.nextUrl.pathname}`, attributes: { "http.target": n2.nextUrl.pathname, "http.method": n2.method } }, async () => {
              try {
                var d11, f11, g11, i11, j3, k3;
                let l3 = bf(), m3 = await bh("/", n2.nextUrl, null), o3 = (j3 = n2.nextUrl, k3 = (a11) => {
                  e10 = a11;
                }, function(a11, b12, c11, d12, e11, f12, g12, h11, i12, j4, k4, l4) {
                  function m4(a12) {
                    c11 && c11.setHeader("Set-Cookie", a12);
                  }
                  let n3 = {};
                  return { type: "request", phase: a11, implicitTags: f12, url: { pathname: d12.pathname, search: d12.search ?? "" }, rootParams: e11, get headers() {
                    return n3.headers || (n3.headers = function(a12) {
                      let b13 = ac.from(a12);
                      for (let a13 of _) b13.delete(a13);
                      return ac.seal(b13);
                    }(b12.headers)), n3.headers;
                  }, get cookies() {
                    if (!n3.cookies) {
                      let a12 = new R.RequestCookies(ac.from(b12.headers));
                      aT(b12, a12), n3.cookies = aj.seal(a12);
                    }
                    return n3.cookies;
                  }, set cookies(value) {
                    n3.cookies = value;
                  }, get mutableCookies() {
                    if (!n3.mutableCookies) {
                      let a12 = function(a13, b13) {
                        let c12 = new R.RequestCookies(ac.from(a13));
                        return al.wrap(c12, b13);
                      }(b12.headers, g12 || (c11 ? m4 : void 0));
                      aT(b12, a12), n3.mutableCookies = a12;
                    }
                    return n3.mutableCookies;
                  }, get userspaceMutableCookies() {
                    return n3.userspaceMutableCookies || (n3.userspaceMutableCookies = function(a12) {
                      let b13 = new Proxy(a12.mutableCookies, { get(c12, d13, e12) {
                        switch (d13) {
                          case "delete":
                            return function(...d14) {
                              return am(a12, "cookies().delete"), c12.delete(...d14), b13;
                            };
                          case "set":
                            return function(...d14) {
                              return am(a12, "cookies().set"), c12.set(...d14), b13;
                            };
                          default:
                            return U.get(c12, d13, e12);
                        }
                      } });
                      return b13;
                    }(this)), n3.userspaceMutableCookies;
                  }, get draftMode() {
                    return n3.draftMode || (n3.draftMode = new aS(i12, b12, this.cookies, this.mutableCookies)), n3.draftMode;
                  }, renderResumeDataCache: h11 ?? null, isHmrRefresh: j4, serverComponentsHmrCache: k4 || globalThis.__serverComponentsHmrCache, devFallbackParams: null };
                }("action", n2, void 0, j3, {}, m3, k3, void 0, l3, false, void 0, null)), q3 = function({ page: a11, renderOpts: b12, isPrefetchRequest: c11, buildId: d12, previouslyRevalidatedTags: e11 }) {
                  var f12;
                  let g12 = !b12.shouldWaitOnAllReady && !b12.supportsDynamicResponse && !b12.isDraftMode && !b12.isPossibleServerAction, h11 = b12.dev ?? false, i12 = h11 || g12 && (!!process.env.NEXT_DEBUG_BUILD || "1" === process.env.NEXT_SSG_FETCH_METRICS), j4 = { isStaticGeneration: g12, page: a11, route: (f12 = a11.split("/").reduce((a12, b13, c12, d13) => b13 ? "(" === b13[0] && b13.endsWith(")") || "@" === b13[0] || ("page" === b13 || "route" === b13) && c12 === d13.length - 1 ? a12 : a12 + "/" + b13 : a12, "")).startsWith("/") ? f12 : "/" + f12, incrementalCache: b12.incrementalCache || globalThis.__incrementalCache, cacheLifeProfiles: b12.cacheLifeProfiles, isRevalidate: b12.isRevalidate, isBuildTimePrerendering: b12.nextExport, hasReadableErrorStacks: b12.hasReadableErrorStacks, fetchCache: b12.fetchCache, isOnDemandRevalidate: b12.isOnDemandRevalidate, isDraftMode: b12.isDraftMode, isPrefetchRequest: c11, buildId: d12, reactLoadableManifest: (null == b12 ? void 0 : b12.reactLoadableManifest) || {}, assetPrefix: (null == b12 ? void 0 : b12.assetPrefix) || "", afterContext: function(a12) {
                    let { waitUntil: b13, onClose: c12, onAfterTaskError: d13 } = a12;
                    return new bb({ waitUntil: b13, onClose: c12, onTaskError: d13 });
                  }(b12), cacheComponentsEnabled: b12.experimental.cacheComponents, dev: h11, previouslyRevalidatedTags: e11, refreshTagsByCacheKind: function() {
                    let a12 = /* @__PURE__ */ new Map(), b13 = a2();
                    if (b13) for (let [c12, d13] of b13) "refreshTags" in d13 && a12.set(c12, bd(async () => d13.refreshTags()));
                    return a12;
                  }(), runInCleanSnapshot: a9 ? a9.snapshot() : function(a12, ...b13) {
                    return a12(...b13);
                  }, shouldTrackFetchMetrics: i12 };
                  return b12.store = j4, j4;
                }({ page: "/", renderOpts: { cacheLifeProfiles: null == (f11 = a10.request.nextConfig) || null == (d11 = f11.experimental) ? void 0 : d11.cacheLife, experimental: { isRoutePPREnabled: false, cacheComponents: false, authInterrupts: !!(null == (i11 = a10.request.nextConfig) || null == (g11 = i11.experimental) ? void 0 : g11.authInterrupts) }, supportsDynamicResponse: true, waitUntil: b11, onClose: c10.onClose.bind(c10), onAfterTaskError: void 0 }, isPrefetchRequest: "1" === n2.headers.get($), buildId: h10 ?? "", previouslyRevalidatedTags: [] });
                return await ah.run(q3, () => aU.run(o3, a10.handler, n2, p2));
              } finally {
                setTimeout(() => {
                  c10.dispatchClose();
                }, 0);
              }
            });
          }
          return a10.handler(n2, p2);
        })) && !(d10 instanceof Response)) throw Object.defineProperty(TypeError("Expected an instance of Response to be returned"), "__NEXT_ERROR_CODE", { value: "E567", enumerable: false, configurable: true });
        d10 && e10 && d10.headers.set("set-cookie", e10);
        let q2 = null == d10 ? void 0 : d10.headers.get("x-middleware-rewrite");
        if (d10 && q2 && (k2 || !f10)) {
          let b11 = new Q(q2, { forceLocale: true, headers: a10.request.headers, nextConfig: a10.request.nextConfig });
          f10 || b11.host !== n2.nextUrl.host || (b11.buildId = h10 || b11.buildId, d10.headers.set("x-middleware-rewrite", String(b11)));
          let { url: c10, isRelative: e11 } = Z(b11.toString(), g10.toString());
          !f10 && j2 && d10.headers.set("x-nextjs-rewrite", c10), k2 && e11 && (g10.pathname !== b11.pathname && d10.headers.set("x-nextjs-rewritten-path", b11.pathname), g10.search !== b11.search && d10.headers.set("x-nextjs-rewritten-query", b11.search.slice(1)));
        }
        if (d10 && q2 && k2 && m2) {
          let a11 = new URL(q2);
          a11.searchParams.has(aa) || (a11.searchParams.set(aa, m2), d10.headers.set("x-middleware-rewrite", a11.toString()));
        }
        let s2 = null == d10 ? void 0 : d10.headers.get("Location");
        if (d10 && s2 && !f10) {
          let b11 = new Q(s2, { forceLocale: false, headers: a10.request.headers, nextConfig: a10.request.nextConfig });
          d10 = new Response(d10.body, d10), b11.host === g10.host && (b11.buildId = h10 || b11.buildId, d10.headers.set("Location", b11.toString())), j2 && (d10.headers.delete("Location"), d10.headers.set("x-nextjs-redirect", Z(b11.toString(), g10.toString()).url));
        }
        let t2 = d10 || Y.next(), u2 = t2.headers.get("x-middleware-override-headers"), v2 = [];
        if (u2) {
          for (let [a11, b11] of l2) t2.headers.set(`x-middleware-request-${a11}`, b11), v2.push(a11);
          v2.length > 0 && t2.headers.set("x-middleware-override-headers", u2 + "," + v2.join(","));
        }
        return { response: t2, waitUntil: ("internal" === p2[D].kind ? Promise.all(p2[D].promises).then(() => {
        }) : void 0) ?? Promise.resolve(), fetchMetrics: n2.fetchMetrics };
      }
      c(449), "undefined" == typeof URLPattern || URLPattern;
      var bn = c(814);
      if (/* @__PURE__ */ new WeakMap(), bn.unstable_postpone, false === function(a10) {
        return a10.includes("needs to bail out of prerendering at this point because it used") && a10.includes("Learn more: https://nextjs.org/docs/messages/ppr-caught-error");
      }("Route %%% needs to bail out of prerendering at this point because it used ^^^. React throws this special object to indicate where. It should not be caught by your own try/catch. Learn more: https://nextjs.org/docs/messages/ppr-caught-error")) throw Object.defineProperty(Error("Invariant: isDynamicPostpone misidentified a postpone reason. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E296", enumerable: false, configurable: true });
      RegExp(`\\n\\s+at Suspense \\(<anonymous>\\)(?:(?!\\n\\s+at (?:body|div|main|section|article|aside|header|footer|nav|form|p|span|h1|h2|h3|h4|h5|h6) \\(<anonymous>\\))[\\s\\S])*?\\n\\s+at __next_root_layout_boundary__ \\([^\\n]*\\)`), RegExp(`\\n\\s+at __next_metadata_boundary__[\\n\\s]`), RegExp(`\\n\\s+at __next_viewport_boundary__[\\n\\s]`), RegExp(`\\n\\s+at __next_outlet_boundary__[\\n\\s]`), ag();
      let { env: bo, stdout: bp } = (null == (e = globalThis) ? void 0 : e.process) ?? {}, bq = bo && !bo.NO_COLOR && (bo.FORCE_COLOR || (null == bp ? void 0 : bp.isTTY) && !bo.CI && "dumb" !== bo.TERM), br = (a10, b10, c10, d10) => {
        let e10 = a10.substring(0, d10) + c10, f10 = a10.substring(d10 + b10.length), g10 = f10.indexOf(b10);
        return ~g10 ? e10 + br(f10, b10, c10, g10) : e10 + f10;
      }, bs = (a10, b10, c10 = a10) => bq ? (d10) => {
        let e10 = "" + d10, f10 = e10.indexOf(b10, a10.length);
        return ~f10 ? a10 + br(e10, b10, c10, f10) + b10 : a10 + e10 + b10;
      } : String, bt = bs("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m");
      bs("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"), bs("\x1B[3m", "\x1B[23m"), bs("\x1B[4m", "\x1B[24m"), bs("\x1B[7m", "\x1B[27m"), bs("\x1B[8m", "\x1B[28m"), bs("\x1B[9m", "\x1B[29m"), bs("\x1B[30m", "\x1B[39m");
      let bu = bs("\x1B[31m", "\x1B[39m"), bv = bs("\x1B[32m", "\x1B[39m"), bw = bs("\x1B[33m", "\x1B[39m");
      bs("\x1B[34m", "\x1B[39m");
      let bx = bs("\x1B[35m", "\x1B[39m");
      bs("\x1B[38;2;173;127;168m", "\x1B[39m"), bs("\x1B[36m", "\x1B[39m");
      let by = bs("\x1B[37m", "\x1B[39m");
      function bz(a10, b10, c10) {
        function d10(c11, d11) {
          if (c11._zod || Object.defineProperty(c11, "_zod", { value: { def: d11, constr: g10, traits: /* @__PURE__ */ new Set() }, enumerable: false }), c11._zod.traits.has(a10)) return;
          c11._zod.traits.add(a10), b10(c11, d11);
          let e11 = g10.prototype, f11 = Object.keys(e11);
          for (let a11 = 0; a11 < f11.length; a11++) {
            let b11 = f11[a11];
            b11 in c11 || (c11[b11] = e11[b11].bind(c11));
          }
        }
        let e10 = c10?.Parent ?? Object;
        class f10 extends e10 {
        }
        function g10(a11) {
          var b11;
          let e11 = c10?.Parent ? new f10() : this;
          for (let c11 of (d10(e11, a11), (b11 = e11._zod).deferred ?? (b11.deferred = []), e11._zod.deferred)) c11();
          return e11;
        }
        return Object.defineProperty(f10, "name", { value: a10 }), Object.defineProperty(g10, "init", { value: d10 }), Object.defineProperty(g10, Symbol.hasInstance, { value: (b11) => !!c10?.Parent && b11 instanceof c10.Parent || b11?._zod?.traits?.has(a10) }), Object.defineProperty(g10, "name", { value: a10 }), g10;
      }
      bs("\x1B[90m", "\x1B[39m"), bs("\x1B[40m", "\x1B[49m"), bs("\x1B[41m", "\x1B[49m"), bs("\x1B[42m", "\x1B[49m"), bs("\x1B[43m", "\x1B[49m"), bs("\x1B[44m", "\x1B[49m"), bs("\x1B[45m", "\x1B[49m"), bs("\x1B[46m", "\x1B[49m"), bs("\x1B[47m", "\x1B[49m"), by(bt("\u25CB")), bu(bt("\u2A2F")), bw(bt("\u26A0")), by(bt(" ")), bv(bt("\u2713")), bx(bt("\xBB")), new a$(1e4, (a10) => a10.length), /* @__PURE__ */ new WeakMap(), Object.freeze({ status: "aborted" }), Symbol("zod_brand");
      class bA extends Error {
        constructor() {
          super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
        }
      }
      class bB extends Error {
        constructor(a10) {
          super(`Encountered unidirectional transform during encode: ${a10}`), this.name = "ZodEncodeError";
        }
      }
      let bC = {};
      function bD(a10) {
        return a10 && Object.assign(bC, a10), bC;
      }
      function bE(a10) {
        let b10 = Object.values(a10).filter((a11) => "number" == typeof a11);
        return Object.entries(a10).filter(([a11, c10]) => -1 === b10.indexOf(+a11)).map(([a11, b11]) => b11);
      }
      function bF(a10, b10 = "|") {
        return a10.map((a11) => bZ(a11)).join(b10);
      }
      function bG(a10, b10) {
        return "bigint" == typeof b10 ? b10.toString() : b10;
      }
      function bH(a10) {
        return { get value() {
          {
            let b10 = a10();
            return Object.defineProperty(this, "value", { value: b10 }), b10;
          }
        } };
      }
      function bI(a10) {
        return null == a10;
      }
      function bJ(a10) {
        let b10 = +!!a10.startsWith("^"), c10 = a10.endsWith("$") ? a10.length - 1 : a10.length;
        return a10.slice(b10, c10);
      }
      let bK = Symbol("evaluating");
      function bL(a10, b10, c10) {
        let d10;
        Object.defineProperty(a10, b10, { get() {
          if (d10 !== bK) return void 0 === d10 && (d10 = bK, d10 = c10()), d10;
        }, set(c11) {
          Object.defineProperty(a10, b10, { value: c11 });
        }, configurable: true });
      }
      function bM(a10, b10, c10) {
        Object.defineProperty(a10, b10, { value: c10, writable: true, enumerable: true, configurable: true });
      }
      function bN(...a10) {
        let b10 = {};
        for (let c10 of a10) Object.assign(b10, Object.getOwnPropertyDescriptors(c10));
        return Object.defineProperties({}, b10);
      }
      function bO(a10) {
        return JSON.stringify(a10);
      }
      let bP = "captureStackTrace" in Error ? Error.captureStackTrace : (...a10) => {
      };
      function bQ(a10) {
        return "object" == typeof a10 && null !== a10 && !Array.isArray(a10);
      }
      let bR = bH(() => {
        if ("undefined" != typeof navigator && navigator?.userAgent?.includes("Cloudflare")) return false;
        try {
          return Function(""), true;
        } catch (a10) {
          return false;
        }
      });
      function bS(a10) {
        if (false === bQ(a10)) return false;
        let b10 = a10.constructor;
        if (void 0 === b10 || "function" != typeof b10) return true;
        let c10 = b10.prototype;
        return false !== bQ(c10) && false !== Object.prototype.hasOwnProperty.call(c10, "isPrototypeOf");
      }
      function bT(a10) {
        return bS(a10) ? { ...a10 } : Array.isArray(a10) ? [...a10] : a10;
      }
      let bU = /* @__PURE__ */ new Set(["string", "number", "symbol"]), bV = /* @__PURE__ */ new Set(["string", "number", "bigint", "boolean", "symbol", "undefined"]);
      function bW(a10) {
        return a10.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
      function bX(a10, b10, c10) {
        let d10 = new a10._zod.constr(b10 ?? a10._zod.def);
        return (!b10 || c10?.parent) && (d10._zod.parent = a10), d10;
      }
      function bY(a10) {
        if (!a10) return {};
        if ("string" == typeof a10) return { error: () => a10 };
        if (a10?.message !== void 0) {
          if (a10?.error !== void 0) throw Error("Cannot specify both `message` and `error` params");
          a10.error = a10.message;
        }
        return (delete a10.message, "string" == typeof a10.error) ? { ...a10, error: () => a10.error } : a10;
      }
      function bZ(a10) {
        return "bigint" == typeof a10 ? a10.toString() + "n" : "string" == typeof a10 ? `"${a10}"` : `${a10}`;
      }
      let b$ = { safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER], int32: [-2147483648, 2147483647], uint32: [0, 4294967295], float32: [-34028234663852886e22, 34028234663852886e22], float64: [-Number.MAX_VALUE, Number.MAX_VALUE] }, b_ = { int64: [BigInt("-9223372036854775808"), BigInt("9223372036854775807")], uint64: [BigInt(0), BigInt("18446744073709551615")] };
      function b0(a10, b10 = 0) {
        if (true === a10.aborted) return true;
        for (let c10 = b10; c10 < a10.issues.length; c10++) if (a10.issues[c10]?.continue !== true) return true;
        return false;
      }
      function b1(a10, b10) {
        return b10.map((b11) => (b11.path ?? (b11.path = []), b11.path.unshift(a10), b11));
      }
      function b2(a10) {
        return "string" == typeof a10 ? a10 : a10?.message;
      }
      function b3(a10, b10, c10) {
        let d10 = { ...a10, path: a10.path ?? [] };
        return a10.message || (d10.message = b2(a10.inst?._zod.def?.error?.(a10)) ?? b2(b10?.error?.(a10)) ?? b2(c10.customError?.(a10)) ?? b2(c10.localeError?.(a10)) ?? "Invalid input"), delete d10.inst, delete d10.continue, b10?.reportInput || delete d10.input, d10;
      }
      function b4(a10) {
        return a10 instanceof Set ? "set" : a10 instanceof Map ? "map" : a10 instanceof File ? "file" : "unknown";
      }
      function b5(a10) {
        return Array.isArray(a10) ? "array" : "string" == typeof a10 ? "string" : "unknown";
      }
      function b6(...a10) {
        let [b10, c10, d10] = a10;
        return "string" == typeof b10 ? { message: b10, code: "custom", input: c10, inst: d10 } : { ...b10 };
      }
      let b7 = (a10, b10) => {
        a10.name = "$ZodError", Object.defineProperty(a10, "_zod", { value: a10._zod, enumerable: false }), Object.defineProperty(a10, "issues", { value: b10, enumerable: false }), a10.message = JSON.stringify(b10, bG, 2), Object.defineProperty(a10, "toString", { value: () => a10.message, enumerable: false });
      }, b8 = bz("$ZodError", b7), b9 = bz("$ZodError", b7, { Parent: Error }), ca = (a10) => (b10, c10, d10, e10) => {
        let f10 = d10 ? Object.assign(d10, { async: false }) : { async: false }, g10 = b10._zod.run({ value: c10, issues: [] }, f10);
        if (g10 instanceof Promise) throw new bA();
        if (g10.issues.length) {
          let b11 = new (e10?.Err ?? a10)(g10.issues.map((a11) => b3(a11, f10, bD())));
          throw bP(b11, e10?.callee), b11;
        }
        return g10.value;
      }, cb = ca(b9), cc = (a10) => async (b10, c10, d10, e10) => {
        let f10 = d10 ? Object.assign(d10, { async: true }) : { async: true }, g10 = b10._zod.run({ value: c10, issues: [] }, f10);
        if (g10 instanceof Promise && (g10 = await g10), g10.issues.length) {
          let b11 = new (e10?.Err ?? a10)(g10.issues.map((a11) => b3(a11, f10, bD())));
          throw bP(b11, e10?.callee), b11;
        }
        return g10.value;
      }, cd = cc(b9), ce = (a10) => (b10, c10, d10) => {
        let e10 = d10 ? { ...d10, async: false } : { async: false }, f10 = b10._zod.run({ value: c10, issues: [] }, e10);
        if (f10 instanceof Promise) throw new bA();
        return f10.issues.length ? { success: false, error: new (a10 ?? b8)(f10.issues.map((a11) => b3(a11, e10, bD()))) } : { success: true, data: f10.value };
      }, cf = ce(b9), cg = (a10) => async (b10, c10, d10) => {
        let e10 = d10 ? Object.assign(d10, { async: true }) : { async: true }, f10 = b10._zod.run({ value: c10, issues: [] }, e10);
        return f10 instanceof Promise && (f10 = await f10), f10.issues.length ? { success: false, error: new a10(f10.issues.map((a11) => b3(a11, e10, bD()))) } : { success: true, data: f10.value };
      }, ch = cg(b9), ci = /^[cC][^\s-]{8,}$/, cj = /^[0-9a-z]+$/, ck = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/, cl = /^[0-9a-vA-V]{20}$/, cm = /^[A-Za-z0-9]{27}$/, cn = /^[a-zA-Z0-9_-]{21}$/, co = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/, cp = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, cq = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, cr = (a10) => a10 ? RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${a10}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/, cs = cr(4), ct = cr(6), cu = cr(7), cv = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/, cw = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, cx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, cy = /^[^\s@"]{1,64}@[^\s@]{1,255}$/u, cz = cy, cA = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      function cB() {
        return RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u");
      }
      let cC = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, cD = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/, cE = (a10) => {
        let b10 = bW(a10 ?? ":");
        return RegExp(`^(?:[0-9A-F]{2}${b10}){5}[0-9A-F]{2}$|^(?:[0-9a-f]{2}${b10}){5}[0-9a-f]{2}$`);
      }, cF = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, cG = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, cH = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, cI = /^[A-Za-z0-9_-]*$/, cJ = /^(?=.{1,253}\.?$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?)*\.?$/, cK = /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/, cL = /^\+[1-9]\d{6,14}$/, cM = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))", cN = RegExp(`^${cM}$`);
      function cO(a10) {
        let b10 = "(?:[01]\\d|2[0-3]):[0-5]\\d";
        return "number" == typeof a10.precision ? -1 === a10.precision ? `${b10}` : 0 === a10.precision ? `${b10}:[0-5]\\d` : `${b10}:[0-5]\\d\\.\\d{${a10.precision}}` : `${b10}(?::[0-5]\\d(?:\\.\\d+)?)?`;
      }
      function cP(a10) {
        return RegExp(`^${cO(a10)}$`);
      }
      function cQ(a10) {
        let b10 = cO({ precision: a10.precision }), c10 = ["Z"];
        a10.local && c10.push(""), a10.offset && c10.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
        let d10 = `${b10}(?:${c10.join("|")})`;
        return RegExp(`^${cM}T(?:${d10})$`);
      }
      let cR = (a10) => {
        let b10 = a10 ? `[\\s\\S]{${a10?.minimum ?? 0},${a10?.maximum ?? ""}}` : "[\\s\\S]*";
        return RegExp(`^${b10}$`);
      }, cS = /^-?\d+n?$/, cT = /^-?\d+$/, cU = /^-?\d+(?:\.\d+)?$/, cV = /^(?:true|false)$/i, cW = /^null$/i, cX = /^undefined$/i, cY = /^[^A-Z]*$/, cZ = /^[^a-z]*$/, c$ = /^[0-9a-fA-F]*$/;
      function c_(a10, b10) {
        return RegExp(`^[A-Za-z0-9+/]{${a10}}${b10}$`);
      }
      function c0(a10) {
        return RegExp(`^[A-Za-z0-9_-]{${a10}}$`);
      }
      let c1 = /^[0-9a-fA-F]{32}$/, c2 = c_(22, "=="), c3 = c0(22), c4 = /^[0-9a-fA-F]{40}$/, c5 = c_(27, "="), c6 = c0(27), c7 = /^[0-9a-fA-F]{64}$/, c8 = c_(43, "="), c9 = c0(43), da = /^[0-9a-fA-F]{96}$/, db = c_(64, ""), dc = c0(64), dd = /^[0-9a-fA-F]{128}$/, de = c_(86, "=="), df = c0(86), dg = bz("$ZodCheck", (a10, b10) => {
        var c10;
        a10._zod ?? (a10._zod = {}), a10._zod.def = b10, (c10 = a10._zod).onattach ?? (c10.onattach = []);
      }), dh = { number: "number", bigint: "bigint", object: "date" }, di = bz("$ZodCheckLessThan", (a10, b10) => {
        dg.init(a10, b10);
        let c10 = dh[typeof b10.value];
        a10._zod.onattach.push((a11) => {
          let c11 = a11._zod.bag, d10 = (b10.inclusive ? c11.maximum : c11.exclusiveMaximum) ?? 1 / 0;
          b10.value < d10 && (b10.inclusive ? c11.maximum = b10.value : c11.exclusiveMaximum = b10.value);
        }), a10._zod.check = (d10) => {
          (b10.inclusive ? d10.value <= b10.value : d10.value < b10.value) || d10.issues.push({ origin: c10, code: "too_big", maximum: "object" == typeof b10.value ? b10.value.getTime() : b10.value, input: d10.value, inclusive: b10.inclusive, inst: a10, continue: !b10.abort });
        };
      }), dj = bz("$ZodCheckGreaterThan", (a10, b10) => {
        dg.init(a10, b10);
        let c10 = dh[typeof b10.value];
        a10._zod.onattach.push((a11) => {
          let c11 = a11._zod.bag, d10 = (b10.inclusive ? c11.minimum : c11.exclusiveMinimum) ?? -1 / 0;
          b10.value > d10 && (b10.inclusive ? c11.minimum = b10.value : c11.exclusiveMinimum = b10.value);
        }), a10._zod.check = (d10) => {
          (b10.inclusive ? d10.value >= b10.value : d10.value > b10.value) || d10.issues.push({ origin: c10, code: "too_small", minimum: "object" == typeof b10.value ? b10.value.getTime() : b10.value, input: d10.value, inclusive: b10.inclusive, inst: a10, continue: !b10.abort });
        };
      }), dk = bz("$ZodCheckMultipleOf", (a10, b10) => {
        dg.init(a10, b10), a10._zod.onattach.push((a11) => {
          var c10;
          (c10 = a11._zod.bag).multipleOf ?? (c10.multipleOf = b10.value);
        }), a10._zod.check = (c10) => {
          if (typeof c10.value != typeof b10.value) throw Error("Cannot mix number and bigint in multiple_of check.");
          ("bigint" == typeof c10.value ? c10.value % b10.value === BigInt(0) : 0 === function(a11, b11) {
            let c11 = (a11.toString().split(".")[1] || "").length, d10 = b11.toString(), e10 = (d10.split(".")[1] || "").length;
            if (0 === e10 && /\d?e-\d?/.test(d10)) {
              let a12 = d10.match(/\d?e-(\d?)/);
              a12?.[1] && (e10 = Number.parseInt(a12[1]));
            }
            let f10 = c11 > e10 ? c11 : e10;
            return Number.parseInt(a11.toFixed(f10).replace(".", "")) % Number.parseInt(b11.toFixed(f10).replace(".", "")) / 10 ** f10;
          }(c10.value, b10.value)) || c10.issues.push({ origin: typeof c10.value, code: "not_multiple_of", divisor: b10.value, input: c10.value, inst: a10, continue: !b10.abort });
        };
      }), dl = bz("$ZodCheckNumberFormat", (a10, b10) => {
        dg.init(a10, b10), b10.format = b10.format || "float64";
        let c10 = b10.format?.includes("int"), d10 = c10 ? "int" : "number", [e10, f10] = b$[b10.format];
        a10._zod.onattach.push((a11) => {
          let d11 = a11._zod.bag;
          d11.format = b10.format, d11.minimum = e10, d11.maximum = f10, c10 && (d11.pattern = cT);
        }), a10._zod.check = (g10) => {
          let h10 = g10.value;
          if (c10) {
            if (!Number.isInteger(h10)) return void g10.issues.push({ expected: d10, format: b10.format, code: "invalid_type", continue: false, input: h10, inst: a10 });
            if (!Number.isSafeInteger(h10)) return void (h10 > 0 ? g10.issues.push({ input: h10, code: "too_big", maximum: Number.MAX_SAFE_INTEGER, note: "Integers must be within the safe integer range.", inst: a10, origin: d10, inclusive: true, continue: !b10.abort }) : g10.issues.push({ input: h10, code: "too_small", minimum: Number.MIN_SAFE_INTEGER, note: "Integers must be within the safe integer range.", inst: a10, origin: d10, inclusive: true, continue: !b10.abort }));
          }
          h10 < e10 && g10.issues.push({ origin: "number", input: h10, code: "too_small", minimum: e10, inclusive: true, inst: a10, continue: !b10.abort }), h10 > f10 && g10.issues.push({ origin: "number", input: h10, code: "too_big", maximum: f10, inclusive: true, inst: a10, continue: !b10.abort });
        };
      }), dm = bz("$ZodCheckBigIntFormat", (a10, b10) => {
        dg.init(a10, b10);
        let [c10, d10] = b_[b10.format];
        a10._zod.onattach.push((a11) => {
          let e10 = a11._zod.bag;
          e10.format = b10.format, e10.minimum = c10, e10.maximum = d10;
        }), a10._zod.check = (e10) => {
          let f10 = e10.value;
          f10 < c10 && e10.issues.push({ origin: "bigint", input: f10, code: "too_small", minimum: c10, inclusive: true, inst: a10, continue: !b10.abort }), f10 > d10 && e10.issues.push({ origin: "bigint", input: f10, code: "too_big", maximum: d10, inclusive: true, inst: a10, continue: !b10.abort });
        };
      }), dn = bz("$ZodCheckMaxSize", (a10, b10) => {
        var c10;
        dg.init(a10, b10), (c10 = a10._zod.def).when ?? (c10.when = (a11) => {
          let b11 = a11.value;
          return !bI(b11) && void 0 !== b11.size;
        }), a10._zod.onattach.push((a11) => {
          let c11 = a11._zod.bag.maximum ?? 1 / 0;
          b10.maximum < c11 && (a11._zod.bag.maximum = b10.maximum);
        }), a10._zod.check = (c11) => {
          let d10 = c11.value;
          d10.size <= b10.maximum || c11.issues.push({ origin: b4(d10), code: "too_big", maximum: b10.maximum, inclusive: true, input: d10, inst: a10, continue: !b10.abort });
        };
      }), dp = bz("$ZodCheckMinSize", (a10, b10) => {
        var c10;
        dg.init(a10, b10), (c10 = a10._zod.def).when ?? (c10.when = (a11) => {
          let b11 = a11.value;
          return !bI(b11) && void 0 !== b11.size;
        }), a10._zod.onattach.push((a11) => {
          let c11 = a11._zod.bag.minimum ?? -1 / 0;
          b10.minimum > c11 && (a11._zod.bag.minimum = b10.minimum);
        }), a10._zod.check = (c11) => {
          let d10 = c11.value;
          d10.size >= b10.minimum || c11.issues.push({ origin: b4(d10), code: "too_small", minimum: b10.minimum, inclusive: true, input: d10, inst: a10, continue: !b10.abort });
        };
      }), dq = bz("$ZodCheckSizeEquals", (a10, b10) => {
        var c10;
        dg.init(a10, b10), (c10 = a10._zod.def).when ?? (c10.when = (a11) => {
          let b11 = a11.value;
          return !bI(b11) && void 0 !== b11.size;
        }), a10._zod.onattach.push((a11) => {
          let c11 = a11._zod.bag;
          c11.minimum = b10.size, c11.maximum = b10.size, c11.size = b10.size;
        }), a10._zod.check = (c11) => {
          let d10 = c11.value, e10 = d10.size;
          if (e10 === b10.size) return;
          let f10 = e10 > b10.size;
          c11.issues.push({ origin: b4(d10), ...f10 ? { code: "too_big", maximum: b10.size } : { code: "too_small", minimum: b10.size }, inclusive: true, exact: true, input: c11.value, inst: a10, continue: !b10.abort });
        };
      }), dr = bz("$ZodCheckMaxLength", (a10, b10) => {
        var c10;
        dg.init(a10, b10), (c10 = a10._zod.def).when ?? (c10.when = (a11) => {
          let b11 = a11.value;
          return !bI(b11) && void 0 !== b11.length;
        }), a10._zod.onattach.push((a11) => {
          let c11 = a11._zod.bag.maximum ?? 1 / 0;
          b10.maximum < c11 && (a11._zod.bag.maximum = b10.maximum);
        }), a10._zod.check = (c11) => {
          let d10 = c11.value;
          if (d10.length <= b10.maximum) return;
          let e10 = b5(d10);
          c11.issues.push({ origin: e10, code: "too_big", maximum: b10.maximum, inclusive: true, input: d10, inst: a10, continue: !b10.abort });
        };
      }), ds = bz("$ZodCheckMinLength", (a10, b10) => {
        var c10;
        dg.init(a10, b10), (c10 = a10._zod.def).when ?? (c10.when = (a11) => {
          let b11 = a11.value;
          return !bI(b11) && void 0 !== b11.length;
        }), a10._zod.onattach.push((a11) => {
          let c11 = a11._zod.bag.minimum ?? -1 / 0;
          b10.minimum > c11 && (a11._zod.bag.minimum = b10.minimum);
        }), a10._zod.check = (c11) => {
          let d10 = c11.value;
          if (d10.length >= b10.minimum) return;
          let e10 = b5(d10);
          c11.issues.push({ origin: e10, code: "too_small", minimum: b10.minimum, inclusive: true, input: d10, inst: a10, continue: !b10.abort });
        };
      }), dt = bz("$ZodCheckLengthEquals", (a10, b10) => {
        var c10;
        dg.init(a10, b10), (c10 = a10._zod.def).when ?? (c10.when = (a11) => {
          let b11 = a11.value;
          return !bI(b11) && void 0 !== b11.length;
        }), a10._zod.onattach.push((a11) => {
          let c11 = a11._zod.bag;
          c11.minimum = b10.length, c11.maximum = b10.length, c11.length = b10.length;
        }), a10._zod.check = (c11) => {
          let d10 = c11.value, e10 = d10.length;
          if (e10 === b10.length) return;
          let f10 = b5(d10), g10 = e10 > b10.length;
          c11.issues.push({ origin: f10, ...g10 ? { code: "too_big", maximum: b10.length } : { code: "too_small", minimum: b10.length }, inclusive: true, exact: true, input: c11.value, inst: a10, continue: !b10.abort });
        };
      }), du = bz("$ZodCheckStringFormat", (a10, b10) => {
        var c10, d10;
        dg.init(a10, b10), a10._zod.onattach.push((a11) => {
          let c11 = a11._zod.bag;
          c11.format = b10.format, b10.pattern && (c11.patterns ?? (c11.patterns = /* @__PURE__ */ new Set()), c11.patterns.add(b10.pattern));
        }), b10.pattern ? (c10 = a10._zod).check ?? (c10.check = (c11) => {
          b10.pattern.lastIndex = 0, b10.pattern.test(c11.value) || c11.issues.push({ origin: "string", code: "invalid_format", format: b10.format, input: c11.value, ...b10.pattern ? { pattern: b10.pattern.toString() } : {}, inst: a10, continue: !b10.abort });
        }) : (d10 = a10._zod).check ?? (d10.check = () => {
        });
      }), dv = bz("$ZodCheckRegex", (a10, b10) => {
        du.init(a10, b10), a10._zod.check = (c10) => {
          b10.pattern.lastIndex = 0, b10.pattern.test(c10.value) || c10.issues.push({ origin: "string", code: "invalid_format", format: "regex", input: c10.value, pattern: b10.pattern.toString(), inst: a10, continue: !b10.abort });
        };
      }), dw = bz("$ZodCheckLowerCase", (a10, b10) => {
        b10.pattern ?? (b10.pattern = cY), du.init(a10, b10);
      }), dx = bz("$ZodCheckUpperCase", (a10, b10) => {
        b10.pattern ?? (b10.pattern = cZ), du.init(a10, b10);
      }), dy = bz("$ZodCheckIncludes", (a10, b10) => {
        dg.init(a10, b10);
        let c10 = bW(b10.includes), d10 = new RegExp("number" == typeof b10.position ? `^.{${b10.position}}${c10}` : c10);
        b10.pattern = d10, a10._zod.onattach.push((a11) => {
          let b11 = a11._zod.bag;
          b11.patterns ?? (b11.patterns = /* @__PURE__ */ new Set()), b11.patterns.add(d10);
        }), a10._zod.check = (c11) => {
          c11.value.includes(b10.includes, b10.position) || c11.issues.push({ origin: "string", code: "invalid_format", format: "includes", includes: b10.includes, input: c11.value, inst: a10, continue: !b10.abort });
        };
      }), dz = bz("$ZodCheckStartsWith", (a10, b10) => {
        dg.init(a10, b10);
        let c10 = RegExp(`^${bW(b10.prefix)}.*`);
        b10.pattern ?? (b10.pattern = c10), a10._zod.onattach.push((a11) => {
          let b11 = a11._zod.bag;
          b11.patterns ?? (b11.patterns = /* @__PURE__ */ new Set()), b11.patterns.add(c10);
        }), a10._zod.check = (c11) => {
          c11.value.startsWith(b10.prefix) || c11.issues.push({ origin: "string", code: "invalid_format", format: "starts_with", prefix: b10.prefix, input: c11.value, inst: a10, continue: !b10.abort });
        };
      }), dA = bz("$ZodCheckEndsWith", (a10, b10) => {
        dg.init(a10, b10);
        let c10 = RegExp(`.*${bW(b10.suffix)}$`);
        b10.pattern ?? (b10.pattern = c10), a10._zod.onattach.push((a11) => {
          let b11 = a11._zod.bag;
          b11.patterns ?? (b11.patterns = /* @__PURE__ */ new Set()), b11.patterns.add(c10);
        }), a10._zod.check = (c11) => {
          c11.value.endsWith(b10.suffix) || c11.issues.push({ origin: "string", code: "invalid_format", format: "ends_with", suffix: b10.suffix, input: c11.value, inst: a10, continue: !b10.abort });
        };
      });
      function dB(a10, b10, c10) {
        a10.issues.length && b10.issues.push(...b1(c10, a10.issues));
      }
      let dC = bz("$ZodCheckProperty", (a10, b10) => {
        dg.init(a10, b10), a10._zod.check = (a11) => {
          let c10 = b10.schema._zod.run({ value: a11.value[b10.property], issues: [] }, {});
          if (c10 instanceof Promise) return c10.then((c11) => dB(c11, a11, b10.property));
          dB(c10, a11, b10.property);
        };
      }), dD = bz("$ZodCheckMimeType", (a10, b10) => {
        dg.init(a10, b10);
        let c10 = new Set(b10.mime);
        a10._zod.onattach.push((a11) => {
          a11._zod.bag.mime = b10.mime;
        }), a10._zod.check = (d10) => {
          c10.has(d10.value.type) || d10.issues.push({ code: "invalid_value", values: b10.mime, input: d10.value.type, inst: a10, continue: !b10.abort });
        };
      }), dE = bz("$ZodCheckOverwrite", (a10, b10) => {
        dg.init(a10, b10), a10._zod.check = (a11) => {
          a11.value = b10.tx(a11.value);
        };
      });
      class dF {
        constructor(a10 = []) {
          this.content = [], this.indent = 0, this && (this.args = a10);
        }
        indented(a10) {
          this.indent += 1, a10(this), this.indent -= 1;
        }
        write(a10) {
          if ("function" == typeof a10) {
            a10(this, { execution: "sync" }), a10(this, { execution: "async" });
            return;
          }
          let b10 = a10.split("\n").filter((a11) => a11), c10 = Math.min(...b10.map((a11) => a11.length - a11.trimStart().length));
          for (let a11 of b10.map((a12) => a12.slice(c10)).map((a12) => " ".repeat(2 * this.indent) + a12)) this.content.push(a11);
        }
        compile() {
          return Function(...this?.args, [...(this?.content ?? [""]).map((a10) => `  ${a10}`)].join("\n"));
        }
      }
      let dG = { major: 4, minor: 3, patch: 6 }, dH = bz("$ZodType", (a10, b10) => {
        var c10;
        a10 ?? (a10 = {}), a10._zod.def = b10, a10._zod.bag = a10._zod.bag || {}, a10._zod.version = dG;
        let d10 = [...a10._zod.def.checks ?? []];
        for (let b11 of (a10._zod.traits.has("$ZodCheck") && d10.unshift(a10), d10)) for (let c11 of b11._zod.onattach) c11(a10);
        if (0 === d10.length) (c10 = a10._zod).deferred ?? (c10.deferred = []), a10._zod.deferred?.push(() => {
          a10._zod.run = a10._zod.parse;
        });
        else {
          let b11 = (a11, b12, c12) => {
            let d11, e10 = b0(a11);
            for (let f10 of b12) {
              if (f10._zod.def.when) {
                if (!f10._zod.def.when(a11)) continue;
              } else if (e10) continue;
              let b13 = a11.issues.length, g10 = f10._zod.check(a11);
              if (g10 instanceof Promise && c12?.async === false) throw new bA();
              if (d11 || g10 instanceof Promise) d11 = (d11 ?? Promise.resolve()).then(async () => {
                await g10, a11.issues.length !== b13 && (e10 || (e10 = b0(a11, b13)));
              });
              else {
                if (a11.issues.length === b13) continue;
                e10 || (e10 = b0(a11, b13));
              }
            }
            return d11 ? d11.then(() => a11) : a11;
          }, c11 = (c12, e10, f10) => {
            if (b0(c12)) return c12.aborted = true, c12;
            let g10 = b11(e10, d10, f10);
            if (g10 instanceof Promise) {
              if (false === f10.async) throw new bA();
              return g10.then((b12) => a10._zod.parse(b12, f10));
            }
            return a10._zod.parse(g10, f10);
          };
          a10._zod.run = (e10, f10) => {
            if (f10.skipChecks) return a10._zod.parse(e10, f10);
            if ("backward" === f10.direction) {
              let b12 = a10._zod.parse({ value: e10.value, issues: [] }, { ...f10, skipChecks: true });
              return b12 instanceof Promise ? b12.then((a11) => c11(a11, e10, f10)) : c11(b12, e10, f10);
            }
            let g10 = a10._zod.parse(e10, f10);
            if (g10 instanceof Promise) {
              if (false === f10.async) throw new bA();
              return g10.then((a11) => b11(a11, d10, f10));
            }
            return b11(g10, d10, f10);
          };
        }
        bL(a10, "~standard", () => ({ validate: (b11) => {
          try {
            let c11 = cf(a10, b11);
            return c11.success ? { value: c11.data } : { issues: c11.error?.issues };
          } catch (c11) {
            return ch(a10, b11).then((a11) => a11.success ? { value: a11.data } : { issues: a11.error?.issues });
          }
        }, vendor: "zod", version: 1 }));
      }), dI = bz("$ZodString", (a10, b10) => {
        dH.init(a10, b10), a10._zod.pattern = [...a10?._zod.bag?.patterns ?? []].pop() ?? cR(a10._zod.bag), a10._zod.parse = (c10, d10) => {
          if (b10.coerce) try {
            c10.value = String(c10.value);
          } catch (a11) {
          }
          return "string" == typeof c10.value || c10.issues.push({ expected: "string", code: "invalid_type", input: c10.value, inst: a10 }), c10;
        };
      }), dJ = bz("$ZodStringFormat", (a10, b10) => {
        du.init(a10, b10), dI.init(a10, b10);
      }), dK = bz("$ZodGUID", (a10, b10) => {
        b10.pattern ?? (b10.pattern = cq), dJ.init(a10, b10);
      }), dL = bz("$ZodUUID", (a10, b10) => {
        if (b10.version) {
          let a11 = { v1: 1, v2: 2, v3: 3, v4: 4, v5: 5, v6: 6, v7: 7, v8: 8 }[b10.version];
          if (void 0 === a11) throw Error(`Invalid UUID version: "${b10.version}"`);
          b10.pattern ?? (b10.pattern = cr(a11));
        } else b10.pattern ?? (b10.pattern = cr());
        dJ.init(a10, b10);
      }), dM = bz("$ZodEmail", (a10, b10) => {
        b10.pattern ?? (b10.pattern = cv), dJ.init(a10, b10);
      }), dN = bz("$ZodURL", (a10, b10) => {
        dJ.init(a10, b10), a10._zod.check = (c10) => {
          try {
            let d10 = c10.value.trim(), e10 = new URL(d10);
            b10.hostname && (b10.hostname.lastIndex = 0, b10.hostname.test(e10.hostname) || c10.issues.push({ code: "invalid_format", format: "url", note: "Invalid hostname", pattern: b10.hostname.source, input: c10.value, inst: a10, continue: !b10.abort })), b10.protocol && (b10.protocol.lastIndex = 0, b10.protocol.test(e10.protocol.endsWith(":") ? e10.protocol.slice(0, -1) : e10.protocol) || c10.issues.push({ code: "invalid_format", format: "url", note: "Invalid protocol", pattern: b10.protocol.source, input: c10.value, inst: a10, continue: !b10.abort })), b10.normalize ? c10.value = e10.href : c10.value = d10;
            return;
          } catch (d10) {
            c10.issues.push({ code: "invalid_format", format: "url", input: c10.value, inst: a10, continue: !b10.abort });
          }
        };
      }), dO = bz("$ZodEmoji", (a10, b10) => {
        b10.pattern ?? (b10.pattern = cB()), dJ.init(a10, b10);
      }), dP = bz("$ZodNanoID", (a10, b10) => {
        b10.pattern ?? (b10.pattern = cn), dJ.init(a10, b10);
      }), dQ = bz("$ZodCUID", (a10, b10) => {
        b10.pattern ?? (b10.pattern = ci), dJ.init(a10, b10);
      }), dR = bz("$ZodCUID2", (a10, b10) => {
        b10.pattern ?? (b10.pattern = cj), dJ.init(a10, b10);
      }), dS = bz("$ZodULID", (a10, b10) => {
        b10.pattern ?? (b10.pattern = ck), dJ.init(a10, b10);
      }), dT = bz("$ZodXID", (a10, b10) => {
        b10.pattern ?? (b10.pattern = cl), dJ.init(a10, b10);
      }), dU = bz("$ZodKSUID", (a10, b10) => {
        b10.pattern ?? (b10.pattern = cm), dJ.init(a10, b10);
      }), dV = bz("$ZodISODateTime", (a10, b10) => {
        b10.pattern ?? (b10.pattern = cQ(b10)), dJ.init(a10, b10);
      }), dW = bz("$ZodISODate", (a10, b10) => {
        b10.pattern ?? (b10.pattern = cN), dJ.init(a10, b10);
      }), dX = bz("$ZodISOTime", (a10, b10) => {
        b10.pattern ?? (b10.pattern = cP(b10)), dJ.init(a10, b10);
      }), dY = bz("$ZodISODuration", (a10, b10) => {
        b10.pattern ?? (b10.pattern = co), dJ.init(a10, b10);
      }), dZ = bz("$ZodIPv4", (a10, b10) => {
        b10.pattern ?? (b10.pattern = cC), dJ.init(a10, b10), a10._zod.bag.format = "ipv4";
      }), d$ = bz("$ZodIPv6", (a10, b10) => {
        b10.pattern ?? (b10.pattern = cD), dJ.init(a10, b10), a10._zod.bag.format = "ipv6", a10._zod.check = (c10) => {
          try {
            new URL(`http://[${c10.value}]`);
          } catch {
            c10.issues.push({ code: "invalid_format", format: "ipv6", input: c10.value, inst: a10, continue: !b10.abort });
          }
        };
      }), d_ = bz("$ZodMAC", (a10, b10) => {
        b10.pattern ?? (b10.pattern = cE(b10.delimiter)), dJ.init(a10, b10), a10._zod.bag.format = "mac";
      }), d0 = bz("$ZodCIDRv4", (a10, b10) => {
        b10.pattern ?? (b10.pattern = cF), dJ.init(a10, b10);
      }), d1 = bz("$ZodCIDRv6", (a10, b10) => {
        b10.pattern ?? (b10.pattern = cG), dJ.init(a10, b10), a10._zod.check = (c10) => {
          let d10 = c10.value.split("/");
          try {
            if (2 !== d10.length) throw Error();
            let [a11, b11] = d10;
            if (!b11) throw Error();
            let c11 = Number(b11);
            if (`${c11}` !== b11 || c11 < 0 || c11 > 128) throw Error();
            new URL(`http://[${a11}]`);
          } catch {
            c10.issues.push({ code: "invalid_format", format: "cidrv6", input: c10.value, inst: a10, continue: !b10.abort });
          }
        };
      });
      function d2(a10) {
        if ("" === a10) return true;
        if (a10.length % 4 != 0) return false;
        try {
          return atob(a10), true;
        } catch {
          return false;
        }
      }
      let d3 = bz("$ZodBase64", (a10, b10) => {
        b10.pattern ?? (b10.pattern = cH), dJ.init(a10, b10), a10._zod.bag.contentEncoding = "base64", a10._zod.check = (c10) => {
          d2(c10.value) || c10.issues.push({ code: "invalid_format", format: "base64", input: c10.value, inst: a10, continue: !b10.abort });
        };
      }), d4 = bz("$ZodBase64URL", (a10, b10) => {
        b10.pattern ?? (b10.pattern = cI), dJ.init(a10, b10), a10._zod.bag.contentEncoding = "base64url", a10._zod.check = (c10) => {
          !function(a11) {
            if (!cI.test(a11)) return false;
            let b11 = a11.replace(/[-_]/g, (a12) => "-" === a12 ? "+" : "/");
            return d2(b11.padEnd(4 * Math.ceil(b11.length / 4), "="));
          }(c10.value) && c10.issues.push({ code: "invalid_format", format: "base64url", input: c10.value, inst: a10, continue: !b10.abort });
        };
      }), d5 = bz("$ZodE164", (a10, b10) => {
        b10.pattern ?? (b10.pattern = cL), dJ.init(a10, b10);
      }), d6 = bz("$ZodJWT", (a10, b10) => {
        dJ.init(a10, b10), a10._zod.check = (c10) => {
          !function(a11, b11 = null) {
            try {
              let c11 = a11.split(".");
              if (3 !== c11.length) return false;
              let [d10] = c11;
              if (!d10) return false;
              let e10 = JSON.parse(atob(d10));
              if ("typ" in e10 && e10?.typ !== "JWT" || !e10.alg || b11 && (!("alg" in e10) || e10.alg !== b11)) return false;
              return true;
            } catch {
              return false;
            }
          }(c10.value, b10.alg) && c10.issues.push({ code: "invalid_format", format: "jwt", input: c10.value, inst: a10, continue: !b10.abort });
        };
      }), d7 = bz("$ZodCustomStringFormat", (a10, b10) => {
        dJ.init(a10, b10), a10._zod.check = (c10) => {
          b10.fn(c10.value) || c10.issues.push({ code: "invalid_format", format: b10.format, input: c10.value, inst: a10, continue: !b10.abort });
        };
      }), d8 = bz("$ZodNumber", (a10, b10) => {
        dH.init(a10, b10), a10._zod.pattern = a10._zod.bag.pattern ?? cU, a10._zod.parse = (c10, d10) => {
          if (b10.coerce) try {
            c10.value = Number(c10.value);
          } catch (a11) {
          }
          let e10 = c10.value;
          if ("number" == typeof e10 && !Number.isNaN(e10) && Number.isFinite(e10)) return c10;
          let f10 = "number" == typeof e10 ? Number.isNaN(e10) ? "NaN" : Number.isFinite(e10) ? void 0 : "Infinity" : void 0;
          return c10.issues.push({ expected: "number", code: "invalid_type", input: e10, inst: a10, ...f10 ? { received: f10 } : {} }), c10;
        };
      }), d9 = bz("$ZodNumberFormat", (a10, b10) => {
        dl.init(a10, b10), d8.init(a10, b10);
      }), ea = bz("$ZodBoolean", (a10, b10) => {
        dH.init(a10, b10), a10._zod.pattern = cV, a10._zod.parse = (c10, d10) => {
          if (b10.coerce) try {
            c10.value = !!c10.value;
          } catch (a11) {
          }
          let e10 = c10.value;
          return "boolean" == typeof e10 || c10.issues.push({ expected: "boolean", code: "invalid_type", input: e10, inst: a10 }), c10;
        };
      }), eb = bz("$ZodBigInt", (a10, b10) => {
        dH.init(a10, b10), a10._zod.pattern = cS, a10._zod.parse = (c10, d10) => {
          if (b10.coerce) try {
            c10.value = BigInt(c10.value);
          } catch (a11) {
          }
          return "bigint" == typeof c10.value || c10.issues.push({ expected: "bigint", code: "invalid_type", input: c10.value, inst: a10 }), c10;
        };
      }), ec = bz("$ZodBigIntFormat", (a10, b10) => {
        dm.init(a10, b10), eb.init(a10, b10);
      }), ed = bz("$ZodSymbol", (a10, b10) => {
        dH.init(a10, b10), a10._zod.parse = (b11, c10) => {
          let d10 = b11.value;
          return "symbol" == typeof d10 || b11.issues.push({ expected: "symbol", code: "invalid_type", input: d10, inst: a10 }), b11;
        };
      }), ee = bz("$ZodUndefined", (a10, b10) => {
        dH.init(a10, b10), a10._zod.pattern = cX, a10._zod.values = /* @__PURE__ */ new Set([void 0]), a10._zod.optin = "optional", a10._zod.optout = "optional", a10._zod.parse = (b11, c10) => {
          let d10 = b11.value;
          return void 0 === d10 || b11.issues.push({ expected: "undefined", code: "invalid_type", input: d10, inst: a10 }), b11;
        };
      }), ef = bz("$ZodNull", (a10, b10) => {
        dH.init(a10, b10), a10._zod.pattern = cW, a10._zod.values = /* @__PURE__ */ new Set([null]), a10._zod.parse = (b11, c10) => {
          let d10 = b11.value;
          return null === d10 || b11.issues.push({ expected: "null", code: "invalid_type", input: d10, inst: a10 }), b11;
        };
      }), eg = bz("$ZodAny", (a10, b10) => {
        dH.init(a10, b10), a10._zod.parse = (a11) => a11;
      }), eh = bz("$ZodUnknown", (a10, b10) => {
        dH.init(a10, b10), a10._zod.parse = (a11) => a11;
      }), ei = bz("$ZodNever", (a10, b10) => {
        dH.init(a10, b10), a10._zod.parse = (b11, c10) => (b11.issues.push({ expected: "never", code: "invalid_type", input: b11.value, inst: a10 }), b11);
      }), ej = bz("$ZodVoid", (a10, b10) => {
        dH.init(a10, b10), a10._zod.parse = (b11, c10) => {
          let d10 = b11.value;
          return void 0 === d10 || b11.issues.push({ expected: "void", code: "invalid_type", input: d10, inst: a10 }), b11;
        };
      }), ek = bz("$ZodDate", (a10, b10) => {
        dH.init(a10, b10), a10._zod.parse = (c10, d10) => {
          if (b10.coerce) try {
            c10.value = new Date(c10.value);
          } catch (a11) {
          }
          let e10 = c10.value, f10 = e10 instanceof Date;
          return f10 && !Number.isNaN(e10.getTime()) || c10.issues.push({ expected: "date", code: "invalid_type", input: e10, ...f10 ? { received: "Invalid Date" } : {}, inst: a10 }), c10;
        };
      });
      function el(a10, b10, c10) {
        a10.issues.length && b10.issues.push(...b1(c10, a10.issues)), b10.value[c10] = a10.value;
      }
      let em = bz("$ZodArray", (a10, b10) => {
        dH.init(a10, b10), a10._zod.parse = (c10, d10) => {
          let e10 = c10.value;
          if (!Array.isArray(e10)) return c10.issues.push({ expected: "array", code: "invalid_type", input: e10, inst: a10 }), c10;
          c10.value = Array(e10.length);
          let f10 = [];
          for (let a11 = 0; a11 < e10.length; a11++) {
            let g10 = e10[a11], h10 = b10.element._zod.run({ value: g10, issues: [] }, d10);
            h10 instanceof Promise ? f10.push(h10.then((b11) => el(b11, c10, a11))) : el(h10, c10, a11);
          }
          return f10.length ? Promise.all(f10).then(() => c10) : c10;
        };
      });
      function en(a10, b10, c10, d10, e10) {
        if (a10.issues.length) {
          if (e10 && !(c10 in d10)) return;
          b10.issues.push(...b1(c10, a10.issues));
        }
        void 0 === a10.value ? c10 in d10 && (b10.value[c10] = void 0) : b10.value[c10] = a10.value;
      }
      function eo(a10) {
        var b10;
        let c10 = Object.keys(a10.shape);
        for (let b11 of c10) if (!a10.shape?.[b11]?._zod?.traits?.has("$ZodType")) throw Error(`Invalid element at key "${b11}": expected a Zod schema`);
        let d10 = Object.keys(b10 = a10.shape).filter((a11) => "optional" === b10[a11]._zod.optin && "optional" === b10[a11]._zod.optout);
        return { ...a10, keys: c10, keySet: new Set(c10), numKeys: c10.length, optionalKeys: new Set(d10) };
      }
      function ep(a10, b10, c10, d10, e10, f10) {
        let g10 = [], h10 = e10.keySet, i10 = e10.catchall._zod, j2 = i10.def.type, k2 = "optional" === i10.optout;
        for (let e11 in b10) {
          if (h10.has(e11)) continue;
          if ("never" === j2) {
            g10.push(e11);
            continue;
          }
          let f11 = i10.run({ value: b10[e11], issues: [] }, d10);
          f11 instanceof Promise ? a10.push(f11.then((a11) => en(a11, c10, e11, b10, k2))) : en(f11, c10, e11, b10, k2);
        }
        return (g10.length && c10.issues.push({ code: "unrecognized_keys", keys: g10, input: b10, inst: f10 }), a10.length) ? Promise.all(a10).then(() => c10) : c10;
      }
      let eq = bz("$ZodObject", (a10, b10) => {
        let c10;
        dH.init(a10, b10);
        let d10 = Object.getOwnPropertyDescriptor(b10, "shape");
        if (!d10?.get) {
          let a11 = b10.shape;
          Object.defineProperty(b10, "shape", { get: () => {
            let c11 = { ...a11 };
            return Object.defineProperty(b10, "shape", { value: c11 }), c11;
          } });
        }
        let e10 = bH(() => eo(b10));
        bL(a10._zod, "propValues", () => {
          let a11 = b10.shape, c11 = {};
          for (let b11 in a11) {
            let d11 = a11[b11]._zod;
            if (d11.values) for (let a12 of (c11[b11] ?? (c11[b11] = /* @__PURE__ */ new Set()), d11.values)) c11[b11].add(a12);
          }
          return c11;
        });
        let f10 = b10.catchall;
        a10._zod.parse = (b11, d11) => {
          c10 ?? (c10 = e10.value);
          let g10 = b11.value;
          if (!bQ(g10)) return b11.issues.push({ expected: "object", code: "invalid_type", input: g10, inst: a10 }), b11;
          b11.value = {};
          let h10 = [], i10 = c10.shape;
          for (let a11 of c10.keys) {
            let c11 = i10[a11], e11 = "optional" === c11._zod.optout, f11 = c11._zod.run({ value: g10[a11], issues: [] }, d11);
            f11 instanceof Promise ? h10.push(f11.then((c12) => en(c12, b11, a11, g10, e11))) : en(f11, b11, a11, g10, e11);
          }
          return f10 ? ep(h10, g10, b11, d11, e10.value, a10) : h10.length ? Promise.all(h10).then(() => b11) : b11;
        };
      }), er = bz("$ZodObjectJIT", (a10, b10) => {
        let c10, d10;
        eq.init(a10, b10);
        let e10 = a10._zod.parse, f10 = bH(() => eo(b10)), g10 = !bC.jitless, h10 = g10 && bR.value, i10 = b10.catchall;
        a10._zod.parse = (j2, k2) => {
          d10 ?? (d10 = f10.value);
          let l2 = j2.value;
          return bQ(l2) ? g10 && h10 && k2?.async === false && true !== k2.jitless ? (c10 || (c10 = ((a11) => {
            let b11 = new dF(["shape", "payload", "ctx"]), c11 = f10.value, d11 = (a12) => {
              let b12 = bO(a12);
              return `shape[${b12}]._zod.run({ value: input[${b12}], issues: [] }, ctx)`;
            };
            b11.write("const input = payload.value;");
            let e11 = /* @__PURE__ */ Object.create(null), g11 = 0;
            for (let a12 of c11.keys) e11[a12] = `key_${g11++}`;
            for (let f11 of (b11.write("const newResult = {};"), c11.keys)) {
              let c12 = e11[f11], g12 = bO(f11), h12 = a11[f11], i11 = h12?._zod?.optout === "optional";
              b11.write(`const ${c12} = ${d11(f11)};`), i11 ? b11.write(`
        if (${c12}.issues.length) {
          if (${g12} in input) {
            payload.issues = payload.issues.concat(${c12}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${g12}, ...iss.path] : [${g12}]
            })));
          }
        }
        
        if (${c12}.value === undefined) {
          if (${g12} in input) {
            newResult[${g12}] = undefined;
          }
        } else {
          newResult[${g12}] = ${c12}.value;
        }
        
      `) : b11.write(`
        if (${c12}.issues.length) {
          payload.issues = payload.issues.concat(${c12}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${g12}, ...iss.path] : [${g12}]
          })));
        }
        
        if (${c12}.value === undefined) {
          if (${g12} in input) {
            newResult[${g12}] = undefined;
          }
        } else {
          newResult[${g12}] = ${c12}.value;
        }
        
      `);
            }
            b11.write("payload.value = newResult;"), b11.write("return payload;");
            let h11 = b11.compile();
            return (b12, c12) => h11(a11, b12, c12);
          })(b10.shape)), j2 = c10(j2, k2), i10) ? ep([], l2, j2, k2, d10, a10) : j2 : e10(j2, k2) : (j2.issues.push({ expected: "object", code: "invalid_type", input: l2, inst: a10 }), j2);
        };
      });
      function es(a10, b10, c10, d10) {
        for (let c11 of a10) if (0 === c11.issues.length) return b10.value = c11.value, b10;
        let e10 = a10.filter((a11) => !b0(a11));
        return 1 === e10.length ? (b10.value = e10[0].value, e10[0]) : (b10.issues.push({ code: "invalid_union", input: b10.value, inst: c10, errors: a10.map((a11) => a11.issues.map((a12) => b3(a12, d10, bD()))) }), b10);
      }
      let et = bz("$ZodUnion", (a10, b10) => {
        dH.init(a10, b10), bL(a10._zod, "optin", () => b10.options.some((a11) => "optional" === a11._zod.optin) ? "optional" : void 0), bL(a10._zod, "optout", () => b10.options.some((a11) => "optional" === a11._zod.optout) ? "optional" : void 0), bL(a10._zod, "values", () => {
          if (b10.options.every((a11) => a11._zod.values)) return new Set(b10.options.flatMap((a11) => Array.from(a11._zod.values)));
        }), bL(a10._zod, "pattern", () => {
          if (b10.options.every((a11) => a11._zod.pattern)) {
            let a11 = b10.options.map((a12) => a12._zod.pattern);
            return RegExp(`^(${a11.map((a12) => bJ(a12.source)).join("|")})$`);
          }
        });
        let c10 = 1 === b10.options.length, d10 = b10.options[0]._zod.run;
        a10._zod.parse = (e10, f10) => {
          if (c10) return d10(e10, f10);
          let g10 = false, h10 = [];
          for (let a11 of b10.options) {
            let b11 = a11._zod.run({ value: e10.value, issues: [] }, f10);
            if (b11 instanceof Promise) h10.push(b11), g10 = true;
            else {
              if (0 === b11.issues.length) return b11;
              h10.push(b11);
            }
          }
          return g10 ? Promise.all(h10).then((b11) => es(b11, e10, a10, f10)) : es(h10, e10, a10, f10);
        };
      });
      function eu(a10, b10, c10, d10) {
        let e10 = a10.filter((a11) => 0 === a11.issues.length);
        return 1 === e10.length ? b10.value = e10[0].value : 0 === e10.length ? b10.issues.push({ code: "invalid_union", input: b10.value, inst: c10, errors: a10.map((a11) => a11.issues.map((a12) => b3(a12, d10, bD()))) }) : b10.issues.push({ code: "invalid_union", input: b10.value, inst: c10, errors: [], inclusive: false }), b10;
      }
      let ev = bz("$ZodXor", (a10, b10) => {
        et.init(a10, b10), b10.inclusive = false;
        let c10 = 1 === b10.options.length, d10 = b10.options[0]._zod.run;
        a10._zod.parse = (e10, f10) => {
          if (c10) return d10(e10, f10);
          let g10 = false, h10 = [];
          for (let a11 of b10.options) {
            let b11 = a11._zod.run({ value: e10.value, issues: [] }, f10);
            b11 instanceof Promise ? (h10.push(b11), g10 = true) : h10.push(b11);
          }
          return g10 ? Promise.all(h10).then((b11) => eu(b11, e10, a10, f10)) : eu(h10, e10, a10, f10);
        };
      }), ew = bz("$ZodDiscriminatedUnion", (a10, b10) => {
        b10.inclusive = false, et.init(a10, b10);
        let c10 = a10._zod.parse;
        bL(a10._zod, "propValues", () => {
          let a11 = {};
          for (let c11 of b10.options) {
            let d11 = c11._zod.propValues;
            if (!d11 || 0 === Object.keys(d11).length) throw Error(`Invalid discriminated union option at index "${b10.options.indexOf(c11)}"`);
            for (let [b11, c12] of Object.entries(d11)) for (let d12 of (a11[b11] || (a11[b11] = /* @__PURE__ */ new Set()), c12)) a11[b11].add(d12);
          }
          return a11;
        });
        let d10 = bH(() => {
          let a11 = b10.options, c11 = /* @__PURE__ */ new Map();
          for (let d11 of a11) {
            let a12 = d11._zod.propValues?.[b10.discriminator];
            if (!a12 || 0 === a12.size) throw Error(`Invalid discriminated union option at index "${b10.options.indexOf(d11)}"`);
            for (let b11 of a12) {
              if (c11.has(b11)) throw Error(`Duplicate discriminator value "${String(b11)}"`);
              c11.set(b11, d11);
            }
          }
          return c11;
        });
        a10._zod.parse = (e10, f10) => {
          let g10 = e10.value;
          if (!bQ(g10)) return e10.issues.push({ code: "invalid_type", expected: "object", input: g10, inst: a10 }), e10;
          let h10 = d10.value.get(g10?.[b10.discriminator]);
          return h10 ? h10._zod.run(e10, f10) : b10.unionFallback ? c10(e10, f10) : (e10.issues.push({ code: "invalid_union", errors: [], note: "No matching discriminator", discriminator: b10.discriminator, input: g10, path: [b10.discriminator], inst: a10 }), e10);
        };
      }), ex = bz("$ZodIntersection", (a10, b10) => {
        dH.init(a10, b10), a10._zod.parse = (a11, c10) => {
          let d10 = a11.value, e10 = b10.left._zod.run({ value: d10, issues: [] }, c10), f10 = b10.right._zod.run({ value: d10, issues: [] }, c10);
          return e10 instanceof Promise || f10 instanceof Promise ? Promise.all([e10, f10]).then(([b11, c11]) => ey(a11, b11, c11)) : ey(a11, e10, f10);
        };
      });
      function ey(a10, b10, c10) {
        let d10, e10 = /* @__PURE__ */ new Map();
        for (let c11 of b10.issues) if ("unrecognized_keys" === c11.code) for (let a11 of (d10 ?? (d10 = c11), c11.keys)) e10.has(a11) || e10.set(a11, {}), e10.get(a11).l = true;
        else a10.issues.push(c11);
        for (let b11 of c10.issues) if ("unrecognized_keys" === b11.code) for (let a11 of b11.keys) e10.has(a11) || e10.set(a11, {}), e10.get(a11).r = true;
        else a10.issues.push(b11);
        let f10 = [...e10].filter(([, a11]) => a11.l && a11.r).map(([a11]) => a11);
        if (f10.length && d10 && a10.issues.push({ ...d10, keys: f10 }), b0(a10)) return a10;
        let g10 = function a11(b11, c11) {
          if (b11 === c11 || b11 instanceof Date && c11 instanceof Date && +b11 == +c11) return { valid: true, data: b11 };
          if (bS(b11) && bS(c11)) {
            let d11 = Object.keys(c11), e11 = Object.keys(b11).filter((a12) => -1 !== d11.indexOf(a12)), f11 = { ...b11, ...c11 };
            for (let d12 of e11) {
              let e12 = a11(b11[d12], c11[d12]);
              if (!e12.valid) return { valid: false, mergeErrorPath: [d12, ...e12.mergeErrorPath] };
              f11[d12] = e12.data;
            }
            return { valid: true, data: f11 };
          }
          if (Array.isArray(b11) && Array.isArray(c11)) {
            if (b11.length !== c11.length) return { valid: false, mergeErrorPath: [] };
            let d11 = [];
            for (let e11 = 0; e11 < b11.length; e11++) {
              let f11 = a11(b11[e11], c11[e11]);
              if (!f11.valid) return { valid: false, mergeErrorPath: [e11, ...f11.mergeErrorPath] };
              d11.push(f11.data);
            }
            return { valid: true, data: d11 };
          }
          return { valid: false, mergeErrorPath: [] };
        }(b10.value, c10.value);
        if (!g10.valid) throw Error(`Unmergable intersection. Error path: ${JSON.stringify(g10.mergeErrorPath)}`);
        return a10.value = g10.data, a10;
      }
      let ez = bz("$ZodTuple", (a10, b10) => {
        dH.init(a10, b10);
        let c10 = b10.items;
        a10._zod.parse = (d10, e10) => {
          let f10 = d10.value;
          if (!Array.isArray(f10)) return d10.issues.push({ input: f10, inst: a10, expected: "tuple", code: "invalid_type" }), d10;
          d10.value = [];
          let g10 = [], h10 = [...c10].reverse().findIndex((a11) => "optional" !== a11._zod.optin), i10 = -1 === h10 ? 0 : c10.length - h10;
          if (!b10.rest) {
            let b11 = f10.length > c10.length, e11 = f10.length < i10 - 1;
            if (b11 || e11) return d10.issues.push({ ...b11 ? { code: "too_big", maximum: c10.length, inclusive: true } : { code: "too_small", minimum: c10.length }, input: f10, inst: a10, origin: "array" }), d10;
          }
          let j2 = -1;
          for (let a11 of c10) {
            if (++j2 >= f10.length && j2 >= i10) continue;
            let b11 = a11._zod.run({ value: f10[j2], issues: [] }, e10);
            b11 instanceof Promise ? g10.push(b11.then((a12) => eA(a12, d10, j2))) : eA(b11, d10, j2);
          }
          if (b10.rest) for (let a11 of f10.slice(c10.length)) {
            j2++;
            let c11 = b10.rest._zod.run({ value: a11, issues: [] }, e10);
            c11 instanceof Promise ? g10.push(c11.then((a12) => eA(a12, d10, j2))) : eA(c11, d10, j2);
          }
          return g10.length ? Promise.all(g10).then(() => d10) : d10;
        };
      });
      function eA(a10, b10, c10) {
        a10.issues.length && b10.issues.push(...b1(c10, a10.issues)), b10.value[c10] = a10.value;
      }
      let eB = bz("$ZodRecord", (a10, b10) => {
        dH.init(a10, b10), a10._zod.parse = (c10, d10) => {
          let e10 = c10.value;
          if (!bS(e10)) return c10.issues.push({ expected: "record", code: "invalid_type", input: e10, inst: a10 }), c10;
          let f10 = [], g10 = b10.keyType._zod.values;
          if (g10) {
            let h10;
            c10.value = {};
            let i10 = /* @__PURE__ */ new Set();
            for (let a11 of g10) if ("string" == typeof a11 || "number" == typeof a11 || "symbol" == typeof a11) {
              i10.add("number" == typeof a11 ? a11.toString() : a11);
              let g11 = b10.valueType._zod.run({ value: e10[a11], issues: [] }, d10);
              g11 instanceof Promise ? f10.push(g11.then((b11) => {
                b11.issues.length && c10.issues.push(...b1(a11, b11.issues)), c10.value[a11] = b11.value;
              })) : (g11.issues.length && c10.issues.push(...b1(a11, g11.issues)), c10.value[a11] = g11.value);
            }
            for (let a11 in e10) i10.has(a11) || (h10 = h10 ?? []).push(a11);
            h10 && h10.length > 0 && c10.issues.push({ code: "unrecognized_keys", input: e10, inst: a10, keys: h10 });
          } else for (let g11 of (c10.value = {}, Reflect.ownKeys(e10))) {
            if ("__proto__" === g11) continue;
            let h10 = b10.keyType._zod.run({ value: g11, issues: [] }, d10);
            if (h10 instanceof Promise) throw Error("Async schemas not supported in object keys currently");
            if ("string" == typeof g11 && cU.test(g11) && h10.issues.length) {
              let a11 = b10.keyType._zod.run({ value: Number(g11), issues: [] }, d10);
              if (a11 instanceof Promise) throw Error("Async schemas not supported in object keys currently");
              0 === a11.issues.length && (h10 = a11);
            }
            if (h10.issues.length) {
              "loose" === b10.mode ? c10.value[g11] = e10[g11] : c10.issues.push({ code: "invalid_key", origin: "record", issues: h10.issues.map((a11) => b3(a11, d10, bD())), input: g11, path: [g11], inst: a10 });
              continue;
            }
            let i10 = b10.valueType._zod.run({ value: e10[g11], issues: [] }, d10);
            i10 instanceof Promise ? f10.push(i10.then((a11) => {
              a11.issues.length && c10.issues.push(...b1(g11, a11.issues)), c10.value[h10.value] = a11.value;
            })) : (i10.issues.length && c10.issues.push(...b1(g11, i10.issues)), c10.value[h10.value] = i10.value);
          }
          return f10.length ? Promise.all(f10).then(() => c10) : c10;
        };
      }), eC = bz("$ZodMap", (a10, b10) => {
        dH.init(a10, b10), a10._zod.parse = (c10, d10) => {
          let e10 = c10.value;
          if (!(e10 instanceof Map)) return c10.issues.push({ expected: "map", code: "invalid_type", input: e10, inst: a10 }), c10;
          let f10 = [];
          for (let [g10, h10] of (c10.value = /* @__PURE__ */ new Map(), e10)) {
            let i10 = b10.keyType._zod.run({ value: g10, issues: [] }, d10), j2 = b10.valueType._zod.run({ value: h10, issues: [] }, d10);
            i10 instanceof Promise || j2 instanceof Promise ? f10.push(Promise.all([i10, j2]).then(([b11, f11]) => {
              eD(b11, f11, c10, g10, e10, a10, d10);
            })) : eD(i10, j2, c10, g10, e10, a10, d10);
          }
          return f10.length ? Promise.all(f10).then(() => c10) : c10;
        };
      });
      function eD(a10, b10, c10, d10, e10, f10, g10) {
        a10.issues.length && (bU.has(typeof d10) ? c10.issues.push(...b1(d10, a10.issues)) : c10.issues.push({ code: "invalid_key", origin: "map", input: e10, inst: f10, issues: a10.issues.map((a11) => b3(a11, g10, bD())) })), b10.issues.length && (bU.has(typeof d10) ? c10.issues.push(...b1(d10, b10.issues)) : c10.issues.push({ origin: "map", code: "invalid_element", input: e10, inst: f10, key: d10, issues: b10.issues.map((a11) => b3(a11, g10, bD())) })), c10.value.set(a10.value, b10.value);
      }
      let eE = bz("$ZodSet", (a10, b10) => {
        dH.init(a10, b10), a10._zod.parse = (c10, d10) => {
          let e10 = c10.value;
          if (!(e10 instanceof Set)) return c10.issues.push({ input: e10, inst: a10, expected: "set", code: "invalid_type" }), c10;
          let f10 = [];
          for (let a11 of (c10.value = /* @__PURE__ */ new Set(), e10)) {
            let e11 = b10.valueType._zod.run({ value: a11, issues: [] }, d10);
            e11 instanceof Promise ? f10.push(e11.then((a12) => eF(a12, c10))) : eF(e11, c10);
          }
          return f10.length ? Promise.all(f10).then(() => c10) : c10;
        };
      });
      function eF(a10, b10) {
        a10.issues.length && b10.issues.push(...a10.issues), b10.value.add(a10.value);
      }
      let eG = bz("$ZodEnum", (a10, b10) => {
        dH.init(a10, b10);
        let c10 = bE(b10.entries), d10 = new Set(c10);
        a10._zod.values = d10, a10._zod.pattern = RegExp(`^(${c10.filter((a11) => bU.has(typeof a11)).map((a11) => "string" == typeof a11 ? bW(a11) : a11.toString()).join("|")})$`), a10._zod.parse = (b11, e10) => {
          let f10 = b11.value;
          return d10.has(f10) || b11.issues.push({ code: "invalid_value", values: c10, input: f10, inst: a10 }), b11;
        };
      }), eH = bz("$ZodLiteral", (a10, b10) => {
        if (dH.init(a10, b10), 0 === b10.values.length) throw Error("Cannot create literal schema with no valid values");
        let c10 = new Set(b10.values);
        a10._zod.values = c10, a10._zod.pattern = RegExp(`^(${b10.values.map((a11) => "string" == typeof a11 ? bW(a11) : a11 ? bW(a11.toString()) : String(a11)).join("|")})$`), a10._zod.parse = (d10, e10) => {
          let f10 = d10.value;
          return c10.has(f10) || d10.issues.push({ code: "invalid_value", values: b10.values, input: f10, inst: a10 }), d10;
        };
      }), eI = bz("$ZodFile", (a10, b10) => {
        dH.init(a10, b10), a10._zod.parse = (b11, c10) => {
          let d10 = b11.value;
          return d10 instanceof File || b11.issues.push({ expected: "file", code: "invalid_type", input: d10, inst: a10 }), b11;
        };
      }), eJ = bz("$ZodTransform", (a10, b10) => {
        dH.init(a10, b10), a10._zod.parse = (c10, d10) => {
          if ("backward" === d10.direction) throw new bB(a10.constructor.name);
          let e10 = b10.transform(c10.value, c10);
          if (d10.async) return (e10 instanceof Promise ? e10 : Promise.resolve(e10)).then((a11) => (c10.value = a11, c10));
          if (e10 instanceof Promise) throw new bA();
          return c10.value = e10, c10;
        };
      });
      function eK(a10, b10) {
        return a10.issues.length && void 0 === b10 ? { issues: [], value: void 0 } : a10;
      }
      let eL = bz("$ZodOptional", (a10, b10) => {
        dH.init(a10, b10), a10._zod.optin = "optional", a10._zod.optout = "optional", bL(a10._zod, "values", () => b10.innerType._zod.values ? /* @__PURE__ */ new Set([...b10.innerType._zod.values, void 0]) : void 0), bL(a10._zod, "pattern", () => {
          let a11 = b10.innerType._zod.pattern;
          return a11 ? RegExp(`^(${bJ(a11.source)})?$`) : void 0;
        }), a10._zod.parse = (a11, c10) => {
          if ("optional" === b10.innerType._zod.optin) {
            let d10 = b10.innerType._zod.run(a11, c10);
            return d10 instanceof Promise ? d10.then((b11) => eK(b11, a11.value)) : eK(d10, a11.value);
          }
          return void 0 === a11.value ? a11 : b10.innerType._zod.run(a11, c10);
        };
      }), eM = bz("$ZodExactOptional", (a10, b10) => {
        eL.init(a10, b10), bL(a10._zod, "values", () => b10.innerType._zod.values), bL(a10._zod, "pattern", () => b10.innerType._zod.pattern), a10._zod.parse = (a11, c10) => b10.innerType._zod.run(a11, c10);
      }), eN = bz("$ZodNullable", (a10, b10) => {
        dH.init(a10, b10), bL(a10._zod, "optin", () => b10.innerType._zod.optin), bL(a10._zod, "optout", () => b10.innerType._zod.optout), bL(a10._zod, "pattern", () => {
          let a11 = b10.innerType._zod.pattern;
          return a11 ? RegExp(`^(${bJ(a11.source)}|null)$`) : void 0;
        }), bL(a10._zod, "values", () => b10.innerType._zod.values ? /* @__PURE__ */ new Set([...b10.innerType._zod.values, null]) : void 0), a10._zod.parse = (a11, c10) => null === a11.value ? a11 : b10.innerType._zod.run(a11, c10);
      }), eO = bz("$ZodDefault", (a10, b10) => {
        dH.init(a10, b10), a10._zod.optin = "optional", bL(a10._zod, "values", () => b10.innerType._zod.values), a10._zod.parse = (a11, c10) => {
          if ("backward" === c10.direction) return b10.innerType._zod.run(a11, c10);
          if (void 0 === a11.value) return a11.value = b10.defaultValue, a11;
          let d10 = b10.innerType._zod.run(a11, c10);
          return d10 instanceof Promise ? d10.then((a12) => eP(a12, b10)) : eP(d10, b10);
        };
      });
      function eP(a10, b10) {
        return void 0 === a10.value && (a10.value = b10.defaultValue), a10;
      }
      let eQ = bz("$ZodPrefault", (a10, b10) => {
        dH.init(a10, b10), a10._zod.optin = "optional", bL(a10._zod, "values", () => b10.innerType._zod.values), a10._zod.parse = (a11, c10) => ("backward" === c10.direction || void 0 === a11.value && (a11.value = b10.defaultValue), b10.innerType._zod.run(a11, c10));
      }), eR = bz("$ZodNonOptional", (a10, b10) => {
        dH.init(a10, b10), bL(a10._zod, "values", () => {
          let a11 = b10.innerType._zod.values;
          return a11 ? new Set([...a11].filter((a12) => void 0 !== a12)) : void 0;
        }), a10._zod.parse = (c10, d10) => {
          let e10 = b10.innerType._zod.run(c10, d10);
          return e10 instanceof Promise ? e10.then((b11) => eS(b11, a10)) : eS(e10, a10);
        };
      });
      function eS(a10, b10) {
        return a10.issues.length || void 0 !== a10.value || a10.issues.push({ code: "invalid_type", expected: "nonoptional", input: a10.value, inst: b10 }), a10;
      }
      let eT = bz("$ZodSuccess", (a10, b10) => {
        dH.init(a10, b10), a10._zod.parse = (a11, c10) => {
          if ("backward" === c10.direction) throw new bB("ZodSuccess");
          let d10 = b10.innerType._zod.run(a11, c10);
          return d10 instanceof Promise ? d10.then((b11) => (a11.value = 0 === b11.issues.length, a11)) : (a11.value = 0 === d10.issues.length, a11);
        };
      }), eU = bz("$ZodCatch", (a10, b10) => {
        dH.init(a10, b10), bL(a10._zod, "optin", () => b10.innerType._zod.optin), bL(a10._zod, "optout", () => b10.innerType._zod.optout), bL(a10._zod, "values", () => b10.innerType._zod.values), a10._zod.parse = (a11, c10) => {
          if ("backward" === c10.direction) return b10.innerType._zod.run(a11, c10);
          let d10 = b10.innerType._zod.run(a11, c10);
          return d10 instanceof Promise ? d10.then((d11) => (a11.value = d11.value, d11.issues.length && (a11.value = b10.catchValue({ ...a11, error: { issues: d11.issues.map((a12) => b3(a12, c10, bD())) }, input: a11.value }), a11.issues = []), a11)) : (a11.value = d10.value, d10.issues.length && (a11.value = b10.catchValue({ ...a11, error: { issues: d10.issues.map((a12) => b3(a12, c10, bD())) }, input: a11.value }), a11.issues = []), a11);
        };
      }), eV = bz("$ZodNaN", (a10, b10) => {
        dH.init(a10, b10), a10._zod.parse = (b11, c10) => ("number" == typeof b11.value && Number.isNaN(b11.value) || b11.issues.push({ input: b11.value, inst: a10, expected: "nan", code: "invalid_type" }), b11);
      }), eW = bz("$ZodPipe", (a10, b10) => {
        dH.init(a10, b10), bL(a10._zod, "values", () => b10.in._zod.values), bL(a10._zod, "optin", () => b10.in._zod.optin), bL(a10._zod, "optout", () => b10.out._zod.optout), bL(a10._zod, "propValues", () => b10.in._zod.propValues), a10._zod.parse = (a11, c10) => {
          if ("backward" === c10.direction) {
            let d11 = b10.out._zod.run(a11, c10);
            return d11 instanceof Promise ? d11.then((a12) => eX(a12, b10.in, c10)) : eX(d11, b10.in, c10);
          }
          let d10 = b10.in._zod.run(a11, c10);
          return d10 instanceof Promise ? d10.then((a12) => eX(a12, b10.out, c10)) : eX(d10, b10.out, c10);
        };
      });
      function eX(a10, b10, c10) {
        return a10.issues.length ? (a10.aborted = true, a10) : b10._zod.run({ value: a10.value, issues: a10.issues }, c10);
      }
      let eY = bz("$ZodCodec", (a10, b10) => {
        dH.init(a10, b10), bL(a10._zod, "values", () => b10.in._zod.values), bL(a10._zod, "optin", () => b10.in._zod.optin), bL(a10._zod, "optout", () => b10.out._zod.optout), bL(a10._zod, "propValues", () => b10.in._zod.propValues), a10._zod.parse = (a11, c10) => {
          if ("forward" === (c10.direction || "forward")) {
            let d10 = b10.in._zod.run(a11, c10);
            return d10 instanceof Promise ? d10.then((a12) => eZ(a12, b10, c10)) : eZ(d10, b10, c10);
          }
          {
            let d10 = b10.out._zod.run(a11, c10);
            return d10 instanceof Promise ? d10.then((a12) => eZ(a12, b10, c10)) : eZ(d10, b10, c10);
          }
        };
      });
      function eZ(a10, b10, c10) {
        if (a10.issues.length) return a10.aborted = true, a10;
        if ("forward" === (c10.direction || "forward")) {
          let d10 = b10.transform(a10.value, a10);
          return d10 instanceof Promise ? d10.then((d11) => e$(a10, d11, b10.out, c10)) : e$(a10, d10, b10.out, c10);
        }
        {
          let d10 = b10.reverseTransform(a10.value, a10);
          return d10 instanceof Promise ? d10.then((d11) => e$(a10, d11, b10.in, c10)) : e$(a10, d10, b10.in, c10);
        }
      }
      function e$(a10, b10, c10, d10) {
        return a10.issues.length ? (a10.aborted = true, a10) : c10._zod.run({ value: b10, issues: a10.issues }, d10);
      }
      let e_ = bz("$ZodReadonly", (a10, b10) => {
        dH.init(a10, b10), bL(a10._zod, "propValues", () => b10.innerType._zod.propValues), bL(a10._zod, "values", () => b10.innerType._zod.values), bL(a10._zod, "optin", () => b10.innerType?._zod?.optin), bL(a10._zod, "optout", () => b10.innerType?._zod?.optout), a10._zod.parse = (a11, c10) => {
          if ("backward" === c10.direction) return b10.innerType._zod.run(a11, c10);
          let d10 = b10.innerType._zod.run(a11, c10);
          return d10 instanceof Promise ? d10.then(e0) : e0(d10);
        };
      });
      function e0(a10) {
        return a10.value = Object.freeze(a10.value), a10;
      }
      let e1 = bz("$ZodTemplateLiteral", (a10, b10) => {
        dH.init(a10, b10);
        let c10 = [];
        for (let a11 of b10.parts) if ("object" == typeof a11 && null !== a11) {
          if (!a11._zod.pattern) throw Error(`Invalid template literal part, no pattern found: ${[...a11._zod.traits].shift()}`);
          let b11 = a11._zod.pattern instanceof RegExp ? a11._zod.pattern.source : a11._zod.pattern;
          if (!b11) throw Error(`Invalid template literal part: ${a11._zod.traits}`);
          let d10 = +!!b11.startsWith("^"), e10 = b11.endsWith("$") ? b11.length - 1 : b11.length;
          c10.push(b11.slice(d10, e10));
        } else if (null === a11 || bV.has(typeof a11)) c10.push(bW(`${a11}`));
        else throw Error(`Invalid template literal part: ${a11}`);
        a10._zod.pattern = RegExp(`^${c10.join("")}$`), a10._zod.parse = (c11, d10) => ("string" != typeof c11.value ? c11.issues.push({ input: c11.value, inst: a10, expected: "string", code: "invalid_type" }) : (a10._zod.pattern.lastIndex = 0, a10._zod.pattern.test(c11.value) || c11.issues.push({ input: c11.value, inst: a10, code: "invalid_format", format: b10.format ?? "template_literal", pattern: a10._zod.pattern.source })), c11);
      }), e2 = bz("$ZodFunction", (a10, b10) => (dH.init(a10, b10), a10._def = b10, a10._zod.def = b10, a10.implement = (b11) => {
        if ("function" != typeof b11) throw Error("implement() must be called with a function");
        return function(...c10) {
          let d10 = Reflect.apply(b11, this, a10._def.input ? cb(a10._def.input, c10) : c10);
          return a10._def.output ? cb(a10._def.output, d10) : d10;
        };
      }, a10.implementAsync = (b11) => {
        if ("function" != typeof b11) throw Error("implementAsync() must be called with a function");
        return async function(...c10) {
          let d10 = a10._def.input ? await cd(a10._def.input, c10) : c10, e10 = await Reflect.apply(b11, this, d10);
          return a10._def.output ? await cd(a10._def.output, e10) : e10;
        };
      }, a10._zod.parse = (b11, c10) => ("function" != typeof b11.value ? b11.issues.push({ code: "invalid_type", expected: "function", input: b11.value, inst: a10 }) : a10._def.output && "promise" === a10._def.output._zod.def.type ? b11.value = a10.implementAsync(b11.value) : b11.value = a10.implement(b11.value), b11), a10.input = (...b11) => {
        let c10 = a10.constructor;
        return new c10(Array.isArray(b11[0]) ? { type: "function", input: new ez({ type: "tuple", items: b11[0], rest: b11[1] }), output: a10._def.output } : { type: "function", input: b11[0], output: a10._def.output });
      }, a10.output = (b11) => new a10.constructor({ type: "function", input: a10._def.input, output: b11 }), a10)), e3 = bz("$ZodPromise", (a10, b10) => {
        dH.init(a10, b10), a10._zod.parse = (a11, c10) => Promise.resolve(a11.value).then((a12) => b10.innerType._zod.run({ value: a12, issues: [] }, c10));
      }), e4 = bz("$ZodLazy", (a10, b10) => {
        dH.init(a10, b10), bL(a10._zod, "innerType", () => b10.getter()), bL(a10._zod, "pattern", () => a10._zod.innerType?._zod?.pattern), bL(a10._zod, "propValues", () => a10._zod.innerType?._zod?.propValues), bL(a10._zod, "optin", () => a10._zod.innerType?._zod?.optin ?? void 0), bL(a10._zod, "optout", () => a10._zod.innerType?._zod?.optout ?? void 0), a10._zod.parse = (b11, c10) => a10._zod.innerType._zod.run(b11, c10);
      }), e5 = bz("$ZodCustom", (a10, b10) => {
        dg.init(a10, b10), dH.init(a10, b10), a10._zod.parse = (a11, b11) => a11, a10._zod.check = (c10) => {
          let d10 = c10.value, e10 = b10.fn(d10);
          if (e10 instanceof Promise) return e10.then((b11) => e6(b11, c10, d10, a10));
          e6(e10, c10, d10, a10);
        };
      });
      function e6(a10, b10, c10, d10) {
        if (!a10) {
          let a11 = { code: "custom", input: c10, inst: d10, path: [...d10._zod.def.path ?? []], continue: !d10._zod.def.abort };
          d10._zod.def.params && (a11.params = d10._zod.def.params), b10.issues.push(b6(a11));
        }
      }
      Symbol("ZodOutput"), Symbol("ZodInput");
      class e7 {
        constructor() {
          this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map();
        }
        add(a10, ...b10) {
          let c10 = b10[0];
          return this._map.set(a10, c10), c10 && "object" == typeof c10 && "id" in c10 && this._idmap.set(c10.id, a10), this;
        }
        clear() {
          return this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map(), this;
        }
        remove(a10) {
          let b10 = this._map.get(a10);
          return b10 && "object" == typeof b10 && "id" in b10 && this._idmap.delete(b10.id), this._map.delete(a10), this;
        }
        get(a10) {
          let b10 = a10._zod.parent;
          if (b10) {
            let c10 = { ...this.get(b10) ?? {} };
            delete c10.id;
            let d10 = { ...c10, ...this._map.get(a10) };
            return Object.keys(d10).length ? d10 : void 0;
          }
          return this._map.get(a10);
        }
        has(a10) {
          return this._map.has(a10);
        }
      }
      (f = globalThis).__zod_globalRegistry ?? (f.__zod_globalRegistry = new e7());
      let e8 = globalThis.__zod_globalRegistry;
      function e9(a10, b10) {
        return new a10({ type: "string", format: "email", check: "string_format", abort: false, ...bY(b10) });
      }
      function fa(a10, b10) {
        return new a10({ type: "string", format: "guid", check: "string_format", abort: false, ...bY(b10) });
      }
      function fb(a10, b10) {
        return new a10({ type: "string", format: "uuid", check: "string_format", abort: false, ...bY(b10) });
      }
      function fc(a10, b10) {
        return new a10({ type: "string", format: "uuid", check: "string_format", abort: false, version: "v4", ...bY(b10) });
      }
      function fd(a10, b10) {
        return new a10({ type: "string", format: "uuid", check: "string_format", abort: false, version: "v6", ...bY(b10) });
      }
      function fe(a10, b10) {
        return new a10({ type: "string", format: "uuid", check: "string_format", abort: false, version: "v7", ...bY(b10) });
      }
      function ff(a10, b10) {
        return new a10({ type: "string", format: "url", check: "string_format", abort: false, ...bY(b10) });
      }
      function fg(a10, b10) {
        return new a10({ type: "string", format: "emoji", check: "string_format", abort: false, ...bY(b10) });
      }
      function fh(a10, b10) {
        return new a10({ type: "string", format: "nanoid", check: "string_format", abort: false, ...bY(b10) });
      }
      function fi(a10, b10) {
        return new a10({ type: "string", format: "cuid", check: "string_format", abort: false, ...bY(b10) });
      }
      function fj(a10, b10) {
        return new a10({ type: "string", format: "cuid2", check: "string_format", abort: false, ...bY(b10) });
      }
      function fk(a10, b10) {
        return new a10({ type: "string", format: "ulid", check: "string_format", abort: false, ...bY(b10) });
      }
      function fl(a10, b10) {
        return new a10({ type: "string", format: "xid", check: "string_format", abort: false, ...bY(b10) });
      }
      function fm(a10, b10) {
        return new a10({ type: "string", format: "ksuid", check: "string_format", abort: false, ...bY(b10) });
      }
      function fn(a10, b10) {
        return new a10({ type: "string", format: "ipv4", check: "string_format", abort: false, ...bY(b10) });
      }
      function fo(a10, b10) {
        return new a10({ type: "string", format: "ipv6", check: "string_format", abort: false, ...bY(b10) });
      }
      function fp(a10, b10) {
        return new a10({ type: "string", format: "cidrv4", check: "string_format", abort: false, ...bY(b10) });
      }
      function fq(a10, b10) {
        return new a10({ type: "string", format: "cidrv6", check: "string_format", abort: false, ...bY(b10) });
      }
      function fr(a10, b10) {
        return new a10({ type: "string", format: "base64", check: "string_format", abort: false, ...bY(b10) });
      }
      function fs(a10, b10) {
        return new a10({ type: "string", format: "base64url", check: "string_format", abort: false, ...bY(b10) });
      }
      function ft(a10, b10) {
        return new a10({ type: "string", format: "e164", check: "string_format", abort: false, ...bY(b10) });
      }
      function fu(a10, b10) {
        return new a10({ type: "string", format: "jwt", check: "string_format", abort: false, ...bY(b10) });
      }
      function fv(a10, b10) {
        return new di({ check: "less_than", ...bY(b10), value: a10, inclusive: false });
      }
      function fw(a10, b10) {
        return new di({ check: "less_than", ...bY(b10), value: a10, inclusive: true });
      }
      function fx(a10, b10) {
        return new dj({ check: "greater_than", ...bY(b10), value: a10, inclusive: false });
      }
      function fy(a10, b10) {
        return new dj({ check: "greater_than", ...bY(b10), value: a10, inclusive: true });
      }
      function fz(a10) {
        return fx(0, a10);
      }
      function fA(a10) {
        return fv(0, a10);
      }
      function fB(a10) {
        return fw(0, a10);
      }
      function fC(a10) {
        return fy(0, a10);
      }
      function fD(a10, b10) {
        return new dk({ check: "multiple_of", ...bY(b10), value: a10 });
      }
      function fE(a10, b10) {
        return new dn({ check: "max_size", ...bY(b10), maximum: a10 });
      }
      function fF(a10, b10) {
        return new dp({ check: "min_size", ...bY(b10), minimum: a10 });
      }
      function fG(a10, b10) {
        return new dq({ check: "size_equals", ...bY(b10), size: a10 });
      }
      function fH(a10, b10) {
        return new dr({ check: "max_length", ...bY(b10), maximum: a10 });
      }
      function fI(a10, b10) {
        return new ds({ check: "min_length", ...bY(b10), minimum: a10 });
      }
      function fJ(a10, b10) {
        return new dt({ check: "length_equals", ...bY(b10), length: a10 });
      }
      function fK(a10, b10) {
        return new dv({ check: "string_format", format: "regex", ...bY(b10), pattern: a10 });
      }
      function fL(a10) {
        return new dw({ check: "string_format", format: "lowercase", ...bY(a10) });
      }
      function fM(a10) {
        return new dx({ check: "string_format", format: "uppercase", ...bY(a10) });
      }
      function fN(a10, b10) {
        return new dy({ check: "string_format", format: "includes", ...bY(b10), includes: a10 });
      }
      function fO(a10, b10) {
        return new dz({ check: "string_format", format: "starts_with", ...bY(b10), prefix: a10 });
      }
      function fP(a10, b10) {
        return new dA({ check: "string_format", format: "ends_with", ...bY(b10), suffix: a10 });
      }
      function fQ(a10, b10, c10) {
        return new dC({ check: "property", property: a10, schema: b10, ...bY(c10) });
      }
      function fR(a10, b10) {
        return new dD({ check: "mime_type", mime: a10, ...bY(b10) });
      }
      function fS(a10) {
        return new dE({ check: "overwrite", tx: a10 });
      }
      function fT(a10) {
        return fS((b10) => b10.normalize(a10));
      }
      function fU() {
        return fS((a10) => a10.trim());
      }
      function fV() {
        return fS((a10) => a10.toLowerCase());
      }
      function fW() {
        return fS((a10) => a10.toUpperCase());
      }
      function fX() {
        return fS((a10) => a10.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, ""));
      }
      function fY(a10, b10, c10, d10 = {}) {
        let e10 = bY(d10), f10 = { ...bY(d10), check: "string_format", type: "string", format: b10, fn: "function" == typeof c10 ? c10 : (a11) => c10.test(a11), ...e10 };
        return c10 instanceof RegExp && (f10.pattern = c10), new a10(f10);
      }
      function fZ(a10) {
        let b10 = a10?.target ?? "draft-2020-12";
        return "draft-4" === b10 && (b10 = "draft-04"), "draft-7" === b10 && (b10 = "draft-07"), { processors: a10.processors ?? {}, metadataRegistry: a10?.metadata ?? e8, target: b10, unrepresentable: a10?.unrepresentable ?? "throw", override: a10?.override ?? (() => {
        }), io: a10?.io ?? "output", counter: 0, seen: /* @__PURE__ */ new Map(), cycles: a10?.cycles ?? "ref", reused: a10?.reused ?? "inline", external: a10?.external ?? void 0 };
      }
      function f$(a10, b10, c10 = { path: [], schemaPath: [] }) {
        var d10;
        let e10 = a10._zod.def, f10 = b10.seen.get(a10);
        if (f10) return f10.count++, c10.schemaPath.includes(a10) && (f10.cycle = c10.path), f10.schema;
        let g10 = { schema: {}, count: 1, cycle: void 0, path: c10.path };
        b10.seen.set(a10, g10);
        let h10 = a10._zod.toJSONSchema?.();
        if (h10) g10.schema = h10;
        else {
          let d11 = { ...c10, schemaPath: [...c10.schemaPath, a10], path: c10.path };
          if (a10._zod.processJSONSchema) a10._zod.processJSONSchema(b10, g10.schema, d11);
          else {
            let c11 = g10.schema, f12 = b10.processors[e10.type];
            if (!f12) throw Error(`[toJSONSchema]: Non-representable type encountered: ${e10.type}`);
            f12(a10, b10, c11, d11);
          }
          let f11 = a10._zod.parent;
          f11 && (g10.ref || (g10.ref = f11), f$(f11, b10, d11), b10.seen.get(f11).isParent = true);
        }
        let i10 = b10.metadataRegistry.get(a10);
        return i10 && Object.assign(g10.schema, i10), "input" === b10.io && function a11(b11, c11) {
          let d11 = c11 ?? { seen: /* @__PURE__ */ new Set() };
          if (d11.seen.has(b11)) return false;
          d11.seen.add(b11);
          let e11 = b11._zod.def;
          if ("transform" === e11.type) return true;
          if ("array" === e11.type) return a11(e11.element, d11);
          if ("set" === e11.type) return a11(e11.valueType, d11);
          if ("lazy" === e11.type) return a11(e11.getter(), d11);
          if ("promise" === e11.type || "optional" === e11.type || "nonoptional" === e11.type || "nullable" === e11.type || "readonly" === e11.type || "default" === e11.type || "prefault" === e11.type) return a11(e11.innerType, d11);
          if ("intersection" === e11.type) return a11(e11.left, d11) || a11(e11.right, d11);
          if ("record" === e11.type || "map" === e11.type) return a11(e11.keyType, d11) || a11(e11.valueType, d11);
          if ("pipe" === e11.type) return a11(e11.in, d11) || a11(e11.out, d11);
          if ("object" === e11.type) {
            for (let b12 in e11.shape) if (a11(e11.shape[b12], d11)) return true;
            return false;
          }
          if ("union" === e11.type) {
            for (let b12 of e11.options) if (a11(b12, d11)) return true;
            return false;
          }
          if ("tuple" === e11.type) {
            for (let b12 of e11.items) if (a11(b12, d11)) return true;
            if (e11.rest && a11(e11.rest, d11)) return true;
          }
          return false;
        }(a10) && (delete g10.schema.examples, delete g10.schema.default), "input" === b10.io && g10.schema._prefault && ((d10 = g10.schema).default ?? (d10.default = g10.schema._prefault)), delete g10.schema._prefault, b10.seen.get(a10).schema;
      }
      function f_(a10, b10) {
        let c10 = a10.seen.get(b10);
        if (!c10) throw Error("Unprocessed schema. This is a bug in Zod.");
        let d10 = /* @__PURE__ */ new Map();
        for (let b11 of a10.seen.entries()) {
          let c11 = a10.metadataRegistry.get(b11[0])?.id;
          if (c11) {
            let a11 = d10.get(c11);
            if (a11 && a11 !== b11[0]) throw Error(`Duplicate schema id "${c11}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
            d10.set(c11, b11[0]);
          }
        }
        let e10 = (b11) => {
          if (b11[1].schema.$ref) return;
          let d11 = b11[1], { ref: e11, defId: f10 } = ((b12) => {
            let d12 = "draft-2020-12" === a10.target ? "$defs" : "definitions";
            if (a10.external) {
              let c11 = a10.external.registry.get(b12[0])?.id, e13 = a10.external.uri ?? ((a11) => a11);
              if (c11) return { ref: e13(c11) };
              let f12 = b12[1].defId ?? b12[1].schema.id ?? `schema${a10.counter++}`;
              return b12[1].defId = f12, { defId: f12, ref: `${e13("__shared")}#/${d12}/${f12}` };
            }
            if (b12[1] === c10) return { ref: "#" };
            let e12 = `#/${d12}/`, f11 = b12[1].schema.id ?? `__schema${a10.counter++}`;
            return { defId: f11, ref: e12 + f11 };
          })(b11);
          d11.def = { ...d11.schema }, f10 && (d11.defId = f10);
          let g10 = d11.schema;
          for (let a11 in g10) delete g10[a11];
          g10.$ref = e11;
        };
        if ("throw" === a10.cycles) for (let b11 of a10.seen.entries()) {
          let a11 = b11[1];
          if (a11.cycle) throw Error(`Cycle detected: #/${a11.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
        }
        for (let c11 of a10.seen.entries()) {
          let d11 = c11[1];
          if (b10 === c11[0]) {
            e10(c11);
            continue;
          }
          if (a10.external) {
            let d12 = a10.external.registry.get(c11[0])?.id;
            if (b10 !== c11[0] && d12) {
              e10(c11);
              continue;
            }
          }
          if (a10.metadataRegistry.get(c11[0])?.id || d11.cycle || d11.count > 1 && "ref" === a10.reused) {
            e10(c11);
            continue;
          }
        }
      }
      function f0(a10, b10) {
        let c10 = a10.seen.get(b10);
        if (!c10) throw Error("Unprocessed schema. This is a bug in Zod.");
        let d10 = (b11) => {
          let c11 = a10.seen.get(b11);
          if (null === c11.ref) return;
          let e11 = c11.def ?? c11.schema, f11 = { ...e11 }, g10 = c11.ref;
          if (c11.ref = null, g10) {
            d10(g10);
            let c12 = a10.seen.get(g10), h11 = c12.schema;
            if (h11.$ref && ("draft-07" === a10.target || "draft-04" === a10.target || "openapi-3.0" === a10.target) ? (e11.allOf = e11.allOf ?? [], e11.allOf.push(h11)) : Object.assign(e11, h11), Object.assign(e11, f11), b11._zod.parent === g10) for (let a11 in e11) "$ref" !== a11 && "allOf" !== a11 && (a11 in f11 || delete e11[a11]);
            if (h11.$ref && c12.def) for (let a11 in e11) "$ref" !== a11 && "allOf" !== a11 && a11 in c12.def && JSON.stringify(e11[a11]) === JSON.stringify(c12.def[a11]) && delete e11[a11];
          }
          let h10 = b11._zod.parent;
          if (h10 && h10 !== g10) {
            d10(h10);
            let b12 = a10.seen.get(h10);
            if (b12?.schema.$ref && (e11.$ref = b12.schema.$ref, b12.def)) for (let a11 in e11) "$ref" !== a11 && "allOf" !== a11 && a11 in b12.def && JSON.stringify(e11[a11]) === JSON.stringify(b12.def[a11]) && delete e11[a11];
          }
          a10.override({ zodSchema: b11, jsonSchema: e11, path: c11.path ?? [] });
        };
        for (let b11 of [...a10.seen.entries()].reverse()) d10(b11[0]);
        let e10 = {};
        if ("draft-2020-12" === a10.target ? e10.$schema = "https://json-schema.org/draft/2020-12/schema" : "draft-07" === a10.target ? e10.$schema = "http://json-schema.org/draft-07/schema#" : "draft-04" === a10.target ? e10.$schema = "http://json-schema.org/draft-04/schema#" : a10.target, a10.external?.uri) {
          let c11 = a10.external.registry.get(b10)?.id;
          if (!c11) throw Error("Schema is missing an `id` property");
          e10.$id = a10.external.uri(c11);
        }
        Object.assign(e10, c10.def ?? c10.schema);
        let f10 = a10.external?.defs ?? {};
        for (let b11 of a10.seen.entries()) {
          let a11 = b11[1];
          a11.def && a11.defId && (f10[a11.defId] = a11.def);
        }
        a10.external || Object.keys(f10).length > 0 && ("draft-2020-12" === a10.target ? e10.$defs = f10 : e10.definitions = f10);
        try {
          let c11 = JSON.parse(JSON.stringify(e10));
          return Object.defineProperty(c11, "~standard", { value: { ...b10["~standard"], jsonSchema: { input: f1(b10, "input", a10.processors), output: f1(b10, "output", a10.processors) } }, enumerable: false, writable: false }), c11;
        } catch (a11) {
          throw Error("Error converting schema to JSON.");
        }
      }
      let f1 = (a10, b10, c10 = {}) => (d10) => {
        let { libraryOptions: e10, target: f10 } = d10 ?? {}, g10 = fZ({ ...e10 ?? {}, target: f10, io: b10, processors: c10 });
        return f$(a10, g10), f_(g10, a10), f0(g10, a10);
      }, f2 = { guid: "uuid", url: "uri", datetime: "date-time", json_string: "json-string", regex: "" }, f3 = (a10, b10, c10, d10) => {
        let e10 = a10._zod.def, f10 = false === e10.inclusive, g10 = e10.options.map((a11, c11) => f$(a11, b10, { ...d10, path: [...d10.path, f10 ? "oneOf" : "anyOf", c11] }));
        f10 ? c10.oneOf = g10 : c10.anyOf = g10;
      }, f4 = (a10, b10, c10, d10) => {
        let e10 = a10._zod.def;
        f$(e10.innerType, b10, d10), b10.seen.get(a10).ref = e10.innerType;
      }, f5 = bz("ZodISODateTime", (a10, b10) => {
        dV.init(a10, b10), gv.init(a10, b10);
      });
      function f6(a10) {
        return new f5({ type: "string", format: "datetime", check: "string_format", offset: false, local: false, precision: null, ...bY(a10) });
      }
      let f7 = bz("ZodISODate", (a10, b10) => {
        dW.init(a10, b10), gv.init(a10, b10);
      });
      function f8(a10) {
        return new f7({ type: "string", format: "date", check: "string_format", ...bY(a10) });
      }
      let f9 = bz("ZodISOTime", (a10, b10) => {
        dX.init(a10, b10), gv.init(a10, b10);
      });
      function ga(a10) {
        return new f9({ type: "string", format: "time", check: "string_format", precision: null, ...bY(a10) });
      }
      let gb = bz("ZodISODuration", (a10, b10) => {
        dY.init(a10, b10), gv.init(a10, b10);
      });
      function gc(a10) {
        return new gb({ type: "string", format: "duration", check: "string_format", ...bY(a10) });
      }
      let gd = (a10, b10) => {
        b8.init(a10, b10), a10.name = "ZodError", Object.defineProperties(a10, { format: { value: (b11) => function(a11, b12 = (a12) => a12.message) {
          let c10 = { _errors: [] }, d10 = (a12) => {
            for (let e10 of a12.issues) if ("invalid_union" === e10.code && e10.errors.length) e10.errors.map((a13) => d10({ issues: a13 }));
            else if ("invalid_key" === e10.code) d10({ issues: e10.issues });
            else if ("invalid_element" === e10.code) d10({ issues: e10.issues });
            else if (0 === e10.path.length) c10._errors.push(b12(e10));
            else {
              let a13 = c10, d11 = 0;
              for (; d11 < e10.path.length; ) {
                let c11 = e10.path[d11];
                d11 === e10.path.length - 1 ? (a13[c11] = a13[c11] || { _errors: [] }, a13[c11]._errors.push(b12(e10))) : a13[c11] = a13[c11] || { _errors: [] }, a13 = a13[c11], d11++;
              }
            }
          };
          return d10(a11), c10;
        }(a10, b11) }, flatten: { value: (b11) => function(a11, b12 = (a12) => a12.message) {
          let c10 = {}, d10 = [];
          for (let e10 of a11.issues) e10.path.length > 0 ? (c10[e10.path[0]] = c10[e10.path[0]] || [], c10[e10.path[0]].push(b12(e10))) : d10.push(b12(e10));
          return { formErrors: d10, fieldErrors: c10 };
        }(a10, b11) }, addIssue: { value: (b11) => {
          a10.issues.push(b11), a10.message = JSON.stringify(a10.issues, bG, 2);
        } }, addIssues: { value: (b11) => {
          a10.issues.push(...b11), a10.message = JSON.stringify(a10.issues, bG, 2);
        } }, isEmpty: { get: () => 0 === a10.issues.length } });
      };
      bz("ZodError", gd);
      let ge = bz("ZodError", gd, { Parent: Error }), gf = ca(ge), gg = cc(ge), gh = ce(ge), gi = cg(ge), gj = (a10, b10, c10) => {
        let d10 = c10 ? Object.assign(c10, { direction: "backward" }) : { direction: "backward" };
        return ca(ge)(a10, b10, d10);
      }, gk = (a10, b10, c10) => ca(ge)(a10, b10, c10), gl = async (a10, b10, c10) => {
        let d10 = c10 ? Object.assign(c10, { direction: "backward" }) : { direction: "backward" };
        return cc(ge)(a10, b10, d10);
      }, gm = async (a10, b10, c10) => cc(ge)(a10, b10, c10), gn = (a10, b10, c10) => {
        let d10 = c10 ? Object.assign(c10, { direction: "backward" }) : { direction: "backward" };
        return ce(ge)(a10, b10, d10);
      }, go = (a10, b10, c10) => ce(ge)(a10, b10, c10), gp = async (a10, b10, c10) => {
        let d10 = c10 ? Object.assign(c10, { direction: "backward" }) : { direction: "backward" };
        return cg(ge)(a10, b10, d10);
      }, gq = async (a10, b10, c10) => cg(ge)(a10, b10, c10), gr = bz("ZodType", (a10, b10) => (dH.init(a10, b10), Object.assign(a10["~standard"], { jsonSchema: { input: f1(a10, "input"), output: f1(a10, "output") } }), a10.toJSONSchema = /* @__PURE__ */ ((a11, b11 = {}) => (c10) => {
        let d10 = fZ({ ...c10, processors: b11 });
        return f$(a11, d10), f_(d10, a11), f0(d10, a11);
      })(a10, {}), a10.def = b10, a10.type = b10.type, Object.defineProperty(a10, "_def", { value: b10 }), a10.check = (...c10) => a10.clone(bN(b10, { checks: [...b10.checks ?? [], ...c10.map((a11) => "function" == typeof a11 ? { _zod: { check: a11, def: { check: "custom" }, onattach: [] } } : a11)] }), { parent: true }), a10.with = a10.check, a10.clone = (b11, c10) => bX(a10, b11, c10), a10.brand = () => a10, a10.register = (b11, c10) => (b11.add(a10, c10), a10), a10.parse = (b11, c10) => gf(a10, b11, c10, { callee: a10.parse }), a10.safeParse = (b11, c10) => gh(a10, b11, c10), a10.parseAsync = async (b11, c10) => gg(a10, b11, c10, { callee: a10.parseAsync }), a10.safeParseAsync = async (b11, c10) => gi(a10, b11, c10), a10.spa = a10.safeParseAsync, a10.encode = (b11, c10) => gj(a10, b11, c10), a10.decode = (b11, c10) => gk(a10, b11, c10), a10.encodeAsync = async (b11, c10) => gl(a10, b11, c10), a10.decodeAsync = async (b11, c10) => gm(a10, b11, c10), a10.safeEncode = (b11, c10) => gn(a10, b11, c10), a10.safeDecode = (b11, c10) => go(a10, b11, c10), a10.safeEncodeAsync = async (b11, c10) => gp(a10, b11, c10), a10.safeDecodeAsync = async (b11, c10) => gq(a10, b11, c10), a10.refine = (b11, c10) => a10.check(iU(b11, c10)), a10.superRefine = (b11) => a10.check(iV(b11)), a10.overwrite = (b11) => a10.check(fS(b11)), a10.optional = () => ik(a10), a10.exactOptional = () => im(a10), a10.nullable = () => ip(a10), a10.nullish = () => ik(ip(a10)), a10.nonoptional = (b11) => iw(a10, b11), a10.array = () => hN(a10), a10.or = (b11) => hU([a10, b11]), a10.and = (b11) => h$(a10, b11), a10.transform = (b11) => iE(a10, ii(b11)), a10.default = (b11) => is(a10, b11), a10.prefault = (b11) => iu(a10, b11), a10.catch = (b11) => iA(a10, b11), a10.pipe = (b11) => iE(a10, b11), a10.readonly = () => iI(a10), a10.describe = (b11) => {
        let c10 = a10.clone();
        return e8.add(c10, { description: b11 }), c10;
      }, Object.defineProperty(a10, "description", { get: () => e8.get(a10)?.description, configurable: true }), a10.meta = (...b11) => {
        if (0 === b11.length) return e8.get(a10);
        let c10 = a10.clone();
        return e8.add(c10, b11[0]), c10;
      }, a10.isOptional = () => a10.safeParse(void 0).success, a10.isNullable = () => a10.safeParse(null).success, a10.apply = (b11) => b11(a10), a10)), gs = bz("_ZodString", (a10, b10) => {
        dI.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (b11, c11, d10) => ((a11, b12, c12, d11) => {
          c12.type = "string";
          let { minimum: e10, maximum: f10, format: g10, patterns: h10, contentEncoding: i10 } = a11._zod.bag;
          if ("number" == typeof e10 && (c12.minLength = e10), "number" == typeof f10 && (c12.maxLength = f10), g10 && (c12.format = f2[g10] ?? g10, "" === c12.format && delete c12.format, "time" === g10 && delete c12.format), i10 && (c12.contentEncoding = i10), h10 && h10.size > 0) {
            let a12 = [...h10];
            1 === a12.length ? c12.pattern = a12[0].source : a12.length > 1 && (c12.allOf = [...a12.map((a13) => ({ ..."draft-07" === b12.target || "draft-04" === b12.target || "openapi-3.0" === b12.target ? { type: "string" } : {}, pattern: a13.source }))]);
          }
        })(a10, b11, c11, 0);
        let c10 = a10._zod.bag;
        a10.format = c10.format ?? null, a10.minLength = c10.minimum ?? null, a10.maxLength = c10.maximum ?? null, a10.regex = (...b11) => a10.check(fK(...b11)), a10.includes = (...b11) => a10.check(fN(...b11)), a10.startsWith = (...b11) => a10.check(fO(...b11)), a10.endsWith = (...b11) => a10.check(fP(...b11)), a10.min = (...b11) => a10.check(fI(...b11)), a10.max = (...b11) => a10.check(fH(...b11)), a10.length = (...b11) => a10.check(fJ(...b11)), a10.nonempty = (...b11) => a10.check(fI(1, ...b11)), a10.lowercase = (b11) => a10.check(fL(b11)), a10.uppercase = (b11) => a10.check(fM(b11)), a10.trim = () => a10.check(fU()), a10.normalize = (...b11) => a10.check(fT(...b11)), a10.toLowerCase = () => a10.check(fV()), a10.toUpperCase = () => a10.check(fW()), a10.slugify = () => a10.check(fX());
      }), gt = bz("ZodString", (a10, b10) => {
        dI.init(a10, b10), gs.init(a10, b10), a10.email = (b11) => a10.check(e9(gw, b11)), a10.url = (b11) => a10.check(ff(gF, b11)), a10.jwt = (b11) => a10.check(fu(ha, b11)), a10.emoji = (b11) => a10.check(fg(gI, b11)), a10.guid = (b11) => a10.check(fa(gy, b11)), a10.uuid = (b11) => a10.check(fb(gA, b11)), a10.uuidv4 = (b11) => a10.check(fc(gA, b11)), a10.uuidv6 = (b11) => a10.check(fd(gA, b11)), a10.uuidv7 = (b11) => a10.check(fe(gA, b11)), a10.nanoid = (b11) => a10.check(fh(gK, b11)), a10.guid = (b11) => a10.check(fa(gy, b11)), a10.cuid = (b11) => a10.check(fi(gM, b11)), a10.cuid2 = (b11) => a10.check(fj(gO, b11)), a10.ulid = (b11) => a10.check(fk(gQ, b11)), a10.base64 = (b11) => a10.check(fr(g4, b11)), a10.base64url = (b11) => a10.check(fs(g6, b11)), a10.xid = (b11) => a10.check(fl(gS, b11)), a10.ksuid = (b11) => a10.check(fm(gU, b11)), a10.ipv4 = (b11) => a10.check(fn(gW, b11)), a10.ipv6 = (b11) => a10.check(fo(g$, b11)), a10.cidrv4 = (b11) => a10.check(fp(g0, b11)), a10.cidrv6 = (b11) => a10.check(fq(g2, b11)), a10.e164 = (b11) => a10.check(ft(g8, b11)), a10.datetime = (b11) => a10.check(f6(b11)), a10.date = (b11) => a10.check(f8(b11)), a10.time = (b11) => a10.check(ga(b11)), a10.duration = (b11) => a10.check(gc(b11));
      });
      function gu(a10) {
        return new gt({ type: "string", ...bY(a10) });
      }
      let gv = bz("ZodStringFormat", (a10, b10) => {
        dJ.init(a10, b10), gs.init(a10, b10);
      }), gw = bz("ZodEmail", (a10, b10) => {
        dM.init(a10, b10), gv.init(a10, b10);
      });
      function gx(a10) {
        return e9(gw, a10);
      }
      let gy = bz("ZodGUID", (a10, b10) => {
        dK.init(a10, b10), gv.init(a10, b10);
      });
      function gz(a10) {
        return fa(gy, a10);
      }
      let gA = bz("ZodUUID", (a10, b10) => {
        dL.init(a10, b10), gv.init(a10, b10);
      });
      function gB(a10) {
        return fb(gA, a10);
      }
      function gC(a10) {
        return fc(gA, a10);
      }
      function gD(a10) {
        return fd(gA, a10);
      }
      function gE(a10) {
        return fe(gA, a10);
      }
      let gF = bz("ZodURL", (a10, b10) => {
        dN.init(a10, b10), gv.init(a10, b10);
      });
      function gG(a10) {
        return ff(gF, a10);
      }
      function gH(a10) {
        return ff(gF, { protocol: /^https?$/, hostname: cK, ...bY(a10) });
      }
      let gI = bz("ZodEmoji", (a10, b10) => {
        dO.init(a10, b10), gv.init(a10, b10);
      });
      function gJ(a10) {
        return fg(gI, a10);
      }
      let gK = bz("ZodNanoID", (a10, b10) => {
        dP.init(a10, b10), gv.init(a10, b10);
      });
      function gL(a10) {
        return fh(gK, a10);
      }
      let gM = bz("ZodCUID", (a10, b10) => {
        dQ.init(a10, b10), gv.init(a10, b10);
      });
      function gN(a10) {
        return fi(gM, a10);
      }
      let gO = bz("ZodCUID2", (a10, b10) => {
        dR.init(a10, b10), gv.init(a10, b10);
      });
      function gP(a10) {
        return fj(gO, a10);
      }
      let gQ = bz("ZodULID", (a10, b10) => {
        dS.init(a10, b10), gv.init(a10, b10);
      });
      function gR(a10) {
        return fk(gQ, a10);
      }
      let gS = bz("ZodXID", (a10, b10) => {
        dT.init(a10, b10), gv.init(a10, b10);
      });
      function gT(a10) {
        return fl(gS, a10);
      }
      let gU = bz("ZodKSUID", (a10, b10) => {
        dU.init(a10, b10), gv.init(a10, b10);
      });
      function gV(a10) {
        return fm(gU, a10);
      }
      let gW = bz("ZodIPv4", (a10, b10) => {
        dZ.init(a10, b10), gv.init(a10, b10);
      });
      function gX(a10) {
        return fn(gW, a10);
      }
      let gY = bz("ZodMAC", (a10, b10) => {
        d_.init(a10, b10), gv.init(a10, b10);
      });
      function gZ(a10) {
        return new gY({ type: "string", format: "mac", check: "string_format", abort: false, ...bY(a10) });
      }
      let g$ = bz("ZodIPv6", (a10, b10) => {
        d$.init(a10, b10), gv.init(a10, b10);
      });
      function g_(a10) {
        return fo(g$, a10);
      }
      let g0 = bz("ZodCIDRv4", (a10, b10) => {
        d0.init(a10, b10), gv.init(a10, b10);
      });
      function g1(a10) {
        return fp(g0, a10);
      }
      let g2 = bz("ZodCIDRv6", (a10, b10) => {
        d1.init(a10, b10), gv.init(a10, b10);
      });
      function g3(a10) {
        return fq(g2, a10);
      }
      let g4 = bz("ZodBase64", (a10, b10) => {
        d3.init(a10, b10), gv.init(a10, b10);
      });
      function g5(a10) {
        return fr(g4, a10);
      }
      let g6 = bz("ZodBase64URL", (a10, b10) => {
        d4.init(a10, b10), gv.init(a10, b10);
      });
      function g7(a10) {
        return fs(g6, a10);
      }
      let g8 = bz("ZodE164", (a10, b10) => {
        d5.init(a10, b10), gv.init(a10, b10);
      });
      function g9(a10) {
        return ft(g8, a10);
      }
      let ha = bz("ZodJWT", (a10, b10) => {
        d6.init(a10, b10), gv.init(a10, b10);
      });
      function hb(a10) {
        return fu(ha, a10);
      }
      let hc = bz("ZodCustomStringFormat", (a10, b10) => {
        d7.init(a10, b10), gv.init(a10, b10);
      });
      function hd(a10, b10, c10 = {}) {
        return fY(hc, a10, b10, c10);
      }
      function he(a10) {
        return fY(hc, "hostname", cJ, a10);
      }
      function hf(a10) {
        return fY(hc, "hex", c$, a10);
      }
      function hg(a10, b10) {
        let c10 = b10?.enc ?? "hex", d10 = `${a10}_${c10}`, e10 = h[d10];
        if (!e10) throw Error(`Unrecognized hash format: ${d10}`);
        return fY(hc, d10, e10, b10);
      }
      let hh = bz("ZodNumber", (a10, b10) => {
        d8.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (b11, c11, d10) => ((a11, b12, c12, d11) => {
          let { minimum: e10, maximum: f10, format: g10, multipleOf: h10, exclusiveMaximum: i10, exclusiveMinimum: j2 } = a11._zod.bag;
          "string" == typeof g10 && g10.includes("int") ? c12.type = "integer" : c12.type = "number", "number" == typeof j2 && ("draft-04" === b12.target || "openapi-3.0" === b12.target ? (c12.minimum = j2, c12.exclusiveMinimum = true) : c12.exclusiveMinimum = j2), "number" == typeof e10 && (c12.minimum = e10, "number" == typeof j2 && "draft-04" !== b12.target && (j2 >= e10 ? delete c12.minimum : delete c12.exclusiveMinimum)), "number" == typeof i10 && ("draft-04" === b12.target || "openapi-3.0" === b12.target ? (c12.maximum = i10, c12.exclusiveMaximum = true) : c12.exclusiveMaximum = i10), "number" == typeof f10 && (c12.maximum = f10, "number" == typeof i10 && "draft-04" !== b12.target && (i10 <= f10 ? delete c12.maximum : delete c12.exclusiveMaximum)), "number" == typeof h10 && (c12.multipleOf = h10);
        })(a10, b11, c11, 0), a10.gt = (b11, c11) => a10.check(fx(b11, c11)), a10.gte = (b11, c11) => a10.check(fy(b11, c11)), a10.min = (b11, c11) => a10.check(fy(b11, c11)), a10.lt = (b11, c11) => a10.check(fv(b11, c11)), a10.lte = (b11, c11) => a10.check(fw(b11, c11)), a10.max = (b11, c11) => a10.check(fw(b11, c11)), a10.int = (b11) => a10.check(hk(b11)), a10.safe = (b11) => a10.check(hk(b11)), a10.positive = (b11) => a10.check(fx(0, b11)), a10.nonnegative = (b11) => a10.check(fy(0, b11)), a10.negative = (b11) => a10.check(fv(0, b11)), a10.nonpositive = (b11) => a10.check(fw(0, b11)), a10.multipleOf = (b11, c11) => a10.check(fD(b11, c11)), a10.step = (b11, c11) => a10.check(fD(b11, c11)), a10.finite = () => a10;
        let c10 = a10._zod.bag;
        a10.minValue = Math.max(c10.minimum ?? -1 / 0, c10.exclusiveMinimum ?? -1 / 0) ?? null, a10.maxValue = Math.min(c10.maximum ?? 1 / 0, c10.exclusiveMaximum ?? 1 / 0) ?? null, a10.isInt = (c10.format ?? "").includes("int") || Number.isSafeInteger(c10.multipleOf ?? 0.5), a10.isFinite = true, a10.format = c10.format ?? null;
      });
      function hi(a10) {
        return new hh({ type: "number", checks: [], ...bY(a10) });
      }
      let hj = bz("ZodNumberFormat", (a10, b10) => {
        d9.init(a10, b10), hh.init(a10, b10);
      });
      function hk(a10) {
        return new hj({ type: "number", check: "number_format", abort: false, format: "safeint", ...bY(a10) });
      }
      function hl(a10) {
        return new hj({ type: "number", check: "number_format", abort: false, format: "float32", ...bY(a10) });
      }
      function hm(a10) {
        return new hj({ type: "number", check: "number_format", abort: false, format: "float64", ...bY(a10) });
      }
      function hn(a10) {
        return new hj({ type: "number", check: "number_format", abort: false, format: "int32", ...bY(a10) });
      }
      function ho(a10) {
        return new hj({ type: "number", check: "number_format", abort: false, format: "uint32", ...bY(a10) });
      }
      let hp = bz("ZodBoolean", (a10, b10) => {
        ea.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (a11, b11, c10) => {
          b11.type = "boolean";
        };
      });
      function hq(a10) {
        return new hp({ type: "boolean", ...bY(a10) });
      }
      let hr = bz("ZodBigInt", (a10, b10) => {
        eb.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (a11, b11, c11) => ((a12, b12, c12, d10) => {
          if ("throw" === b12.unrepresentable) throw Error("BigInt cannot be represented in JSON Schema");
        })(0, a11, 0, 0), a10.gte = (b11, c11) => a10.check(fy(b11, c11)), a10.min = (b11, c11) => a10.check(fy(b11, c11)), a10.gt = (b11, c11) => a10.check(fx(b11, c11)), a10.gte = (b11, c11) => a10.check(fy(b11, c11)), a10.min = (b11, c11) => a10.check(fy(b11, c11)), a10.lt = (b11, c11) => a10.check(fv(b11, c11)), a10.lte = (b11, c11) => a10.check(fw(b11, c11)), a10.max = (b11, c11) => a10.check(fw(b11, c11)), a10.positive = (b11) => a10.check(fx(BigInt(0), b11)), a10.negative = (b11) => a10.check(fv(BigInt(0), b11)), a10.nonpositive = (b11) => a10.check(fw(BigInt(0), b11)), a10.nonnegative = (b11) => a10.check(fy(BigInt(0), b11)), a10.multipleOf = (b11, c11) => a10.check(fD(b11, c11));
        let c10 = a10._zod.bag;
        a10.minValue = c10.minimum ?? null, a10.maxValue = c10.maximum ?? null, a10.format = c10.format ?? null;
      });
      function hs(a10) {
        return new hr({ type: "bigint", ...bY(a10) });
      }
      let ht = bz("ZodBigIntFormat", (a10, b10) => {
        ec.init(a10, b10), hr.init(a10, b10);
      });
      function hu(a10) {
        return new ht({ type: "bigint", check: "bigint_format", abort: false, format: "int64", ...bY(a10) });
      }
      function hv(a10) {
        return new ht({ type: "bigint", check: "bigint_format", abort: false, format: "uint64", ...bY(a10) });
      }
      let hw = bz("ZodSymbol", (a10, b10) => {
        ed.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (a11, b11, c10) => ((a12, b12, c11, d10) => {
          if ("throw" === b12.unrepresentable) throw Error("Symbols cannot be represented in JSON Schema");
        })(0, a11, 0, 0);
      });
      function hx(a10) {
        return new hw({ type: "symbol", ...bY(a10) });
      }
      let hy = bz("ZodUndefined", (a10, b10) => {
        ee.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (a11, b11, c10) => ((a12, b12, c11, d10) => {
          if ("throw" === b12.unrepresentable) throw Error("Undefined cannot be represented in JSON Schema");
        })(0, a11, 0, 0);
      });
      function hz(a10) {
        return new hy({ type: "undefined", ...bY(a10) });
      }
      let hA = bz("ZodNull", (a10, b10) => {
        ef.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (a11, b11, c10) => ((a12, b12, c11, d10) => {
          "openapi-3.0" === b12.target ? (c11.type = "string", c11.nullable = true, c11.enum = [null]) : c11.type = "null";
        })(0, a11, b11, 0);
      });
      function hB(a10) {
        return new hA({ type: "null", ...bY(a10) });
      }
      let hC = bz("ZodAny", (a10, b10) => {
        eg.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (a11, b11, c10) => {
        };
      });
      function hD() {
        return new hC({ type: "any" });
      }
      let hE = bz("ZodUnknown", (a10, b10) => {
        eh.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (a11, b11, c10) => {
        };
      });
      function hF() {
        return new hE({ type: "unknown" });
      }
      let hG = bz("ZodNever", (a10, b10) => {
        ei.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (a11, b11, c10) => {
          b11.not = {};
        };
      });
      function hH(a10) {
        return new hG({ type: "never", ...bY(a10) });
      }
      let hI = bz("ZodVoid", (a10, b10) => {
        ej.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (a11, b11, c10) => ((a12, b12, c11, d10) => {
          if ("throw" === b12.unrepresentable) throw Error("Void cannot be represented in JSON Schema");
        })(0, a11, 0, 0);
      });
      function hJ(a10) {
        return new hI({ type: "void", ...bY(a10) });
      }
      let hK = bz("ZodDate", (a10, b10) => {
        ek.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (a11, b11, c11) => ((a12, b12, c12, d10) => {
          if ("throw" === b12.unrepresentable) throw Error("Date cannot be represented in JSON Schema");
        })(0, a11, 0, 0), a10.min = (b11, c11) => a10.check(fy(b11, c11)), a10.max = (b11, c11) => a10.check(fw(b11, c11));
        let c10 = a10._zod.bag;
        a10.minDate = c10.minimum ? new Date(c10.minimum) : null, a10.maxDate = c10.maximum ? new Date(c10.maximum) : null;
      });
      function hL(a10) {
        return new hK({ type: "date", ...bY(a10) });
      }
      let hM = bz("ZodArray", (a10, b10) => {
        em.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (b11, c10, d10) => ((a11, b12, c11, d11) => {
          let e10 = a11._zod.def, { minimum: f10, maximum: g10 } = a11._zod.bag;
          "number" == typeof f10 && (c11.minItems = f10), "number" == typeof g10 && (c11.maxItems = g10), c11.type = "array", c11.items = f$(e10.element, b12, { ...d11, path: [...d11.path, "items"] });
        })(a10, b11, c10, d10), a10.element = b10.element, a10.min = (b11, c10) => a10.check(fI(b11, c10)), a10.nonempty = (b11) => a10.check(fI(1, b11)), a10.max = (b11, c10) => a10.check(fH(b11, c10)), a10.length = (b11, c10) => a10.check(fJ(b11, c10)), a10.unwrap = () => a10.element;
      });
      function hN(a10, b10) {
        return new hM({ type: "array", element: a10, ...bY(b10) });
      }
      function hO(a10) {
        return ia(Object.keys(a10._zod.def.shape));
      }
      let hP = bz("ZodObject", (a10, b10) => {
        er.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (b11, c10, d10) => ((a11, b12, c11, d11) => {
          let e10 = a11._zod.def;
          c11.type = "object", c11.properties = {};
          let f10 = e10.shape;
          for (let a12 in f10) c11.properties[a12] = f$(f10[a12], b12, { ...d11, path: [...d11.path, "properties", a12] });
          let g10 = new Set([...new Set(Object.keys(f10))].filter((a12) => {
            let c12 = e10.shape[a12]._zod;
            return "input" === b12.io ? void 0 === c12.optin : void 0 === c12.optout;
          }));
          g10.size > 0 && (c11.required = Array.from(g10)), e10.catchall?._zod.def.type === "never" ? c11.additionalProperties = false : e10.catchall ? e10.catchall && (c11.additionalProperties = f$(e10.catchall, b12, { ...d11, path: [...d11.path, "additionalProperties"] })) : "output" === b12.io && (c11.additionalProperties = false);
        })(a10, b11, c10, d10), bL(a10, "shape", () => b10.shape), a10.keyof = () => ia(Object.keys(a10._zod.def.shape)), a10.catchall = (b11) => a10.clone({ ...a10._zod.def, catchall: b11 }), a10.passthrough = () => a10.clone({ ...a10._zod.def, catchall: hF() }), a10.loose = () => a10.clone({ ...a10._zod.def, catchall: hF() }), a10.strict = () => a10.clone({ ...a10._zod.def, catchall: hH() }), a10.strip = () => a10.clone({ ...a10._zod.def, catchall: void 0 }), a10.extend = (b11) => function(a11, b12) {
          if (!bS(b12)) throw Error("Invalid input to extend: expected a plain object");
          let c10 = a11._zod.def.checks;
          if (c10 && c10.length > 0) {
            let c11 = a11._zod.def.shape;
            for (let a12 in b12) if (void 0 !== Object.getOwnPropertyDescriptor(c11, a12)) throw Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
          }
          let d10 = bN(a11._zod.def, { get shape() {
            let c11 = { ...a11._zod.def.shape, ...b12 };
            return bM(this, "shape", c11), c11;
          } });
          return bX(a11, d10);
        }(a10, b11), a10.safeExtend = (b11) => function(a11, b12) {
          if (!bS(b12)) throw Error("Invalid input to safeExtend: expected a plain object");
          let c10 = bN(a11._zod.def, { get shape() {
            let c11 = { ...a11._zod.def.shape, ...b12 };
            return bM(this, "shape", c11), c11;
          } });
          return bX(a11, c10);
        }(a10, b11), a10.merge = (b11) => function(a11, b12) {
          let c10 = bN(a11._zod.def, { get shape() {
            let c11 = { ...a11._zod.def.shape, ...b12._zod.def.shape };
            return bM(this, "shape", c11), c11;
          }, get catchall() {
            return b12._zod.def.catchall;
          }, checks: [] });
          return bX(a11, c10);
        }(a10, b11), a10.pick = (b11) => function(a11, b12) {
          let c10 = a11._zod.def, d10 = c10.checks;
          if (d10 && d10.length > 0) throw Error(".pick() cannot be used on object schemas containing refinements");
          let e10 = bN(a11._zod.def, { get shape() {
            let a12 = {};
            for (let d11 in b12) {
              if (!(d11 in c10.shape)) throw Error(`Unrecognized key: "${d11}"`);
              b12[d11] && (a12[d11] = c10.shape[d11]);
            }
            return bM(this, "shape", a12), a12;
          }, checks: [] });
          return bX(a11, e10);
        }(a10, b11), a10.omit = (b11) => function(a11, b12) {
          let c10 = a11._zod.def, d10 = c10.checks;
          if (d10 && d10.length > 0) throw Error(".omit() cannot be used on object schemas containing refinements");
          let e10 = bN(a11._zod.def, { get shape() {
            let d11 = { ...a11._zod.def.shape };
            for (let a12 in b12) {
              if (!(a12 in c10.shape)) throw Error(`Unrecognized key: "${a12}"`);
              b12[a12] && delete d11[a12];
            }
            return bM(this, "shape", d11), d11;
          }, checks: [] });
          return bX(a11, e10);
        }(a10, b11), a10.partial = (...b11) => function(a11, b12, c10) {
          let d10 = b12._zod.def.checks;
          if (d10 && d10.length > 0) throw Error(".partial() cannot be used on object schemas containing refinements");
          let e10 = bN(b12._zod.def, { get shape() {
            let d11 = b12._zod.def.shape, e11 = { ...d11 };
            if (c10) for (let b13 in c10) {
              if (!(b13 in d11)) throw Error(`Unrecognized key: "${b13}"`);
              c10[b13] && (e11[b13] = a11 ? new a11({ type: "optional", innerType: d11[b13] }) : d11[b13]);
            }
            else for (let b13 in d11) e11[b13] = a11 ? new a11({ type: "optional", innerType: d11[b13] }) : d11[b13];
            return bM(this, "shape", e11), e11;
          }, checks: [] });
          return bX(b12, e10);
        }(ij, a10, b11[0]), a10.required = (...b11) => function(a11, b12, c10) {
          let d10 = bN(b12._zod.def, { get shape() {
            let d11 = b12._zod.def.shape, e10 = { ...d11 };
            if (c10) for (let b13 in c10) {
              if (!(b13 in e10)) throw Error(`Unrecognized key: "${b13}"`);
              c10[b13] && (e10[b13] = new a11({ type: "nonoptional", innerType: d11[b13] }));
            }
            else for (let b13 in d11) e10[b13] = new a11({ type: "nonoptional", innerType: d11[b13] });
            return bM(this, "shape", e10), e10;
          } });
          return bX(b12, d10);
        }(iv, a10, b11[0]);
      });
      function hQ(a10, b10) {
        return new hP({ type: "object", shape: a10 ?? {}, ...bY(b10) });
      }
      function hR(a10, b10) {
        return new hP({ type: "object", shape: a10, catchall: hH(), ...bY(b10) });
      }
      function hS(a10, b10) {
        return new hP({ type: "object", shape: a10, catchall: hF(), ...bY(b10) });
      }
      let hT = bz("ZodUnion", (a10, b10) => {
        et.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (b11, c10, d10) => f3(a10, b11, c10, d10), a10.options = b10.options;
      });
      function hU(a10, b10) {
        return new hT({ type: "union", options: a10, ...bY(b10) });
      }
      let hV = bz("ZodXor", (a10, b10) => {
        hT.init(a10, b10), ev.init(a10, b10), a10._zod.processJSONSchema = (b11, c10, d10) => f3(a10, b11, c10, d10), a10.options = b10.options;
      });
      function hW(a10, b10) {
        return new hV({ type: "union", options: a10, inclusive: false, ...bY(b10) });
      }
      let hX = bz("ZodDiscriminatedUnion", (a10, b10) => {
        hT.init(a10, b10), ew.init(a10, b10);
      });
      function hY(a10, b10, c10) {
        return new hX({ type: "union", options: b10, discriminator: a10, ...bY(c10) });
      }
      let hZ = bz("ZodIntersection", (a10, b10) => {
        ex.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (b11, c10, d10) => ((a11, b12, c11, d11) => {
          let e10 = a11._zod.def, f10 = f$(e10.left, b12, { ...d11, path: [...d11.path, "allOf", 0] }), g10 = f$(e10.right, b12, { ...d11, path: [...d11.path, "allOf", 1] }), h10 = (a12) => "allOf" in a12 && 1 === Object.keys(a12).length;
          c11.allOf = [...h10(f10) ? f10.allOf : [f10], ...h10(g10) ? g10.allOf : [g10]];
        })(a10, b11, c10, d10);
      });
      function h$(a10, b10) {
        return new hZ({ type: "intersection", left: a10, right: b10 });
      }
      let h_ = bz("ZodTuple", (a10, b10) => {
        ez.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (b11, c10, d10) => ((a11, b12, c11, d11) => {
          let e10 = a11._zod.def;
          c11.type = "array";
          let f10 = "draft-2020-12" === b12.target ? "prefixItems" : "items", g10 = "draft-2020-12" === b12.target || "openapi-3.0" === b12.target ? "items" : "additionalItems", h10 = e10.items.map((a12, c12) => f$(a12, b12, { ...d11, path: [...d11.path, f10, c12] })), i10 = e10.rest ? f$(e10.rest, b12, { ...d11, path: [...d11.path, g10, ..."openapi-3.0" === b12.target ? [e10.items.length] : []] }) : null;
          "draft-2020-12" === b12.target ? (c11.prefixItems = h10, i10 && (c11.items = i10)) : "openapi-3.0" === b12.target ? (c11.items = { anyOf: h10 }, i10 && c11.items.anyOf.push(i10), c11.minItems = h10.length, i10 || (c11.maxItems = h10.length)) : (c11.items = h10, i10 && (c11.additionalItems = i10));
          let { minimum: j2, maximum: k2 } = a11._zod.bag;
          "number" == typeof j2 && (c11.minItems = j2), "number" == typeof k2 && (c11.maxItems = k2);
        })(a10, b11, c10, d10), a10.rest = (b11) => a10.clone({ ...a10._zod.def, rest: b11 });
      });
      function h0(a10, b10, c10) {
        let d10 = b10 instanceof dH, e10 = d10 ? c10 : b10;
        return new h_({ type: "tuple", items: a10, rest: d10 ? b10 : null, ...bY(e10) });
      }
      let h1 = bz("ZodRecord", (a10, b10) => {
        eB.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (b11, c10, d10) => ((a11, b12, c11, d11) => {
          let e10 = a11._zod.def;
          c11.type = "object";
          let f10 = e10.keyType, g10 = f10._zod.bag, h10 = g10?.patterns;
          if ("loose" === e10.mode && h10 && h10.size > 0) {
            let a12 = f$(e10.valueType, b12, { ...d11, path: [...d11.path, "patternProperties", "*"] });
            for (let b13 of (c11.patternProperties = {}, h10)) c11.patternProperties[b13.source] = a12;
          } else ("draft-07" === b12.target || "draft-2020-12" === b12.target) && (c11.propertyNames = f$(e10.keyType, b12, { ...d11, path: [...d11.path, "propertyNames"] })), c11.additionalProperties = f$(e10.valueType, b12, { ...d11, path: [...d11.path, "additionalProperties"] });
          let i10 = f10._zod.values;
          if (i10) {
            let a12 = [...i10].filter((a13) => "string" == typeof a13 || "number" == typeof a13);
            a12.length > 0 && (c11.required = a12);
          }
        })(a10, b11, c10, d10), a10.keyType = b10.keyType, a10.valueType = b10.valueType;
      });
      function h2(a10, b10, c10) {
        return new h1({ type: "record", keyType: a10, valueType: b10, ...bY(c10) });
      }
      function h3(a10, b10, c10) {
        let d10 = bX(a10);
        return d10._zod.values = void 0, new h1({ type: "record", keyType: d10, valueType: b10, ...bY(c10) });
      }
      function h4(a10, b10, c10) {
        return new h1({ type: "record", keyType: a10, valueType: b10, mode: "loose", ...bY(c10) });
      }
      let h5 = bz("ZodMap", (a10, b10) => {
        eC.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (a11, b11, c10) => ((a12, b12, c11, d10) => {
          if ("throw" === b12.unrepresentable) throw Error("Map cannot be represented in JSON Schema");
        })(0, a11, 0, 0), a10.keyType = b10.keyType, a10.valueType = b10.valueType, a10.min = (...b11) => a10.check(fF(...b11)), a10.nonempty = (b11) => a10.check(fF(1, b11)), a10.max = (...b11) => a10.check(fE(...b11)), a10.size = (...b11) => a10.check(fG(...b11));
      });
      function h6(a10, b10, c10) {
        return new h5({ type: "map", keyType: a10, valueType: b10, ...bY(c10) });
      }
      let h7 = bz("ZodSet", (a10, b10) => {
        eE.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (a11, b11, c10) => ((a12, b12, c11, d10) => {
          if ("throw" === b12.unrepresentable) throw Error("Set cannot be represented in JSON Schema");
        })(0, a11, 0, 0), a10.min = (...b11) => a10.check(fF(...b11)), a10.nonempty = (b11) => a10.check(fF(1, b11)), a10.max = (...b11) => a10.check(fE(...b11)), a10.size = (...b11) => a10.check(fG(...b11));
      });
      function h8(a10, b10) {
        return new h7({ type: "set", valueType: a10, ...bY(b10) });
      }
      let h9 = bz("ZodEnum", (a10, b10) => {
        eG.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (b11, c11, d10) => ((a11, b12, c12, d11) => {
          let e10 = bE(a11._zod.def.entries);
          e10.every((a12) => "number" == typeof a12) && (c12.type = "number"), e10.every((a12) => "string" == typeof a12) && (c12.type = "string"), c12.enum = e10;
        })(a10, 0, c11, 0), a10.enum = b10.entries, a10.options = Object.values(b10.entries);
        let c10 = new Set(Object.keys(b10.entries));
        a10.extract = (a11, d10) => {
          let e10 = {};
          for (let d11 of a11) if (c10.has(d11)) e10[d11] = b10.entries[d11];
          else throw Error(`Key ${d11} not found in enum`);
          return new h9({ ...b10, checks: [], ...bY(d10), entries: e10 });
        }, a10.exclude = (a11, d10) => {
          let e10 = { ...b10.entries };
          for (let b11 of a11) if (c10.has(b11)) delete e10[b11];
          else throw Error(`Key ${b11} not found in enum`);
          return new h9({ ...b10, checks: [], ...bY(d10), entries: e10 });
        };
      });
      function ia(a10, b10) {
        return new h9({ type: "enum", entries: Array.isArray(a10) ? Object.fromEntries(a10.map((a11) => [a11, a11])) : a10, ...bY(b10) });
      }
      function ib(a10, b10) {
        return new h9({ type: "enum", entries: a10, ...bY(b10) });
      }
      let ic = bz("ZodLiteral", (a10, b10) => {
        eH.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (b11, c10, d10) => ((a11, b12, c11, d11) => {
          let e10 = a11._zod.def, f10 = [];
          for (let a12 of e10.values) if (void 0 === a12) {
            if ("throw" === b12.unrepresentable) throw Error("Literal `undefined` cannot be represented in JSON Schema");
          } else if ("bigint" == typeof a12) if ("throw" === b12.unrepresentable) throw Error("BigInt literals cannot be represented in JSON Schema");
          else f10.push(Number(a12));
          else f10.push(a12);
          if (0 === f10.length) ;
          else if (1 === f10.length) {
            let a12 = f10[0];
            c11.type = null === a12 ? "null" : typeof a12, "draft-04" === b12.target || "openapi-3.0" === b12.target ? c11.enum = [a12] : c11.const = a12;
          } else f10.every((a12) => "number" == typeof a12) && (c11.type = "number"), f10.every((a12) => "string" == typeof a12) && (c11.type = "string"), f10.every((a12) => "boolean" == typeof a12) && (c11.type = "boolean"), f10.every((a12) => null === a12) && (c11.type = "null"), c11.enum = f10;
        })(a10, b11, c10, 0), a10.values = new Set(b10.values), Object.defineProperty(a10, "value", { get() {
          if (b10.values.length > 1) throw Error("This schema contains multiple valid literal values. Use `.values` instead.");
          return b10.values[0];
        } });
      });
      function id(a10, b10) {
        return new ic({ type: "literal", values: Array.isArray(a10) ? a10 : [a10], ...bY(b10) });
      }
      let ie = bz("ZodFile", (a10, b10) => {
        eI.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (b11, c10, d10) => ((a11, b12, c11, d11) => {
          let e10 = { type: "string", format: "binary", contentEncoding: "binary" }, { minimum: f10, maximum: g10, mime: h10 } = a11._zod.bag;
          void 0 !== f10 && (e10.minLength = f10), void 0 !== g10 && (e10.maxLength = g10), h10 ? 1 === h10.length ? (e10.contentMediaType = h10[0], Object.assign(c11, e10)) : (Object.assign(c11, e10), c11.anyOf = h10.map((a12) => ({ contentMediaType: a12 }))) : Object.assign(c11, e10);
        })(a10, 0, c10, 0), a10.min = (b11, c10) => a10.check(fF(b11, c10)), a10.max = (b11, c10) => a10.check(fE(b11, c10)), a10.mime = (b11, c10) => a10.check(fR(Array.isArray(b11) ? b11 : [b11], c10));
      });
      function ig(a10) {
        return new ie({ type: "file", ...bY(a10) });
      }
      let ih = bz("ZodTransform", (a10, b10) => {
        eJ.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (a11, b11, c10) => ((a12, b12, c11, d10) => {
          if ("throw" === b12.unrepresentable) throw Error("Transforms cannot be represented in JSON Schema");
        })(0, a11, 0, 0), a10._zod.parse = (c10, d10) => {
          if ("backward" === d10.direction) throw new bB(a10.constructor.name);
          c10.addIssue = (d11) => {
            "string" == typeof d11 ? c10.issues.push(b6(d11, c10.value, b10)) : (d11.fatal && (d11.continue = false), d11.code ?? (d11.code = "custom"), d11.input ?? (d11.input = c10.value), d11.inst ?? (d11.inst = a10), c10.issues.push(b6(d11)));
          };
          let e10 = b10.transform(c10.value, c10);
          return e10 instanceof Promise ? e10.then((a11) => (c10.value = a11, c10)) : (c10.value = e10, c10);
        };
      });
      function ii(a10) {
        return new ih({ type: "transform", transform: a10 });
      }
      let ij = bz("ZodOptional", (a10, b10) => {
        eL.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (b11, c10, d10) => f4(a10, b11, c10, d10), a10.unwrap = () => a10._zod.def.innerType;
      });
      function ik(a10) {
        return new ij({ type: "optional", innerType: a10 });
      }
      let il = bz("ZodExactOptional", (a10, b10) => {
        eM.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (b11, c10, d10) => f4(a10, b11, c10, d10), a10.unwrap = () => a10._zod.def.innerType;
      });
      function im(a10) {
        return new il({ type: "optional", innerType: a10 });
      }
      let io = bz("ZodNullable", (a10, b10) => {
        eN.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (b11, c10, d10) => ((a11, b12, c11, d11) => {
          let e10 = a11._zod.def, f10 = f$(e10.innerType, b12, d11), g10 = b12.seen.get(a11);
          "openapi-3.0" === b12.target ? (g10.ref = e10.innerType, c11.nullable = true) : c11.anyOf = [f10, { type: "null" }];
        })(a10, b11, c10, d10), a10.unwrap = () => a10._zod.def.innerType;
      });
      function ip(a10) {
        return new io({ type: "nullable", innerType: a10 });
      }
      function iq(a10) {
        return ik(ip(a10));
      }
      let ir = bz("ZodDefault", (a10, b10) => {
        eO.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (b11, c10, d10) => ((a11, b12, c11, d11) => {
          let e10 = a11._zod.def;
          f$(e10.innerType, b12, d11), b12.seen.get(a11).ref = e10.innerType, c11.default = JSON.parse(JSON.stringify(e10.defaultValue));
        })(a10, b11, c10, d10), a10.unwrap = () => a10._zod.def.innerType, a10.removeDefault = a10.unwrap;
      });
      function is(a10, b10) {
        return new ir({ type: "default", innerType: a10, get defaultValue() {
          return "function" == typeof b10 ? b10() : bT(b10);
        } });
      }
      let it = bz("ZodPrefault", (a10, b10) => {
        eQ.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (b11, c10, d10) => ((a11, b12, c11, d11) => {
          let e10 = a11._zod.def;
          f$(e10.innerType, b12, d11), b12.seen.get(a11).ref = e10.innerType, "input" === b12.io && (c11._prefault = JSON.parse(JSON.stringify(e10.defaultValue)));
        })(a10, b11, c10, d10), a10.unwrap = () => a10._zod.def.innerType;
      });
      function iu(a10, b10) {
        return new it({ type: "prefault", innerType: a10, get defaultValue() {
          return "function" == typeof b10 ? b10() : bT(b10);
        } });
      }
      let iv = bz("ZodNonOptional", (a10, b10) => {
        eR.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (b11, c10, d10) => ((a11, b12, c11, d11) => {
          let e10 = a11._zod.def;
          f$(e10.innerType, b12, d11), b12.seen.get(a11).ref = e10.innerType;
        })(a10, b11, 0, d10), a10.unwrap = () => a10._zod.def.innerType;
      });
      function iw(a10, b10) {
        return new iv({ type: "nonoptional", innerType: a10, ...bY(b10) });
      }
      let ix = bz("ZodSuccess", (a10, b10) => {
        eT.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (a11, b11, c10) => {
          b11.type = "boolean";
        }, a10.unwrap = () => a10._zod.def.innerType;
      });
      function iy(a10) {
        return new ix({ type: "success", innerType: a10 });
      }
      let iz = bz("ZodCatch", (a10, b10) => {
        eU.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (b11, c10, d10) => ((a11, b12, c11, d11) => {
          let e10, f10 = a11._zod.def;
          f$(f10.innerType, b12, d11), b12.seen.get(a11).ref = f10.innerType;
          try {
            e10 = f10.catchValue(void 0);
          } catch {
            throw Error("Dynamic catch values are not supported in JSON Schema");
          }
          c11.default = e10;
        })(a10, b11, c10, d10), a10.unwrap = () => a10._zod.def.innerType, a10.removeCatch = a10.unwrap;
      });
      function iA(a10, b10) {
        return new iz({ type: "catch", innerType: a10, catchValue: "function" == typeof b10 ? b10 : () => b10 });
      }
      let iB = bz("ZodNaN", (a10, b10) => {
        eV.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (a11, b11, c10) => ((a12, b12, c11, d10) => {
          if ("throw" === b12.unrepresentable) throw Error("NaN cannot be represented in JSON Schema");
        })(0, a11, 0, 0);
      });
      function iC(a10) {
        return new iB({ type: "nan", ...bY(a10) });
      }
      let iD = bz("ZodPipe", (a10, b10) => {
        eW.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (b11, c10, d10) => ((a11, b12, c11, d11) => {
          let e10 = a11._zod.def, f10 = "input" === b12.io ? "transform" === e10.in._zod.def.type ? e10.out : e10.in : e10.out;
          f$(f10, b12, d11), b12.seen.get(a11).ref = f10;
        })(a10, b11, 0, d10), a10.in = b10.in, a10.out = b10.out;
      });
      function iE(a10, b10) {
        return new iD({ type: "pipe", in: a10, out: b10 });
      }
      let iF = bz("ZodCodec", (a10, b10) => {
        iD.init(a10, b10), eY.init(a10, b10);
      });
      function iG(a10, b10, c10) {
        return new iF({ type: "pipe", in: a10, out: b10, transform: c10.decode, reverseTransform: c10.encode });
      }
      let iH = bz("ZodReadonly", (a10, b10) => {
        e_.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (b11, c10, d10) => ((a11, b12, c11, d11) => {
          let e10 = a11._zod.def;
          f$(e10.innerType, b12, d11), b12.seen.get(a11).ref = e10.innerType, c11.readOnly = true;
        })(a10, b11, c10, d10), a10.unwrap = () => a10._zod.def.innerType;
      });
      function iI(a10) {
        return new iH({ type: "readonly", innerType: a10 });
      }
      let iJ = bz("ZodTemplateLiteral", (a10, b10) => {
        e1.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (b11, c10, d10) => ((a11, b12, c11, d11) => {
          let e10 = a11._zod.pattern;
          if (!e10) throw Error("Pattern not found in template literal");
          c11.type = "string", c11.pattern = e10.source;
        })(a10, 0, c10, 0);
      });
      function iK(a10, b10) {
        return new iJ({ type: "template_literal", parts: a10, ...bY(b10) });
      }
      let iL = bz("ZodLazy", (a10, b10) => {
        e4.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (b11, c10, d10) => ((a11, b12, c11, d11) => {
          let e10 = a11._zod.innerType;
          f$(e10, b12, d11), b12.seen.get(a11).ref = e10;
        })(a10, b11, 0, d10), a10.unwrap = () => a10._zod.def.getter();
      });
      function iM(a10) {
        return new iL({ type: "lazy", getter: a10 });
      }
      let iN = bz("ZodPromise", (a10, b10) => {
        e3.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (b11, c10, d10) => ((a11, b12, c11, d11) => {
          let e10 = a11._zod.def;
          f$(e10.innerType, b12, d11), b12.seen.get(a11).ref = e10.innerType;
        })(a10, b11, 0, d10), a10.unwrap = () => a10._zod.def.innerType;
      });
      function iO(a10) {
        return new iN({ type: "promise", innerType: a10 });
      }
      let iP = bz("ZodFunction", (a10, b10) => {
        e2.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (a11, b11, c10) => ((a12, b12, c11, d10) => {
          if ("throw" === b12.unrepresentable) throw Error("Function types cannot be represented in JSON Schema");
        })(0, a11, 0, 0);
      });
      function iQ(a10) {
        return new iP({ type: "function", input: Array.isArray(a10?.input) ? h0(a10?.input) : a10?.input ?? hN(hF()), output: a10?.output ?? hF() });
      }
      let iR = bz("ZodCustom", (a10, b10) => {
        e5.init(a10, b10), gr.init(a10, b10), a10._zod.processJSONSchema = (a11, b11, c10) => ((a12, b12, c11, d10) => {
          if ("throw" === b12.unrepresentable) throw Error("Custom types cannot be represented in JSON Schema");
        })(0, a11, 0, 0);
      });
      function iS(a10) {
        let b10 = new dg({ check: "custom" });
        return b10._zod.check = a10, b10;
      }
      function iT(a10, b10) {
        let c10 = bY(b10);
        return c10.abort ?? (c10.abort = true), new iR({ type: "custom", check: "custom", fn: a10 ?? (() => true), ...c10 });
      }
      function iU(a10, b10 = {}) {
        return new iR({ type: "custom", check: "custom", fn: a10, ...bY(b10) });
      }
      function iV(a10) {
        let b10 = function(a11, b11) {
          let c10 = new dg({ check: "custom", ...bY(void 0) });
          return c10._zod.check = a11, c10;
        }((c10) => (c10.addIssue = (a11) => {
          "string" == typeof a11 ? c10.issues.push(b6(a11, c10.value, b10._zod.def)) : (a11.fatal && (a11.continue = false), a11.code ?? (a11.code = "custom"), a11.input ?? (a11.input = c10.value), a11.inst ?? (a11.inst = b10), a11.continue ?? (a11.continue = !b10._zod.def.abort), c10.issues.push(b6(a11)));
        }, a10(c10.value, c10)));
        return b10;
      }
      let iW = function(a10) {
        let b10 = new dg({ check: "describe" });
        return b10._zod.onattach = [(b11) => {
          let c10 = e8.get(b11) ?? {};
          e8.add(b11, { ...c10, description: a10 });
        }], b10._zod.check = () => {
        }, b10;
      }, iX = function(a10) {
        let b10 = new dg({ check: "meta" });
        return b10._zod.onattach = [(b11) => {
          let c10 = e8.get(b11) ?? {};
          e8.add(b11, { ...c10, ...a10 });
        }], b10._zod.check = () => {
        }, b10;
      };
      function iY(a10, b10 = {}) {
        let c10 = new iR({ type: "custom", check: "custom", fn: (b11) => b11 instanceof a10, abort: true, ...bY(b10) });
        return c10._zod.bag.Class = a10, c10._zod.check = (b11) => {
          b11.value instanceof a10 || b11.issues.push({ code: "invalid_type", expected: a10.name, input: b11.value, inst: c10, path: [...c10._zod.def.path ?? []] });
        }, c10;
      }
      let iZ = (...a10) => function(a11, b10) {
        let c10 = bY(b10), d10 = c10.truthy ?? ["true", "1", "yes", "on", "y", "enabled"], e10 = c10.falsy ?? ["false", "0", "no", "off", "n", "disabled"];
        "sensitive" !== c10.case && (d10 = d10.map((a12) => "string" == typeof a12 ? a12.toLowerCase() : a12), e10 = e10.map((a12) => "string" == typeof a12 ? a12.toLowerCase() : a12));
        let f10 = new Set(d10), g10 = new Set(e10), h10 = a11.Codec ?? eY, i10 = a11.Boolean ?? ea, j2 = new h10({ type: "pipe", in: new (a11.String ?? dI)({ type: "string", error: c10.error }), out: new i10({ type: "boolean", error: c10.error }), transform: (a12, b11) => {
          let d11 = a12;
          return "sensitive" !== c10.case && (d11 = d11.toLowerCase()), !!f10.has(d11) || !g10.has(d11) && (b11.issues.push({ code: "invalid_value", expected: "stringbool", values: [...f10, ...g10], input: b11.value, inst: j2, continue: false }), {});
        }, reverseTransform: (a12, b11) => true === a12 ? d10[0] || "true" : e10[0] || "false", error: c10.error });
        return j2;
      }({ Codec: iF, Boolean: hp, String: gt }, ...a10);
      function i$(a10) {
        let b10 = iM(() => hU([gu(a10), hi(), hq(), hB(), hN(b10), h2(gu(), b10)]));
        return b10;
      }
      function i_(a10, b10) {
        return iE(ii(a10), b10);
      }
      function i0(a10) {
        return new gt({ type: "string", coerce: true, ...bY(a10) });
      }
      function i1(a10) {
        return new hp({ type: "boolean", coerce: true, ...bY(a10) });
      }
      g || (g = {}), bD({ localeError: /* @__PURE__ */ (() => {
        let a10 = { string: { unit: "characters", verb: "to have" }, file: { unit: "bytes", verb: "to have" }, array: { unit: "items", verb: "to have" }, set: { unit: "items", verb: "to have" }, map: { unit: "entries", verb: "to have" } }, b10 = { regex: "input", email: "email address", url: "URL", emoji: "emoji", uuid: "UUID", uuidv4: "UUIDv4", uuidv6: "UUIDv6", nanoid: "nanoid", guid: "GUID", cuid: "cuid", cuid2: "cuid2", ulid: "ULID", xid: "XID", ksuid: "KSUID", datetime: "ISO datetime", date: "ISO date", time: "ISO time", duration: "ISO duration", ipv4: "IPv4 address", ipv6: "IPv6 address", mac: "MAC address", cidrv4: "IPv4 range", cidrv6: "IPv6 range", base64: "base64-encoded string", base64url: "base64url-encoded string", json_string: "JSON string", e164: "E.164 number", jwt: "JWT", template_literal: "input" }, c10 = { nan: "NaN" };
        return (d10) => {
          switch (d10.code) {
            case "invalid_type": {
              let a11 = c10[d10.expected] ?? d10.expected, b11 = function(a12) {
                let b12 = typeof a12;
                switch (b12) {
                  case "number":
                    return Number.isNaN(a12) ? "nan" : "number";
                  case "object":
                    if (null === a12) return "null";
                    if (Array.isArray(a12)) return "array";
                    if (a12 && Object.getPrototypeOf(a12) !== Object.prototype && "constructor" in a12 && a12.constructor) return a12.constructor.name;
                }
                return b12;
              }(d10.input), e10 = c10[b11] ?? b11;
              return `Invalid input: expected ${a11}, received ${e10}`;
            }
            case "invalid_value":
              if (1 === d10.values.length) return `Invalid input: expected ${bZ(d10.values[0])}`;
              return `Invalid option: expected one of ${bF(d10.values, "|")}`;
            case "too_big": {
              let b11 = d10.inclusive ? "<=" : "<", c11 = a10[d10.origin] ?? null;
              if (c11) return `Too big: expected ${d10.origin ?? "value"} to have ${b11}${d10.maximum.toString()} ${c11.unit ?? "elements"}`;
              return `Too big: expected ${d10.origin ?? "value"} to be ${b11}${d10.maximum.toString()}`;
            }
            case "too_small": {
              let b11 = d10.inclusive ? ">=" : ">", c11 = a10[d10.origin] ?? null;
              if (c11) return `Too small: expected ${d10.origin} to have ${b11}${d10.minimum.toString()} ${c11.unit}`;
              return `Too small: expected ${d10.origin} to be ${b11}${d10.minimum.toString()}`;
            }
            case "invalid_format":
              if ("starts_with" === d10.format) return `Invalid string: must start with "${d10.prefix}"`;
              if ("ends_with" === d10.format) return `Invalid string: must end with "${d10.suffix}"`;
              if ("includes" === d10.format) return `Invalid string: must include "${d10.includes}"`;
              if ("regex" === d10.format) return `Invalid string: must match pattern ${d10.pattern}`;
              return `Invalid ${b10[d10.format] ?? d10.format}`;
            case "not_multiple_of":
              return `Invalid number: must be a multiple of ${d10.divisor}`;
            case "unrecognized_keys":
              return `Unrecognized key${d10.keys.length > 1 ? "s" : ""}: ${bF(d10.keys, ", ")}`;
            case "invalid_key":
              return `Invalid key in ${d10.origin}`;
            case "invalid_union":
            default:
              return "Invalid input";
            case "invalid_element":
              return `Invalid value in ${d10.origin}`;
          }
        };
      })() });
      let i2 = hQ({ id: gu(), createdAt: hL().default(() => /* @__PURE__ */ new Date()), updatedAt: hL().default(() => /* @__PURE__ */ new Date()) });
      i2.extend({ providerId: gu(), accountId: gu(), userId: i0(), accessToken: gu().nullish(), refreshToken: gu().nullish(), idToken: gu().nullish(), accessTokenExpiresAt: hL().nullish(), refreshTokenExpiresAt: hL().nullish(), scope: gu().nullish(), password: gu().nullish() }), hQ({ key: gu(), count: hi(), lastRequest: hi() }), i2.extend({ userId: i0(), expiresAt: hL(), token: gu(), ipAddress: gu().nullish(), userAgent: gu().nullish() }), i2.extend({ email: gu().transform((a10) => a10.toLowerCase()), emailVerified: hq().default(false), name: gu(), image: gu().nullish() }), i2.extend({ value: gu(), expiresAt: hL(), identifier: gu() });
      let i3 = { OK: 200, CREATED: 201, ACCEPTED: 202, NO_CONTENT: 204, MULTIPLE_CHOICES: 300, MOVED_PERMANENTLY: 301, FOUND: 302, SEE_OTHER: 303, NOT_MODIFIED: 304, TEMPORARY_REDIRECT: 307, BAD_REQUEST: 400, UNAUTHORIZED: 401, PAYMENT_REQUIRED: 402, FORBIDDEN: 403, NOT_FOUND: 404, METHOD_NOT_ALLOWED: 405, NOT_ACCEPTABLE: 406, PROXY_AUTHENTICATION_REQUIRED: 407, REQUEST_TIMEOUT: 408, CONFLICT: 409, GONE: 410, LENGTH_REQUIRED: 411, PRECONDITION_FAILED: 412, PAYLOAD_TOO_LARGE: 413, URI_TOO_LONG: 414, UNSUPPORTED_MEDIA_TYPE: 415, RANGE_NOT_SATISFIABLE: 416, EXPECTATION_FAILED: 417, "I'M_A_TEAPOT": 418, MISDIRECTED_REQUEST: 421, UNPROCESSABLE_ENTITY: 422, LOCKED: 423, FAILED_DEPENDENCY: 424, TOO_EARLY: 425, UPGRADE_REQUIRED: 426, PRECONDITION_REQUIRED: 428, TOO_MANY_REQUESTS: 429, REQUEST_HEADER_FIELDS_TOO_LARGE: 431, UNAVAILABLE_FOR_LEGAL_REASONS: 451, INTERNAL_SERVER_ERROR: 500, NOT_IMPLEMENTED: 501, BAD_GATEWAY: 502, SERVICE_UNAVAILABLE: 503, GATEWAY_TIMEOUT: 504, HTTP_VERSION_NOT_SUPPORTED: 505, VARIANT_ALSO_NEGOTIATES: 506, INSUFFICIENT_STORAGE: 507, LOOP_DETECTED: 508, NOT_EXTENDED: 510, NETWORK_AUTHENTICATION_REQUIRED: 511 };
      var i4 = class extends Error {
        constructor(a10 = "INTERNAL_SERVER_ERROR", b10, c10 = {}, d10 = "number" == typeof a10 ? a10 : i3[a10]) {
          super(b10?.message, b10?.cause ? { cause: b10.cause } : void 0), this.status = a10, this.body = b10, this.headers = c10, this.statusCode = d10, this.name = "APIError", this.status = a10, this.headers = c10, this.statusCode = d10, this.body = b10 ? { code: b10?.message?.toUpperCase().replace(/ /g, "_").replace(/[^A-Z0-9_]/g, ""), ...b10 } : void 0;
        }
      }, i5 = class extends i4 {
        constructor(a10, b10) {
          super(400, { message: a10, code: "VALIDATION_ERROR" }), this.message = a10, this.issues = b10, this.issues = b10;
        }
      }, i6 = class extends Error {
        constructor(a10) {
          super(a10), this.name = "BetterCallError";
        }
      };
      let i7 = function(a10, b10) {
        class c10 extends a10 {
          #a;
          constructor(...a11) {
            if (function() {
              let a12 = Object.getOwnPropertyDescriptor(Error, "stackTraceLimit");
              return void 0 === a12 ? Object.isExtensible(Error) : Object.prototype.hasOwnProperty.call(a12, "writable") ? a12.writable : void 0 !== a12.set;
            }()) {
              let b12 = Error.stackTraceLimit;
              Error.stackTraceLimit = 0, super(...a11), Error.stackTraceLimit = b12;
            } else super(...a11);
            let b11 = Error().stack;
            b11 && (this.#a = function(a12) {
              let b12 = a12.split("\n    at ");
              return b12.length <= 1 ? a12 : (b12.splice(1, 1), b12.join("\n    at "));
            }(b11.replace(/^Error/, this.name)));
          }
          get errorStack() {
            return this.#a;
          }
        }
        return Object.defineProperty(c10.prototype, "constructor", { get: () => b10, enumerable: false, configurable: true }), c10;
      }(i4, Error);
      function i8(a10) {
        return a10 instanceof i7 || a10?.name === "APIError";
      }
      async function i9(a10) {
        try {
          return { data: await a10, error: null };
        } catch (a11) {
          return { data: null, error: a11 };
        }
      }
      function ja() {
        let a10 = "undefined" != typeof globalThis && globalThis.crypto;
        if (a10 && "object" == typeof a10.subtle && null != a10.subtle) return a10.subtle;
        throw Error("crypto.subtle must be defined");
      }
      let jb = { name: "HMAC", hash: "SHA-256" }, jc = async (a10) => {
        let b10 = "string" == typeof a10 ? new TextEncoder().encode(a10) : a10;
        return await ja().importKey("raw", b10, jb, false, ["sign", "verify"]);
      }, jd = async (a10, b10, c10) => {
        try {
          let d10 = atob(a10), e10 = new Uint8Array(d10.length);
          for (let a11 = 0, b11 = d10.length; a11 < b11; a11++) e10[a11] = d10.charCodeAt(a11);
          return await ja().verify(jb, c10, e10, new TextEncoder().encode(b10));
        } catch (a11) {
          return false;
        }
      }, je = async (a10, b10) => {
        let c10 = await jc(b10);
        return btoa(String.fromCharCode(...new Uint8Array(await ja().sign(jb.name, c10, new TextEncoder().encode(a10)))));
      }, jf = async (a10, b10) => {
        let c10 = await je(a10, b10);
        return encodeURIComponent(a10 = `${a10}.${c10}`);
      }, jg = (a10, b10) => {
        let c10 = a10;
        if (b10) if ("secure" === b10) c10 = "__Secure-" + a10;
        else {
          if ("host" !== b10) return;
          c10 = "__Host-" + a10;
        }
        return c10;
      }, jh = (a10, b10, c10 = {}) => {
        let d10;
        if (d10 = c10?.prefix === "secure" ? `__Secure-${a10}=${b10}` : c10?.prefix === "host" ? `__Host-${a10}=${b10}` : `${a10}=${b10}`, a10.startsWith("__Secure-") && !c10.secure && (c10.secure = true), a10.startsWith("__Host-") && (c10.secure || (c10.secure = true), "/" !== c10.path && (c10.path = "/"), c10.domain && (c10.domain = void 0)), c10 && "number" == typeof c10.maxAge && c10.maxAge >= 0) {
          if (c10.maxAge > 3456e4) throw Error("Cookies Max-Age SHOULD NOT be greater than 400 days (34560000 seconds) in duration.");
          d10 += `; Max-Age=${Math.floor(c10.maxAge)}`;
        }
        if (c10.domain && "host" !== c10.prefix && (d10 += `; Domain=${c10.domain}`), c10.path && (d10 += `; Path=${c10.path}`), c10.expires) {
          if (c10.expires.getTime() - Date.now() > 3456e7) throw Error("Cookies Expires SHOULD NOT be greater than 400 days (34560000 seconds) in the future.");
          d10 += `; Expires=${c10.expires.toUTCString()}`;
        }
        return c10.httpOnly && (d10 += "; HttpOnly"), c10.secure && (d10 += "; Secure"), c10.sameSite && (d10 += `; SameSite=${c10.sameSite.charAt(0).toUpperCase() + c10.sameSite.slice(1)}`), c10.partitioned && (c10.secure || (c10.secure = true), d10 += "; Partitioned"), d10;
      }, ji = async (a10, b10, c10, d10) => jh(a10, b10 = await jf(b10, c10), d10);
      async function jj(a10, b10 = {}) {
        let c10 = { body: b10.body, query: b10.query };
        if (a10.body) {
          let d10 = await a10.body["~standard"].validate(b10.body);
          if (d10.issues) return { data: null, error: jk(d10.issues, "body") };
          c10.body = d10.value;
        }
        if (a10.query) {
          let d10 = await a10.query["~standard"].validate(b10.query);
          if (d10.issues) return { data: null, error: jk(d10.issues, "query") };
          c10.query = d10.value;
        }
        return a10.requireHeaders && !b10.headers ? { data: null, error: { message: "Headers is required", issues: [] } } : a10.requireRequest && !b10.request ? { data: null, error: { message: "Request is required", issues: [] } } : { data: c10, error: null };
      }
      function jk(a10, b10) {
        return { message: a10.map((a11) => `[${a11.path?.length ? `${b10}.` + a11.path.map((a12) => "object" == typeof a12 ? a12.key : a12).join(".") : b10}] ${a11.message}`).join("; "), issues: a10 };
      }
      let jl = async (a10, { options: b10, path: c10 }) => {
        let d10, e10 = new Headers(), { data: f10, error: g10 } = await jj(b10, a10);
        if (g10) throw new i5(g10.message, g10.issues);
        let h10 = "headers" in a10 ? a10.headers instanceof Headers ? a10.headers : new Headers(a10.headers) : "request" in a10 && function(a11) {
          return a11 instanceof Request || "[object Request]" === Object.prototype.toString.call(a11);
        }(a10.request) ? a10.request.headers : null, i10 = h10?.get("cookie"), j2 = i10 ? function(a11) {
          if ("string" != typeof a11) throw TypeError("argument str must be a string");
          let b11 = /* @__PURE__ */ new Map(), c11 = 0;
          for (; c11 < a11.length; ) {
            let d11 = a11.indexOf("=", c11);
            if (-1 === d11) break;
            let e11 = a11.indexOf(";", c11);
            if (-1 === e11) e11 = a11.length;
            else if (e11 < d11) {
              c11 = a11.lastIndexOf(";", d11 - 1) + 1;
              continue;
            }
            let f11 = a11.slice(c11, d11).trim();
            if (!b11.has(f11)) {
              let c12 = a11.slice(d11 + 1, e11).trim();
              34 === c12.codePointAt(0) && (c12 = c12.slice(1, -1)), b11.set(f11, function(a12) {
                try {
                  return a12.includes("%") ? decodeURIComponent(a12) : a12;
                } catch {
                  return a12;
                }
              }(c12));
            }
            c11 = e11 + 1;
          }
          return b11;
        }(i10) : void 0, k2 = { ...a10, body: f10.body, query: f10.query, path: a10.path || c10 || "virtual:", context: "context" in a10 && a10.context ? a10.context : {}, returned: void 0, headers: a10?.headers, request: a10?.request, params: "params" in a10 ? a10.params : void 0, method: a10.method ?? (Array.isArray(b10.method) ? b10.method[0] : "*" === b10.method ? "GET" : b10.method), setHeader: (a11, b11) => {
          e10.set(a11, b11);
        }, getHeader: (a11) => h10 ? h10.get(a11) : null, getCookie: (a11, b11) => {
          let c11 = jg(a11, b11);
          return c11 && j2?.get(c11) || null;
        }, getSignedCookie: async (a11, b11, c11) => {
          let d11 = jg(a11, c11);
          if (!d11) return null;
          let e11 = j2?.get(d11);
          if (!e11) return null;
          let f11 = e11.lastIndexOf(".");
          if (f11 < 1) return null;
          let g11 = e11.substring(0, f11), h11 = e11.substring(f11 + 1);
          return 44 === h11.length && h11.endsWith("=") ? !!await jd(h11, g11, await jc(b11)) && g11 : null;
        }, setCookie: (a11, b11, c11) => {
          let d11 = ((a12, b12, c12) => jh(a12, b12 = encodeURIComponent(b12), c12))(a11, b11, c11);
          return e10.append("set-cookie", d11), d11;
        }, setSignedCookie: async (a11, b11, c11, d11) => {
          let f11 = await ji(a11, b11, c11, d11);
          return e10.append("set-cookie", f11), f11;
        }, redirect: (a11) => (e10.set("location", a11), new i7("FOUND", void 0, e10)), error: (a11, b11, c11) => new i7(a11, b11, c11), setStatus: (a11) => {
          d10 = a11;
        }, json: (b11, c11) => a10.asResponse ? { body: c11?.body || b11, routerResponse: c11, _flag: "json" } : b11, responseHeaders: e10, get responseStatus() {
          return d10;
        } };
        for (let a11 of b10.use || []) {
          let b11 = await a11({ ...k2, returnHeaders: true, asResponse: false });
          b11.response && Object.assign(k2.context, b11.response), b11.headers && b11.headers.forEach((a12, b12) => {
            k2.responseHeaders.set(b12, a12);
          });
        }
        return k2;
      };
      function jm(a10, b10, c10) {
        let d10 = "string" == typeof a10 ? a10 : void 0, e10 = "object" == typeof b10 ? b10 : a10, f10 = "function" == typeof b10 ? b10 : c10;
        if (("GET" === e10.method || "HEAD" === e10.method) && e10.body) throw new i6("Body is not allowed with GET or HEAD methods");
        if (d10 && /\/{2,}/.test(d10)) throw new i6("Path cannot contain consecutive slashes");
        let g10 = async (...a11) => {
          let b11 = a11[0] || {}, { data: c11, error: g11 } = await i9(jl(b11, { options: e10, path: d10 }));
          if (g11) {
            if (!(g11 instanceof i5)) throw g11;
            throw e10.onValidationError && await e10.onValidationError({ message: g11.message, issues: g11.issues }), new i7(400, { message: g11.message, code: "VALIDATION_ERROR" });
          }
          let h10 = await f10(c11).catch(async (a12) => {
            if (i8(a12)) {
              let c12 = e10.onAPIError;
              if (c12 && await c12(a12), b11.asResponse) return a12;
            }
            throw a12;
          }), i10 = c11.responseHeaders, j2 = c11.responseStatus;
          return b11.asResponse ? function a12(b12, c12) {
            if (b12 instanceof Response) return c12?.headers instanceof Headers && c12.headers.forEach((a13, c13) => {
              b12.headers.set(c13, a13);
            }), b12;
            if (b12 && "object" == typeof b12 && "_flag" in b12 && "json" === b12._flag) {
              let a13 = b12.body, d12 = b12.routerResponse;
              if (d12 instanceof Response) return d12;
              let e12 = new Headers();
              if (d12?.headers) {
                let a14 = new Headers(d12.headers);
                for (let [b13, c13] of a14.entries()) a14.set(b13, c13);
              }
              if (b12.headers) for (let [a14, c13] of new Headers(b12.headers).entries()) e12.set(a14, c13);
              if (c12?.headers) for (let [a14, b13] of new Headers(c12.headers).entries()) e12.set(a14, b13);
              return e12.set("Content-Type", "application/json"), new Response(JSON.stringify(a13), { ...d12, headers: e12, status: b12.status ?? c12?.status ?? d12?.status, statusText: c12?.statusText ?? d12?.statusText });
            }
            if (i8(b12)) return a12(b12.body, { status: c12?.status ?? b12.statusCode, statusText: b12.status.toString(), headers: c12?.headers || b12.headers });
            let d11 = b12, e11 = new Headers(c12?.headers);
            return b12 ? "string" == typeof b12 ? (d11 = b12, e11.set("Content-Type", "text/plain")) : b12 instanceof ArrayBuffer || ArrayBuffer.isView(b12) ? (d11 = b12, e11.set("Content-Type", "application/octet-stream")) : b12 instanceof Blob ? (d11 = b12, e11.set("Content-Type", b12.type || "application/octet-stream")) : b12 instanceof FormData ? d11 = b12 : b12 instanceof URLSearchParams ? (d11 = b12, e11.set("Content-Type", "application/x-www-form-urlencoded")) : b12 instanceof ReadableStream ? (d11 = b12, e11.set("Content-Type", "application/octet-stream")) : function(a13) {
              if (void 0 === a13) return false;
              let b13 = typeof a13;
              return "string" === b13 || "number" === b13 || "boolean" === b13 || null === b13 || "object" === b13 && (!!Array.isArray(a13) || !a13.buffer && (a13.constructor && "Object" === a13.constructor.name || "function" == typeof a13.toJSON));
            }(b12) && (d11 = function(a13, b13, c13) {
              let d12 = 0, e12 = /* @__PURE__ */ new WeakMap();
              return JSON.stringify(a13, (a14, b14) => {
                if ("bigint" == typeof b14) return b14.toString();
                if ("object" == typeof b14 && null !== b14) {
                  if (e12.has(b14)) return `[Circular ref-${e12.get(b14)}]`;
                  e12.set(b14, d12++);
                }
                return b14;
              }, void 0);
            }(b12), e11.set("Content-Type", "application/json")) : (null === b12 && (d11 = JSON.stringify(null)), e11.set("content-type", "application/json")), new Response(d11, { ...c12, headers: e11 });
          }(h10, { headers: i10, status: j2 }) : b11.returnHeaders ? b11.returnStatus ? { headers: i10, response: h10, status: j2 } : { headers: i10, response: h10 } : b11.returnStatus ? { response: h10, status: j2 } : h10;
        };
        return g10.options = e10, g10.path = d10, g10;
      }
      function jn(a10, b10) {
        let c10 = async (c11) => {
          let d10 = "function" == typeof a10 ? a10 : b10, e10 = await jl(c11, { options: "function" == typeof a10 ? {} : a10, path: "/" });
          if (!d10) throw Error("handler must be defined");
          let f10 = await d10(e10), g10 = e10.responseHeaders;
          return c11.returnHeaders ? { headers: g10, response: f10 } : f10;
        };
        return c10.options = "function" == typeof a10 ? {} : a10, c10;
      }
      jm.create = (a10) => (b10, c10, d10) => jm(b10, { ...c10, use: [...c10?.use || [], ...a10?.use || []] }, d10), jn.create = (a10) => function(b10, c10) {
        if ("function" == typeof b10) return jn({ use: a10?.use }, b10);
        if (!c10) throw Error("Middleware handler is required");
        return jn({ ...b10, method: "*", use: [...a10?.use || [], ...b10.use || []] }, c10);
      }, new Uint8Array([66, 101, 116, 116, 101, 114, 65, 117, 116, 104, 46, 106, 115, 32, 71, 101, 110, 101, 114, 97, 116, 101, 100, 32, 69, 110, 99, 114, 121, 112, 116, 105, 111, 110, 32, 75, 101, 121]);
      let jo = /* @__PURE__ */ Object.create(null), jp = (a10) => globalThis.process?.env || globalThis.Deno?.env.toObject() || globalThis.__env__ || (a10 ? jo : globalThis), jq = new Proxy(jo, { get: (a10, b10) => jp()[b10] ?? jo[b10], has: (a10, b10) => b10 in jp() || b10 in jo, set: (a10, b10, c10) => (jp(true)[b10] = c10, true), deleteProperty(a10, b10) {
        if (!b10) return false;
        let c10 = jp(true);
        return delete c10[b10], true;
      }, ownKeys: () => Object.keys(jp(true)) });
      function jr(a10, b10) {
        return "undefined" != typeof process && process.env ? process.env[a10] ?? b10 : "undefined" != typeof Deno ? Deno.env.get(a10) ?? b10 : "undefined" != typeof Bun ? Bun.env[a10] ?? b10 : b10;
      }
      "undefined" != typeof process && process.env, Object.freeze({ get BETTER_AUTH_SECRET() {
        return jr("BETTER_AUTH_SECRET");
      }, get AUTH_SECRET() {
        return jr("AUTH_SECRET");
      }, get BETTER_AUTH_TELEMETRY() {
        return jr("BETTER_AUTH_TELEMETRY");
      }, get BETTER_AUTH_TELEMETRY_ID() {
        return jr("BETTER_AUTH_TELEMETRY_ID");
      }, get NODE_ENV() {
        return jr("NODE_ENV", "development");
      }, get PACKAGE_VERSION() {
        return jr("PACKAGE_VERSION", "0.0.0");
      }, get BETTER_AUTH_TELEMETRY_ENDPOINT() {
        return jr("BETTER_AUTH_TELEMETRY_ENDPOINT", "");
      } });
      let js = { eterm: 4, cons25: 4, console: 4, cygwin: 4, dtterm: 4, gnome: 4, hurd: 4, jfbterm: 4, konsole: 4, kterm: 4, mlterm: 4, mosh: 24, putty: 4, st: 4, "rxvt-unicode-24bit": 24, terminator: 24, "xterm-kitty": 24 }, jt = new Map(Object.entries({ APPVEYOR: 8, BUILDKITE: 8, CIRCLECI: 24, DRONE: 8, GITEA_ACTIONS: 24, GITHUB_ACTIONS: 24, GITLAB_CI: 8, TRAVIS: 8 })), ju = [/ansi/, /color/, /linux/, /direct/, /^con[0-9]*x[0-9]/, /^rxvt/, /^screen/, /^xterm/, /^vt100/, /^vt220/], jv = { reset: "\x1B[0m", bright: "\x1B[1m", dim: "\x1B[2m", fg: { black: "\x1B[30m", red: "\x1B[31m", green: "\x1B[32m", yellow: "\x1B[33m", blue: "\x1B[34m", magenta: "\x1B[35m", cyan: "\x1B[36m", white: "\x1B[37m" } }, jw = ["debug", "info", "success", "warn", "error"], jx = { info: jv.fg.blue, success: jv.fg.green, warn: jv.fg.yellow, error: jv.fg.red, debug: jv.fg.magenta };
      function jy(a10) {
        switch (a10) {
          case "a-z":
            return "abcdefghijklmnopqrstuvwxyz";
          case "A-Z":
            return "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          case "0-9":
            return "0123456789";
          case "-_":
            return "-_";
          default:
            throw Error(`Unsupported alphabet: ${a10}`);
        }
      }
      ((a10) => {
        let b10 = a10?.disabled !== true, c10 = a10?.level ?? "warn", d10 = a10?.disableColors !== void 0 ? !a10.disableColors : 1 !== function() {
          if (void 0 !== jr("FORCE_COLOR")) switch (jr("FORCE_COLOR")) {
            case "":
            case "1":
            case "true":
              return 4;
            case "2":
              return 8;
            case "3":
              return 24;
            default:
              return 1;
          }
          if (void 0 !== jr("NODE_DISABLE_COLORS") && "" !== jr("NODE_DISABLE_COLORS") || void 0 !== jr("NO_COLOR") && "" !== jr("NO_COLOR") || "dumb" === jr("TERM")) return 1;
          if (jr("TMUX")) return 24;
          if ("TF_BUILD" in jq && "AGENT_NAME" in jq) return 4;
          if ("CI" in jq) {
            for (let { 0: a11, 1: b11 } of jt) if (a11 in jq) return b11;
            return "codeship" === jr("CI_NAME") ? 8 : 1;
          }
          if ("TEAMCITY_VERSION" in jq) return null !== /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.exec(jr("TEAMCITY_VERSION")) ? 4 : 1;
          switch (jr("TERM_PROGRAM")) {
            case "iTerm.app":
              if (!jr("TERM_PROGRAM_VERSION") || null !== /^[0-2]\./.exec(jr("TERM_PROGRAM_VERSION"))) return 8;
              return 24;
            case "HyperTerm":
            case "MacTerm":
              return 24;
            case "Apple_Terminal":
              return 8;
          }
          if ("truecolor" === jr("COLORTERM") || "24bit" === jr("COLORTERM")) return 24;
          if (jr("TERM")) {
            if (null !== /truecolor/.exec(jr("TERM"))) return 24;
            if (null !== /^xterm-256/.exec(jr("TERM"))) return 8;
            let a11 = jr("TERM").toLowerCase();
            if (js[a11]) return js[a11];
            if (ju.some((b11) => null !== b11.exec(a11))) return 4;
          }
          return jr("COLORTERM") ? 4 : 1;
        }();
        return { ...Object.fromEntries(jw.map((e10) => [e10, (...[f10, ...g10]) => ((e11, f11, g11 = []) => {
          if (!b10 || !(jw.indexOf(e11) >= jw.indexOf(c10))) return;
          let h10 = ((a11, b11, c11) => {
            let d11 = (/* @__PURE__ */ new Date()).toISOString();
            return c11 ? `${jv.dim}${d11}${jv.reset} ${jx[a11]}${a11.toUpperCase()}${jv.reset} ${jv.bright}[Better Auth]:${jv.reset} ${b11}` : `${d11} ${a11.toUpperCase()} [Better Auth]: ${b11}`;
          })(e11, f11, d10);
          if (!a10 || "function" != typeof a10.log) return void ("error" === e11 ? console.error(h10, ...g11) : "warn" === e11 ? console.warn(h10, ...g11) : console.log(h10, ...g11));
          a10.log("success" === e11 ? "info" : e11, f11, ...g11);
        })(e10, f10, g10)])), get level() {
          return c10;
        } };
      })(), !function() {
        let a10 = ["a-z", "0-9", "A-Z", "-_"].map(jy).join("");
        if (0 === a10.length) throw Error("No valid characters provided for random string generation.");
        a10.length;
      }("a-z", "0-9", "A-Z", "-_");
      function jz(a10) {
        let b10 = a10.split("."), c10 = parseInt(b10[b10.length - 1] || "0", 10);
        return isNaN(c10) ? 0 : c10;
      }
      function jA(a10, b10) {
        let c10 = {};
        for (let d10 in a10) c10[d10] = { name: d10, value: "", attributes: { ...b10, maxAge: 0 } };
        return c10;
      }
      let jB = (a10) => (b10, c10, d10) => {
        let e10 = function(a11, b11) {
          let c11 = {};
          for (let [d11, e11] of Object.entries(function(a12) {
            let b12 = a12.headers?.get("cookie");
            if (!b12) return {};
            let c12 = {};
            for (let a13 of b12.split("; ")) {
              let [b13, ...d12] = a13.split("=");
              b13 && d12.length > 0 && (c12[b13] = d12.join("="));
            }
            return c12;
          }(b11))) d11.startsWith(a11) && (c11[d11] = e11);
          return c11;
        }(b10, d10), f10 = d10.context.logger;
        return { getValue: () => function(a11) {
          return Object.keys(a11).sort((a12, b11) => jz(a12) - jz(b11)).map((b11) => a11[b11]).join("");
        }(e10), hasChunks: () => Object.keys(e10).length > 0, chunk(d11, g10) {
          let h10 = jA(e10, c10);
          for (let a11 in e10) delete e10[a11];
          for (let i10 of function(a11, b11, c11, d12) {
            let e11 = Math.ceil(b11.value.length / 3896);
            if (1 === e11) return c11[b11.name] = b11.value, [b11];
            let f11 = [];
            for (let a12 = 0; a12 < e11; a12++) {
              let d13 = `${b11.name}.${a12}`, e12 = 3896 * a12, g11 = b11.value.substring(e12, e12 + 3896);
              f11.push({ ...b11, name: d13, value: g11 }), c11[d13] = g11;
            }
            return d12.debug(`CHUNKING_${a11.toUpperCase()}_COOKIE`, { message: `${a11} cookie exceeds allowed 4096 bytes.`, emptyCookieSize: 200, valueSize: b11.value.length, chunkCount: e11, chunks: f11.map((a12) => a12.value.length + 200) }), f11;
          }(a10, { name: b10, value: d11, attributes: { ...c10, ...g10 } }, e10, f10)) h10[i10.name] = i10;
          return Object.values(h10);
        }, clean() {
          let a11 = jA(e10, c10);
          for (let a12 in e10) delete e10[a12];
          return Object.values(a11);
        }, setCookies(a11) {
          for (let b11 of a11) d10.setCookie(b11.name, b11.value, b11.attributes);
        } };
      };
      async function jC(a10) {
        return ((a11, b10) => {
          b10?.cookiePrefix && (b10.cookieName ? b10.cookiePrefix = `${b10.cookiePrefix}-` : b10.cookiePrefix = `${b10.cookiePrefix}.`);
          let c10 = ("headers" in a11 ? a11.headers : a11).get("cookie");
          if (!c10) return null;
          let { cookieName: d10 = "session_token", cookiePrefix: e10 = "better-auth." } = b10 || {}, f10 = `${e10}${d10}`, g10 = `__Secure-${f10}`, h10 = function(a12) {
            let b11 = a12.split("; "), c11 = /* @__PURE__ */ new Map();
            return b11.forEach((a13) => {
              let [b12, d11] = a13.split(/=(.*)/s);
              c11.set(b12, d11);
            }), c11;
          }(c10), i10 = h10.get(f10) || h10.get(g10);
          return i10 || null;
        })(a10) ? Y.next() : Y.redirect(new URL("/", a10.url));
      }
      jB("Session"), jB("Account"), ik(hQ({ disableCookieCache: i1().meta({ description: "Disable cookie cache and fetch session from database" }).optional(), disableRefresh: i1().meta({ description: "Disable session refresh. Useful for checking session status, without updating the session" }).optional() })), new TextEncoder().encode;
      let jD = { matcher: ["/log", "/templates", "/analytics"] };
      Object.values({ NOT_FOUND: 404, FORBIDDEN: 403, UNAUTHORIZED: 401 });
      let jE = { ...l }, jF = jE.middleware || jE.default, jG = "/src/middleware";
      if ("function" != typeof jF) throw Object.defineProperty(Error(`The Middleware "${jG}" must export a \`middleware\` or a \`default\` function`), "__NEXT_ERROR_CODE", { value: "E120", enumerable: false, configurable: true });
      function jH(a10) {
        return bm({ ...a10, page: jG, handler: async (...a11) => {
          try {
            return await jF(...a11);
          } catch (e10) {
            let b10 = a11[0], c10 = new URL(b10.url), d10 = c10.pathname + c10.search;
            throw await p(e10, { path: d10, method: b10.method, headers: Object.fromEntries(b10.headers.entries()) }, { routerKind: "Pages Router", routePath: "/middleware", routeType: "middleware", revalidateReason: void 0 }), e10;
          }
        } });
      }
    }, 165: (a, b, c) => {
      "use strict";
      var d = c(356).Buffer;
      Object.defineProperty(b, "__esModule", { value: true }), !function(a2, b2) {
        for (var c2 in b2) Object.defineProperty(a2, c2, { enumerable: true, get: b2[c2] });
      }(b, { handleFetch: function() {
        return h;
      }, interceptFetch: function() {
        return i;
      }, reader: function() {
        return f;
      } });
      let e = c(392), f = { url: (a2) => a2.url, header: (a2, b2) => a2.headers.get(b2) };
      async function g(a2, b2) {
        let { url: c2, method: e2, headers: f2, body: g2, cache: h2, credentials: i2, integrity: j, mode: k, redirect: l, referrer: m, referrerPolicy: n } = b2;
        return { testData: a2, api: "fetch", request: { url: c2, method: e2, headers: [...Array.from(f2), ["next-test-stack", function() {
          let a3 = (Error().stack ?? "").split("\n");
          for (let b3 = 1; b3 < a3.length; b3++) if (a3[b3].length > 0) {
            a3 = a3.slice(b3);
            break;
          }
          return (a3 = (a3 = (a3 = a3.filter((a4) => !a4.includes("/next/dist/"))).slice(0, 5)).map((a4) => a4.replace("webpack-internal:///(rsc)/", "").trim())).join("    ");
        }()]], body: g2 ? d.from(await b2.arrayBuffer()).toString("base64") : null, cache: h2, credentials: i2, integrity: j, mode: k, redirect: l, referrer: m, referrerPolicy: n } };
      }
      async function h(a2, b2) {
        let c2 = (0, e.getTestReqInfo)(b2, f);
        if (!c2) return a2(b2);
        let { testData: h2, proxyPort: i2 } = c2, j = await g(h2, b2), k = await a2(`http://localhost:${i2}`, { method: "POST", body: JSON.stringify(j), next: { internal: true } });
        if (!k.ok) throw Object.defineProperty(Error(`Proxy request failed: ${k.status}`), "__NEXT_ERROR_CODE", { value: "E146", enumerable: false, configurable: true });
        let l = await k.json(), { api: m } = l;
        switch (m) {
          case "continue":
            return a2(b2);
          case "abort":
          case "unhandled":
            throw Object.defineProperty(Error(`Proxy request aborted [${b2.method} ${b2.url}]`), "__NEXT_ERROR_CODE", { value: "E145", enumerable: false, configurable: true });
          case "fetch":
            let { status: n, headers: o, body: p } = l.response;
            return new Response(p ? d.from(p, "base64") : null, { status: n, headers: new Headers(o) });
          default:
            return m;
        }
      }
      function i(a2) {
        return c.g.fetch = function(b2, c2) {
          var d2;
          return (null == c2 || null == (d2 = c2.next) ? void 0 : d2.internal) ? a2(b2, c2) : h(a2, new Request(b2, c2));
        }, () => {
          c.g.fetch = a2;
        };
      }
    }, 213: (a) => {
      (() => {
        "use strict";
        var b = { 993: (a2) => {
          var b2 = Object.prototype.hasOwnProperty, c2 = "~";
          function d2() {
          }
          function e2(a3, b3, c3) {
            this.fn = a3, this.context = b3, this.once = c3 || false;
          }
          function f(a3, b3, d3, f2, g2) {
            if ("function" != typeof d3) throw TypeError("The listener must be a function");
            var h2 = new e2(d3, f2 || a3, g2), i = c2 ? c2 + b3 : b3;
            return a3._events[i] ? a3._events[i].fn ? a3._events[i] = [a3._events[i], h2] : a3._events[i].push(h2) : (a3._events[i] = h2, a3._eventsCount++), a3;
          }
          function g(a3, b3) {
            0 == --a3._eventsCount ? a3._events = new d2() : delete a3._events[b3];
          }
          function h() {
            this._events = new d2(), this._eventsCount = 0;
          }
          Object.create && (d2.prototype = /* @__PURE__ */ Object.create(null), new d2().__proto__ || (c2 = false)), h.prototype.eventNames = function() {
            var a3, d3, e3 = [];
            if (0 === this._eventsCount) return e3;
            for (d3 in a3 = this._events) b2.call(a3, d3) && e3.push(c2 ? d3.slice(1) : d3);
            return Object.getOwnPropertySymbols ? e3.concat(Object.getOwnPropertySymbols(a3)) : e3;
          }, h.prototype.listeners = function(a3) {
            var b3 = c2 ? c2 + a3 : a3, d3 = this._events[b3];
            if (!d3) return [];
            if (d3.fn) return [d3.fn];
            for (var e3 = 0, f2 = d3.length, g2 = Array(f2); e3 < f2; e3++) g2[e3] = d3[e3].fn;
            return g2;
          }, h.prototype.listenerCount = function(a3) {
            var b3 = c2 ? c2 + a3 : a3, d3 = this._events[b3];
            return d3 ? d3.fn ? 1 : d3.length : 0;
          }, h.prototype.emit = function(a3, b3, d3, e3, f2, g2) {
            var h2 = c2 ? c2 + a3 : a3;
            if (!this._events[h2]) return false;
            var i, j, k = this._events[h2], l = arguments.length;
            if (k.fn) {
              switch (k.once && this.removeListener(a3, k.fn, void 0, true), l) {
                case 1:
                  return k.fn.call(k.context), true;
                case 2:
                  return k.fn.call(k.context, b3), true;
                case 3:
                  return k.fn.call(k.context, b3, d3), true;
                case 4:
                  return k.fn.call(k.context, b3, d3, e3), true;
                case 5:
                  return k.fn.call(k.context, b3, d3, e3, f2), true;
                case 6:
                  return k.fn.call(k.context, b3, d3, e3, f2, g2), true;
              }
              for (j = 1, i = Array(l - 1); j < l; j++) i[j - 1] = arguments[j];
              k.fn.apply(k.context, i);
            } else {
              var m, n = k.length;
              for (j = 0; j < n; j++) switch (k[j].once && this.removeListener(a3, k[j].fn, void 0, true), l) {
                case 1:
                  k[j].fn.call(k[j].context);
                  break;
                case 2:
                  k[j].fn.call(k[j].context, b3);
                  break;
                case 3:
                  k[j].fn.call(k[j].context, b3, d3);
                  break;
                case 4:
                  k[j].fn.call(k[j].context, b3, d3, e3);
                  break;
                default:
                  if (!i) for (m = 1, i = Array(l - 1); m < l; m++) i[m - 1] = arguments[m];
                  k[j].fn.apply(k[j].context, i);
              }
            }
            return true;
          }, h.prototype.on = function(a3, b3, c3) {
            return f(this, a3, b3, c3, false);
          }, h.prototype.once = function(a3, b3, c3) {
            return f(this, a3, b3, c3, true);
          }, h.prototype.removeListener = function(a3, b3, d3, e3) {
            var f2 = c2 ? c2 + a3 : a3;
            if (!this._events[f2]) return this;
            if (!b3) return g(this, f2), this;
            var h2 = this._events[f2];
            if (h2.fn) h2.fn !== b3 || e3 && !h2.once || d3 && h2.context !== d3 || g(this, f2);
            else {
              for (var i = 0, j = [], k = h2.length; i < k; i++) (h2[i].fn !== b3 || e3 && !h2[i].once || d3 && h2[i].context !== d3) && j.push(h2[i]);
              j.length ? this._events[f2] = 1 === j.length ? j[0] : j : g(this, f2);
            }
            return this;
          }, h.prototype.removeAllListeners = function(a3) {
            var b3;
            return a3 ? (b3 = c2 ? c2 + a3 : a3, this._events[b3] && g(this, b3)) : (this._events = new d2(), this._eventsCount = 0), this;
          }, h.prototype.off = h.prototype.removeListener, h.prototype.addListener = h.prototype.on, h.prefixed = c2, h.EventEmitter = h, a2.exports = h;
        }, 213: (a2) => {
          a2.exports = (a3, b2) => (b2 = b2 || (() => {
          }), a3.then((a4) => new Promise((a5) => {
            a5(b2());
          }).then(() => a4), (a4) => new Promise((a5) => {
            a5(b2());
          }).then(() => {
            throw a4;
          })));
        }, 574: (a2, b2) => {
          Object.defineProperty(b2, "__esModule", { value: true }), b2.default = function(a3, b3, c2) {
            let d2 = 0, e2 = a3.length;
            for (; e2 > 0; ) {
              let f = e2 / 2 | 0, g = d2 + f;
              0 >= c2(a3[g], b3) ? (d2 = ++g, e2 -= f + 1) : e2 = f;
            }
            return d2;
          };
        }, 821: (a2, b2, c2) => {
          Object.defineProperty(b2, "__esModule", { value: true });
          let d2 = c2(574);
          class e2 {
            constructor() {
              this._queue = [];
            }
            enqueue(a3, b3) {
              let c3 = { priority: (b3 = Object.assign({ priority: 0 }, b3)).priority, run: a3 };
              if (this.size && this._queue[this.size - 1].priority >= b3.priority) return void this._queue.push(c3);
              let e3 = d2.default(this._queue, c3, (a4, b4) => b4.priority - a4.priority);
              this._queue.splice(e3, 0, c3);
            }
            dequeue() {
              let a3 = this._queue.shift();
              return null == a3 ? void 0 : a3.run;
            }
            filter(a3) {
              return this._queue.filter((b3) => b3.priority === a3.priority).map((a4) => a4.run);
            }
            get size() {
              return this._queue.length;
            }
          }
          b2.default = e2;
        }, 816: (a2, b2, c2) => {
          let d2 = c2(213);
          class e2 extends Error {
            constructor(a3) {
              super(a3), this.name = "TimeoutError";
            }
          }
          let f = (a3, b3, c3) => new Promise((f2, g) => {
            if ("number" != typeof b3 || b3 < 0) throw TypeError("Expected `milliseconds` to be a positive number");
            if (b3 === 1 / 0) return void f2(a3);
            let h = setTimeout(() => {
              if ("function" == typeof c3) {
                try {
                  f2(c3());
                } catch (a4) {
                  g(a4);
                }
                return;
              }
              let d3 = "string" == typeof c3 ? c3 : `Promise timed out after ${b3} milliseconds`, h2 = c3 instanceof Error ? c3 : new e2(d3);
              "function" == typeof a3.cancel && a3.cancel(), g(h2);
            }, b3);
            d2(a3.then(f2, g), () => {
              clearTimeout(h);
            });
          });
          a2.exports = f, a2.exports.default = f, a2.exports.TimeoutError = e2;
        } }, c = {};
        function d(a2) {
          var e2 = c[a2];
          if (void 0 !== e2) return e2.exports;
          var f = c[a2] = { exports: {} }, g = true;
          try {
            b[a2](f, f.exports, d), g = false;
          } finally {
            g && delete c[a2];
          }
          return f.exports;
        }
        d.ab = "//";
        var e = {};
        (() => {
          Object.defineProperty(e, "__esModule", { value: true });
          let a2 = d(993), b2 = d(816), c2 = d(821), f = () => {
          }, g = new b2.TimeoutError();
          class h extends a2 {
            constructor(a3) {
              var b3, d2, e2, g2;
              if (super(), this._intervalCount = 0, this._intervalEnd = 0, this._pendingCount = 0, this._resolveEmpty = f, this._resolveIdle = f, !("number" == typeof (a3 = Object.assign({ carryoverConcurrencyCount: false, intervalCap: 1 / 0, interval: 0, concurrency: 1 / 0, autoStart: true, queueClass: c2.default }, a3)).intervalCap && a3.intervalCap >= 1)) throw TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${null != (d2 = null == (b3 = a3.intervalCap) ? void 0 : b3.toString()) ? d2 : ""}\` (${typeof a3.intervalCap})`);
              if (void 0 === a3.interval || !(Number.isFinite(a3.interval) && a3.interval >= 0)) throw TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${null != (g2 = null == (e2 = a3.interval) ? void 0 : e2.toString()) ? g2 : ""}\` (${typeof a3.interval})`);
              this._carryoverConcurrencyCount = a3.carryoverConcurrencyCount, this._isIntervalIgnored = a3.intervalCap === 1 / 0 || 0 === a3.interval, this._intervalCap = a3.intervalCap, this._interval = a3.interval, this._queue = new a3.queueClass(), this._queueClass = a3.queueClass, this.concurrency = a3.concurrency, this._timeout = a3.timeout, this._throwOnTimeout = true === a3.throwOnTimeout, this._isPaused = false === a3.autoStart;
            }
            get _doesIntervalAllowAnother() {
              return this._isIntervalIgnored || this._intervalCount < this._intervalCap;
            }
            get _doesConcurrentAllowAnother() {
              return this._pendingCount < this._concurrency;
            }
            _next() {
              this._pendingCount--, this._tryToStartAnother(), this.emit("next");
            }
            _resolvePromises() {
              this._resolveEmpty(), this._resolveEmpty = f, 0 === this._pendingCount && (this._resolveIdle(), this._resolveIdle = f, this.emit("idle"));
            }
            _onResumeInterval() {
              this._onInterval(), this._initializeIntervalIfNeeded(), this._timeoutId = void 0;
            }
            _isIntervalPaused() {
              let a3 = Date.now();
              if (void 0 === this._intervalId) {
                let b3 = this._intervalEnd - a3;
                if (!(b3 < 0)) return void 0 === this._timeoutId && (this._timeoutId = setTimeout(() => {
                  this._onResumeInterval();
                }, b3)), true;
                this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0;
              }
              return false;
            }
            _tryToStartAnother() {
              if (0 === this._queue.size) return this._intervalId && clearInterval(this._intervalId), this._intervalId = void 0, this._resolvePromises(), false;
              if (!this._isPaused) {
                let a3 = !this._isIntervalPaused();
                if (this._doesIntervalAllowAnother && this._doesConcurrentAllowAnother) {
                  let b3 = this._queue.dequeue();
                  return !!b3 && (this.emit("active"), b3(), a3 && this._initializeIntervalIfNeeded(), true);
                }
              }
              return false;
            }
            _initializeIntervalIfNeeded() {
              this._isIntervalIgnored || void 0 !== this._intervalId || (this._intervalId = setInterval(() => {
                this._onInterval();
              }, this._interval), this._intervalEnd = Date.now() + this._interval);
            }
            _onInterval() {
              0 === this._intervalCount && 0 === this._pendingCount && this._intervalId && (clearInterval(this._intervalId), this._intervalId = void 0), this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0, this._processQueue();
            }
            _processQueue() {
              for (; this._tryToStartAnother(); ) ;
            }
            get concurrency() {
              return this._concurrency;
            }
            set concurrency(a3) {
              if (!("number" == typeof a3 && a3 >= 1)) throw TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${a3}\` (${typeof a3})`);
              this._concurrency = a3, this._processQueue();
            }
            async add(a3, c3 = {}) {
              return new Promise((d2, e2) => {
                let f2 = async () => {
                  this._pendingCount++, this._intervalCount++;
                  try {
                    let f3 = void 0 === this._timeout && void 0 === c3.timeout ? a3() : b2.default(Promise.resolve(a3()), void 0 === c3.timeout ? this._timeout : c3.timeout, () => {
                      (void 0 === c3.throwOnTimeout ? this._throwOnTimeout : c3.throwOnTimeout) && e2(g);
                    });
                    d2(await f3);
                  } catch (a4) {
                    e2(a4);
                  }
                  this._next();
                };
                this._queue.enqueue(f2, c3), this._tryToStartAnother(), this.emit("add");
              });
            }
            async addAll(a3, b3) {
              return Promise.all(a3.map(async (a4) => this.add(a4, b3)));
            }
            start() {
              return this._isPaused && (this._isPaused = false, this._processQueue()), this;
            }
            pause() {
              this._isPaused = true;
            }
            clear() {
              this._queue = new this._queueClass();
            }
            async onEmpty() {
              if (0 !== this._queue.size) return new Promise((a3) => {
                let b3 = this._resolveEmpty;
                this._resolveEmpty = () => {
                  b3(), a3();
                };
              });
            }
            async onIdle() {
              if (0 !== this._pendingCount || 0 !== this._queue.size) return new Promise((a3) => {
                let b3 = this._resolveIdle;
                this._resolveIdle = () => {
                  b3(), a3();
                };
              });
            }
            get size() {
              return this._queue.size;
            }
            sizeBy(a3) {
              return this._queue.filter(a3).length;
            }
            get pending() {
              return this._pendingCount;
            }
            get isPaused() {
              return this._isPaused;
            }
            get timeout() {
              return this._timeout;
            }
            set timeout(a3) {
              this._timeout = a3;
            }
          }
          e.default = h;
        })(), a.exports = e;
      })();
    }, 356: (a) => {
      "use strict";
      a.exports = (init_node_buffer(), __toCommonJS(node_buffer_exports));
    }, 392: (a, b, c) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true }), !function(a2, b2) {
        for (var c2 in b2) Object.defineProperty(a2, c2, { enumerable: true, get: b2[c2] });
      }(b, { getTestReqInfo: function() {
        return g;
      }, withRequest: function() {
        return f;
      } });
      let d = new (c(521)).AsyncLocalStorage();
      function e(a2, b2) {
        let c2 = b2.header(a2, "next-test-proxy-port");
        if (!c2) return;
        let d2 = b2.url(a2);
        return { url: d2, proxyPort: Number(c2), testData: b2.header(a2, "next-test-data") || "" };
      }
      function f(a2, b2, c2) {
        let f2 = e(a2, b2);
        return f2 ? d.run(f2, c2) : c2();
      }
      function g(a2, b2) {
        let c2 = d.getStore();
        return c2 || (a2 && b2 ? e(a2, b2) : void 0);
      }
    }, 440: (a, b) => {
      "use strict";
      Symbol.for("react.transitional.element"), Symbol.for("react.portal"), Symbol.for("react.fragment"), Symbol.for("react.strict_mode"), Symbol.for("react.profiler"), Symbol.for("react.forward_ref"), Symbol.for("react.suspense"), Symbol.for("react.memo"), Symbol.for("react.lazy"), Symbol.iterator;
      Object.prototype.hasOwnProperty, Object.assign;
    }, 443: (a) => {
      "use strict";
      var b = Object.defineProperty, c = Object.getOwnPropertyDescriptor, d = Object.getOwnPropertyNames, e = Object.prototype.hasOwnProperty, f = {};
      function g(a2) {
        var b2;
        let c2 = ["path" in a2 && a2.path && `Path=${a2.path}`, "expires" in a2 && (a2.expires || 0 === a2.expires) && `Expires=${("number" == typeof a2.expires ? new Date(a2.expires) : a2.expires).toUTCString()}`, "maxAge" in a2 && "number" == typeof a2.maxAge && `Max-Age=${a2.maxAge}`, "domain" in a2 && a2.domain && `Domain=${a2.domain}`, "secure" in a2 && a2.secure && "Secure", "httpOnly" in a2 && a2.httpOnly && "HttpOnly", "sameSite" in a2 && a2.sameSite && `SameSite=${a2.sameSite}`, "partitioned" in a2 && a2.partitioned && "Partitioned", "priority" in a2 && a2.priority && `Priority=${a2.priority}`].filter(Boolean), d2 = `${a2.name}=${encodeURIComponent(null != (b2 = a2.value) ? b2 : "")}`;
        return 0 === c2.length ? d2 : `${d2}; ${c2.join("; ")}`;
      }
      function h(a2) {
        let b2 = /* @__PURE__ */ new Map();
        for (let c2 of a2.split(/; */)) {
          if (!c2) continue;
          let a3 = c2.indexOf("=");
          if (-1 === a3) {
            b2.set(c2, "true");
            continue;
          }
          let [d2, e2] = [c2.slice(0, a3), c2.slice(a3 + 1)];
          try {
            b2.set(d2, decodeURIComponent(null != e2 ? e2 : "true"));
          } catch {
          }
        }
        return b2;
      }
      function i(a2) {
        if (!a2) return;
        let [[b2, c2], ...d2] = h(a2), { domain: e2, expires: f2, httponly: g2, maxage: i2, path: l2, samesite: m2, secure: n, partitioned: o, priority: p } = Object.fromEntries(d2.map(([a3, b3]) => [a3.toLowerCase().replace(/-/g, ""), b3]));
        {
          var q, r, s = { name: b2, value: decodeURIComponent(c2), domain: e2, ...f2 && { expires: new Date(f2) }, ...g2 && { httpOnly: true }, ..."string" == typeof i2 && { maxAge: Number(i2) }, path: l2, ...m2 && { sameSite: j.includes(q = (q = m2).toLowerCase()) ? q : void 0 }, ...n && { secure: true }, ...p && { priority: k.includes(r = (r = p).toLowerCase()) ? r : void 0 }, ...o && { partitioned: true } };
          let a3 = {};
          for (let b3 in s) s[b3] && (a3[b3] = s[b3]);
          return a3;
        }
      }
      ((a2, c2) => {
        for (var d2 in c2) b(a2, d2, { get: c2[d2], enumerable: true });
      })(f, { RequestCookies: () => l, ResponseCookies: () => m, parseCookie: () => h, parseSetCookie: () => i, stringifyCookie: () => g }), a.exports = ((a2, f2, g2, h2) => {
        if (f2 && "object" == typeof f2 || "function" == typeof f2) for (let i2 of d(f2)) e.call(a2, i2) || i2 === g2 || b(a2, i2, { get: () => f2[i2], enumerable: !(h2 = c(f2, i2)) || h2.enumerable });
        return a2;
      })(b({}, "__esModule", { value: true }), f);
      var j = ["strict", "lax", "none"], k = ["low", "medium", "high"], l = class {
        constructor(a2) {
          this._parsed = /* @__PURE__ */ new Map(), this._headers = a2;
          let b2 = a2.get("cookie");
          if (b2) for (let [a3, c2] of h(b2)) this._parsed.set(a3, { name: a3, value: c2 });
        }
        [Symbol.iterator]() {
          return this._parsed[Symbol.iterator]();
        }
        get size() {
          return this._parsed.size;
        }
        get(...a2) {
          let b2 = "string" == typeof a2[0] ? a2[0] : a2[0].name;
          return this._parsed.get(b2);
        }
        getAll(...a2) {
          var b2;
          let c2 = Array.from(this._parsed);
          if (!a2.length) return c2.map(([a3, b3]) => b3);
          let d2 = "string" == typeof a2[0] ? a2[0] : null == (b2 = a2[0]) ? void 0 : b2.name;
          return c2.filter(([a3]) => a3 === d2).map(([a3, b3]) => b3);
        }
        has(a2) {
          return this._parsed.has(a2);
        }
        set(...a2) {
          let [b2, c2] = 1 === a2.length ? [a2[0].name, a2[0].value] : a2, d2 = this._parsed;
          return d2.set(b2, { name: b2, value: c2 }), this._headers.set("cookie", Array.from(d2).map(([a3, b3]) => g(b3)).join("; ")), this;
        }
        delete(a2) {
          let b2 = this._parsed, c2 = Array.isArray(a2) ? a2.map((a3) => b2.delete(a3)) : b2.delete(a2);
          return this._headers.set("cookie", Array.from(b2).map(([a3, b3]) => g(b3)).join("; ")), c2;
        }
        clear() {
          return this.delete(Array.from(this._parsed.keys())), this;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map((a2) => `${a2.name}=${encodeURIComponent(a2.value)}`).join("; ");
        }
      }, m = class {
        constructor(a2) {
          var b2, c2, d2;
          this._parsed = /* @__PURE__ */ new Map(), this._headers = a2;
          let e2 = null != (d2 = null != (c2 = null == (b2 = a2.getSetCookie) ? void 0 : b2.call(a2)) ? c2 : a2.get("set-cookie")) ? d2 : [];
          for (let a3 of Array.isArray(e2) ? e2 : function(a4) {
            if (!a4) return [];
            var b3, c3, d3, e3, f2, g2 = [], h2 = 0;
            function i2() {
              for (; h2 < a4.length && /\s/.test(a4.charAt(h2)); ) h2 += 1;
              return h2 < a4.length;
            }
            for (; h2 < a4.length; ) {
              for (b3 = h2, f2 = false; i2(); ) if ("," === (c3 = a4.charAt(h2))) {
                for (d3 = h2, h2 += 1, i2(), e3 = h2; h2 < a4.length && "=" !== (c3 = a4.charAt(h2)) && ";" !== c3 && "," !== c3; ) h2 += 1;
                h2 < a4.length && "=" === a4.charAt(h2) ? (f2 = true, h2 = e3, g2.push(a4.substring(b3, d3)), b3 = h2) : h2 = d3 + 1;
              } else h2 += 1;
              (!f2 || h2 >= a4.length) && g2.push(a4.substring(b3, a4.length));
            }
            return g2;
          }(e2)) {
            let b3 = i(a3);
            b3 && this._parsed.set(b3.name, b3);
          }
        }
        get(...a2) {
          let b2 = "string" == typeof a2[0] ? a2[0] : a2[0].name;
          return this._parsed.get(b2);
        }
        getAll(...a2) {
          var b2;
          let c2 = Array.from(this._parsed.values());
          if (!a2.length) return c2;
          let d2 = "string" == typeof a2[0] ? a2[0] : null == (b2 = a2[0]) ? void 0 : b2.name;
          return c2.filter((a3) => a3.name === d2);
        }
        has(a2) {
          return this._parsed.has(a2);
        }
        set(...a2) {
          let [b2, c2, d2] = 1 === a2.length ? [a2[0].name, a2[0].value, a2[0]] : a2, e2 = this._parsed;
          return e2.set(b2, function(a3 = { name: "", value: "" }) {
            return "number" == typeof a3.expires && (a3.expires = new Date(a3.expires)), a3.maxAge && (a3.expires = new Date(Date.now() + 1e3 * a3.maxAge)), (null === a3.path || void 0 === a3.path) && (a3.path = "/"), a3;
          }({ name: b2, value: c2, ...d2 })), function(a3, b3) {
            for (let [, c3] of (b3.delete("set-cookie"), a3)) {
              let a4 = g(c3);
              b3.append("set-cookie", a4);
            }
          }(e2, this._headers), this;
        }
        delete(...a2) {
          let [b2, c2] = "string" == typeof a2[0] ? [a2[0]] : [a2[0].name, a2[0]];
          return this.set({ ...c2, name: b2, value: "", expires: /* @__PURE__ */ new Date(0) });
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map(g).join("; ");
        }
      };
    }, 449: (a, b, c) => {
      var d;
      (() => {
        var e = { 226: function(e2, f2) {
          !function(g2, h) {
            "use strict";
            var i = "function", j = "undefined", k = "object", l = "string", m = "major", n = "model", o = "name", p = "type", q = "vendor", r = "version", s = "architecture", t = "console", u = "mobile", v = "tablet", w = "smarttv", x = "wearable", y = "embedded", z = "Amazon", A = "Apple", B = "ASUS", C = "BlackBerry", D = "Browser", E = "Chrome", F = "Firefox", G = "Google", H = "Huawei", I = "Microsoft", J = "Motorola", K = "Opera", L = "Samsung", M = "Sharp", N = "Sony", O = "Xiaomi", P = "Zebra", Q = "Facebook", R = "Chromium OS", S = "Mac OS", T = function(a2, b2) {
              var c2 = {};
              for (var d2 in a2) b2[d2] && b2[d2].length % 2 == 0 ? c2[d2] = b2[d2].concat(a2[d2]) : c2[d2] = a2[d2];
              return c2;
            }, U = function(a2) {
              for (var b2 = {}, c2 = 0; c2 < a2.length; c2++) b2[a2[c2].toUpperCase()] = a2[c2];
              return b2;
            }, V = function(a2, b2) {
              return typeof a2 === l && -1 !== W(b2).indexOf(W(a2));
            }, W = function(a2) {
              return a2.toLowerCase();
            }, X = function(a2, b2) {
              if (typeof a2 === l) return a2 = a2.replace(/^\s\s*/, ""), typeof b2 === j ? a2 : a2.substring(0, 350);
            }, Y = function(a2, b2) {
              for (var c2, d2, e3, f3, g3, j2, l2 = 0; l2 < b2.length && !g3; ) {
                var m2 = b2[l2], n2 = b2[l2 + 1];
                for (c2 = d2 = 0; c2 < m2.length && !g3 && m2[c2]; ) if (g3 = m2[c2++].exec(a2)) for (e3 = 0; e3 < n2.length; e3++) j2 = g3[++d2], typeof (f3 = n2[e3]) === k && f3.length > 0 ? 2 === f3.length ? typeof f3[1] == i ? this[f3[0]] = f3[1].call(this, j2) : this[f3[0]] = f3[1] : 3 === f3.length ? typeof f3[1] !== i || f3[1].exec && f3[1].test ? this[f3[0]] = j2 ? j2.replace(f3[1], f3[2]) : void 0 : this[f3[0]] = j2 ? f3[1].call(this, j2, f3[2]) : void 0 : 4 === f3.length && (this[f3[0]] = j2 ? f3[3].call(this, j2.replace(f3[1], f3[2])) : h) : this[f3] = j2 || h;
                l2 += 2;
              }
            }, Z = function(a2, b2) {
              for (var c2 in b2) if (typeof b2[c2] === k && b2[c2].length > 0) {
                for (var d2 = 0; d2 < b2[c2].length; d2++) if (V(b2[c2][d2], a2)) return "?" === c2 ? h : c2;
              } else if (V(b2[c2], a2)) return "?" === c2 ? h : c2;
              return a2;
            }, $ = { ME: "4.90", "NT 3.11": "NT3.51", "NT 4.0": "NT4.0", 2e3: "NT 5.0", XP: ["NT 5.1", "NT 5.2"], Vista: "NT 6.0", 7: "NT 6.1", 8: "NT 6.2", 8.1: "NT 6.3", 10: ["NT 6.4", "NT 10.0"], RT: "ARM" }, _ = { browser: [[/\b(?:crmo|crios)\/([\w\.]+)/i], [r, [o, "Chrome"]], [/edg(?:e|ios|a)?\/([\w\.]+)/i], [r, [o, "Edge"]], [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i], [o, r], [/opios[\/ ]+([\w\.]+)/i], [r, [o, K + " Mini"]], [/\bopr\/([\w\.]+)/i], [r, [o, K]], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i, /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i, /(ba?idubrowser)[\/ ]?([\w\.]+)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i, /(heytap|ovi)browser\/([\d\.]+)/i, /(weibo)__([\d\.]+)/i], [o, r], [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i], [r, [o, "UC" + D]], [/microm.+\bqbcore\/([\w\.]+)/i, /\bqbcore\/([\w\.]+).+microm/i], [r, [o, "WeChat(Win) Desktop"]], [/micromessenger\/([\w\.]+)/i], [r, [o, "WeChat"]], [/konqueror\/([\w\.]+)/i], [r, [o, "Konqueror"]], [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i], [r, [o, "IE"]], [/ya(?:search)?browser\/([\w\.]+)/i], [r, [o, "Yandex"]], [/(avast|avg)\/([\w\.]+)/i], [[o, /(.+)/, "$1 Secure " + D], r], [/\bfocus\/([\w\.]+)/i], [r, [o, F + " Focus"]], [/\bopt\/([\w\.]+)/i], [r, [o, K + " Touch"]], [/coc_coc\w+\/([\w\.]+)/i], [r, [o, "Coc Coc"]], [/dolfin\/([\w\.]+)/i], [r, [o, "Dolphin"]], [/coast\/([\w\.]+)/i], [r, [o, K + " Coast"]], [/miuibrowser\/([\w\.]+)/i], [r, [o, "MIUI " + D]], [/fxios\/([-\w\.]+)/i], [r, [o, F]], [/\bqihu|(qi?ho?o?|360)browser/i], [[o, "360 " + D]], [/(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i], [[o, /(.+)/, "$1 " + D], r], [/(comodo_dragon)\/([\w\.]+)/i], [[o, /_/g, " "], r], [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i], [o, r], [/(metasr)[\/ ]?([\w\.]+)/i, /(lbbrowser)/i, /\[(linkedin)app\]/i], [o], [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i], [[o, Q], r], [/(kakao(?:talk|story))[\/ ]([\w\.]+)/i, /(naver)\(.*?(\d+\.[\w\.]+).*\)/i, /safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(chromium|instagram)[\/ ]([-\w\.]+)/i], [o, r], [/\bgsa\/([\w\.]+) .*safari\//i], [r, [o, "GSA"]], [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i], [r, [o, "TikTok"]], [/headlesschrome(?:\/([\w\.]+)| )/i], [r, [o, E + " Headless"]], [/ wv\).+(chrome)\/([\w\.]+)/i], [[o, E + " WebView"], r], [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i], [r, [o, "Android " + D]], [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i], [o, r], [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i], [r, [o, "Mobile Safari"]], [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i], [r, o], [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i], [o, [r, Z, { "1.0": "/8", 1.2: "/1", 1.3: "/3", "2.0": "/412", "2.0.2": "/416", "2.0.3": "/417", "2.0.4": "/419", "?": "/" }]], [/(webkit|khtml)\/([\w\.]+)/i], [o, r], [/(navigator|netscape\d?)\/([-\w\.]+)/i], [[o, "Netscape"], r], [/mobile vr; rv:([\w\.]+)\).+firefox/i], [r, [o, F + " Reality"]], [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /(links) \(([\w\.]+)/i, /panasonic;(viera)/i], [o, r], [/(cobalt)\/([\w\.]+)/i], [o, [r, /master.|lts./, ""]]], cpu: [[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i], [[s, "amd64"]], [/(ia32(?=;))/i], [[s, W]], [/((?:i[346]|x)86)[;\)]/i], [[s, "ia32"]], [/\b(aarch64|arm(v?8e?l?|_?64))\b/i], [[s, "arm64"]], [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i], [[s, "armhf"]], [/windows (ce|mobile); ppc;/i], [[s, "arm"]], [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i], [[s, /ower/, "", W]], [/(sun4\w)[;\)]/i], [[s, "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i], [[s, W]]], device: [[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i], [n, [q, L], [p, v]], [/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i, /samsung[- ]([-\w]+)/i, /sec-(sgh\w+)/i], [n, [q, L], [p, u]], [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i], [n, [q, A], [p, u]], [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i], [n, [q, A], [p, v]], [/(macintosh);/i], [n, [q, A]], [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i], [n, [q, M], [p, u]], [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i], [n, [q, H], [p, v]], [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i], [n, [q, H], [p, u]], [/\b(poco[\w ]+)(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i], [[n, /_/g, " "], [q, O], [p, u]], [/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i], [[n, /_/g, " "], [q, O], [p, v]], [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i], [n, [q, "OPPO"], [p, u]], [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i], [n, [q, "Vivo"], [p, u]], [/\b(rmx[12]\d{3})(?: bui|;|\))/i], [n, [q, "Realme"], [p, u]], [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i], [n, [q, J], [p, u]], [/\b(mz60\d|xoom[2 ]{0,2}) build\//i], [n, [q, J], [p, v]], [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i], [n, [q, "LG"], [p, v]], [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i], [n, [q, "LG"], [p, u]], [/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i], [n, [q, "Lenovo"], [p, v]], [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i], [[n, /_/g, " "], [q, "Nokia"], [p, u]], [/(pixel c)\b/i], [n, [q, G], [p, v]], [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i], [n, [q, G], [p, u]], [/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [n, [q, N], [p, u]], [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i], [[n, "Xperia Tablet"], [q, N], [p, v]], [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i], [n, [q, "OnePlus"], [p, u]], [/(alexa)webm/i, /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i], [n, [q, z], [p, v]], [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i], [[n, /(.+)/g, "Fire Phone $1"], [q, z], [p, u]], [/(playbook);[-\w\),; ]+(rim)/i], [n, q, [p, v]], [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i], [n, [q, C], [p, u]], [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i], [n, [q, B], [p, v]], [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i], [n, [q, B], [p, u]], [/(nexus 9)/i], [n, [q, "HTC"], [p, v]], [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i], [q, [n, /_/g, " "], [p, u]], [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i], [n, [q, "Acer"], [p, v]], [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i], [n, [q, "Meizu"], [p, u]], [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i, /(hp) ([\w ]+\w)/i, /(asus)-?(\w+)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w]+)/i, /(jolla)/i, /(oppo) ?([\w ]+) bui/i], [q, n, [p, u]], [/(kobo)\s(ereader|touch)/i, /(archos) (gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /(nook)[\w ]+build\/(\w+)/i, /(dell) (strea[kpr\d ]*[\dko])/i, /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, /(trinity)[- ]*(t\d{3}) bui/i, /(gigaset)[- ]+(q\w{1,9}) bui/i, /(vodafone) ([\w ]+)(?:\)| bui)/i], [q, n, [p, v]], [/(surface duo)/i], [n, [q, I], [p, v]], [/droid [\d\.]+; (fp\du?)(?: b|\))/i], [n, [q, "Fairphone"], [p, u]], [/(u304aa)/i], [n, [q, "AT&T"], [p, u]], [/\bsie-(\w*)/i], [n, [q, "Siemens"], [p, u]], [/\b(rct\w+) b/i], [n, [q, "RCA"], [p, v]], [/\b(venue[\d ]{2,7}) b/i], [n, [q, "Dell"], [p, v]], [/\b(q(?:mv|ta)\w+) b/i], [n, [q, "Verizon"], [p, v]], [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i], [n, [q, "Barnes & Noble"], [p, v]], [/\b(tm\d{3}\w+) b/i], [n, [q, "NuVision"], [p, v]], [/\b(k88) b/i], [n, [q, "ZTE"], [p, v]], [/\b(nx\d{3}j) b/i], [n, [q, "ZTE"], [p, u]], [/\b(gen\d{3}) b.+49h/i], [n, [q, "Swiss"], [p, u]], [/\b(zur\d{3}) b/i], [n, [q, "Swiss"], [p, v]], [/\b((zeki)?tb.*\b) b/i], [n, [q, "Zeki"], [p, v]], [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i], [[q, "Dragon Touch"], n, [p, v]], [/\b(ns-?\w{0,9}) b/i], [n, [q, "Insignia"], [p, v]], [/\b((nxa|next)-?\w{0,9}) b/i], [n, [q, "NextBook"], [p, v]], [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i], [[q, "Voice"], n, [p, u]], [/\b(lvtel\-)?(v1[12]) b/i], [[q, "LvTel"], n, [p, u]], [/\b(ph-1) /i], [n, [q, "Essential"], [p, u]], [/\b(v(100md|700na|7011|917g).*\b) b/i], [n, [q, "Envizen"], [p, v]], [/\b(trio[-\w\. ]+) b/i], [n, [q, "MachSpeed"], [p, v]], [/\btu_(1491) b/i], [n, [q, "Rotor"], [p, v]], [/(shield[\w ]+) b/i], [n, [q, "Nvidia"], [p, v]], [/(sprint) (\w+)/i], [q, n, [p, u]], [/(kin\.[onetw]{3})/i], [[n, /\./g, " "], [q, I], [p, u]], [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i], [n, [q, P], [p, v]], [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i], [n, [q, P], [p, u]], [/smart-tv.+(samsung)/i], [q, [p, w]], [/hbbtv.+maple;(\d+)/i], [[n, /^/, "SmartTV"], [q, L], [p, w]], [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i], [[q, "LG"], [p, w]], [/(apple) ?tv/i], [q, [n, A + " TV"], [p, w]], [/crkey/i], [[n, E + "cast"], [q, G], [p, w]], [/droid.+aft(\w)( bui|\))/i], [n, [q, z], [p, w]], [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i], [n, [q, M], [p, w]], [/(bravia[\w ]+)( bui|\))/i], [n, [q, N], [p, w]], [/(mitv-\w{5}) bui/i], [n, [q, O], [p, w]], [/Hbbtv.*(technisat) (.*);/i], [q, n, [p, w]], [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i], [[q, X], [n, X], [p, w]], [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i], [[p, w]], [/(ouya)/i, /(nintendo) ([wids3utch]+)/i], [q, n, [p, t]], [/droid.+; (shield) bui/i], [n, [q, "Nvidia"], [p, t]], [/(playstation [345portablevi]+)/i], [n, [q, N], [p, t]], [/\b(xbox(?: one)?(?!; xbox))[\); ]/i], [n, [q, I], [p, t]], [/((pebble))app/i], [q, n, [p, x]], [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i], [n, [q, A], [p, x]], [/droid.+; (glass) \d/i], [n, [q, G], [p, x]], [/droid.+; (wt63?0{2,3})\)/i], [n, [q, P], [p, x]], [/(quest( 2| pro)?)/i], [n, [q, Q], [p, x]], [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i], [q, [p, y]], [/(aeobc)\b/i], [n, [q, z], [p, y]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i], [n, [p, u]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i], [n, [p, v]], [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i], [[p, v]], [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i], [[p, u]], [/(android[-\w\. ]{0,9});.+buil/i], [n, [q, "Generic"]]], engine: [[/windows.+ edge\/([\w\.]+)/i], [r, [o, "EdgeHTML"]], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i], [r, [o, "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i, /\b(libweb)/i], [o, r], [/rv\:([\w\.]{1,9})\b.+(gecko)/i], [r, o]], os: [[/microsoft (windows) (vista|xp)/i], [o, r], [/(windows) nt 6\.2; (arm)/i, /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i, /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i], [o, [r, Z, $]], [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i], [[o, "Windows"], [r, Z, $]], [/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, /ios;fbsv\/([\d\.]+)/i, /cfnetwork\/.+darwin/i], [[r, /_/g, "."], [o, "iOS"]], [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i], [[o, S], [r, /_/g, "."]], [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i], [r, o], [/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/ ]([\w\.]+)/i, /\((series40);/i], [o, r], [/\(bb(10);/i], [r, [o, C]], [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i], [r, [o, "Symbian"]], [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i], [r, [o, F + " OS"]], [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i], [r, [o, "webOS"]], [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i], [r, [o, "watchOS"]], [/crkey\/([\d\.]+)/i], [r, [o, E + "cast"]], [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i], [[o, R], r], [/panasonic;(viera)/i, /(netrange)mmh/i, /(nettv)\/(\d+\.[\w\.]+)/i, /(nintendo|playstation) ([wids345portablevuch]+)/i, /(xbox); +xbox ([^\);]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux) ?([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i], [o, r], [/(sunos) ?([\w\.\d]*)/i], [[o, "Solaris"], r], [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, /(unix) ?([\w\.]*)/i], [o, r]] }, aa = function(a2, b2) {
              if (typeof a2 === k && (b2 = a2, a2 = h), !(this instanceof aa)) return new aa(a2, b2).getResult();
              var c2 = typeof g2 !== j && g2.navigator ? g2.navigator : h, d2 = a2 || (c2 && c2.userAgent ? c2.userAgent : ""), e3 = c2 && c2.userAgentData ? c2.userAgentData : h, f3 = b2 ? T(_, b2) : _, t2 = c2 && c2.userAgent == d2;
              return this.getBrowser = function() {
                var a3, b3 = {};
                return b3[o] = h, b3[r] = h, Y.call(b3, d2, f3.browser), b3[m] = typeof (a3 = b3[r]) === l ? a3.replace(/[^\d\.]/g, "").split(".")[0] : h, t2 && c2 && c2.brave && typeof c2.brave.isBrave == i && (b3[o] = "Brave"), b3;
              }, this.getCPU = function() {
                var a3 = {};
                return a3[s] = h, Y.call(a3, d2, f3.cpu), a3;
              }, this.getDevice = function() {
                var a3 = {};
                return a3[q] = h, a3[n] = h, a3[p] = h, Y.call(a3, d2, f3.device), t2 && !a3[p] && e3 && e3.mobile && (a3[p] = u), t2 && "Macintosh" == a3[n] && c2 && typeof c2.standalone !== j && c2.maxTouchPoints && c2.maxTouchPoints > 2 && (a3[n] = "iPad", a3[p] = v), a3;
              }, this.getEngine = function() {
                var a3 = {};
                return a3[o] = h, a3[r] = h, Y.call(a3, d2, f3.engine), a3;
              }, this.getOS = function() {
                var a3 = {};
                return a3[o] = h, a3[r] = h, Y.call(a3, d2, f3.os), t2 && !a3[o] && e3 && "Unknown" != e3.platform && (a3[o] = e3.platform.replace(/chrome os/i, R).replace(/macos/i, S)), a3;
              }, this.getResult = function() {
                return { ua: this.getUA(), browser: this.getBrowser(), engine: this.getEngine(), os: this.getOS(), device: this.getDevice(), cpu: this.getCPU() };
              }, this.getUA = function() {
                return d2;
              }, this.setUA = function(a3) {
                return d2 = typeof a3 === l && a3.length > 350 ? X(a3, 350) : a3, this;
              }, this.setUA(d2), this;
            };
            aa.VERSION = "1.0.35", aa.BROWSER = U([o, r, m]), aa.CPU = U([s]), aa.DEVICE = U([n, q, p, t, u, w, v, x, y]), aa.ENGINE = aa.OS = U([o, r]), typeof f2 !== j ? (e2.exports && (f2 = e2.exports = aa), f2.UAParser = aa) : c.amdO ? void 0 === (d = function() {
              return aa;
            }.call(b, c, b, a)) || (a.exports = d) : typeof g2 !== j && (g2.UAParser = aa);
            var ab = typeof g2 !== j && (g2.jQuery || g2.Zepto);
            if (ab && !ab.ua) {
              var ac = new aa();
              ab.ua = ac.getResult(), ab.ua.get = function() {
                return ac.getUA();
              }, ab.ua.set = function(a2) {
                ac.setUA(a2);
                var b2 = ac.getResult();
                for (var c2 in b2) ab.ua[c2] = b2[c2];
              };
            }
          }("object" == typeof window ? window : this);
        } }, f = {};
        function g(a2) {
          var b2 = f[a2];
          if (void 0 !== b2) return b2.exports;
          var c2 = f[a2] = { exports: {} }, d2 = true;
          try {
            e[a2].call(c2.exports, c2, c2.exports, g), d2 = false;
          } finally {
            d2 && delete f[a2];
          }
          return c2.exports;
        }
        g.ab = "//", a.exports = g(226);
      })();
    }, 521: (a) => {
      "use strict";
      a.exports = (init_node_async_hooks(), __toCommonJS(node_async_hooks_exports));
    }, 663: (a) => {
      (() => {
        "use strict";
        "undefined" != typeof __nccwpck_require__ && (__nccwpck_require__.ab = "//");
        var b = {};
        (() => {
          b.parse = function(b2, c2) {
            if ("string" != typeof b2) throw TypeError("argument str must be a string");
            for (var e2 = {}, f = b2.split(d), g = (c2 || {}).decode || a2, h = 0; h < f.length; h++) {
              var i = f[h], j = i.indexOf("=");
              if (!(j < 0)) {
                var k = i.substr(0, j).trim(), l = i.substr(++j, i.length).trim();
                '"' == l[0] && (l = l.slice(1, -1)), void 0 == e2[k] && (e2[k] = function(a3, b3) {
                  try {
                    return b3(a3);
                  } catch (b4) {
                    return a3;
                  }
                }(l, g));
              }
            }
            return e2;
          }, b.serialize = function(a3, b2, d2) {
            var f = d2 || {}, g = f.encode || c;
            if ("function" != typeof g) throw TypeError("option encode is invalid");
            if (!e.test(a3)) throw TypeError("argument name is invalid");
            var h = g(b2);
            if (h && !e.test(h)) throw TypeError("argument val is invalid");
            var i = a3 + "=" + h;
            if (null != f.maxAge) {
              var j = f.maxAge - 0;
              if (isNaN(j) || !isFinite(j)) throw TypeError("option maxAge is invalid");
              i += "; Max-Age=" + Math.floor(j);
            }
            if (f.domain) {
              if (!e.test(f.domain)) throw TypeError("option domain is invalid");
              i += "; Domain=" + f.domain;
            }
            if (f.path) {
              if (!e.test(f.path)) throw TypeError("option path is invalid");
              i += "; Path=" + f.path;
            }
            if (f.expires) {
              if ("function" != typeof f.expires.toUTCString) throw TypeError("option expires is invalid");
              i += "; Expires=" + f.expires.toUTCString();
            }
            if (f.httpOnly && (i += "; HttpOnly"), f.secure && (i += "; Secure"), f.sameSite) switch ("string" == typeof f.sameSite ? f.sameSite.toLowerCase() : f.sameSite) {
              case true:
              case "strict":
                i += "; SameSite=Strict";
                break;
              case "lax":
                i += "; SameSite=Lax";
                break;
              case "none":
                i += "; SameSite=None";
                break;
              default:
                throw TypeError("option sameSite is invalid");
            }
            return i;
          };
          var a2 = decodeURIComponent, c = encodeURIComponent, d = /; */, e = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
        })(), a.exports = b;
      })();
    }, 720: (a, b, c) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true }), !function(a2, b2) {
        for (var c2 in b2) Object.defineProperty(a2, c2, { enumerable: true, get: b2[c2] });
      }(b, { interceptTestApis: function() {
        return f;
      }, wrapRequestHandler: function() {
        return g;
      } });
      let d = c(392), e = c(165);
      function f() {
        return (0, e.interceptFetch)(c.g.fetch);
      }
      function g(a2) {
        return (b2, c2) => (0, d.withRequest)(b2, e.reader, () => a2(b2, c2));
      }
    }, 814: (a, b, c) => {
      "use strict";
      a.exports = c(440);
    }, 817: (a, b, c) => {
      (() => {
        "use strict";
        var b2 = { 491: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.ContextAPI = void 0;
          let d2 = c2(223), e2 = c2(172), f2 = c2(930), g = "context", h = new d2.NoopContextManager();
          class i {
            constructor() {
            }
            static getInstance() {
              return this._instance || (this._instance = new i()), this._instance;
            }
            setGlobalContextManager(a3) {
              return (0, e2.registerGlobal)(g, a3, f2.DiagAPI.instance());
            }
            active() {
              return this._getContextManager().active();
            }
            with(a3, b4, c3, ...d3) {
              return this._getContextManager().with(a3, b4, c3, ...d3);
            }
            bind(a3, b4) {
              return this._getContextManager().bind(a3, b4);
            }
            _getContextManager() {
              return (0, e2.getGlobal)(g) || h;
            }
            disable() {
              this._getContextManager().disable(), (0, e2.unregisterGlobal)(g, f2.DiagAPI.instance());
            }
          }
          b3.ContextAPI = i;
        }, 930: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.DiagAPI = void 0;
          let d2 = c2(56), e2 = c2(912), f2 = c2(957), g = c2(172);
          class h {
            constructor() {
              function a3(a4) {
                return function(...b5) {
                  let c3 = (0, g.getGlobal)("diag");
                  if (c3) return c3[a4](...b5);
                };
              }
              let b4 = this;
              b4.setLogger = (a4, c3 = { logLevel: f2.DiagLogLevel.INFO }) => {
                var d3, h2, i;
                if (a4 === b4) {
                  let a5 = Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
                  return b4.error(null != (d3 = a5.stack) ? d3 : a5.message), false;
                }
                "number" == typeof c3 && (c3 = { logLevel: c3 });
                let j = (0, g.getGlobal)("diag"), k = (0, e2.createLogLevelDiagLogger)(null != (h2 = c3.logLevel) ? h2 : f2.DiagLogLevel.INFO, a4);
                if (j && !c3.suppressOverrideMessage) {
                  let a5 = null != (i = Error().stack) ? i : "<failed to generate stacktrace>";
                  j.warn(`Current logger will be overwritten from ${a5}`), k.warn(`Current logger will overwrite one already registered from ${a5}`);
                }
                return (0, g.registerGlobal)("diag", k, b4, true);
              }, b4.disable = () => {
                (0, g.unregisterGlobal)("diag", b4);
              }, b4.createComponentLogger = (a4) => new d2.DiagComponentLogger(a4), b4.verbose = a3("verbose"), b4.debug = a3("debug"), b4.info = a3("info"), b4.warn = a3("warn"), b4.error = a3("error");
            }
            static instance() {
              return this._instance || (this._instance = new h()), this._instance;
            }
          }
          b3.DiagAPI = h;
        }, 653: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.MetricsAPI = void 0;
          let d2 = c2(660), e2 = c2(172), f2 = c2(930), g = "metrics";
          class h {
            constructor() {
            }
            static getInstance() {
              return this._instance || (this._instance = new h()), this._instance;
            }
            setGlobalMeterProvider(a3) {
              return (0, e2.registerGlobal)(g, a3, f2.DiagAPI.instance());
            }
            getMeterProvider() {
              return (0, e2.getGlobal)(g) || d2.NOOP_METER_PROVIDER;
            }
            getMeter(a3, b4, c3) {
              return this.getMeterProvider().getMeter(a3, b4, c3);
            }
            disable() {
              (0, e2.unregisterGlobal)(g, f2.DiagAPI.instance());
            }
          }
          b3.MetricsAPI = h;
        }, 181: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.PropagationAPI = void 0;
          let d2 = c2(172), e2 = c2(874), f2 = c2(194), g = c2(277), h = c2(369), i = c2(930), j = "propagation", k = new e2.NoopTextMapPropagator();
          class l {
            constructor() {
              this.createBaggage = h.createBaggage, this.getBaggage = g.getBaggage, this.getActiveBaggage = g.getActiveBaggage, this.setBaggage = g.setBaggage, this.deleteBaggage = g.deleteBaggage;
            }
            static getInstance() {
              return this._instance || (this._instance = new l()), this._instance;
            }
            setGlobalPropagator(a3) {
              return (0, d2.registerGlobal)(j, a3, i.DiagAPI.instance());
            }
            inject(a3, b4, c3 = f2.defaultTextMapSetter) {
              return this._getGlobalPropagator().inject(a3, b4, c3);
            }
            extract(a3, b4, c3 = f2.defaultTextMapGetter) {
              return this._getGlobalPropagator().extract(a3, b4, c3);
            }
            fields() {
              return this._getGlobalPropagator().fields();
            }
            disable() {
              (0, d2.unregisterGlobal)(j, i.DiagAPI.instance());
            }
            _getGlobalPropagator() {
              return (0, d2.getGlobal)(j) || k;
            }
          }
          b3.PropagationAPI = l;
        }, 997: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.TraceAPI = void 0;
          let d2 = c2(172), e2 = c2(846), f2 = c2(139), g = c2(607), h = c2(930), i = "trace";
          class j {
            constructor() {
              this._proxyTracerProvider = new e2.ProxyTracerProvider(), this.wrapSpanContext = f2.wrapSpanContext, this.isSpanContextValid = f2.isSpanContextValid, this.deleteSpan = g.deleteSpan, this.getSpan = g.getSpan, this.getActiveSpan = g.getActiveSpan, this.getSpanContext = g.getSpanContext, this.setSpan = g.setSpan, this.setSpanContext = g.setSpanContext;
            }
            static getInstance() {
              return this._instance || (this._instance = new j()), this._instance;
            }
            setGlobalTracerProvider(a3) {
              let b4 = (0, d2.registerGlobal)(i, this._proxyTracerProvider, h.DiagAPI.instance());
              return b4 && this._proxyTracerProvider.setDelegate(a3), b4;
            }
            getTracerProvider() {
              return (0, d2.getGlobal)(i) || this._proxyTracerProvider;
            }
            getTracer(a3, b4) {
              return this.getTracerProvider().getTracer(a3, b4);
            }
            disable() {
              (0, d2.unregisterGlobal)(i, h.DiagAPI.instance()), this._proxyTracerProvider = new e2.ProxyTracerProvider();
            }
          }
          b3.TraceAPI = j;
        }, 277: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.deleteBaggage = b3.setBaggage = b3.getActiveBaggage = b3.getBaggage = void 0;
          let d2 = c2(491), e2 = (0, c2(780).createContextKey)("OpenTelemetry Baggage Key");
          function f2(a3) {
            return a3.getValue(e2) || void 0;
          }
          b3.getBaggage = f2, b3.getActiveBaggage = function() {
            return f2(d2.ContextAPI.getInstance().active());
          }, b3.setBaggage = function(a3, b4) {
            return a3.setValue(e2, b4);
          }, b3.deleteBaggage = function(a3) {
            return a3.deleteValue(e2);
          };
        }, 993: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.BaggageImpl = void 0;
          class c2 {
            constructor(a3) {
              this._entries = a3 ? new Map(a3) : /* @__PURE__ */ new Map();
            }
            getEntry(a3) {
              let b4 = this._entries.get(a3);
              if (b4) return Object.assign({}, b4);
            }
            getAllEntries() {
              return Array.from(this._entries.entries()).map(([a3, b4]) => [a3, b4]);
            }
            setEntry(a3, b4) {
              let d2 = new c2(this._entries);
              return d2._entries.set(a3, b4), d2;
            }
            removeEntry(a3) {
              let b4 = new c2(this._entries);
              return b4._entries.delete(a3), b4;
            }
            removeEntries(...a3) {
              let b4 = new c2(this._entries);
              for (let c3 of a3) b4._entries.delete(c3);
              return b4;
            }
            clear() {
              return new c2();
            }
          }
          b3.BaggageImpl = c2;
        }, 830: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.baggageEntryMetadataSymbol = void 0, b3.baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata");
        }, 369: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.baggageEntryMetadataFromString = b3.createBaggage = void 0;
          let d2 = c2(930), e2 = c2(993), f2 = c2(830), g = d2.DiagAPI.instance();
          b3.createBaggage = function(a3 = {}) {
            return new e2.BaggageImpl(new Map(Object.entries(a3)));
          }, b3.baggageEntryMetadataFromString = function(a3) {
            return "string" != typeof a3 && (g.error(`Cannot create baggage metadata from unknown type: ${typeof a3}`), a3 = ""), { __TYPE__: f2.baggageEntryMetadataSymbol, toString: () => a3 };
          };
        }, 67: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.context = void 0, b3.context = c2(491).ContextAPI.getInstance();
        }, 223: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.NoopContextManager = void 0;
          let d2 = c2(780);
          class e2 {
            active() {
              return d2.ROOT_CONTEXT;
            }
            with(a3, b4, c3, ...d3) {
              return b4.call(c3, ...d3);
            }
            bind(a3, b4) {
              return b4;
            }
            enable() {
              return this;
            }
            disable() {
              return this;
            }
          }
          b3.NoopContextManager = e2;
        }, 780: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.ROOT_CONTEXT = b3.createContextKey = void 0, b3.createContextKey = function(a3) {
            return Symbol.for(a3);
          };
          class c2 {
            constructor(a3) {
              let b4 = this;
              b4._currentContext = a3 ? new Map(a3) : /* @__PURE__ */ new Map(), b4.getValue = (a4) => b4._currentContext.get(a4), b4.setValue = (a4, d2) => {
                let e2 = new c2(b4._currentContext);
                return e2._currentContext.set(a4, d2), e2;
              }, b4.deleteValue = (a4) => {
                let d2 = new c2(b4._currentContext);
                return d2._currentContext.delete(a4), d2;
              };
            }
          }
          b3.ROOT_CONTEXT = new c2();
        }, 506: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.diag = void 0, b3.diag = c2(930).DiagAPI.instance();
        }, 56: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.DiagComponentLogger = void 0;
          let d2 = c2(172);
          class e2 {
            constructor(a3) {
              this._namespace = a3.namespace || "DiagComponentLogger";
            }
            debug(...a3) {
              return f2("debug", this._namespace, a3);
            }
            error(...a3) {
              return f2("error", this._namespace, a3);
            }
            info(...a3) {
              return f2("info", this._namespace, a3);
            }
            warn(...a3) {
              return f2("warn", this._namespace, a3);
            }
            verbose(...a3) {
              return f2("verbose", this._namespace, a3);
            }
          }
          function f2(a3, b4, c3) {
            let e3 = (0, d2.getGlobal)("diag");
            if (e3) return c3.unshift(b4), e3[a3](...c3);
          }
          b3.DiagComponentLogger = e2;
        }, 972: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.DiagConsoleLogger = void 0;
          let c2 = [{ n: "error", c: "error" }, { n: "warn", c: "warn" }, { n: "info", c: "info" }, { n: "debug", c: "debug" }, { n: "verbose", c: "trace" }];
          class d2 {
            constructor() {
              for (let a3 = 0; a3 < c2.length; a3++) this[c2[a3].n] = /* @__PURE__ */ function(a4) {
                return function(...b4) {
                  if (console) {
                    let c3 = console[a4];
                    if ("function" != typeof c3 && (c3 = console.log), "function" == typeof c3) return c3.apply(console, b4);
                  }
                };
              }(c2[a3].c);
            }
          }
          b3.DiagConsoleLogger = d2;
        }, 912: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.createLogLevelDiagLogger = void 0;
          let d2 = c2(957);
          b3.createLogLevelDiagLogger = function(a3, b4) {
            function c3(c4, d3) {
              let e2 = b4[c4];
              return "function" == typeof e2 && a3 >= d3 ? e2.bind(b4) : function() {
              };
            }
            return a3 < d2.DiagLogLevel.NONE ? a3 = d2.DiagLogLevel.NONE : a3 > d2.DiagLogLevel.ALL && (a3 = d2.DiagLogLevel.ALL), b4 = b4 || {}, { error: c3("error", d2.DiagLogLevel.ERROR), warn: c3("warn", d2.DiagLogLevel.WARN), info: c3("info", d2.DiagLogLevel.INFO), debug: c3("debug", d2.DiagLogLevel.DEBUG), verbose: c3("verbose", d2.DiagLogLevel.VERBOSE) };
          };
        }, 957: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.DiagLogLevel = void 0, function(a3) {
            a3[a3.NONE = 0] = "NONE", a3[a3.ERROR = 30] = "ERROR", a3[a3.WARN = 50] = "WARN", a3[a3.INFO = 60] = "INFO", a3[a3.DEBUG = 70] = "DEBUG", a3[a3.VERBOSE = 80] = "VERBOSE", a3[a3.ALL = 9999] = "ALL";
          }(b3.DiagLogLevel || (b3.DiagLogLevel = {}));
        }, 172: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.unregisterGlobal = b3.getGlobal = b3.registerGlobal = void 0;
          let d2 = c2(200), e2 = c2(521), f2 = c2(130), g = e2.VERSION.split(".")[0], h = Symbol.for(`opentelemetry.js.api.${g}`), i = d2._globalThis;
          b3.registerGlobal = function(a3, b4, c3, d3 = false) {
            var f3;
            let g2 = i[h] = null != (f3 = i[h]) ? f3 : { version: e2.VERSION };
            if (!d3 && g2[a3]) {
              let b5 = Error(`@opentelemetry/api: Attempted duplicate registration of API: ${a3}`);
              return c3.error(b5.stack || b5.message), false;
            }
            if (g2.version !== e2.VERSION) {
              let b5 = Error(`@opentelemetry/api: Registration of version v${g2.version} for ${a3} does not match previously registered API v${e2.VERSION}`);
              return c3.error(b5.stack || b5.message), false;
            }
            return g2[a3] = b4, c3.debug(`@opentelemetry/api: Registered a global for ${a3} v${e2.VERSION}.`), true;
          }, b3.getGlobal = function(a3) {
            var b4, c3;
            let d3 = null == (b4 = i[h]) ? void 0 : b4.version;
            if (d3 && (0, f2.isCompatible)(d3)) return null == (c3 = i[h]) ? void 0 : c3[a3];
          }, b3.unregisterGlobal = function(a3, b4) {
            b4.debug(`@opentelemetry/api: Unregistering a global for ${a3} v${e2.VERSION}.`);
            let c3 = i[h];
            c3 && delete c3[a3];
          };
        }, 130: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.isCompatible = b3._makeCompatibilityCheck = void 0;
          let d2 = c2(521), e2 = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
          function f2(a3) {
            let b4 = /* @__PURE__ */ new Set([a3]), c3 = /* @__PURE__ */ new Set(), d3 = a3.match(e2);
            if (!d3) return () => false;
            let f3 = { major: +d3[1], minor: +d3[2], patch: +d3[3], prerelease: d3[4] };
            if (null != f3.prerelease) return function(b5) {
              return b5 === a3;
            };
            function g(a4) {
              return c3.add(a4), false;
            }
            return function(a4) {
              if (b4.has(a4)) return true;
              if (c3.has(a4)) return false;
              let d4 = a4.match(e2);
              if (!d4) return g(a4);
              let h = { major: +d4[1], minor: +d4[2], patch: +d4[3], prerelease: d4[4] };
              if (null != h.prerelease || f3.major !== h.major) return g(a4);
              if (0 === f3.major) return f3.minor === h.minor && f3.patch <= h.patch ? (b4.add(a4), true) : g(a4);
              return f3.minor <= h.minor ? (b4.add(a4), true) : g(a4);
            };
          }
          b3._makeCompatibilityCheck = f2, b3.isCompatible = f2(d2.VERSION);
        }, 886: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.metrics = void 0, b3.metrics = c2(653).MetricsAPI.getInstance();
        }, 901: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.ValueType = void 0, function(a3) {
            a3[a3.INT = 0] = "INT", a3[a3.DOUBLE = 1] = "DOUBLE";
          }(b3.ValueType || (b3.ValueType = {}));
        }, 102: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.createNoopMeter = b3.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = b3.NOOP_OBSERVABLE_GAUGE_METRIC = b3.NOOP_OBSERVABLE_COUNTER_METRIC = b3.NOOP_UP_DOWN_COUNTER_METRIC = b3.NOOP_HISTOGRAM_METRIC = b3.NOOP_COUNTER_METRIC = b3.NOOP_METER = b3.NoopObservableUpDownCounterMetric = b3.NoopObservableGaugeMetric = b3.NoopObservableCounterMetric = b3.NoopObservableMetric = b3.NoopHistogramMetric = b3.NoopUpDownCounterMetric = b3.NoopCounterMetric = b3.NoopMetric = b3.NoopMeter = void 0;
          class c2 {
            constructor() {
            }
            createHistogram(a3, c3) {
              return b3.NOOP_HISTOGRAM_METRIC;
            }
            createCounter(a3, c3) {
              return b3.NOOP_COUNTER_METRIC;
            }
            createUpDownCounter(a3, c3) {
              return b3.NOOP_UP_DOWN_COUNTER_METRIC;
            }
            createObservableGauge(a3, c3) {
              return b3.NOOP_OBSERVABLE_GAUGE_METRIC;
            }
            createObservableCounter(a3, c3) {
              return b3.NOOP_OBSERVABLE_COUNTER_METRIC;
            }
            createObservableUpDownCounter(a3, c3) {
              return b3.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
            }
            addBatchObservableCallback(a3, b4) {
            }
            removeBatchObservableCallback(a3) {
            }
          }
          b3.NoopMeter = c2;
          class d2 {
          }
          b3.NoopMetric = d2;
          class e2 extends d2 {
            add(a3, b4) {
            }
          }
          b3.NoopCounterMetric = e2;
          class f2 extends d2 {
            add(a3, b4) {
            }
          }
          b3.NoopUpDownCounterMetric = f2;
          class g extends d2 {
            record(a3, b4) {
            }
          }
          b3.NoopHistogramMetric = g;
          class h {
            addCallback(a3) {
            }
            removeCallback(a3) {
            }
          }
          b3.NoopObservableMetric = h;
          class i extends h {
          }
          b3.NoopObservableCounterMetric = i;
          class j extends h {
          }
          b3.NoopObservableGaugeMetric = j;
          class k extends h {
          }
          b3.NoopObservableUpDownCounterMetric = k, b3.NOOP_METER = new c2(), b3.NOOP_COUNTER_METRIC = new e2(), b3.NOOP_HISTOGRAM_METRIC = new g(), b3.NOOP_UP_DOWN_COUNTER_METRIC = new f2(), b3.NOOP_OBSERVABLE_COUNTER_METRIC = new i(), b3.NOOP_OBSERVABLE_GAUGE_METRIC = new j(), b3.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new k(), b3.createNoopMeter = function() {
            return b3.NOOP_METER;
          };
        }, 660: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.NOOP_METER_PROVIDER = b3.NoopMeterProvider = void 0;
          let d2 = c2(102);
          class e2 {
            getMeter(a3, b4, c3) {
              return d2.NOOP_METER;
            }
          }
          b3.NoopMeterProvider = e2, b3.NOOP_METER_PROVIDER = new e2();
        }, 200: function(a2, b3, c2) {
          var d2 = this && this.__createBinding || (Object.create ? function(a3, b4, c3, d3) {
            void 0 === d3 && (d3 = c3), Object.defineProperty(a3, d3, { enumerable: true, get: function() {
              return b4[c3];
            } });
          } : function(a3, b4, c3, d3) {
            void 0 === d3 && (d3 = c3), a3[d3] = b4[c3];
          }), e2 = this && this.__exportStar || function(a3, b4) {
            for (var c3 in a3) "default" === c3 || Object.prototype.hasOwnProperty.call(b4, c3) || d2(b4, a3, c3);
          };
          Object.defineProperty(b3, "__esModule", { value: true }), e2(c2(46), b3);
        }, 651: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3._globalThis = void 0, b3._globalThis = "object" == typeof globalThis ? globalThis : c.g;
        }, 46: function(a2, b3, c2) {
          var d2 = this && this.__createBinding || (Object.create ? function(a3, b4, c3, d3) {
            void 0 === d3 && (d3 = c3), Object.defineProperty(a3, d3, { enumerable: true, get: function() {
              return b4[c3];
            } });
          } : function(a3, b4, c3, d3) {
            void 0 === d3 && (d3 = c3), a3[d3] = b4[c3];
          }), e2 = this && this.__exportStar || function(a3, b4) {
            for (var c3 in a3) "default" === c3 || Object.prototype.hasOwnProperty.call(b4, c3) || d2(b4, a3, c3);
          };
          Object.defineProperty(b3, "__esModule", { value: true }), e2(c2(651), b3);
        }, 939: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.propagation = void 0, b3.propagation = c2(181).PropagationAPI.getInstance();
        }, 874: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.NoopTextMapPropagator = void 0;
          class c2 {
            inject(a3, b4) {
            }
            extract(a3, b4) {
              return a3;
            }
            fields() {
              return [];
            }
          }
          b3.NoopTextMapPropagator = c2;
        }, 194: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.defaultTextMapSetter = b3.defaultTextMapGetter = void 0, b3.defaultTextMapGetter = { get(a3, b4) {
            if (null != a3) return a3[b4];
          }, keys: (a3) => null == a3 ? [] : Object.keys(a3) }, b3.defaultTextMapSetter = { set(a3, b4, c2) {
            null != a3 && (a3[b4] = c2);
          } };
        }, 845: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.trace = void 0, b3.trace = c2(997).TraceAPI.getInstance();
        }, 403: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.NonRecordingSpan = void 0;
          let d2 = c2(476);
          class e2 {
            constructor(a3 = d2.INVALID_SPAN_CONTEXT) {
              this._spanContext = a3;
            }
            spanContext() {
              return this._spanContext;
            }
            setAttribute(a3, b4) {
              return this;
            }
            setAttributes(a3) {
              return this;
            }
            addEvent(a3, b4) {
              return this;
            }
            setStatus(a3) {
              return this;
            }
            updateName(a3) {
              return this;
            }
            end(a3) {
            }
            isRecording() {
              return false;
            }
            recordException(a3, b4) {
            }
          }
          b3.NonRecordingSpan = e2;
        }, 614: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.NoopTracer = void 0;
          let d2 = c2(491), e2 = c2(607), f2 = c2(403), g = c2(139), h = d2.ContextAPI.getInstance();
          class i {
            startSpan(a3, b4, c3 = h.active()) {
              var d3;
              if (null == b4 ? void 0 : b4.root) return new f2.NonRecordingSpan();
              let i2 = c3 && (0, e2.getSpanContext)(c3);
              return "object" == typeof (d3 = i2) && "string" == typeof d3.spanId && "string" == typeof d3.traceId && "number" == typeof d3.traceFlags && (0, g.isSpanContextValid)(i2) ? new f2.NonRecordingSpan(i2) : new f2.NonRecordingSpan();
            }
            startActiveSpan(a3, b4, c3, d3) {
              let f3, g2, i2;
              if (arguments.length < 2) return;
              2 == arguments.length ? i2 = b4 : 3 == arguments.length ? (f3 = b4, i2 = c3) : (f3 = b4, g2 = c3, i2 = d3);
              let j = null != g2 ? g2 : h.active(), k = this.startSpan(a3, f3, j), l = (0, e2.setSpan)(j, k);
              return h.with(l, i2, void 0, k);
            }
          }
          b3.NoopTracer = i;
        }, 124: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.NoopTracerProvider = void 0;
          let d2 = c2(614);
          class e2 {
            getTracer(a3, b4, c3) {
              return new d2.NoopTracer();
            }
          }
          b3.NoopTracerProvider = e2;
        }, 125: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.ProxyTracer = void 0;
          let d2 = new (c2(614)).NoopTracer();
          class e2 {
            constructor(a3, b4, c3, d3) {
              this._provider = a3, this.name = b4, this.version = c3, this.options = d3;
            }
            startSpan(a3, b4, c3) {
              return this._getTracer().startSpan(a3, b4, c3);
            }
            startActiveSpan(a3, b4, c3, d3) {
              let e3 = this._getTracer();
              return Reflect.apply(e3.startActiveSpan, e3, arguments);
            }
            _getTracer() {
              if (this._delegate) return this._delegate;
              let a3 = this._provider.getDelegateTracer(this.name, this.version, this.options);
              return a3 ? (this._delegate = a3, this._delegate) : d2;
            }
          }
          b3.ProxyTracer = e2;
        }, 846: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.ProxyTracerProvider = void 0;
          let d2 = c2(125), e2 = new (c2(124)).NoopTracerProvider();
          class f2 {
            getTracer(a3, b4, c3) {
              var e3;
              return null != (e3 = this.getDelegateTracer(a3, b4, c3)) ? e3 : new d2.ProxyTracer(this, a3, b4, c3);
            }
            getDelegate() {
              var a3;
              return null != (a3 = this._delegate) ? a3 : e2;
            }
            setDelegate(a3) {
              this._delegate = a3;
            }
            getDelegateTracer(a3, b4, c3) {
              var d3;
              return null == (d3 = this._delegate) ? void 0 : d3.getTracer(a3, b4, c3);
            }
          }
          b3.ProxyTracerProvider = f2;
        }, 996: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.SamplingDecision = void 0, function(a3) {
            a3[a3.NOT_RECORD = 0] = "NOT_RECORD", a3[a3.RECORD = 1] = "RECORD", a3[a3.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED";
          }(b3.SamplingDecision || (b3.SamplingDecision = {}));
        }, 607: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.getSpanContext = b3.setSpanContext = b3.deleteSpan = b3.setSpan = b3.getActiveSpan = b3.getSpan = void 0;
          let d2 = c2(780), e2 = c2(403), f2 = c2(491), g = (0, d2.createContextKey)("OpenTelemetry Context Key SPAN");
          function h(a3) {
            return a3.getValue(g) || void 0;
          }
          function i(a3, b4) {
            return a3.setValue(g, b4);
          }
          b3.getSpan = h, b3.getActiveSpan = function() {
            return h(f2.ContextAPI.getInstance().active());
          }, b3.setSpan = i, b3.deleteSpan = function(a3) {
            return a3.deleteValue(g);
          }, b3.setSpanContext = function(a3, b4) {
            return i(a3, new e2.NonRecordingSpan(b4));
          }, b3.getSpanContext = function(a3) {
            var b4;
            return null == (b4 = h(a3)) ? void 0 : b4.spanContext();
          };
        }, 325: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.TraceStateImpl = void 0;
          let d2 = c2(564);
          class e2 {
            constructor(a3) {
              this._internalState = /* @__PURE__ */ new Map(), a3 && this._parse(a3);
            }
            set(a3, b4) {
              let c3 = this._clone();
              return c3._internalState.has(a3) && c3._internalState.delete(a3), c3._internalState.set(a3, b4), c3;
            }
            unset(a3) {
              let b4 = this._clone();
              return b4._internalState.delete(a3), b4;
            }
            get(a3) {
              return this._internalState.get(a3);
            }
            serialize() {
              return this._keys().reduce((a3, b4) => (a3.push(b4 + "=" + this.get(b4)), a3), []).join(",");
            }
            _parse(a3) {
              !(a3.length > 512) && (this._internalState = a3.split(",").reverse().reduce((a4, b4) => {
                let c3 = b4.trim(), e3 = c3.indexOf("=");
                if (-1 !== e3) {
                  let f2 = c3.slice(0, e3), g = c3.slice(e3 + 1, b4.length);
                  (0, d2.validateKey)(f2) && (0, d2.validateValue)(g) && a4.set(f2, g);
                }
                return a4;
              }, /* @__PURE__ */ new Map()), this._internalState.size > 32 && (this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, 32))));
            }
            _keys() {
              return Array.from(this._internalState.keys()).reverse();
            }
            _clone() {
              let a3 = new e2();
              return a3._internalState = new Map(this._internalState), a3;
            }
          }
          b3.TraceStateImpl = e2;
        }, 564: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.validateValue = b3.validateKey = void 0;
          let c2 = "[_0-9a-z-*/]", d2 = `[a-z]${c2}{0,255}`, e2 = `[a-z0-9]${c2}{0,240}@[a-z]${c2}{0,13}`, f2 = RegExp(`^(?:${d2}|${e2})$`), g = /^[ -~]{0,255}[!-~]$/, h = /,|=/;
          b3.validateKey = function(a3) {
            return f2.test(a3);
          }, b3.validateValue = function(a3) {
            return g.test(a3) && !h.test(a3);
          };
        }, 98: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.createTraceState = void 0;
          let d2 = c2(325);
          b3.createTraceState = function(a3) {
            return new d2.TraceStateImpl(a3);
          };
        }, 476: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.INVALID_SPAN_CONTEXT = b3.INVALID_TRACEID = b3.INVALID_SPANID = void 0;
          let d2 = c2(475);
          b3.INVALID_SPANID = "0000000000000000", b3.INVALID_TRACEID = "00000000000000000000000000000000", b3.INVALID_SPAN_CONTEXT = { traceId: b3.INVALID_TRACEID, spanId: b3.INVALID_SPANID, traceFlags: d2.TraceFlags.NONE };
        }, 357: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.SpanKind = void 0, function(a3) {
            a3[a3.INTERNAL = 0] = "INTERNAL", a3[a3.SERVER = 1] = "SERVER", a3[a3.CLIENT = 2] = "CLIENT", a3[a3.PRODUCER = 3] = "PRODUCER", a3[a3.CONSUMER = 4] = "CONSUMER";
          }(b3.SpanKind || (b3.SpanKind = {}));
        }, 139: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.wrapSpanContext = b3.isSpanContextValid = b3.isValidSpanId = b3.isValidTraceId = void 0;
          let d2 = c2(476), e2 = c2(403), f2 = /^([0-9a-f]{32})$/i, g = /^[0-9a-f]{16}$/i;
          function h(a3) {
            return f2.test(a3) && a3 !== d2.INVALID_TRACEID;
          }
          function i(a3) {
            return g.test(a3) && a3 !== d2.INVALID_SPANID;
          }
          b3.isValidTraceId = h, b3.isValidSpanId = i, b3.isSpanContextValid = function(a3) {
            return h(a3.traceId) && i(a3.spanId);
          }, b3.wrapSpanContext = function(a3) {
            return new e2.NonRecordingSpan(a3);
          };
        }, 847: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.SpanStatusCode = void 0, function(a3) {
            a3[a3.UNSET = 0] = "UNSET", a3[a3.OK = 1] = "OK", a3[a3.ERROR = 2] = "ERROR";
          }(b3.SpanStatusCode || (b3.SpanStatusCode = {}));
        }, 475: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.TraceFlags = void 0, function(a3) {
            a3[a3.NONE = 0] = "NONE", a3[a3.SAMPLED = 1] = "SAMPLED";
          }(b3.TraceFlags || (b3.TraceFlags = {}));
        }, 521: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.VERSION = void 0, b3.VERSION = "1.6.0";
        } }, d = {};
        function e(a2) {
          var c2 = d[a2];
          if (void 0 !== c2) return c2.exports;
          var f2 = d[a2] = { exports: {} }, g = true;
          try {
            b2[a2].call(f2.exports, f2, f2.exports, e), g = false;
          } finally {
            g && delete d[a2];
          }
          return f2.exports;
        }
        e.ab = "//";
        var f = {};
        (() => {
          Object.defineProperty(f, "__esModule", { value: true }), f.trace = f.propagation = f.metrics = f.diag = f.context = f.INVALID_SPAN_CONTEXT = f.INVALID_TRACEID = f.INVALID_SPANID = f.isValidSpanId = f.isValidTraceId = f.isSpanContextValid = f.createTraceState = f.TraceFlags = f.SpanStatusCode = f.SpanKind = f.SamplingDecision = f.ProxyTracerProvider = f.ProxyTracer = f.defaultTextMapSetter = f.defaultTextMapGetter = f.ValueType = f.createNoopMeter = f.DiagLogLevel = f.DiagConsoleLogger = f.ROOT_CONTEXT = f.createContextKey = f.baggageEntryMetadataFromString = void 0;
          var a2 = e(369);
          Object.defineProperty(f, "baggageEntryMetadataFromString", { enumerable: true, get: function() {
            return a2.baggageEntryMetadataFromString;
          } });
          var b3 = e(780);
          Object.defineProperty(f, "createContextKey", { enumerable: true, get: function() {
            return b3.createContextKey;
          } }), Object.defineProperty(f, "ROOT_CONTEXT", { enumerable: true, get: function() {
            return b3.ROOT_CONTEXT;
          } });
          var c2 = e(972);
          Object.defineProperty(f, "DiagConsoleLogger", { enumerable: true, get: function() {
            return c2.DiagConsoleLogger;
          } });
          var d2 = e(957);
          Object.defineProperty(f, "DiagLogLevel", { enumerable: true, get: function() {
            return d2.DiagLogLevel;
          } });
          var g = e(102);
          Object.defineProperty(f, "createNoopMeter", { enumerable: true, get: function() {
            return g.createNoopMeter;
          } });
          var h = e(901);
          Object.defineProperty(f, "ValueType", { enumerable: true, get: function() {
            return h.ValueType;
          } });
          var i = e(194);
          Object.defineProperty(f, "defaultTextMapGetter", { enumerable: true, get: function() {
            return i.defaultTextMapGetter;
          } }), Object.defineProperty(f, "defaultTextMapSetter", { enumerable: true, get: function() {
            return i.defaultTextMapSetter;
          } });
          var j = e(125);
          Object.defineProperty(f, "ProxyTracer", { enumerable: true, get: function() {
            return j.ProxyTracer;
          } });
          var k = e(846);
          Object.defineProperty(f, "ProxyTracerProvider", { enumerable: true, get: function() {
            return k.ProxyTracerProvider;
          } });
          var l = e(996);
          Object.defineProperty(f, "SamplingDecision", { enumerable: true, get: function() {
            return l.SamplingDecision;
          } });
          var m = e(357);
          Object.defineProperty(f, "SpanKind", { enumerable: true, get: function() {
            return m.SpanKind;
          } });
          var n = e(847);
          Object.defineProperty(f, "SpanStatusCode", { enumerable: true, get: function() {
            return n.SpanStatusCode;
          } });
          var o = e(475);
          Object.defineProperty(f, "TraceFlags", { enumerable: true, get: function() {
            return o.TraceFlags;
          } });
          var p = e(98);
          Object.defineProperty(f, "createTraceState", { enumerable: true, get: function() {
            return p.createTraceState;
          } });
          var q = e(139);
          Object.defineProperty(f, "isSpanContextValid", { enumerable: true, get: function() {
            return q.isSpanContextValid;
          } }), Object.defineProperty(f, "isValidTraceId", { enumerable: true, get: function() {
            return q.isValidTraceId;
          } }), Object.defineProperty(f, "isValidSpanId", { enumerable: true, get: function() {
            return q.isValidSpanId;
          } });
          var r = e(476);
          Object.defineProperty(f, "INVALID_SPANID", { enumerable: true, get: function() {
            return r.INVALID_SPANID;
          } }), Object.defineProperty(f, "INVALID_TRACEID", { enumerable: true, get: function() {
            return r.INVALID_TRACEID;
          } }), Object.defineProperty(f, "INVALID_SPAN_CONTEXT", { enumerable: true, get: function() {
            return r.INVALID_SPAN_CONTEXT;
          } });
          let s = e(67);
          Object.defineProperty(f, "context", { enumerable: true, get: function() {
            return s.context;
          } });
          let t = e(506);
          Object.defineProperty(f, "diag", { enumerable: true, get: function() {
            return t.diag;
          } });
          let u = e(886);
          Object.defineProperty(f, "metrics", { enumerable: true, get: function() {
            return u.metrics;
          } });
          let v = e(939);
          Object.defineProperty(f, "propagation", { enumerable: true, get: function() {
            return v.propagation;
          } });
          let w = e(845);
          Object.defineProperty(f, "trace", { enumerable: true, get: function() {
            return w.trace;
          } }), f.default = { context: s.context, diag: t.diag, metrics: u.metrics, propagation: v.propagation, trace: w.trace };
        })(), a.exports = f;
      })();
    } }, (a) => {
      var b = a(a.s = 18);
      (_ENTRIES = "undefined" == typeof _ENTRIES ? {} : _ENTRIES)["middleware_src/middleware"] = b;
    }]);
  }
});

// node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js
var edgeFunctionHandler_exports = {};
__export(edgeFunctionHandler_exports, {
  default: () => edgeFunctionHandler
});
async function edgeFunctionHandler(request) {
  const path3 = new URL(request.url).pathname;
  const routes = globalThis._ROUTES;
  const correspondingRoute = routes.find((route) => route.regex.some((r) => new RegExp(r).test(path3)));
  if (!correspondingRoute) {
    throw new Error(`No route found for ${request.url}`);
  }
  const entry = await self._ENTRIES[`middleware_${correspondingRoute.name}`];
  const result = await entry.default({
    page: correspondingRoute.page,
    request: {
      ...request,
      page: {
        name: correspondingRoute.name
      }
    }
  });
  globalThis.__openNextAls.getStore()?.pendingPromiseRunner.add(result.waitUntil);
  const response = result.response;
  return response;
}
var init_edgeFunctionHandler = __esm({
  "node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js"() {
    globalThis._ENTRIES = {};
    globalThis.self = globalThis;
    globalThis._ROUTES = [{ "name": "src/middleware", "page": "/", "regex": ["^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/log(\\.json)?[\\/#\\?]?$", "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/templates(\\.json)?[\\/#\\?]?$", "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/analytics(\\.json)?[\\/#\\?]?$"] }];
    require_edge_runtime_webpack();
    require_middleware();
  }
});

// node_modules/@opennextjs/aws/dist/utils/promise.js
init_logger();
var DetachedPromise = class {
  resolve;
  reject;
  promise;
  constructor() {
    let resolve;
    let reject;
    this.promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    this.resolve = resolve;
    this.reject = reject;
  }
};
var DetachedPromiseRunner = class {
  promises = [];
  withResolvers() {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    return detachedPromise;
  }
  add(promise) {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    promise.then(detachedPromise.resolve, detachedPromise.reject);
  }
  async await() {
    debug(`Awaiting ${this.promises.length} detached promises`);
    const results = await Promise.allSettled(this.promises.map((p) => p.promise));
    const rejectedPromises = results.filter((r) => r.status === "rejected");
    rejectedPromises.forEach((r) => {
      error(r.reason);
    });
  }
};
async function awaitAllDetachedPromise() {
  const store = globalThis.__openNextAls.getStore();
  const promisesToAwait = store?.pendingPromiseRunner.await() ?? Promise.resolve();
  if (store?.waitUntil) {
    store.waitUntil(promisesToAwait);
    return;
  }
  await promisesToAwait;
}
function provideNextAfterProvider() {
  const NEXT_REQUEST_CONTEXT_SYMBOL = Symbol.for("@next/request-context");
  const VERCEL_REQUEST_CONTEXT_SYMBOL = Symbol.for("@vercel/request-context");
  const store = globalThis.__openNextAls.getStore();
  const waitUntil = store?.waitUntil ?? ((promise) => store?.pendingPromiseRunner.add(promise));
  const nextAfterContext = {
    get: () => ({
      waitUntil
    })
  };
  globalThis[NEXT_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  if (process.env.EMULATE_VERCEL_REQUEST_CONTEXT) {
    globalThis[VERCEL_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  }
}
function runWithOpenNextRequestContext({ isISRRevalidation, waitUntil, requestId = Math.random().toString(36) }, fn) {
  return globalThis.__openNextAls.run({
    requestId,
    pendingPromiseRunner: new DetachedPromiseRunner(),
    isISRRevalidation,
    waitUntil,
    writtenTags: /* @__PURE__ */ new Set()
  }, async () => {
    provideNextAfterProvider();
    let result;
    try {
      result = await fn();
    } finally {
      await awaitAllDetachedPromise();
    }
    return result;
  });
}

// node_modules/@opennextjs/aws/dist/adapters/middleware.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/resolve.js
async function resolveConverter(converter2) {
  if (typeof converter2 === "function") {
    return converter2();
  }
  const m_1 = await Promise.resolve().then(() => (init_edge(), edge_exports));
  return m_1.default;
}
async function resolveWrapper(wrapper) {
  if (typeof wrapper === "function") {
    return wrapper();
  }
  const m_1 = await Promise.resolve().then(() => (init_cloudflare_edge(), cloudflare_edge_exports));
  return m_1.default;
}
async function resolveOriginResolver(originResolver) {
  if (typeof originResolver === "function") {
    return originResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_pattern_env(), pattern_env_exports));
  return m_1.default;
}
async function resolveAssetResolver(assetResolver) {
  if (typeof assetResolver === "function") {
    return assetResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_dummy(), dummy_exports));
  return m_1.default;
}
async function resolveProxyRequest(proxyRequest) {
  if (typeof proxyRequest === "function") {
    return proxyRequest();
  }
  const m_1 = await Promise.resolve().then(() => (init_fetch(), fetch_exports));
  return m_1.default;
}

// node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
async function createGenericHandler(handler3) {
  const config = await import("./open-next.config.mjs").then((m) => m.default);
  globalThis.openNextConfig = config;
  const handlerConfig = config[handler3.type];
  const override = handlerConfig && "override" in handlerConfig ? handlerConfig.override : void 0;
  const converter2 = await resolveConverter(override?.converter);
  const { name, wrapper } = await resolveWrapper(override?.wrapper);
  debug("Using wrapper", name);
  return wrapper(handler3.handler, converter2);
}

// node_modules/@opennextjs/aws/dist/core/routing/util.js
import crypto from "node:crypto";
import { parse as parseQs, stringify as stringifyQs } from "node:querystring";

// node_modules/@opennextjs/aws/dist/adapters/config/index.js
init_logger();
import path from "node:path";
globalThis.__dirname ??= "";
var NEXT_DIR = path.join(__dirname, ".next");
var OPEN_NEXT_DIR = path.join(__dirname, ".open-next");
debug({ NEXT_DIR, OPEN_NEXT_DIR });
var NextConfig = { "env": {}, "webpack": null, "eslint": { "ignoreDuringBuilds": false }, "typescript": { "ignoreBuildErrors": false, "tsconfigPath": "tsconfig.json" }, "typedRoutes": false, "distDir": ".next", "cleanDistDir": true, "assetPrefix": "", "cacheMaxMemorySize": 52428800, "configOrigin": "next.config.ts", "useFileSystemPublicRoutes": true, "generateEtags": true, "pageExtensions": ["tsx", "ts", "jsx", "js"], "poweredByHeader": true, "compress": true, "images": { "deviceSizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840], "imageSizes": [16, 32, 48, 64, 96, 128, 256, 384], "path": "/_next/image", "loader": "default", "loaderFile": "", "domains": [], "disableStaticImages": false, "minimumCacheTTL": 60, "formats": ["image/webp"], "maximumResponseBody": 5e7, "dangerouslyAllowSVG": false, "contentSecurityPolicy": "script-src 'none'; frame-src 'none'; sandbox;", "contentDispositionType": "attachment", "remotePatterns": [], "unoptimized": true }, "devIndicators": { "position": "bottom-left" }, "onDemandEntries": { "maxInactiveAge": 6e4, "pagesBufferLength": 5 }, "amp": { "canonicalBase": "" }, "basePath": "", "sassOptions": {}, "trailingSlash": false, "i18n": null, "productionBrowserSourceMaps": false, "excludeDefaultMomentLocales": true, "serverRuntimeConfig": {}, "publicRuntimeConfig": {}, "reactProductionProfiling": false, "reactStrictMode": null, "reactMaxHeadersLength": 6e3, "httpAgentOptions": { "keepAlive": true }, "logging": {}, "compiler": {}, "expireTime": 31536e3, "staticPageGenerationTimeout": 60, "output": "standalone", "modularizeImports": { "@mui/icons-material": { "transform": "@mui/icons-material/{{member}}" }, "lodash": { "transform": "lodash/{{member}}" } }, "outputFileTracingRoot": "/Users/howard/workout-app", "experimental": { "useSkewCookie": false, "cacheLife": { "default": { "stale": 300, "revalidate": 900, "expire": 4294967294 }, "seconds": { "stale": 30, "revalidate": 1, "expire": 60 }, "minutes": { "stale": 300, "revalidate": 60, "expire": 3600 }, "hours": { "stale": 300, "revalidate": 3600, "expire": 86400 }, "days": { "stale": 300, "revalidate": 86400, "expire": 604800 }, "weeks": { "stale": 300, "revalidate": 604800, "expire": 2592e3 }, "max": { "stale": 300, "revalidate": 2592e3, "expire": 4294967294 } }, "cacheHandlers": {}, "cssChunking": true, "multiZoneDraftMode": false, "appNavFailHandling": false, "prerenderEarlyExit": true, "serverMinification": true, "serverSourceMaps": false, "linkNoTouchStart": false, "caseSensitiveRoutes": false, "clientSegmentCache": false, "clientParamParsing": false, "dynamicOnHover": false, "preloadEntriesOnStart": true, "clientRouterFilter": true, "clientRouterFilterRedirects": false, "fetchCacheKeyPrefix": "", "middlewarePrefetch": "flexible", "optimisticClientCache": true, "manualClientBasePath": false, "cpus": 9, "memoryBasedWorkersCount": false, "imgOptConcurrency": null, "imgOptTimeoutInSeconds": 7, "imgOptMaxInputPixels": 268402689, "imgOptSequentialRead": null, "imgOptSkipMetadata": null, "isrFlushToDisk": true, "workerThreads": false, "optimizeCss": false, "nextScriptWorkers": false, "scrollRestoration": false, "externalDir": false, "disableOptimizedLoading": false, "gzipSize": true, "craCompat": false, "esmExternals": true, "fullySpecified": false, "swcTraceProfiling": false, "forceSwcTransforms": false, "largePageDataBytes": 128e3, "typedEnv": false, "parallelServerCompiles": false, "parallelServerBuildTraces": false, "ppr": false, "authInterrupts": false, "webpackMemoryOptimizations": false, "optimizeServerReact": true, "viewTransition": false, "routerBFCache": false, "removeUncaughtErrorAndRejectionListeners": false, "validateRSCRequestHeaders": false, "staleTimes": { "dynamic": 0, "static": 300 }, "serverComponentsHmrCache": true, "staticGenerationMaxConcurrency": 8, "staticGenerationMinPagesPerWorker": 25, "cacheComponents": false, "inlineCss": false, "useCache": false, "globalNotFound": false, "devtoolSegmentExplorer": true, "browserDebugInfoInTerminal": false, "optimizeRouterScrolling": false, "middlewareClientMaxBodySize": 10485760, "optimizePackageImports": ["lucide-react", "date-fns", "lodash-es", "ramda", "antd", "react-bootstrap", "ahooks", "@ant-design/icons", "@headlessui/react", "@headlessui-float/react", "@heroicons/react/20/solid", "@heroicons/react/24/solid", "@heroicons/react/24/outline", "@visx/visx", "@tremor/react", "rxjs", "@mui/material", "@mui/icons-material", "recharts", "react-use", "effect", "@effect/schema", "@effect/platform", "@effect/platform-node", "@effect/platform-browser", "@effect/platform-bun", "@effect/sql", "@effect/sql-mssql", "@effect/sql-mysql2", "@effect/sql-pg", "@effect/sql-sqlite-node", "@effect/sql-sqlite-bun", "@effect/sql-sqlite-wasm", "@effect/sql-sqlite-react-native", "@effect/rpc", "@effect/rpc-http", "@effect/typeclass", "@effect/experimental", "@effect/opentelemetry", "@material-ui/core", "@material-ui/icons", "@tabler/icons-react", "mui-core", "react-icons/ai", "react-icons/bi", "react-icons/bs", "react-icons/cg", "react-icons/ci", "react-icons/di", "react-icons/fa", "react-icons/fa6", "react-icons/fc", "react-icons/fi", "react-icons/gi", "react-icons/go", "react-icons/gr", "react-icons/hi", "react-icons/hi2", "react-icons/im", "react-icons/io", "react-icons/io5", "react-icons/lia", "react-icons/lib", "react-icons/lu", "react-icons/md", "react-icons/pi", "react-icons/ri", "react-icons/rx", "react-icons/si", "react-icons/sl", "react-icons/tb", "react-icons/tfi", "react-icons/ti", "react-icons/vsc", "react-icons/wi"], "trustHostHeader": false, "isExperimentalCompile": false }, "htmlLimitedBots": "[\\w-]+-Google|Google-[\\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight", "bundlePagesRouterDependencies": false, "configFileName": "next.config.ts", "turbopack": { "root": "/Users/howard/workout-app" } };
var BuildId = "5MKj2nmBOpCyNTQr4ZyXv";
var RoutesManifest = { "basePath": "", "rewrites": { "beforeFiles": [], "afterFiles": [], "fallback": [] }, "redirects": [{ "source": "/:path+/", "destination": "/:path+", "internal": true, "statusCode": 308, "regex": "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$" }], "routes": { "static": [{ "page": "/", "regex": "^/(?:/)?$", "routeKeys": {}, "namedRegex": "^/(?:/)?$" }, { "page": "/_not-found", "regex": "^/_not\\-found(?:/)?$", "routeKeys": {}, "namedRegex": "^/_not\\-found(?:/)?$" }, { "page": "/analytics", "regex": "^/analytics(?:/)?$", "routeKeys": {}, "namedRegex": "^/analytics(?:/)?$" }, { "page": "/exercises", "regex": "^/exercises(?:/)?$", "routeKeys": {}, "namedRegex": "^/exercises(?:/)?$" }, { "page": "/favicon.ico", "regex": "^/favicon\\.ico(?:/)?$", "routeKeys": {}, "namedRegex": "^/favicon\\.ico(?:/)?$" }, { "page": "/log", "regex": "^/log(?:/)?$", "routeKeys": {}, "namedRegex": "^/log(?:/)?$" }, { "page": "/templates", "regex": "^/templates(?:/)?$", "routeKeys": {}, "namedRegex": "^/templates(?:/)?$" }], "dynamic": [{ "page": "/api/auth/[...all]", "regex": "^/api/auth/(.+?)(?:/)?$", "routeKeys": { "nxtPall": "nxtPall" }, "namedRegex": "^/api/auth/(?<nxtPall>.+?)(?:/)?$" }, { "page": "/api/templates/[id]", "regex": "^/api/templates/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/templates/(?<nxtPid>[^/]+?)(?:/)?$" }], "data": { "static": [], "dynamic": [] } }, "locales": [] };
var ConfigHeaders = [];
var PrerenderManifest = { "version": 4, "routes": { "/_not-found": { "initialStatus": 404, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/_not-found", "dataRoute": "/_not-found.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/exercises": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/exercises", "dataRoute": "/exercises.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/analytics": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/analytics", "dataRoute": "/analytics.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/templates": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/templates", "dataRoute": "/templates.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/", "dataRoute": "/index.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/log": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/log", "dataRoute": "/log.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/favicon.ico": { "initialHeaders": { "cache-control": "public, max-age=0, must-revalidate", "content-type": "image/x-icon", "x-next-cache-tags": "_N_T_/layout,_N_T_/favicon.ico/layout,_N_T_/favicon.ico/route,_N_T_/favicon.ico" }, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/favicon.ico", "dataRoute": null, "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] } }, "dynamicRoutes": {}, "notFoundRoutes": [], "preview": { "previewModeId": "7e5fafa4ef9dc5e4410a4a4a7e604691", "previewModeSigningKey": "52fff2706bc744001dd330192935e03eb6ca913db9c9e95ef03455b7695b10dc", "previewModeEncryptionKey": "1f1e1ccfeb11c5f5faca8da7b34917d1760389f8dd4d403d33c00170bb3d6880" } };
var MiddlewareManifest = { "version": 3, "middleware": { "/": { "files": ["server/edge-runtime-webpack.js", "server/src/middleware.js"], "name": "src/middleware", "page": "/", "matchers": [{ "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/log(\\.json)?[\\/#\\?]?$", "originalSource": "/log" }, { "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/templates(\\.json)?[\\/#\\?]?$", "originalSource": "/templates" }, { "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/analytics(\\.json)?[\\/#\\?]?$", "originalSource": "/analytics" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "5MKj2nmBOpCyNTQr4ZyXv", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "JX6I0fXaAh18+Oy020ja82TlQ2dZUfOt0TSQKqyQLoA=", "__NEXT_PREVIEW_MODE_ID": "7e5fafa4ef9dc5e4410a4a4a7e604691", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "52fff2706bc744001dd330192935e03eb6ca913db9c9e95ef03455b7695b10dc", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "1f1e1ccfeb11c5f5faca8da7b34917d1760389f8dd4d403d33c00170bb3d6880" } } }, "functions": {}, "sortedMiddleware": ["/"] };
var AppPathRoutesManifest = { "/api/exercises/previous/route": "/api/exercises/previous", "/api/auth/[...all]/route": "/api/auth/[...all]", "/api/exercises/route": "/api/exercises", "/api/templates/[id]/route": "/api/templates/[id]", "/api/templates/route": "/api/templates", "/api/workouts/route": "/api/workouts", "/favicon.ico/route": "/favicon.ico", "/_not-found/page": "/_not-found", "/exercises/page": "/exercises", "/log/page": "/log", "/page": "/", "/analytics/page": "/analytics", "/templates/page": "/templates" };
var FunctionsConfigManifest = { "version": 1, "functions": {} };
var PagesManifest = { "/_app": "pages/_app.js", "/_error": "pages/_error.js", "/_document": "pages/_document.js", "/404": "pages/404.html" };
process.env.NEXT_BUILD_ID = BuildId;
process.env.NEXT_PREVIEW_MODE_ID = PrerenderManifest?.preview?.previewModeId;

// node_modules/@opennextjs/aws/dist/http/openNextResponse.js
init_logger();
init_util();
import { Transform } from "node:stream";

// node_modules/@opennextjs/aws/dist/core/routing/util.js
init_util();
init_logger();
import { ReadableStream as ReadableStream3 } from "node:stream/web";

// node_modules/@opennextjs/aws/dist/utils/binary.js
var commonBinaryMimeTypes = /* @__PURE__ */ new Set([
  "application/octet-stream",
  // Docs
  "application/epub+zip",
  "application/msword",
  "application/pdf",
  "application/rtf",
  "application/vnd.amazon.ebook",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // Fonts
  "font/otf",
  "font/woff",
  "font/woff2",
  // Images
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/vnd.microsoft.icon",
  "image/webp",
  // Audio
  "audio/3gpp",
  "audio/aac",
  "audio/basic",
  "audio/flac",
  "audio/mpeg",
  "audio/ogg",
  "audio/wavaudio/webm",
  "audio/x-aiff",
  "audio/x-midi",
  "audio/x-wav",
  // Video
  "video/3gpp",
  "video/mp2t",
  "video/mpeg",
  "video/ogg",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
  // Archives
  "application/java-archive",
  "application/vnd.apple.installer+xml",
  "application/x-7z-compressed",
  "application/x-apple-diskimage",
  "application/x-bzip",
  "application/x-bzip2",
  "application/x-gzip",
  "application/x-java-archive",
  "application/x-rar-compressed",
  "application/x-tar",
  "application/x-zip",
  "application/zip",
  // Serialized data
  "application/x-protobuf"
]);
function isBinaryContentType(contentType) {
  if (!contentType)
    return false;
  const value = contentType.split(";")[0];
  return commonBinaryMimeTypes.has(value);
}

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/i18n/accept-header.js
function parse(raw, preferences, options) {
  const lowers = /* @__PURE__ */ new Map();
  const header = raw.replace(/[ \t]/g, "");
  if (preferences) {
    let pos = 0;
    for (const preference of preferences) {
      const lower = preference.toLowerCase();
      lowers.set(lower, { orig: preference, pos: pos++ });
      if (options.prefixMatch) {
        const parts2 = lower.split("-");
        while (parts2.pop(), parts2.length > 0) {
          const joined = parts2.join("-");
          if (!lowers.has(joined)) {
            lowers.set(joined, { orig: preference, pos: pos++ });
          }
        }
      }
    }
  }
  const parts = header.split(",");
  const selections = [];
  const map = /* @__PURE__ */ new Set();
  for (let i = 0; i < parts.length; ++i) {
    const part = parts[i];
    if (!part) {
      continue;
    }
    const params = part.split(";");
    if (params.length > 2) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const token = params[0].toLowerCase();
    if (!token) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const selection = { token, pos: i, q: 1 };
    if (preferences && lowers.has(token)) {
      selection.pref = lowers.get(token).pos;
    }
    map.add(selection.token);
    if (params.length === 2) {
      const q = params[1];
      const [key, value] = q.split("=");
      if (!value || key !== "q" && key !== "Q") {
        throw new Error(`Invalid ${options.type} header`);
      }
      const score = Number.parseFloat(value);
      if (score === 0) {
        continue;
      }
      if (Number.isFinite(score) && score <= 1 && score >= 1e-3) {
        selection.q = score;
      }
    }
    selections.push(selection);
  }
  selections.sort((a, b) => {
    if (b.q !== a.q) {
      return b.q - a.q;
    }
    if (b.pref !== a.pref) {
      if (a.pref === void 0) {
        return 1;
      }
      if (b.pref === void 0) {
        return -1;
      }
      return a.pref - b.pref;
    }
    return a.pos - b.pos;
  });
  const values = selections.map((selection) => selection.token);
  if (!preferences || !preferences.length) {
    return values;
  }
  const preferred = [];
  for (const selection of values) {
    if (selection === "*") {
      for (const [preference, value] of lowers) {
        if (!map.has(preference)) {
          preferred.push(value.orig);
        }
      }
    } else {
      const lower = selection.toLowerCase();
      if (lowers.has(lower)) {
        preferred.push(lowers.get(lower).orig);
      }
    }
  }
  return preferred;
}
function acceptLanguage(header = "", preferences) {
  return parse(header, preferences, {
    type: "accept-language",
    prefixMatch: true
  })[0] || void 0;
}

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
function isLocalizedPath(path3) {
  return NextConfig.i18n?.locales.includes(path3.split("/")[1].toLowerCase()) ?? false;
}
function getLocaleFromCookie(cookies) {
  const i18n = NextConfig.i18n;
  const nextLocale = cookies.NEXT_LOCALE?.toLowerCase();
  return nextLocale ? i18n?.locales.find((locale) => nextLocale === locale.toLowerCase()) : void 0;
}
function detectDomainLocale({ hostname, detectedLocale }) {
  const i18n = NextConfig.i18n;
  const domains = i18n?.domains;
  if (!domains) {
    return;
  }
  const lowercasedLocale = detectedLocale?.toLowerCase();
  for (const domain of domains) {
    const domainHostname = domain.domain.split(":", 1)[0].toLowerCase();
    if (hostname === domainHostname || lowercasedLocale === domain.defaultLocale.toLowerCase() || domain.locales?.some((locale) => lowercasedLocale === locale.toLowerCase())) {
      return domain;
    }
  }
}
function detectLocale(internalEvent, i18n) {
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  if (i18n.localeDetection === false) {
    return domainLocale?.defaultLocale ?? i18n.defaultLocale;
  }
  const cookiesLocale = getLocaleFromCookie(internalEvent.cookies);
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  debug({
    cookiesLocale,
    preferredLocale,
    defaultLocale: i18n.defaultLocale,
    domainLocale
  });
  return domainLocale?.defaultLocale ?? cookiesLocale ?? preferredLocale ?? i18n.defaultLocale;
}
function localizePath(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n) {
    return internalEvent.rawPath;
  }
  if (isLocalizedPath(internalEvent.rawPath)) {
    return internalEvent.rawPath;
  }
  const detectedLocale = detectLocale(internalEvent, i18n);
  return `/${detectedLocale}${internalEvent.rawPath}`;
}
function handleLocaleRedirect(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n || i18n.localeDetection === false || internalEvent.rawPath !== "/") {
    return false;
  }
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  const detectedLocale = detectLocale(internalEvent, i18n);
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  const preferredDomain = detectDomainLocale({
    detectedLocale: preferredLocale
  });
  if (domainLocale && preferredDomain) {
    const isPDomain = preferredDomain.domain === domainLocale.domain;
    const isPLocale = preferredDomain.defaultLocale === preferredLocale;
    if (!isPDomain || !isPLocale) {
      const scheme = `http${preferredDomain.http ? "" : "s"}`;
      const rlocale = isPLocale ? "" : preferredLocale;
      return {
        type: "core",
        statusCode: 307,
        headers: {
          Location: `${scheme}://${preferredDomain.domain}/${rlocale}`
        },
        body: emptyReadableStream(),
        isBase64Encoded: false
      };
    }
  }
  const defaultLocale = domainLocale?.defaultLocale ?? i18n.defaultLocale;
  if (detectedLocale.toLowerCase() !== defaultLocale.toLowerCase()) {
    return {
      type: "core",
      statusCode: 307,
      headers: {
        Location: constructNextUrl(internalEvent.url, `/${detectedLocale}`)
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}

// node_modules/@opennextjs/aws/dist/core/routing/queue.js
function generateShardId(rawPath, maxConcurrency, prefix) {
  let a = cyrb128(rawPath);
  let t = a += 1831565813;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  const randomFloat = ((t ^ t >>> 14) >>> 0) / 4294967296;
  const randomInt = Math.floor(randomFloat * maxConcurrency);
  return `${prefix}-${randomInt}`;
}
function generateMessageGroupId(rawPath) {
  const maxConcurrency = Number.parseInt(process.env.MAX_REVALIDATE_CONCURRENCY ?? "10");
  return generateShardId(rawPath, maxConcurrency, "revalidate");
}
function cyrb128(str) {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ h1 >>> 18, 597399067);
  h2 = Math.imul(h4 ^ h2 >>> 22, 2869860233);
  h3 = Math.imul(h1 ^ h3 >>> 17, 951274213);
  h4 = Math.imul(h2 ^ h4 >>> 19, 2716044179);
  h1 ^= h2 ^ h3 ^ h4, h2 ^= h1, h3 ^= h1, h4 ^= h1;
  return h1 >>> 0;
}

// node_modules/@opennextjs/aws/dist/core/routing/util.js
function isExternal(url, host) {
  if (!url)
    return false;
  const pattern = /^https?:\/\//;
  if (!pattern.test(url))
    return false;
  if (host) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.host !== host;
    } catch {
      return !url.includes(host);
    }
  }
  return true;
}
function convertFromQueryString(query) {
  if (query === "")
    return {};
  const queryParts = query.split("&");
  return getQueryFromIterator(queryParts.map((p) => {
    const [key, value] = p.split("=");
    return [key, value];
  }));
}
function getUrlParts(url, isExternal2) {
  if (!isExternal2) {
    const regex2 = /\/([^?]*)\??(.*)/;
    const match3 = url.match(regex2);
    return {
      hostname: "",
      pathname: match3?.[1] ? `/${match3[1]}` : url,
      protocol: "",
      queryString: match3?.[2] ?? ""
    };
  }
  const regex = /^(https?:)\/\/?([^\/\s]+)(\/[^?]*)?(\?.*)?/;
  const match2 = url.match(regex);
  if (!match2) {
    throw new Error(`Invalid external URL: ${url}`);
  }
  return {
    protocol: match2[1] ?? "https:",
    hostname: match2[2],
    pathname: match2[3] ?? "",
    queryString: match2[4]?.slice(1) ?? ""
  };
}
function constructNextUrl(baseUrl, path3) {
  const nextBasePath = NextConfig.basePath ?? "";
  const url = new URL(`${nextBasePath}${path3}`, baseUrl);
  return url.href;
}
function convertToQueryString(query) {
  const queryStrings = [];
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => queryStrings.push(`${key}=${entry}`));
    } else {
      queryStrings.push(`${key}=${value}`);
    }
  });
  return queryStrings.length > 0 ? `?${queryStrings.join("&")}` : "";
}
function getMiddlewareMatch(middlewareManifest2, functionsManifest) {
  if (functionsManifest?.functions?.["/_middleware"]) {
    return functionsManifest.functions["/_middleware"].matchers?.map(({ regexp }) => new RegExp(regexp)) ?? [/.*/];
  }
  const rootMiddleware = middlewareManifest2.middleware["/"];
  if (!rootMiddleware?.matchers)
    return [];
  return rootMiddleware.matchers.map(({ regexp }) => new RegExp(regexp));
}
function escapeRegex(str, { isPath } = {}) {
  const result = str.replaceAll("(.)", "_\xB51_").replaceAll("(..)", "_\xB52_").replaceAll("(...)", "_\xB53_");
  return isPath ? result : result.replaceAll("+", "_\xB54_");
}
function unescapeRegex(str) {
  return str.replaceAll("_\xB51_", "(.)").replaceAll("_\xB52_", "(..)").replaceAll("_\xB53_", "(...)").replaceAll("_\xB54_", "+");
}
function convertBodyToReadableStream(method, body) {
  if (method === "GET" || method === "HEAD")
    return void 0;
  if (!body)
    return void 0;
  return new ReadableStream3({
    start(controller) {
      controller.enqueue(body);
      controller.close();
    }
  });
}
var CommonHeaders;
(function(CommonHeaders2) {
  CommonHeaders2["CACHE_CONTROL"] = "cache-control";
  CommonHeaders2["NEXT_CACHE"] = "x-nextjs-cache";
})(CommonHeaders || (CommonHeaders = {}));
function normalizeLocationHeader(location, baseUrl, encodeQuery = false) {
  if (!URL.canParse(location)) {
    return location;
  }
  const locationURL = new URL(location);
  const origin = new URL(baseUrl).origin;
  let search = locationURL.search;
  if (encodeQuery && search) {
    search = `?${stringifyQs(parseQs(search.slice(1)))}`;
  }
  const href = `${locationURL.origin}${locationURL.pathname}${search}${locationURL.hash}`;
  if (locationURL.origin === origin) {
    return href.slice(origin.length);
  }
  return href;
}

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
import { createHash } from "node:crypto";
init_stream();

// node_modules/@opennextjs/aws/dist/utils/cache.js
init_logger();
async function hasBeenRevalidated(key, tags, cacheEntry) {
  if (globalThis.openNextConfig.dangerous?.disableTagCache) {
    return false;
  }
  const value = cacheEntry.value;
  if (!value) {
    return true;
  }
  if ("type" in cacheEntry && cacheEntry.type === "page") {
    return false;
  }
  const lastModified = cacheEntry.lastModified ?? Date.now();
  if (globalThis.tagCache.mode === "nextMode") {
    return tags.length === 0 ? false : await globalThis.tagCache.hasBeenRevalidated(tags, lastModified);
  }
  const _lastModified = await globalThis.tagCache.getLastModified(key, lastModified);
  return _lastModified === -1;
}
function getTagsFromValue(value) {
  if (!value) {
    return [];
  }
  try {
    const cacheTags = value.meta?.headers?.["x-next-cache-tags"]?.split(",") ?? [];
    delete value.meta?.headers?.["x-next-cache-tags"];
    return cacheTags;
  } catch (e) {
    return [];
  }
}

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
init_logger();
var CACHE_ONE_YEAR = 60 * 60 * 24 * 365;
var CACHE_ONE_MONTH = 60 * 60 * 24 * 30;
var VARY_HEADER = "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch, Next-Url";
var NEXT_SEGMENT_PREFETCH_HEADER = "next-router-segment-prefetch";
var NEXT_PRERENDER_HEADER = "x-nextjs-prerender";
var NEXT_POSTPONED_HEADER = "x-nextjs-postponed";
async function computeCacheControl(path3, body, host, revalidate, lastModified) {
  let finalRevalidate = CACHE_ONE_YEAR;
  const existingRoute = Object.entries(PrerenderManifest?.routes ?? {}).find((p) => p[0] === path3)?.[1];
  if (revalidate === void 0 && existingRoute) {
    finalRevalidate = existingRoute.initialRevalidateSeconds === false ? CACHE_ONE_YEAR : existingRoute.initialRevalidateSeconds;
  } else if (revalidate !== void 0) {
    finalRevalidate = revalidate === false ? CACHE_ONE_YEAR : revalidate;
  }
  const age = Math.round((Date.now() - (lastModified ?? 0)) / 1e3);
  const hash = (str) => createHash("md5").update(str).digest("hex");
  const etag = hash(body);
  if (revalidate === 0) {
    return {
      "cache-control": "private, no-cache, no-store, max-age=0, must-revalidate",
      "x-opennext-cache": "ERROR",
      etag
    };
  }
  if (finalRevalidate !== CACHE_ONE_YEAR) {
    const sMaxAge = Math.max(finalRevalidate - age, 1);
    debug("sMaxAge", {
      finalRevalidate,
      age,
      lastModified,
      revalidate
    });
    const isStale = sMaxAge === 1;
    if (isStale) {
      let url = NextConfig.trailingSlash ? `${path3}/` : path3;
      if (NextConfig.basePath) {
        url = `${NextConfig.basePath}${url}`;
      }
      await globalThis.queue.send({
        MessageBody: {
          host,
          url,
          eTag: etag,
          lastModified: lastModified ?? Date.now()
        },
        MessageDeduplicationId: hash(`${path3}-${lastModified}-${etag}`),
        MessageGroupId: generateMessageGroupId(path3)
      });
    }
    return {
      "cache-control": `s-maxage=${sMaxAge}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
      "x-opennext-cache": isStale ? "STALE" : "HIT",
      etag
    };
  }
  return {
    "cache-control": `s-maxage=${CACHE_ONE_YEAR}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
    "x-opennext-cache": "HIT",
    etag
  };
}
function getBodyForAppRouter(event, cachedValue) {
  if (cachedValue.type !== "app") {
    throw new Error("getBodyForAppRouter called with non-app cache value");
  }
  try {
    const segmentHeader = `${event.headers[NEXT_SEGMENT_PREFETCH_HEADER]}`;
    const isSegmentResponse = Boolean(segmentHeader) && segmentHeader in (cachedValue.segmentData || {});
    const body = isSegmentResponse ? cachedValue.segmentData[segmentHeader] : cachedValue.rsc;
    return {
      body,
      additionalHeaders: isSegmentResponse ? { [NEXT_PRERENDER_HEADER]: "1", [NEXT_POSTPONED_HEADER]: "2" } : {}
    };
  } catch (e) {
    error("Error while getting body for app router from cache:", e);
    return { body: cachedValue.rsc, additionalHeaders: {} };
  }
}
async function generateResult(event, localizedPath, cachedValue, lastModified) {
  debug("Returning result from experimental cache");
  let body = "";
  let type = "application/octet-stream";
  let isDataRequest = false;
  let additionalHeaders = {};
  if (cachedValue.type === "app") {
    isDataRequest = Boolean(event.headers.rsc);
    if (isDataRequest) {
      const { body: appRouterBody, additionalHeaders: appHeaders } = getBodyForAppRouter(event, cachedValue);
      body = appRouterBody;
      additionalHeaders = appHeaders;
    } else {
      body = cachedValue.html;
    }
    type = isDataRequest ? "text/x-component" : "text/html; charset=utf-8";
  } else if (cachedValue.type === "page") {
    isDataRequest = Boolean(event.query.__nextDataReq);
    body = isDataRequest ? JSON.stringify(cachedValue.json) : cachedValue.html;
    type = isDataRequest ? "application/json" : "text/html; charset=utf-8";
  } else {
    throw new Error("generateResult called with unsupported cache value type, only 'app' and 'page' are supported");
  }
  const cacheControl = await computeCacheControl(localizedPath, body, event.headers.host, cachedValue.revalidate, lastModified);
  return {
    type: "core",
    // Sometimes other status codes can be cached, like 404. For these cases, we should return the correct status code
    // Also set the status code to the rewriteStatusCode if defined
    // This can happen in handleMiddleware in routingHandler.
    // `NextResponse.rewrite(url, { status: xxx})
    // The rewrite status code should take precedence over the cached one
    statusCode: event.rewriteStatusCode ?? cachedValue.meta?.status ?? 200,
    body: toReadableStream(body, false),
    isBase64Encoded: false,
    headers: {
      ...cacheControl,
      "content-type": type,
      ...cachedValue.meta?.headers,
      vary: VARY_HEADER,
      ...additionalHeaders
    }
  };
}
function escapePathDelimiters(segment, escapeEncoded) {
  return segment.replace(new RegExp(`([/#?]${escapeEncoded ? "|%(2f|23|3f|5c)" : ""})`, "gi"), (char) => encodeURIComponent(char));
}
function decodePathParams(pathname) {
  return pathname.split("/").map((segment) => {
    try {
      return escapePathDelimiters(decodeURIComponent(segment), true);
    } catch (e) {
      return segment;
    }
  }).join("/");
}
async function cacheInterceptor(event) {
  if (Boolean(event.headers["next-action"]) || Boolean(event.headers["x-prerender-revalidate"]))
    return event;
  const cookies = event.headers.cookie || "";
  const hasPreviewData = cookies.includes("__prerender_bypass") || cookies.includes("__next_preview_data");
  if (hasPreviewData) {
    debug("Preview mode detected, passing through to handler");
    return event;
  }
  let localizedPath = localizePath(event);
  if (NextConfig.basePath) {
    localizedPath = localizedPath.replace(NextConfig.basePath, "");
  }
  localizedPath = localizedPath.replace(/\/$/, "");
  localizedPath = decodePathParams(localizedPath);
  debug("Checking cache for", localizedPath, PrerenderManifest);
  const isISR = Object.keys(PrerenderManifest?.routes ?? {}).includes(localizedPath ?? "/") || Object.values(PrerenderManifest?.dynamicRoutes ?? {}).some((dr) => new RegExp(dr.routeRegex).test(localizedPath));
  debug("isISR", isISR);
  if (isISR) {
    try {
      const cachedData = await globalThis.incrementalCache.get(localizedPath ?? "/index");
      debug("cached data in interceptor", cachedData);
      if (!cachedData?.value) {
        return event;
      }
      if (cachedData.value?.type === "app" || cachedData.value?.type === "route") {
        const tags = getTagsFromValue(cachedData.value);
        const _hasBeenRevalidated = cachedData.shouldBypassTagCache ? false : await hasBeenRevalidated(localizedPath, tags, cachedData);
        if (_hasBeenRevalidated) {
          return event;
        }
      }
      const host = event.headers.host;
      switch (cachedData?.value?.type) {
        case "app":
        case "page":
          return generateResult(event, localizedPath, cachedData.value, cachedData.lastModified);
        case "redirect": {
          const cacheControl = await computeCacheControl(localizedPath, "", host, cachedData.value.revalidate, cachedData.lastModified);
          return {
            type: "core",
            statusCode: cachedData.value.meta?.status ?? 307,
            body: emptyReadableStream(),
            headers: {
              ...cachedData.value.meta?.headers ?? {},
              ...cacheControl
            },
            isBase64Encoded: false
          };
        }
        case "route": {
          const cacheControl = await computeCacheControl(localizedPath, cachedData.value.body, host, cachedData.value.revalidate, cachedData.lastModified);
          const isBinary = isBinaryContentType(String(cachedData.value.meta?.headers?.["content-type"]));
          return {
            type: "core",
            statusCode: event.rewriteStatusCode ?? cachedData.value.meta?.status ?? 200,
            body: toReadableStream(cachedData.value.body, isBinary),
            headers: {
              ...cacheControl,
              ...cachedData.value.meta?.headers,
              vary: VARY_HEADER
            },
            isBase64Encoded: isBinary
          };
        }
        default:
          return event;
      }
    } catch (e) {
      debug("Error while fetching cache", e);
      return event;
    }
  }
  return event;
}

// node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
function parse2(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path3 = "";
  var tryConsume = function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  };
  var mustConsume = function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  };
  var consumeText = function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  };
  var isSafe = function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  };
  var safePattern = function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  };
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path3 += prefix;
        prefix = "";
      }
      if (path3) {
        result.push(path3);
        path3 = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path3 += value;
      continue;
    }
    if (path3) {
      result.push(path3);
      path3 = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
function compile(str, options) {
  return tokensToFunction(parse2(str, options), options);
}
function tokensToFunction(tokens, options) {
  if (options === void 0) {
    options = {};
  }
  var reFlags = flags(options);
  var _a = options.encode, encode = _a === void 0 ? function(x) {
    return x;
  } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
  var matches = tokens.map(function(token) {
    if (typeof token === "object") {
      return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
    }
  });
  return function(data) {
    var path3 = "";
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (typeof token === "string") {
        path3 += token;
        continue;
      }
      var value = data ? data[token.name] : void 0;
      var optional = token.modifier === "?" || token.modifier === "*";
      var repeat = token.modifier === "*" || token.modifier === "+";
      if (Array.isArray(value)) {
        if (!repeat) {
          throw new TypeError('Expected "'.concat(token.name, '" to not repeat, but got an array'));
        }
        if (value.length === 0) {
          if (optional)
            continue;
          throw new TypeError('Expected "'.concat(token.name, '" to not be empty'));
        }
        for (var j = 0; j < value.length; j++) {
          var segment = encode(value[j], token);
          if (validate && !matches[i].test(segment)) {
            throw new TypeError('Expected all "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
          }
          path3 += token.prefix + segment + token.suffix;
        }
        continue;
      }
      if (typeof value === "string" || typeof value === "number") {
        var segment = encode(String(value), token);
        if (validate && !matches[i].test(segment)) {
          throw new TypeError('Expected "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
        }
        path3 += token.prefix + segment + token.suffix;
        continue;
      }
      if (optional)
        continue;
      var typeOfMessage = repeat ? "an array" : "a string";
      throw new TypeError('Expected "'.concat(token.name, '" to be ').concat(typeOfMessage));
    }
    return path3;
  };
}
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path3 = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    };
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path: path3, index, params };
  };
}
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
function regexpToRegexp(path3, keys) {
  if (!keys)
    return path3;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path3.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path3.source);
  }
  return path3;
}
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path3) {
    return pathToRegexp(path3, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
function stringToRegexp(path3, keys, options) {
  return tokensToRegexp(parse2(path3, options), keys, options);
}
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
function pathToRegexp(path3, keys, options) {
  if (path3 instanceof RegExp)
    return regexpToRegexp(path3, keys);
  if (Array.isArray(path3))
    return arrayToRegexp(path3, keys, options);
  return stringToRegexp(path3, keys, options);
}

// node_modules/@opennextjs/aws/dist/utils/normalize-path.js
import path2 from "node:path";
function normalizeRepeatedSlashes(url) {
  const urlNoQuery = url.host + url.pathname;
  return `${url.protocol}//${urlNoQuery.replace(/\\/g, "/").replace(/\/\/+/g, "/")}${url.search}`;
}

// node_modules/@opennextjs/aws/dist/core/routing/matcher.js
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/routeMatcher.js
var optionalLocalePrefixRegex = `^/(?:${RoutesManifest.locales.map((locale) => `${locale}/?`).join("|")})?`;
var optionalBasepathPrefixRegex = RoutesManifest.basePath ? `^${RoutesManifest.basePath}/?` : "^/";
var optionalPrefix = optionalLocalePrefixRegex.replace("^/", optionalBasepathPrefixRegex);
function routeMatcher(routeDefinitions) {
  const regexp = routeDefinitions.map((route) => ({
    page: route.page,
    regexp: new RegExp(route.regex.replace("^/", optionalPrefix))
  }));
  const appPathsSet = /* @__PURE__ */ new Set();
  const routePathsSet = /* @__PURE__ */ new Set();
  for (const [k, v] of Object.entries(AppPathRoutesManifest)) {
    if (k.endsWith("page")) {
      appPathsSet.add(v);
    } else if (k.endsWith("route")) {
      routePathsSet.add(v);
    }
  }
  return function matchRoute(path3) {
    const foundRoutes = regexp.filter((route) => route.regexp.test(path3));
    return foundRoutes.map((foundRoute) => {
      let routeType = "page";
      if (appPathsSet.has(foundRoute.page)) {
        routeType = "app";
      } else if (routePathsSet.has(foundRoute.page)) {
        routeType = "route";
      }
      return {
        route: foundRoute.page,
        type: routeType
      };
    });
  };
}
var staticRouteMatcher = routeMatcher([
  ...RoutesManifest.routes.static,
  ...getStaticAPIRoutes()
]);
var dynamicRouteMatcher = routeMatcher(RoutesManifest.routes.dynamic);
function getStaticAPIRoutes() {
  const createRouteDefinition = (route) => ({
    page: route,
    regex: `^${route}(?:/)?$`
  });
  const dynamicRoutePages = new Set(RoutesManifest.routes.dynamic.map(({ page }) => page));
  const pagesStaticAPIRoutes = Object.keys(PagesManifest).filter((route) => route.startsWith("/api/") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  const appPathsStaticAPIRoutes = Object.values(AppPathRoutesManifest).filter((route) => (route.startsWith("/api/") || route === "/api") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  return [...pagesStaticAPIRoutes, ...appPathsStaticAPIRoutes];
}

// node_modules/@opennextjs/aws/dist/core/routing/matcher.js
var routeHasMatcher = (headers, cookies, query) => (redirect) => {
  switch (redirect.type) {
    case "header":
      return !!headers?.[redirect.key.toLowerCase()] && new RegExp(redirect.value ?? "").test(headers[redirect.key.toLowerCase()] ?? "");
    case "cookie":
      return !!cookies?.[redirect.key] && new RegExp(redirect.value ?? "").test(cookies[redirect.key] ?? "");
    case "query":
      return query[redirect.key] && Array.isArray(redirect.value) ? redirect.value.reduce((prev, current) => prev || new RegExp(current).test(query[redirect.key]), false) : new RegExp(redirect.value ?? "").test(query[redirect.key] ?? "");
    case "host":
      return headers?.host !== "" && new RegExp(redirect.value ?? "").test(headers.host);
    default:
      return false;
  }
};
function checkHas(matcher, has, inverted = false) {
  return has ? has.reduce((acc, cur) => {
    if (acc === false)
      return false;
    return inverted ? !matcher(cur) : matcher(cur);
  }, true) : true;
}
var getParamsFromSource = (source) => (value) => {
  debug("value", value);
  const _match = source(value);
  return _match ? _match.params : {};
};
var computeParamHas = (headers, cookies, query) => (has) => {
  if (!has.value)
    return {};
  const matcher = new RegExp(`^${has.value}$`);
  const fromSource = (value) => {
    const matches = value.match(matcher);
    return matches?.groups ?? {};
  };
  switch (has.type) {
    case "header":
      return fromSource(headers[has.key.toLowerCase()] ?? "");
    case "cookie":
      return fromSource(cookies[has.key] ?? "");
    case "query":
      return Array.isArray(query[has.key]) ? fromSource(query[has.key].join(",")) : fromSource(query[has.key] ?? "");
    case "host":
      return fromSource(headers.host ?? "");
  }
};
function convertMatch(match2, toDestination, destination) {
  if (!match2) {
    return destination;
  }
  const { params } = match2;
  const isUsingParams = Object.keys(params).length > 0;
  return isUsingParams ? toDestination(params) : destination;
}
function getNextConfigHeaders(event, configHeaders) {
  if (!configHeaders) {
    return {};
  }
  const matcher = routeHasMatcher(event.headers, event.cookies, event.query);
  const requestHeaders = {};
  const localizedRawPath = localizePath(event);
  for (const { headers, has, missing, regex, source, locale } of configHeaders) {
    const path3 = locale === false ? event.rawPath : localizedRawPath;
    if (new RegExp(regex).test(path3) && checkHas(matcher, has) && checkHas(matcher, missing, true)) {
      const fromSource = match(source);
      const _match = fromSource(path3);
      headers.forEach((h) => {
        try {
          const key = convertMatch(_match, compile(h.key), h.key);
          const value = convertMatch(_match, compile(h.value), h.value);
          requestHeaders[key] = value;
        } catch {
          debug(`Error matching header ${h.key} with value ${h.value}`);
          requestHeaders[h.key] = h.value;
        }
      });
    }
  }
  return requestHeaders;
}
function handleRewrites(event, rewrites) {
  const { rawPath, headers, query, cookies, url } = event;
  const localizedRawPath = localizePath(event);
  const matcher = routeHasMatcher(headers, cookies, query);
  const computeHas = computeParamHas(headers, cookies, query);
  const rewrite = rewrites.find((route) => {
    const path3 = route.locale === false ? rawPath : localizedRawPath;
    return new RegExp(route.regex).test(path3) && checkHas(matcher, route.has) && checkHas(matcher, route.missing, true);
  });
  let finalQuery = query;
  let rewrittenUrl = url;
  const isExternalRewrite = isExternal(rewrite?.destination);
  debug("isExternalRewrite", isExternalRewrite);
  if (rewrite) {
    const { pathname, protocol, hostname, queryString } = getUrlParts(rewrite.destination, isExternalRewrite);
    const pathToUse = rewrite.locale === false ? rawPath : localizedRawPath;
    debug("urlParts", { pathname, protocol, hostname, queryString });
    const toDestinationPath = compile(escapeRegex(pathname, { isPath: true }));
    const toDestinationHost = compile(escapeRegex(hostname));
    const toDestinationQuery = compile(escapeRegex(queryString));
    const params = {
      // params for the source
      ...getParamsFromSource(match(escapeRegex(rewrite.source, { isPath: true })))(pathToUse),
      // params for the has
      ...rewrite.has?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {}),
      // params for the missing
      ...rewrite.missing?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {})
    };
    const isUsingParams = Object.keys(params).length > 0;
    let rewrittenQuery = queryString;
    let rewrittenHost = hostname;
    let rewrittenPath = pathname;
    if (isUsingParams) {
      rewrittenPath = unescapeRegex(toDestinationPath(params));
      rewrittenHost = unescapeRegex(toDestinationHost(params));
      rewrittenQuery = unescapeRegex(toDestinationQuery(params));
    }
    if (NextConfig.i18n && !isExternalRewrite) {
      const strippedPathLocale = rewrittenPath.replace(new RegExp(`^/(${NextConfig.i18n.locales.join("|")})`), "");
      if (strippedPathLocale.startsWith("/api/")) {
        rewrittenPath = strippedPathLocale;
      }
    }
    rewrittenUrl = isExternalRewrite ? `${protocol}//${rewrittenHost}${rewrittenPath}` : new URL(rewrittenPath, event.url).href;
    finalQuery = {
      ...query,
      ...convertFromQueryString(rewrittenQuery)
    };
    rewrittenUrl += convertToQueryString(finalQuery);
    debug("rewrittenUrl", { rewrittenUrl, finalQuery, isUsingParams });
  }
  return {
    internalEvent: {
      ...event,
      query: finalQuery,
      rawPath: new URL(rewrittenUrl).pathname,
      url: rewrittenUrl
    },
    __rewrite: rewrite,
    isExternalRewrite
  };
}
function handleRepeatedSlashRedirect(event) {
  if (event.rawPath.match(/(\\|\/\/)/)) {
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: normalizeRepeatedSlashes(new URL(event.url))
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}
function handleTrailingSlashRedirect(event) {
  const url = new URL(event.rawPath, "http://localhost");
  if (
    // Someone is trying to redirect to a different origin, let's not do that
    url.host !== "localhost" || NextConfig.skipTrailingSlashRedirect || // We should not apply trailing slash redirect to API routes
    event.rawPath.startsWith("/api/")
  ) {
    return false;
  }
  const emptyBody = emptyReadableStream();
  if (NextConfig.trailingSlash && !event.headers["x-nextjs-data"] && !event.rawPath.endsWith("/") && !event.rawPath.match(/[\w-]+\.[\w]+$/g)) {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0]}/${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  if (!NextConfig.trailingSlash && event.rawPath.endsWith("/") && event.rawPath !== "/") {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0].replace(/\/$/, "")}${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  return false;
}
function handleRedirects(event, redirects) {
  const repeatedSlashRedirect = handleRepeatedSlashRedirect(event);
  if (repeatedSlashRedirect)
    return repeatedSlashRedirect;
  const trailingSlashRedirect = handleTrailingSlashRedirect(event);
  if (trailingSlashRedirect)
    return trailingSlashRedirect;
  const localeRedirect = handleLocaleRedirect(event);
  if (localeRedirect)
    return localeRedirect;
  const { internalEvent, __rewrite } = handleRewrites(event, redirects.filter((r) => !r.internal));
  if (__rewrite && !__rewrite.internal) {
    return {
      type: event.type,
      statusCode: __rewrite.statusCode ?? 308,
      headers: {
        Location: internalEvent.url
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
}
function fixDataPage(internalEvent, buildId) {
  const { rawPath, query } = internalEvent;
  const basePath = NextConfig.basePath ?? "";
  const dataPattern = `${basePath}/_next/data/${buildId}`;
  if (rawPath.startsWith("/_next/data") && !rawPath.startsWith(dataPattern)) {
    return {
      type: internalEvent.type,
      statusCode: 404,
      body: toReadableStream("{}"),
      headers: {
        "Content-Type": "application/json"
      },
      isBase64Encoded: false
    };
  }
  if (rawPath.startsWith(dataPattern) && rawPath.endsWith(".json")) {
    const newPath = `${basePath}${rawPath.slice(dataPattern.length, -".json".length).replace(/^\/index$/, "/")}`;
    query.__nextDataReq = "1";
    return {
      ...internalEvent,
      rawPath: newPath,
      query,
      url: new URL(`${newPath}${convertToQueryString(query)}`, internalEvent.url).href
    };
  }
  return internalEvent;
}
function handleFallbackFalse(internalEvent, prerenderManifest) {
  const { rawPath } = internalEvent;
  const { dynamicRoutes = {}, routes = {} } = prerenderManifest ?? {};
  const prerenderedFallbackRoutes = Object.entries(dynamicRoutes).filter(([, { fallback }]) => fallback === false);
  const routeFallback = prerenderedFallbackRoutes.some(([, { routeRegex }]) => {
    const routeRegexExp = new RegExp(routeRegex);
    return routeRegexExp.test(rawPath);
  });
  const locales = NextConfig.i18n?.locales;
  const routesAlreadyHaveLocale = locales?.includes(rawPath.split("/")[1]) || // If we don't use locales, we don't need to add the default locale
  locales === void 0;
  let localizedPath = routesAlreadyHaveLocale ? rawPath : `/${NextConfig.i18n?.defaultLocale}${rawPath}`;
  if (
    // Not if localizedPath is "/" tho, because that would not make it find `isPregenerated` below since it would be try to match an empty string.
    localizedPath !== "/" && NextConfig.trailingSlash && localizedPath.endsWith("/")
  ) {
    localizedPath = localizedPath.slice(0, -1);
  }
  const matchedStaticRoute = staticRouteMatcher(localizedPath);
  const prerenderedFallbackRoutesName = prerenderedFallbackRoutes.map(([name]) => name);
  const matchedDynamicRoute = dynamicRouteMatcher(localizedPath).filter(({ route }) => !prerenderedFallbackRoutesName.includes(route));
  const isPregenerated = Object.keys(routes).includes(localizedPath);
  if (routeFallback && !isPregenerated && matchedStaticRoute.length === 0 && matchedDynamicRoute.length === 0) {
    return {
      event: {
        ...internalEvent,
        rawPath: "/404",
        url: constructNextUrl(internalEvent.url, "/404"),
        headers: {
          ...internalEvent.headers,
          "x-invoke-status": "404"
        }
      },
      isISR: false
    };
  }
  return {
    event: internalEvent,
    isISR: routeFallback || isPregenerated
  };
}

// node_modules/@opennextjs/aws/dist/core/routing/middleware.js
init_stream();
init_utils();
var middlewareManifest = MiddlewareManifest;
var functionsConfigManifest = FunctionsConfigManifest;
var middleMatch = getMiddlewareMatch(middlewareManifest, functionsConfigManifest);
var REDIRECTS = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function defaultMiddlewareLoader() {
  return Promise.resolve().then(() => (init_edgeFunctionHandler(), edgeFunctionHandler_exports));
}
async function handleMiddleware(internalEvent, initialSearch, middlewareLoader = defaultMiddlewareLoader) {
  const headers = internalEvent.headers;
  if (headers["x-isr"] && headers["x-prerender-revalidate"] === PrerenderManifest?.preview?.previewModeId)
    return internalEvent;
  const normalizedPath = localizePath(internalEvent);
  const hasMatch = middleMatch.some((r) => r.test(normalizedPath));
  if (!hasMatch)
    return internalEvent;
  const initialUrl = new URL(normalizedPath, internalEvent.url);
  initialUrl.search = initialSearch;
  const url = initialUrl.href;
  const middleware = await middlewareLoader();
  const result = await middleware.default({
    // `geo` is pre Next 15.
    geo: {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: decodeURIComponent(headers["x-open-next-city"]),
      country: headers["x-open-next-country"],
      region: headers["x-open-next-region"],
      latitude: headers["x-open-next-latitude"],
      longitude: headers["x-open-next-longitude"]
    },
    headers,
    method: internalEvent.method || "GET",
    nextConfig: {
      basePath: NextConfig.basePath,
      i18n: NextConfig.i18n,
      trailingSlash: NextConfig.trailingSlash
    },
    url,
    body: convertBodyToReadableStream(internalEvent.method, internalEvent.body)
  });
  const statusCode = result.status;
  const responseHeaders = result.headers;
  const reqHeaders = {};
  const resHeaders = {};
  const filteredHeaders = [
    "x-middleware-override-headers",
    "x-middleware-next",
    "x-middleware-rewrite",
    // We need to drop `content-encoding` because it will be decoded
    "content-encoding"
  ];
  const xMiddlewareKey = "x-middleware-request-";
  responseHeaders.forEach((value, key) => {
    if (key.startsWith(xMiddlewareKey)) {
      const k = key.substring(xMiddlewareKey.length);
      reqHeaders[k] = value;
    } else {
      if (filteredHeaders.includes(key.toLowerCase()))
        return;
      if (key.toLowerCase() === "set-cookie") {
        resHeaders[key] = resHeaders[key] ? [...resHeaders[key], value] : [value];
      } else if (REDIRECTS.has(statusCode) && key.toLowerCase() === "location") {
        resHeaders[key] = normalizeLocationHeader(value, internalEvent.url);
      } else {
        resHeaders[key] = value;
      }
    }
  });
  const rewriteUrl = responseHeaders.get("x-middleware-rewrite");
  let isExternalRewrite = false;
  let middlewareQuery = internalEvent.query;
  let newUrl = internalEvent.url;
  if (rewriteUrl) {
    newUrl = rewriteUrl;
    if (isExternal(newUrl, internalEvent.headers.host)) {
      isExternalRewrite = true;
    } else {
      const rewriteUrlObject = new URL(rewriteUrl);
      middlewareQuery = getQueryFromSearchParams(rewriteUrlObject.searchParams);
      if ("__nextDataReq" in internalEvent.query) {
        middlewareQuery.__nextDataReq = internalEvent.query.__nextDataReq;
      }
    }
  }
  if (!rewriteUrl && !responseHeaders.get("x-middleware-next")) {
    const body = result.body ?? emptyReadableStream();
    return {
      type: internalEvent.type,
      statusCode,
      headers: resHeaders,
      body,
      isBase64Encoded: false
    };
  }
  return {
    responseHeaders: resHeaders,
    url: newUrl,
    rawPath: new URL(newUrl).pathname,
    type: internalEvent.type,
    headers: { ...internalEvent.headers, ...reqHeaders },
    body: internalEvent.body,
    method: internalEvent.method,
    query: middlewareQuery,
    cookies: internalEvent.cookies,
    remoteAddress: internalEvent.remoteAddress,
    isExternalRewrite,
    rewriteStatusCode: rewriteUrl && !isExternalRewrite ? statusCode : void 0
  };
}

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
var MIDDLEWARE_HEADER_PREFIX = "x-middleware-response-";
var MIDDLEWARE_HEADER_PREFIX_LEN = MIDDLEWARE_HEADER_PREFIX.length;
var INTERNAL_HEADER_PREFIX = "x-opennext-";
var INTERNAL_HEADER_INITIAL_URL = `${INTERNAL_HEADER_PREFIX}initial-url`;
var INTERNAL_HEADER_LOCALE = `${INTERNAL_HEADER_PREFIX}locale`;
var INTERNAL_HEADER_RESOLVED_ROUTES = `${INTERNAL_HEADER_PREFIX}resolved-routes`;
var INTERNAL_HEADER_REWRITE_STATUS_CODE = `${INTERNAL_HEADER_PREFIX}rewrite-status-code`;
var INTERNAL_EVENT_REQUEST_ID = `${INTERNAL_HEADER_PREFIX}request-id`;
var geoHeaderToNextHeader = {
  "x-open-next-city": "x-vercel-ip-city",
  "x-open-next-country": "x-vercel-ip-country",
  "x-open-next-region": "x-vercel-ip-country-region",
  "x-open-next-latitude": "x-vercel-ip-latitude",
  "x-open-next-longitude": "x-vercel-ip-longitude"
};
function applyMiddlewareHeaders(eventOrResult, middlewareHeaders) {
  const isResult = isInternalResult(eventOrResult);
  const headers = eventOrResult.headers;
  const keyPrefix = isResult ? "" : MIDDLEWARE_HEADER_PREFIX;
  Object.entries(middlewareHeaders).forEach(([key, value]) => {
    if (value) {
      headers[keyPrefix + key] = Array.isArray(value) ? value.join(",") : value;
    }
  });
}
async function routingHandler(event, { assetResolver }) {
  try {
    for (const [openNextGeoName, nextGeoName] of Object.entries(geoHeaderToNextHeader)) {
      const value = event.headers[openNextGeoName];
      if (value) {
        event.headers[nextGeoName] = value;
      }
    }
    for (const key of Object.keys(event.headers)) {
      if (key.startsWith(INTERNAL_HEADER_PREFIX) || key.startsWith(MIDDLEWARE_HEADER_PREFIX)) {
        delete event.headers[key];
      }
    }
    let headers = getNextConfigHeaders(event, ConfigHeaders);
    let eventOrResult = fixDataPage(event, BuildId);
    if (isInternalResult(eventOrResult)) {
      return eventOrResult;
    }
    const redirect = handleRedirects(eventOrResult, RoutesManifest.redirects);
    if (redirect) {
      redirect.headers.Location = normalizeLocationHeader(redirect.headers.Location, event.url, true);
      debug("redirect", redirect);
      return redirect;
    }
    const middlewareEventOrResult = await handleMiddleware(
      eventOrResult,
      // We need to pass the initial search without any decoding
      // TODO: we'd need to refactor InternalEvent to include the initial querystring directly
      // Should be done in another PR because it is a breaking change
      new URL(event.url).search
    );
    if (isInternalResult(middlewareEventOrResult)) {
      return middlewareEventOrResult;
    }
    const middlewareHeadersPrioritized = globalThis.openNextConfig.dangerous?.middlewareHeadersOverrideNextConfigHeaders ?? false;
    if (middlewareHeadersPrioritized) {
      headers = {
        ...headers,
        ...middlewareEventOrResult.responseHeaders
      };
    } else {
      headers = {
        ...middlewareEventOrResult.responseHeaders,
        ...headers
      };
    }
    let isExternalRewrite = middlewareEventOrResult.isExternalRewrite ?? false;
    eventOrResult = middlewareEventOrResult;
    if (!isExternalRewrite) {
      const beforeRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.beforeFiles);
      eventOrResult = beforeRewrite.internalEvent;
      isExternalRewrite = beforeRewrite.isExternalRewrite;
      if (!isExternalRewrite) {
        const assetResult = await assetResolver?.maybeGetAssetResult?.(eventOrResult);
        if (assetResult) {
          applyMiddlewareHeaders(assetResult, headers);
          return assetResult;
        }
      }
    }
    const foundStaticRoute = staticRouteMatcher(eventOrResult.rawPath);
    const isStaticRoute = !isExternalRewrite && foundStaticRoute.length > 0;
    if (!(isStaticRoute || isExternalRewrite)) {
      const afterRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.afterFiles);
      eventOrResult = afterRewrite.internalEvent;
      isExternalRewrite = afterRewrite.isExternalRewrite;
    }
    let isISR = false;
    if (!isExternalRewrite) {
      const fallbackResult = handleFallbackFalse(eventOrResult, PrerenderManifest);
      eventOrResult = fallbackResult.event;
      isISR = fallbackResult.isISR;
    }
    const foundDynamicRoute = dynamicRouteMatcher(eventOrResult.rawPath);
    const isDynamicRoute = !isExternalRewrite && foundDynamicRoute.length > 0;
    if (!(isDynamicRoute || isStaticRoute || isExternalRewrite)) {
      const fallbackRewrites = handleRewrites(eventOrResult, RoutesManifest.rewrites.fallback);
      eventOrResult = fallbackRewrites.internalEvent;
      isExternalRewrite = fallbackRewrites.isExternalRewrite;
    }
    const isNextImageRoute = eventOrResult.rawPath.startsWith("/_next/image");
    const isRouteFoundBeforeAllRewrites = isStaticRoute || isDynamicRoute || isExternalRewrite;
    if (!(isRouteFoundBeforeAllRewrites || isNextImageRoute || // We need to check again once all rewrites have been applied
    staticRouteMatcher(eventOrResult.rawPath).length > 0 || dynamicRouteMatcher(eventOrResult.rawPath).length > 0)) {
      eventOrResult = {
        ...eventOrResult,
        rawPath: "/404",
        url: constructNextUrl(eventOrResult.url, "/404"),
        headers: {
          ...eventOrResult.headers,
          "x-middleware-response-cache-control": "private, no-cache, no-store, max-age=0, must-revalidate"
        }
      };
    }
    if (globalThis.openNextConfig.dangerous?.enableCacheInterception && !isInternalResult(eventOrResult)) {
      debug("Cache interception enabled");
      eventOrResult = await cacheInterceptor(eventOrResult);
      if (isInternalResult(eventOrResult)) {
        applyMiddlewareHeaders(eventOrResult, headers);
        return eventOrResult;
      }
    }
    applyMiddlewareHeaders(eventOrResult, headers);
    const resolvedRoutes = [
      ...foundStaticRoute,
      ...foundDynamicRoute
    ];
    debug("resolvedRoutes", resolvedRoutes);
    return {
      internalEvent: eventOrResult,
      isExternalRewrite,
      origin: false,
      isISR,
      resolvedRoutes,
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(eventOrResult, NextConfig.i18n) : void 0,
      rewriteStatusCode: middlewareEventOrResult.rewriteStatusCode
    };
  } catch (e) {
    error("Error in routingHandler", e);
    return {
      internalEvent: {
        type: "core",
        method: "GET",
        rawPath: "/500",
        url: constructNextUrl(event.url, "/500"),
        headers: {
          ...event.headers
        },
        query: event.query,
        cookies: event.cookies,
        remoteAddress: event.remoteAddress
      },
      isExternalRewrite: false,
      origin: false,
      isISR: false,
      resolvedRoutes: [],
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(event, NextConfig.i18n) : void 0
    };
  }
}
function isInternalResult(eventOrResult) {
  return eventOrResult != null && "statusCode" in eventOrResult;
}

// node_modules/@opennextjs/aws/dist/adapters/middleware.js
globalThis.internalFetch = fetch;
globalThis.__openNextAls = new AsyncLocalStorage();
var defaultHandler = async (internalEvent, options) => {
  const middlewareConfig = globalThis.openNextConfig.middleware;
  const originResolver = await resolveOriginResolver(middlewareConfig?.originResolver);
  const externalRequestProxy = await resolveProxyRequest(middlewareConfig?.override?.proxyExternalRequest);
  const assetResolver = await resolveAssetResolver(middlewareConfig?.assetResolver);
  const requestId = Math.random().toString(36);
  return runWithOpenNextRequestContext({
    isISRRevalidation: internalEvent.headers["x-isr"] === "1",
    waitUntil: options?.waitUntil,
    requestId
  }, async () => {
    const result = await routingHandler(internalEvent, { assetResolver });
    if ("internalEvent" in result) {
      debug("Middleware intercepted event", internalEvent);
      if (!result.isExternalRewrite) {
        const origin = await originResolver.resolve(result.internalEvent.rawPath);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_HEADER_INITIAL_URL]: internalEvent.url,
              [INTERNAL_HEADER_RESOLVED_ROUTES]: JSON.stringify(result.resolvedRoutes),
              [INTERNAL_EVENT_REQUEST_ID]: requestId,
              [INTERNAL_HEADER_REWRITE_STATUS_CODE]: String(result.rewriteStatusCode)
            }
          },
          isExternalRewrite: result.isExternalRewrite,
          origin,
          isISR: result.isISR,
          initialURL: result.initialURL,
          resolvedRoutes: result.resolvedRoutes
        };
      }
      try {
        return externalRequestProxy.proxy(result.internalEvent);
      } catch (e) {
        error("External request failed.", e);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_EVENT_REQUEST_ID]: requestId
            },
            rawPath: "/500",
            url: constructNextUrl(result.internalEvent.url, "/500"),
            method: "GET"
          },
          // On error we need to rewrite to the 500 page which is an internal rewrite
          isExternalRewrite: false,
          origin: false,
          isISR: result.isISR,
          initialURL: result.internalEvent.url,
          resolvedRoutes: [{ route: "/500", type: "page" }]
        };
      }
    }
    if (process.env.OPEN_NEXT_REQUEST_ID_HEADER || globalThis.openNextDebug) {
      result.headers[INTERNAL_EVENT_REQUEST_ID] = requestId;
    }
    debug("Middleware response", result);
    return result;
  });
};
var handler2 = await createGenericHandler({
  handler: defaultHandler,
  type: "middleware"
});
var middleware_default = {
  fetch: handler2
};
export {
  middleware_default as default,
  handler2 as handler
};
