import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAppointments } from "../../hooks/useAppointments";
import Loader from "../../components/ui/Loader";
import "../../assets/css/schedule.css";

type ViewMode = "day" | "week" | "month";
type StatusFilter = "all" | "scheduled" | "confirmed" | "checked_in" | "in_progress" | "completed" | "no_show";

interface MockPatientData {
  age: number; sex: string;
  vitals: { bp: string; hr: string; temp: string; spo2: string };
  medications: string[]; allergies: string[]; diagnoses: string[]; notes: string;
}

const MOCK_DATA: Record<string, MockPatientData> = {
  Smith:    { age:48, sex:"M", vitals:{bp:"138/88",hr:"78",temp:"98.6°F",spo2:"98%"}, medications:["Metformin 1000mg BID","Lisinopril 10mg QD"], allergies:["Penicillin"], diagnoses:["Type 2 Diabetes Mellitus E11.9"], notes:"Patient requested early appointment. Review latest glucose logs." },
  Garcia:   { age:32, sex:"F", vitals:{bp:"118/74",hr:"72",temp:"98.2°F",spo2:"99%"}, medications:["Multivitamin QD","Calcium 500mg BID"], allergies:[], diagnoses:["Wellness visit – no acute issues"], notes:"Due for mammogram and colonoscopy screening." },
  Johnson:  { age:39, sex:"M", vitals:{bp:"128/80",hr:"88",temp:"100.4°F",spo2:"97%"}, medications:["Ibuprofen 400mg PRN","Sudafed 60mg PRN"], allergies:["Sulfa drugs","Shellfish"], diagnoses:["Acute viral URI J06.9"], notes:"Symptomatic treatment; no antibiotics indicated. Follow up if not improved in 5 days." },
  Williams: { age:29, sex:"F", vitals:{bp:"112/70",hr:"76",temp:"97.8°F",spo2:"99%"}, medications:["Sertraline 50mg QD","Lorazepam 0.5mg PRN"], allergies:["Latex"], diagnoses:["Generalized Anxiety Disorder F41.1"], notes:"Patient reports improved sleep. Consider dose increase if anxiety persists." },
  Brown:    { age:55, sex:"M", vitals:{bp:"142/90",hr:"82",temp:"98.4°F",spo2:"97%"}, medications:["Atorvastatin 40mg QHS","Aspirin 81mg QD"], allergies:["Penicillin","NSAIDs"], diagnoses:["Hyperlipidemia E78.5","Essential hypertension I10"], notes:"Lipid panel reviewed. LDL improved from 145 to 98 mg/dL." },
  Davis:    { age:41, sex:"F", vitals:{bp:"122/78",hr:"70",temp:"98.0°F",spo2:"99%"}, medications:[], allergies:["Amoxicillin"], diagnoses:["New patient – establishing care"], notes:"Complete H&P done. Ordered baseline labs and EKG." },
  Martinez: { age:67, sex:"M", vitals:{bp:"150/92",hr:"80",temp:"98.6°F",spo2:"96%"}, medications:["Amlodipine 10mg QD","HCTZ 25mg QD","Metoprolol 25mg BID"], allergies:["ACE inhibitors (cough)"], diagnoses:["Essential hypertension I10","CKD stage 3 N18.3"], notes:"BP elevated today. Increase HCTZ to 50mg. Recheck in 4 weeks." },
  Anderson: { age:34, sex:"F", vitals:{bp:"116/72",hr:"74",temp:"98.0°F",spo2:"99%"}, medications:["Lisinopril 5mg QD"], allergies:[], diagnoses:["Hypertension I10"], notes:"Requested Lisinopril refill via phone. No new concerns." },
  Wilson:   { age:52, sex:"M", vitals:{bp:"130/82",hr:"76",temp:"97.9°F",spo2:"98%"}, medications:["Metformin 500mg BID","Vitamin D 2000IU QD"], allergies:["Codeine"], diagnoses:["Prediabetes R73.09","Vitamin D deficiency E55.9"], notes:"Annual wellness visit. Labs ordered. Flu vaccine administered." },
  Taylor:   { age:48, sex:"F", vitals:{bp:"124/76",hr:"92",temp:"98.8°F",spo2:"99%"}, medications:["Sumatriptan 50mg PRN","Topiramate 25mg QD"], allergies:[], diagnoses:["Migraine without aura G43.009"], notes:"Patient was no-show. Follow-up call made. Appointment to be rescheduled." },
  Clark:    { age:60, sex:"M", vitals:{bp:"136/84",hr:"78",temp:"98.2°F",spo2:"98%"}, medications:["Cephalexin 500mg QID x7d","Ibuprofen 600mg TID PRN"], allergies:["Penicillin"], diagnoses:["Post-op wound follow-up Z48.0"], notes:"Wound healing well. Sutures removed. No signs of infection." },
  Thompson: { age:41, sex:"F", vitals:{bp:"144/88",hr:"86",temp:"98.4°F",spo2:"97%"}, medications:["Insulin glargine 20 units QHS","Metformin 1000mg BID"], allergies:["Sulfa drugs"], diagnoses:["Type 2 Diabetes Mellitus E11.9","Diabetic neuropathy E11.40"], notes:"A1C improved to 7.2. Refer to ophthalmology and podiatry." },
};

