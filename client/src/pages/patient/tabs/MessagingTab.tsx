import React from "react";

interface Props { detail: any; subTab: string; setSubTab: (s: string) => void; }

const SIDEBAR_ITEMS = [
  { key: "inbox",        icon: "fa-inbox",          label: "Inbox" },
  { key: "sent",         icon: "fa-paper-plane",    label: "Sent" },
  { key: "callLogs",     icon: "fa-phone-volume",   label: "Call Logs" },
  { key: "notifications",icon: "fa-bell",           label: "Notifications" },
];

function InboxContent({ data }: { data: any[] }) {
  const msgs = data || [];
  const unread = msgs.filter(m => !m.read).length;
  return (
    <>
      <div className="msg-header-row">
        <div>
          <h2 className="pat-section-title">Inbox</h2>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{unread} unread message{unread !== 1 ? "s" : ""}</p>
        </div>
        <button className="msg-compose-btn" data-testid="btn-compose"><i className="fas fa-pen" /> Compose</button>
      </div>
      <input className="msg-search" placeholder="Search messages..." data-testid="input-msg-search" />
      {msgs.length === 0 ? <EmptyState icon="fa-inbox" text="No messages in inbox" /> : msgs.map(m => (
        <div key={m.id} className={`msg-item ${!m.read ? "unread" : ""}`} data-testid={`msg-item-${m.id}`}>
          <div className="msg-item-header">
            <div className="msg-from">
              {m.from}
              {m.priority && <span className="priority-1">{m.priority}</span>}
              {!m.read && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#0891b2", display: "inline-block" }} />}
            </div>
            <div className="msg-date">{m.date} · {m.time}</div>
          </div>
          <div className="msg-subject">{m.subject}</div>
          <div className="msg-preview">{m.preview}</div>
          <div className="msg-actions">
            <button className="msg-btn"><i className="fas fa-reply" /> Reply</button>
            <button className="msg-btn"><i className="fas fa-forward" /> Forward</button>
            <button className="msg-btn"><i className="fas fa-trash-alt" /> Delete</button>
          </div>
        </div>
      ))}
    </>
  );
}

function SentContent({ data }: { data: any[] }) {
  const msgs = data || [];
  return (
    <>
      <div className="msg-header-row">
        <div>
          <h2 className="pat-section-title">Sent Messages</h2>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{msgs.length} sent message{msgs.length !== 1 ? "s" : ""}</p>
        </div>
        <button className="msg-compose-btn"><i className="fas fa-pen" /> Compose</button>
      </div>
      <input className="msg-search" placeholder="Search sent messages..." />
      {msgs.map(m => (
        <div key={m.id} className="msg-item" data-testid={`sent-item-${m.id}`}>
          <div className="msg-item-header">
            <div className="msg-from">To: {m.to}</div>
            <div className="msg-date">{m.date} · {m.time}</div>
          </div>
          <div className="msg-subject">{m.subject}</div>
          <div className="msg-preview">{m.preview}</div>
          <div className="msg-actions">
            <button className="msg-btn"><i className="fas fa-trash-alt" /> Delete</button>
          </div>
        </div>
      ))}
    </>
  );
}

function CallLogsContent({ data }: { data: any[] }) {
  const logs = data || [];
  return (
    <>
      <div className="msg-header-row">
        <div>
          <h2 className="pat-section-title">Call Logs</h2>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{logs.length} call record{logs.length !== 1 ? "s" : ""}</p>
        </div>
        <button className="add-btn"><i className="fas fa-plus" /> Log Call</button>
      </div>
      {logs.map(c => (
        <div key={c.id} className="call-item" data-testid={`call-item-${c.id}`}>
          <div className={`call-icon ${c.type === "Incoming" ? "incoming" : "outgoing"}`}>
            <i className={`fas ${c.type === "Incoming" ? "fa-phone-volume" : "fa-phone"}`} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{c.from}</span>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>{c.date} · {c.time}</span>
            </div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>{c.type} · {c.duration}</div>
            {c.notes && <div style={{ fontSize: 12, color: "#374151", marginTop: 4 }}>{c.notes}</div>}
          </div>
        </div>
      ))}
    </>
  );
}

function NotificationsContent({ data }: { data: any[] }) {
  const notifs = data || [];
  const pri = notifs.filter(n => n.priority === "High").length;
  return (
    <>
      <div className="msg-header-row">
        <div>
          <h2 className="pat-section-title">Notifications</h2>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{pri} high priority</p>
        </div>
        <button className="export-btn" style={{ fontSize: 13, fontWeight: 500 }}>Mark All Read</button>
      </div>
      {notifs.map(n => (
        <div key={n.id} className={`notif-item ${n.priority === "High" ? "high" : n.priority === "Medium" ? "medium" : ""}`} data-testid={`notif-item-${n.id}`}>
          <div style={{ flex: 1 }}>
            <div className="notif-title-row">
              <span className="notif-title">{n.title}</span>
              {n.priority && (
                <span className={`status-badge ${n.priority === "High" ? "sb-overdue" : "sb-unconfirmed"}`}>{n.priority}</span>
              )}
            </div>
            <div className="notif-detail">{n.detail}</div>
          </div>
          <div className="notif-time">{n.date}<br />{n.time}</div>
        </div>
      ))}
    </>
  );
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 20px", color: "#9ca3af" }}>
      <i className={`fas ${icon}`} style={{ fontSize: 36, marginBottom: 12 }} />
      <p style={{ margin: 0, fontSize: 14 }}>{text}</p>
    </div>
  );
}

const MessagingTab: React.FC<Props> = ({ detail, subTab, setSubTab }) => {
  const dataMap: Record<string, any[]> = {
    inbox:         detail?.inbox || [],
    sent:          detail?.sent || [],
    callLogs:      detail?.callLogs || [],
    notifications: detail?.notifications || [],
  };

  const renderContent = () => {
    if (subTab === "inbox")         return <InboxContent data={dataMap.inbox} />;
    if (subTab === "sent")          return <SentContent data={dataMap.sent} />;
    if (subTab === "callLogs")      return <CallLogsContent data={dataMap.callLogs} />;
    if (subTab === "notifications") return <NotificationsContent data={dataMap.notifications} />;
    return null;
  };

  const counts: Record<string, number> = {
    inbox: (detail?.inbox || []).filter((m: any) => !m.read).length,
  };

  return (
    <>
      <div className="pat-left-sidebar">
        {SIDEBAR_ITEMS.map(item => (
          <div
            key={item.key}
            className={`pat-sidebar-item ${subTab === item.key ? "active" : ""}`}
            onClick={() => setSubTab(item.key)}
            data-testid={`msg-sidebar-${item.key}`}
          >
            <i className={`fas ${item.icon}`} />
            {item.label}
            {counts[item.key] > 0 && (
              <span style={{ marginLeft: "auto", background: "#0891b2", color: "#fff", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>
                {counts[item.key]}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="pat-main-content">{renderContent()}</div>
    </>
  );
};

export default MessagingTab;
