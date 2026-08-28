import { useState, useEffect } from 'react';
import { Music, Trophy, Users, Film, Church as ChurchIcon, Mail, Plus, Trash2, Edit, Save, CheckCircle2, X, Reply, Upload, Image as ImageIcon, Check, Loader2, Search } from 'lucide-react';
import { apiService } from '../services/api';
import defaultLineData from '../dataset/lineChartData';
import defaultBarData from '../dataset/barChartData';

import {
  LineChart, Line, BarChart, Bar, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from "recharts";

const Dashboard = ({ darkMode, user }) => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'churches' | 'members' | 'messages'
  const [counters, setCounters] = useState({ audio: 24, clips: 24, awards: 3, members: 50, churches: 6, messages: 0 });
  const [churches, setChurches] = useState([]);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Modal states for Church
  const [showChurchModal, setShowChurchModal] = useState(false);
  const [editingChurchId, setEditingChurchId] = useState(null);
  const [churchForm, setChurchForm] = useState({
    name: '', latitude: -21.4415, longitude: 47.105, address: '', pastor: '', phone: '', schedule: '', description: '', photo: '',
  });

  // Modal states for Member / Tanora
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [memberForm, setMemberForm] = useState({
    name: '', role: 'Mpikambana', church: 'Fiangonana Tambohobe', photo: '', description: '',
  });

  // Modal state for Admin Email Reply
  const [replyMessageItem, setReplyMessageItem] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // Load backend data
  const loadData = async () => {
    try {
      const stats = await apiService.getDashboardStats();
      if (stats?.counters) setCounters(stats.counters);
    } catch (e) {}

    try {
      const chData = await apiService.getChurches();
      if (chData) setChurches(chData);
    } catch (e) {}

    try {
      const memData = await apiService.getMembers();
      if (memData) setMembers(memData);
    } catch (e) {}

    try {
      const msgData = await apiService.getContactMessages();
      if (msgData) setMessages(msgData);
    } catch (e) {}
  };

  useEffect(() => {
    loadData();
  }, []);

  // Local File Upload Handler for Church photo
  const handleChurchFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await apiService.uploadImage(file);
      if (res?.url) {
        setChurchForm((prev) => ({ ...prev, photo: res.url }));
      }
    } catch (err) {
      alert("Erreur upload sary: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // Local File Upload Handler for Member photo
  const handleMemberFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await apiService.uploadImage(file);
      if (res?.url) {
        setMemberForm((prev) => ({ ...prev, photo: res.url }));
      }
    } catch (err) {
      alert("Erreur upload sary: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // Church CRUD
  const handleSaveChurch = async (e) => {
    e.preventDefault();
    try {
      if (editingChurchId) {
        await apiService.updateChurch(editingChurchId, churchForm);
      } else {
        await apiService.createChurch(churchForm);
      }
      setShowChurchModal(false);
      setEditingChurchId(null);
      setChurchForm({ name: '', latitude: -21.4415, longitude: 47.105, address: '', pastor: '', phone: '', schedule: '', description: '', photo: '' });
      loadData();
    } catch (err) {
      alert("Erreur enregistrement église: " + err.message);
    }
  };

  const handleEditChurch = (ch) => {
    setEditingChurchId(ch.id);
    setChurchForm({
      name: ch.name || '', latitude: ch.latitude || -21.4415, longitude: ch.longitude || 47.105,
      address: ch.address || '', pastor: ch.pastor || '', phone: ch.phone || '', schedule: ch.schedule || '', description: ch.description || '', photo: ch.photo || '',
    });
    setShowChurchModal(true);
  };

  const handleDeleteChurch = async (id) => {
    if (window.confirm("Fafana tokoa ve ity fiangonana ity ?")) {
      try {
        await apiService.deleteChurch(id);
        loadData();
      } catch (err) {
        alert("Erreur suppression: " + err.message);
      }
    }
  };

  // Member CRUD
  const handleSaveMember = async (e) => {
    e.preventDefault();
    try {
      if (editingMemberId) {
        await apiService.updateMember(editingMemberId, memberForm);
      } else {
        await apiService.createMember(memberForm);
      }
      setShowMemberModal(false);
      setEditingMemberId(null);
      setMemberForm({ name: '', role: 'Mpikambana', church: 'Fiangonana Tambohobe', photo: '', description: '' });
      loadData();
    } catch (err) {
      alert("Erreur enregistrement mpikambana: " + err.message);
    }
  };

  const handleEditMember = (m) => {
    setEditingMemberId(m.id);
    setMemberForm({
      name: m.name || '', role: m.role || 'Mpikambana', church: m.church || '', photo: m.photo || '', description: m.description || '',
    });
    setShowMemberModal(true);
  };

  const handleDeleteMember = async (id) => {
    if (window.confirm("Fafana ity mpikambana tanora ity ?")) {
      try {
        await apiService.deleteMember(id);
        loadData();
      } catch (err) {
        alert("Erreur suppression: " + err.message);
      }
    }
  };

  // Admin Reply to Contact Message
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !replyMessageItem) return;

    setSendingReply(true);
    try {
      await apiService.replyContactMessage(replyMessageItem.id, replyText);
      alert(`✅ Valin-kafatra nalefa soa aman-tsara tany amin'i ${replyMessageItem.email} !`);
      setReplyMessageItem(null);
      setReplyText('');
      loadData();
    } catch (err) {
      alert("Erreur envoi réponse: " + err.message);
    } finally {
      setSendingReply(false);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (window.confirm("Fafana ity hafatra ity ?")) {
      try {
        await apiService.deleteContactMessage(id);
        loadData();
      } catch (e) {}
    }
  };

  return (
    <div className={`min-h-screen pt-24 pb-12 px-4 transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header & Navigation Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <span className="px-3 py-1 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 text-xs font-bold rounded-full uppercase tracking-wider">
              Espace Administrateur
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold mt-2">Tabilao Famitinana & Fitantanana</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tongasoa, {user?.name || 'Admin'}</p>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            {[
              { id: 'overview', label: 'Tabilao (Overview)' },
              { id: 'churches', label: `Fiangonana (${churches.length})` },
              { id: 'members', label: `Tanora / Mpikambana (${members.length})` },
              { id: 'messages', label: `Hafatra (${messages.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: ChurchIcon, label: "Fiangonana", value: churches.length, color: "from-blue-600 to-blue-700" },
                { icon: Users, label: "Tanora / Mpikambana", value: members.length || counters.members, color: "from-emerald-500 to-emerald-600" },
                { icon: Mail, label: "Hafatra azo", value: messages.length, color: "from-purple-600 to-purple-700" },
                { icon: Trophy, label: "Amboara", value: counters.awards, color: "from-amber-500 to-amber-600" },
              ].map((stat, index) => (
                <div key={index} className={`p-6 rounded-2xl shadow-lg border transition-transform hover:-translate-y-1 ${
                  darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white shadow`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-extrabold mb-1">{stat.value}</h3>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className={`rounded-2xl p-6 shadow-lg border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
                <h3 className="text-lg font-bold mb-6">Fivoarana isambolana</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={defaultLineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: darkMode ? "#1f2937" : "#fff", borderRadius: "8px" }} />
                    <Line type="monotone" dataKey="hira" stroke="#3b82f6" strokeWidth={3} />
                    <Line type="monotone" dataKey="mpikambana" stroke="#10b981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className={`rounded-2xl p-6 shadow-lg border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
                <h3 className="text-lg font-bold mb-6">Taha ankapobeny</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={defaultBarData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="category" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: darkMode ? "#1f2937" : "#fff", borderRadius: "8px" }} />
                    <Bar dataKey="isa" radius={[8, 8, 0, 0]}>
                      {defaultBarData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CHURCHES */}
        {activeTab === 'churches' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Fitantanana ny Fiangonana FFSM</h2>
              <button
                onClick={() => {
                  setEditingChurchId(null);
                  setChurchForm({ name: '', latitude: -21.4415, longitude: 47.105, address: '', pastor: '', phone: '', schedule: '', description: '', photo: '' });
                  setShowChurchModal(true);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow cursor-pointer"
              >
                <Plus size={16} /> Hanampy Fiangonana
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {churches.map((ch) => (
                <div key={ch.id} className={`p-5 rounded-2xl shadow border flex flex-col justify-between ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                  <div>
                    {ch.photo && (
                      <img src={ch.photo} alt={ch.name} className="w-full h-36 object-cover rounded-xl mb-3" />
                    )}
                    <h3 className="font-bold text-lg text-blue-600 dark:text-blue-400 mb-1">{ch.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">{ch.address || 'Fianarantsoa'}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">Mpitandrina: {ch.pastor || '-'}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Horaire: {ch.schedule || '-'}</p>
                  </div>

                  <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => handleEditChurch(ch)}
                      className="flex-1 py-1.5 bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Edit size={14} /> Hanova
                    </button>
                    <button
                      onClick={() => handleDeleteChurch(ch.id)}
                      className="flex-1 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Trash2 size={14} /> Fafana
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MEMBERS / TANORA */}
        {activeTab === 'members' && (() => {
          const filteredAdminMembers = members.filter((m) => {
            const q = memberSearchQuery.toLowerCase().trim();
            if (!q) return true;
            return (
              (m.name && m.name.toLowerCase().includes(q)) ||
              (m.role && m.role.toLowerCase().includes(q)) ||
              (m.church && m.church.toLowerCase().includes(q)) ||
              (m.description && m.description.toLowerCase().includes(q))
            );
          });

          return (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold">Fitantanana ny Mpikambana / Tanora Manaotsara</h2>
                  <p className="text-xs text-gray-500">Hanampy tanora vaovao amin'ny alalan'ny sary amin'ny ordinateur (disk local) na URL</p>
                </div>
                <button
                  onClick={() => {
                    setEditingMemberId(null);
                    setMemberForm({ name: '', role: 'Mpikambana', church: 'Fiangonana Tambohobe', photo: '', description: '' });
                    setShowMemberModal(true);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow cursor-pointer"
                >
                  <Plus size={16} /> Hanampy Tanora Vaovao
                </button>
              </div>

              {/* SEARCH BAR FOR ADMIN TANORA */}
              <div className="relative">
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                  placeholder="Fikarohana tanora amin'ny admin (Anarana, andraikitra, fiangonana)..."
                  className="w-full pl-11 pr-10 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white outline-none focus:border-emerald-500 text-xs shadow-sm"
                />
                {memberSearchQuery && (
                  <button
                    onClick={() => setMemberSearchQuery('')}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 p-0.5"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {filteredAdminMembers.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 font-bold text-sm">Tsy misy tanora mifanaraka amin'ny fikarohana.</p>
                  <button
                    onClick={() => setMemberSearchQuery('')}
                    className="mt-3 px-4 py-2 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-xl"
                  >
                    Fafana ny fikarohana
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredAdminMembers.map((m) => (
                    <div key={m.id} className={`p-5 rounded-2xl shadow border flex flex-col justify-between ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                      <div>
                        <div className="w-full h-44 rounded-xl overflow-hidden mb-3 bg-gray-100">
                          <img src={m.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'} alt={m.name} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-bold text-base text-gray-800 dark:text-white mb-1">{m.name}</h3>
                        <span className="inline-block px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 text-[11px] font-bold rounded-full mb-2">
                          {m.role}
                        </span>
                        <p className="text-xs text-gray-500 font-medium mb-2">{m.church}</p>
                        {m.description && (
                          <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 italic bg-gray-50 dark:bg-gray-750 p-2 rounded-lg">
                            "{m.description}"
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <button
                          onClick={() => handleEditMember(m)}
                          className="flex-1 py-1.5 bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Edit size={14} /> Hanova
                        </button>
                        <button
                          onClick={() => handleDeleteMember(m.id)}
                          className="flex-1 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Trash2 size={14} /> Fafana
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* TAB 4: MESSAGES & ADMIN REPLY */}
        {activeTab === 'messages' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold">Hafatra azo & Valin-kafatra (Réponse aux emails)</h2>

            {messages.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Mbola tsy misy hafatra voaray.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`p-6 rounded-2xl shadow border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                    <div className="flex flex-wrap justify-between items-start mb-3 gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-base text-gray-800 dark:text-white">{msg.name}</h3>
                          {msg.isReplied && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold rounded-full flex items-center gap-1">
                              <Check size={12} /> Voavaly (Répondu)
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{msg.email}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-400">
                          {new Date(msg.createdAt).toLocaleString('fr-FR')}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-xl text-sm leading-relaxed mb-4 text-gray-700 dark:text-gray-300">
                      <p className="font-semibold text-xs text-gray-500 mb-1">Hafatra avy amin'ny client:</p>
                      {msg.message}
                    </div>

                    {msg.isReplied && msg.replyText && (
                      <div className="p-4 bg-blue-50/80 dark:bg-blue-950/40 border-l-4 border-blue-600 rounded-xl text-xs mb-4">
                        <p className="font-bold text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-1">
                          <Reply size={14} /> Valin-kafatra nalefan'ny Admin:
                        </p>
                        <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{msg.replyText}</p>
                        <p className="text-[10px] text-gray-400 mt-2">
                          Daty: {msg.repliedAt ? new Date(msg.repliedAt).toLocaleString('fr-FR') : '-'}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-xs pt-2 border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={() => {
                          setReplyMessageItem(msg);
                          setReplyText(msg.replyText || '');
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow cursor-pointer"
                      >
                        <Reply size={14} />
                        <span>{msg.isReplied ? 'Hambara indray (Répondre)' : 'Valiana amin\'ny mailaka (Répondre)'}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 p-2 cursor-pointer"
                      >
                        <Trash2 size={14} /> Fafana
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* CHURCH ADD/EDIT MODAL WITH LOCAL FILE UPLOAD */}
      {showChurchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-3xl p-6 shadow-2xl animate-fade-in ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold">{editingChurchId ? 'Hanova Fiangonana' : 'Hanampy Fiangonana Vaovao'}</h3>
              <button onClick={() => setShowChurchModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveChurch} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Anarana fiangonana</label>
                <input type="text" required value={churchForm.name} onChange={(e) => setChurchForm({ ...churchForm, name: e.target.value })} className="w-full p-3 rounded-xl border dark:border-gray-700 dark:bg-gray-700" placeholder="Fiangonana..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Latitude</label>
                  <input type="number" step="any" required value={churchForm.latitude} onChange={(e) => setChurchForm({ ...churchForm, latitude: parseFloat(e.target.value) })} className="w-full p-3 rounded-xl border dark:border-gray-700 dark:bg-gray-700" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Longitude</label>
                  <input type="number" step="any" required value={churchForm.longitude} onChange={(e) => setChurchForm({ ...churchForm, longitude: parseFloat(e.target.value) })} className="w-full p-3 rounded-xl border dark:border-gray-700 dark:bg-gray-700" />
                </div>
              </div>
              <div>
                <label className="block font-bold mb-1">Adresse</label>
                <input type="text" value={churchForm.address} onChange={(e) => setChurchForm({ ...churchForm, address: e.target.value })} className="w-full p-3 rounded-xl border dark:border-gray-700 dark:bg-gray-700" />
              </div>
              <div>
                <label className="block font-bold mb-1">Mpitandrina</label>
                <input type="text" value={churchForm.pastor} onChange={(e) => setChurchForm({ ...churchForm, pastor: e.target.value })} className="w-full p-3 rounded-xl border dark:border-gray-700 dark:bg-gray-700" />
              </div>

              {/* LOCAL FILE UPLOAD OR URL FOR CHURCH */}
              <div>
                <label className="block font-bold mb-1">Sary Fiangonana (Importer depuis ordinateur na URL)</label>
                <div className="flex items-center gap-2 mb-2">
                  <label className="flex-1 px-4 py-2.5 bg-blue-50 dark:bg-gray-700 hover:bg-blue-100 text-blue-600 dark:text-blue-300 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer border border-blue-200 dark:border-gray-600">
                    <Upload size={14} />
                    <span>{uploading ? "Andraso kely (Upload)..." : "Ampidiro sary avy amin'ny Ordinateur"}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleChurchFileUpload} disabled={uploading} />
                  </label>
                </div>
                <input type="text" value={churchForm.photo} onChange={(e) => setChurchForm({ ...churchForm, photo: e.target.value })} className="w-full p-3 rounded-xl border dark:border-gray-700 dark:bg-gray-700" placeholder="na ampidiro lien URL sary..." />
                {churchForm.photo && (
                  <div className="mt-2 w-full h-24 rounded-xl overflow-hidden border">
                    <img src={churchForm.photo} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowChurchModal(false)} className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl font-bold">Ajanona</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MEMBER / TANORA MODAL WITH LOCAL FILE UPLOAD */}
      {showMemberModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-3xl p-6 shadow-2xl animate-fade-in ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold">{editingMemberId ? 'Hanova Tanora' : 'Hanampy Tanora Vaovao'}</h3>
              <button onClick={() => setShowMemberModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveMember} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Anarana feno</label>
                <input type="text" required value={memberForm.name} onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })} className="w-full p-3 rounded-xl border dark:border-gray-700 dark:bg-gray-700" placeholder="Anarana tanora..." />
              </div>
              <div>
                <label className="block font-bold mb-1">Andraikitra / Role</label>
                <input type="text" required value={memberForm.role} onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })} className="w-full p-3 rounded-xl border dark:border-gray-700 dark:bg-gray-700" />
              </div>
              <div>
                <label className="block font-bold mb-1">Fiangonana</label>
                <input type="text" value={memberForm.church} onChange={(e) => setMemberForm({ ...memberForm, church: e.target.value })} className="w-full p-3 rounded-xl border dark:border-gray-700 dark:bg-gray-700" />
              </div>

              {/* LOCAL FILE UPLOAD OR URL FOR MEMBER */}
              <div>
                <label className="block font-bold mb-1">Sary Tanora (Importer depuis ordinateur na URL)</label>
                <div className="flex items-center gap-2 mb-2">
                  <label className="flex-1 px-4 py-2.5 bg-emerald-50 dark:bg-gray-700 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-300 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer border border-emerald-200 dark:border-gray-600">
                    <Upload size={14} />
                    <span>{uploading ? "Andraso kely (Upload)..." : "Ampidiro sary avy amin'ny Ordinateur"}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleMemberFileUpload} disabled={uploading} />
                  </label>
                </div>
                <input type="text" value={memberForm.photo} onChange={(e) => setMemberForm({ ...memberForm, photo: e.target.value })} className="w-full p-3 rounded-xl border dark:border-gray-700 dark:bg-gray-700" placeholder="na ampidiro lien URL sary..." />
                {memberForm.photo && (
                  <div className="mt-2 w-full h-24 rounded-xl overflow-hidden border">
                    <img src={memberForm.photo} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold mb-1">Mombamomba (Petite description dans le cadre)</label>
                <textarea rows="3" value={memberForm.description} onChange={(e) => setMemberForm({ ...memberForm, description: e.target.value })} className="w-full p-3 rounded-xl border dark:border-gray-700 dark:bg-gray-700 resize-none" placeholder="Mombamomba sy andraikitra..."></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowMemberModal(false)} className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl font-bold">Ajanona</button>
                <button type="submit" className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN EMAIL REPLY MODAL */}
      {replyMessageItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-3xl p-6 shadow-2xl animate-fade-in ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400">Valiana ny hafatra (Répondre)</h3>
                <p className="text-xs text-gray-500">Mpandefa: {replyMessageItem.name} ({replyMessageItem.email})</p>
              </div>
              <button onClick={() => setReplyMessageItem(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            <form onSubmit={handleSendReply} className="space-y-4 text-xs">
              <div className="p-3 bg-gray-50 dark:bg-gray-750 rounded-xl text-gray-600 dark:text-gray-300 italic border">
                <p className="font-bold text-[11px] text-gray-500 mb-1">Hafatra tany am-boalohany:</p>
                "{replyMessageItem.message}"
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-gray-700 dark:text-gray-200">
                  Soraty ny Valin-kafatra (Réponse e-mail ho an'i client)
                </label>
                <textarea
                  rows="5"
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-blue-100 dark:border-gray-700 dark:bg-gray-700 outline-none focus:border-blue-600 resize-none font-medium text-sm"
                  placeholder="Manahoana... Soraty eto ny valin-kafatra nalefa ho an'ny client..."
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReplyMessageItem(null)}
                  className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl font-bold cursor-pointer"
                >
                  Ajanona
                </button>
                <button
                  type="submit"
                  disabled={sendingReply}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {sendingReply ? <Loader2 size={16} className="animate-spin" /> : <Reply size={16} />}
                  <span>{sendingReply ? "Envoi..." : "Handefa Valin-kafatra"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;