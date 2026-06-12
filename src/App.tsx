import React, { useState, useMemo, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot, writeBatch, getDocs, query } from 'firebase/firestore';
import { 
  Users, Building2, Calendar, FileText, Search, Plus, Upload, Download,
  BookOpen, Clock, CheckCircle2, XCircle, ArrowUpDown, AlertCircle,
  Edit2, Trash2, MapPin, ListTodo, Presentation, Camera,
  Shield, Award, DollarSign, UserCheck, PenTool, ClipboardCheck, Database, Settings, Briefcase, DownloadCloud,
  Send, Inbox, Lock, Unlock, KeyRound, Mail
} from 'lucide-react';

// --- MOCK COMPONENTS ---
const AIAssistant = () => (
  <div className="mt-8 p-6 bg-slate-100 rounded-2xl border border-slate-200 border-dashed text-center">
    <h3 className="text-slate-700 font-bold mb-2">AI Assistant Module</h3>
    <p className="text-sm text-slate-500">Komponen ini merupakan placeholder untuk file eksternal <code>./AIAssistant</code> Anda.</p>
  </div>
);

// --- FIREBASE CONFIGURATION (Eksternal Milik User) ---
const firebaseConfig = {
  apiKey: "AIzaSyAgZUtc5aZguYz_MW5zISkuLvDgPmDixfg",
  authDomain: "meratus-frd-lms-10276.firebaseapp.com",
  projectId: "meratus-frd-lms-10276",
  storageBucket: "meratus-frd-lms-10276.firebasestorage.app",
  messagingSenderId: "845694770386",
  appId: "1:845694770386:web:f103c31b21d082c8fd610b",
  measurementId: "G-KEV4HZQ53M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Helper function untuk mengarah kembali ke ROOT collection database Anda
const getColRef = (colName) => collection(db, colName);
const getDocRef = (colName, docId) => doc(db, colName, docId.toString());

// --- CONSTANTS ---
const SBU_OPTIONS = [
  "SBU - AGENCY HMM", "SBU - ASSET & CHARTER", "SBU - ASSET PROPERTY", "SBU - CREWING",
  "SBU - DRYBULK - MDM", "SBU - INSURANCE", "SBU - LINER - COMMERCIAL", "SBU - LINER - INTERNATIONAL",
  "SBU - LINER - OPS", "SBU - LINER - TRADE", "SBU - LOGISTICS", "SBU - MDI", "SBU - MSM", "SBU - MTM",
  "SBU - TERMINAL - CLC", "SBU - TERMINAL - MPI", "SBU - TERMINAL - MSA", "SBU - TERMINAL - NPTI",
  "SBU - TERMINAL - OJA", "SBU - TRUCKING", "SBU - WORKSHOP"
];

const SFU_OPTIONS = [
  "SFU - BUSINESS DEVELOPMENT", "SFU - BUSINESS PROCESS MANAGEMENT", "SFU - CORP COMMUNICATION",
  "SFU - DIGITAL FACTORY", "SFU - DIR OFFICE", "SFU - ENERGY SOURCING", "SFU - FIN & ACC",
  "SFU - GA", "SFU - HRD", "SFU - IA", "SFU - IT", "SFU - LEGAL", "SFU - PROCUREMENT", "SFU - PROCUREMENT MSM"
];

// --- ICON RENDERER HELPER ---
const RenderIcon = ({ name, className }) => {
  switch(name) {
    case 'book': return <BookOpen className={className} />;
    case 'database': return <Database className={className} />;
    case 'usercheck': return <UserCheck className={className} />;
    case 'pen': return <PenTool className={className} />;
    case 'presentation': return <Presentation className={className} />;
    case 'clipboard': return <ClipboardCheck className={className} />;
    case 'dollar': return <DollarSign className={className} />;
    case 'filetext': return <FileText className={className} />;
    case 'users': return <Users className={className} />;
    case 'settings': return <Settings className={className} />;
    case 'clock': return <Clock className={className} />;
    case 'camera': return <Camera className={className} />;
    default: return <ListTodo className={className} />;
  }
};

const colorClasses = {
  slate: 'text-slate-700 bg-slate-50 border-slate-200',
  blue: 'text-blue-700 bg-blue-50 border-blue-200',
  indigo: 'text-indigo-700 bg-indigo-50 border-indigo-200',
  amber: 'text-amber-700 bg-amber-50 border-amber-200',
  teal: 'text-teal-700 bg-teal-50 border-teal-200',
  purple: 'text-purple-700 bg-purple-50 border-purple-200',
  emerald: 'text-emerald-700 bg-emerald-50 border-emerald-200',
};

// --- BADGE HELPER ---
const getStatusBadge = (status) => {
  switch(status) {
    case 'Accepted': case 'Approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'Fulfilled': return 'bg-teal-100 text-teal-700 border-teal-200';
    case 'Completed': return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'Process': case 'Ongoing': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Pending': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Rejected': case 'Reject Offer': case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
    case 'Planned': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'SEDANG BERLANGSUNG': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'TIDAK AKTIF': return 'bg-slate-100 text-slate-600 border-slate-200';
    default: return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

// --- HELPER PARSE TANGGAL ---
const parseDateStr = (dateStr) => {
  if (!dateStr || dateStr === '-') return 0;
  let d = new Date(dateStr).getTime();
  if (!isNaN(d)) return d;
  
  const lowerStr = dateStr.toLowerCase();
  const yearMatch = lowerStr.match(/20\d{2}/);
  if (!yearMatch) return 0; 
  
  const year = parseInt(yearMatch[0]);
  let month = 0;
  const months = { 'januari': 0, 'februari': 1, 'maret': 2, 'april': 3, 'mei': 4, 'juni': 5, 'juli': 6, 'agustus': 7, 'september': 8, 'oktober': 9, 'november': 10, 'desember': 11, 'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5, 'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11 };
  for (const [mName, mNum] of Object.entries(months)) {
    if (lowerStr.includes(mName)) { month = mNum; break; }
  }
  
  let day = 1;
  const dayMatch = lowerStr.match(/\b\d{1,2}\b/);
  if (dayMatch) day = parseInt(dayMatch[0]);
  
  return new Date(year, month, day).getTime();
};

export default function InternshipManagement() {
  // -- AUTH STATES --
  const [authUser, setAuthUser] = useState(null);

  // -- GATEKEEPING STATES --
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  // -- MAIN TABS --
  const [activeTab, setActiveTab] = useState('requests');
  
  // -- DATA STATES --
  const [interns, setInterns] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [visitContacts, setVisitContacts] = useState([]);
  const [siteVisits, setSiteVisits] = useState([]);
  const [internRequests, setInternRequests] = useState([]);

  const [internSOP, setInternSOP] = useState([]);
  const [visitSOP, setVisitSOP] = useState([]);

  // -- MODAL STATES (Global UI) --
  const [alertMessage, setAlertMessage] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  // --- FIREBASE AUTH INITIALIZATION ---
  useEffect(() => {
    // Memaksa Anonymous Login langsung ke project Firebase Anda (mengabaikan token platform)
    signInAnonymously(auth).catch(console.error);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
    });
    return () => unsubscribe();
  }, []);

  // --- FIREBASE REALTIME SYNC ---
  useEffect(() => {
    if (!db || !authUser) return; 
    
    try {
      const unsubs = [
        onSnapshot(getColRef('interns'), snap => {
          if (!snap.empty) setInterns(snap.docs.map(d => d.data()).sort((a, b) => b.id - a.id));
        }, err => console.error(err)),
        onSnapshot(getColRef('agreements'), snap => {
          if (!snap.empty) setAgreements(snap.docs.map(d => d.data()).sort((a, b) => b.id - a.id));
        }, err => console.error(err)),
        onSnapshot(getColRef('schedules'), snap => {
          if (!snap.empty) setSchedules(snap.docs.map(d => d.data()).sort((a, b) => b.id - a.id));
        }, err => console.error(err)),
        onSnapshot(getColRef('contacts'), snap => {
          if (!snap.empty) setContacts(snap.docs.map(d => d.data()).sort((a, b) => b.id - a.id));
        }, err => console.error(err)),
        onSnapshot(getColRef('siteVisits'), snap => {
          if (!snap.empty) setSiteVisits(snap.docs.map(d => d.data()).sort((a, b) => b.id - a.id));
        }, err => console.error(err)),
        onSnapshot(getColRef('visitContacts'), snap => {
          if (!snap.empty) setVisitContacts(snap.docs.map(d => d.data()).sort((a, b) => b.id - a.id));
        }, err => console.error(err)),
        onSnapshot(getColRef('internRequests'), snap => {
          if (!snap.empty) setInternRequests(snap.docs.map(d => d.data()).sort((a, b) => b.id - a.id));
        }, err => console.error(err)),
        onSnapshot(getColRef('internSOP'), snap => {
          if (!snap.empty) setInternSOP(snap.docs.map(d => d.data()).sort((a, b) => a.id - b.id));
        }, err => console.error(err)),
        onSnapshot(getColRef('visitSOP'), snap => {
          if (!snap.empty) setVisitSOP(snap.docs.map(d => d.data()).sort((a, b) => a.id - b.id));
        }, err => console.error(err))
      ];

      return () => unsubs.forEach(unsub => unsub());
    } catch (e) {
      console.log("Firebase sync warning:", e);
    }
  }, [authUser]);

  // -- PIPELINE FILTERS --
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [universityFilter, setUniversityFilter] = useState('All');
  const [sbuFilter, setSbuFilter] = useState('All');
  const [timelineFilter, setTimelineFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState(null);
  
  // -- REQUESTS TAB FILTER & STATE --
  const [requestSubTab, setRequestSubTab] = useState('portal');
  const [requestSearchTerm, setRequestSearchTerm] = useState('');
  const [requestStatusFilter, setRequestStatusFilter] = useState('All');
  const [requestSortConfig, setRequestSortConfig] = useState('Urgent');
  const [requestPaymentType, setRequestPaymentType] = useState('Unpaid');

  // -- MODALS --
  const [isInternModalOpen, setIsInternModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingIntern, setEditingIntern] = useState(null);
  const [excelData, setExcelData] = useState('');
  
  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);
  const [editingAgreement, setEditingAgreement] = useState(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState(null);
  const [isVisitContactModalOpen, setIsVisitContactModalOpen] = useState(false);
  const [editingVisitContact, setEditingVisitContact] = useState(null);

  const [isSopModalOpen, setIsSopModalOpen] = useState(false);
  const [editingSop, setEditingSop] = useState(null);
  const [editingSopType, setEditingSopType] = useState('intern');

  const [itemToDelete, setItemToDelete] = useState(null);

  // --- ADMIN LOGIN LOGIC ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === 'MeratusAcademy') {
      setIsAdmin(true);
      setIsLoginModalOpen(false);
      setPasswordInput('');
      setActiveTab('pipeline');
    } else {
      setAlertMessage("Password salah. Akses ditolak.");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setActiveTab('requests');
    setRequestSubTab('portal');
  };

  // --- DYNAMIC JSPDF LOADER ---
  const loadJsPDF = async () => {
    if (window.jspdf) return window.jspdf.jsPDF;
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.onload = () => resolve(window.jspdf.jsPDF);
      script.onerror = () => {
        setAlertMessage("Gagal memuat sistem pembuat PDF. Pastikan koneksi internet Anda stabil.");
        reject(new Error("Failed to load jsPDF script"));
      };
      document.body.appendChild(script);
    });
  };

  // --- HELPER FORMAT TANGGAL ---
  const formatDateID = (dateStr) => {
    if (!dateStr || dateStr === '-') return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${String(date.getDate()).padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // --- EFFECT AUTO UPDATE STATUS MAGANG ---
  useEffect(() => {
    if (!db || !authUser || interns.length === 0) return;
    
    const todayZero = new Date();
    todayZero.setHours(0,0,0,0);
    const nowTime = todayZero.getTime();
    
    const updates = [];
    interns.forEach(intern => {
      if (intern.status === 'Accepted') {
        const joinTime = parseDateStr(intern.joinDate);
        const finishTime = parseDateStr(intern.finishDate);
        
        if (joinTime > 0 && finishTime > 0) {
          let newStatus = intern.internshipStatus;
          
          if (nowTime >= finishTime) {
            if (newStatus !== 'Finish') newStatus = 'Finish';
          } else if (nowTime >= joinTime && nowTime < finishTime) {
            if (newStatus !== 'Active' && newStatus !== 'Resigned' && newStatus !== 'Finish') newStatus = 'Active';
          }
          
          if (newStatus !== intern.internshipStatus) {
            updates.push({ ...intern, internshipStatus: newStatus });
          }
        }
      }
    });
    
    if (updates.length > 0) {
      const batch = writeBatch(db);
      updates.forEach(u => {
        batch.set(getDocRef('interns', u.id), u);
      });
      batch.commit().catch(e => console.error("Auto-update status failed:", e));
    }
  }, [interns, db, authUser]);

  // --- DRAFT EMAIL LOGIC ---
  const handleDraftEmail = async (intern) => {
    if (!intern.email || intern.email.trim() === '-' || intern.email.trim() === '') {
        setAlertMessage("Gagal: Email mahasiswa belum diisi. Silakan edit data intern (Klik icon pensil) dan tambahkan email terlebih dahulu.");
        return;
    }

    // Dynamic Fields Data: Kini mengambil dari group (SBU/SFU) untuk posisi magang
    const deptName = intern.group && intern.group !== '-' ? intern.group : 'Divisi Terkait';
    const joinStr = formatDateID(intern.joinDate) !== '-' ? formatDateID(intern.joinDate) : '(Tanggal Menyusul)';
    const finishStr = formatDateID(intern.finishDate) !== '-' ? formatDateID(intern.finishDate) : '(Tanggal Menyusul)';
    
    // Subject construction
    const subject = `Internship Administration – Meratus Group (${deptName})`;
    
    // Body construction
    const body = `Dear rekan mahasiswa,\n
Selamat!
Sehubungan dengan diterimanya Saudara/i sebagai peserta magang di Meratus Group (${deptName}) untuk periode ${joinStr} - ${finishStr}, kami mengucapkan terima kasih atas ketertarikan dan kesediaan Saudara/i untuk bergabung bersama kami.

Sebagai bagian dari proses administrasi, kami mohon bantuan Saudara/i untuk melengkapi beberapa dokumen berikut:

    1. Form Non-Disclosure Agreement (NDA)
    2. Form Data Diri Peserta Magang

Silakan unduh dan isi formulir melalui tautan berikut:
https://bit.ly/administrasi-intern

Mohon Saudara/i dapat mengisi dan mengumpulkan formulir tersebut sesuai dengan ketentuan yang tertera.
Adapun batas waktu pengumpulan dokumen adalah paling lambat hari ${joinStr}.

Apabila terdapat pertanyaan lebih lanjut terkait pengisian formulir, Saudara/i dapat menghubungi tim Human Resources melalui kontak yang tersedia.

Demikian kami sampaikan. Atas perhatian dan kerja sama Saudara/i, kami ucapkan terima kasih. Kami menantikan kehadiran Saudara/i sebagai bagian dari proses pembelajaran dan pengembangan bersama kami.

Hormat kami,
Tim Human Resources
Meratus Group
`;

    // Deeplink Compose untuk Outlook Web (Office 365)
    const outlookWebLink = `https://outlook.cloud.microsoft/mail/deeplink/compose?to=${encodeURIComponent(intern.email)}&cc=meratus.academy@meratus.com&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Buka Outlook Web di tab baru
    window.open(outlookWebLink, '_blank');

    // Update Status tracking ke Firestore bahwa email sudah digenerate/didraft
    try {
        if (!authUser) return; // Prevent unauthorized writes
        const updatedIntern = { ...intern, emailSent: true };
        setInterns(prev => prev.map(i => i.id === intern.id ? updatedIntern : i));
        if (db) {
            await setDoc(getDocRef('interns', intern.id), updatedIntern);
        }
    } catch (error) {
        console.error("Gagal update status tracking email:", error);
    }
  };

  // --- PDF GENERATOR (SURAT KETERANGAN MAGANG) ---
  const handleDownloadSKM = async (intern) => {
    try {
      const jsPDF = await loadJsPDF();
      const doc = new jsPDF();
      
      const margin = 25;
      let y = 40;

      const currentDate = new Date();
      const monthStr = String(currentDate.getMonth() + 1).padStart(2, '0');
      const yearStr = String(currentDate.getFullYear()).slice(-2);
      const seqDocNum = Math.floor(Math.random() * 900 + 100).toString().padStart(3, '0'); 
      const docNumber = `${seqDocNum}/HRD-MA/SKM/${monthStr}${yearStr}`;
      
      const todayFormatted = formatDateID(currentDate);
      const joinStr = formatDateID(intern.joinDate);
      const finishStr = formatDateID(intern.finishDate);

      // Document Settings
      doc.setFont("times", "normal");
      doc.setFontSize(12);

      // Header Section
      doc.text(`No.: ${docNumber}`, margin, y); 
      doc.text(`Surabaya, ${todayFormatted}`, 185, y, { align: 'right' });
      
      y += 8;
      doc.text(`Hal: Surat Keterangan Magang di PT. Meratus Line`, margin, y);
      
      y += 15;
      doc.text(`Kepada Yth.`, margin, y); y += 6;
      doc.text(`Ketua Program Studi / Jurusan ${intern.department}`, margin, y); y += 6;
      doc.text(`${intern.university}`, margin, y); y += 12;

      // Body Section
      doc.text(`Dengan hormat,`, margin, y); y += 8;
      doc.text(`Bersama ini kami menyampaikan bahwa:`, margin, y); y += 10;

      // Identity Section
      doc.text(`Nama`, margin + 10, y);
      doc.text(`: ${intern.name}`, margin + 35, y); y += 7;
      doc.text(`NIM/NIS`, margin + 10, y);
      doc.text(`: ${intern.nim || '-'}`, margin + 35, y); y += 12;

      // Content Sentences
      const body1 = `telah melakukan program magang di PT. Meratus Line dengan penempatan di departemen ${intern.group} terhitung sejak tanggal ${joinStr} - ${finishStr}.`;
      doc.text(body1, margin, y, { maxWidth: 160, align: 'justify' });
      y += (doc.splitTextToSize(body1, 160).length * 6) + 4;

      const body2 = `Selama melakukan program magang, yang bersangkutan telah melakukan tugas dan tanggung jawabnya dengan baik.`;
      doc.text(body2, margin, y, { maxWidth: 160, align: 'justify' });
      y += (doc.splitTextToSize(body2, 160).length * 6) + 4;

      const body3 = `Demikian surat keterangan program magang ini dibuat untuk dapat dipergunakan sebagaimana mestinya.`;
      doc.text(body3, margin, y, { maxWidth: 160, align: 'justify' });
      y += (doc.splitTextToSize(body3, 160).length * 6) + 20;

      // Sign-off
      doc.text(`Hormat kami,`, margin, y); y += 25;
      doc.setFont("times", "bold");
      doc.text(`Andrew Fatah Erlangga`, margin, y); y += 6;
      doc.setFont("times", "normal");
      doc.text(`Head of Learning, Culture & People Development`, margin, y); y += 6;
      doc.text(`PT. Meratus Line`, margin, y);

      // Save PDF
      doc.save(`SKM_${intern.name.replace(/\s+/g, '_')}_${yearStr}.pdf`);

    } catch (error) {
      console.error("PDF Generation error: ", error);
      setAlertMessage("Terjadi kesalahan saat memproses PDF.");
    }
  };

  // --- PIPELINE TIMELINE LOGIC ---
  const uniqueUniversities = useMemo(() => Array.from(new Set(interns.map(i => i.university))).filter(u => u !== '-'), [interns]);
  const uniqueSBUs = useMemo(() => Array.from(new Set(interns.map(i => i.group))).filter(g => g !== '-'), [interns]);

  const todayZero = new Date();
  todayZero.setHours(0,0,0,0);

  const isFinished = (intern) => {
    if (intern.internshipStatus === 'Finish') return true;
    if (!intern.finishDate || intern.finishDate === '-') return false;
    const finishTime = parseDateStr(intern.finishDate);
    return finishTime > 0 && finishTime < todayZero.getTime();
  };

  const isIncoming = (intern) => {
    if (intern.status !== 'Accepted') return false;
    if (!intern.joinDate || intern.joinDate === '-') return false;
    const joinTime = parseDateStr(intern.joinDate);
    return joinTime > 0 && joinTime > todayZero.getTime();
  };

  const isActive = (intern) => {
    if (intern.status !== 'Accepted') return false;
    if (isFinished(intern)) return false;
    if (isIncoming(intern)) return false;
    return true;
  };

  const isFinishingSoon = (finishDateStr) => {
    if (!finishDateStr || finishDateStr === '-') return false;
    const finishTime = parseDateStr(finishDateStr);
    if (finishTime === 0) return false;
    const diffDays = Math.ceil((finishTime - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  };

  const canDownloadSKM = (intern) => {
    if (intern.internshipStatus === 'Finish') return true;
    if (intern.status !== 'Accepted') return false;
    if (!intern.finishDate || intern.finishDate === '-') return false;
    
    const finishTime = parseDateStr(intern.finishDate);
    if (finishTime === 0) return false;
    
    const todayZeroSKM = new Date();
    todayZeroSKM.setHours(0,0,0,0);
    
    const diffDays = Math.ceil((finishTime - todayZeroSKM.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 5; 
  };

  const filteredAndSortedInterns = useMemo(() => {
    let result = [...interns];
    if (searchTerm) result = result.filter(intern => intern.name.toLowerCase().includes(searchTerm.toLowerCase()) || intern.university.toLowerCase().includes(searchTerm.toLowerCase()));
    if (statusFilter !== 'All') result = result.filter(intern => intern.status === statusFilter);
    if (universityFilter !== 'All') result = result.filter(intern => intern.university === universityFilter);
    if (sbuFilter !== 'All') result = result.filter(intern => intern.group === sbuFilter);
    
    if (timelineFilter !== 'All') {
      result = result.filter(intern => {
        if (timelineFilter === 'Incoming') return isIncoming(intern);
        if (timelineFilter === 'Active') return isActive(intern);
        if (timelineFilter === 'Finishing Soon') return intern.status === 'Accepted' && isFinishingSoon(intern.finishDate);
        if (timelineFilter === 'Finished') return isFinished(intern);
        return true;
      });
    }
    
    if (sortConfig !== null) {
      result.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        if (sortConfig.key === 'joinDate' || sortConfig.key === 'finishDate') {
          const timeA = parseDateStr(valA);
          const timeB = parseDateStr(valB);

          if (timeA < timeB) return sortConfig.direction === 'asc' ? -1 : 1;
          if (timeA > timeB) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
        }

        valA = valA ? valA.toString().toLowerCase() : '';
        valB = valB ? valB.toString().toLowerCase() : '';

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [interns, searchTerm, statusFilter, universityFilter, sbuFilter, timelineFilter, sortConfig]);

  const pipelineStats = useMemo(() => ({
    total: filteredAndSortedInterns.length,
    active: filteredAndSortedInterns.filter(i => isActive(i)).length,
    incoming: filteredAndSortedInterns.filter(i => isIncoming(i)).length,
    finished: filteredAndSortedInterns.filter(i => isFinished(i)).length,
    finishingSoon: filteredAndSortedInterns.filter(i => i.status === 'Accepted' && isFinishingSoon(i.finishDate)).length,
    rejected: filteredAndSortedInterns.filter(i => i.status === 'Rejected' || i.status === 'Reject Offer').length,
  }), [filteredAndSortedInterns]);

  const departmentAbsorption = useMemo(() => {
    const absorption = {};
    let maxCount = 0;
    
    filteredAndSortedInterns.forEach(intern => {
      if (intern.status === 'Accepted' || intern.internshipStatus === 'Active' || intern.internshipStatus === 'Finish') {
        const sbu = intern.group && intern.group !== '-' ? intern.group : 'Unassigned';
        absorption[sbu] = (absorption[sbu] || 0) + 1;
        
        if (absorption[sbu] > maxCount) {
          maxCount = absorption[sbu];
        }
      }
    });
    
    const data = Object.entries(absorption)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); 
      
    return { data, maxCount };
  }, [filteredAndSortedInterns]);

  const requestAdminStats = useMemo(() => ({
    total: internRequests.length,
    pending: internRequests.filter(r => r.status === 'Pending').length,
    approved: internRequests.filter(r => r.status === 'Approved').length,
    rejected: internRequests.filter(r => r.status === 'Rejected').length,
    fulfilled: internRequests.filter(r => r.status === 'Fulfilled').length,
    completed: internRequests.filter(r => r.status === 'Completed').length,
  }), [internRequests]);

  const filteredAndSortedRequests = useMemo(() => {
    let result = [...internRequests];

    if (requestSearchTerm) {
      const lowerSearch = requestSearchTerm.toLowerCase();
      result = result.filter(req => 
        req.requester.toLowerCase().includes(lowerSearch) || 
        req.sbu.toLowerCase().includes(lowerSearch) ||
        req.location.toLowerCase().includes(lowerSearch) ||
        (req.position && req.position.toLowerCase().includes(lowerSearch))
      );
    }

    if (requestStatusFilter !== 'All') {
      result = result.filter(req => req.status === requestStatusFilter);
    }

    result.sort((a, b) => {
      if (requestSortConfig === 'Newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (requestSortConfig === 'Oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (requestSortConfig === 'Urgent') {
        const getDateVal = (req) => {
          if (req.startDate) return new Date(req.startDate).getTime();
          const str = req.timeline || '';
          const lowerStr = str.toLowerCase();
          if (lowerStr.includes('asap') || lowerStr.includes('segera') || lowerStr.includes('urgent')) return 0;
          const months = { 'januari': 0, 'februari': 1, 'maret': 2, 'april': 3, 'mei': 4, 'juni': 5, 'juli': 6, 'agustus': 7, 'september': 8, 'oktober': 9, 'november': 10, 'desember': 11, 'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5, 'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11 };
          let month = 11;
          let year = 2099;
          const yearMatch = lowerStr.match(/20\d{2}/);
          if (yearMatch) year = parseInt(yearMatch[0]);
          for (const [mName, mNum] of Object.entries(months)) {
            if (lowerStr.includes(mName)) { month = mNum; break; }
          }
          return new Date(year, month, 1).getTime();
        };

        const dateA = getDateVal(a);
        const dateB = getDateVal(b);
        
        if (dateA !== dateB) return dateA - dateB;
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return 0;
    });

    return result;
  }, [internRequests, requestSearchTerm, requestStatusFilter, requestSortConfig]);

  const handleSort = (key) => {
    setSortConfig({ key, direction: sortConfig?.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc' });
  };

  // --- EXPORT CSV LOGIC ---
  const handleExportCSV = () => {
    const header = ['NIM', 'Nama', 'Email', 'Universitas', 'Jurusan', 'Status', 'Acceptance / Rejected Letter', 'Group SBU/SFU', 'Supervisor', 'Join Date', 'Finish Date', 'Internship Status', 'Internship Letter', 'Paid / Unpaid', 'Status Draft Email'];
    
    const csvContent = [
      header.join(','),
      ...interns.map(i => [
        `"${i.nim || '-'}"`, 
        `"${i.name}"`, 
        `"${i.email || '-'}"`, 
        `"${i.university}"`, 
        `"${i.department}"`, 
        `"${i.status}"`, 
        `"-"`, 
        `"${i.group}"`, 
        `"${i.supervisor}"`, 
        `"${i.joinDate}"`, 
        `"${i.finishDate}"`, 
        `"${i.internshipStatus}"`,
        `"-"`,
        `"${i.paymentStatus || '-'}"`,
        `"${i.emailSent ? 'Sent' : 'Not Sent'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Pipeline_Interns_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

  // --- FIREBASE CRUD HANDLERS ---
  const executeImportExcel = async () => {
    const rows = excelData.trim().split('\n').filter(r => r.trim() !== '');
    if (rows.length < 2) return setAlertMessage('Format tidak valid. Pastikan ada baris header dan data.');
    
    try {
      if (!authUser) throw new Error("Akses ditolak: User belum terautentikasi.");
      
      const newImportedInterns = rows.slice(1).map((row, index) => {
        const cols = row.split('\t').map(c => c.trim());
        return {
          id: Date.now() + index,
          nim: cols[0] || '-', 
          name: cols[1] || 'Unknown', 
          email: '-', // Default empty since import format might not have it yet
          emailSent: false,
          university: cols[2] || '-', 
          department: cols[3] || '-',
          status: cols[4] || 'Process', 
          group: cols[6] || '-', 
          supervisor: cols[7] || '-',
          joinDate: cols[8] || '-', 
          finishDate: cols[9] || '-', 
          internshipStatus: cols[10] || '-',
          paymentStatus: cols[12] || cols[11] || '-', 
          source: 'import' 
        };
      });

      setInterns(newImportedInterns);

      if (db) {
        const internsRef = getColRef('interns');
        const q = query(internsRef);
        const querySnapshot = await getDocs(q);
        const batch = writeBatch(db);
        
        querySnapshot.forEach((document) => {
          batch.delete(document.ref);
        });

        newImportedInterns.forEach(intern => {
          const docRef = getDocRef('interns', intern.id);
          batch.set(docRef, intern);
        });

        await batch.commit();
      }
      
      setIsImportModalOpen(false); 
      setExcelData('');
      setAlertMessage('Import berhasil! Semua data Pipeline telah ditimpa dengan data dari Excel.');
    } catch (error) {
      console.error("Gagal melakukan overwrite import: ", error);
      setAlertMessage("Terjadi kesalahan sistem saat overwrite data. Pastikan status jaringan dan auth aktif.");
    }
  };

  const handleImportExcel = () => {
    setConfirmAction({
      title: "Peringatan Overwrite",
      message: "Data dari Excel akan di-import. SEMUA data Pipeline sebelumnya akan dihapus dan ditimpa secara total. Lanjutkan?",
      onConfirm: executeImportExcel
    });
  };

  const handleSaveIntern = async (e) => {
    e.preventDefault();
    if (!authUser) return setAlertMessage("Akses ditolak: User belum terautentikasi.");
    
    const formData = new FormData(e.currentTarget);
    const data = {
      id: editingIntern ? editingIntern.id : Date.now(),
      name: formData.get('name'), 
      nim: formData.get('nim') || '-',
      email: formData.get('email') || '',
      emailSent: editingIntern ? editingIntern.emailSent : false,
      university: formData.get('university'),
      department: formData.get('department'), 
      status: formData.get('status'),
      group: formData.get('group') || '-', 
      supervisor: formData.get('supervisor') || '-',
      joinDate: formData.get('joinDate') || '-', 
      finishDate: formData.get('finishDate') || '-',
      internshipStatus: formData.get('internshipStatus') || '-',
      paymentStatus: formData.get('paymentStatus') || '-',
      source: editingIntern?.source || 'system'
    };
    
    setInterns(prev => {
      if (editingIntern) return prev.map(i => i.id === data.id ? data : i);
      return [data, ...prev];
    });

    if (db) {
      try { await setDoc(getDocRef('interns', data.id), data); } catch (e) { console.error(e) }
    }
    setIsInternModalOpen(false);
  };

  const handleSaveRequest = async (e) => {
    e.preventDefault();
    if (!authUser) return setAlertMessage("Akses ditolak: User belum terautentikasi.");
    
    const formData = new FormData(e.currentTarget);
    
    const startDateRaw = formData.get('startDate');
    const endDateRaw = formData.get('endDate');
    const startDateObj = new Date(startDateRaw);
    const endDateObj = new Date(endDateRaw);
    const startStr = startDateObj.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
    const endStr = endDateObj.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
    const timelineStr = `${startStr} - ${endStr}`;

    const paymentType = formData.get('payment');
    const nominal = formData.get('nominal');
    const paymentStr = paymentType === 'Paid' ? `Paid (${nominal})` : 'Unpaid';

    const data = {
      id: Date.now(),
      requester: formData.get('requester'),
      sbu: formData.get('sbu'),
      position: formData.get('position'),
      count: Number(formData.get('count')),
      location: formData.get('location'),
      startDate: startDateRaw, 
      endDate: endDateRaw,
      timeline: timelineStr,
      payment: paymentStr,
      objective: formData.get('objective'),
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    setInternRequests(prev => [data, ...prev]);
    if (db) {
      try { await setDoc(getDocRef('internRequests', data.id), data); } catch (e) { console.error(e) }
    }
    setAlertMessage('Permintaan berhasil diajukan dan masuk ke dalam Request Dashboard!');
    e.target.reset();
    setRequestPaymentType('Unpaid'); 
  };

  const handleUpdateRequestStatus = async (id, newStatus) => {
    if (!authUser) return;
    const req = internRequests.find(r => r.id === id);
    if (!req) return;
    const updated = { ...req, status: newStatus };
    setInternRequests(prev => prev.map(r => r.id === id ? updated : r));
    if (db) {
      try { await setDoc(getDocRef('internRequests', id), updated); } catch (e) { console.error(e) }
    }
  };

  const [partnerSubTab, setPartnerSubTab] = useState('agreements');
  const [contactSearch, setContactSearch] = useState('');

  const partnershipStats = useMemo(() => ({
    totalAgreements: agreements.length,
    activeAgreements: agreements.filter(a => a.status === 'SEDANG BERLANGSUNG').length,
    totalSchedules: schedules.length,
    totalContacts: contacts.length
  }), [agreements, schedules, contacts]);

  const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(contactSearch.toLowerCase()) || c.institution.toLowerCase().includes(contactSearch.toLowerCase()));

  const handleSaveAgreement = async (e) => {
    e.preventDefault();
    if (!authUser) return setAlertMessage("Akses ditolak: User belum terautentikasi.");
    const formData = new FormData(e.currentTarget);
    const data = {
      id: editingAgreement ? editingAgreement.id : Date.now(),
      type: formData.get('type'), status: formData.get('status'),
      pihak1: formData.get('pihak1'), pihak2: formData.get('pihak2'),
      tentang: formData.get('tentang'), nomor: formData.get('nomor'), durasi: formData.get('durasi'),
    };
    
    setAgreements(prev => editingAgreement ? prev.map(i => i.id === data.id ? data : i) : [data, ...prev]);
    if (db) {
      try { await setDoc(getDocRef('agreements', data.id), data); } catch (e) { console.error(e) }
    }
    setIsAgreementModalOpen(false);
  };

  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    if (!authUser) return setAlertMessage("Akses ditolak: User belum terautentikasi.");
    const formData = new FormData(e.currentTarget);
    const selectedMonths = Array.from({length: 12}, (_, i) => i).filter(i => formData.get(`month_${i}`));
    const data = {
      id: editingSchedule ? editingSchedule.id : Date.now(),
      institution: formData.get('institution'), duration: formData.get('duration'),
      startPeriod: formData.get('startPeriod'), notes: formData.get('notes'),
      months: selectedMonths
    };
    
    setSchedules(prev => editingSchedule ? prev.map(i => i.id === data.id ? data : i) : [data, ...prev]);
    if (db) {
      try { await setDoc(getDocRef('schedules', data.id), data); } catch (e) { console.error(e) }
    }
    setIsScheduleModalOpen(false);
  };

  const handleSaveContact = async (e) => {
    e.preventDefault();
    if (!authUser) return setAlertMessage("Akses ditolak: User belum terautentikasi.");
    const formData = new FormData(e.currentTarget);
    const data = {
      id: editingContact ? editingContact.id : Date.now(),
      name: formData.get('name'), department: formData.get('department'),
      institution: formData.get('institution'), contact: formData.get('contact'),
    };
    
    setContacts(prev => editingContact ? prev.map(i => i.id === data.id ? data : i) : [data, ...prev]);
    if (db) {
      try { await setDoc(getDocRef('contacts', data.id), data); } catch (e) { console.error(e) }
    }
    setIsContactModalOpen(false);
  };

  const [visitSubTab, setVisitSubTab] = useState('sop');
  
  const handleSaveVisit = async (e) => {
    e.preventDefault();
    if (!authUser) return setAlertMessage("Akses ditolak: User belum terautentikasi.");
    const formData = new FormData(e.currentTarget);
    const data = {
      id: editingVisit ? editingVisit.id : Date.now(),
      institution: formData.get('institution'), date: formData.get('date'),
      participants: Number(formData.get('participants')), location: formData.get('location'), status: formData.get('status'),
    };
    
    setSiteVisits(prev => editingVisit ? prev.map(i => i.id === data.id ? data : i) : [data, ...prev]);
    if (db) {
      try { await setDoc(getDocRef('siteVisits', data.id), data); } catch (e) { console.error(e) }
    }
    setIsVisitModalOpen(false);
  };

  const handleSaveVisitContact = async (e) => {
    e.preventDefault();
    if (!authUser) return setAlertMessage("Akses ditolak: User belum terautentikasi.");
    const formData = new FormData(e.currentTarget);
    const data = {
      id: editingVisitContact ? editingVisitContact.id : Date.now(),
      name: formData.get('name'), position: formData.get('position'),
      relatedTo: formData.get('relatedTo'), notes: formData.get('notes'),
    };
    
    setVisitContacts(prev => editingVisitContact ? prev.map(i => i.id === data.id ? data : i) : [data, ...prev]);
    if (db) {
      try { await setDoc(getDocRef('visitContacts', data.id), data); } catch (e) { console.error(e) }
    }
    setIsVisitContactModalOpen(false);
  };

  const handleSaveSOP = async (e) => {
    e.preventDefault();
    if (!authUser) return setAlertMessage("Akses ditolak: User belum terautentikasi.");
    const formData = new FormData(e.currentTarget);
    const bulletsRaw = formData.get('bullets');
    const bullets = bulletsRaw ? bulletsRaw.split('\n').filter(b => b.trim() !== '') : [];
    
    const newId = editingSop ? editingSop.id : Date.now();
    const updatedSOP = {
      id: newId,
      title: formData.get('title'),
      description: formData.get('description'),
      highlight: formData.get('highlight'),
      icon: formData.get('icon'),
      color: formData.get('color'),
      bullets: bullets,
    };
    
    if (editingSop?.subSections) {
      try {
        const subSecRaw = formData.get('subSections');
        if (subSecRaw) {
          updatedSOP.subSections = JSON.parse(subSecRaw);
        } else {
          updatedSOP.subSections = editingSop.subSections;
        }
      } catch (err) {
        setAlertMessage('Format JSON Sub-Sections tidak valid! Silakan perbaiki struktur kurung kurawal/siku.');
        return; 
      }
    }

    if (editingSopType === 'intern') {
      setInternSOP(prev => editingSop ? prev.map(i => i.id === newId ? updatedSOP : i) : [...prev, updatedSOP]);
    } else {
      setVisitSOP(prev => editingSop ? prev.map(i => i.id === newId ? updatedSOP : i) : [...prev, updatedSOP]);
    }

    if (db) {
      try { 
        const collectionName = editingSopType === 'intern' ? 'internSOP' : 'visitSOP';
        await setDoc(getDocRef(collectionName, newId), updatedSOP); 
      } catch (e) { console.error(e) }
    }
    
    setIsSopModalOpen(false);
  };

  const executeDelete = async () => {
    if (!itemToDelete || !authUser) return;
    const { type, id } = itemToDelete;
    
    const settersMap = {
      intern: setInterns,
      agreement: setAgreements,
      schedule: setSchedules,
      contact: setContacts,
      visit: setSiteVisits,
      visitContact: setVisitContacts,
      internSOP: setInternSOP,
      visitSOP: setVisitSOP,
      internRequest: setInternRequests
    };

    const collectionMap = {
      intern: 'interns',
      agreement: 'agreements',
      schedule: 'schedules',
      contact: 'contacts',
      visit: 'siteVisits',
      visitContact: 'visitContacts',
      internSOP: 'internSOP',
      visitSOP: 'visitSOP',
      internRequest: 'internRequests'
    };

    settersMap[type](prev => prev.filter(i => i.id !== id));

    if (db) {
      try { await deleteDoc(getDocRef(collectionMap[type], id)); } catch (e) { console.error(e) }
    }

    setItemToDelete(null);
  };

  const currentSop = editingSop || {};

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-screen font-sans text-slate-900 relative">
      
      {/* Global Modals / Toasts */}
      {alertMessage && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Informasi</h3>
            <p className="text-sm text-slate-600 mb-6">{alertMessage}</p>
            <button onClick={() => setAlertMessage(null)} className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-sm hover:bg-blue-700 transition-colors">
              Tutup
            </button>
          </div>
        </div>
      )}

      {confirmAction && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{confirmAction.title || "Konfirmasi"}</h3>
            <p className="text-sm text-slate-600 mb-6">{confirmAction.message}</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmAction(null)} className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors">Batal</button>
              <button onClick={() => { confirmAction.onConfirm(); setConfirmAction(null); }} className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 shadow-sm transition-colors">Lanjutkan</button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section dengan Gatekeeping Logic */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Internship & Visits</h1>
          <p className="text-slate-500 mt-2 max-w-2xl">Platform terpusat untuk mengelola pipeline magang, portal request, partnership universitas, dan site visit.</p>
        </div>
        
        {/* Tombol Auth Admin */}
        <div>
          {!isAdmin ? (
            <button onClick={() => setIsLoginModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
              <Lock className="w-4 h-4 text-slate-400" /> Admin Access
            </button>
          ) : (
            <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 bg-red-50 border border-red-100 text-red-700 font-bold rounded-xl shadow-sm hover:bg-red-100 transition-colors">
              <Unlock className="w-4 h-4" /> Logout Admin
            </button>
          )}
        </div>
      </div>

      {/* TABS HANYA MUNCUL JIKA ADMIN */}
      {isAdmin && (
        <div className="inline-flex space-x-1 bg-slate-200/50 p-1.5 rounded-xl overflow-x-auto max-w-full">
          {[
            { id: 'pipeline', label: 'Pipeline Interns', icon: Users },
            { id: 'requests', label: 'Request Portal', icon: Inbox },
            { id: 'partnerships', label: 'Partnerships & MoU', icon: Building2 },
            { id: 'visits', label: 'Site Visits', icon: Calendar },
            { id: 'guidelines', label: 'Guidelines & Templates', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-900/5' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ======================================= */}
      {/* 1. PIPELINE INTERNS TAB (Hanya Admin)   */}
      {/* ======================================= */}
      {isAdmin && activeTab === 'pipeline' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { label: 'Total Sesuai Filter', value: pipelineStats.total, icon: Database, color: 'text-slate-600', bg: 'bg-slate-100' },
              { label: 'Sedang Aktif', value: pipelineStats.active, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Akan Masuk', value: pipelineStats.incoming, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Sudah Selesai', value: pipelineStats.finished, icon: Award, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Segera Selesai', value: pipelineStats.finishingSoon, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
              { label: 'Rejected', value: pipelineStats.rejected, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-center items-start gap-3 relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-slate-900">{stat.value}</h4>
                  <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Department Absorption Summary */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600"/> Distribusi Penyerapan Intern per Departemen / SBU
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Mengikuti filter tabel di bawah. Hanya menghitung status Accepted / Active / Finish.</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 pt-2">
              {departmentAbsorption.data.length > 0 ? departmentAbsorption.data.map((dept, i) => (
                <div key={i} className="bg-slate-50 hover:bg-blue-50 border border-slate-200/80 rounded-xl px-4 py-3 flex items-center justify-between group shadow-sm flex-auto sm:flex-initial transition-all">
                  <span className="text-sm font-semibold text-slate-700 mr-4 group-hover:text-blue-700 transition-colors" title={dept.name}>{dept.name}</span>
                  <span className="bg-white border border-slate-200 text-blue-700 text-sm font-extrabold px-2.5 py-1 rounded-lg shadow-sm">{dept.count}</span>
                </div>
              )) : (
                <div className="text-sm text-slate-500 py-6 text-center w-full bg-slate-50/50 rounded-xl border border-slate-200 border-dashed">
                  Belum ada data penyerapan intern yang sesuai dengan filter saat ini.
                </div>
              )}
            </div>
          </div>

          {/* Search & Actions Toolbar */}
          <div className="flex flex-col lg:flex-row justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200/60">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative min-w-[200px] flex-1 max-w-sm">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Cari Nama / Universitas..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500/20 outline-none" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="All">Semua Status</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Process">Process</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Reject Offer">Reject Offer</option>
                </select>

                <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500/20 outline-none max-w-[160px] truncate" value={universityFilter} onChange={(e) => setUniversityFilter(e.target.value)}>
                  <option value="All">Semua Universitas</option>
                  {uniqueUniversities.map((uni, idx) => <option key={idx} value={uni}>{uni}</option>)}
                </select>

                <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500/20 outline-none max-w-[150px] truncate" value={sbuFilter} onChange={(e) => setSbuFilter(e.target.value)}>
                  <option value="All">Semua SBU/SFU</option>
                  {uniqueSBUs.map((sbu, idx) => <option key={idx} value={sbu}>{sbu}</option>)}
                </select>

                <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500/20 outline-none font-semibold text-blue-800" value={timelineFilter} onChange={(e) => setTimelineFilter(e.target.value)}>
                  <option value="All">Semua Periode</option>
                  <option value="Incoming">Diterima (Belum Aktif)</option>
                  <option value="Active">Sedang Aktif</option>
                  <option value="Finishing Soon">Hampir Selesai (&lt;30 Hari)</option>
                  <option value="Finished">Sudah Selesai</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-2 shrink-0">
              <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"><Download className="w-4 h-4" /> Export CSV</button>
              <button onClick={() => setIsImportModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"><Upload className="w-4 h-4" /> Import Excel</button>
              <button onClick={() => { setEditingIntern(null); setIsInternModalOpen(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"><Plus className="w-4 h-4" /> Add Intern</button>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-slate-50/80 text-slate-600 font-semibold text-xs uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('name')}><div className="flex items-center gap-2">Nama Mahasiswa <ArrowUpDown className="w-3 h-3 text-slate-400"/></div></th>
                    <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('university')}><div className="flex items-center gap-2">Universitas <ArrowUpDown className="w-3 h-3 text-slate-400"/></div></th>
                    <th className="px-6 py-4">Jurusan</th>
                    <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('status')}><div className="flex items-center gap-2">Status <ArrowUpDown className="w-3 h-3 text-slate-400"/></div></th>
                    <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('group')}><div className="flex items-center gap-2">SBU / SFU <ArrowUpDown className="w-3 h-3 text-slate-400"/></div></th>
                    <th className="px-6 py-4">Mentor</th>
                    <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('joinDate')}><div className="flex items-center gap-2">Join Date <ArrowUpDown className="w-3 h-3 text-slate-400"/></div></th>
                    <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('finishDate')}><div className="flex items-center gap-2">Finish Date <ArrowUpDown className="w-3 h-3 text-slate-400"/></div></th>
                    <th className="px-6 py-4">Paid/Unpaid</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAndSortedInterns.map((intern) => (
                    <tr key={intern.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 flex items-center gap-2">
                          {intern.name}
                          {intern.source === 'system' && <span title="Ditambahkan via Sistem" className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>}
                        </div>
                        {intern.nim && intern.nim !== '-' && <div className="text-xs text-slate-500 font-mono mt-0.5">{intern.nim}</div>}
                        {intern.email && intern.email !== '-' && <div className="text-[10px] text-blue-500 mt-0.5" title={intern.email}>{intern.email}</div>}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{intern.university}</td>
                      <td className="px-6 py-4 text-slate-600">{intern.department}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusBadge(intern.status)}`}>
                          {intern.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{intern.group}</td>
                      <td className="px-6 py-4 text-slate-600">{intern.supervisor}</td>
                      <td className="px-6 py-4 text-slate-600 font-mono text-xs">{intern.joinDate !== '-' ? formatDateID(intern.joinDate) : '-'}</td>
                      <td className="px-6 py-4 text-slate-600">
                        {intern.finishDate !== '-' ? (
                          <div className="flex flex-col gap-1.5 items-start">
                            <span className="font-mono text-xs">{formatDateID(intern.finishDate)}</span>
                            {isFinishingSoon(intern.finishDate) && intern.status === 'Accepted' && (
                              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 border border-orange-200 rounded text-[10px] font-bold uppercase tracking-wider">⏳ &lt;30 Hari</span>
                            )}
                          </div>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-semibold">{intern.paymentStatus || '-'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          
                          {/* TOMBOL EMAIL BARU */}
                          {intern.status === 'Accepted' && (
                             <button 
                                onClick={() => handleDraftEmail(intern)} 
                                title={intern.emailSent ? "Email penawaran pernah dibuat/dikirim" : "Kirim Email Penawaran & Administrasi (Via Outlook)"}
                                className={`p-1.5 rounded-lg transition-colors border flex items-center ${
                                   intern.emailSent 
                                   ? "text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-600 hover:text-white" 
                                   : "text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-600 hover:text-white"
                                }`}
                             >
                                <Mail className="w-4 h-4"/>
                             </button>
                          )}

                          {canDownloadSKM(intern) && (
                            <button 
                              onClick={() => handleDownloadSKM(intern)} 
                              title="Download Surat Keterangan Magang (PDF)"
                              className="p-1.5 text-purple-600 hover:text-white hover:bg-purple-600 rounded-lg transition-colors border border-purple-200 bg-purple-50 flex items-center"
                            >
                              <DownloadCloud className="w-4 h-4"/>
                            </button>
                          )}

                          <button onClick={() => { setEditingIntern(intern); setIsInternModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4"/></button>
                          <button onClick={() => setItemToDelete({type: 'intern', id: intern.id})} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredAndSortedInterns.length === 0 && <tr><td colSpan={10} className="px-6 py-12 text-center text-slate-500 font-medium">Tidak ada data intern ditemukan</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* 2. REQUEST PORTAL TAB (Bisa diakses User & Admin) */}
      {/* ======================================= */}
      {(!isAdmin || activeTab === 'requests') && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          
          {/* Sub-tab hanya muncul jika ADMIN, jika user biasa langsung render form */}
          {isAdmin && (
            <div className="flex space-x-6 border-b border-slate-200">
              <button onClick={() => setRequestSubTab('portal')} className={`pb-3 text-sm font-semibold transition-colors relative ${requestSubTab === 'portal' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>Form Request <span className="ml-1 bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full text-xs">Portal</span> {requestSubTab === 'portal' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}</button>
              <button onClick={() => setRequestSubTab('dashboard')} className={`pb-3 text-sm font-semibold transition-colors relative ${requestSubTab === 'dashboard' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>Request Dashboard <span className="ml-1 bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full text-xs">{internRequests.length}</span> {requestSubTab === 'dashboard' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}</button>
            </div>
          )}

          {(!isAdmin || requestSubTab === 'portal') && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 md:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-bl-full -z-10 opacity-60"></div>
                
                <div className="mb-8">
                  <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3"><Send className="w-6 h-6 text-blue-600"/> Pengajuan Kebutuhan Magang</h2>
                  <p className="text-slate-500 mt-2">Silakan isi formulir di bawah ini untuk mengajukan permintaan tenaga magang (intern) pada divisi/SBU Anda. Tim Learning & Culture akan memproses pipeline berdasarkan data yang masuk.</p>
                </div>

                <form onSubmit={handleSaveRequest} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Nama User / Pengaju</label>
                      <input required name="requester" placeholder="Ex: Purnama Aditya" className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 rounded-xl outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Divisi / SBU / SFU</label>
                      <select required name="sbu" className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 rounded-xl outline-none transition-all text-slate-700">
                        <option value="">-- Pilih SBU / SFU --</option>
                        <optgroup label="SBU (Strategic Business Unit)">
                          {SBU_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </optgroup>
                        <optgroup label="SFU (Strategic Function Unit)">
                          {SFU_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </optgroup>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Jabatan / Posisi Intern</label>
                      <input required name="position" placeholder="Ex: Data Analyst Intern" className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 rounded-xl outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Jumlah Intern Dibutuhkan</label>
                      <input type="number" required min="1" max="20" name="count" placeholder="Berapa Orang?" className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 rounded-xl outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Lokasi Penempatan</label>
                      <input required name="location" placeholder="Ex: Head Office (Lt 4) / Depo DMS" className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 rounded-xl outline-none transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Estimasi Timeline Pelaksanaan</label>
                      <div className="text-xs text-slate-500 mb-2">Pilih bulan rencana mulai dan berakhirnya program.</div>
                      <div className="flex items-center gap-2">
                        <input type="date" required name="startDate" className="flex-1 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 rounded-xl outline-none transition-all text-sm" />
                        <span className="text-slate-400 font-bold">-</span>
                        <input type="date" required name="endDate" className="flex-1 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 rounded-xl outline-none transition-all text-sm" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Skema Tunjangan (Paid / Unpaid)</label>
                      <div className="text-xs text-slate-500 mb-2">Sesuai kebijakan standar program magang adalah <strong className="text-amber-600">Unpaid</strong>.</div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <select name="payment" value={requestPaymentType} onChange={(e) => setRequestPaymentType(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 rounded-xl outline-none transition-all font-semibold text-slate-700">
                          <option value="Unpaid">Unpaid (Standar)</option>
                          <option value="Paid">Paid (Budget Internal)</option>
                        </select>
                        {requestPaymentType === 'Paid' && (
                          <input type="text" name="nominal" required placeholder="Nominal (Ex: Rp 1.500.000 / bln)" className="flex-1 bg-white border border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 rounded-xl outline-none transition-all placeholder:text-slate-400 text-sm" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Objektif & Rencana Pembelajaran</label>
                    <div className="text-xs text-slate-500 mb-2">Jelaskan tugas utama atau project apa yang akan dikerjakan intern selama berada di divisi Anda.</div>
                    <textarea required name="objective" placeholder="Ex: Membantu rekap data vendor, analisa rute pelayaran cabang timur, dan belajar operasional logistik di pelabuhan..." className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 rounded-xl h-28 resize-none outline-none transition-all" />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button type="submit" className="px-8 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md transition-colors flex items-center gap-2">
                      <Send className="w-5 h-5"/> Kirim Pengajuan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* REQUEST DASHBOARD: KINI TAMPIL LEBIH RAPI DENGAN GRID CARDS */}
          {isAdmin && requestSubTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Summary Stats untuk Request */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                   <span className="text-slate-500 text-sm font-medium">Total Requests</span>
                   <span className="text-2xl font-bold text-slate-900">{requestAdminStats.total}</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-sm flex flex-col bg-blue-50/30">
                   <span className="text-blue-600 text-sm font-medium">Pending</span>
                   <span className="text-2xl font-bold text-blue-700">{requestAdminStats.pending}</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm flex flex-col bg-emerald-50/30">
                   <span className="text-emerald-600 text-sm font-medium">Approved</span>
                   <span className="text-2xl font-bold text-emerald-700">{requestAdminStats.approved}</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-red-200 shadow-sm flex flex-col bg-red-50/30">
                   <span className="text-red-600 text-sm font-medium">Rejected</span>
                   <span className="text-2xl font-bold text-red-700">{requestAdminStats.rejected}</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-teal-200 shadow-sm flex flex-col bg-teal-50/30">
                   <span className="text-teal-600 text-sm font-medium">Fulfilled</span>
                   <span className="text-2xl font-bold text-teal-700">{requestAdminStats.fulfilled}</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-purple-200 shadow-sm flex flex-col bg-purple-50/30">
                   <span className="text-purple-600 text-sm font-medium">Completed</span>
                   <span className="text-2xl font-bold text-purple-700">{requestAdminStats.completed}</span>
                </div>
              </div>

              {/* Toolbar Filter & Sort Request */}
              <div className="flex flex-col lg:flex-row justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200/60 mb-6">
                <div className="flex flex-wrap items-center gap-3 flex-1">
                  <div className="relative min-w-[200px] flex-1 max-w-sm">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Cari SBU, Pengaju, Lokasi, Posisi..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" value={requestSearchTerm} onChange={(e) => setRequestSearchTerm(e.target.value)} />
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500/20 outline-none" value={requestStatusFilter} onChange={(e) => setRequestStatusFilter(e.target.value)}>
                      <option value="All">Semua Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Fulfilled">Fulfilled</option>
                      <option value="Completed">Completed</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-semibold text-slate-500">Urutkan:</span>
                  <select className="bg-white border border-slate-200 text-blue-700 text-sm rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500/20 outline-none font-bold" value={requestSortConfig} onChange={(e) => setRequestSortConfig(e.target.value)}>
                    <option value="Urgent">Paling Urgent (Timeline)</option>
                    <option value="Newest">Terbaru Diajukan</option>
                    <option value="Oldest">Terlama Diajukan</option>
                  </select>
                </div>
              </div>

              {/* Grid Cards Request */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedRequests.map(req => (
                  <div key={req.id} className="bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all p-5 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-extrabold text-lg text-slate-900 leading-tight">{req.sbu}</h4>
                          <p className="text-sm text-blue-600 font-bold mb-1">{req.position}</p>
                          <p className="text-sm text-slate-500 font-medium">Diajukan oleh: {req.requester}</p>
                        </div>
                        <select 
                            value={req.status} 
                            onChange={(e) => handleUpdateRequestStatus(req.id, e.target.value)}
                            className={`px-2.5 py-1.5 rounded-md text-xs font-bold border outline-none cursor-pointer text-center ${getStatusBadge(req.status)}`}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Fulfilled">Fulfilled</option>
                            <option value="Completed">Completed</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-slate-600 mb-4">
                        <div><span className="block text-xs text-slate-400">Kebutuhan</span><strong className="text-blue-700">{req.count} Orang</strong></div>
                        <div><span className="block text-xs text-slate-400">Skema</span><strong className="text-slate-700">{req.payment}</strong></div>
                        <div className="col-span-2"><span className="block text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3"/> Timeline</span><span className="font-medium text-slate-800">{req.timeline}</span></div>
                        <div className="col-span-2"><span className="block text-xs text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3"/> Lokasi</span><span className="font-medium text-slate-800">{req.location}</span></div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3 text-sm text-slate-700 border border-slate-100 mb-4 flex-1">
                        <span className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><BookOpen className="w-3 h-3"/> Objektif & Tugas:</span>
                        <p className="line-clamp-4 hover:line-clamp-none transition-all">{req.objective}</p>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                        <div className="text-xs text-slate-400 font-mono" title="Tanggal Diajukan">{new Date(req.createdAt).toLocaleDateString('id-ID')}</div>
                        <div className="flex gap-2">
                          <button onClick={() => setItemToDelete({type: 'internRequest', id: req.id})} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                        </div>
                    </div>
                  </div>
                ))}
                
                {filteredAndSortedRequests.length === 0 && (
                  <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl border border-slate-200 border-dashed">
                    <Inbox className="w-12 h-12 mb-3 text-slate-300"/>
                    <p className="font-medium">Belum ada pengajuan masuk.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================= */}
      {/* 3. PARTNERSHIPS TAB (Hanya Admin)       */}
      {/* ======================================= */}
      {isAdmin && activeTab === 'partnerships' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total MOU/PKS', value: partnershipStats.totalAgreements, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Kerjasama Aktif', value: partnershipStats.activeAgreements, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Intake Schedules', value: partnershipStats.totalSchedules, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Univ Contacts', value: partnershipStats.totalContacts, icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-1">{stat.label}</p>
                  <h4 className="text-2xl font-bold text-slate-900">{stat.value}</h4>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-6 border-b border-slate-200">
            <button onClick={() => setPartnerSubTab('agreements')} className={`pb-3 text-sm font-semibold transition-colors relative ${partnerSubTab === 'agreements' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>Agreements (MoU/PKS) {partnerSubTab === 'agreements' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}</button>
            <button onClick={() => setPartnerSubTab('schedules')} className={`pb-3 text-sm font-semibold transition-colors relative ${partnerSubTab === 'schedules' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>Intake Schedules {partnerSubTab === 'schedules' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}</button>
            <button onClick={() => setPartnerSubTab('contacts')} className={`pb-3 text-sm font-semibold transition-colors relative ${partnerSubTab === 'contacts' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>Key Contacts {partnerSubTab === 'contacts' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}</button>
          </div>

          {partnerSubTab === 'agreements' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Daftar Kerjasama (MoU/PKS)</h3>
                <button onClick={() => { setEditingAgreement(null); setIsAgreementModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm"><Plus className="w-4 h-4"/> Add Agreement</button>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50/80 text-slate-600 font-semibold text-xs uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Jenis</th>
                        <th className="px-6 py-4">Pihak 1 (Universitas/Institusi)</th>
                        <th className="px-6 py-4">Tentang</th>
                        <th className="px-6 py-4">Nomor MOU/PKS</th>
                        <th className="px-6 py-4">Durasi</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {agreements.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 group">
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusBadge(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-700">{item.type}</td>
                          <td className="px-6 py-4 font-semibold text-slate-900">{item.pihak1}</td>
                          <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={item.tentang}>{item.tentang}</td>
                          <td className="px-6 py-4 text-slate-500 font-mono text-xs">{item.nomor}</td>
                          <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{item.durasi}</td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setEditingAgreement(item); setIsAgreementModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4"/></button>
                              <button onClick={() => setItemToDelete({type: 'agreement', id: item.id})} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {agreements.length === 0 && <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-500 font-medium">Belum ada data agreement.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {partnerSubTab === 'schedules' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Timeline Penerimaan Magang (Intake)</h3>
                  <p className="text-sm text-slate-500">Visualisasi estimasi bulan penerimaan magang universitas.</p>
                </div>
                <button onClick={() => { setEditingSchedule(null); setIsScheduleModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm"><Plus className="w-4 h-4"/> Add Schedule</button>
              </div>

              {/* Gantt Calendar */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="overflow-x-auto w-full p-1">
                  <table className="w-full text-xs text-center border-collapse">
                    <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-4 text-left border-r border-slate-200 min-w-[200px]">Institusi</th>
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                          <th key={m} className="px-2 py-4 w-[6%] border-r border-slate-200 last:border-0">{m}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {schedules.map(s => (
                        <tr key={`gantt-${s.id}`} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3.5 text-left font-semibold text-slate-800 border-r border-slate-200">{s.institution}</td>
                          {[0,1,2,3,4,5,6,7,8,9,10,11].map(monthIndex => (
                            <td key={monthIndex} className="p-1.5 border-r border-slate-200 last:border-0">
                              {s.months.includes(monthIndex) && (
                                <div className="h-6 w-full bg-blue-500/90 rounded-md shadow-sm hover:bg-blue-600 transition-colors" title={`Intake: ${s.institution}`}></div>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                      {schedules.length === 0 && <tr><td colSpan={13} className="px-6 py-12 text-center text-slate-500 font-medium">Belum ada data jadwal intake.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Detailed Schedule Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {schedules.map((schedule) => (
                  <div key={schedule.id} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow group relative">
                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingSchedule(schedule); setIsScheduleModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"><Edit2 className="w-4 h-4"/></button>
                        <button onClick={() => setItemToDelete({type: 'schedule', id: schedule.id})} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4"/></button>
                    </div>
                    <h4 className="text-lg font-extrabold text-slate-900 pr-16 mb-4">{schedule.institution}</h4>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start gap-3 text-sm text-slate-600">
                        <div className="p-1.5 bg-blue-50 rounded-md text-blue-600 shrink-0"><Clock className="w-4 h-4" /></div>
                        <div><span className="font-semibold text-slate-800 block">Durasi:</span> {schedule.duration}</div>
                      </div>
                      <div className="flex items-start gap-3 text-sm text-slate-600">
                        <div className="p-1.5 bg-emerald-50 rounded-md text-emerald-600 shrink-0"><Calendar className="w-4 h-4" /></div>
                        <div><span className="font-semibold text-slate-800 block">Start Period:</span> {schedule.startPeriod}</div>
                      </div>
                      {schedule.notes && (
                        <div className="flex items-start gap-3 text-sm text-slate-600 mt-2 bg-amber-50/50 p-3 rounded-xl border border-amber-100/50">
                          <BookOpen className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <div className="text-xs font-medium text-amber-800 leading-relaxed">{schedule.notes}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {partnerSubTab === 'contacts' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h3 className="text-lg font-bold text-slate-900">Key Contacts Universitas ({contacts.length} Data)</h3>
                <div className="flex gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Cari Nama / Institusi..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" value={contactSearch} onChange={(e) => setContactSearch(e.target.value)} />
                  </div>
                  <button onClick={() => { setEditingContact(null); setIsContactModalOpen(true); }} className="flex shrink-0 items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm"><Plus className="w-4 h-4"/> Add Contact</button>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50/80 text-slate-600 font-semibold text-xs uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4">Nama PIC</th>
                        <th className="px-6 py-4">Departemen</th>
                        <th className="px-6 py-4">Institusi</th>
                        <th className="px-6 py-4">Kontak</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredContacts.map((contact) => (
                        <tr key={contact.id} className="hover:bg-slate-50/50 group">
                          <td className="px-6 py-4 font-bold text-slate-900">{contact.name}</td>
                          <td className="px-6 py-4 text-slate-600">{contact.department}</td>
                          <td className="px-6 py-4 text-blue-700 font-semibold">{contact.institution}</td>
                          <td className="px-6 py-4 text-slate-600 font-mono text-xs bg-slate-50/50 rounded-md w-max inline-block mt-2">{contact.contact}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setEditingContact(contact); setIsContactModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4"/></button>
                              <button onClick={() => setItemToDelete({type: 'contact', id: contact.id})} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredContacts.length === 0 && <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">Belum ada data kontak.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================= */}
      {/* 4. SITE VISITS TAB (Hanya Admin)        */}
      {/* ======================================= */}
      {isAdmin && activeTab === 'visits' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex space-x-6 border-b border-slate-200">
            <button onClick={() => setVisitSubTab('sop')} className={`pb-3 text-sm font-semibold transition-colors relative ${visitSubTab === 'sop' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>SOP & Guidelines {visitSubTab === 'sop' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}</button>
            <button onClick={() => setVisitSubTab('tracker')} className={`pb-3 text-sm font-semibold transition-colors relative ${visitSubTab === 'tracker' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>Visit Tracker {visitSubTab === 'tracker' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}</button>
            <button onClick={() => setVisitSubTab('contacts')} className={`pb-3 text-sm font-semibold transition-colors relative ${visitSubTab === 'contacts' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>Visit Key Contacts {visitSubTab === 'contacts' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}</button>
          </div>

          {/* VISIT: SOP & GUIDELINES */}
          {visitSubTab === 'sop' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">SOP & Alur Site Visit</h3>
                  <p className="text-sm text-slate-500">Standar Operasional Prosedur penanganan kunjungan site visit.</p>
                </div>
                <button onClick={() => { setEditingSop(null); setEditingSopType('visit'); setIsSopModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm"><Plus className="w-4 h-4"/> Add Step</button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 md:p-10">
                <div className="relative border-l-2 border-slate-200 ml-4 space-y-12 pb-4">
                  {visitSOP.map((step) => (
                    <div key={step.id} className="relative pl-10 group">
                      <div className={`absolute w-12 h-12 border-[3px] rounded-full -left-[25px] top-0 flex items-center justify-center shadow-sm ${colorClasses[step.color]}`}>
                        <RenderIcon name={step.icon} className="w-5 h-5" />
                      </div>
                      
                      <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <button 
                          onClick={() => { setEditingSop(step); setEditingSopType('visit'); setIsSopModalOpen(true); }}
                          className="px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1.5 font-semibold text-xs"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button 
                          onClick={() => setItemToDelete({type: 'visitSOP', id: step.id})}
                          className="px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center gap-1.5 font-semibold text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Hapus
                        </button>
                      </div>

                      <div className="pr-32">
                        <h4 className="text-lg font-extrabold text-slate-900 mb-2">{step.title}</h4>
                        <p className="text-sm text-slate-600 mb-4 leading-relaxed">{step.description}</p>
                        
                        {step.bullets && step.bullets.length > 0 && (
                          <ul className="list-disc list-outside text-sm text-slate-700 space-y-2 mb-4 ml-4 marker:text-slate-400">
                            {step.bullets.map((b, i) => <li key={i}>{b}</li>)}
                          </ul>
                        )}

                        {step.subSections && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {step.subSections.map((sub, i) => (
                              <div key={i} className="bg-slate-50 border border-slate-200/60 rounded-xl p-5">
                                <strong className="text-sm font-bold text-slate-800 block mb-3">{sub.title}</strong>
                                <ul className="text-sm text-slate-600 space-y-2 list-none">
                                  {sub.bullets.map((b, j) => (
                                    <li key={j} className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> <span>{b}</span></li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}

                        {step.highlight && (
                          <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl p-4 text-sm text-amber-900 mt-4 font-medium flex gap-3 items-start">
                            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                            <p>{step.highlight}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {visitSOP.length === 0 && <p className="text-sm text-slate-500 italic ml-6">Belum ada SOP yang ditambahkan.</p>}
                </div>
              </div>
            </div>
          )}

          {/* VISIT: TRACKER */}
          {visitSubTab === 'tracker' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Visit Tracker (Upcoming & History)</h3>
                  <p className="text-sm text-slate-500">Catat dan pantau institusi yang akan dan telah melakukan site visit.</p>
                </div>
                <button onClick={() => { setEditingVisit(null); setIsVisitModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm"><Plus className="w-4 h-4"/> Add Visit Event</button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50/80 text-slate-600 font-semibold text-xs uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4">Tanggal</th>
                        <th className="px-6 py-4">Institusi</th>
                        <th className="px-6 py-4">Peserta</th>
                        <th className="px-6 py-4">Area Kunjungan</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {siteVisits.map((visit) => (
                        <tr key={visit.id} className="hover:bg-slate-50/50 group">
                          <td className="px-6 py-4 font-semibold text-slate-900">{visit.date}</td>
                          <td className="px-6 py-4 font-bold text-blue-700">{visit.institution}</td>
                          <td className="px-6 py-4 text-slate-600">{visit.participants} Orang</td>
                          <td className="px-6 py-4 text-slate-600"><div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400"/> {visit.location}</div></td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusBadge(visit.status)}`}>{visit.status}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setEditingVisit(visit); setIsVisitModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4"/></button>
                              <button onClick={() => setItemToDelete({type: 'visit', id: visit.id})} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {siteVisits.length === 0 && <tr><td colSpan={6} className="text-center py-10 text-slate-500 font-medium">Belum ada jadwal visit.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VISIT: CONTACTS */}
          {visitSubTab === 'contacts' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Key Contacts - Site Visit Internal</h3>
                <button onClick={() => { setEditingVisitContact(null); setIsVisitContactModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm"><Plus className="w-4 h-4"/> Add Contact</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {visitContacts.map((contact) => (
                  <div key={contact.id} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow relative group">
                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingVisitContact(contact); setIsVisitContactModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"><Edit2 className="w-4 h-4"/></button>
                      <button onClick={() => setItemToDelete({type: 'visitContact', id: contact.id})} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4"/></button>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold mb-4 text-xl border border-blue-100/50">
                      {contact.name.charAt(0)}
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-lg">{contact.name}</h4>
                    <p className="text-sm font-semibold text-blue-600 mb-4">{contact.position}</p>
                    <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 border border-slate-200/60">
                      <strong className="text-slate-800">Terkait:</strong> {contact.relatedTo} <br/>
                      <span className="block mt-1.5 leading-relaxed">{contact.notes}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================= */}
      {/* 5. GUIDELINES & TEMPLATES TAB (Hanya Admin) */}
      {/* ======================================= */}
      {isAdmin && activeTab === 'guidelines' && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
          
          {/* Download Center */}
          <div>
            <div className="mb-5">
              <h3 className="text-lg font-bold text-slate-900">Download Templates</h3>
              <p className="text-sm text-slate-500">File master administrasi untuk keperluan penerimaan hingga penyelesaian magang. Semua telah dihubungkan langsung ke Google Drive operasional.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { title: 'Surat Penerimaan', ext: '.pdf', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', link: 'https://drive.google.com/file/d/1x_vt1ZL96erFgDa32lOLRS2dAc0Ht8TT/view?usp=sharing' },
                { title: 'Form Data Diri', ext: '.pdf', icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', link: 'https://drive.google.com/file/d/1rk03JZLSL5FPKVr2vcYyVWwjwSbAJCwB/view?usp=sharing' },
                { title: 'Template NDA', ext: '.pdf', icon: Shield, color: 'text-red-600', bg: 'bg-red-50', link: 'https://drive.google.com/file/d/16FCUFsAd_4BhF5nHDnqkTGDk6BFUcYa3/view?usp=sharing' },
                { title: 'Surat Keterangan', ext: '.pdf', icon: Award, color: 'text-purple-600', bg: 'bg-purple-50', link: 'https://drive.google.com/file/d/1N65nubrR0Je-pgymMC1KYf8Nrt_NNquP/view?usp=sharing' },
                { title: 'Form Absensi', ext: '.xlsx', icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50', link: 'https://docs.google.com/spreadsheets/d/1BobGrmNxjjZpE4cJrt4D2a0qO0wm2wpF/edit?usp=sharing&ouid=100646543092328282413&rtpof=true&sd=true' },
              ].map((tmpl, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col items-center text-center group cursor-pointer" onClick={() => window.open(tmpl.link, '_blank')}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${tmpl.bg} ${tmpl.color} group-hover:bg-blue-600 group-hover:text-white`}>
                    <tmpl.icon className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1">{tmpl.title}</h4>
                  <p className="text-xs text-slate-400 font-mono mb-4">{tmpl.ext}</p>
                  <div className="mt-auto flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:underline"><Download className="w-3.5 h-3.5"/> Download / Akses GDrive</div>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-slate-200/60" />

          {/* SOP Internship Timeline */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">SOP & Alur Program Internship</h3>
                <p className="text-sm text-slate-500">Panduan detail operasional dan flow penerimaan peserta magang Meratus yang telah diperbarui.</p>
              </div>
              <button onClick={() => { setEditingSop(null); setEditingSopType('intern'); setIsSopModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm"><Plus className="w-4 h-4"/> Add Step</button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 md:p-10">
              <div className="relative border-l-2 border-slate-200 ml-4 space-y-12 pb-4">
                
                {internSOP.map((step) => (
                  <div key={step.id} className="relative pl-10 group">
                    <div className={`absolute w-12 h-12 border-[3px] rounded-full -left-[25px] top-0 flex items-center justify-center shadow-sm ${colorClasses[step.color]}`}>
                      <RenderIcon name={step.icon} className="w-5 h-5" />
                    </div>

                    <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button 
                        onClick={() => { setEditingSop(step); setEditingSopType('intern'); setIsSopModalOpen(true); }}
                        className="px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1.5 font-semibold text-xs"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button 
                        onClick={() => setItemToDelete({type: 'internSOP', id: step.id})}
                        className="px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center gap-1.5 font-semibold text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    </div>
                    
                    <div className="pr-32">
                      <h4 className="text-lg font-extrabold text-slate-900 mb-2">{step.title}</h4>
                      <p className="text-sm text-slate-600 mb-4 leading-relaxed">{step.description}</p>
                      
                      {step.bullets && step.bullets.length > 0 && (
                        <ul className="list-disc list-outside text-sm text-slate-700 space-y-2 mb-4 ml-4 marker:text-slate-400">
                          {step.bullets.map((b, i) => <li key={i}>{b}</li>)}
                        </ul>
                      )}

                      {step.subSections && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          {step.subSections.map((sub, i) => (
                            <div key={i} className="bg-slate-50 border border-slate-200/60 rounded-xl p-5">
                              <strong className="text-sm font-bold text-slate-800 block mb-3">{sub.title}</strong>
                              <ul className="text-sm text-slate-600 space-y-2 list-none">
                                {sub.bullets.map((b, j) => (
                                  <li key={j} className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> <span>{b}</span></li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}

                      {step.highlight && (
                        <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl p-4 text-sm text-amber-900 mt-4 font-medium flex gap-3 items-start">
                          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                          <p>{step.highlight}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {internSOP.length === 0 && <p className="text-sm text-slate-500 italic ml-6">Belum ada SOP yang ditambahkan.</p>}
                
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ======================================= */}
      {/* FORM MODALS                               */}
      {/* ======================================= */}
      
      {/* Login Admin Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 border border-slate-100">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-5 border border-blue-100">
              <KeyRound className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-extrabold text-center text-slate-900 mb-2">Admin Login</h2>
            <p className="text-sm text-center text-slate-500 mb-6">Masukkan password untuk mengakses semua fitur manajemen magang.</p>
            <form onSubmit={handleLogin}>
              <input 
                type="password" 
                required 
                placeholder="Enter password..." 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3.5 rounded-xl outline-none transition-all text-center tracking-widest font-mono mb-6" 
              />
              <div className="flex justify-center gap-3">
                <button type="button" onClick={() => setIsLoginModalOpen(false)} className="flex-1 px-4 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold transition-colors">Batal</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-semibold shadow-sm transition-colors">Akses</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SOP Editing Modal */}
      {isSopModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto border border-slate-100">
            <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-3 text-slate-900">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Edit2 className="w-5 h-5" /></span> 
              {editingSop ? 'Edit Detail SOP' : 'Tambah Tahapan SOP Baru'}
            </h2>
            <form onSubmit={handleSaveSOP} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Judul Tahapan</label>
                <input required name="title" defaultValue={currentSop.title} placeholder="Misal: 1. Proses Screening" className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 rounded-xl font-bold outline-none transition-all" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Pilih Ikon</label>
                  <select name="icon" defaultValue={currentSop.icon || 'book'} className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 rounded-xl outline-none transition-all">
                    <option value="book">Buku (Book)</option>
                    <option value="database">Database</option>
                    <option value="usercheck">Check User</option>
                    <option value="pen">Pena (Pen)</option>
                    <option value="presentation">Presentasi</option>
                    <option value="clipboard">Papan Klip</option>
                    <option value="dollar">Keuangan / Tunjangan</option>
                    <option value="filetext">Dokumen (File)</option>
                    <option value="users">Grup / Peserta</option>
                    <option value="settings">Pengaturan</option>
                    <option value="clock">Jam / Waktu</option>
                    <option value="camera">Kamera / Dokumentasi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Pilih Warna Background</label>
                  <select name="color" defaultValue={currentSop.color || 'blue'} className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 rounded-xl outline-none transition-all">
                    <option value="slate">Abu-abu (Slate)</option>
                    <option value="blue">Biru (Blue)</option>
                    <option value="indigo">Nila (Indigo)</option>
                    <option value="amber">Kuning (Amber)</option>
                    <option value="teal">Toska (Teal)</option>
                    <option value="purple">Ungu (Purple)</option>
                    <option value="emerald">Hijau (Emerald)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Deskripsi Utama</label>
                <textarea required name="description" defaultValue={currentSop.description} placeholder="Jelaskan secara singkat mengenai tahapan ini..." className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 rounded-xl h-24 outline-none transition-all" />
              </div>
              
              {!currentSop.subSections && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">List Poin (Bullets)</label>
                  <p className="text-xs text-slate-500 mb-2">Pisahkan setiap poin dengan baris baru (Enter).</p>
                  <textarea name="bullets" defaultValue={currentSop.bullets?.join('\n')} placeholder="- Poin pertama&#10;- Poin kedua" className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 rounded-xl h-36 outline-none transition-all" />
                </div>
              )}

              {currentSop.subSections && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                    Sub-Sections Data (Format JSON)
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] rounded-full">Lanjutan</span>
                  </label>
                  <p className="text-xs text-slate-500 mb-2">Anda dapat mengedit struktur kolom ganda menggunakan format JSON di bawah ini. Pastikan tidak ada kurung atau koma yang hilang.</p>
                  <textarea name="subSections" defaultValue={JSON.stringify(currentSop.subSections, null, 2)} className="w-full bg-slate-900 text-green-400 font-mono border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 rounded-xl h-48 outline-none transition-all text-xs" />
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Highlight / Catatan Khusus (Opsional)</label>
                <input name="highlight" defaultValue={currentSop.highlight} placeholder="Teks yang akan diwarnai dalam kotak kuning (opsional)" className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 rounded-xl outline-none transition-all" />
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setIsSopModalOpen(false)} className="px-5 py-2.5 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors">Batal</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Excel */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 md:p-8 border border-slate-100">
            <h2 className="text-2xl font-extrabold mb-2 text-slate-900 text-blue-600 flex items-center gap-2">
              <Upload className="w-6 h-6"/> Import Pipeline Excel
            </h2>
            <p className="text-sm text-slate-600 mb-4 bg-red-50 p-3 rounded-lg border border-red-100 font-medium">
              <strong className="text-red-800">Peringatan Overwrite (Timpa Data):</strong> Proses ini akan <strong className="text-red-800">MENGHAPUS SEMUA</strong> data Pipeline saat ini dan menggantinya secara total dengan data baru dari Excel. <br/>
              Pastikan urutan kolom Excel Anda sama dengan format "Export CSV" sistem.
            </p>
            <textarea 
              className="w-full h-64 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-mono whitespace-pre focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
              placeholder="Paste data excel disini..."
              value={excelData}
              onChange={(e) => setExcelData(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsImportModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors">Batal</button>
              <button onClick={handleImportExcel} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-sm transition-colors">Proses & Timpa Data</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Intern */}
      {isInternModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto border border-slate-100">
            <h2 className="text-2xl font-extrabold mb-6 text-slate-900 border-b pb-4">{editingIntern ? 'Edit Data Intern' : 'Add New Intern'}</h2>
            <form onSubmit={handleSaveIntern} className="space-y-6">
              
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2"><UserCheck className="w-4 h-4"/> Informasi Pribadi</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Nama Mahasiswa</label><input required name="name" defaultValue={editingIntern?.name} className="w-full bg-white border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-1.5">NIM / NIS (Untuk SKM)</label><input name="nim" defaultValue={editingIntern?.nim} placeholder="Boleh dikosongkan..." className="w-full bg-white border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Mahasiswa (Untuk Draft Otomatis)</label>
                    <input type="email" name="email" defaultValue={editingIntern?.email && editingIntern?.email !== '-' ? editingIntern?.email : ''} placeholder="contoh: mahasiswa@univ.ac.id" className="w-full bg-white border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Universitas</label><input required name="university" defaultValue={editingIntern?.university} className="w-full bg-white border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Jurusan</label><input required name="department" defaultValue={editingIntern?.department} className="w-full bg-white border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2"><Briefcase className="w-4 h-4"/> Status & Penempatan</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Status Pipeline</label>
                    <select name="status" defaultValue={editingIntern?.status || 'Process'} className="w-full bg-white border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                      <option value="Accepted">Accepted</option>
                      <option value="Process">Process</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Reject Offer">Reject Offer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Status Magang (Bila Diterima)</label>
                    <select name="internshipStatus" defaultValue={editingIntern?.internshipStatus || '-'} className="w-full bg-white border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                      <option value="-">- (Belum Diterima)</option>
                      <option value="Active">Active</option>
                      <option value="Finish">Finish</option>
                      <option value="Resigned">Resigned</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-bold text-slate-700 mb-1.5">SBU / SFU</label><input name="group" defaultValue={editingIntern?.group} placeholder="Ex: SFU - Human Capital" className="w-full bg-white border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Nama Mentor</label><input name="supervisor" defaultValue={editingIntern?.supervisor} placeholder="Ex: Andrew Fatah" className="w-full bg-white border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Opsi Paid / Unpaid</label>
                  <select name="paymentStatus" defaultValue={editingIntern?.paymentStatus || '-'} className="w-full bg-white border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                    <option value="-">-</option>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2"><Calendar className="w-4 h-4"/> Periode Pelaksanaan</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Join Date</label><input type="date" name="joinDate" defaultValue={editingIntern?.joinDate} className="w-full bg-white border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Finish Date</label><input type="date" name="finishDate" defaultValue={editingIntern?.finishDate} className="w-full bg-white border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setIsInternModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors">Batal</button>
                <button type="submit" className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-sm transition-colors">Simpan Semua Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Agreement */}
      {isAgreementModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 md:p-8 border border-slate-100">
            <h2 className="text-2xl font-extrabold mb-6 text-slate-900">{editingAgreement ? 'Edit Agreement' : 'Add Agreement'}</h2>
            <form onSubmit={handleSaveAgreement} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Jenis</label>
                  <select name="type" defaultValue={editingAgreement?.type || 'MOU'} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                    <option value="MOU">MOU</option>
                    <option value="PKS">PKS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Status</label>
                  <select name="status" defaultValue={editingAgreement?.status || 'SEDANG BERLANGSUNG'} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                    <option value="SEDANG BERLANGSUNG">SEDANG BERLANGSUNG</option>
                    <option value="TIDAK AKTIF">TIDAK AKTIF</option>
                  </select>
                </div>
              </div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Pihak 1 (Institusi)</label><input required name="pihak1" defaultValue={editingAgreement?.pihak1} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Pihak 2</label><input required name="pihak2" defaultValue={editingAgreement?.pihak2 || 'PT Meratus Line'} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Tentang / Perihal</label><textarea required name="tentang" defaultValue={editingAgreement?.tentang} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl h-20 resize-none outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Nomor MOU/PKS</label><input name="nomor" defaultValue={editingAgreement?.nomor} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Durasi</label><input name="durasi" defaultValue={editingAgreement?.durasi} placeholder="Ex: Apr 2025 - Apr 2030" className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setIsAgreementModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors">Batal</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-sm transition-colors">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Schedule */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto border border-slate-100">
            <h2 className="text-2xl font-extrabold mb-6 text-slate-900">{editingSchedule ? 'Edit Schedule' : 'Add Schedule'}</h2>
            <form onSubmit={handleSaveSchedule} className="space-y-4">
              <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Institution</label><input required name="institution" defaultValue={editingSchedule?.institution} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Duration (Notes)</label><input required name="duration" defaultValue={editingSchedule?.duration} placeholder="Ex: 4-6 months" className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Start Period (Text)</label><input required name="startPeriod" defaultValue={editingSchedule?.startPeriod} placeholder="Ex: January and August" className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Key Notes / Requirements</label><textarea required name="notes" defaultValue={editingSchedule?.notes} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl h-24 resize-none outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
              
              <div className="pt-4">
                <label className="block text-sm font-bold text-slate-700 mb-3">Bulan Intake (Pilih untuk Gantt Chart)</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, idx) => (
                    <label key={month} className="flex items-center gap-2 text-sm bg-slate-50 border border-slate-200 p-2 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                      <input type="checkbox" name={`month_${idx}`} defaultChecked={editingSchedule?.months?.includes(idx)} className="rounded text-blue-600 focus:ring-blue-50 w-4 h-4"/>
                      <span className="font-medium text-slate-700">{month}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setIsScheduleModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors">Batal</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-sm transition-colors">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Contact */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 border border-slate-100">
            <h2 className="text-2xl font-extrabold mb-6 text-slate-900">{editingContact ? 'Edit Contact' : 'Add Contact'}</h2>
            <form onSubmit={handleSaveContact} className="space-y-4">
              <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Nama PIC</label><input required name="name" defaultValue={editingContact?.name} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Posisi / Departemen</label><input name="department" defaultValue={editingContact?.department} placeholder="Opsional (ex: Finance)" className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Institusi Terkait</label><input required name="institution" defaultValue={editingContact?.institution} placeholder="Ex: ITS" className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Kontak / No HP / Keterangan</label><input required name="contact" defaultValue={editingContact?.contact} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setIsContactModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors">Batal</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-sm transition-colors">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Visit Event */}
      {isVisitModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 border border-slate-100">
            <h2 className="text-2xl font-extrabold mb-6 text-slate-900">{editingVisit ? 'Edit Visit Event' : 'Add Visit Event'}</h2>
            <form onSubmit={handleSaveVisit} className="space-y-4">
              <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Institusi / Universitas</label><input required name="institution" defaultValue={editingVisit?.institution} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Tanggal</label><input type="date" required name="date" defaultValue={editingVisit?.date} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Jml Peserta</label><input type="number" required name="participants" defaultValue={editingVisit?.participants} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
              </div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Area Kunjungan</label><input required name="location" defaultValue={editingVisit?.location} placeholder="Ex: HO + Depo DMM" className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Status</label>
                <select name="status" defaultValue={editingVisit?.status || 'Planned'} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                  <option value="Planned">Planned</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setIsVisitModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors">Batal</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-sm transition-colors">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Visit Contact */}
      {isVisitContactModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 border border-slate-100">
            <h2 className="text-2xl font-extrabold mb-6 text-slate-900">{editingVisitContact ? 'Edit Visit Contact' : 'Add Visit Contact'}</h2>
            <form onSubmit={handleSaveVisitContact} className="space-y-4">
              <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Nama PIC</label><input required name="name" defaultValue={editingVisitContact?.name} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Posisi / Departemen</label><input required name="position" defaultValue={editingVisitContact?.position} placeholder="Ex: Corporate Communication" className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Terkait (Ex: Event / Site Visit)</label><input required name="relatedTo" defaultValue={editingVisitContact?.relatedTo} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Keterangan Khusus</label><textarea required name="notes" defaultValue={editingVisitContact?.notes} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl h-24 resize-none outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setIsVisitContactModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors">Batal</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-sm transition-colors">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )} 

      {/* --- KOMPONEN AI ASSISTANT (Berjalan lokal) --- */}
      <AIAssistant />

    </div>
  );
}