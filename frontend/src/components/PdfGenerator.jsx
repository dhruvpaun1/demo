import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 50,
        fontSize: 10,
        fontFamily: "Helvetica",
        backgroundColor: "#ffffff",
        color: "#1e293b",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 40,
        borderBottom: "2 solid #0ea5e9",
        paddingBottom: 20,
    },
    titleSection: {
        flexDirection: "column",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#0f172a",
        letterSpacing: -1,
    },
    statusBadge: {
        marginTop: 6,
        padding: "4 8",
        borderRadius: 4,
        fontSize: 9,
        fontWeight: "bold",
        textAlign: "center",
        textTransform: "uppercase",
    },
    infoGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 40,
    },
    infoBlock: {
        flexDirection: "column",
        gap: 4,
    },
    label: {
        color: "#64748b",
        fontSize: 8,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    value: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#0f172a",
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#f8fafc",
        borderTop: "1 solid #e2e8f0",
        borderBottom: "1 solid #e2e8f0",
        padding: "10 8",
    },
    tableRow: {
        flexDirection: "row",
        borderBottom: "1 solid #f1f5f9",
        padding: "12 8",
    },
    colDesc: { width: "70%" },
    colAmount: { width: "30%", textAlign: "right" },
    totalContainer: {
        marginTop: 30,
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    totalBox: {
        width: "40%",
        backgroundColor: "#0f172a",
        padding: 15,
        borderRadius: 8,
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    totalLabel: {
        color: "#94a3b8",
        fontSize: 9,
        fontWeight: "bold",
    },
    totalValue: {
        color: "#38bdf8",
        fontSize: 16,
        fontWeight: "bold",
    },
    footer: {
        position: "absolute",
        bottom: 40,
        left: 50,
        right: 50,
        textAlign: "center",
        borderTop: "1 solid #f1f5f9",
        paddingTop: 15,
        color: "#94a3b8",
        fontSize: 8,
    },
});

export default function InvoicePDF({ invoice }) {
    const date = new Date(invoice.created_at).toLocaleDateString("en-US", {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    
    const isPaid = invoice.status?.toUpperCase() === "PAID";

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header Section */}
                <View style={styles.header}>
                    <View style={styles.titleSection}>
                        <Text style={styles.title}>INVOICE</Text>
                    </View>
                    <View style={{ textAlign: "right" }}>
                        <Text style={{ fontWeight: "bold", fontSize: 12, color: "#0ea5e9" }}>LOGISTICS PORTAL</Text>
                        <Text style={[styles.label, { marginTop: 2 }]}>Generator ID: {invoice.invoiceCreatedBy}</Text>
                    </View>
                </View>

                {/* Metadata Grid */}
                <View style={styles.infoGrid}>
                    <View style={styles.infoBlock}>
                        <Text style={styles.label}>Reference Numbers</Text>
                        <Text style={styles.value}>Invoice: {invoice.invoiceNumber}</Text>
                        <Text style={styles.value}>Tracking: {invoice.trackingNumber}</Text>
                    </View>
                    <View style={styles.infoBlock}>
                        <Text style={styles.label}>Billing Date</Text>
                        <Text style={styles.value}>{date}</Text>
                    </View>
                    <View style={styles.infoBlock}>
                        <Text style={styles.label}>Package Data</Text>
                        <Text style={styles.value}>Weight: {invoice.totalWeight} KG</Text>
                    </View>
                </View>

                {/* Table */}
                <View style={styles.tableHeader}>
                    <Text style={[styles.colDesc, styles.label]}>Service Description</Text>
                    <Text style={[styles.colAmount, styles.label]}>Amount</Text>
                </View>

                <View style={styles.tableRow}>
                    <Text style={styles.colDesc}>Package cost</Text>
                    <Text style={styles.colAmount}>${Number(invoice.packageCost).toFixed(2)}</Text>
                </View>

                <View style={styles.tableRow}>
                    <Text style={styles.colDesc}>Delivery Fee</Text>
                    <Text style={styles.colAmount}>${Number(invoice.deliveryCost || 0).toFixed(2)}</Text>
                </View>

                {/* Total Section */}
                <View style={styles.totalContainer}>
                    <View style={styles.totalBox}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>TOTAL DUE</Text>
                            <Text style={styles.totalValue}>
                                ${ (Number(invoice.packageCost) + Number(invoice.deliveryCost || 0)).toFixed(2) }
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>System Generated Document ID: {invoice.id} | Generated via Admin Portal</Text>
                    <Text style={{ marginTop: 4 }}>This is an official document. Thank you for your business.</Text>
                </View>
            </Page>
        </Document>
    );
}