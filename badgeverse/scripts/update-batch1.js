const fs = require('fs');
const path = require('path');

const templatesJsonPath = path.join(__dirname, '..', 'src', 'lib', 'templates.json');
const current = JSON.parse(fs.readFileSync(templatesJsonPath, 'utf8'));

const batch1 = [
  {
    id: "velocity",
    name: "Velocity Club",
    cat: "Gamer",
    tier: "Popular",
    lay: "lic",
    bg: "#080c1a",
    ink: "#00ff66",
    ac: "#ff0077",
    ac2: "#00ff66",
    title: "FAST\nLANE",
    holder: "Alex Vance",
    city: "Neo Tokyo",
    ex: "Apex Pilot",
    tag: "APEX RACER",
    w: 540,
    h: 340,
    idn: "VC-9942",
    defaults: {
      bg: "#080c1a",
      texture: "halftone",
      holo: true
    },
    front: [
      // Top telemetry header bar
      { id: "v_f01", type: "shape", x: 0, y: 0, w: 540, h: 42, bg: "#00ff66", rot: 0 },
      { id: "v_f02", type: "text", x: 16, y: 8, w: 320, h: 26, text: "⚡ VELOCITY MOTORSPORT // APEX PILOT", font: "Archivo Black", size: 16, color: "#080c1a", rot: 0 },
      { id: "v_f03", type: "text", x: 380, y: 10, w: 140, h: 22, text: "CLASS A // S-TIER", font: "Space Mono", size: 12, color: "#080c1a", rot: 0, fw: "bold", align: "right" },
      // Portrait box left with offset magenta border
      { id: "v_f04", type: "shape", x: 26, y: 60, w: 140, h: 175, bg: "#ff0077", rot: -2, br: 8 },
      { id: "v_f05", type: "img", x: 22, y: 56, w: 140, h: 175, src: "/placeholder-avatar.svg", zoom: 1, border: "#00ff66", rot: 0, br: 8 },
      // Driver details right column
      { id: "v_f06", type: "text", x: 180, y: 54, w: 340, h: 32, text: "ALEX 'APEX' VANCE", font: "Archivo Black", size: 26, color: "#ffffff", rot: 0 },
      { id: "v_f07", type: "text", x: 180, y: 88, w: 340, h: 20, text: "TEAM: KINETIC MOTOR RACING CORP", font: "Space Mono", size: 11, color: "#00ff66", rot: 0, fw: "bold" },
      // Spec readout boxes
      { id: "v_f08", type: "shape", x: 180, y: 112, w: 160, h: 48, bg: "#121836", border: "#00ff66", br: 6, rot: 0 },
      { id: "v_f09", type: "text", x: 190, y: 118, w: 140, h: 38, text: "LAP RECORD\n01:14.288s", font: "Space Mono", size: 12, color: "#ffffff", rot: 0 },
      { id: "v_f10", type: "shape", x: 350, y: 112, w: 165, h: 48, bg: "#121836", border: "#ff0077", br: 6, rot: 0 },
      { id: "v_f11", type: "text", x: 360, y: 118, w: 145, h: 38, text: "TOP SPEED\n348 KM/H", font: "Space Mono", size: 12, color: "#ffffff", rot: 0 },
      // Additional telemetry rows
      { id: "v_f12", type: "text", x: 180, y: 170, w: 330, h: 20, text: "CIRCUIT: SUZUKA APEX // DRY // 28°C", font: "Space Mono", size: 10, color: "#a0aec0", rot: 0 },
      { id: "v_f13", type: "text", x: 180, y: 190, w: 330, h: 20, text: "VALIDITY: CHAMPIONSHIP 2026 // ID: VC-9942", font: "Space Mono", size: 10, color: "#00ff66", rot: 0 },
      // Bottom telemetry bar with QR & barcode
      { id: "v_f14", type: "shape", x: 0, y: 242, w: 540, h: 98, bg: "#0d1326", border: "1px solid #1f2937", rot: 0 },
      { id: "v_f15", type: "qr", x: 22, y: 248, w: 84, h: 84, text: "https://badgeverse.app/VC-9942", color: "#00ff66", bg: "#080c1a", rot: 0 },
      { id: "v_f16", type: "bar", x: 120, y: 254, w: 260, h: 42, text: "VC-9942-APEX", color: "#00ff66", bg: "transparent", rot: 0 },
      { id: "v_f17", type: "text", x: 120, y: 304, w: 380, h: 24, text: "OFFICIAL APEX RACING DRIVER LICENSE · CERTIFIED TELEMETRY", font: "Space Mono", size: 8, color: "#a0aec0", rot: 0 },
      // Corner neon sticker
      { id: "v_f18", type: "sticker", x: 400, y: 250, w: 115, h: 32, text: "RANK #01", font: "Archivo Black", size: 14, color: "#080c1a", bg: "#ff0077", border: "none", rot: -4, br: 4 }
    ],
    back: [
      // Full-card hero image slot
      { id: "v_b01", type: "img", x: 0, y: 0, w: 540, h: 340, src: "/placeholders/hero-velocity.svg", zoom: 1, border: "none", rot: 0, br: 16 },
      // Giant headline typography
      { id: "v_b02", type: "text", x: 20, y: 24, w: 320, h: 170, text: "FAST\nLANE", font: "Archivo Black", size: 86, color: "#ff0077", rot: 0, ls: -1, ts: "4px 4px 0 #00ff66" },
      // Subject cutout on top of the text
      { id: "v_b03", type: "img", x: 280, y: 40, w: 220, h: 280, src: "/placeholders/cutout-avatar.svg", zoom: 1, border: "none", rot: 0 },
      // Top badge
      { id: "v_b04", type: "shape", x: 24, y: 205, w: 220, h: 28, bg: "#080c1a", border: "#00ff66", br: 4, rot: 0 },
      { id: "v_b05", type: "text", x: 30, y: 211, w: 210, h: 18, text: "KINETIC MOTOR RACING DIVISION", font: "Space Mono", size: 9, color: "#00ff66", rot: 0, fw: "bold" },
      // Small label & tagline strip
      { id: "v_b06", type: "shape", x: 0, y: 290, w: 540, h: 50, bg: "rgba(8, 12, 26, 0.92)", rot: 0 },
      { id: "v_b07", type: "text", x: 20, y: 296, w: 380, h: 16, text: "MAXIMUM OVERDRIVE // 100% TELEMETRY VERIFIED", font: "Space Mono", size: 10, color: "#ffffff", rot: 0, fw: "bold" },
      { id: "v_b08", type: "text", x: 20, y: 314, w: 480, h: 16, text: "For entertainment, creative, cosplay & collectible use only. Not an official transit or racing credential.", font: "Space Mono", size: 8, color: "#a0aec0", rot: 0 }
    ]
  },
  {
    id: "noir",
    name: "Noir Dossier",
    cat: "Creator",
    tier: "Popular",
    lay: "lic",
    bg: "#111113",
    ink: "#d91b24",
    ac: "#d91b24",
    ac2: "#e8dfc8",
    title: "EYES\nONLY",
    holder: "Damian Cross",
    city: "New York",
    ex: "Operative 07",
    tag: "CLASSIFIED",
    w: 540,
    h: 340,
    idn: "NR-0072",
    defaults: {
      bg: "#111113",
      texture: "paper",
      holo: false
    },
    front: [
      // Top Classified Bar
      { id: "n_f01", type: "shape", x: 0, y: 0, w: 540, h: 36, bg: "#1a1a1e", border: "1px solid #d91b24", rot: 0 },
      { id: "n_f02", type: "text", x: 18, y: 8, w: 320, h: 22, text: "[TOP SECRET] DEPARTMENT OF SPECIAL INVESTIGATION", font: "Special Elite", size: 13, color: "#d91b24", rot: 0, fw: "bold" },
      { id: "n_f03", type: "text", x: 380, y: 8, w: 140, h: 22, text: "CASE FILE #NR-0072", font: "Space Mono", size: 11, color: "#e8dfc8", rot: 0, align: "right" },
      // Polaroid clipped left with tilt
      { id: "n_f04", type: "shape", x: 22, y: 52, w: 145, h: 185, bg: "#e8dfc8", rot: -2, br: 2, sh: 1 },
      { id: "n_f05", type: "img", x: 28, y: 58, w: 133, h: 145, src: "/placeholder-avatar.svg", zoom: 1, border: "#111113", rot: -2 },
      { id: "n_f06", type: "text", x: 28, y: 210, w: 133, h: 18, text: "OPERATIVE 07", font: "Special Elite", size: 11, color: "#111113", rot: -2, align: "center" },
      // Case File Details right
      { id: "n_f07", type: "text", x: 190, y: 50, w: 320, h: 28, text: "SUBJECT: DAMIAN 'SHADOW' CROSS", font: "Anton", size: 22, color: "#e8dfc8", rot: 0, ls: 0.5 },
      { id: "n_f08", type: "text", x: 190, y: 84, w: 320, h: 20, text: "STATUS: ACTIVE OPERATIVE // ARCHIVED", font: "Special Elite", size: 12, color: "#d91b24", rot: 0 },
      // Redaction bar over sensitive line
      { id: "n_f09", type: "shape", x: 190, y: 112, w: 280, h: 18, bg: "#d91b24", rot: 0 },
      { id: "n_f10", type: "text", x: 194, y: 114, w: 270, h: 16, text: "ASSIGNMENT: SECTOR 4 RESTRICTED VAULT", font: "Space Mono", size: 9, color: "#ffffff", rot: 0, fw: "bold" },
      { id: "n_f11", type: "shape", x: 190, y: 136, w: 210, h: 18, bg: "#1a1a1e", border: "1px solid #444", rot: 0 },
      { id: "n_f12", type: "text", x: 194, y: 138, w: 200, h: 16, text: "CLEARANCE: LEVEL 5 / OMEGA", font: "Space Mono", size: 9, color: "#e8dfc8", rot: 0 },
      // Official stamped seal
      { id: "n_f13", type: "shape", x: 420, y: 136, w: 90, h: 90, bg: "transparent", border: "2px dashed #d91b24", br: 45, rot: 12 },
      { id: "n_f14", type: "text", x: 425, y: 165, w: 80, h: 32, text: "CONFIDENTIAL\nRECORD", font: "Anton", size: 11, color: "#d91b24", rot: 12, align: "center" },
      // Fingerprint / Biometric box
      { id: "n_f15", type: "shape", x: 190, y: 164, w: 140, h: 60, bg: "#1a1a1e", border: "1px solid #333", rot: 0 },
      { id: "n_f16", type: "text", x: 196, y: 172, w: 128, h: 44, text: "BIOMETRIC MATCH\nVERIFIED 99.8%\nNO RE-ENTRY", font: "Special Elite", size: 10, color: "#888888", rot: 0 },
      // Bottom confidential strip
      { id: "n_f17", type: "shape", x: 0, y: 248, w: 540, h: 92, bg: "#0a0a0c", border: "1px solid #d91b24", rot: 0 },
      { id: "n_f18", type: "qr", x: 20, y: 254, w: 78, h: 78, text: "https://badgeverse.app/NR-0072", color: "#d91b24", bg: "#0a0a0c", rot: 0 },
      { id: "n_f19", type: "bar", x: 112, y: 258, w: 260, h: 40, text: "NR-0072-DOSSIER", color: "#e8dfc8", bg: "transparent", rot: 0 },
      { id: "n_f20", type: "text", x: 112, y: 306, w: 410, h: 22, text: "FOR ENTERTAINMENT AND COSPLAY USE ONLY · NEVER IMITATE REAL POLICE OR INTEL IDENTIFICATION", font: "Special Elite", size: 8, color: "#777777", rot: 0 }
    ],
    back: [
      // Hero image background
      { id: "n_b01", type: "img", x: 0, y: 0, w: 540, h: 340, src: "/placeholders/hero-noir.svg", zoom: 1, border: "none", rot: 0, br: 16 },
      // Giant headline typography
      { id: "n_b02", type: "text", x: 24, y: 30, w: 280, h: 180, text: "EYES\nONLY", font: "Anton", size: 90, color: "#d91b24", rot: 0, ls: -1, ts: "4px 4px 0 #000000" },
      // Detective Cutout
      { id: "n_b03", type: "img", x: 270, y: 45, w: 230, h: 275, src: "/placeholders/cutout-avatar.svg", zoom: 1, border: "none", rot: 0 },
      // Case file tape
      { id: "n_b04", type: "shape", x: 24, y: 215, w: 230, h: 28, bg: "#d91b24", rot: -1 },
      { id: "n_b05", type: "text", x: 30, y: 221, w: 218, h: 18, text: "CODE 9 // AUTHORIZED ARCHIVE", font: "Special Elite", size: 11, color: "#ffffff", rot: -1, fw: "bold" },
      // Tagline strip
      { id: "n_b06", type: "shape", x: 0, y: 290, w: 540, h: 50, bg: "rgba(10, 10, 12, 0.94)", rot: 0 },
      { id: "n_b07", type: "text", x: 20, y: 298, w: 400, h: 16, text: "SPECIAL INVESTIGATION BUREAU // DOSSIER 07", font: "Special Elite", size: 10, color: "#e8dfc8", rot: 0 },
      { id: "n_b08", type: "text", x: 20, y: 316, w: 490, h: 16, text: "Creative collectible only. Not an official state intelligence or government ID.", font: "Space Mono", size: 8, color: "#666666", rot: 0 }
    ]
  },
  {
    id: "y2k",
    name: "Y2K Chrome",
    cat: "K-pop",
    tier: "New",
    lay: "lic",
    bg: "#e2e8f0",
    ink: "#2e1065",
    ac: "#ff70a6",
    ac2: "#70d6ff",
    title: "HYPERSTAR",
    holder: "Chloe Kim",
    city: "Seoul",
    ex: "Cyber Angel",
    tag: "LUCKY BABY",
    w: 540,
    h: 340,
    idn: "Y2K-8821",
    defaults: {
      bg: "#e2e8f0",
      texture: "none",
      holo: true
    },
    front: [
      // Pastel holographic header
      { id: "y_f01", type: "shape", x: 0, y: 0, w: 540, h: 46, bg: "#2e1065", rot: 0 },
      { id: "y_f02", type: "text", x: 20, y: 10, w: 320, h: 26, text: "✧ CYBER BABY 2000 ✧", font: "Anton", size: 20, color: "#70d6ff", rot: 0, ls: 1 },
      { id: "y_f03", type: "text", x: 360, y: 12, w: 160, h: 22, text: "VIP PASS // LUCKY ★", font: "Space Mono", size: 11, color: "#ff70a6", rot: 0, fw: "bold", align: "right" },
      // Oval portrait frame
      { id: "y_f04", type: "img", x: 24, y: 62, w: 145, h: 175, src: "/placeholder-avatar.svg", zoom: 1, border: "#ff70a6", rot: -3, br: 72, sh: 1 },
      // Frosted info cards right
      { id: "y_f05", type: "shape", x: 190, y: 58, w: 325, h: 175, bg: "#ffffff", border: "2px solid #70d6ff", br: 16, rot: 0, sh: 1 },
      { id: "y_f06", type: "text", x: 206, y: 68, w: 290, h: 28, text: "CHLOE 'PIXEL' KIM", font: "Anton", size: 24, color: "#2e1065", rot: 0 },
      { id: "y_f07", type: "text", x: 206, y: 98, w: 290, h: 20, text: "ROLE: LEAD DANCER // CYBER ANGEL", font: "Space Mono", size: 10, color: "#ff70a6", rot: 0, fw: "bold" },
      { id: "y_f08", type: "text", x: 206, y: 122, w: 290, h: 20, text: "FAV TRACK: GLITTER DISCO (132 BPM)", font: "Space Mono", size: 10, color: "#2e1065", rot: 0 },
      { id: "y_f09", type: "text", x: 206, y: 144, w: 290, h: 20, text: "ZODIAC: ARIES ✧ LUCKY NUMBER: 777", font: "Space Mono", size: 10, color: "#2e1065", rot: 0 },
      { id: "y_f10", type: "text", x: 206, y: 172, w: 290, h: 24, text: "XOXO Chloe Kim", font: "Caveat", size: 22, color: "#ff70a6", rot: -4 },
      // Sticker overlays
      { id: "y_f11", type: "sticker", x: 130, y: 50, w: 85, h: 30, text: "SWEET 99", font: "Permanent Marker", size: 12, color: "#ffffff", bg: "#ff70a6", rot: 12, br: 15 },
      { id: "y_f12", type: "sticker", x: 15, y: 200, w: 75, h: 28, text: "ANGEL ★", font: "Permanent Marker", size: 11, color: "#2e1065", bg: "#70d6ff", rot: -8, br: 14 },
      // Bottom neon barcode strip
      { id: "y_f13", type: "shape", x: 0, y: 248, w: 540, h: 92, bg: "#2e1065", rot: 0 },
      { id: "y_f14", type: "qr", x: 24, y: 254, w: 78, h: 78, text: "https://badgeverse.app/Y2K-8821", color: "#2e1065", bg: "#70d6ff", rot: 0 },
      { id: "y_f15", type: "bar", x: 120, y: 258, w: 260, h: 42, text: "Y2K-8821-CHROME", color: "#ff70a6", bg: "transparent", rot: 0 },
      { id: "y_f16", type: "text", x: 120, y: 308, w: 400, h: 20, text: "COLLECTIBLE FANCLUB PASS · FOR COSPLAY & NOSTALGIA ONLY", font: "Space Mono", size: 8, color: "#e2e8f0", rot: 0 }
    ],
    back: [
      // Hero full-card image
      { id: "y_b01", type: "img", x: 0, y: 0, w: 540, h: 340, src: "/placeholders/hero-y2k.svg", zoom: 1, border: "none", rot: 0, br: 16 },
      // Giant 3D chrome typography
      { id: "y_b02", type: "text", x: 20, y: 35, w: 480, h: 90, text: "HYPERSTAR", font: "Anton", size: 74, color: "#ffffff", rot: 0, ls: 2, ts: "3px 3px 0 #ff70a6, 6px 6px 0 #70d6ff" },
      // Subject cutout
      { id: "y_b03", type: "img", x: 280, y: 65, w: 220, h: 260, src: "/placeholders/cutout-avatar.svg", zoom: 1, border: "none", rot: 0 },
      // Subtitle
      { id: "y_b04", type: "text", x: 24, y: 135, w: 260, h: 35, text: "CYBER GLITTER 2000", font: "Caveat", size: 28, color: "#2e1065", rot: -3 },
      { id: "y_b05", type: "shape", x: 24, y: 195, w: 210, h: 30, bg: "#ffffff", border: "2px solid #ff70a6", br: 15, rot: 0 },
      { id: "y_b06", type: "text", x: 30, y: 202, w: 198, h: 18, text: "VIP FAN CLUB SPECIAL ISSUE", font: "Space Mono", size: 10, color: "#ff70a6", rot: 0, fw: "bold" },
      // Bottom banner
      { id: "y_b07", type: "shape", x: 0, y: 290, w: 540, h: 50, bg: "rgba(46, 16, 101, 0.94)", rot: 0 },
      { id: "y_b08", type: "text", x: 20, y: 298, w: 400, h: 16, text: "ETERNAL CYBER GLAMOUR ✧ ALL RIGHTS RESERVED", font: "Space Mono", size: 10, color: "#70d6ff", rot: 0 },
      { id: "y_b09", type: "text", x: 20, y: 316, w: 490, h: 16, text: "Fan art & cosplay souvenir card. Not an official identity document.", font: "Space Mono", size: 8, color: "#e2e8f0", rot: 0 }
    ]
  },
  {
    id: "travel",
    name: "Retro Travel License",
    cat: "Festival",
    tier: "Premium",
    lay: "lic",
    bg: "#fdf6e2",
    ink: "#006466",
    ac: "#e74c3c",
    ac2: "#e9c46a",
    title: "BON\nVOYAGE",
    holder: "Julian Reid",
    city: "Portofino",
    ex: "Wanderer",
    tag: "WANDERLUST",
    w: 540,
    h: 340,
    idn: "TR-5519",
    defaults: {
      bg: "#fdf6e2",
      texture: "paper",
      holo: false
    },
    front: [
      // Double passport frame
      { id: "t_f01", type: "shape", x: 8, y: 8, w: 524, h: 324, bg: "transparent", border: "2px solid #006466", br: 10, rot: 0 },
      { id: "t_f02", type: "shape", x: 12, y: 12, w: 516, h: 316, bg: "transparent", border: "1px dashed #e74c3c", br: 8, rot: 0 },
      // Header banner
      { id: "t_f03", type: "text", x: 24, y: 20, w: 360, h: 24, text: "★ PERMANENT PERMIT OF WANDERLUST ★", font: "Special Elite", size: 14, color: "#006466", rot: 0, fw: "bold" },
      { id: "t_f04", type: "text", x: 380, y: 20, w: 130, h: 22, text: "NO. TR-5519", font: "Anton", size: 16, color: "#e74c3c", rot: 0, align: "right" },
      // Vintage portrait with photo corners
      { id: "t_f05", type: "img", x: 28, y: 56, w: 138, h: 170, src: "/placeholder-avatar.svg", zoom: 1, border: "#006466", rot: 0, sh: 1 },
      // Passport details table
      { id: "t_f06", type: "text", x: 184, y: 54, w: 320, h: 26, text: "HOLDER: CAPTAIN JULIAN REID", font: "Anton", size: 20, color: "#006466", rot: 0 },
      { id: "t_f07", type: "text", x: 184, y: 84, w: 320, h: 20, text: "CALLSIGN: THE ROVER // MARITIME", font: "Special Elite", size: 12, color: "#e74c3c", rot: 0 },
      { id: "t_f08", type: "text", x: 184, y: 108, w: 320, h: 20, text: "PORT OF ORIGIN: PORTOFINO, IT", font: "Special Elite", size: 11, color: "#17141f", rot: 0 },
      { id: "t_f09", type: "text", x: 184, y: 130, w: 320, h: 20, text: "DESTINATION: WORLDWIDE EXPEDITION", font: "Special Elite", size: 11, color: "#17141f", rot: 0 },
      { id: "t_f10", type: "text", x: 184, y: 152, w: 320, h: 20, text: "VALIDITY: PERPETUAL / DOES NOT EXPIRE", font: "Special Elite", size: 11, color: "#006466", rot: 0 },
      // Elegant script signature
      { id: "t_f11", type: "text", x: 184, y: 178, w: 200, h: 32, text: "Julian Reid", font: "Pinyon Script", size: 30, color: "#006466", rot: -2 },
      // Rubber stamp marks
      { id: "t_f12", type: "shape", x: 410, y: 140, w: 86, h: 86, bg: "transparent", border: "2px solid #e74c3c", br: 43, rot: -14 },
      { id: "t_f13", type: "text", x: 415, y: 168, w: 76, h: 28, text: "DEPARTURE\nCONFIRMED", font: "Special Elite", size: 10, color: "#e74c3c", rot: -14, align: "center" },
      // Bottom passport bar
      { id: "t_f14", type: "shape", x: 20, y: 236, w: 500, h: 84, bg: "#006466", br: 6, rot: 0 },
      { id: "t_f15", type: "qr", x: 30, y: 242, w: 72, h: 72, text: "https://badgeverse.app/TR-5519", color: "#006466", bg: "#fdf6e2", rot: 0 },
      { id: "t_f16", type: "bar", x: 116, y: 246, w: 250, h: 38, text: "TR-5519-VOYAGE", color: "#fdf6e2", bg: "transparent", rot: 0 },
      { id: "t_f17", type: "text", x: 116, y: 290, w: 390, h: 22, text: "INTERNATIONAL ADVENTURE SOUVENIR · FOR ENTERTAINMENT & COSPLAY ONLY · NOT A REAL PASSPORT", font: "Space Mono", size: 7.5, color: "#e9c46a", rot: 0 }
    ],
    back: [
      // Hero image background
      { id: "t_b01", type: "img", x: 0, y: 0, w: 540, h: 340, src: "/placeholders/hero-travel.svg", zoom: 1, border: "none", rot: 0, br: 16 },
      // Giant woodblock typography
      { id: "t_b02", type: "text", x: 24, y: 30, w: 300, h: 180, text: "BON\nVOYAGE", font: "Anton", size: 84, color: "#e74c3c", rot: 0, ls: -1, ts: "4px 4px 0 #006466" },
      // Explorer Cutout
      { id: "t_b03", type: "img", x: 270, y: 45, w: 220, h: 275, src: "/placeholders/cutout-avatar.svg", zoom: 1, border: "none", rot: 0 },
      // Subtitle badge
      { id: "t_b04", type: "shape", x: 24, y: 205, w: 220, h: 28, bg: "#006466", br: 4, rot: 0 },
      { id: "t_b05", type: "text", x: 30, y: 211, w: 208, h: 18, text: "GRAND EXPEDITION CLUB // 1968", font: "Special Elite", size: 10, color: "#e9c46a", rot: 0, fw: "bold" },
      // Bottom banner
      { id: "t_b06", type: "shape", x: 0, y: 290, w: 540, h: 50, bg: "rgba(0, 100, 102, 0.95)", rot: 0 },
      { id: "t_b07", type: "text", x: 20, y: 298, w: 400, h: 16, text: "EXPEDITION GLOBETROTTER SOUVENIR // EDITION 01", font: "Special Elite", size: 10, color: "#fdf6e2", rot: 0 },
      { id: "t_b08", type: "text", x: 20, y: 316, w: 490, h: 16, text: "Creative collectible only. Never use as an official passport or state travel document.", font: "Space Mono", size: 8, color: "#e9c46a", rot: 0 }
    ]
  }
];

// Merge Batch 1 with existing templates (replacing if id matches, or prepending)
const filteredExisting = current.filter(t => !batch1.some(b => b.id === t.id));
const combined = [...batch1, ...filteredExisting];

fs.writeFileSync(templatesJsonPath, JSON.stringify(combined, null, 2), 'utf8');
console.log('Successfully updated templates.json with Batch 1! Total templates:', combined.length);
