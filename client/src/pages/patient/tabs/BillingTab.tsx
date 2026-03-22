import React from "react";

interface Props { detail: any; subTab: string; setSubTab: (s: string) => void; }

const SIDEBAR_ITEMS = [
  { key: "bills",          icon: "fa-file-invoice-dollar", label: "Bills" },
  { key: "payments",       icon: "fa-credit-card",         label: "Payments" },
  { key: "invoices",       icon: "fa-file-invoice",        label: "Invoices" },
  { key: "statements",     icon: "fa-file-alt",            label: "Statements" },
  { key: "insuranceClaims",icon: "fa-shield-alt",          label: "Insurance Claims" },
  { key: "refunds",        icon: "fa-undo",                label: "Refunds" },
];

const fmtMoney = (v: number | null | undefined) => v != null ? `$${v.toFixed(2)}` : "—";

function BillsContent({ data }: { data: any[] }) {
  const rows = data || [];
  const total = rows.reduce((s, r) => s + (r.amount || 0), 0);
  return (
    <>
      <div className="pat-section-header">
        <div>
          <h2 className="pat-section-title">Bills</h2>
          <p className="pat-section-desc">Total outstanding: {fmtMoney(total)}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="export-btn"><i className="fas fa-download" /> Export</button>
          <button className="add-btn"><i className="fas fa-plus" /> Add Bill</button>
        </div>
      </div>
      <div className="pat-table-wrap">
        <table className="pat-table">
          <thead>
            <tr><th>Amount</th><th>Status</th><th>Physician</th><th>Description</th><th>DOS</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const stClass = r.status === "Paid" ? "sb-paid" : r.status === "Overdue" ? "sb-overdue" : "sb-unconfirmed";
              return (
                <tr key={i} data-testid={`row-bill-${i}`}>
                  <td style={{ fontWeight: 700, color: r.status === "Overdue" ? "#dc2626" : "#1a1a1a" }}>{fmtMoney(r.amount)}</td>
                  <td><span className={`status-badge ${stClass}`}>{r.status}</span></td>
                  <td>{r.physician}</td>
                  <td>{r.description}</td>
                  <td>{r.dos}</td>
                  <td>
                    <button className="tbl-action-btn" title="View"><i className="fas fa-eye" /></button>
                    <button className="tbl-action-btn" title="Pay"><i className="fas fa-dollar-sign" /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function PaymentsContent({ data }: { data: any[] }) {
  const rows = data || [];
  return (
    <>
      <div className="pat-section-header">
        <div>
          <h2 className="pat-section-title">Payments</h2>
          <p className="pat-section-desc">{rows.length} payment record{rows.length !== 1 ? "s" : ""}</p>
        </div>
        <button className="add-btn"><i className="fas fa-plus" /> Record Payment</button>
      </div>
      <div className="pat-table-wrap">
        <table className="pat-table">
          <thead>
            <tr><th>Transaction ID</th><th>Amount</th><th>Method</th><th>Date</th><th>Bill</th><th>Status</th></tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} data-testid={`row-payment-${i}`}>
                <td style={{ fontSize: 12, fontFamily: "monospace" }}>{r.txnId}</td>
                <td style={{ fontWeight: 700 }}>{fmtMoney(r.amount)}</td>
                <td>{r.method}</td>
                <td>{r.date}</td>
                <td>{r.bill}</td>
                <td><span className={`status-badge ${r.status === "Completed" ? "sb-completed" : r.status === "Processing" ? "sb-processing" : "sb-pending"}`}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function InvoicesContent({ data }: { data: any[] }) {
  const rows = data || [];
  return (
    <>
      <div className="pat-section-header">
        <div>
          <h2 className="pat-section-title">Invoices</h2>
          <p className="pat-section-desc">{rows.length} invoice{rows.length !== 1 ? "s" : ""}</p>
        </div>
        <button className="add-btn"><i className="fas fa-plus" /> Create Invoice</button>
      </div>
      <div className="pat-table-wrap">
        <table className="pat-table">
          <thead>
            <tr><th>Invoice #</th><th>Date</th><th>Total</th><th>Services</th><th>Due Date</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const sc = r.status === "Paid" ? "sb-paid" : r.status === "Partially Paid" ? "sb-partial" : "sb-unpaid";
              return (
                <tr key={i} data-testid={`row-invoice-${i}`}>
                  <td style={{ fontSize: 12, fontFamily: "monospace" }}>{r.number}</td>
                  <td>{r.date}</td>
                  <td style={{ fontWeight: 700 }}>{fmtMoney(r.total)}</td>
                  <td style={{ fontSize: 12 }}>{r.services}</td>
                  <td>{r.dueDate}</td>
                  <td><span className={`status-badge ${sc}`}>{r.status}</span></td>
                  <td>
                    <button className="tbl-action-btn" title="Download"><i className="fas fa-download" /></button>
                    <button className="tbl-action-btn" title="Print"><i className="fas fa-print" /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function StatementsContent({ data }: { data: any[] }) {
  const rows = data || [];
  return (
    <>
      <div className="pat-section-header">
        <div>
          <h2 className="pat-section-title">Statements</h2>
          <p className="pat-section-desc">{rows.length} statement{rows.length !== 1 ? "s" : ""}</p>
        </div>
        <button className="export-btn"><i className="fas fa-download" /> Export All</button>
      </div>
      <div className="pat-table-wrap">
        <table className="pat-table">
          <thead>
            <tr><th>Statement ID</th><th>Date</th><th>Period</th><th>Charges</th><th>Payments</th><th>Balance</th><th>Status</th></tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const sc = r.status === "Paid" ? "sb-paid" : r.status === "Partial" ? "sb-partial" : "sb-unpaid";
              return (
                <tr key={i} data-testid={`row-stmt-${i}`}>
                  <td style={{ fontSize: 12, fontFamily: "monospace" }}>{r.id}</td>
                  <td>{r.date}</td>
                  <td style={{ fontSize: 12 }}>{r.period}</td>
                  <td>{fmtMoney(r.charges)}</td>
                  <td style={{ color: "#16a34a" }}>{fmtMoney(r.payments)}</td>
                  <td style={{ fontWeight: 700, color: r.balance > 0 ? "#dc2626" : "#16a34a" }}>{fmtMoney(r.balance)}</td>
                  <td><span className={`status-badge ${sc}`}>{r.status}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function InsuranceClaimsContent({ data }: { data: any[] }) {
  const rows = data || [];
  return (
    <>
      <div className="pat-section-header">
        <div>
          <h2 className="pat-section-title">Insurance Claims</h2>
          <p className="pat-section-desc">{rows.length} claim{rows.length !== 1 ? "s" : ""}</p>
        </div>
        <button className="add-btn"><i className="fas fa-plus" /> Submit Claim</button>
      </div>
      <div className="pat-table-wrap">
        <table className="pat-table">
          <thead>
            <tr><th>Claim #</th><th>Claim Date</th><th>Insurer</th><th>Svc Date</th><th>Claimed</th><th>Approved</th><th>Patient Resp.</th><th>Status</th></tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const sc = r.status === "Approved" ? "sb-approved" : r.status === "Partially Approved" ? "sb-partial" : r.status === "Denied" ? "sb-denied" : r.status === "Pending Review" ? "sb-pending" : "sb-submitted";
              return (
                <tr key={i} data-testid={`row-claim-${i}`}>
                  <td style={{ fontSize: 12, fontFamily: "monospace" }}>{r.claimNum}</td>
                  <td>{r.claimDate}</td>
                  <td>{r.insurer}</td>
                  <td>{r.svcDate}</td>
                  <td>{fmtMoney(r.claimed)}</td>
                  <td style={{ color: "#16a34a" }}>{fmtMoney(r.approved)}</td>
                  <td style={{ fontWeight: 600 }}>{fmtMoney(r.patientResp)}</td>
                  <td><span className={`status-badge ${sc}`}>{r.status}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function RefundsContent({ data }: { data: any[] }) {
  const rows = data || [];
  return (
    <>
      <div className="pat-section-header">
        <div>
          <h2 className="pat-section-title">Refunds</h2>
          <p className="pat-section-desc">{rows.length} refund{rows.length !== 1 ? "s" : ""}</p>
        </div>
        <button className="add-btn"><i className="fas fa-plus" /> Process Refund</button>
      </div>
      {rows.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
          <i className="fas fa-undo" style={{ fontSize: 40, marginBottom: 12, display: "block" }} />
          <p style={{ fontSize: 14, margin: 0 }}>No refunds on record</p>
        </div>
      ) : (
        <div className="pat-table-wrap">
          <table className="pat-table">
            <thead><tr><th>Refund ID</th><th>Amount</th><th>Date</th><th>Method</th><th>Status</th></tr></thead>
            <tbody>{rows.map((r, i) => <tr key={i}><td>{r.id}</td><td>{fmtMoney(r.amount)}</td><td>{r.date}</td><td>{r.method}</td><td>{r.status}</td></tr>)}</tbody>
          </table>
        </div>
      )}
    </>
  );
}

const BillingTab: React.FC<Props> = ({ detail, subTab, setSubTab }) => {
  const renderContent = () => {
    if (subTab === "bills")           return <BillsContent data={detail?.bills} />;
    if (subTab === "payments")        return <PaymentsContent data={detail?.payments} />;
    if (subTab === "invoices")        return <InvoicesContent data={detail?.invoices} />;
    if (subTab === "statements")      return <StatementsContent data={detail?.statements} />;
    if (subTab === "insuranceClaims") return <InsuranceClaimsContent data={detail?.insuranceClaims} />;
    if (subTab === "refunds")         return <RefundsContent data={detail?.refunds} />;
    return null;
  };

  return (
    <>
      <div className="pat-left-sidebar">
        {SIDEBAR_ITEMS.map(item => (
          <div
            key={item.key}
            className={`pat-sidebar-item ${subTab === item.key ? "active" : ""}`}
            onClick={() => setSubTab(item.key)}
            data-testid={`billing-sidebar-${item.key}`}
          >
            <i className={`fas ${item.icon}`} />
            {item.label}
          </div>
        ))}
      </div>
      <div className="pat-main-content">{renderContent()}</div>
    </>
  );
};

export default BillingTab;
