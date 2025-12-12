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
"[project]/app/api/bookings/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
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
            const bookingsPath = getFilePath('bookings.json');
            if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(bookingsPath)) {
                return Response.json({
                    data: []
                });
            }
            const bookings = JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(bookingsPath, 'utf-8') || '[]');
            return Response.json({
                data: bookings
            });
        }
        return Response.json({
            error: 'Invalid action'
        }, {
            status: 400
        });
    } catch (error) {
        console.error('Booking fetch error:', error);
        return Response.json({
            error: 'Failed to fetch bookings'
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
            // Validate required fields
            const required = [
                'customer_id',
                'accommodation_id',
                'check_in',
                'check_out',
                'guests',
                'total_price'
            ];
            for (const field of required){
                if (!body[field]) {
                    return Response.json({
                        error: `${field} is required`
                    }, {
                        status: 400
                    });
                }
            }
            const bookingsPath = getFilePath('bookings.json');
            let bookings = [];
            if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(bookingsPath)) {
                const content = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(bookingsPath, 'utf-8');
                bookings = JSON.parse(content || '[]');
            }
            // Generate booking ID and number
            const bookingNumber = `BK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
            const bookingId = bookings.length > 0 ? Math.max(...bookings.map((b)=>b.id || 0)) + 1 : 1;
            const newBooking = {
                id: bookingId,
                booking_number: bookingNumber,
                customer_id: parseInt(body.customer_id),
                accommodation_id: parseInt(body.accommodation_id),
                check_in: body.check_in,
                check_out: body.check_out,
                guests: parseInt(body.guests),
                total_price: parseFloat(body.total_price),
                status: 'confirmed',
                created_at: new Date().toISOString(),
                notes: body.notes || ''
            };
            bookings.push(newBooking);
            // Save bookings
            __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(bookingsPath, JSON.stringify(bookings, null, 2));
            return Response.json({
                success: true,
                ...newBooking
            });
        }
        return Response.json({
            error: 'Invalid action'
        }, {
            status: 400
        });
    } catch (error) {
        console.error('Booking error:', error);
        return Response.json({
            error: 'Failed to create booking'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__668022a2._.js.map