const AVATAR_COLORS = ["#0891b2","#7c3aed","#0d9488","#dc2626","#ea580c","#16a34a","#9333ea","#c2410c","#0369a1","#15803d","#92400e","#1d4ed8"];
function getAvColor(name: string) { let h=0; for(let i=0;i<name.length;i++) h=(h*31+name.charCodeAt(i))&0xffffffff; return AVATAR_COLORS[Math.abs(h)%AVATAR_COLORS.length]; }
function getInits(f:string,l:string) { return `${(f||"?")[0]}${(l||"?")[0]}`.toUpperCase(); }
function fmtTime(iso:string) { const d=new Date(iso),h=d.getHours(),m=d.getMinutes(),ap=h>=12?"PM":"AM",hh=h%12||12; return `${hh}:${m.toString().padStart(2,"0")} ${ap}`; }
function fmtDur(s:string,e:string) { return Math.round((new Date(e).getTime()-new Date(s).getTime())/60000)+"m"; }
function fmtDay(d:Date) { return d.toLocaleDateString("en-US",{weekday:"long"}); }
function fmtDate(d:Date) { return d.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}); }

const SLABELS:Record<string,string> = {scheduled:"Scheduled",confirmed:"Confirmed",checked_in:"Checked In",in_progress:"In Progress",completed:"Completed",no_show:"No Show",cancelled:"Cancelled"};
const SCLS:Record<string,string> = {scheduled:"scheduled",confirmed:"confirmed",checked_in:"checked-in",in_progress:"in-progress",completed:"completed",no_show:"no-show",cancelled:"cancelled"};
const LICON:Record<string,string> = {in_person:"fa-hospital-alt",telehealth:"fa-video",phone:"fa-phone",Virtual:"fa-video",Phone:"fa-phone"};

const DEFAULT_MOCK: MockPatientData = { age:45, sex:"M", vitals:{bp:"120/80",hr:"72",temp:"98.6°F",spo2:"99%"}, medications:[], allergies:[], diagnoses:[], notes:"" };

