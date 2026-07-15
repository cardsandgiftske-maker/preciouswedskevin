import React, { useState, useEffect } from 'react';
import { RSVPRecord } from '../types';
import { CheckCircle, Info, Lock, Eye, Check, Calendar, Download, Trash2, Search } from 'lucide-react';
import { collection, addDoc, deleteDoc, doc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function RSVPForm() {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'attending' | 'declined'>('attending');
  const [dietary, setDietary] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Admin access state
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rsvps, setRsvps] = useState<RSVPRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Real-time subscription to Firebase Firestore
    const q = query(collection(db, 'rsvps'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedRsvps: RSVPRecord[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedRsvps.push({
          id: doc.id,
          name: data.name || '',
          status: data.status || 'attending',
          dietary: data.dietary || undefined,
          message: data.message || undefined,
          timestamp: data.timestamp || Date.now(),
        });
      });
      setRsvps(fetchedRsvps);
    }, (err) => {
      console.error("Error fetching RSVPs from firestore:", err);
    });

    return () => unsubscribe();
  }, []);

  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    try {
      const newRSVPData = {
        name: name.trim(),
        status,
        dietary: dietary.trim() || '',
        message: message.trim() || '',
        timestamp: Date.now(),
      };

      // Save to Firebase Firestore
      await addDoc(collection(db, 'rsvps'), newRSVPData);

      // Save message to Guestbook wishes board too
      if (message.trim()) {
        const storedWishes = localStorage.getItem('wedding_wishes') || '[]';
        const wishes = JSON.parse(storedWishes);
        wishes.unshift({
          id: Math.random().toString(36).substring(2, 9),
          name: name.trim(),
          message: message.trim(),
          timestamp: Date.now()
        });
        localStorage.setItem('wedding_wishes', JSON.stringify(wishes));
        // Dispatch a storage event to alert other components like the Guestbook
        window.dispatchEvent(new Event('storage_wishes_updated'));
      }

      setSubmitted(true);
      setName('');
      setDietary('');
      setMessage('');
      setError('');
    } catch (err: any) {
      console.error("Error saving RSVP to firestore:", err);
      setError('Failed to save RSVP. Please check your internet connection and try again.');
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'preciousandkelvin2026' || adminPassword === 'admin') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid passcode. Try "preciousandkelvin2026".');
    }
  };

  const handleDeleteRSVP = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this RSVP?')) {
      try {
        await deleteDoc(doc(db, 'rsvps', id));
      } catch (err) {
        console.error("Error deleting RSVP:", err);
        alert("Failed to delete RSVP from Firestore.");
      }
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Status', 'Dietary Restrictions', 'Message', 'Date Submitted'];
    const rows = rsvps.map(r => [
      r.name,
      r.status === 'attending' ? 'Attending' : 'Declined',
      r.dietary || 'None',
      r.message || 'No message',
      new Date(r.timestamp).toLocaleDateString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "precious_kelvin_wedding_rsvps.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Stats calculations
  const attendingCount = rsvps.filter(r => r.status === 'attending').length;
  const declinedCount = rsvps.filter(r => r.status === 'declined').length;
  const filteredRsvps = rsvps.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="bg-[#FAF9F6] border border-[#ecc19c]/40 rounded-3xl p-6 md:p-10 shadow-2xl text-stone-800 max-w-4xl mx-auto">
      {!showAdmin ? (
        <div>
          {submitted ? (
            <div className="text-center py-8 animate-fade-in flex flex-col items-center">
              <CheckCircle className="w-16 h-16 text-emerald-500 mb-4 stroke-1" />
              <h3 className="font-serif text-2xl text-[#0b192c] font-light">
                Thank You for Your Response!
              </h3>
              <p className="font-cursive text-2xl text-[#d95d16] mt-1">
                Your RSVP has been saved beautifully
              </p>
              <p className="text-xs text-stone-600 mt-4 max-w-sm mx-auto font-sans leading-relaxed">
                {status === 'attending' 
                  ? "We are absolutely thrilled to celebrate this special milestone with you at Message of the Hour Assemblies Nakuru - Naka on August 22, 2026!"
                  : "We will miss you dearly, but we are extremely grateful for your warm thoughts and blessings from afar!"}
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 px-5 py-2.5 border border-[#d95d16] text-[#d95d16] hover:bg-[#d95d16] hover:text-white text-xs tracking-widest uppercase rounded-lg transition-colors font-sans cursor-pointer"
              >
                Submit another response
              </button>
            </div>
          ) : (
            <div>
              <div className="text-center mb-6">
                <h3 className="font-serif text-2xl text-[#0b192c] tracking-wide font-light flex items-center justify-center gap-2">
                  RSVP Card
                </h3>
              </div>

              <form onSubmit={handleRSVP} className="space-y-4 max-w-xl mx-auto font-sans">
                {error && (
                  <div className="text-xs bg-rose-50 text-rose-600 border border-rose-100 p-2.5 rounded-lg text-center">
                    {error}
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name of invitee"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#ecc19c] bg-white focus:outline-none focus:ring-1 focus:ring-[#d95d16] text-stone-700 placeholder-stone-400 transition-all text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setStatus('attending')}
                    className={`p-3.5 border rounded-lg text-center cursor-pointer transition-all ${
                      status === 'attending'
                        ? 'border-[#d95d16] bg-[#ecc19c]/20 text-[#d95d16] font-semibold shadow-inner'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-500 text-xs'
                    }`}
                  >
                    <span className="block text-xs uppercase tracking-wider mb-0.5">Joyfully Attend</span>
                    <span className="text-[10px] font-light italic">See you in Nakuru!</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatus('declined')}
                    className={`p-3.5 border rounded-lg text-center cursor-pointer transition-all ${
                      status === 'declined'
                        ? 'border-[#d95d16] bg-[#ecc19c]/20 text-[#d95d16] font-semibold shadow-inner'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-500 text-xs'
                    }`}
                  >
                    <span className="block text-xs uppercase tracking-wider mb-0.5">Regretfully Decline</span>
                    <span className="text-[10px] font-light italic">Celebrate in spirit</span>
                  </button>
                </div>

                {status === 'attending' && (
                  <div className="animate-fade-in">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                      Dietary Restrictions (Optional)
                    </label>
                    <input
                      type="text"
                      value={dietary}
                      onChange={(e) => setDietary(e.target.value)}
                      placeholder="e.g. Vegetarian, No shellfish, Peanut allergy"
                      className="w-full px-4 py-2.5 rounded-lg border border-[#ecc19c] bg-white focus:outline-none focus:ring-1 focus:ring-[#d95d16] text-stone-700 placeholder-stone-400 text-xs"
                    />
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    Warm Wish / Message for the Couple
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a warm note of blessing to be featured on our Wishes Board..."
                    className="w-full px-4 py-2.5 rounded-lg border border-[#ecc19c] bg-white focus:outline-none focus:ring-1 focus:ring-[#d95d16] text-stone-700 placeholder-stone-400 text-xs resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#d95d16] hover:bg-[#0b192c] text-white font-semibold text-xs tracking-widest uppercase rounded-lg shadow-md transition-colors cursor-pointer"
                >
                  Send RSVP Response
                </button>
              </form>
            </div>
          )}

          {/* Discreet couple's link to view responses */}
          <div className="mt-12 text-center border-t border-[#ecc19c]/40 pt-4 flex justify-center">
            <button
              onClick={() => setShowAdmin(true)}
              className="text-[10px] font-medium text-stone-400 hover:text-[#d95d16] uppercase tracking-widest flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lock className="w-3 h-3" /> Couple Portal (Guest List)
            </button>
          </div>
        </div>
      ) : (
        <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#ecc19c]/60 font-sans">
            <h4 className="font-serif text-xl text-[#0b192c] font-light">
              Couples' Guest List Board
            </h4>
            <button
              onClick={() => {
                setShowAdmin(false);
                setIsAuthenticated(false);
                setAdminPassword('');
                setError('');
              }}
              className="text-[10px] uppercase font-bold text-stone-400 hover:text-[#d95d16] tracking-wider cursor-pointer"
            >
              Back to RSVP
            </button>
          </div>

          {!isAuthenticated ? (
            <form onSubmit={handleAdminLogin} className="max-w-sm mx-auto space-y-4 py-6 font-sans">
              <p className="text-xs text-stone-500 text-center mb-4">
                Enter the couple's passcode to check RSVPs. <br />
                <span className="italic font-semibold text-[#d95d16]">Hint: 2026</span>
              </p>
              {error && (
                <div className="text-xs bg-rose-50 text-rose-600 p-2.5 rounded text-center border border-rose-100">
                  {error}
                </div>
              )}
              <div>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter passcode"
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#d95d16] text-center text-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs tracking-widest uppercase rounded font-bold transition-colors cursor-pointer"
              >
                Access Dashboard
              </button>
            </form>
          ) : (
            <div className="font-sans">
              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl">
                  <span className="block text-2xl font-serif text-emerald-700">{attendingCount}</span>
                  <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold">Attending</span>
                </div>
                <div className="bg-rose-50 border border-rose-100 p-3.5 rounded-xl">
                  <span className="block text-2xl font-serif text-rose-700">{declinedCount}</span>
                  <span className="text-[10px] uppercase tracking-wider text-rose-600 font-bold">Declined</span>
                </div>
                <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-xl flex flex-col justify-center items-center">
                  <span className="block text-lg font-serif text-stone-700">{rsvps.length}</span>
                  <span className="text-[9px] uppercase tracking-wider text-stone-500 font-bold">Total Responded</span>
                </div>
              </div>

              {/* Utility / Search / Export */}
              <div className="flex flex-col sm:flex-row gap-3 justify-between mb-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search guest name..."
                    className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-stone-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#d95d16]"
                  />
                </div>
                <button
                  onClick={exportToCSV}
                  className="flex items-center justify-center gap-1.5 bg-[#d95d16] hover:bg-[#0b192c] text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Export CSV
                </button>
              </div>

              {/* Guests Table */}
              <div className="overflow-x-auto border border-stone-100 rounded-lg">
                <table className="w-full text-left border-collapse bg-white text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-100 text-stone-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-3">Guest Name</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Dietary</th>
                      <th className="p-3">Wishes / Message</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-600">
                    {filteredRsvps.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-stone-400 italic">
                          No guest matches found.
                        </td>
                      </tr>
                    ) : (
                      filteredRsvps.map((rsvp) => (
                        <tr key={rsvp.id} className="hover:bg-stone-50/50">
                          <td className="p-3 font-semibold text-stone-800">{rsvp.name}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              rsvp.status === 'attending' 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : 'bg-rose-50 text-rose-700 border border-rose-100'
                            }`}>
                              {rsvp.status === 'attending' ? 'Attending' : 'Declined'}
                            </span>
                          </td>
                          <td className="p-3 italic text-stone-500">{rsvp.dietary || 'None'}</td>
                          <td className="p-3 max-w-xs truncate" title={rsvp.message}>{rsvp.message || '-'}</td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleDeleteRSVP(rsvp.id)}
                              className="text-stone-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                              title="Delete RSVP"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
