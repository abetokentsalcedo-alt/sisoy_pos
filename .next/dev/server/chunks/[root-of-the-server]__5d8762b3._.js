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
"[project]/app/api/transactions/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
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
        const id = searchParams.get('id');
        if (action === 'list') {
            const results = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`
        SELECT * FROM transactions 
        ORDER BY id DESC
      `);
            return Response.json({
                data: results
            });
        }
        if (action === 'get' && id) {
            const results = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('SELECT * FROM transactions WHERE id = ?', [
                id
            ]);
            return Response.json(results[0] || null);
        }
        return Response.json({
            error: 'Invalid action'
        }, {
            status: 400
        });
    } catch (error) {
        console.error('Transaction fetch error:', error);
        return Response.json({
            error: 'Failed to fetch transactions: ' + error.message
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
            const required = [
                'booking_id',
                'customer_id',
                'amount',
                'payment_method'
            ];
            for (const field of required){
                if (body[field] === undefined || body[field] === null) {
                    return Response.json({
                        error: `${field} is required`
                    }, {
                        status: 400
                    });
                }
            }
            const results = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`INSERT INTO transactions (booking_id, customer_id, amount, payment_method, status, transaction_reference, description) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`, [
                parseInt(body.booking_id),
                parseInt(body.customer_id),
                parseFloat(body.amount),
                body.payment_method,
                body.status || 'completed',
                body.transaction_reference || `TXN-${Date.now()}`,
                body.description || ''
            ]);
            const newTransaction = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('SELECT * FROM transactions WHERE id = ?', [
                results.insertId
            ]);
            return Response.json({
                success: true,
                id: results.insertId,
                ...newTransaction[0]
            });
        }
        return Response.json({
            error: 'Invalid action'
        }, {
            status: 400
        });
    } catch (error) {
        console.error('Transaction create error:', error);
        return Response.json({
            error: 'Failed to create transaction: ' + error.message
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
            'amount',
            'payment_method',
            'status',
            'transaction_reference',
            'description'
        ];
        for (const field of allowedFields){
            if (body[field] !== undefined && body[field] !== null) {
                updates.push(`${field} = ?`);
                values.push(field === 'amount' ? parseFloat(body[field]) : body[field]);
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
        const results = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`UPDATE transactions SET ${updates.join(', ')} WHERE id = ?`, values);
        const updatedTransaction = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('SELECT * FROM transactions WHERE id = ?', [
            id
        ]);
        return Response.json({
            success: true,
            id: parseInt(id),
            ...updatedTransaction[0]
        });
    } catch (error) {
        console.error('Transaction update error:', error);
        return Response.json({
            error: 'Failed to update transaction: ' + error.message
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
        const transactionId = parseInt(id);
        // Fetch transaction before deleting
        const existing = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('SELECT * FROM transactions WHERE id = ?', [
            transactionId
        ]);
        if (!existing || existing.length === 0) {
            return Response.json({
                error: 'Transaction not found'
            }, {
                status: 404
            });
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('DELETE FROM transactions WHERE id = ?', [
            transactionId
        ]);
        return Response.json({
            success: true,
            message: `Transaction ${transactionId} deleted successfully`,
            deleted_id: transactionId
        });
    } catch (error) {
        console.error('Transaction delete error:', error);
        return Response.json({
            error: 'Failed to delete transaction: ' + error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5d8762b3._.js.map