const CalendarPage: React.FC = () => {
  const { appointments, isLoading, error } = useAppointments();
  const [view, setView] = useState<ViewMode>("day");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [expandedId, setExpandedId] = useState<string|null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const prevDay = () => { const d=new Date(currentDate); d.setDate(d.getDate()-1); setCurrentDate(d); };
  const nextDay = () => { const d=new Date(currentDate); d.setDate(d.getDate()+1); setCurrentDate(d); };

  const dayAppts = useMemo(() => {
    const ds = currentDate.toDateString();
    return appointments.filter(a => new Date(a.start_time).toDateString()===ds);
  }, [appointments, currentDate]);

  const filtered = useMemo(() =>
    dayAppts
      .filter(a => statusFilter==="all" || a.status===statusFilter)
      .sort((a,b) => new Date(a.start_time).getTime()-new Date(b.start_time).getTime()),
    [dayAppts, statusFilter]
  );

  const stats = useMemo(() => ({
    total: dayAppts.length,
    scheduled: dayAppts.filter(a=>a.status==="scheduled"||a.status==="confirmed").length,
    checked_in: dayAppts.filter(a=>a.status==="checked_in").length,
    in_progress: dayAppts.filter(a=>a.status==="in_progress").length,
    completed: dayAppts.filter(a=>a.status==="completed").length,
    no_show: dayAppts.filter(a=>a.status==="no_show").length,
  }), [dayAppts]);

  const toggleRow = (id:string) => setExpandedId(p => p===id ? null : id);

  if (isLoading) return <div style={{padding:40,textAlign:"center"}}><Loader /></div>;
  if (error) return <div style={{padding:32,color:"#dc2626"}}>Error loading appointments: {error}</div>;

  return (
    <div className="sch-page">

      {/* date nav bar */}
      <div className="sch-datebar">
        <button className="sch-nav-btn" onClick={prevDay}><i className="fa fa-chevron-left"/></button>
        <div className="sch-date-label">
          {fmtDay(currentDate)}
          <span className="sch-date-sub">{fmtDate(currentDate)}</span>
        </div>
        <button className="sch-nav-btn" onClick={nextDay}><i className="fa fa-chevron-right"/></button>

        <div className="sch-view-toggle" style={{marginLeft:"auto"}}>
          {(["day","week","month"] as ViewMode[]).map(v => (
            <button key={v} className={`sch-view-btn ${view===v?"active":""}`} onClick={()=>setView(v)}>
              {v.charAt(0).toUpperCase()+v.slice(1)}
            </button>
          ))}
        </div>
        <button className="sch-today-btn" onClick={()=>setCurrentDate(new Date())}>Today</button>
        <button className="sch-filter-btn">
          <i className="fa fa-filter" style={{fontSize:10}}/> All Appointments <i className="fa fa-chevron-down" style={{fontSize:9}}/>
        </button>
        <Link to="/book-appointment" style={{textDecoration:"none",background:"#0891b2",color:"#fff",borderColor:"#0891b2"}} className="sch-filter-btn">
          <i className="fa fa-plus"/> New
        </Link>
      </div>

      {/* stats row */}
      <div className="sch-stats">
        {[
          {cls:"total",    label:"Total",      val:stats.total,      key:"all"},
          {cls:"scheduled",label:"Scheduled",  val:stats.scheduled,  key:"scheduled"},
          {cls:"checked-in",label:"Checked In",val:stats.checked_in, key:"checked_in"},
          {cls:"in-progress",label:"In Progress",val:stats.in_progress,key:"in_progress"},
          {cls:"completed",label:"Completed",  val:stats.completed,  key:"completed"},
          {cls:"no-show",  label:"No-Show",    val:stats.no_show,    key:"no_show"},
        ].map(s => (
          <div
            key={s.key}
            className={`sch-stat ${s.cls} ${statusFilter===s.key?"active":""}`}
            onClick={()=>setStatusFilter(statusFilter===s.key as StatusFilter ? "all" : s.key as StatusFilter)}
          >
            <div className="sch-stat-val">{s.val}</div>
            <div className="sch-stat-lbl">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── DAY VIEW ── */}
      {view==="day" && (
        <div className="sch-list">
          {filtered.length===0 && (
            <div className="sch-empty">
              <i className="fa fa-calendar-times"/>
              <h3>No appointments</h3>
              <p>No appointments {statusFilter!=="all"?`with status "${SLABELS[statusFilter]}" `:""}for {fmtDate(currentDate)}.</p>
              <Link to="/book-appointment" style={{color:"#0891b2",fontSize:14}}>+ Book an appointment</Link>
            </div>
          )}

          {filtered.map(appt => {
            const isExp = expandedId===appt.id;
            const mock = MOCK_DATA[appt.patient_last_name] || DEFAULT_MOCK;
            const initials = getInits(appt.patient_first_name, appt.patient_last_name);
            const avColor = getAvColor(appt.patient_first_name+appt.patient_last_name);
            const sCls = SCLS[appt.status]||"scheduled";
            const locType = appt.location_type||"in_person";
            const locIcon = LICON[appt.location||""] || LICON[locType] || "fa-hospital-alt";

            return (
              <div key={appt.id} className="appt-row-wrap">
                <div
                  className={`appt-row status-${sCls} ${isExp?"expanded":""}`}
                  onClick={()=>toggleRow(appt.id)}
                  data-testid={`appt-row-${appt.id}`}
                >
                  <div className="appt-toggle">
                    <i className={`fa fa-chevron-${isExp?"down":"right"}`}/>
                  </div>
                  <div className="appt-time">
                    <span className="appt-time-main">{fmtTime(appt.start_time)}</span>
                    <span className="appt-time-dur">{fmtDur(appt.start_time,appt.end_time)}</span>
                  </div>
                  <div className="appt-av" style={{background:avColor}}>{initials}</div>
                  <div className="appt-patient">
                    <div className="appt-patient-name">{appt.patient_first_name} {appt.patient_last_name}</div>
                    <div className="appt-patient-meta">{mock.age}y / {mock.sex}</div>
                  </div>
                  <div className="appt-type">
                    <span className="appt-type-tag">{appt.condition_type}</span>
                  </div>
                  <div className="appt-reason">{appt.reason}</div>
                  <div className="appt-status">
                    <span className={`status-badge ${sCls}`}>{SLABELS[appt.status]||appt.status}</span>
                  </div>
                  <div className="appt-loc">
                    <i className={`fa ${locIcon}`}/>
                    {appt.location||(locType==="telehealth"?"Virtual":locType==="phone"?"Phone":"In Person")}
                  </div>
                </div>

                {isExp && (
                  <div className="appt-expanded">
                    <div className="appt-detail-panels">
                      {/* Vitals */}
                      <div className="detail-panel">
                        <div className="detail-panel-title vitals-icon"><i className="fa fa-heartbeat"/> Vitals</div>
                        <div className="vitals-grid">
                          <div className="vital-item"><div className="vital-label">BP</div><div className="vital-val">{mock.vitals.bp}</div></div>
                          <div className="vital-item"><div className="vital-label">HR</div><div className="vital-val">{mock.vitals.hr}</div></div>
                          <div className="vital-item"><div className="vital-label">Temp</div><div className="vital-val">{mock.vitals.temp}</div></div>
                          <div className="vital-item"><div className="vital-label">O₂</div><div className="vital-val">{mock.vitals.spo2}</div></div>
                        </div>
                      </div>

                      {/* Medications */}
                      <div className="detail-panel">
                        <div className="detail-panel-title meds-icon"><i className="fa fa-pills"/> Medications</div>
                        {mock.medications.length===0
                          ? <span style={{color:"#9ca3af",fontSize:12}}>No current medications</span>
                          : mock.medications.map((m,i)=><div key={i} className="med-item">{m}</div>)}
                      </div>

                      {/* Allergies */}
                      <div className="detail-panel">
                        <div className="detail-panel-title allergy-icon"><i className="fa fa-exclamation-triangle"/> Allergies</div>
                        {mock.allergies.length===0
                          ? <span style={{color:"#9ca3af",fontSize:12}}>NKDA</span>
                          : mock.allergies.map((a,i)=>(
                            <span key={i} className="allergy-chip"><i className="fa fa-exclamation-circle"/>{a}</span>
                          ))}
                      </div>

                      {/* Diagnoses */}
                      <div className="detail-panel">
                        <div className="detail-panel-title diag-icon"><i className="fa fa-stethoscope"/> Diagnoses</div>
                        {mock.diagnoses.length===0
                          ? <span style={{color:"#9ca3af",fontSize:12}}>No active diagnoses</span>
                          : mock.diagnoses.map((d,i)=><div key={i} style={{fontSize:12,color:"#374151",marginBottom:4}}>{d}</div>)}
                      </div>

                      {/* Notes */}
                      {mock.notes && (
                        <div className="detail-panel notes-panel">
                          <div className="detail-panel-title notes-icon"><i className="fa fa-sticky-note"/> Notes</div>
                          <div className="notes-text">{mock.notes}</div>
                        </div>
                      )}
                    </div>

                    {/* action buttons */}
                    <div className="appt-actions">
                      <button className="appt-action-btn primary"><i className="fa fa-file-medical"/> Open Chart</button>
                      {(appt.status==="scheduled"||appt.status==="confirmed") && (
                        <button className="appt-action-btn success"><i className="fa fa-user-check"/> Check In</button>
                      )}
                      {appt.status==="checked_in" && (
                        <button className="appt-action-btn primary"><i className="fa fa-play-circle"/> Start Visit</button>
                      )}
                      {appt.status==="in_progress" && (
                        <button className="appt-action-btn success"><i className="fa fa-check-circle"/> Complete Visit</button>
                      )}
                      <button className="appt-action-btn"><i className="fa fa-edit"/> Edit</button>
                      <button className="appt-action-btn"><i className="fa fa-video"/> Telehealth</button>
                      {appt.status!=="no_show"&&appt.status!=="completed" && (
                        <button className="appt-action-btn warning"><i className="fa fa-times-circle"/> No Show</button>
                      )}
                      <button className="appt-action-btn" style={{marginLeft:"auto"}}><i className="fa fa-print"/> Print</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {view==="week" && (
        <WeekView date={currentDate} appointments={appointments} onDayClick={d=>{setCurrentDate(d);setView("day");}}/>
      )}
      {view==="month" && (
        <MonthView date={currentDate} appointments={appointments} onDayClick={d=>{setCurrentDate(d);setView("day");}}/>
      )}
    </div>
  );
};

/* ── WEEK VIEW ─────────────────────────────────────────── */
const WeekView: React.FC<{date:Date; appointments:any[]; onDayClick:(d:Date)=>void}> = ({date, appointments, onDayClick}) => {
  const ws = new Date(date); ws.setDate(date.getDate()-date.getDay());
  const days = Array.from({length:7},(_,i)=>{const d=new Date(ws);d.setDate(ws.getDate()+i);return d;});
  return (
    <div style={{overflowX:"auto", flex:1}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1,background:"#e5e7eb",minWidth:700}}>
        {days.map((d,i) => {
          const ds=d.toDateString();
          const da=appointments.filter(a=>new Date(a.start_time).toDateString()===ds);
          const isToday=d.toDateString()===new Date().toDateString();
          return (
            <div key={i} onClick={()=>onDayClick(d)} style={{background:"#fff",padding:"10px 8px",minHeight:140,cursor:"pointer"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                <span style={{fontSize:11,color:"#9ca3af"}}>{d.toLocaleDateString("en-US",{weekday:"short"})}</span>
                <span style={{width:24,height:24,borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",background:isToday?"#0891b2":"none",color:isToday?"#fff":"#374151",fontSize:12,fontWeight:600}}>{d.getDate()}</span>
              </div>
              {da.slice(0,3).map(a=>(
                <div key={a.id} style={{fontSize:10,padding:"2px 6px",borderRadius:4,marginBottom:2,background:a.status==="checked_in"?"#dbeafe":a.status==="in_progress"?"#ede9fe":"#f3f4f6",color:a.status==="checked_in"?"#1d4ed8":a.status==="in_progress"?"#7e22ce":"#374151",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {fmtTime(a.start_time)} {a.patient_first_name} {a.patient_last_name}
                </div>
              ))}
              {da.length>3 && <div style={{fontSize:10,color:"#0891b2",padding:"2px 6px"}}>+{da.length-3} more</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ── MONTH VIEW ─────────────────────────────────────────── */
const MonthView: React.FC<{date:Date; appointments:any[]; onDayClick:(d:Date)=>void}> = ({date, appointments, onDayClick}) => {
  const y=date.getFullYear(),m=date.getMonth();
  const firstDay=new Date(y,m,1).getDay();
  const dim=new Date(y,m+1,0).getDate();
  const cells:(Date|null)[]=[...Array(firstDay).fill(null),...Array.from({length:dim},(_,i)=>new Date(y,m,i+1))];
  return (
    <div style={{padding:12,flex:1}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:0,background:"#fff",border:"1px solid #e5e7eb",borderRadius:8,overflow:"hidden"}}>
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>(
          <div key={d} style={{textAlign:"center",padding:"8px 4px",fontSize:11,fontWeight:600,color:"#6b7280",background:"#f9fafb",borderBottom:"1px solid #e5e7eb"}}>{d}</div>
        ))}
        {cells.map((d,i)=>{
          if(!d) return <div key={i} style={{background:"#fafafa",borderRight:"1px solid #e5e7eb",borderBottom:"1px solid #e5e7eb",minHeight:80}}/>;
          const ds=d.toDateString();
          const da=appointments.filter(a=>new Date(a.start_time).toDateString()===ds);
          const isToday=ds===new Date().toDateString();
          const isSel=ds===date.toDateString();
          return (
            <div key={i} onClick={()=>onDayClick(d)} style={{padding:"6px",minHeight:80,borderRight:"1px solid #e5e7eb",borderBottom:"1px solid #e5e7eb",cursor:"pointer",background:isSel?"#f0fffe":"#fff"}}>
              <div style={{width:24,height:24,borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:4,background:isToday?"#0891b2":"none",color:isToday?"#fff":"#374151",fontSize:12,fontWeight:600}}>{d.getDate()}</div>
              {da.slice(0,2).map(a=>(
                <div key={a.id} style={{fontSize:10,padding:"1px 5px",borderRadius:3,marginBottom:2,background:a.status==="checked_in"?"#dbeafe":a.status==="in_progress"?"#ede9fe":"#f3f4f6",color:"#374151",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {a.patient_first_name[0]}. {a.patient_last_name}
                </div>
              ))}
              {da.length>2 && <div style={{fontSize:9,color:"#0891b2"}}>+{da.length-2} more</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarPage;
