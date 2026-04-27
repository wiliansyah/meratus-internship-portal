import React, { useState, useMemo } from 'react';
import { 
  Users, Building2, Calendar, FileText, Search, Plus, Upload, Download,
  BookOpen, Clock, CheckCircle2, XCircle, ArrowUpDown, AlertCircle,
  Edit2, Trash2, MapPin, ListTodo, Presentation, Camera,
  Shield, Award, DollarSign, UserCheck, PenTool, ClipboardCheck, Database, Settings
} from 'lucide-react';

// --- DATA INITIALIZATION ---

const initialInterns = [
  { id: 1, name: 'Ardelia Salma Maharani', university: 'Universitas Airlangga', department: 'D3 Akuntansi', status: 'Accepted', group: 'Trucking', supervisor: 'Dessy Irawati', joinDate: '2025-02-01', finishDate: '2025-04-30', internshipStatus: 'Finish' },
  { id: 2, name: 'Fahmi Herlambang', university: 'Universitas Airlangga', department: 'D3 Akuntansi', status: 'Accepted', group: 'Trucking', supervisor: 'Dessy Irawati', joinDate: '2025-02-01', finishDate: '2025-04-30', internshipStatus: 'Finish' },
  { id: 3, name: 'Hendrikus Kia Lelaona', university: 'Akademi Maritim Surabaya', department: 'Ketatalaksanaan Pelayaran Niaga dan Kepelabuhan', status: 'Accepted', group: 'Terminal - CLC', supervisor: 'Reni Ruhulessin', joinDate: '2025-02-01', finishDate: '2025-05-01', internshipStatus: 'Finish' },
  { id: 4, name: 'Surendra', university: 'Institut Teknologi Sepuluh November', department: 'S1 Ilmu Komunikasi', status: 'Accepted', group: 'SFU - Corporate Communication', supervisor: 'Purnama Aditya', joinDate: '2025-01-24', finishDate: '2025-05-21', internshipStatus: 'Finish' },
  { id: 5, name: 'Ayu Wahyuningtyas', university: 'Universitas Diponegoro', department: 'Manajemen & Administrasi Logistik', status: 'Rejected', group: '-', supervisor: '-', joinDate: '-', finishDate: '-', internshipStatus: '-' },
  { id: 6, name: 'Nathania Nityasa Palastri', university: 'Institut Teknologi Sepuluh November', department: 'Teknik Transportasi Laut', status: 'Process', group: '-', supervisor: '-', joinDate: '-', finishDate: '-', internshipStatus: '-' }
];

const initialContacts = [
  { id: 1, name: 'Dian Anggiyatna', department: '-', institution: 'Universitas Ciputra', contact: '6282257035083' },
  { id: 2, name: 'Devina Felbania', department: '-', institution: 'Universitas Widya Mandala', contact: '0853-8556-3838 / 0822-3263-6117' },
  { id: 3, name: 'Beny', department: 'Marine engineering, Ship Management', institution: 'ITS', contact: '6282230864567' },
  { id: 4, name: 'Yoyok Setyo', department: 'Sea Transportation, Operation Liner', institution: 'ITS', contact: '6281335260040' },
  { id: 5, name: 'Nursery', department: 'Logistics, Business Shipping', institution: 'ITL Trisakti', contact: '6281219897930' },
  { id: 6, name: 'Nelson', department: 'IT Binus Jkt', institution: 'Binus', contact: '6289628999587' },
  { id: 7, name: 'Ibu Maria (S2)', department: '-', institution: 'Universitas Tarumanegara', contact: '62895365312694' },
  { id: 8, name: 'Dewi Retno', department: 'Sekretaris badan kerjasama', institution: 'Universitas Airlangga', contact: '628123521416' },
  { id: 9, name: 'Bu Fifin', department: 'Fakultas Psikologi', institution: 'Universitas Surabaya', contact: '+62 822-1918-0336' },
];

const initialSchedules = [
  { id: 1, institution: 'Ubaya', duration: '4–6 months', startPeriod: 'January and August (or early September)', notes: 'Follows academic calendar. Must conclude at end of semester.', months: [0, 7] },
  { id: 2, institution: 'PPIT Tiongkok', duration: '6 months (1 Semester)', startPeriod: 'Official: September. Holidays: Jun-Aug, Jan-Feb', notes: 'Official internships are typically for students in Semester 7.', months: [8] },
  { id: 3, institution: 'ITS', duration: 'KP: 1-2 mos, Magang: 3-6 mos', startPeriod: 'KP: Jan-Feb OR Jul-Aug. Magang: Flexible', notes: 'KP Requires Sem 5+ & 90 SKS. Magang requires Sem 7/8.', months: [0, 1, 6, 7] },
];

