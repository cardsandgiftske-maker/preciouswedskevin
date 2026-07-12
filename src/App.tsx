import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, Calendar, Clock, Sparkles, Heart, 
  Volume2, VolumeX, Navigation, ExternalLink, ChevronDown 
} from 'lucide-react';
import Envelope from './components/Envelope';
import Countdown from './components/Countdown';
import DressCode from './components/DressCode';
import RSVPForm from './components/RSVPForm';


export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.35);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Golden standard background audio
  const canonDUrl = 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Canon_in_D_Major_%28ISRC_USUAN1100301%29.mp3';

  // Paths to generated assets
  const waxSealUrl = '/src/assets/images/kp_floral_crest_1783875343548.jpg';
  const floralBgUrl = '/src/assets/images/kp_floral_wallpaper_1783875359536.jpg';
  const severinSeaLodgeUrl = '/src/assets/images/buraha_zenoni_resort_1783874401777.jpg';

  // Toggle background music
  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.volume = volume;
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Audio playback blocked or failed:", err));
    }
  };

  // Keep audio element volume in sync with volume state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Synchronously play audio on seal click to bypass mobile autoplay blocks
  const handleEnvelopeStartOpening = () => {
    if (audioRef.current) {
      audioRef.current.src = canonDUrl;
      audioRef.current.load();
      audioRef.current.volume = volume;
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Audio play on seal open failed:", err));
    }
  };

  // Automatically try playing music when invitation slides open (fallback/security rules)
  useEffect(() => {
    if (isOpen && audioRef.current && !isPlaying) {
      audioRef.current.src = canonDUrl;
      audioRef.current.load();
      audioRef.current.volume = volume;
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // If blocked, we handle it gracefully
          setIsPlaying(false);
        });
    }
  }, [isOpen]);

  const handleEnvelopeOpen = () => {
    setIsOpen(true);
  };

  return (
    <div className="min-h-screen text-stone-800 bg-[#FAF9F6] selection:bg-brand-gold-100">
      {/* Hidden Audio element - Romantic Canon in D Background Music */}
      <audio
        ref={audioRef}
        src={canonDUrl}
        loop
      />

      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="envelope"
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="w-full h-full"
          >
            <Envelope
              onOpen={handleEnvelopeOpen}
              onStartOpening={handleEnvelopeStartOpening}
              waxSealUrl={waxSealUrl}
              volume={volume}
              onVolumeChange={setVolume}
              isPlaying={isPlaying}
              onTogglePlay={toggleMusic}
            />
          </motion.div>
        ) : (
          <motion.div
            key="minisite"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative w-full overflow-x-hidden"
          >
            {/* Ambient Background Watermark Floral */}
            <div className="absolute top-0 inset-x-0 h-[700px] pointer-events-none opacity-[0.12] mix-blend-multiply overflow-hidden">
              <img
                src={floralBgUrl}
                alt="Floral Background Watermark"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover origin-top scale-110 blur-[0.5px]"
              />
            </div>

            {/* Floating Music Controller */}
            <div className="fixed bottom-6 right-6 z-50">
              <button
                onClick={toggleMusic}
                className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-brand-gold-200/50 flex items-center justify-center text-brand-gold-600 hover:text-brand-gold-700 hover:scale-105 active:scale-95 transition-all cursor-pointer group relative"
                aria-label="Toggle background music"
              >
                {/* Rotating aura when playing */}
                {isPlaying && (
                  <span className="absolute inset-0 rounded-full border border-brand-gold-500 animate-ping opacity-35" />
                )}
                {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-stone-400" />}
                
                {/* Micro tooltip */}
                <span className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap bg-stone-900/80 text-white text-[9px] font-sans font-bold uppercase tracking-widest px-2.5 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  {isPlaying ? 'Pause Music' : 'Play Music'}
                </span>
              </button>
            </div>

            {/* SECTION 1: HERO & HEADING (DEEP NAVY BLUE with elegant gradient) */}
            <div className="relative bg-gradient-to-b from-[#0B192C] via-[#1E3E62] to-[#0B192C] text-white w-full border-b border-[#FAF9F6]/10 overflow-hidden">
              
              {/* Rich Floral Wallpaper Overlay inside Hero */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay overflow-hidden">
                <img
                  src={floralBgUrl}
                  alt="Floral Watermark"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover scale-105"
                />
              </div>

              {/* Glowing Ambient Particles / Bokeh */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                  animate={{
                    y: [0, -100, 0],
                    x: [0, 30, 0],
                    opacity: [0.15, 0.4, 0.15],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-[20%] left-[15%] w-36 h-36 bg-[#ecc19c] rounded-full blur-[70px] mix-blend-screen"
                />
                <motion.div
                  animate={{
                    y: [0, -80, 0],
                    x: [0, -40, 0],
                    opacity: [0.12, 0.35, 0.12],
                  }}
                  transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                  }}
                  className="absolute bottom-[25%] right-[10%] w-44 h-44 bg-[#FAF9F6] rounded-full blur-[90px] mix-blend-screen"
                />
                <motion.div
                  animate={{
                    y: [0, -60, 0],
                    x: [0, 40, 0],
                    opacity: [0.1, 0.3, 0.1],
                  }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 4,
                  }}
                  className="absolute top-[60%] left-[45%] w-28 h-28 bg-[#ecc19c] rounded-full blur-[60px] mix-blend-screen"
                />
              </div>

              {/* Delicate Luxury Inner Frame Border */}
              <div className="absolute inset-3 sm:inset-5 md:inset-7 border border-[#ecc19c]/15 rounded-[2rem] pointer-events-none z-10">
                <div className="absolute inset-1 border border-dashed border-[#FAF9F6]/5 rounded-[1.85rem]" />
              </div>

              {/* Floating Invitation Header */}
              <nav className="w-full max-w-7xl mx-auto px-8 py-6 flex justify-between items-center z-40 relative">
                <span className="font-serif text-sm tracking-[0.3em] text-[#ecc19c] font-semibold select-none">
                  P &amp; K
                </span>
                <span className="font-sans text-[10px] text-[#FAF9F6] uppercase tracking-[0.3em] font-bold border-b border-[#ecc19c]/30 pb-1 select-none">
                  August 22, 2026
                </span>
              </nav>

              {/* HERO SECTION (MORE APPEALING & ROMANTIC) */}
              <header className="relative w-full max-w-4xl mx-auto text-center px-6 pt-10 pb-20 flex flex-col items-center justify-center min-h-[85vh] z-20">
                
                {/* Decorative Laurel / Monogram */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="relative mb-8 group"
                >
                  {/* Glowing backdrop halo */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#ecc19c]/20 to-[#FAF9F6]/20 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Inner ring & Crest Image */}
                  <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-2 border-[#ecc19c]/40 flex items-center justify-center bg-[#FAF9F6] shadow-2xl relative overflow-hidden transition-all duration-500 group-hover:border-[#ecc19c]">
                    <img
                      src={waxSealUrl}
                      alt="Kelvin and Precious Wedding Crest"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover p-1 rounded-full bg-white scale-[1.02]"
                    />
                    {/* Inner thin dashed boundary */}
                    <div className="absolute inset-2 border border-dashed border-[#ecc19c]/25 rounded-full pointer-events-none" />
                  </div>
                  {/* Decorative rotating outer ring */}
                  <div className="absolute -inset-2 border border-dashed border-[#ecc19c]/20 rounded-full animate-[spin_60s_linear_infinite]" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: 0.2 }}
                  className="flex items-center gap-2 justify-center mb-6"
                >
                  <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#ecc19c]/40" />
                  <span className="text-[10px] sm:text-xs font-sans tracking-[0.3em] text-[#ecc19c] font-semibold uppercase">
                    The Wedding Invitation
                  </span>
                  <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#ecc19c]/40" />
                </motion.div>

                {/* Enhanced Elegant Typography */}
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="relative space-y-2 mb-8"
                >
                  <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-light text-[#FAF9F6] tracking-wide mt-2 leading-none drop-shadow-[0_2px_15px_rgba(11,25,44,0.4)]">
                    Precious
                  </h1>
                  <div className="flex items-center justify-center gap-4 my-3">
                    <span className="h-[1px] w-14 sm:w-24 bg-gradient-to-r from-transparent via-[#ecc19c]/40 to-transparent" />
                    <span className="font-cursive text-5xl sm:text-6xl md:text-7xl text-[#ecc19c] block select-none transform -rotate-6">
                      &amp;
                    </span>
                    <span className="h-[1px] w-14 sm:w-24 bg-gradient-to-r from-transparent via-[#ecc19c]/40 to-transparent" />
                  </div>
                  <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-light text-[#FAF9F6] tracking-wide leading-none drop-shadow-[0_2px_15px_rgba(11,25,44,0.4)]">
                    Kelvin
                  </h1>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 0.95, y: 0 }}
                  transition={{ duration: 1.2, delay: 0.8 }}
                  className="font-serif text-base sm:text-lg italic text-[#ecc19c] max-w-xl leading-relaxed mt-4 px-4"
                >
                  "With joy in our hearts, we invite you to share our wedding celebration as we unite under the sight of the Lord."
                </motion.p>

                {/* Countdown Ticker */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 1.1 }}
                  className="mt-12 w-full"
                >
                  <Countdown targetDateStr="2026-08-22T10:00:00" />
                </motion.div>

                {/* Animated Scroll Indicator - Mouse Style */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8, y: [0, 6, 0] }}
                  transition={{ delay: 1.6, duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="mt-16 flex flex-col items-center gap-1.5 cursor-pointer"
                  onClick={() => {
                    window.scrollTo({
                      top: window.innerHeight * 0.95,
                      behavior: 'smooth'
                    });
                  }}
                >
                  <span className="text-[9px] uppercase tracking-[0.25em] font-sans font-bold text-[#ecc19c]/85">
                    Scroll to explore
                  </span>
                  <div className="w-6 h-10 rounded-full border border-[#ecc19c]/30 flex justify-center p-1 mt-1">
                    <motion.div 
                      animate={{ y: [0, 12, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className="w-1.5 h-1.5 rounded-full bg-[#FAF9F6]" 
                    />
                  </div>
                </motion.div>
              </header>
            </div>

            {/* SECTION 2: EVENT DETAILS & THE VENUE (ROYAL NAVY BLUE) */}
            <div className="bg-[#0B192C] text-white py-20 border-b border-[#FAF9F6]/10">
              <div className="w-full max-w-5xl mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#ecc19c]">The Gathering</span>
                  <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide mt-1 text-[#FAF9F6]">When &amp; Where</h2>
                </div>

                {/* EVENT OVERVIEW TILES */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 mb-16">
                  <div className="bg-[#FAF9F6] border border-[#ecc19c]/20 rounded-2xl p-6 shadow-md flex flex-col items-center text-center hover:scale-[1.02] transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#d95d16]/10 flex items-center justify-center text-[#d95d16] mb-4">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest block mb-1">
                      The Date
                    </span>
                    <h3 className="font-serif text-lg text-[#0b192c] font-semibold mb-1">
                      Saturday, August 22, 2026
                    </h3>
                    <p className="text-xs text-stone-600 font-sans mt-1">
                      Kindly mark your calendars to witness our vows.
                    </p>
                  </div>

                  <div className="bg-[#FAF9F6] border border-[#ecc19c]/20 rounded-2xl p-6 shadow-md flex flex-col items-center text-center hover:scale-[1.02] transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#d95d16]/10 flex items-center justify-center text-[#d95d16] mb-4">
                      <Clock className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest block mb-1">
                      The Time
                    </span>
                    <h3 className="font-serif text-lg text-[#0b192c] font-semibold mb-1">
                      10:00 AM Prompt
                    </h3>
                    <p className="text-xs text-stone-600 font-sans mt-1">
                      Ceremony begins promptly; reception to follow.
                    </p>
                  </div>

                  <div className="bg-[#FAF9F6] border border-[#ecc19c]/20 rounded-2xl p-6 shadow-md flex flex-col items-center text-center hover:scale-[1.02] transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#d95d16]/10 flex items-center justify-center text-[#d95d16] mb-4">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest block mb-1">
                      The Venue
                    </span>
                    <h3 className="font-serif text-lg text-[#0b192c] font-semibold mb-1">
                      MOHA Assemblies Nakuru
                    </h3>
                    <p className="text-xs text-stone-600 font-sans mt-1">
                      Message of the Hour Assemblies, Nakuru - Naka
                    </p>
                  </div>
                </div>

                {/* THE VENUE FEATURE CARD WITH HIGH-RES PHOTO */}
                <div className="bg-white border border-[#ecc19c]/30 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 hover:shadow-md transition-all duration-300 text-stone-800">
                  <div className="md:col-span-5 h-[300px] md:h-full relative overflow-hidden min-h-[300px]">
                    <img
                      src={severinSeaLodgeUrl}
                      alt="Buraha Zenoni Hotel & Resort - Nakuru, Kenya"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    {/* Transparent subtle warm overlay */}
                    <div className="absolute inset-0 bg-[#0B192C]/10 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-stone-900/10 to-transparent flex flex-col justify-end p-6 text-white md:hidden">
                      <span className="text-[9px] uppercase tracking-widest font-bold text-[#ecc19c]">
                        Tropical Garden Reception
                      </span>
                      <h4 className="font-serif text-xl font-light">Buraha Zenoni Hotel &amp; Resort</h4>
                    </div>
                  </div>

                  <div className="md:col-span-7 p-6 md:p-10 flex flex-col justify-center bg-[#FAF9F6]">
                    <span className="text-[10px] font-sans font-bold text-[#d95d16] uppercase tracking-widest block mb-1">
                      Sacred Vows &amp; Garden Celebration
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl text-[#0b192c] font-light tracking-wide mb-4">
                      The Ceremony &amp; Reception Venue
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed font-sans mb-6">
                      Our sacred wedding ceremony will take place at the Message of the Hour Assemblies Nakuru - Naka. Afterwards, we will gather for an elegant afternoon celebration at the scenic Buraha Zenoni Hotel &amp; Resort, Nakuru. Surrounded by manicured lush tropical gardens, it provides a warm and serene setting for our wedding reception.
                    </p>
                    
                    <div className="flex flex-wrap gap-4">
                      <a
                        href="https://maps.google.com/?q=Message+of+the+Hour+Assemblies+Nakuru+-+Naka"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-[#d95d16] hover:bg-[#0B192C] text-white font-sans text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5" /> Navigate to Ceremony
                      </a>
                      <a
                        href="https://maps.google.com/?q=Buraha+Zenoni+Hotel+%26+Resort+Nakuru"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 border border-[#d95d16] hover:bg-stone-100 text-[#d95d16] font-sans text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                      >
                        View Reception Maps <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>



            {/* SECTION 3: DRESS CODE (ROYAL NAVY BLUE WITH BURAHA GLOW) */}
            <div className="bg-[#0B192C] text-stone-900 py-20 border-b border-[#FAF9F6]/10">
              <div className="w-full max-w-5xl mx-auto px-4">
                <DressCode />
              </div>
            </div>

            {/* SECTION 4: RSVP & ETIQUETTE RULES (ROYAL NAVY BLUE) */}
            <div className="bg-[#0B192C] text-white py-20 border-b border-[#FAF9F6]/10">
              <div className="w-full max-w-5xl mx-auto px-4">
                <RSVPForm />
              </div>
            </div>

            {/* FOOTER (ROYAL NAVY BLUE) */}
            <footer className="w-full border-t border-[#FAF9F6]/10 bg-[#0B192C] py-16 text-center relative z-10 text-white">
              <div className="max-w-md mx-auto px-4 flex flex-col items-center">
                <Heart className="w-6 h-6 text-[#ecc19c] mb-4 animate-pulse stroke-1" />
                <p className="font-serif italic text-sm text-[#FAF9F6]/90 leading-relaxed max-w-sm">
                  "He who finds a wife finds a good thing, and obtaineth favour from the Lord."
                </p>
                <span className="text-[10px] font-sans font-bold text-[#ecc19c] uppercase tracking-widest mt-2 block">
                  Proverbs 18:22
                </span>
                
                <p className="text-[10px] text-[#FAF9F6]/70 font-sans mt-8 uppercase tracking-widest font-medium">
                  Precious &amp; Kelvin
                </p>
                <p className="text-[9px] text-[#ecc19c]/80 font-sans mt-1">
                  August 22, 2026 • Nakuru, Kenya
                </p>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
