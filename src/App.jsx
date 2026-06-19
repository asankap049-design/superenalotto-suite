import { useState, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════
// REAL DRAWS — SuperEnalotto 2025 + 2026 (6 numbers each)
// Source: superenalotto.com official archive
// ═══════════════════════════════════════════════════════════════
const BASE_DRAWS = [
  // 2026 (newest first → we'll reverse)
  {d:"2026-06-13",n:[13,23,34,68,87,90]},
  {d:"2026-06-12",n:[18,24,42,68,75,83]},
  {d:"2026-06-11",n:[7,21,22,40,44,87]},
  {d:"2026-06-09",n:[18,36,47,55,73,80]},
  {d:"2026-06-08",n:[28,33,51,59,82,87]},
  {d:"2026-06-06",n:[2,7,29,68,72,89]},
  {d:"2026-06-05",n:[9,25,51,63,73,89]},
  {d:"2026-06-04",n:[12,33,43,55,74,75]},
  {d:"2026-05-30",n:[8,13,21,39,63,71]},
  {d:"2026-05-29",n:[9,42,44,46,85,90]},
  {d:"2026-05-28",n:[22,33,36,74,78,86]},
  {d:"2026-05-26",n:[7,10,35,41,45,61]},
  {d:"2026-05-23",n:[14,29,34,57,59,69]},
  {d:"2026-05-22",n:[5,17,65,71,83,87]},
  {d:"2026-05-21",n:[1,38,57,58,64,81]},
  {d:"2026-05-19",n:[49,57,61,73,79,86]},
  {d:"2026-05-16",n:[7,12,60,69,89,90]},
  {d:"2026-05-15",n:[5,13,17,28,47,68]},
  {d:"2026-05-14",n:[31,56,72,74,84,85]},
  {d:"2026-05-12",n:[2,28,31,57,58,59]},
  {d:"2026-05-09",n:[9,27,30,42,43,62]},
  {d:"2026-05-08",n:[8,16,41,47,51,90]},
  {d:"2026-05-07",n:[1,34,48,66,69,73]},
  {d:"2026-05-05",n:[24,34,45,55,81,87]},
  {d:"2026-05-04",n:[3,14,31,46,61,63]},
  {d:"2026-05-02",n:[7,58,60,79,84,86]},
  {d:"2026-04-30",n:[6,7,15,44,52,58]},
  {d:"2026-04-28",n:[29,42,43,47,57,60]},
  {d:"2026-04-27",n:[40,57,62,64,85,87]},
  {d:"2026-04-24",n:[6,13,33,37,68,82]},
  {d:"2026-04-23",n:[18,24,28,35,56,58]},
  {d:"2026-04-21",n:[18,19,40,43,56,77]},
  {d:"2026-04-18",n:[11,22,28,33,68,77]},
  {d:"2026-04-17",n:[13,27,45,53,57,84]},
  {d:"2026-04-16",n:[9,11,12,38,44,54]},
  {d:"2026-04-14",n:[3,5,20,27,35,66]},
  {d:"2026-04-11",n:[19,28,38,48,77,85]},
  {d:"2026-04-10",n:[3,10,13,17,58,90]},
  {d:"2026-04-09",n:[2,30,38,63,74,84]},
  {d:"2026-04-07",n:[10,16,18,47,50,59]},
  {d:"2026-04-04",n:[8,21,29,46,60,81]},
  {d:"2026-04-03",n:[28,52,53,64,66,72]},
  {d:"2026-04-02",n:[18,24,25,32,36,63]},
  {d:"2026-03-31",n:[1,3,39,46,47,61]},
  {d:"2026-03-28",n:[9,45,62,67,68,81]},
  {d:"2026-03-27",n:[6,22,27,43,58,64]},
  {d:"2026-03-26",n:[24,26,39,69,77,80]},
  {d:"2026-03-24",n:[6,54,60,64,74,87]},
  {d:"2026-03-21",n:[9,26,33,49,51,55]},
  {d:"2026-03-20",n:[14,32,45,51,54,87]},
  {d:"2026-03-19",n:[19,39,45,54,62,89]},
  // 2025 full year
  {d:"2025-12-30",n:[6,9,17,20,60,67]},
  {d:"2025-12-29",n:[36,38,45,61,79,83]},
  {d:"2025-12-27",n:[8,19,20,41,74,84]},
  {d:"2025-12-23",n:[16,18,22,24,34,80]},
  {d:"2025-12-22",n:[2,14,28,36,78,85]},
  {d:"2025-12-20",n:[11,24,42,50,89,90]},
  {d:"2025-12-19",n:[16,52,60,75,81,88]},
  {d:"2025-12-18",n:[7,28,63,69,73,77]},
  {d:"2025-12-16",n:[2,18,24,35,41,84]},
  {d:"2025-12-13",n:[2,5,7,36,58,64]},
  {d:"2025-12-12",n:[7,21,35,38,64,80]},
  {d:"2025-12-11",n:[14,44,72,81,85,86]},
  {d:"2025-12-09",n:[8,31,51,65,78,79]},
  {d:"2025-12-06",n:[1,38,42,78,82,84]},
  {d:"2025-12-05",n:[10,19,29,30,56,71]},
  {d:"2025-12-04",n:[12,30,45,48,59,60]},
  {d:"2025-12-02",n:[5,17,28,59,70,90]},
  {d:"2025-11-29",n:[8,16,29,61,65,69]},
  {d:"2025-11-28",n:[1,12,20,21,42,58]},
  {d:"2025-11-27",n:[9,28,43,50,61,88]},
  {d:"2025-11-25",n:[18,20,21,23,40,43]},
  {d:"2025-11-22",n:[2,8,29,47,59,65]},
  {d:"2025-11-21",n:[12,14,18,53,84,86]},
  {d:"2025-11-20",n:[5,9,15,17,48,74]},
  {d:"2025-11-18",n:[18,40,54,83,85,89]},
  {d:"2025-11-15",n:[20,23,40,51,55,85]},
  {d:"2025-11-14",n:[26,38,43,46,72,73]},
  {d:"2025-11-13",n:[7,9,17,54,73,90]},
  {d:"2025-11-11",n:[3,37,42,59,63,84]},
  {d:"2025-11-08",n:[17,18,19,33,35,62]},
  {d:"2025-11-07",n:[5,24,32,67,82,88]},
  {d:"2025-11-06",n:[9,48,51,53,73,88]},
  {d:"2025-11-04",n:[5,18,28,38,44,76]},
  {d:"2025-11-03",n:[30,56,80,81,85,87]},
  {d:"2025-10-31",n:[8,30,32,61,67,85]},
  {d:"2025-10-30",n:[15,30,37,39,56,74]},
  {d:"2025-10-28",n:[8,25,40,54,58,63]},
  {d:"2025-10-25",n:[16,18,33,53,58,89]},
  {d:"2025-10-24",n:[5,12,23,31,84,90]},
  {d:"2025-10-23",n:[7,29,42,62,68,73]},
  {d:"2025-10-21",n:[4,9,14,33,36,77]},
  {d:"2025-10-18",n:[12,13,19,26,75,82]},
  {d:"2025-10-17",n:[2,9,10,32,66,77]},
  {d:"2025-10-16",n:[7,44,45,58,76,80]},
  {d:"2025-10-14",n:[9,31,44,59,70,86]},
  {d:"2025-10-11",n:[28,51,55,62,80,90]},
  {d:"2025-10-10",n:[20,38,42,61,81,82]},
  {d:"2025-10-09",n:[38,49,50,54,78,82]},
  {d:"2025-10-07",n:[17,21,40,56,61,79]},
  {d:"2025-10-04",n:[48,54,61,68,79,87]},
  {d:"2025-10-03",n:[2,4,69,75,79,88]},
  {d:"2025-10-02",n:[1,21,39,42,52,89]},
  {d:"2025-09-30",n:[5,8,71,74,77,81]},
  {d:"2025-09-27",n:[9,10,21,25,27,68]},
  {d:"2025-09-26",n:[2,17,23,39,58,82]},
  {d:"2025-09-25",n:[11,19,36,41,65,82]},
  {d:"2025-09-23",n:[1,6,20,43,59,73]},
  {d:"2025-09-20",n:[2,12,15,31,63,71]},
  {d:"2025-09-19",n:[11,16,23,31,49,78]},
  {d:"2025-09-18",n:[12,38,46,49,60,65]},
  {d:"2025-09-16",n:[1,12,26,44,51,90]},
  {d:"2025-09-13",n:[26,28,31,35,37,65]},
  {d:"2025-09-12",n:[29,33,44,52,63,65]},
  {d:"2025-09-11",n:[3,9,11,35,65,74]},
  {d:"2025-09-09",n:[34,47,71,73,82,90]},
  {d:"2025-09-06",n:[59,73,75,76,78,88]},
  {d:"2025-09-05",n:[9,39,47,52,71,82]},
  {d:"2025-09-04",n:[5,16,38,45,63,83]},
  {d:"2025-09-02",n:[16,19,28,44,60,78]},
  {d:"2025-08-30",n:[30,43,46,62,73,90]},
  {d:"2025-08-29",n:[18,22,32,34,52,56]},
  {d:"2025-08-28",n:[56,59,64,67,72,78]},
  {d:"2025-08-26",n:[12,23,25,34,41,63]},
  {d:"2025-08-23",n:[5,29,40,47,52,80]},
  {d:"2025-08-22",n:[7,25,38,39,66,69]},
  {d:"2025-08-21",n:[49,56,57,61,62,86]},
  {d:"2025-08-19",n:[5,10,51,62,77,81]},
  {d:"2025-08-18",n:[5,19,58,59,83,87]},
  {d:"2025-08-16",n:[6,15,25,31,72,79]},
  {d:"2025-08-14",n:[3,19,30,47,49,75]},
  {d:"2025-08-12",n:[7,11,26,59,82,83]},
  {d:"2025-08-09",n:[6,18,40,41,45,88]},
  {d:"2025-08-08",n:[8,34,38,53,78,79]},
  {d:"2025-08-07",n:[43,55,70,79,83,85]},
  {d:"2025-08-05",n:[6,31,57,60,65,80]},
  {d:"2025-08-02",n:[42,54,66,78,80,88]},
  {d:"2025-08-01",n:[9,25,27,36,54,86]},
  {d:"2025-07-31",n:[14,55,56,57,58,66]},
  {d:"2025-07-29",n:[13,27,31,60,65,75]},
  {d:"2025-07-26",n:[1,9,19,49,53,88]},
  {d:"2025-07-25",n:[15,16,17,36,62,83]},
  {d:"2025-07-24",n:[10,14,37,66,88,89]},
  {d:"2025-07-22",n:[3,8,44,52,69,85]},
  {d:"2025-07-19",n:[5,43,46,56,58,90]},
  {d:"2025-07-18",n:[20,37,50,70,75,88]},
  {d:"2025-07-17",n:[16,35,37,42,43,68]},
  {d:"2025-07-15",n:[4,10,14,48,58,83]},
  {d:"2025-07-12",n:[16,24,25,43,64,78]},
  {d:"2025-07-11",n:[1,31,40,62,64,74]},
  {d:"2025-07-10",n:[5,15,20,32,65,75]},
  {d:"2025-07-08",n:[1,33,40,61,64,73]},
  {d:"2025-07-05",n:[16,46,61,71,75,85]},
  {d:"2025-07-04",n:[26,45,58,65,70,82]},
  {d:"2025-07-03",n:[37,42,49,53,57,65]},
  {d:"2025-07-01",n:[6,9,25,28,75,79]},
  {d:"2025-06-28",n:[10,35,38,41,51,56]},
  {d:"2025-06-27",n:[25,49,54,55,62,73]},
  {d:"2025-06-26",n:[10,56,69,70,79,81]},
  {d:"2025-06-24",n:[2,23,32,36,63,64]},
  {d:"2025-06-21",n:[4,17,28,36,42,50]},
  {d:"2025-06-20",n:[34,67,76,77,86,90]},
  {d:"2025-06-19",n:[4,6,11,31,69,73]},
  {d:"2025-06-17",n:[17,48,52,58,86,87]},
  {d:"2025-06-14",n:[10,18,44,56,73,86]},
  {d:"2025-06-13",n:[8,23,25,48,78,83]},
  {d:"2025-06-12",n:[21,61,69,76,79,81]},
  {d:"2025-06-10",n:[14,45,55,62,76,80]},
  {d:"2025-06-07",n:[5,28,46,49,52,76]},
  {d:"2025-06-06",n:[2,10,33,55,73,74]},
  {d:"2025-06-05",n:[10,17,19,21,63,74]},
  {d:"2025-06-03",n:[1,6,31,37,47,71]},
  {d:"2025-05-31",n:[4,8,47,48,63,90]},
  {d:"2025-05-30",n:[31,34,62,63,82,87]},
  {d:"2025-05-29",n:[27,32,51,67,71,81]},
  {d:"2025-05-27",n:[7,10,35,40,53,75]},
  {d:"2025-05-24",n:[1,3,5,53,62,71]},
  {d:"2025-05-23",n:[2,8,10,18,20,79]},
  {d:"2025-05-22",n:[2,19,23,46,49,72]},
  {d:"2025-05-20",n:[5,19,21,30,33,48]},
  {d:"2025-05-17",n:[10,11,19,22,39,88]},
  {d:"2025-05-16",n:[15,21,30,31,42,80]},
  {d:"2025-05-15",n:[10,28,35,37,73,75]},
  {d:"2025-05-13",n:[2,15,25,62,76,81]},
  {d:"2025-05-10",n:[8,14,17,39,49,55]},
  {d:"2025-05-09",n:[3,47,51,77,85,88]},
  {d:"2025-05-08",n:[1,23,27,54,67,83]},
  {d:"2025-05-06",n:[2,35,51,58,63,88]},
  {d:"2025-05-05",n:[6,18,37,63,72,73]},
  {d:"2025-05-03",n:[1,4,22,44,70,72]},
  {d:"2025-05-02",n:[54,55,67,76,80,85]},
  {d:"2025-04-29",n:[20,31,39,59,60,82]},
  {d:"2025-04-28",n:[13,18,30,44,51,81]},
  {d:"2025-04-26",n:[10,21,24,48,63,67]},
  {d:"2025-04-24",n:[13,14,20,31,55,60]},
  {d:"2025-04-22",n:[10,59,61,62,68,74]},
  {d:"2025-04-19",n:[8,32,51,54,62,69]},
  {d:"2025-04-18",n:[4,11,18,23,83,88]},
  {d:"2025-04-17",n:[8,20,40,44,46,49]},
  {d:"2025-04-15",n:[40,57,60,66,80,81]},
  {d:"2025-04-12",n:[16,38,60,79,83,85]},
  {d:"2025-04-11",n:[9,20,43,49,52,57]},
  {d:"2025-04-10",n:[11,24,32,40,44,85]},
  {d:"2025-04-08",n:[11,20,34,46,48,90]},
  {d:"2025-04-05",n:[5,8,22,41,60,73]},
  {d:"2025-04-04",n:[42,51,71,77,80,82]},
  {d:"2025-04-03",n:[29,30,31,32,35,57]},
  {d:"2025-04-01",n:[4,19,32,47,74,81]},
  {d:"2025-03-29",n:[9,45,66,68,71,85]},
  {d:"2025-03-28",n:[17,26,46,56,71,90]},
  {d:"2025-03-27",n:[28,35,43,45,64,85]},
  {d:"2025-03-25",n:[27,29,31,60,74,88]},
  {d:"2025-03-22",n:[15,28,45,46,66,76]},
  {d:"2025-03-21",n:[7,15,48,49,65,80]},
  {d:"2025-03-20",n:[36,40,49,54,66,83]},
  {d:"2025-03-18",n:[1,64,73,79,80,86]},
  {d:"2025-03-15",n:[2,8,50,77,79,82]},
  {d:"2025-03-14",n:[3,10,20,36,37,49]},
  {d:"2025-03-13",n:[7,25,33,51,58,70]},
  {d:"2025-03-11",n:[22,27,48,55,58,90]},
  {d:"2025-03-08",n:[11,16,35,59,65,87]},
  {d:"2025-03-07",n:[11,24,25,30,43,47]},
  {d:"2025-03-06",n:[1,10,18,19,32,36]},
  {d:"2025-03-04",n:[9,28,52,63,77,79]},
  {d:"2025-03-01",n:[1,12,33,40,41,83]},
  {d:"2025-02-28",n:[4,12,37,59,63,90]},
  {d:"2025-02-27",n:[29,31,33,42,51,72]},
  {d:"2025-02-25",n:[6,58,68,83,89,90]},
  {d:"2025-02-22",n:[35,40,48,49,52,89]},
  {d:"2025-02-21",n:[21,45,48,72,79,87]},
  {d:"2025-02-20",n:[6,19,27,63,71,77]},
  {d:"2025-02-18",n:[3,5,7,54,76,85]},
  {d:"2025-02-15",n:[22,37,48,72,77,85]},
  {d:"2025-02-14",n:[18,30,40,52,60,71]},
  {d:"2025-02-13",n:[31,41,62,64,74,87]},
  {d:"2025-02-11",n:[9,39,55,75,79,86]},
  {d:"2025-02-08",n:[29,46,57,66,72,86]},
  {d:"2025-02-07",n:[16,29,30,47,52,84]},
  {d:"2025-02-06",n:[4,11,41,72,83,86]},
  {d:"2025-02-04",n:[10,29,41,77,83,85]},
  {d:"2025-02-01",n:[21,25,26,45,49,59]},
  {d:"2025-01-31",n:[7,18,22,25,30,72]},
  {d:"2025-01-30",n:[23,32,34,35,41,47]},
  {d:"2025-01-28",n:[48,63,65,72,77,82]},
  {d:"2025-01-25",n:[5,6,24,44,45,76]},
  {d:"2025-01-24",n:[14,20,46,62,84,85]},
  {d:"2025-01-23",n:[1,7,34,46,69,80]},
  {d:"2025-01-21",n:[3,18,41,58,62,73]},
  {d:"2025-01-18",n:[2,10,21,29,46,70]},
  {d:"2025-01-17",n:[8,12,15,40,66,89]},
  {d:"2025-01-16",n:[31,38,59,69,72,88]},
  {d:"2025-01-14",n:[4,15,17,40,64,75]},
  {d:"2025-01-11",n:[5,6,11,22,35,85]},
  {d:"2025-01-10",n:[19,25,33,49,57,72]},
  {d:"2025-01-09",n:[15,33,40,71,74,82]},
  {d:"2025-01-07",n:[7,10,11,29,32,87]},
  {d:"2025-01-04",n:[31,42,43,63,83,86]},
  {d:"2025-01-03",n:[13,30,43,49,74,89]},
  {d:"2025-01-02",n:[19,21,29,74,77,88]},
].sort((a,b)=>a.d.localeCompare(b.d)); // oldest first

// ── Custom draws — localStorage persisted, merged with base ──────────────
const CUSTOM_KEY = "sel_custom_draws";

function loadCustomDraws(){
  try{ const s=localStorage.getItem(CUSTOM_KEY); return s?JSON.parse(s):[]; }catch{ return []; }
}
function saveCustomDraws(arr){
  try{ localStorage.setItem(CUSTOM_KEY, JSON.stringify(arr)); }catch{}
}

// ═══════════════════════════════════════════════════════════════
// GRID HELPERS — 6 rows × 5 cols, each cell = 3 consecutive nums
// Row 1: 1-15, Row 2: 16-30, ... Row 6: 76-90
// Col 1: 1,2,3|16,17,18|... Col 5: 13-15|28-30|...
// ═══════════════════════════════════════════════════════════════
const ROWS = 6, COLS = 5;
const ROW_LABELS = ["1–15","16–30","31–45","46–60","61–75","76–90"];
const COL_LABELS = ["A","B","C","D","E"];

function getCell(n){ return { row:Math.floor((n-1)/15), col:Math.floor(((n-1)%15)/3) }; }
function cellNums(r,c){ const s=r*15+c*3+1; return [s,s+1,s+2]; }
function cellLabel(r,c){ const [a,b,cc]=cellNums(r,c); return `${a}-${cc}`; }

const R="#e63946", O="#f4813a", Y="#f4c842", G="#2a9d8f", B="#3a7bd5", P="#7b5ea7";

// ═══════════════════════════════════════════════════════════════
// PANNELLO GRID — 6 rows × 15 single numbers, red divider every 3
// Exactly like the official SuperEnalotto paper pannello
// ═══════════════════════════════════════════════════════════════
function PannelloGrid({hitMap=null, highlight=[], onCellClick, cellSize=26, mobile=false}){
  const maxHit = hitMap ? Math.max(...Object.values(hitMap),1) : 1;
  const cs = mobile ? 17 : (cellSize||26);

  return(
    <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch",maxWidth:"100%"}}>
      <div style={{display:"inline-block",background:"rgba(255,255,255,0.02)",borderRadius:10,padding:mobile?6:12,border:"1px solid rgba(255,255,255,0.06)"}}>
        {Array.from({length:6},(_,r)=>(
          <div key={r} style={{display:"flex",alignItems:"center",marginBottom:r<5?(mobile?2:3):0}}>
            {/* Row label */}
            <div style={{width:mobile?22:42,flexShrink:0,fontSize:mobile?7:9,color:"#555",textAlign:"right",paddingRight:mobile?3:6,fontWeight:700}}>
              R{r+1}
            </div>

            {/* 15 numbers with red dividers every 3 */}
            {Array.from({length:15},(_,i)=>{
              const n = r*15 + i + 1;
              const isHit = highlight.includes(n);
              const hits = hitMap ? (hitMap[n]||0) : 0;
              const ratio = hitMap ? hits/maxHit : 0;
              const isDividerAfter = (i+1)%3===0 && i<14; // red line after every 3rd number (not after last)

              let bg,border,textCol;
              if(isHit){bg=G;border=`2px solid #1a7a6e`;textCol="#fff";}
              else if(hitMap){
                if(ratio>0.6){bg=R;border="1px solid #c1121f";textCol="#fff";}
                else if(ratio>0.35){bg=O;border="1px solid #d4601a";textCol="#fff";}
                else if(ratio>0.15){bg=Y;border="1px solid #c4a010";textCol="#1a1a2e";}
                else if(ratio>0.02){bg="#1a2a4a";border="1px solid #2a3a6a";textCol="#6a9aca";}
                else{bg="#0a0a1a";border="1px solid #111";textCol="#333";}
              }else{
                bg="rgba(255,255,255,0.04)";border="1px solid rgba(255,255,255,0.08)";textCol="#999";
              }

              return(
                <div key={n} style={{display:"flex",alignItems:"center"}}>
                  <div onClick={()=>onCellClick&&onCellClick(n)}
                    style={{
                      width:cs,height:cs,background:bg,border,borderRadius:mobile?3:5,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      cursor:onCellClick?"pointer":"default",transition:"all 0.1s",
                      boxShadow:isHit?`0 0 8px ${G}88`:"none",flexShrink:0
                    }}>
                    <span style={{fontSize:mobile?7:11,fontWeight:isHit?900:700,color:textCol}}>{n}</span>
                  </div>
                  {/* Red divider line — extra gap around it for clear separation */}
                  {isDividerAfter && (
                    <div style={{width:mobile?2:4,height:cs+(mobile?2:4),background:"#e63946",margin:mobile?"0 2.5px":"0 6px",flexShrink:0,borderRadius:2}}/>
                  )}
                  {!isDividerAfter && i<14 && <div style={{width:mobile?1:2,flexShrink:0}}/>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TAB 1 — HEATMAP
// ═══════════════════════════════════════════════════════════════
function HeatmapTab({mobile,draws}){
  const[range,setRange]=useState(draws.length);
  const[mode,setMode]=useState("cell"); // cell | number | draw

  const freq=useMemo(()=>{
    const f={};
    for(let i=1;i<=90;i++) f[i]=0;
    draws.slice(-range).forEach(d=>d.n.forEach(n=>f[n]++));
    return f;
  },[range,draws]);

  // Cell heat — sum of 3 nums
  const cellHeat=useMemo(()=>{
    const h={};
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
      const nums=cellNums(r,c);
      h[`${r},${c}`]=nums.reduce((a,n)=>a+freq[n],0);
    }
    return h;
  },[freq]);

  const top5nums=Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const top5cells=Object.entries(cellHeat).sort((a,b)=>b[1]-a[1]).slice(0,5);

  return(
    <div style={{display:"flex",flexDirection:mobile?"column":"row",gap:mobile?14:20}}>
      <div style={{flexShrink:0}}>
        <PannelloGrid hitMap={freq} mobile={mobile} cellSize={mobile?22:28}/>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:12,color:"#888",marginBottom:6}}>
            Last <span style={{color:O,fontWeight:700}}>{range}</span> draws
          </div>
          <input type="range" min={20} max={draws.length} step={5} value={range}
            onChange={e=>setRange(+e.target.value)}
            style={{width:"100%",accentColor:R,marginBottom:8}}/>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {[50,100,150,200,"All"].map(v=>(
              <button key={v} onClick={()=>setRange(v==="All"?draws.length:Math.min(v,draws.length))}
                style={{padding:"4px 10px",borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,
                  background:range===(v==="All"?draws.length:v)?R:"rgba(255,255,255,0.08)",color:"#fff"}}>
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
          {[{c:R,l:"🔥 Hot"},{c:O,l:"Warm"},{c:Y,l:"Cool"},{c:"#1a2a4a",l:"Rare"},{c:"#0a0a1a",l:"❄️ Cold",b:"1px solid #111"}].map(x=>(
            <div key={x.l} style={{display:"flex",alignItems:"center",gap:4}}>
              <div style={{width:13,height:13,borderRadius:3,background:x.c,border:x.b||"none"}}/>
              <span style={{fontSize:11,color:"#888"}}>{x.l}</span>
            </div>
          ))}
        </div>

        {/* Top 5 cells */}
        <div style={{background:"rgba(230,57,70,0.07)",border:"1px solid rgba(230,57,70,0.2)",borderRadius:12,padding:12,marginBottom:12}}>
          <div style={{fontSize:12,color:O,fontWeight:700,marginBottom:8}}>🔥 Top 5 cells</div>
          {top5cells.map(([key,hits],i)=>{
            const[r,c]=key.split(",").map(Number);
            const nums=cellNums(r,c);
            return(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <div style={{width:24,height:24,background:R,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#fff"}}>{i+1}</div>
                <div style={{background:R,borderRadius:8,padding:"4px 10px",fontSize:12,fontWeight:700,color:"#fff"}}>
                  {nums.join("-")}
                </div>
                <span style={{fontSize:11,color:"#888"}}>Row {r+1} · Col {COL_LABELS[c]} · <strong style={{color:"#fff"}}>{hits}x</strong></span>
              </div>
            );
          })}
        </div>

        {/* Top 5 numbers */}
        <div style={{background:"rgba(42,157,143,0.07)",border:"1px solid rgba(42,157,143,0.2)",borderRadius:12,padding:12}}>
          <div style={{fontSize:12,color:G,fontWeight:700,marginBottom:8}}>Top 5 numbers</div>
          <div style={{display:"flex",gap:8}}>
            {top5nums.map(([n,hits])=>(
              <div key={n} style={{textAlign:"center"}}>
                <div style={{width:36,height:36,background:G,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900,color:"#fff"}}>{n}</div>
                <div style={{fontSize:10,color:"#777",marginTop:3}}>{hits}x</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TAB 2 — CHECKER (click numbers, see history)
// ═══════════════════════════════════════════════════════════════
function CheckerTab({mobile,draws}){
  const[picked,setPicked]=useState([]);
  const[result,setResult]=useState(null);

  const freq=useMemo(()=>{const f={};for(let i=1;i<=90;i++)f[i]=0;draws.forEach(d=>d.n.forEach(n=>f[n]++));return f;},[draws]);

  const toggleNum=(n)=>{
    setPicked(prev=>prev.includes(n)?prev.filter(x=>x!==n):prev.length>=6?prev:[...prev,n].sort((a,b)=>a-b));
    setResult(null);
  };
  const handleCellClick=(n)=>{
    if(picked.includes(n))setPicked(prev=>prev.filter(x=>x!==n));
    else if(picked.length<6)setPicked(prev=>[...prev,n].sort((a,b)=>a-b));
    setResult(null);
  };
  const analyze=()=>{
    if(picked.length<2)return;
    const total=draws.length;
    const indiv=picked.map(n=>{
      const hits=draws.filter(d=>d.n.includes(n));
      return{n,hits:hits.length,pct:(hits.length/total*100).toFixed(1),last:hits[hits.length-1]?.d||"–"};
    });
    const pairs=[];
    for(let i=0;i<picked.length;i++)for(let j=i+1;j<picked.length;j++){
      const h=draws.filter(d=>d.n.includes(picked[i])&&d.n.includes(picked[j])).length;
      if(h>0)pairs.push({nums:[picked[i],picked[j]],hits:h});
    }
    pairs.sort((a,b)=>b.hits-a.hits);
    const exact=draws.filter(d=>picked.every(n=>d.n.includes(n)));
    setResult({indiv,pairs,exact,total});
  };
  const clear=()=>{setPicked([]);setResult(null);};

  return(
    <div style={{display:"flex",flexDirection:mobile?"column":"row",gap:mobile?14:20}}>
      <div style={{flexShrink:0}}>
        <div style={{fontSize:11,color:"#888",marginBottom:8,textAlign:"center"}}>
          Cells click karanna (max 6) {picked.length>0&&<span style={{color:G,fontWeight:700}}>{picked.length}/6</span>}
        </div>
        <PannelloGrid highlight={picked} mobile={mobile} cellSize={mobile?22:28} onCellClick={handleCellClick}/>
        <div style={{display:"flex",gap:8,marginTop:10}}>
          <button onClick={analyze} disabled={picked.length<2}
            style={{flex:1,padding:10,borderRadius:12,border:"none",cursor:picked.length>=2?"pointer":"not-allowed",
              fontWeight:800,fontSize:14,color:"#fff",
              background:picked.length>=2?`linear-gradient(90deg,${G},#1a7a6e)`:"rgba(255,255,255,0.08)"}}>
            Analyze
          </button>
          <button onClick={clear}
            style={{padding:"10px 16px",borderRadius:12,border:"1px solid rgba(255,255,255,0.1)",
              cursor:"pointer",fontWeight:700,fontSize:13,color:"#aaa",background:"transparent"}}>
            Clear
          </button>
        </div>
      </div>
      <div style={{flex:1,minWidth:0,maxHeight:600,overflowY:"auto"}}>
        {!result&&<div style={{textAlign:"center",padding:"60px 20px",color:"#444"}}>
          <div style={{fontSize:36,marginBottom:12}}>🎯</div>
          <div style={{fontSize:13,color:"#666"}}>Grid cells click karanna → Analyze</div>
        </div>}
        {result&&<>
          <div style={{background:"rgba(42,157,143,0.1)",border:"1px solid rgba(42,157,143,0.25)",borderRadius:12,padding:"10px 14px",marginBottom:14,display:"flex",gap:8,flexWrap:"wrap"}}>
            {result.indiv.map(({n})=><div key={n} style={{width:32,height:32,borderRadius:7,background:G,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800}}>{n}</div>)}
            <span style={{fontSize:12,color:"#888",alignSelf:"center"}}>{result.total} draws analyzed</span>
          </div>
          {/* Individual */}
          <div style={{fontSize:12,color:"#555",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Individual stats</div>
          {result.indiv.map(({n,hits,pct,last})=>(
            <div key={n} style={{background:"rgba(255,255,255,0.02)",borderRadius:10,padding:"10px 12px",marginBottom:8,border:"1px solid rgba(255,255,255,0.06)"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:34,height:34,borderRadius:8,background:G,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900,flexShrink:0}}>{n}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,color:"#aaa"}}>Cell {cellLabel(getCell(n).row,getCell(n).col)} · Row {getCell(n).row+1} · Col {COL_LABELS[getCell(n).col]}</div>
                  <div style={{height:5,background:"rgba(255,255,255,0.06)",borderRadius:3,overflow:"hidden",marginTop:4}}>
                    <div style={{width:`${pct}%`,height:"100%",background:G,borderRadius:3}}/>
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:18,fontWeight:900,color:G}}>{hits}x</div>
                  <div style={{fontSize:10,color:"#666"}}>{pct}%</div>
                </div>
              </div>
              <div style={{fontSize:11,color:"#555",marginTop:4}}>Last: <span style={{color:"#aaa"}}>{last}</span></div>
            </div>
          ))}
          {/* Pairs */}
          {result.pairs.length>0&&<>
            <div style={{fontSize:12,color:"#555",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginTop:12,marginBottom:8}}>Pairs together</div>
            {result.pairs.slice(0,6).map(({nums,hits},i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.02)",borderRadius:8,padding:"8px 10px",marginBottom:6,border:"1px solid rgba(255,255,255,0.05)"}}>
                {nums.map(n=><div key={n} style={{width:28,height:28,borderRadius:6,background:O,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800}}>{n}</div>)}
                <span style={{marginLeft:"auto",fontSize:15,fontWeight:900,color:O}}>{hits}x</span>
              </div>
            ))}
          </>}
          {/* Exact match */}
          <div style={{fontSize:12,color:"#555",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginTop:12,marginBottom:8}}>Exact draws with all selected</div>
          {result.exact.length===0
            ?<div style={{fontSize:12,color:"#444"}}>No exact match found.</div>
            :result.exact.map((draw,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,background:"rgba(42,157,143,0.08)",borderRadius:8,padding:"8px 10px",marginBottom:6,border:"1px solid rgba(42,157,143,0.2)"}}>
                <span style={{fontSize:11,color:G,fontWeight:700,minWidth:80}}>{draw.d}</span>
                <div style={{display:"flex",gap:4}}>
                  {draw.n.map(n=><div key={n} style={{width:24,height:24,borderRadius:5,background:picked.includes(n)?G:"rgba(255,255,255,0.07)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700}}>{n}</div>)}
                </div>
              </div>
            ))
          }
        </>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TAB 3 — DRAW BROWSER
// ═══════════════════════════════════════════════════════════════
function DrawTab({mobile,draws}){
  const[di,setDi]=useState(draws.length-1); // latest first
  const cur=draws[di];
  const years=[...new Set(draws.map(d=>d.d.slice(0,4)))].sort().reverse();

  return(
    <div style={{display:"flex",flexDirection:mobile?"column":"row",gap:mobile?14:20}}>
      <div style={{flexShrink:0}}>
        <PannelloGrid highlight={cur.n} mobile={mobile} cellSize={mobile?22:28}/>
      </div>
      <div style={{flex:1,minWidth:0}}>
        {/* Nav */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(255,255,255,0.03)",borderRadius:12,padding:"12px 14px",marginBottom:12,border:"1px solid rgba(255,255,255,0.07)"}}>
          <button onClick={()=>setDi(i=>Math.max(i-1,0))} disabled={di<=0}
            style={{background:"rgba(255,255,255,0.08)",border:"none",color:"#fff",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:20,opacity:di<=0?0.3:1}}>‹</button>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:mobile?12:14,fontWeight:800,color:O}}>{cur.d}</div>
            <div style={{fontSize:mobile?14:18,fontWeight:900,letterSpacing:mobile?1:3,marginTop:3}}>{cur.n.join(mobile?" · ":"  ·  ")}</div>
            <div style={{fontSize:10,color:"#444",marginTop:2}}>Draw {di+1} / {draws.length}</div>
          </div>
          <button onClick={()=>setDi(i=>Math.min(i+1,draws.length-1))} disabled={di>=draws.length-1}
            style={{background:"rgba(255,255,255,0.08)",border:"none",color:"#fff",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:20,opacity:di>=draws.length-1?0.3:1}}>›</button>
        </div>
        {/* Cell breakdown */}
        <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:14,maxHeight:200,overflowY:"auto"}}>
          {Array.from({length:ROWS},(_,r)=>{
            const rNums=cur.n.filter(n=>getCell(n).row===r);
            if(!rNums.length)return null;
            return(
              <div key={r} style={{display:"flex",alignItems:"center",gap:10,background:"rgba(42,157,143,0.07)",borderRadius:10,padding:"8px 12px",border:"1px solid rgba(42,157,143,0.15)"}}>
                <span style={{fontSize:11,color:G,fontWeight:700,minWidth:40}}>Row {r+1}</span>
                <span style={{fontSize:10,color:"#555",minWidth:44}}>{ROW_LABELS[r]}</span>
                <div style={{display:"flex",gap:6}}>
                  {rNums.map(n=><div key={n} style={{width:28,height:28,borderRadius:6,background:G,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800}}>{n}</div>)}
                </div>
                <span style={{fontSize:10,color:"#444",marginLeft:"auto"}}>Col {rNums.map(n=>COL_LABELS[getCell(n).col]).join(",")}</span>
              </div>
            );
          }).filter(Boolean)}
        </div>
        {/* Year filter */}
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:8}}>
          {years.map(y=>(
            <button key={y} onClick={()=>{const idx=draws.map(d=>d.d).lastIndexOf(draws.filter(d=>d.d.startsWith(y)).slice(-1)[0]?.d);if(idx>=0)setDi(idx);}}
              style={{padding:"4px 10px",borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,
                background:cur.d.startsWith(y)?R:"rgba(255,255,255,0.08)",color:"#fff"}}>{y}</button>
          ))}
        </div>
        {/* Draw list */}
        <div style={{maxHeight:250,overflowY:"auto",display:"flex",flexDirection:"column",gap:3}}>
          {[...draws].reverse().map((draw,revIdx)=>{
            const idx=draws.length-1-revIdx;
            return(
              <button key={idx} onClick={()=>setDi(idx)}
                style={{padding:"6px 12px",borderRadius:8,cursor:"pointer",
                  border:di===idx?`1px solid ${R}`:"1px solid rgba(255,255,255,0.06)",
                  background:di===idx?"rgba(230,57,70,0.12)":"rgba(255,255,255,0.02)",
                  color:"#fff",display:"flex",justifyContent:"space-between",fontSize:11,fontWeight:di===idx?700:400}}>
                <span style={{color:draw.d>="2026-01-01"?O:"#666"}}>{draw.d}</span>
                <span style={{color:di===idx?O:"#555",letterSpacing:1}}>{draw.n.join(" · ")}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROW/LINE PREDICTOR ENGINE — ported from superenalotto_visual_predict.py
// Walk-forward validated: lines beat random baseline (3.1 vs 2.67/4)
// ═══════════════════════════════════════════════════════════════
function getRow(n){ return Math.floor((n-1)/15); }
function getLine(n){ return Math.floor(((n-1)%15)/3); }

function predictNextDraw(draws,windowSize=10){
  const window_ = draws.slice(-windowSize);
  const n = window_.length;

  const rowScore = Array(6).fill(0);
  const lineScore = Array(5).fill(0);

  window_.forEach((draw,i)=>{
    const rec=(i+1)/n;
    draw.n.forEach(num=>{
      rowScore[getRow(num)] += rec;
      lineScore[getLine(num)] += rec;
    });
  });

  const maxR = Math.max(...rowScore)||1;
  const maxL = Math.max(...lineScore)||1;
  const rN = rowScore.map(s=>s/maxR);
  const lN = lineScore.map(s=>s/maxL);

  // Due bonus — not hit in last 3 draws
  const recent3Rows = new Set();
  const recent3Lines = new Set();
  window_.slice(-3).forEach(d=>d.n.forEach(num=>{recent3Rows.add(getRow(num));recent3Lines.add(getLine(num));}));
  const dueR = Array(6).fill(0).map((_,r)=>recent3Rows.has(r)?0:0.45);
  const dueL = Array(5).fill(0).map((_,l)=>recent3Lines.has(l)?0:0.35);

  // Streak penalty — 3+ consecutive hits
  const streakPen = Array(6).fill(0);
  for(let r=0;r<6;r++){
    const s = window_.slice(-3).filter(d=>d.n.some(num=>getRow(num)===r)).length;
    if(s>=3) streakPen[r]=0.3;
  }

  const rowFinal = rN.map((s,r)=>s+dueR[r]-streakPen[r]);
  const lineFinal = lN.map((s,l)=>s+dueL[l]);

  const maxRF = Math.max(...rowFinal)||1;
  const maxLF = Math.max(...lineFinal)||1;
  const rF = rowFinal.map(s=>s/maxRF);
  const lF = lineFinal.map(s=>s/maxLF);

  // Consecutive misses (all-time, for display)
  const missR = Array(6).fill(0).map((_,r)=>{
    let s=0;
    for(let i=draws.length-1;i>=0;i--){ if(!draws[i].n.some(num=>getRow(num)===r))s++; else break; }
    return s;
  });
  const missL = Array(5).fill(0).map((_,l)=>{
    let s=0;
    for(let i=draws.length-1;i>=0;i--){ if(!draws[i].n.some(num=>getLine(num)===l))s++; else break; }
    return s;
  });

  const topRows = [...rF.keys()].sort((a,b)=>rF[b]-rF[a]).slice(0,3);
  const topLines = [...lF.keys()].sort((a,b)=>lF[b]-lF[a]).slice(0,3);

  // Intersection zones — row x line combos, ranked
  const intersections = [];
  topRows.forEach(r=>{
    topLines.forEach(l=>{
      const score = (rF[r]+lF[l])/2;
      const start = r*15 + l*3 + 1;
      intersections.push({r,l,score,nums:[start,start+1,start+2]});
    });
  });
  intersections.sort((a,b)=>b.score-a.score);

  return {rF,lF,missR,missL,topRows,topLines,intersections,lastDate:window_[window_.length-1].d};
}

// ═══════════════════════════════════════════════════════════════
// TAB 4 — AI PREDICT
// ═══════════════════════════════════════════════════════════════
function PredictTab({mobile,draws}){
  const[windowSize,setWindowSize]=useState(10);
  const pred = useMemo(()=>predictNextDraw(draws,windowSize),[draws,windowSize]);
  const {rF,lF,missR,missL,topRows,topLines,intersections,lastDate} = pred;

  // Build highlight set for grid — top row x top line intersection numbers
  const highlightNums = useMemo(()=>{
    const nums=[];
    intersections.slice(0,3).forEach(z=>nums.push(...z.nums));
    return nums;
  },[intersections]);

  // Combined heat map for grid coloring (row score + line score blended per number)
  const heatMap = useMemo(()=>{
    const h={};
    for(let n=1;n<=90;n++){
      const r=getRow(n), l=getLine(n);
      h[n] = Math.round(((rF[r]+lF[l])/2)*100);
    }
    return h;
  },[rF,lF]);

  return(
    <div>
      {/* Disclaimer */}
      <div style={{background:"rgba(244,129,58,0.08)",border:"1px solid rgba(244,129,58,0.25)",borderRadius:12,padding:"10px 14px",marginBottom:16,fontSize:12,color:"#ccc"}}>
        ⚠️ Educational pattern analysis only. Walk-forward backtest eke <strong style={{color:O}}>line predictions</strong> random baseline ekata wada slightly hodai (avg 3.12/4 vs 2.67/4 random) — but lottery eka fundamentally random. No guarantee.
      </div>

      <div style={{display:"flex",flexDirection:mobile?"column":"row",gap:mobile?14:20}}>
        {/* Left: Grid with heat */}
        <div style={{flexShrink:0}}>
          <div style={{fontSize:11,color:"#888",marginBottom:8,textAlign:"center"}}>
            🎯 Predicted hot zones (last {windowSize} draws)
          </div>
          <PannelloGrid hitMap={heatMap} highlight={highlightNums} mobile={mobile} cellSize={mobile?22:28}/>
        </div>

        <div style={{flex:1,minWidth:0}}>
          {/* Window control */}
          <div style={{marginBottom:14}}>
            <div style={{fontSize:12,color:"#888",marginBottom:6}}>Analysis window:</div>
            <div style={{display:"flex",gap:6}}>
              {[5,10,15,20].map(w=>(
                <button key={w} onClick={()=>setWindowSize(w)}
                  style={{padding:"5px 12px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,
                    background:windowSize===w?P:"rgba(255,255,255,0.08)",color:"#fff"}}>
                  {w} draws
                </button>
              ))}
            </div>
            <div style={{fontSize:10,color:"#444",marginTop:4}}>Based on draws up to {lastDate}</div>
          </div>

          {/* Row probability bars */}
          <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:12,marginBottom:12}}>
            <div style={{fontSize:12,color:"#888",fontWeight:700,marginBottom:8}}>ROW probability — next draw</div>
            {rF.map((score,r)=>{
              const isPick=topRows.includes(r);
              const pct=Math.round(score*100);
              return(
                <div key={r} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <span style={{fontSize:10,color:isPick?R:"#777",fontWeight:700,minWidth:64}}>{ROW_LABELS[r]}</span>
                  <div style={{flex:1,background:"rgba(255,255,255,0.04)",borderRadius:4,height:18,overflow:"hidden",position:"relative"}}>
                    <div style={{width:`${pct}%`,height:"100%",borderRadius:4,
                      background:isPick?`linear-gradient(90deg,${R},${O})`:pct>50?O:pct>25?Y:"#1a2a4a"}}/>
                    <span style={{position:"absolute",right:6,top:1,fontSize:10,color:"#fff",fontWeight:700}}>{pct}%</span>
                  </div>
                  {isPick&&<span style={{fontSize:10,color:R,fontWeight:800,flexShrink:0}}>✓</span>}
                  {missR[r]>0&&<span style={{fontSize:9,color:"#555",flexShrink:0,minWidth:34}}>{missR[r]}miss</span>}
                </div>
              );
            })}
          </div>

          {/* Line probability bars */}
          <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:12,marginBottom:12}}>
            <div style={{fontSize:12,color:"#888",fontWeight:700,marginBottom:8}}>LINE probability — next draw <span style={{color:G,fontWeight:400}}>(stronger signal)</span></div>
            {lF.map((score,l)=>{
              const isPick=topLines.includes(l);
              const pct=Math.round(score*100);
              return(
                <div key={l} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <span style={{fontSize:10,color:isPick?G:"#777",fontWeight:700,minWidth:28}}>L{l+1}</span>
                  <div style={{flex:1,background:"rgba(255,255,255,0.04)",borderRadius:4,height:18,overflow:"hidden",position:"relative"}}>
                    <div style={{width:`${pct}%`,height:"100%",borderRadius:4,
                      background:isPick?`linear-gradient(90deg,${G},#1a7a6e)`:pct>50?"#3a7bd5":pct>25?Y:"#1a2a4a"}}/>
                    <span style={{position:"absolute",right:6,top:1,fontSize:10,color:"#fff",fontWeight:700}}>{pct}%</span>
                  </div>
                  {isPick&&<span style={{fontSize:10,color:G,fontWeight:800,flexShrink:0}}>✓</span>}
                  {missL[l]>0&&<span style={{fontSize:9,color:"#555",flexShrink:0,minWidth:34}}>{missL[l]}miss</span>}
                </div>
              );
            })}
          </div>

          {/* Top intersection zones */}
          <div style={{background:"rgba(42,157,143,0.07)",border:"1px solid rgba(42,157,143,0.2)",borderRadius:12,padding:12}}>
            <div style={{fontSize:12,color:G,fontWeight:700,marginBottom:8}}>🔥 Top intersection zones (Row × Line)</div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {intersections.slice(0,6).map((z,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,background:i<3?"rgba(42,157,143,0.1)":"rgba(255,255,255,0.02)",borderRadius:8,padding:"6px 10px"}}>
                  <span style={{fontSize:10,color:"#666",fontWeight:700,minWidth:18}}>#{i+1}</span>
                  <span style={{fontSize:11,color:O,fontWeight:700,minWidth:54}}>R{z.r+1}×L{z.l+1}</span>
                  <div style={{display:"flex",gap:4}}>
                    {z.nums.map(n=><div key={n} style={{width:24,height:24,borderRadius:5,background:i<3?G:"rgba(255,255,255,0.08)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800}}>{n}</div>)}
                  </div>
                  <span style={{fontSize:10,color:"#555",marginLeft:"auto"}}>{Math.round(z.score*100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TAB 5 — ADD DRAW (manual entry, persisted to localStorage)
// ═══════════════════════════════════════════════════════════════
function AddDrawTab({mobile, customDraws, onAdd, onDelete}){
  const[dateIn,setDateIn]=useState("");
  const[numsIn,setNumsIn]=useState("");
  const[error,setError]=useState("");
  const[success,setSuccess]=useState("");

  const handleAdd=()=>{
    setError("");setSuccess("");
    const date=dateIn.trim();
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date)){setError("Date format: YYYY-MM-DD");return;}
    const nums=numsIn.trim().split(/[\s,]+/).filter(Boolean).map(Number);
    if(nums.some(n=>isNaN(n)||n<1||n>90)){setError("Numbers 1-90 athule wenna one");return;}
    const unique=[...new Set(nums)].sort((a,b)=>a-b);
    if(unique.length!==6){setError("Exactly 6 numbers denna (1-90)");return;}
    const ok = onAdd(date, unique);
    if(!ok){setError(`${date} already exists!`);return;}
    setSuccess(`✓ ${date}: [${unique.join(", ")}] added!`);
    setDateIn("");setNumsIn("");
  };

  return(
    <div style={{display:"flex",flexDirection:mobile?"column":"row",gap:mobile?14:20}}>
      {/* Input form */}
      <div style={{flex:1,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:20}}>
        <div style={{fontSize:14,fontWeight:700,color:O,marginBottom:16}}>➕ New Draw Add Karanna</div>

        <div style={{marginBottom:12}}>
          <div style={{fontSize:12,color:"#888",marginBottom:6}}>Date (YYYY-MM-DD)</div>
          <input value={dateIn} onChange={e=>setDateIn(e.target.value)} placeholder="2026-06-17"
            style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.05)",color:"#fff",fontSize:14}}/>
        </div>

        <div style={{marginBottom:16}}>
          <div style={{fontSize:12,color:"#888",marginBottom:6}}>6 Numbers (1-90, space or comma separated)</div>
          <input value={numsIn} onChange={e=>setNumsIn(e.target.value)} placeholder="7 21 33 48 62 79"
            onKeyDown={e=>e.key==="Enter"&&handleAdd()}
            style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.05)",color:"#fff",fontSize:14}}/>
        </div>

        {error&&<div style={{fontSize:12,color:R,marginBottom:10,padding:"8px 12px",background:"rgba(230,57,70,0.1)",borderRadius:8}}>{error}</div>}
        {success&&<div style={{fontSize:12,color:G,marginBottom:10,padding:"8px 12px",background:"rgba(42,157,143,0.1)",borderRadius:8}}>{success}</div>}

        <button onClick={handleAdd} style={{width:"100%",padding:"12px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:800,fontSize:15,color:"#fff",background:`linear-gradient(90deg,${G},#1a7a6e)`}}>
          ➕ Add Draw
        </button>

        <div style={{fontSize:11,color:"#444",marginTop:10,textAlign:"center"}}>
          Saved locally — {customDraws.length} custom draws added
        </div>
      </div>

      {/* Custom draws list */}
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,fontWeight:700,color:"#888",marginBottom:10}}>
          Custom Draws ({customDraws.length})
          {customDraws.length>0&&<span style={{fontSize:11,color:"#444",marginLeft:8}}>click × to delete</span>}
        </div>
        {customDraws.length===0
          ? <div style={{fontSize:12,color:"#444",padding:"20px",textAlign:"center",background:"rgba(255,255,255,0.02)",borderRadius:12,border:"1px solid rgba(255,255,255,0.05)"}}>
              No custom draws yet. Add the latest result above!
            </div>
          : <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:420,overflowY:"auto"}}>
              {[...customDraws].sort((a,b)=>b.d.localeCompare(a.d)).map(draw=>(
                <div key={draw.d} style={{display:"flex",alignItems:"center",gap:8,background:"rgba(42,157,143,0.08)",border:"1px solid rgba(42,157,143,0.2)",borderRadius:10,padding:"8px 12px"}}>
                  <span style={{fontSize:12,color:G,fontWeight:700,minWidth:80,flexShrink:0}}>{draw.d}</span>
                  <div style={{display:"flex",gap:4,flex:1,flexWrap:"wrap"}}>
                    {draw.n.map(n=>(
                      <div key={n} style={{width:26,height:26,borderRadius:6,background:G,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#fff"}}>{n}</div>
                    ))}
                  </div>
                  <button onClick={()=>onDelete(draw.d)} style={{background:"rgba(230,57,70,0.2)",border:"none",color:R,borderRadius:6,width:24,height:24,cursor:"pointer",fontSize:14,fontWeight:700,flexShrink:0}}>×</button>
                </div>
              ))}
            </div>
        }

        <div style={{marginTop:16,fontSize:12,color:"#555",background:"rgba(255,255,255,0.02)",borderRadius:10,padding:"10px 14px",border:"1px solid rgba(255,255,255,0.05)"}}>
          📊 Total draws in system: <strong style={{color:"#aaa"}}>{BASE_DRAWS.length + customDraws.length}</strong>
          <span style={{color:G,marginLeft:8}}>({BASE_DRAWS.length} base + {customDraws.length} custom)</span>
          <div style={{marginTop:6,color:"#444"}}>Aluth draw add karapu gaman serama tabs (Heatmap, Checker, Predict) auto-update wenawa!</div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CONSECUTIVE PATTERN ENGINE
// A "consecutive" = 2+ numbers in sequential order. Pattern "2-2-1" =
// two pairs + one lone number.
// ═══════════════════════════════════════════════════════════════
function getConsecPattern(nums){
  const sorted = [...nums].sort((a,b)=>a-b);
  const clusters = [];
  let current = [sorted[0]];
  for(let i=1;i<sorted.length;i++){
    if(sorted[i] === sorted[i-1]+1) current.push(sorted[i]);
    else { clusters.push(current); current=[sorted[i]]; }
  }
  clusters.push(current);
  const lengths = clusters.map(c=>c.length).sort((a,b)=>b-a);
  const consecutiveClusters = clusters.filter(c=>c.length>=2);
  return {
    clusters, consecutiveClusters, lengths,
    patternStr: lengths.join("-"),
    hasConsecutive: consecutiveClusters.length>0,
    maxRun: Math.max(...lengths),
  };
}

function classifyConsec(lengths){
  const nonOnes = lengths.filter(l=>l>1);
  if(nonOnes.length===0) return "No consecutive";
  if(nonOnes.length===1 && nonOnes[0]===2) return "One pair";
  if(nonOnes.length===1 && nonOnes[0]>=3) return `One run of ${nonOnes[0]}`;
  if(nonOnes.length===2 && nonOnes.every(n=>n===2)) return "Two pairs";
  if(nonOnes.length>=2) return `Multiple runs (${nonOnes.length})`;
  return "Other";
}

function ConsecNumbers({nums, clusters}){
  const CLUSTER_COLORS=[R,G,O,P,B,"#c026d3"];
  const numToCluster = {};
  let ci=0;
  clusters.forEach(c=>{ if(c.length>=2){ c.forEach(n=>numToCluster[n]=ci); ci++; } });
  return(
    <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
      {[...nums].sort((a,b)=>a-b).map(n=>{
        const inCluster = numToCluster[n]!==undefined;
        const color = inCluster ? CLUSTER_COLORS[numToCluster[n]%CLUSTER_COLORS.length] : "rgba(255,255,255,0.08)";
        return(
          <div key={n} style={{width:30,height:30,borderRadius:7,
            background:inCluster?color:"rgba(255,255,255,0.08)",
            color:inCluster?"#fff":"#999",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:12,fontWeight:inCluster?900:600,
            border:inCluster?`2px solid ${color}`:"1px solid rgba(255,255,255,0.1)"
          }}>{n}</div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TAB — CONSECUTIVE (Browser + Stats + Checker via sub-tabs)
// ═══════════════════════════════════════════════════════════════
function ConsecutiveTab({draws, mobile}){
  const[sub,setSub]=useState("browser");
  const[filter,setFilter]=useState("all");
  const[picked,setPicked]=useState([]);

  const enriched = useMemo(()=>draws.map(d=>({...d, pattern:getConsecPattern(d.n)})), [draws]);

  const filtered = useMemo(()=>{
    if(filter==="none") return enriched.filter(d=>!d.pattern.hasConsecutive);
    if(filter==="has") return enriched.filter(d=>d.pattern.hasConsecutive);
    return enriched;
  },[enriched,filter]);

  const patternFreq = useMemo(()=>{
    const f={}; enriched.forEach(d=>{f[d.pattern.patternStr]=(f[d.pattern.patternStr]||0)+1;});
    return Object.entries(f).sort((a,b)=>b[1]-a[1]);
  },[enriched]);
  const total = enriched.length;
  const hasConsec = enriched.filter(d=>d.pattern.hasConsecutive).length;
  const noConsec = total - hasConsec;
  const lengthDist = useMemo(()=>{
    const dist={}; enriched.forEach(d=>d.pattern.consecutiveClusters.forEach(c=>{dist[c.length]=(dist[c.length]||0)+1;}));
    return Object.entries(dist).sort((a,b)=>a[0]-b[0]);
  },[enriched]);
  const maxRunEver = Math.max(...enriched.map(d=>d.pattern.maxRun));
  const maxRunDraws = enriched.filter(d=>d.pattern.maxRun===maxRunEver);

  const togglePick=(n)=>setPicked(prev=>prev.includes(n)?prev.filter(x=>x!==n):prev.length>=6?prev:[...prev,n].sort((a,b)=>a-b));
  const checkPattern = useMemo(()=>picked.length>0?getConsecPattern(picked):null,[picked]);
  const matchingDraws = useMemo(()=>{
    if(!checkPattern||picked.length<2) return [];
    return draws.filter(d=>getConsecPattern(d.n).patternStr===checkPattern.patternStr);
  },[checkPattern,draws,picked]);

  return(
    <div>
      {/* explainer */}
      <div style={{background:"rgba(123,94,167,0.08)",border:"1px solid rgba(123,94,167,0.25)",borderRadius:12,padding:"10px 14px",marginBottom:14,fontSize:12,color:"#ccc"}}>
        🔢 Consecutive = 2+ numbers in sequence. Pattern <strong style={{color:P}}>"2-2-1"</strong> = two pairs + one lone number (e.g. 1,2 · 5,6 · 10).
      </div>

      {/* sub-tabs */}
      <div style={{display:"flex",gap:6,marginBottom:16}}>
        {[{id:"browser",l:"📋 Browser"},{id:"stats",l:"📊 Stats"},{id:"checker",l:"🔢 Checker"}].map(s=>(
          <button key={s.id} onClick={()=>setSub(s.id)} style={{
            padding:"7px 14px",borderRadius:9,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,
            background:sub===s.id?P:"rgba(255,255,255,0.06)",color:"#fff"
          }}>{s.l}</button>
        ))}
      </div>

      {/* BROWSER */}
      {sub==="browser" && <div>
        <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
          {[{id:"all",l:"All"},{id:"has",l:"Has consecutive"},{id:"none",l:"No consecutive"}].map(f=>(
            <button key={f.id} onClick={()=>setFilter(f.id)} style={{
              padding:"6px 14px",borderRadius:9,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,
              background:filter===f.id?R:"rgba(255,255,255,0.07)",color:"#fff"}}>{f.l}</button>
          ))}
          <span style={{fontSize:11,color:"#666",alignSelf:"center",marginLeft:6}}>{filtered.length} draws</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:560,overflowY:"auto"}}>
          {[...filtered].reverse().map((draw,i)=>(
            <div key={i} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:"10px 12px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:6}}>
                <span style={{fontSize:12,color:O,fontWeight:700}}>{draw.d}</span>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:11,color:draw.pattern.hasConsecutive?G:"#555",fontWeight:700,fontFamily:"monospace",
                    background:draw.pattern.hasConsecutive?"rgba(42,157,143,0.15)":"rgba(255,255,255,0.04)",padding:"2px 8px",borderRadius:6}}>
                    {draw.pattern.patternStr}</span>
                  <span style={{fontSize:10,color:"#666"}}>{classifyConsec(draw.pattern.lengths)}</span>
                </div>
              </div>
              <ConsecNumbers nums={draw.n} clusters={draw.pattern.clusters}/>
            </div>
          ))}
        </div>
      </div>}

      {/* STATS */}
      {sub==="stats" && <div>
        <div style={{display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"repeat(3,1fr)",gap:10,marginBottom:20}}>
          <div style={{background:"rgba(42,157,143,0.08)",border:"1px solid rgba(42,157,143,0.2)",borderRadius:12,padding:14,textAlign:"center"}}>
            <div style={{fontSize:24,fontWeight:900,color:G}}>{hasConsec}</div>
            <div style={{fontSize:11,color:"#888"}}>Has consecutive</div>
            <div style={{fontSize:10,color:"#555"}}>{(hasConsec/total*100).toFixed(1)}%</div>
          </div>
          <div style={{background:"rgba(230,57,70,0.08)",border:"1px solid rgba(230,57,70,0.2)",borderRadius:12,padding:14,textAlign:"center"}}>
            <div style={{fontSize:24,fontWeight:900,color:R}}>{noConsec}</div>
            <div style={{fontSize:11,color:"#888"}}>No consecutive</div>
            <div style={{fontSize:10,color:"#555"}}>{(noConsec/total*100).toFixed(1)}%</div>
          </div>
          <div style={{background:"rgba(244,129,58,0.08)",border:"1px solid rgba(244,129,58,0.2)",borderRadius:12,padding:14,textAlign:"center"}}>
            <div style={{fontSize:24,fontWeight:900,color:O}}>{maxRunEver}</div>
            <div style={{fontSize:11,color:"#888"}}>Longest run ever</div>
            <div style={{fontSize:10,color:"#555"}}>{maxRunDraws.length}x</div>
          </div>
        </div>
        <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:14,marginBottom:16}}>
          <div style={{fontSize:13,fontWeight:700,color:"#888",marginBottom:10}}>Pattern frequency (all {total} draws)</div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {patternFreq.map(([pattern,count])=>{
              const pct=count/total*100; const maxCount=patternFreq[0][1];
              return(
                <div key={pattern} style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:12,color:O,fontWeight:700,minWidth:64,fontFamily:"monospace"}}>{pattern}</span>
                  <div style={{flex:1,background:"rgba(255,255,255,0.04)",borderRadius:4,height:20,overflow:"hidden",position:"relative"}}>
                    <div style={{width:`${(count/maxCount)*100}%`,height:"100%",background:`linear-gradient(90deg,${R},${O})`,borderRadius:4}}/>
                    <span style={{position:"absolute",right:6,top:1,fontSize:10,color:"#fff",fontWeight:700}}>{count} ({pct.toFixed(1)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:14,marginBottom:16}}>
          <div style={{fontSize:13,fontWeight:700,color:"#888",marginBottom:6}}>Run-length distribution</div>
          <div style={{fontSize:11,color:"#555",marginBottom:10}}>How many runs of each length appeared</div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            {lengthDist.map(([len,count])=>(
              <div key={len} style={{textAlign:"center",background:"rgba(244,129,58,0.08)",borderRadius:10,padding:"10px 16px",border:"1px solid rgba(244,129,58,0.2)"}}>
                <div style={{fontSize:20,fontWeight:900,color:O}}>{count}</div>
                <div style={{fontSize:10,color:"#888"}}>runs of {len}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:"rgba(123,94,167,0.07)",border:"1px solid rgba(123,94,167,0.2)",borderRadius:12,padding:14}}>
          <div style={{fontSize:13,fontWeight:700,color:P,marginBottom:10}}>🔥 Longest run ever: {maxRunEver}</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {maxRunDraws.map((draw,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                <span style={{fontSize:11,color:"#888",minWidth:80}}>{draw.d}</span>
                <ConsecNumbers nums={draw.n} clusters={draw.pattern.clusters}/>
              </div>
            ))}
          </div>
        </div>
      </div>}

      {/* CHECKER */}
      {sub==="checker" && <div style={{display:"flex",flexDirection:mobile?"column":"row",gap:mobile?14:20}}>
        <div style={{flexShrink:0}}>
          <div style={{fontSize:11,color:"#888",marginBottom:8,textAlign:"center"}}>
            Numbers select karanna (max 6) {picked.length>0&&<span style={{color:G,fontWeight:700}}>{picked.length}/6</span>}
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:4,maxWidth:mobile?320:420,background:"rgba(255,255,255,0.02)",borderRadius:12,padding:10,border:"1px solid rgba(255,255,255,0.06)"}}>
            {Array.from({length:90},(_,i)=>i+1).map(n=>{
              const isP=picked.includes(n);
              return(<div key={n} onClick={()=>togglePick(n)} style={{width:mobile?26:30,height:mobile?26:30,borderRadius:6,
                background:isP?G:"rgba(255,255,255,0.05)",color:isP?"#fff":"#888",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:isP?800:600,cursor:"pointer"}}>{n}</div>);
            })}
          </div>
          <button onClick={()=>setPicked([])} style={{marginTop:10,padding:"8px 16px",borderRadius:10,border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"#aaa",cursor:"pointer",fontSize:12,fontWeight:700,width:"100%"}}>Clear</button>
        </div>
        <div style={{flex:1,minWidth:0}}>
          {!checkPattern && <div style={{textAlign:"center",padding:"50px 20px",color:"#444"}}>
            <div style={{fontSize:32,marginBottom:10}}>🔢</div>
            <div style={{fontSize:13}}>Numbers select karanna pattern eka balanna</div>
          </div>}
          {checkPattern && <>
            <div style={{background:"rgba(42,157,143,0.1)",border:"1px solid rgba(42,157,143,0.25)",borderRadius:12,padding:14,marginBottom:14}}>
              <div style={{fontSize:11,color:"#888",marginBottom:8}}>Your numbers:</div>
              <ConsecNumbers nums={picked} clusters={checkPattern.clusters}/>
              <div style={{marginTop:10,display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:18,fontWeight:900,color:O,fontFamily:"monospace"}}>{checkPattern.patternStr}</span>
                <span style={{fontSize:12,color:G}}>{classifyConsec(checkPattern.lengths)}</span>
              </div>
            </div>
            <div style={{fontSize:12,color:"#888",marginBottom:8}}>
              Same pattern ({checkPattern.patternStr}) past: <span style={{color:G,fontWeight:700}}>{matchingDraws.length}</span> / {draws.length}
              <span style={{color:"#555",marginLeft:6}}>({(matchingDraws.length/draws.length*100).toFixed(1)}%)</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:5,maxHeight:300,overflowY:"auto"}}>
              {matchingDraws.slice().reverse().map((draw,i)=>{
                const p=getConsecPattern(draw.n);
                return(<div key={i} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:8,padding:"6px 10px",display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:11,color:O,minWidth:80}}>{draw.d}</span>
                  <ConsecNumbers nums={draw.n} clusters={p.clusters}/>
                </div>);
              })}
              {matchingDraws.length===0 && picked.length>=2 && <div style={{fontSize:12,color:"#444"}}>No past draw has this exact pattern yet.</div>}
            </div>
          </>}
        </div>
      </div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App(){
  const[tab,setTab]=useState(0);
  const[mobile,setMobile]=useState(window.innerWidth<768);
  const[customDraws,setCustomDraws]=useState(()=>loadCustomDraws());

  useState(()=>{
    const fn=()=>setMobile(window.innerWidth<768);
    window.addEventListener("resize",fn);
    return()=>window.removeEventListener("resize",fn);
  },[]);

  // Merged draws — base + custom, sorted oldest→newest
  const draws = useMemo(()=>{
    const merged=[...BASE_DRAWS,...customDraws];
    return merged.sort((a,b)=>a.d.localeCompare(b.d));
  },[customDraws]);

  const handleAddDraw=(date,nums)=>{
    if(draws.some(d=>d.d===date)) return false;
    const updated=[...customDraws,{d:date,n:nums}];
    setCustomDraws(updated);
    saveCustomDraws(updated);
    return true;
  };

  const handleDeleteDraw=(date)=>{
    const updated=customDraws.filter(d=>d.d!==date);
    setCustomDraws(updated);
    saveCustomDraws(updated);
  };

  const tabs=[
    {label:"🔥",full:"Heatmap",C:HeatmapTab},
    {label:"🎯",full:"Checker",C:CheckerTab},
    {label:"📅",full:"Draws",C:DrawTab},
    {label:"🤖",full:"Predict",C:PredictTab},
    {label:"🔢",full:"Consec",C:ConsecutiveTab},
    {label:"➕",full:"Add Draw",C:null},
  ];
  const{C}=tabs[tab];

  return(
    <div style={{minHeight:"100vh",background:"#0a0a14",fontFamily:"'Segoe UI',sans-serif",color:"#fff"}}>
      <div style={{background:"linear-gradient(180deg,#0e0e22 0%,#0a0a14 100%)",borderBottom:"1px solid rgba(255,255,255,0.06)",padding:mobile?"10px 14px 0":"16px 28px 0"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{marginBottom:mobile?8:12}}>
            <div style={{display:"inline-block",background:`linear-gradient(90deg,${R},${O})`,borderRadius:20,padding:"3px 12px",fontSize:9,fontWeight:800,letterSpacing:2,marginBottom:4}}>SUPERENALOTTO SUITE</div>
            <h1 style={{margin:"0 0 1px",fontSize:mobile?16:21,fontWeight:900}}>PANNELLO A Analysis</h1>
            <p style={{margin:0,color:"#444",fontSize:11}}>
              {draws.length} real draws · 2025–2026 · superenalotto.com
              {customDraws.length>0&&<span style={{color:G,marginLeft:6}}>(+{customDraws.length} added)</span>}
            </p>
          </div>
          <div style={{display:"flex",gap:3}}>
            {tabs.map((t,i)=>(
              <button key={i} onClick={()=>setTab(i)} style={{
                padding:mobile?"9px 16px":"10px 20px",border:"none",cursor:"pointer",
                fontWeight:700,fontSize:13,borderRadius:"10px 10px 0 0",transition:"all 0.15s",
                background:tab===i?"#0a0a14":"rgba(255,255,255,0.04)",
                color:tab===i?O:"#555",
                borderBottom:tab===i?`2px solid ${R}`:"2px solid transparent"
              }}>{mobile?t.label:`${t.label} ${t.full}`}</button>
            ))}
          </div>
        </div>
      </div>
      <div style={{padding:mobile?"14px 10px":"24px 28px",maxWidth:1100,margin:"0 auto"}}>
        {C===null
          ? <AddDrawTab mobile={mobile} customDraws={customDraws} onAdd={handleAddDraw} onDelete={handleDeleteDraw}/>
          : <C mobile={mobile} draws={draws}/>
        }
      </div>
      <p style={{textAlign:"center",fontSize:10,color:"#1a1a25",paddingBottom:16}}>
        Data: superenalotto.com · Educational only
      </p>
    </div>
  );
}