const initialAgreements = [
  { id: 1, type: 'PKS', status: 'SEDANG BERLANGSUNG', pihak1: 'Fakultas Psikologi Universitas Surabaya', pihak2: 'PT Meratus Line', tentang: 'Pelaksanaan Kerja Sama Tridarma Perguruan Tinggi Bagi Program Studi Pendidikan Profesi Psikologi', nomor: '076/DIR-MRT-LGL/0425', durasi: 'April 2025 - April 2030' },
  { id: 2, type: 'MOU', status: 'SEDANG BERLANGSUNG', pihak1: 'Institut Teknologi Sepuluh November', pihak2: 'PT Meratus Line', tentang: 'Kerjasama di Bidang Pendidikan, Penelitian, dan Pengabdian Kepada Masyarakat', nomor: '252/RCTA-MoU/0822', durasi: 'Oktober 2022 - Oktober 2027' },
  { id: 3, type: 'MOU', status: 'SEDANG BERLANGSUNG', pihak1: 'Universitas Ciputra', pihak2: 'PT Meratus Line', tentang: 'Program Kerjasama', nomor: '558/MRT-LGL/1124', durasi: 'November 2024 - November 2029' },
  { id: 4, type: 'PKS', status: 'TIDAK AKTIF', pihak1: 'Fakultas Psikologi Universitas Surabaya', pihak2: 'PT Meratus Line', tentang: 'Tridharma Perguruan Tinggi Merdeka Belajar Kampus Merdeka', nomor: '035/DIR-MRT-LGL/0225', durasi: '2024 - 2025' },
];

const initialVisitContacts = [
  { id: 1, name: 'Annisa Maulidya Rahma', position: 'Corporate Communication', relatedTo: 'Event', notes: 'PIC Public Relations, terkadang membantu event internal' },
  { id: 2, name: 'Darmawan Rinaldi', position: 'Warehouse (WTT)', relatedTo: 'Site Visit', notes: 'Dihubungi ketika ada permintaan visit ke warehouse' },
  { id: 3, name: 'Reni Ruhulessin', position: 'Depo (DTT)', relatedTo: 'Site Visit', notes: 'Dihubungi ketika ada permintaan visit ke warehouse sekalian depo' },
  { id: 4, name: 'Yusuf Hidayat', position: 'Depo (DMS)', relatedTo: 'Site Visit', notes: 'Dihubungi ketika ada permintaan visit ke depo (domestik)' },
  { id: 5, name: 'Kevin Adhi Danudoro', position: 'Depo (DMM)', relatedTo: 'Site Visit', notes: 'Dihubungi ketika ada permintaan visit ke depo (internasional / MLO)' },
];

const initialSiteVisits = [
  { id: 1, institution: 'Universitas Ciputra (Logistics)', date: '2026-05-15', participants: 45, location: 'Head Office & Depo DMS', status: 'Planned' },
  { id: 2, institution: 'SMK Barunawati', date: '2026-04-10', participants: 30, location: 'Head Office', status: 'Completed' },
];

// --- SOP DATA ---
const defaultInternSOP = [
  { id: 1, icon: 'book', color: 'slate', title: '1. Jenis Internship di Meratus', description: 'Program Internship di Meratus terbagi menjadi beberapa kategori:', bullets: ['Formal Internship Request: Jalur resmi melalui HRBP atau program MBKM (Magang Kampus).', 'Mandiri: Permohonan langsung dari mahasiswa, tidak terikat langsung dengan universitas.', 'Informal Internship Request: Permintaan langsung dari user/manajemen, tidak melalui jalur formal HRBP.'], highlight: 'Referensi Dokumen: "Internship 2025"' },
  { id: 2, icon: 'database', color: 'blue', title: '2. Dokumentasi & Pipeline Internship', description: 'Penerimaan dokumen (melalui email resmi, surat fisik, atau permintaan user) wajib direkap dalam Database/Pipeline Internship. Berfungsi untuk:', bullets: ['Tracking kandidat & intern aktif.', 'Monitoring status (request, interview, accepted, ongoing, completed).', 'Kontrol administrasi program sebagai sumber data pelaporan.'] },
  { id: 3, icon: 'usercheck', color: 'indigo', title: '3. Proses Konfirmasi, Interview & Administrasi', description: 'Konfirmasi kebutuhan ke SBU/SFU terkait ketersediaan posisi.', subSections: [ { title: 'A. Tanpa Interview', bullets: ['Jika user tidak meminta interview, proses langsung dilanjutkan ke penerbitan Surat Penerimaan Magang.'] }, { title: 'B. Dengan Interview', bullets: ['Jika diperlukan, dijadwalkan interview. Hasil interview menjadi dasar keputusan penerbitan Surat Penerimaan.'] } ] },
  { id: 4, icon: 'pen', color: 'amber', title: '4. Penyelesaian Dokumen & Pengiriman Surat', description: 'Surat Penerimaan Magang dikirimkan kepada pihak universitas (mahasiswa di-cc dalam email). Mahasiswa kemudian wajib menyelesaikan administrasi akhir:', bullets: ['Mengisi Form Data Diri.', 'Menandatangani NDA (Non-Disclosure Agreement).'], highlight: 'Setelah dokumen diterima kembali, status di Pipeline harus segera di-update.' },
  { id: 5, icon: 'presentation', color: 'teal', title: '5. Hari Pertama Magang (Onboarding Awal)', description: 'Pada hari pertama, mahasiswa diberikan pengenalan perusahaan yang mencakup:', bullets: ['Gambaran umum Meratus Group, struktur organisasi, dan budaya kerja.', 'Ketentuan umum dan peraturan selama magang.', 'Informasi supervisor/unit penempatan.', 'Penyerahan Form Absensi sebagai dasar kontrol kehadiran.'] },
  { id: 6, icon: 'clipboard', color: 'purple', title: '6. Monitoring & Penyelesaian Program', description: 'Selama magang, monitoring teknis harian dilakukan oleh Supervisor SBU/SFU terkait. Tim Internship melakukan kontrol administrasi melalui rekap database dan Form Absensi.', highlight: 'Penyelesaian Magang: Pada akhir periode, perusahaan akan menerbitkan Surat Keterangan Magang. Perusahaan tidak menerbitkan sertifikat, melainkan hanya surat keterangan resmi.' },
  { id: 7, icon: 'dollar', color: 'emerald', title: '7. Ketentuan Tunjangan (Optional - Case Khusus)', description: 'Pada prinsipnya program magang tidak berbayar. Namun untuk kasus khusus (dengan persetujuan unit):', bullets: ['Tunjangan berasal dari budget SBU/SFU terkait.', 'Rata-rata tunjangan adalah Rp100.000 / hari (menyesuaikan kebijakan unit).', 'Opsi Pembayaran 1: Meratus Academy merekap absensi dan diserahkan ke Payroll (Ibu Amelia Dewi) untuk diproses.', 'Opsi Pembayaran 2: Ditanggung & dibayarkan secara mandiri oleh AP SBU/SFU terkait (Intern didaftarkan sbg 3rd party/vendor).', 'Cut-off pembayaran dilakukan pada minggu pertama setiap bulan.'] }
];

