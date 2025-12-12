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
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/process [external] (process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/timers [external] (timers, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("timers", () => require("timers"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/string_decoder [external] (string_decoder, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("string_decoder", () => require("string_decoder"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[project]/lib/db.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getConnection",
    ()=>getConnection,
    "query",
    ()=>query
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mysql2/promise.js [app-route] (ecmascript)");
;
let pool = null;
async function getConnection() {
    if (!pool) {
        pool = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createPool({
            host: process.env.DB_HOST || '127.0.0.1',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || '',
            database: process.env.DB_NAME || 'sisoy_booking',
            port: parseInt(process.env.DB_PORT || '3306'),
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }
    return pool;
}
async function query(sql, values = []) {
    const pool = await getConnection();
    const connection = await pool.getConnection();
    try {
        const [results] = await connection.execute(sql, values);
        return results;
    } finally{
        connection.release();
    }
}
}),
"[project]/app/api/customers/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.js [app-route] (ecmascript)");
;
async function GET(request) {
    try {
        const searchParams = new URL(request.url).searchParams;
        const action = searchParams.get('action');
        if (action === 'list') {
            const results = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('SELECT * FROM customers ORDER BY created_at DESC');
            return Response.json({
                data: results
            });
        }
        if (action === 'search') {
            const term = searchParams.get('term') || '';
            if (term.length < 2) {
                return Response.json({
                    data: []
                });
            }
            const searchTerm = `%${term}%`;
            const results = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`SELECT * FROM customers 
         WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone LIKE ?
         LIMIT 10`, [
                searchTerm,
                searchTerm,
                searchTerm,
                searchTerm
            ]);
            return Response.json({
                data: results
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
            error: 'Failed to fetch customers: ' + error.message
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const searchParams = new URL(request.url).searchParams;
        const action = searchParams.get('action');
        if (action === 'create') {
            const body = await request.json();
            const results = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`INSERT INTO customers (first_name, last_name, email, phone, address) 
         VALUES (?, ?, ?, ?, ?)`, [
                body.first_name || '',
                body.last_name || '',
                body.email || '',
                body.phone || '',
                body.address || ''
            ]);
            // Fetch the newly created customer
            const newCustomer = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('SELECT * FROM customers WHERE id = ?', [
                results.insertId
            ]);
            return Response.json({
                success: true,
                id: results.insertId,
                ...newCustomer[0]
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
            error: 'Failed to create customer: ' + error.message
        }, {
            status: 500
        });
    }
}
async function PATCH(request) {
    try {
        const searchParams = new URL(request.url).searchParams;
        const id = searchParams.get('id');
        if (!id) {
            return Response.json({
                error: 'id is required'
            }, {
                status: 400
            });
        }
        const body = await request.json();
        const updates = [];
        const values = [];
        // Build dynamic UPDATE statement
        const allowedFields = [
            'first_name',
            'last_name',
            'email',
            'phone',
            'address'
        ];
        for (const field of allowedFields){
            if (body[field] !== undefined && body[field] !== null) {
                updates.push(`${field} = ?`);
                values.push(body[field]);
            }
        }
        if (updates.length === 0) {
            return Response.json({
                error: 'No fields to update'
            }, {
                status: 400
            });
        }
        values.push(parseInt(id));
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`UPDATE customers SET ${updates.join(', ')} WHERE id = ?`, values);
        // Fetch updated customer
        const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('SELECT * FROM customers WHERE id = ?', [
            parseInt(id)
        ]);
        return Response.json({
            success: true,
            ...updated[0]
        });
    } catch (error) {
        console.error('Customer update error:', error);
        return Response.json({
            error: 'Failed to update customer: ' + error.message
        }, {
            status: 500
        });
    }
}
async function DELETE(request) {
    try {
        const searchParams = new URL(request.url).searchParams;
        const id = searchParams.get('id');
        if (!id) {
            return Response.json({
                error: 'id is required'
            }, {
                status: 400
            });
        }
        const customerId = parseInt(id);
        // Fetch customer before deleting
        const existing = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('SELECT * FROM customers WHERE id = ?', [
            customerId
        ]);
        if (!existing || existing.length === 0) {
            return Response.json({
                error: 'Customer not found'
            }, {
                status: 404
            });
        }
        // Check if customer has active bookings
        const activeBookings = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('SELECT COUNT(*) as count FROM bookings WHERE customer_id = ? AND status IN ("pending", "confirmed")', [
            customerId
        ]);
        if (activeBookings[0].count > 0) {
            return Response.json({
                error: `Cannot delete customer with active bookings (${activeBookings[0].count} found)`
            }, {
                status: 409
            });
        }
        // Delete customer (and related transactions will cascade if foreign key set)
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('DELETE FROM customers WHERE id = ?', [
            customerId
        ]);
        return Response.json({
            success: true,
            message: `Customer ${customerId} deleted successfully`,
            deleted_id: customerId
        });
    } catch (error) {
        console.error('Customer delete error:', error);
        return Response.json({
            error: 'Failed to delete customer: ' + error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c296de5d._.js.map