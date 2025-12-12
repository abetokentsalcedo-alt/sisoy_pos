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
"[project]/app/api/bookings/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
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
            const results = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`
        SELECT b.*, c.first_name, c.last_name, a.name as accommodation_name,
          (SELECT t.transaction_reference FROM transactions t WHERE t.booking_id = b.id ORDER BY t.id DESC LIMIT 1) AS transaction_reference,
          (SELECT t.amount FROM transactions t WHERE t.booking_id = b.id ORDER BY t.id DESC LIMIT 1) AS transaction_amount
        FROM bookings b
        LEFT JOIN customers c ON b.customer_id = c.id
        LEFT JOIN accommodations a ON b.accommodation_id = a.id
        ORDER BY b.created_at DESC
      `);
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
        console.error('Booking fetch error:', error);
        return Response.json({
            error: 'Failed to fetch bookings: ' + error.message
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
            console.log('Booking creation request received:', {
                customer_id: body.customer_id,
                accommodation_id: body.accommodation_id,
                total_price: body.total_price,
                payment_method: body.payment_method
            });
            // Validate required fields (accommodation_id may be non-numeric from legacy/local storage)
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
            // Generate booking number
            const bookingNumber = `BK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
            // Resolve accommodation_id: allow numeric id or resolve by accommodation_name for legacy/local ids
            let accommodationId = parseInt(body.accommodation_id);
            if (isNaN(accommodationId)) {
                if (body.accommodation_name) {
                    const acc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('SELECT id FROM accommodations WHERE name = ? LIMIT 1', [
                        body.accommodation_name
                    ]);
                    if (acc && acc.length > 0) {
                        accommodationId = acc[0].id;
                    }
                }
            }
            if (isNaN(accommodationId)) {
                return Response.json({
                    error: 'Invalid accommodation id'
                }, {
                    status: 400
                });
            }
            const customerId = parseInt(body.customer_id);
            if (isNaN(customerId)) {
                return Response.json({
                    error: 'Invalid customer id'
                }, {
                    status: 400
                });
            }
            const results = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`INSERT INTO bookings (booking_number, customer_id, accommodation_id, check_in, check_out, guests, total_price, status, notes) 
         VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed', ?)`, [
                bookingNumber,
                customerId,
                accommodationId,
                body.check_in,
                body.check_out,
                parseInt(body.guests),
                parseFloat(body.total_price),
                body.notes || ''
            ]);
            const bookingId = results.insertId;
            // Record transaction for this booking (transactions table)
            let transactionReference = `TXN-${bookingNumber}`;
            try {
                console.log('Inserting transaction:', {
                    booking_id: bookingId,
                    customer_id: customerId,
                    amount: body.total_price,
                    payment_method: body.payment_method || 'cash',
                    transaction_reference: transactionReference
                });
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`INSERT INTO transactions (booking_id, customer_id, amount, payment_method, status, transaction_reference, description) 
           VALUES (?, ?, ?, ?, 'completed', ?, ?)`, [
                    bookingId,
                    customerId,
                    parseFloat(body.total_price),
                    body.payment_method || 'cash',
                    transactionReference,
                    `Payment for booking ${bookingNumber}`
                ]);
                console.log('Transaction inserted successfully');
            } catch (txnError) {
                console.error('Transaction record error (non-fatal):', txnError);
            }
            // Also insert into payments table for easier receipt reporting (best-effort)
            try {
                console.log('Inserting payment:', {
                    booking_id: bookingId,
                    amount: body.total_price,
                    payment_method: body.payment_method || 'cash',
                    transaction_id: transactionReference
                });
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`INSERT INTO payments (booking_id, amount, payment_method, status, transaction_id) VALUES (?, ?, ?, 'completed', ?)`, [
                    bookingId,
                    parseFloat(body.total_price),
                    body.payment_method || 'cash',
                    transactionReference
                ]);
                console.log('Payment inserted successfully');
            } catch (payErr) {
                console.error('Payments insert error (non-fatal):', payErr);
            }
            // Fetch the newly created booking and include last transaction info
            const newBooking = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`SELECT b.*, c.first_name, c.last_name, a.name as accommodation_name 
         FROM bookings b
         LEFT JOIN customers c ON b.customer_id = c.id
         LEFT JOIN accommodations a ON b.accommodation_id = a.id
         WHERE b.id = ?`, [
                results.insertId
            ]);
            // Try to fetch last transaction for this booking
            let lastTxn = null;
            try {
                const txns = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`SELECT * FROM transactions WHERE booking_id = ? ORDER BY id DESC LIMIT 1`, [
                    results.insertId
                ]);
                if (txns && txns.length > 0) lastTxn = txns[0];
            } catch (e) {
            // ignore
            }
            return Response.json({
                success: true,
                id: results.insertId,
                booking_number: bookingNumber,
                ...newBooking[0],
                transaction_reference: lastTxn ? lastTxn.transaction_reference : transactionReference,
                transaction_amount: lastTxn ? lastTxn.amount : parseFloat(body.total_price)
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
            error: 'Failed to create booking: ' + error.message
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
            'status',
            'check_in',
            'check_out',
            'guests',
            'total_price',
            'notes'
        ];
        for (const field of allowedFields){
            if (body[field] !== undefined && body[field] !== null) {
                updates.push(`${field} = ?`);
                values.push(field === 'total_price' ? parseFloat(body[field]) : body[field]);
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
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`UPDATE bookings SET ${updates.join(', ')} WHERE id = ?`, values);
        // Fetch updated booking
        const updatedBooking = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`SELECT b.*, c.first_name, c.last_name, a.name as accommodation_name FROM bookings b
       LEFT JOIN customers c ON b.customer_id = c.id
       LEFT JOIN accommodations a ON b.accommodation_id = a.id
       WHERE b.id = ?`, [
            parseInt(id)
        ]);
        return Response.json({
            success: true,
            ...updatedBooking[0]
        });
    } catch (error) {
        console.error('Booking update error:', error);
        return Response.json({
            error: 'Failed to update booking: ' + error.message
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
        const bookingId = parseInt(id);
        // Fetch booking before deleting
        const existing = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('SELECT * FROM bookings WHERE id = ?', [
            bookingId
        ]);
        if (!existing || existing.length === 0) {
            return Response.json({
                error: 'Booking not found'
            }, {
                status: 404
            });
        }
        // Delete related transactions first
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('DELETE FROM transactions WHERE booking_id = ?', [
            bookingId
        ]);
        // Delete related payments
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('DELETE FROM payments WHERE booking_id = ?', [
            bookingId
        ]);
        // Delete the booking
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('DELETE FROM bookings WHERE id = ?', [
            bookingId
        ]);
        return Response.json({
            success: true,
            message: `Booking ${bookingId} deleted successfully`,
            deleted_id: bookingId
        });
    } catch (error) {
        console.error('Booking delete error:', error);
        return Response.json({
            error: 'Failed to delete booking: ' + error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__79af9dec._.js.map