const defaultVisitSOP = [
  { id: 1, icon: 'filetext', color: 'blue', title: '1. Overview Site Visit', description: 'Program Site Visit merupakan kegiatan kunjungan dari pihak eksternal (universitas/sekolah) ke Meratus untuk tujuan edukasi dan pengenalan industri. Kunjungan terdiri dari dua bagian utama: Kegiatan di Head Office dan Kunjungan area operasional (Depo/Warehouse). Koordinasi dilakukan antara Meratus Academy dan unit terkait.' },
  { id: 2, icon: 'users', color: 'indigo', title: '2. Proses Permintaan & Initial Meeting', description: 'Permintaan diterima melalui email, surat resmi, atau koordinasi langsung. Pastikan hal berikut disepakati:', bullets: ['Tanggal dan waktu kunjungan', 'Jumlah peserta & Rundown kegiatan', 'Area operasional yang dikunjungi (memengaruhi PIC, Akses, APD)'], highlight: 'Ketentuan APD: Wajib digunakan di depo. Jika peserta tidak membawa, peminjaman skema: Corp Comm (15 set), Meratus Academy (10 set), sisanya dari depo terkait.' },
  { id: 3, icon: 'settings', color: 'slate', title: '3. Koordinasi Internal & Persiapan Teknis', description: 'Setelah detail disepakati, dilakukan koordinasi internal:', subSections: [ { title: 'Ke GA (Ruangan & Fasilitas)', bullets: ['Booking Café Lantai 2', 'Setting layout: Classroom', 'Email booking ke GA', 'Cek LCD, Mic, Sound System'] }, { title: 'Ke Depo / Warehouse', bullets: ['Menentukan PIC pendamping lapangan', 'Info jumlah peserta', 'Info rundown kegiatan'] } ] },
  { id: 4, icon: 'clock', color: 'amber', title: '4. Persiapan H-1', description: 'Sehari sebelum pelaksanaan, dilakukan langkah berikut:', bullets: ['Koordinasi Receptionist (Kartu Visitor)', 'Koordinasi Kendaraan/Bus ke Security', 'Siapkan Souvenir (penyerahan simbolis)', 'Reminder Internal & Cek kesiapan APD'] },
  { id: 5, icon: 'presentation', color: 'teal', title: '5. Pelaksanaan Hari-H', description: 'Pelaksanaan hari-H dibagi ke dalam dua tempat utama:', subSections: [ { title: 'Head Office', bullets: ['Distribusi Kartu Visitor', 'Arahkan ke Café Lantai 2', 'Company Intro & Tanya Jawab', 'Penyerahan Souvenir', 'Safety Briefing'] }, { title: 'Mobilisasi & Depo', bullets: ['Penggunaan APD Wajib', 'Site Tour didampingi PIC', 'Penjelasan operasional', 'Pengembalian Visitor Card'] } ] },
  { id: 6, icon: 'camera', color: 'purple', title: '6. Rekap & Dokumentasi', description: 'Setelah kegiatan selesai, pastikan untuk menyimpan Foto Kegiatan dan Daftar Hadir. Data ini akan digunakan untuk keperluan monitoring dan reporting kegiatan eksternal.' }
];

