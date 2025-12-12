module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/app/api/customers/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
const getFilePath = (filename)=>__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'data', filename);
const ensureDir = ()=>{
    const dir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'data');
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(dir)) {
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(dir, {
            recursive: true
        });
    }
};
async function GET(request) {
    try {
        ensureDir();
        const searchParams = new URL(request.url).searchParams;
        const action = searchParams.get('action');
        if (action === 'list') {
            const customersPath = getFilePath('customers.json');
            if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(customersPath)) {
                return Response.json({
                    data: []
                });
            }
            const customers = JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(customersPath, 'utf-8') || '[]');
            return Response.json({
                data: customers
            });
        }
        if (action === 'search') {
            const term = searchParams.get('term') || '';
            if (term.length < 2) {
                return Response.json({
                    data: []
                });
            }
            const customersPath = getFilePath('customers.json');
            if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(customersPath)) {
                return Response.json({
                    data: []
                });
            }
            const customers = JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(customersPath, 'utf-8') || '[]');
            const lowerTerm = term.toLowerCase();
            const results = customers.filter((c)=>c.first_name?.toLowerCase().includes(lowerTerm) || c.last_name?.toLowerCase().includes(lowerTerm) || c.email?.toLowerCase().includes(lowerTerm) || c.phone?.includes(term));
            return Response.json({
                data: results.slice(0, 10)
            });
        }
        return Response.json({
            error: 'Invalid action'
        }, {
            status: 400
        });
    } catch (error) {
        console.error('Customer error:', error);
        return Response.json({
            error: 'Failed to fetch customers'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        ensureDir();
        const searchParams = new URL(request.url).searchParams;
        const action = searchParams.get('action');
        if (action === 'create') {
            const body = await request.json();
            const customersPath = getFilePath('customers.json');
            let customers = [];
            if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(customersPath)) {
                customers = JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(customersPath, 'utf-8') || '[]');
            }
            const customerId = customers.length > 0 ? Math.max(...customers.map((c)=>c.id || 0)) + 1 : 1;
            const newCustomer = {
                id: customerId,
                first_name: body.first_name || '',
                last_name: body.last_name || '',
                email: body.email || '',
                phone: body.phone || '',
                address: body.address || '',
                created_at: new Date().toISOString()
            };
            customers.push(newCustomer);
            __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(customersPath, JSON.stringify(customers, null, 2));
            return Response.json({
                success: true,
                ...newCustomer
            });
        }
        return Response.json({
            error: 'Invalid action'
        }, {
            status: 400
        });
    } catch (error) {
        console.error('Customer create error:', error);
        return Response.json({
            error: 'Failed to create customer'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4d418fb2._.js.map