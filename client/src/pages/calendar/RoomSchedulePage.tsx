import React, { useState, useEffect } from "react";
import { api } from "../../api/client";
import Loader from "../../components/ui/Loader";
import "../../assets/css/calPages.css";

const HOURS = Array.from({ length: 17 }, (_, i) => i + 7); // 7 AM – 11 PM

function fmtH(h: number) {
  const ampm = h >= 12 ? "PM" : "AM"; const hh = h % 12 || 12;
  return `${hh}:00 ${ampm}`;
}

const RoomSchedulePage: React.FC = () => {
  const [data, setData] = useState<{ stats: any; rooms: any[]; bookings: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showBookModal, setShowBookModal] = useState(false);

  useEffect(() => {
    api.get("/calendar/rooms").then(r => setData(r.data)).finally(() => setLoading(false));
  }, []);

  const prevDay = () => { const d = new Date(currentDate); d.setDate(d.getDate() - 1); setCurrentDate(d); };
  const nextDay = () => { const d = new Date(currentDate); d.setDate(d.getDate() + 1); setCurrentDate(d); };
  const dateLabel = currentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  if (loading) return <div style={{ padding: 32 }}><Loader /></div>;
  const { stats, rooms, bookings } = data!;

  const getBookingsForRoom = (roomId: string) => bookings.filter(b => b.roomId === roomId);

  const STATUS_MAP: Record<string, string> = { available: "AVAILABLE", occupied: "OCCUPIED", reserved: "RESERVED", maintenance: "MAINTENANCE" };

  return (
    <div className="cal-page">
      {/* nav */}
      <div className="cal-nav-bar" style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button className="cal-nav-btn" onClick={prevDay}><i className="fa fa-chevron-left" /></button>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a" }}>Room & Resource Schedule</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>{dateLabel}</div>
          </div>
          <button className="cal-nav-btn" onClick={nextDay}><i className="fa fa-chevron-right" /></button>
        </div>
        <button className="btn-teal" onClick={() => setShowBookModal(true)}><i className="fa fa-plus" /> Add Booking</button>
      </div>

      {/* stats */}
      <div className="cal-stats">
        <div className="cal-stat teal"><div className="cal-stat-val">{stats.available}</div><div className="cal-stat-lbl">Available</div></div>
        <div className="cal-stat red"><div className="cal-stat-val">{stats.inUse}</div><div className="cal-stat-lbl">In Use</div></div>
        <div className="cal-stat blue" style={{ color: "#1d4ed8" }}><div className="cal-stat-val" style={{ color: "#1d4ed8" }}>{stats.reserved}</div><div className="cal-stat-lbl">Reserved</div></div>
        <div className="cal-stat amber"><div className="cal-stat-val">{stats.maintenance}</div><div className="cal-stat-lbl">Maintenance</div></div>
      </div>

      {/* timeline grid */}
      <div className="room-timeline">
        <div className="room-grid">
          {/* header */}
          <div className="room-grid-header">
            <div className="room-label-col">ROOM / RESOURCE</div>
            {HOURS.map(h => (
              <div key={h} className="room-hour-cell">{fmtH(h)}</div>
            ))}
          </div>

          {/* rows */}
          {rooms.map(room => {
            const rb = getBookingsForRoom(room.id);
            return (
              <div key={room.id} className="room-row">
                <div className="room-name-cell">
                  <i className={`fa ${room.icon}`} style={{ color: "#9ca3af", marginRight: 6, fontSize: 12 }} />
                  <div className="room-name">{room.name}</div>
                  <div className="room-type">{room.type}</div>
                  <span className={`room-status-badge ${room.status}`}>{STATUS_MAP[room.status]}</span>
                </div>
                <div className="room-slots">
                  {HOURS.map((h, slotIdx) => {
                    const booking = rb.find(b => b.startHour === h);
                    return (
                      <div key={h} className="room-slot">
                        {booking && (
                          <div
                            className="room-appt-block"
                            style={{
                              left: `${(booking.startMin / 60) * 100}%`,
                              width: `${(booking.durationMin / 60) * 100}%`,
                              minWidth: 80,
                            }}
                          >
                            <div style={{ fontWeight: 700, fontSize: 11 }}>{booking.patientName}</div>
                            <div style={{ fontSize: 10, color: "#3b82f6" }}>{booking.doctorName}</div>
                            <div style={{ fontSize: 9, color: "#6b7280" }}>{booking.durationMin} min</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Booking Modal */}
      {showBookModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 28, width: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Add Room Booking</h3>
              <button onClick={() => setShowBookModal(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#9ca3af" }}>×</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Room</label>
                <select style={{ width: "100%", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 13 }}>
                  {rooms.filter(r => r.status === "available").map(r => <option key={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Patient Name</label>
                <input type="text" style={{ width: "100%", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 13 }} placeholder="Patient name" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Start Time</label>
                  <input type="time" style={{ width: "100%", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Duration (min)</label>
                  <input type="number" defaultValue={30} style={{ width: "100%", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 13 }} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
                <button className="btn-outline" onClick={() => setShowBookModal(false)}>Cancel</button>
                <button className="btn-teal" onClick={() => setShowBookModal(false)}>Book Room</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomSchedulePage;