// --- ICON RENDERER HELPER ---
const RenderIcon = ({ name, className }: { name: string, className: string }) => {
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

const colorClasses: Record<string, string> = {
  slate: 'text-slate-700 bg-slate-50 border-slate-200',
  blue: 'text-blue-700 bg-blue-50 border-blue-200',
  indigo: 'text-indigo-700 bg-indigo-50 border-indigo-200',
  amber: 'text-amber-700 bg-amber-50 border-amber-200',
  teal: 'text-teal-700 bg-teal-50 border-teal-200',
  purple: 'text-purple-700 bg-purple-50 border-purple-200',
  emerald: 'text-emerald-700 bg-emerald-50 border-emerald-200',
};

// --- BADGE HELPER ---
const getStatusBadge = (status: string) => {
  switch(status) {
    case 'Accepted': case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'Process': case 'Ongoing': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Rejected': case 'Reject Offer': case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
    case 'Planned': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'SEDANG BERLANGSUNG': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'TIDAK AKTIF': return 'bg-slate-100 text-slate-600 border-slate-200';
    default: return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

export default function InternshipManagement() {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'partnerships' | 'visits' | 'guidelines'>('pipeline');
  
  // -- STATES --
  const [interns, setInterns] = useState(initialInterns);
  const [contacts, setContacts] = useState(initialContacts);
  const [schedules, setSchedules] = useState(initialSchedules);
  const [agreements, setAgreements] = useState(initialAgreements);
  const [visitContacts, setVisitContacts] = useState(initialVisitContacts);
  const [siteVisits, setSiteVisits] = useState(initialSiteVisits);

  const [internSOP, setInternSOP] = useState(defaultInternSOP);
  const [visitSOP, setVisitSOP] = useState(defaultVisitSOP);

  // Pipeline Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [universityFilter, setUniversityFilter] = useState('All');
  const [sbuFilter, setSbuFilter] = useState('All');
  const [timelineFilter, setTimelineFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  
  // Modals
  const [isInternModalOpen, setIsInternModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingIntern, setEditingIntern] = useState<any>(null);
  const [excelData, setExcelData] = useState('');
  
  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);
  const [editingAgreement, setEditingAgreement] = useState<any>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<any>(null);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState<any>(null);
  const [isVisitContactModalOpen, setIsVisitContactModalOpen] = useState(false);
  const [editingVisitContact, setEditingVisitContact] = useState<any>(null);

  const [isSopModalOpen, setIsSopModalOpen] = useState(false);
  const [editingSop, setEditingSop] = useState<any>(null);
  const [editingSopType, setEditingSopType] = useState<'intern' | 'visit'>('intern');

  const [itemToDelete, setItemToDelete] = useState<{type: 'intern'|'agreement'|'schedule'|'contact'|'visit'|'visitContact', id: number} | null>(null);

  // --- PIPELINE LOGIC ---
  const uniqueUniversities = useMemo(() => Array.from(new Set(interns.map(i => i.university))).filter(u => u !== '-'), [interns]);
  const uniqueSBUs = useMemo(() => Array.from(new Set(interns.map(i => i.group))).filter(g => g !== '-'), [interns]);

  const isFinishingSoon = (finishDateStr: string) => {
    if (!finishDateStr || finishDateStr === '-') return false;
    const finishDate = new Date(finishDateStr);
    const diffDays = Math.ceil((finishDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  };

  const isFinished = (intern: any) => {
    if (intern.internshipStatus === 'Finish') return true;
    if (!intern.finishDate || intern.finishDate === '-') return false;
    return new Date(intern.finishDate) < new Date();
  };

  const pipelineStats = useMemo(() => ({
    total: interns.length,
    accepted: interns.filter(i => i.status === 'Accepted').length,
    process: interns.filter(i => i.status === 'Process').length,
    rejected: interns.filter(i => i.status === 'Rejected' || i.status === 'Reject Offer').length,
    finishingSoon: interns.filter(i => i.status === 'Accepted' && isFinishingSoon(i.finishDate)).length,
  }), [interns]);

  const filteredAndSortedInterns = useMemo(() => {
    let result = [...interns];
    if (searchTerm) result = result.filter(intern => intern.name.toLowerCase().includes(searchTerm.toLowerCase()) || intern.university.toLowerCase().includes(searchTerm.toLowerCase()));
    if (statusFilter !== 'All') result = result.filter(intern => intern.status === statusFilter);
    if (universityFilter !== 'All') result = result.filter(intern => intern.university === universityFilter);
    if (sbuFilter !== 'All') result = result.filter(intern => intern.group === sbuFilter);
    if (timelineFilter !== 'All') {
      result = result.filter(intern => {
        if (timelineFilter === 'Finishing Soon') return isFinishingSoon(intern.finishDate);
        if (timelineFilter === 'Active') return intern.status === 'Accepted' && !isFinished(intern);
        if (timelineFilter === 'Finished') return isFinished(intern);
        return true;
      });
    }
    if (sortConfig !== null) {
      result.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [interns, searchTerm, statusFilter, universityFilter, sbuFilter, timelineFilter, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig({ key, direction: sortConfig?.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc' });
  };

  const handleImportExcel = () => {
    const rows = excelData.trim().split('\n');
    if (rows.length < 2) return alert('Format tidak valid. Pastikan ada baris data selain header.');
    const newInterns = rows.slice(1).map((row, index) => {
      const cols = row.split('\t');
      return {
        id: Date.now() + index,
        name: cols[0] || 'Unknown', university: cols[1] || '-', department: cols[2] || '-',
        status: cols[3] || 'Process', group: cols[5] || '-', supervisor: cols[6] || '-',
        joinDate: cols[7] || '-', finishDate: cols[8] || '-', internshipStatus: cols[9] || '-'
      };
    });
    setInterns([...newInterns, ...interns]);
    setIsImportModalOpen(false); setExcelData('');
  };

  const handleSaveIntern = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      id: editingIntern ? editingIntern.id : Date.now(),
      name: formData.get('name') as string, university: formData.get('university') as string,
      department: formData.get('department') as string, status: formData.get('status') as string,
      group: formData.get('group') as string || '-', supervisor: formData.get('supervisor') as string || '-',
      joinDate: formData.get('joinDate') as string || '-', finishDate: formData.get('finishDate') as string || '-',
      internshipStatus: formData.get('internshipStatus') as string || '-'
    };
    editingIntern ? setInterns(interns.map(i => i.id === data.id ? data : i)) : setInterns([data, ...interns]);
    setIsInternModalOpen(false);
  };

  // --- PARTNERSHIPS LOGIC ---
  const [partnerSubTab, setPartnerSubTab] = useState<'agreements' | 'schedules' | 'contacts'>('agreements');
  const [contactSearch, setContactSearch] = useState('');

  const partnershipStats = useMemo(() => ({
    totalAgreements: agreements.length,
    activeAgreements: agreements.filter(a => a.status === 'SEDANG BERLANGSUNG').length,
    totalSchedules: schedules.length,
    totalContacts: contacts.length
  }), [agreements, schedules, contacts]);

  const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(contactSearch.toLowerCase()) || c.institution.toLowerCase().includes(contactSearch.toLowerCase()));

  const handleSaveAgreement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      id: editingAgreement ? editingAgreement.id : Date.now(),
      type: formData.get('type') as string, status: formData.get('status') as string,
      pihak1: formData.get('pihak1') as string, pihak2: formData.get('pihak2') as string,
      tentang: formData.get('tentang') as string, nomor: formData.get('nomor') as string, durasi: formData.get('durasi') as string,
    };
    editingAgreement ? setAgreements(agreements.map(a => a.id === data.id ? data : a)) : setAgreements([data, ...agreements]);
    setIsAgreementModalOpen(false);
  };

  const handleSaveSchedule = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const selectedMonths = Array.from({length: 12}, (_, i) => i).filter(i => formData.get(`month_${i}`));
    const data = {
      id: editingSchedule ? editingSchedule.id : Date.now(),
      institution: formData.get('institution') as string, duration: formData.get('duration') as string,
      startPeriod: formData.get('startPeriod') as string, notes: formData.get('notes') as string,
      months: selectedMonths
    };
    editingSchedule ? setSchedules(schedules.map(s => s.id === data.id ? data : s)) : setSchedules([...schedules, data]);
    setIsScheduleModalOpen(false);
  };

  const handleSaveContact = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      id: editingContact ? editingContact.id : Date.now(),
      name: formData.get('name') as string, department: formData.get('department') as string,
      institution: formData.get('institution') as string, contact: formData.get('contact') as string,
    };
    editingContact ? setContacts(contacts.map(c => c.id === data.id ? data : c)) : setContacts([data, ...contacts]);
    setIsContactModalOpen(false);
  };

  // --- SITE VISITS LOGIC ---
  const [visitSubTab, setVisitSubTab] = useState<'tracker' | 'sop' | 'contacts'>('sop');
  
  const handleSaveVisit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      id: editingVisit ? editingVisit.id : Date.now(),
      institution: formData.get('institution') as string, date: formData.get('date') as string,
      participants: Number(formData.get('participants')), location: formData.get('location') as string, status: formData.get('status') as string,
    };
    editingVisit ? setSiteVisits(siteVisits.map(v => v.id === data.id ? data : v)) : setSiteVisits([data, ...siteVisits]);
    setIsVisitModalOpen(false);
  };

  const handleSaveVisitContact = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      id: editingVisitContact ? editingVisitContact.id : Date.now(),
      name: formData.get('name') as string, position: formData.get('position') as string,
      relatedTo: formData.get('relatedTo') as string, notes: formData.get('notes') as string,
    };
    editingVisitContact ? setVisitContacts(visitContacts.map(c => c.id === data.id ? data : c)) : setVisitContacts([data, ...visitContacts]);
    setIsVisitContactModalOpen(false);
  };

  // --- SOP LOGIC (EDIT) ---
  const handleSaveSOP = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const bulletsRaw = formData.get('bullets') as string;
    const bullets = bulletsRaw ? bulletsRaw.split('\n').filter(b => b.trim() !== '') : undefined;
    
    const updatedSOP = {
      ...editingSop,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      highlight: formData.get('highlight') as string,
    };
    if (!editingSop.subSections) updatedSOP.bullets = bullets;

    if (editingSopType === 'intern') setInternSOP(internSOP.map(s => s.id === editingSop.id ? updatedSOP : s));
    else setVisitSOP(visitSOP.map(s => s.id === editingSop.id ? updatedSOP : s));
    setIsSopModalOpen(false);
  };

  // --- UNIVERSAL DELETE ---
  const executeDelete = () => {
    if (!itemToDelete) return;
    const { type, id } = itemToDelete;
    if (type === 'intern') setInterns(interns.filter(i => i.id !== id));
    if (type === 'agreement') setAgreements(agreements.filter(a => a.id !== id));
    if (type === 'schedule') setSchedules(schedules.filter(s => s.id !== id));
    if (type === 'contact') setContacts(contacts.filter(c => c.id !== id));
    if (type === 'visit') setSiteVisits(siteVisits.filter(v => v.id !== id));
    if (type === 'visitContact') setVisitContacts(visitContacts.filter(vc => vc.id !== id));
    setItemToDelete(null);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-screen font-sans text-slate-900">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Internship & Visits</h1>
          <p className="text-slate-500 mt-2 max-w-2xl">Platform terpusat untuk mengelola pipeline magang, partnership universitas, dan penjadwalan site visit eksternal.</p>
        </div>
      </div>

      {/* Modern Tabs Navigation */}
      <div className="inline-flex space-x-1 bg-slate-200/50 p-1.5 rounded-xl overflow-x-auto max-w-full">
        {[
          { id: 'pipeline', label: 'Pipeline Interns', icon: Users },
          { id: 'partnerships', label: 'Partnerships & MoU', icon: Building2 },
          { id: 'visits', label: 'Site Visits', icon: Calendar },
          { id: 'guidelines', label: 'Guidelines & Templates', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
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

      {/* ======================================= */}
      {/* 1. PIPELINE INTERNS TAB                 */}
      {/* ======================================= */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          
          {/* Dashboard Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: 'Total Interns', value: pipelineStats.total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Accepted', value: pipelineStats.accepted, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'In Process', value: pipelineStats.process, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
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
                  {uniqueUniversities.map((uni, idx) => <option key={idx} value={uni as string}>{uni as string}</option>)}
                </select>

                <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500/20 outline-none max-w-[150px] truncate" value={sbuFilter} onChange={(e) => setSbuFilter(e.target.value)}>
                  <option value="All">Semua SBU/SFU</option>
                  {uniqueSBUs.map((sbu, idx) => <option key={idx} value={sbu as string}>{sbu as string}</option>)}
                </select>

                <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500/20 outline-none" value={timelineFilter} onChange={(e) => setTimelineFilter(e.target.value)}>
                  <option value="All">Semua Periode</option>
                  <option value="Active">Sedang Aktif</option>
                  <option value="Finishing Soon">Segera Selesai (&lt;30 Hari)</option>
                  <option value="Finished">Sudah Selesai</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-2 shrink-0">
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
                    <th className="px-6 py-4">SBU / SFU</th>
                    <th className="px-6 py-4">Mentor</th>
                    <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('joinDate')}><div className="flex items-center gap-2">Join Date <ArrowUpDown className="w-3 h-3 text-slate-400"/></div></th>
                    <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('finishDate')}><div className="flex items-center gap-2">Finish Date <ArrowUpDown className="w-3 h-3 text-slate-400"/></div></th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAndSortedInterns.map((intern) => (
                    <tr key={intern.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 font-semibold text-slate-900">{intern.name}</td>
                      <td className="px-6 py-4 text-slate-600">{intern.university}</td>
                      <td className="px-6 py-4 text-slate-600">{intern.department}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusBadge(intern.status)}`}>
                          {intern.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{intern.group}</td>
                      <td className="px-6 py-4 text-slate-600">{intern.supervisor}</td>
                      <td className="px-6 py-4 text-slate-600 font-mono text-xs">{intern.joinDate !== '-' ? intern.joinDate : '-'}</td>
                      <td className="px-6 py-4 text-slate-600">
                        {intern.finishDate !== '-' ? (
                          <div className="flex flex-col gap-1.5 items-start">
                            <span className="font-mono text-xs">{intern.finishDate}</span>
                            {isFinishingSoon(intern.finishDate) && intern.status === 'Accepted' && (
                              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 border border-orange-200 rounded text-[10px] font-bold uppercase tracking-wider">⏳ &lt;30 Hari</span>
                            )}
                          </div>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditingIntern(intern); setIsInternModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4"/></button>
                          <button onClick={() => setItemToDelete({type: 'intern', id: intern.id})} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredAndSortedInterns.length === 0 && <tr><td colSpan={9} className="px-6 py-12 text-center text-slate-500 font-medium">Tidak ada data intern ditemukan</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* 2. PARTNERSHIPS TAB                     */}
      {/* ======================================= */}
      {activeTab === 'partnerships' && (
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
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================= */}
      {/* 3. SITE VISITS TAB                      */}
      {/* ======================================= */}
      {activeTab === 'visits' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex space-x-6 border-b border-slate-200">
            <button onClick={() => setVisitSubTab('sop')} className={`pb-3 text-sm font-semibold transition-colors relative ${visitSubTab === 'sop' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>SOP & Guidelines {visitSubTab === 'sop' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}</button>
            <button onClick={() => setVisitSubTab('tracker')} className={`pb-3 text-sm font-semibold transition-colors relative ${visitSubTab === 'tracker' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>Visit Tracker {visitSubTab === 'tracker' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}</button>
            <button onClick={() => setVisitSubTab('contacts')} className={`pb-3 text-sm font-semibold transition-colors relative ${visitSubTab === 'contacts' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>Visit Key Contacts {visitSubTab === 'contacts' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}</button>
          </div>

          {/* VISIT: SOP & GUIDELINES */}
          {visitSubTab === 'sop' && (
            <div className="space-y-6">
              <div className="mb-2">
                <h3 className="text-lg font-bold text-slate-900">SOP & Alur Site Visit</h3>
                <p className="text-sm text-slate-500">Standar Operasional Prosedur penanganan kunjungan site visit.</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 md:p-10">
                <div className="relative border-l-2 border-slate-200 ml-4 space-y-12 pb-4">
                  {visitSOP.map((step) => (
                    <div key={step.id} className="relative pl-10 group">
                      <div className={`absolute w-12 h-12 border-[3px] rounded-full -left-[25px] top-0 flex items-center justify-center shadow-sm ${colorClasses[step.color]}`}>
                        <RenderIcon name={step.icon} className="w-5 h-5" />
                      </div>
                      
                      <button 
                        onClick={() => { setEditingSop(step); setEditingSopType('visit'); setIsSopModalOpen(true); }}
                        className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1.5 font-semibold text-xs"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>

                      <div className="pr-20">
                        <h4 className="text-lg font-extrabold text-slate-900 mb-2">{step.title}</h4>
                        <p className="text-sm text-slate-600 mb-4 leading-relaxed">{step.description}</p>
                        
                        {step.bullets && (
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
      {/* 4. GUIDELINES & TEMPLATES TAB           */}
      {/* ======================================= */}
      {activeTab === 'guidelines' && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
          
          {/* Download Center */}
          <div>
            <div className="mb-5">
              <h3 className="text-lg font-bold text-slate-900">Download Templates</h3>
              <p className="text-sm text-slate-500">File master administrasi untuk keperluan penerimaan hingga penyelesaian magang.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { title: 'Surat Penerimaan', ext: '.pdf', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
                { title: 'Form Data Diri', ext: '.pdf', icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { title: 'Template NDA', ext: '.pdf', icon: Shield, color: 'text-red-600', bg: 'bg-red-50' },
                { title: 'Surat Keterangan', ext: '.pdf', icon: Award, color: 'text-purple-600', bg: 'bg-purple-50' },
                { title: 'Form Absensi', ext: '.xlsx', icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50' },
              ].map((tmpl, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col items-center text-center group cursor-pointer" onClick={() => alert(`Fitur unduh: ${tmpl.title} akan diintegrasikan dengan backend.`)}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${tmpl.bg} ${tmpl.color} group-hover:bg-blue-600 group-hover:text-white`}>
                    <tmpl.icon className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1">{tmpl.title}</h4>
                  <p className="text-xs text-slate-400 font-mono mb-4">{tmpl.ext}</p>
                  <div className="mt-auto flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:underline"><Download className="w-3.5 h-3.5"/> Download</div>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-slate-200/60" />

          {/* SOP Internship Timeline */}
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900">SOP & Alur Program Internship</h3>
              <p className="text-sm text-slate-500">Panduan detail operasional dan flow penerimaan peserta magang Meratus.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 md:p-10">
              <div className="relative border-l-2 border-slate-200 ml-4 space-y-12 pb-4">
                
                {internSOP.map((step) => (
                  <div key={step.id} className="relative pl-10 group">
                    <div className={`absolute w-12 h-12 border-[3px] rounded-full -left-[25px] top-0 flex items-center justify-center shadow-sm ${colorClasses[step.color]}`}>
                      <RenderIcon name={step.icon} className="w-5 h-5" />
                    </div>

                    <button 
                      onClick={() => { setEditingSop(step); setEditingSopType('intern'); setIsSopModalOpen(true); }}
                      className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1.5 font-semibold text-xs"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    
                    <div className="pr-20">
                      <h4 className="text-lg font-extrabold text-slate-900 mb-2">{step.title}</h4>
                      <p className="text-sm text-slate-600 mb-4 leading-relaxed">{step.description}</p>
                      
                      {step.bullets && (
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
                
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ======================================= */}
      {/* UNIVERSAL MODALS                        */}
      {/* ======================================= */}
      
      {/* SOP Editing Modal */}
      {isSopModalOpen && editingSop && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto border border-slate-100">
            <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-3 text-slate-900">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Edit2 className="w-5 h-5" /></span> Edit Detail SOP
            </h2>
            <form onSubmit={handleSaveSOP} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Judul Tahapan</label>
                <input required name="title" defaultValue={editingSop.title} className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 rounded-xl font-bold outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Deskripsi Utama</label>
                <textarea required name="description" defaultValue={editingSop.description} className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 rounded-xl h-24 outline-none transition-all" />
              </div>
              
              {!editingSop.subSections && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">List Poin (Bullets)</label>
                  <p className="text-xs text-slate-500 mb-2">Pisahkan setiap poin dengan baris baru (Enter).</p>
                  <textarea name="bullets" defaultValue={editingSop.bullets?.join('\n')} className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 rounded-xl h-36 outline-none transition-all" />
                </div>
              )}

              {editingSop.subSections && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 font-medium">
                  <AlertCircle className="w-5 h-5 inline mr-2 text-amber-500 mb-0.5" /> 
                  SOP ini menggunakan format kolom terpisah (Sub-sections). Untuk mengedit konten list di kolom ini diperlukan akses admin tingkat lanjut. Anda tetap bisa mengubah Judul, Deskripsi, dan Highlight.
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Highlight / Catatan Khusus (Opsional)</label>
                <input name="highlight" defaultValue={editingSop.highlight} placeholder="Teks yang akan diwarnai dalam kotak kuning (opsional)" className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 rounded-xl outline-none transition-all" />
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setIsSopModalOpen(false)} className="px-5 py-2.5 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors">Batal</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {itemToDelete !== null && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center border border-slate-100">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-2">Konfirmasi Hapus</h2>
            <p className="text-sm text-slate-500 mb-8">Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setItemToDelete(null)} className="flex-1 px-4 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold transition-colors">Batal</button>
              <button onClick={executeDelete} className="flex-1 px-4 py-3 bg-red-600 text-white hover:bg-red-700 rounded-xl font-semibold shadow-sm transition-colors">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Import Excel */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 md:p-8 border border-slate-100">
            <h2 className="text-2xl font-extrabold mb-2 text-slate-900">Import Data dari Excel</h2>
            <p className="text-sm text-slate-500 mb-6">
              Copy baris dari Excel (Nama, Universitas, Jurusan, Status, dll) lalu Paste ke dalam text area di bawah ini. Pastikan format kolom sesuai dengan template standar Pipeline.
            </p>
            <textarea 
              className="w-full h-64 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-mono whitespace-pre focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
              placeholder="Paste data excel disini..."
              value={excelData}
              onChange={(e) => setExcelData(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsImportModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors">Batal</button>
              <button onClick={handleImportExcel} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-sm transition-colors">Proses Import</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Intern */}
      {isInternModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto border border-slate-100">
            <h2 className="text-2xl font-extrabold mb-6 text-slate-900">{editingIntern ? 'Edit Data Intern' : 'Add New Intern'}</h2>
            <form onSubmit={handleSaveIntern} className="space-y-4">
              <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Nama Mahasiswa</label><input required name="name" defaultValue={editingIntern?.name} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Universitas</label><input required name="university" defaultValue={editingIntern?.university} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Jurusan</label><input required name="department" defaultValue={editingIntern?.department} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Status Pipeline</label>
                  <select name="status" defaultValue={editingIntern?.status || 'Process'} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                    <option value="Accepted">Accepted</option>
                    <option value="Process">Process</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Reject Offer">Reject Offer</option>
                  </select>
                </div>
                <div><label className="block text-sm font-bold text-slate-700 mb-1.5">SBU / SFU</label><input name="group" defaultValue={editingIntern?.group} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Join Date</label><input type="date" name="joinDate" defaultValue={editingIntern?.joinDate} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-1.5">Finish Date</label><input type="date" name="finishDate" defaultValue={editingIntern?.finishDate} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div>
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setIsInternModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors">Batal</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-sm transition-colors">Simpan</button>
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
                      <input type="checkbox" name={`month_${idx}`} defaultChecked={editingSchedule?.months?.includes(idx)} className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"/>
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

    </div>
  );
}