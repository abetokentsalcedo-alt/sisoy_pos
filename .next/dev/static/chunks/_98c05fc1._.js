(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/booking/booking-complete-modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BookingCompleteModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$es$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jspdf/dist/jspdf.es.min.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function BookingCompleteModal({ booking, clientName, accommodationName, checkIn, checkOut, nights, onClose }) {
    _s();
    const [isGeneratingPDF, setIsGeneratingPDF] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const displayAmount = typeof booking.totalAmount === 'number' ? booking.totalAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) : String(booking.totalAmount);
    const generatePDFReceipt = ()=>{
        setIsGeneratingPDF(true);
        try {
            const doc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$es$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            // Set colors
            const blueColor = [
                30,
                58,
                138
            ] // #1E3A8A
            ;
            const yellowColor = [
                250,
                204,
                21
            ] // #FACC15
            ;
            const grayColor = [
                50,
                50,
                50
            ];
            // Header with background
            doc.setFillColor(blueColor[0], blueColor[1], blueColor[2]);
            doc.rect(0, 0, pageWidth, 40, "F");
            doc.setTextColor(250, 204, 21);
            doc.setFontSize(28);
            doc.setFont("helvetica", "bold");
            doc.text("SISOY POS", pageWidth / 2, 20, {
                align: "center"
            });
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(10);
            doc.text("BOOKING RECEIPT", pageWidth / 2, 32, {
                align: "center"
            });
            // Receipt details
            let yPosition = 50;
            // Booking ID and Date
            doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`Booking ID: ${booking.id}`, 20, yPosition);
            yPosition += 8;
            doc.text(`Date Issued: ${new Date().toLocaleDateString()}`, 20, yPosition);
            yPosition += 12;
            // Divider
            doc.setDrawColor(blueColor[0], blueColor[1], blueColor[2]);
            doc.line(20, yPosition, pageWidth - 20, yPosition);
            yPosition += 10;
            // Guest Information
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(blueColor[0], blueColor[1], blueColor[2]);
            doc.text("GUEST INFORMATION", 20, yPosition);
            yPosition += 8;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
            doc.text(`Name: ${clientName}`, 25, yPosition);
            yPosition += 6;
            doc.text(`Booking Date: ${new Date(booking.createdAt).toLocaleDateString()}`, 25, yPosition);
            yPosition += 12;
            // Accommodation Details
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(blueColor[0], blueColor[1], blueColor[2]);
            doc.text("ACCOMMODATION DETAILS", 20, yPosition);
            yPosition += 8;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
            doc.text(`Accommodation: ${accommodationName}`, 25, yPosition);
            yPosition += 6;
            doc.text(`Check-In: ${new Date(checkIn).toLocaleDateString()}`, 25, yPosition);
            yPosition += 6;
            doc.text(`Check-Out: ${new Date(checkOut).toLocaleDateString()}`, 25, yPosition);
            yPosition += 6;
            doc.text(`Number of Nights: ${nights}`, 25, yPosition);
            yPosition += 12;
            // Billing Summary
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(blueColor[0], blueColor[1], blueColor[2]);
            doc.text("BILLING SUMMARY", 20, yPosition);
            yPosition += 8;
            // Summary table - use ASCII-safe currency labels to avoid encoding issues
            const tableData = [
                [
                    "Description",
                    "Amount"
                ],
                [
                    `${accommodationName} x ${nights} nights`,
                    `PHP ${displayAmount}`
                ],
                [
                    "Discount",
                    "PHP 0.00"
                ],
                [
                    "Service Charge",
                    "PHP 0.00"
                ],
                [
                    "Tax (0%)",
                    "PHP 0.00"
                ]
            ];
            doc.setFontSize(10);
            doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
            tableData.forEach((row, index)=>{
                const isHeader = index === 0;
                if (isHeader) doc.setFont("helvetica", "bold");
                else doc.setFont("helvetica", "normal");
                doc.text(row[0], 25, yPosition);
                doc.text(row[1], pageWidth - 40, yPosition, {
                    align: "right"
                });
                yPosition += 6;
            });
            // Total
            yPosition += 2;
            doc.setDrawColor(blueColor[0], blueColor[1], blueColor[2]);
            doc.line(20, yPosition, pageWidth - 20, yPosition);
            yPosition += 6;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.setTextColor(blueColor[0], blueColor[1], blueColor[2]);
            doc.text("TOTAL AMOUNT", 25, yPosition);
            // Use ASCII-friendly currency label in PDF to avoid font/encoding issues
            doc.text(`PHP ${displayAmount}`, pageWidth - 40, yPosition, {
                align: "right"
            });
            yPosition += 14;
            // Payment Info
            doc.setDrawColor(blueColor[0], blueColor[1], blueColor[2]);
            doc.line(20, yPosition, pageWidth - 20, yPosition);
            yPosition += 8;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(blueColor[0], blueColor[1], blueColor[2]);
            doc.text("PAYMENT INFORMATION", 20, yPosition);
            yPosition += 8;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
            doc.text(`Payment Status: PAID`, 25, yPosition);
            yPosition += 6;
            const txnId = booking.transactionId || booking.transaction_reference || 'N/A';
            doc.text(`Transaction ID: ${txnId}`, 25, yPosition);
            yPosition += 12;
            // Footer
            doc.setDrawColor(blueColor[0], blueColor[1], blueColor[2]);
            doc.line(20, yPosition, pageWidth - 20, yPosition);
            yPosition += 8;
            doc.setFont("helvetica", "italic");
            doc.setFontSize(9);
            doc.setTextColor(150, 150, 150);
            doc.text("Thank you for booking with Sisoy POS", pageWidth / 2, yPosition, {
                align: "center"
            });
            yPosition += 5;
            doc.text("For inquiries, please contact us", pageWidth / 2, yPosition, {
                align: "center"
            });
            // Save PDF
            doc.save(`Receipt_${booking.id}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate receipt. Please try again.");
        } finally{
            setIsGeneratingPDF(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-lg p-8 max-w-md w-full shadow-2xl space-y-6 animate-in",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-green-100 rounded-full p-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-12 h-12 text-green-600",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M5 13l4 4L19 7"
                            }, void 0, false, {
                                fileName: "[project]/components/booking/booking-complete-modal.tsx",
                                lineNumber: 203,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/booking/booking-complete-modal.tsx",
                            lineNumber: 202,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/booking/booking-complete-modal.tsx",
                        lineNumber: 201,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/booking/booking-complete-modal.tsx",
                    lineNumber: 200,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-bold text-blue-900 mb-2",
                            children: "Booking Complete!"
                        }, void 0, false, {
                            fileName: "[project]/components/booking/booking-complete-modal.tsx",
                            lineNumber: 210,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-600 text-sm",
                            children: "Your reservation has been confirmed"
                        }, void 0, false, {
                            fileName: "[project]/components/booking/booking-complete-modal.tsx",
                            lineNumber: 211,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/booking/booking-complete-modal.tsx",
                    lineNumber: 209,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-blue-50 rounded-lg p-4 space-y-3 text-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-gray-600",
                                    children: "Booking ID"
                                }, void 0, false, {
                                    fileName: "[project]/components/booking/booking-complete-modal.tsx",
                                    lineNumber: 217,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-bold text-gray-900",
                                    children: booking.id
                                }, void 0, false, {
                                    fileName: "[project]/components/booking/booking-complete-modal.tsx",
                                    lineNumber: 218,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/booking/booking-complete-modal.tsx",
                            lineNumber: 216,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-gray-600",
                                    children: "Room"
                                }, void 0, false, {
                                    fileName: "[project]/components/booking/booking-complete-modal.tsx",
                                    lineNumber: 221,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-bold text-gray-900",
                                    children: accommodationName
                                }, void 0, false, {
                                    fileName: "[project]/components/booking/booking-complete-modal.tsx",
                                    lineNumber: 222,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/booking/booking-complete-modal.tsx",
                            lineNumber: 220,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-gray-600",
                                    children: "Nights"
                                }, void 0, false, {
                                    fileName: "[project]/components/booking/booking-complete-modal.tsx",
                                    lineNumber: 225,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-bold text-gray-900",
                                    children: nights
                                }, void 0, false, {
                                    fileName: "[project]/components/booking/booking-complete-modal.tsx",
                                    lineNumber: 226,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/booking/booking-complete-modal.tsx",
                            lineNumber: 224,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border-t border-blue-200 pt-3 mt-3 flex justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-bold text-gray-800",
                                    children: "Total Amount"
                                }, void 0, false, {
                                    fileName: "[project]/components/booking/booking-complete-modal.tsx",
                                    lineNumber: 229,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-bold text-yellow-500 text-lg",
                                    children: [
                                        "₱",
                                        displayAmount
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/booking/booking-complete-modal.tsx",
                                    lineNumber: 230,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/booking/booking-complete-modal.tsx",
                            lineNumber: 228,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/booking/booking-complete-modal.tsx",
                    lineNumber: 215,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: generatePDFReceipt,
                            disabled: isGeneratingPDF,
                            className: "w-full py-3 bg-blue-900 text-white font-bold rounded hover:bg-blue-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-5 h-5",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M12 19l9 2-9-18-9 18 9-2m0 0v-8m0 8l-6-4m6 4l6-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/booking/booking-complete-modal.tsx",
                                        lineNumber: 242,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/booking/booking-complete-modal.tsx",
                                    lineNumber: 241,
                                    columnNumber: 13
                                }, this),
                                isGeneratingPDF ? "Generating..." : "Download Receipt PDF"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/booking/booking-complete-modal.tsx",
                            lineNumber: 236,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "w-full py-3 bg-yellow-400 text-blue-900 font-bold rounded hover:bg-yellow-500 transition-colors",
                            children: "Done"
                        }, void 0, false, {
                            fileName: "[project]/components/booking/booking-complete-modal.tsx",
                            lineNumber: 251,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/booking/booking-complete-modal.tsx",
                    lineNumber: 235,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/booking/booking-complete-modal.tsx",
            lineNumber: 198,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/booking/booking-complete-modal.tsx",
        lineNumber: 197,
        columnNumber: 5
    }, this);
}
_s(BookingCompleteModal, "UT4UqgHQzYvdUHyg5AK1dkOn3tk=");
_c = BookingCompleteModal;
var _c;
__turbopack_context__.k.register(_c, "BookingCompleteModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(dashboard)/booking/payment/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PaymentPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/storage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$booking$2f$booking$2d$complete$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/booking/booking-complete-modal.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function PaymentPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const amount = Number.parseFloat(searchParams.get("amount") || "0");
    const bookingId = searchParams.get("bookingId") || "";
    const [paymentMethod, setPaymentMethod] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("cash");
    const [isProcessing, setIsProcessing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [completedBooking, setCompletedBooking] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [completedClientName, setCompletedClientName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [completedAccommodationName, setCompletedAccommodationName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleSimulatePayment = async ()=>{
        setIsProcessing(true);
        // Simulate API call
        await new Promise((resolve)=>setTimeout(resolve, 2000));
        const tempBooking = JSON.parse(sessionStorage.getItem("tempBooking") || "{}");
        const booking = {
            ...tempBooking,
            id: bookingId || tempBooking.id,
            status: "confirmed",
            paymentStatus: "paid",
            transactionId: `TXN${Date.now()}`
        };
        const API_BASE = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApiBase"])();
        // Try to create booking on server first when API is configured
        if (("TURBOPACK compile-time value", "object") !== 'undefined' && API_BASE) {
            // quick ping to backend to make sure it's reachable and DB connection ok
            try {
                const ping = await fetch(`${API_BASE}/test_db_conn`);
                if (!ping.ok) {
                    alert('Booking failed: server API unreachable (ping returned ' + ping.status + '). Please ensure Apache/MySQL are running and backend is reachable.');
                    setIsProcessing(false);
                    return;
                }
                try {
                    const pj = await ping.json();
                    if (!pj || pj.connected !== true) {
                        alert('Booking failed: server DB connection is not ready. Check backend DB settings and XAMPP services.');
                        setIsProcessing(false);
                        return;
                    }
                } catch (e) {
                // non-json response; continue and let subsequent calls fail with clearer errors
                }
            } catch (e) {
                alert('Booking failed: server API not reachable. Please start the backend (Apache/MySQL) and verify NEXT_PUBLIC_API_URL.');
                setIsProcessing(false);
                return;
            }
            try {
                // Ensure the customer exists on server. Search by email/phone/name first; if not found, create.
                let customerIdToUse = booking.clientId;
                const clientObj = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["storage"].getClients().find((c)=>c.id === booking.clientId);
                if (clientObj) {
                    try {
                        // Prefer searching by email, then phone, then name
                        let searchTerm = '';
                        if (clientObj.email) searchTerm = clientObj.email;
                        else if (clientObj.phoneNumber) searchTerm = clientObj.phoneNumber;
                        else searchTerm = `${clientObj.firstName} ${clientObj.lastName}`;
                        if (searchTerm && searchTerm.length >= 2) {
                            try {
                                const sresp = await fetch(`${API_BASE}/customers?action=search&term=${encodeURIComponent(searchTerm)}`);
                                if (sresp.ok) {
                                    const sjson = await sresp.json();
                                    if (sjson && Array.isArray(sjson.data) && sjson.data.length > 0) {
                                        // Try to find best match (email or phone)
                                        const match = sjson.data.find((c)=>clientObj.email && c.email === clientObj.email || clientObj.phoneNumber && c.phone === clientObj.phoneNumber || c.first_name === clientObj.firstName && c.last_name === clientObj.lastName);
                                        if (match && match.id) {
                                            customerIdToUse = String(match.id);
                                        }
                                    }
                                }
                            } catch (e) {
                            // ignore search failures and fall back to create
                            }
                        }
                        // If still not matched (or search not available), create customer on server
                        if (!customerIdToUse || String(customerIdToUse).length > 10) {
                            // numeric local IDs generated by Date.now() can be long - treat them as local-only
                            const createResp = await fetch(`${API_BASE}/customers?action=create`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    first_name: clientObj.firstName,
                                    last_name: clientObj.lastName,
                                    email: clientObj.email || '',
                                    phone: clientObj.phoneNumber || '',
                                    address: clientObj.address || ''
                                })
                            });
                            if (createResp.ok) {
                                const cjson = await createResp.json();
                                if (cjson && cjson.id) {
                                    customerIdToUse = String(cjson.id);
                                    // update local client id to server id for consistency
                                    try {
                                        const clients = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["storage"].getClients();
                                        const idx = clients.findIndex((c)=>c.id === clientObj.id);
                                        if (idx !== -1) {
                                            clients[idx].id = customerIdToUse;
                                            // Remove any temporary local-only clients (those with very long numeric ids)
                                            const cleaned = clients.filter((c)=>{
                                                const idStr = String(c.id || '');
                                                // keep the newly created/updated server id
                                                if (idStr === String(customerIdToUse)) return true;
                                                // treat ids longer than 10 chars as temporary local ids and remove them
                                                if (/^\d{11,}$/.test(idStr)) return false;
                                                return true;
                                            });
                                            localStorage.setItem('pos_clients', JSON.stringify(cleaned));
                                        }
                                    } catch  {}
                                }
                            }
                        }
                    } catch (e) {
                    // ignore and continue — will be handled later
                    }
                }
                const payload = {
                    customer_id: customerIdToUse,
                    accommodation_id: booking.accommodationId,
                    accommodation_name: (()=>{
                        const acc = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["storage"].getAccommodations().find((a)=>a.id === booking.accommodationId);
                        return acc ? acc.name : undefined;
                    })(),
                    check_in: booking.dateFrom,
                    check_out: booking.dateTo,
                    guests: 1,
                    total_price: booking.totalAmount,
                    payment_method: paymentMethod
                };
                const resp = await fetch(`${API_BASE}/bookings?action=create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
                if (resp.ok) {
                    const json = await resp.json();
                    const serverId = json && json.id ? String(json.id) : booking.id;
                    const serverBooking = {
                        ...booking,
                        id: serverId
                    };
                    // ensure booking references the server customer id
                    serverBooking.clientId = customerIdToUse;
                    // attach transaction info returned by server if available
                    if (json && json.transaction_reference) {
                        serverBooking.transactionId = json.transaction_reference;
                    }
                    // ensure totalAmount uses server value if provided
                    if (json && json.total_price) {
                        serverBooking.totalAmount = parseFloat(json.total_price);
                    } else if (json && json.transaction_amount) {
                        // sometimes server returns transaction_amount separately
                        serverBooking.totalAmount = parseFloat(json.transaction_amount);
                    }
                    sessionStorage.removeItem("tempBooking");
                    // Fetch updated bookings list from server and sync to localStorage
                    try {
                        const listResp = await fetch(`${API_BASE}/bookings?action=list`);
                        if (listResp.ok) {
                            const listData = await listResp.json();
                            // Handle both array and object with data property
                            const serverBookings = Array.isArray(listData) ? listData : listData?.data || [];
                            if (serverBookings.length > 0) {
                                // Convert server bookings to client format and store
                                const clientBookings = serverBookings.map((b)=>({
                                        id: String(b.id),
                                        clientId: String(b.customer_id),
                                        accommodationId: String(b.accommodation_id),
                                        dateFrom: b.check_in,
                                        dateTo: b.check_out,
                                        status: b.status || 'confirmed',
                                        totalAmount: parseFloat(b.total_price) || parseFloat(b.transaction_amount) || 0,
                                        createdAt: b.created_at || new Date().toISOString(),
                                        paymentStatus: 'paid',
                                        transactionId: b.transaction_reference || b.transactionId || null
                                    }));
                                localStorage.setItem('pos_bookings', JSON.stringify(clientBookings));
                            }
                        }
                    } catch (e) {
                    // non-fatal: continue even if list fetch fails
                    }
                    setIsProcessing(false);
                    setCompletedBooking(serverBooking);
                    // determine client name for modal (prefer clientObj if available)
                    const clientObj = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["storage"].getClients().find((c)=>c.id === booking.clientId) || null;
                    if (clientObj) setCompletedClientName(`${clientObj.firstName} ${clientObj.lastName}`);
                    else setCompletedClientName(null);
                    const accommodation = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["storage"].getAccommodations().find((a)=>a.id === serverBooking.accommodationId);
                    setCompletedAccommodationName(accommodation?.name || null);
                    return;
                } else {
                    // Try to parse error body
                    let errText = 'Failed to create booking on server';
                    try {
                        const errJson = await resp.json();
                        if (errJson && errJson.error) errText = String(errJson.error);
                    } catch  {}
                    alert(errText);
                    setIsProcessing(false);
                    return;
                }
            } catch (e) {
            // fall back to local-only if server call fails
            }
        }
        // If API not configured or unavailable, prevent booking — require server persistence
        alert('Booking failed: server API not configured or unreachable. Booking must be created on the server.');
        setIsProcessing(false);
        return;
    };
    const handleCloseModal = ()=>{
        setCompletedBooking(null);
        router.push("/dashboard");
    };
    if (completedBooking) {
        const checkIn = new Date(completedBooking.dateFrom);
        const checkOut = new Date(completedBooking.dateTo);
        const nights = Math.floor((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$booking$2f$booking$2d$complete$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            booking: completedBooking,
            clientName: completedClientName || 'Guest',
            accommodationName: completedAccommodationName || 'Accommodation',
            checkIn: completedBooking.dateFrom,
            checkOut: completedBooking.dateTo,
            nights: nights,
            onClose: handleCloseModal
        }, void 0, false, {
            fileName: "[project]/app/(dashboard)/booking/payment/page.tsx",
            lineNumber: 253,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50 flex items-center justify-center p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-md bg-white border border-gray-200 rounded-lg p-8 shadow-lg",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-3xl font-bold text-blue-900 mb-6 text-center",
                    children: "Confirm Payment"
                }, void 0, false, {
                    fileName: "[project]/app/(dashboard)/booking/payment/page.tsx",
                    lineNumber: 268,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-blue-50 p-6 rounded mb-6 text-center border border-blue-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-gray-600 mb-2 font-medium",
                            children: "Total Amount Due"
                        }, void 0, false, {
                            fileName: "[project]/app/(dashboard)/booking/payment/page.tsx",
                            lineNumber: 271,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-4xl font-bold text-yellow-500",
                            children: [
                                "₱",
                                amount.toLocaleString()
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(dashboard)/booking/payment/page.tsx",
                            lineNumber: 272,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(dashboard)/booking/payment/page.tsx",
                    lineNumber: 270,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4 mb-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "block text-sm font-bold text-gray-700 mb-3",
                                children: "Payment Method"
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/booking/payment/page.tsx",
                                lineNumber: 277,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: paymentMethod,
                                onChange: (e)=>setPaymentMethod(e.target.value),
                                className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "cash",
                                        children: "Cash Payment"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/booking/payment/page.tsx",
                                        lineNumber: 283,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "gcash",
                                        children: "GCash"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/booking/payment/page.tsx",
                                        lineNumber: 284,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "credit",
                                        children: "Credit Card"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/booking/payment/page.tsx",
                                        lineNumber: 285,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "bank",
                                        children: "Bank Transfer"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/booking/payment/page.tsx",
                                        lineNumber: 286,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(dashboard)/booking/payment/page.tsx",
                                lineNumber: 278,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(dashboard)/booking/payment/page.tsx",
                        lineNumber: 276,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/(dashboard)/booking/payment/page.tsx",
                    lineNumber: 275,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: handleSimulatePayment,
                    disabled: isProcessing,
                    className: "w-full py-3 bg-yellow-400 text-blue-900 font-bold rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                    children: isProcessing ? "Processing Payment..." : "Confirm & Process Payment"
                }, void 0, false, {
                    fileName: "[project]/app/(dashboard)/booking/payment/page.tsx",
                    lineNumber: 291,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-xs text-gray-700",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "font-bold mb-1 text-blue-900",
                            children: "Payment Confirmation"
                        }, void 0, false, {
                            fileName: "[project]/app/(dashboard)/booking/payment/page.tsx",
                            lineNumber: 300,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "Payment will be processed securely. A receipt will be generated upon completion."
                        }, void 0, false, {
                            fileName: "[project]/app/(dashboard)/booking/payment/page.tsx",
                            lineNumber: 301,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(dashboard)/booking/payment/page.tsx",
                    lineNumber: 299,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(dashboard)/booking/payment/page.tsx",
            lineNumber: 267,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(dashboard)/booking/payment/page.tsx",
        lineNumber: 266,
        columnNumber: 5
    }, this);
}
_s(PaymentPage, "OyMr2Gw2hguJ5cqXlsE16ml5+NI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = PaymentPage;
var _c;
__turbopack_context__.k.register(_c, "PaymentPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_98c05fc1._.js.map