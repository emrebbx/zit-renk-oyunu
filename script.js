"use strict";

const GIZLI_SPREY_SAYISI = 2;
const KAZANMA_SKORU = 3;
const TUR_GECIKMESI_MS = 1200;
const OTOMATIK_HAMLE_GECIKMESI_MS = 2000;
const MENU_BUTON_GECIKMESI_MS = 280;
const OYUN_MODLARI = {
  normal: { ad: "Normal Mod", sureSaniye: 5 * 60 },
  bilgisayar: { ad: "Bilgisayara Karşı", sureSaniye: 5 * 60 }
};
const OYUNCU_ADLARI = { erkek: "Oyuncu 1", kiz: "Oyuncu 2" };

const KARAKTERLER = [
  { id: "erkek-01", ad: "Alp", secim: "images/karakter-erkek-01-secim.png", oyun: "images/karakter-erkek-01-oyun.png" },
  { id: "erkek-02", ad: "Kutay", secim: "images/karakter-erkek-02-secim.png", oyun: "images/karakter-erkek-02-oyun.png" },
  { id: "erkek-03", ad: "Oğuz", secim: "images/karakter-erkek-03-secim.png", oyun: "images/karakter-erkek-03-oyun.png" },
  { id: "kiz-01", ad: "Umay", secim: "images/karakter-kiz-01-secim.png", oyun: "images/karakter-kiz-01-oyun.png" },
  { id: "kiz-02", ad: "Gökçe", secim: "images/karakter-kiz-02-secim.png", oyun: "images/karakter-kiz-02-oyun.png" },
  { id: "kiz-03", ad: "Banu", secim: "images/karakter-kiz-03-secim.png", oyun: "images/karakter-kiz-03-oyun.png" }
];
const ROBOT_KARAKTER = {
  id: "robot",
  ad: "Robot",
  oyun: "images/karakter-robot-oyun.png"
};

const RENKLER = ["kirmizi", "yesil", "mavi", "turuncu", "sari", "mor"];
const RENK_ADLARI = {
  kirmizi: "Kırmızı", yesil: "Yeşil", mavi: "Mavi",
  turuncu: "Turuncu", sari: "Sarı", mor: "Mor"
};
const ZIT_RENKLER = {
  kirmizi: "yesil", yesil: "kirmizi",
  mavi: "turuncu", turuncu: "mavi",
  sari: "mor", mor: "sari"
};
const SABUN_GORSELLERI = Object.fromEntries(
  RENKLER.map((renk) => [renk, `images/sabun-${renk}.png`])
);
const MIKROP_GORSELLERI = Object.fromEntries(
  RENKLER.map((renk) => [renk, `images/mikrop-${renk}.png`])
);

// İleride gerçek dosya yolları buraya yazılabilir.
const KAYBETME_VIDEOLARI = {
  erkek: "assets/video/erkek-kaybetti.mp4",
  kiz: "assets/video/kiz-kaybetti.mp4"
};

let aktifOyuncu = "erkek";
let erkekSkor = 0;
let kizSkor = 0;
let aktifMikropRengi = "";
let sabunlar = [];
let gizliSpreyKonumlari = new Set();
let oyunBittiMi = false;
let hamleKilitliMi = false;
let otomatikOynuyorMu = false;
let otomatikTestBaslangici = 0;
let otomatikHamleSayisi = 0;
let turZamanlayicisi = null;
let turKilidiZamanlayicisi = null;
let otomatikZamanlayici = null;
let bilgisayarZamanlayicisi = null;
let oyunBitisZamani = 0;
let sureZamanlayicisi = null;
let seciliMod = null;
let karakterSecimSirasi = 1;
let secilenKarakterler = { oyuncu1: null, oyuncu2: null };

const elemanlar = {
  acilisEkrani: document.querySelector("#acilisEkrani"),
  devamDokun: document.querySelector("#devamDokun"),
  oyunLogoEkrani: document.querySelector("#oyunLogoEkrani"),
  tanitimVideoEkrani: document.querySelector("#tanitimVideoEkrani"),
  tanitimVideosu: document.querySelector("#tanitimVideosu"),
  tanitimAtla: document.querySelector("#tanitimAtla"),
  anaMenuEkrani: document.querySelector("#anaMenuEkrani"),
  menuStart: document.querySelector("#menuStart"),
  menuNasil: document.querySelector("#menuNasil"),
  menuCredits: document.querySelector("#menuCredits"),
  menuBilgiPerdesi: document.querySelector("#menuBilgiPerdesi"),
  menuBilgiBaslik: document.querySelector("#menuBilgiBaslik"),
  menuBilgiMetin: document.querySelector("#menuBilgiMetin"),
  menuBilgiGorsel: document.querySelector("#menuBilgiGorsel"),
  menuBilgiKapat: document.querySelector("#menuBilgiKapat"),
  grid: document.querySelector("#sabunGrid"),
  turYazisi: document.querySelector("#turYazisi"),
  gorevYazisi: document.querySelector("#gorevYazisi"),
  bildirim: document.querySelector("#bildirim"),
  erkekPanel: document.querySelector("#erkekPanel"),
  kizPanel: document.querySelector("#kizPanel"),
  erkekMikrop: document.querySelector("#erkekMikrop"),
  kizMikrop: document.querySelector("#kizMikrop"),
  kubbeMikrop: document.querySelector("#kubbeMikrop"),
  erkekSkor: document.querySelector("#erkekSkor"),
  kizSkor: document.querySelector("#kizSkor"),
  sonucPerdesi: document.querySelector("#sonucPerdesi"),
  kaybetmeSahnesi: document.querySelector("#kaybetmeSahnesi"),
  kaybetmeAnaMenu: document.querySelector("#kaybetmeAnaMenu"),
  modPerdesi: document.querySelector("#modPerdesi"),
  sonucBaslik: document.querySelector("#sonucBaslik"),
  sonucMetin: document.querySelector("#sonucMetin"),
  videoYeri: document.querySelector("#videoYeri"),
  yenidenBaslat: document.querySelector("#yenidenBaslat"),
  modSecimineDon: document.querySelector("#modSecimineDon"),
  anaMenuyeDon: document.querySelector("#anaMenuyeDon"),
  modGeri: document.querySelector("#modGeri"),
  otomatikOyna: document.querySelector("#otomatikOyna"),
  oyunModEkrani: document.querySelector("#oyunModEkrani"),
  oyunAnaMenu: document.querySelector("#oyunAnaMenu"),
  testDurumu: document.querySelector("#testDurumu"),
  sureGostergesi: document.querySelector("#sureGostergesi"),
  karakterSecimPerdesi: document.querySelector("#karakterSecimPerdesi"),
  karakterSecimBaslik: document.querySelector("#karakterSecimBaslik"),
  karakterSecimAciklama: document.querySelector("#karakterSecimAciklama"),
  karakterListesi: document.querySelector("#karakterListesi"),
  karakterOyunaGec: document.querySelector("#karakterOyunaGec"),
  karakterSecimGeri: document.querySelector("#karakterSecimGeri"),
  oyuncu1Karakter: document.querySelector("#oyuncu1Karakter"),
  oyuncu2Karakter: document.querySelector("#oyuncu2Karakter")
};

[elemanlar.menuStart, elemanlar.menuNasil, elemanlar.menuCredits].forEach((buton) => {
  const gorsel = buton.querySelector("img");
  const basilmisGorsel = new Image();
  basilmisGorsel.src = buton.dataset.basilmis;

  const normalHaleGetir = () => {
    gorsel.src = buton.dataset.normal;
  };

  buton.addEventListener("pointerdown", () => {
    gorsel.src = buton.dataset.basilmis;
  });
  buton.addEventListener("pointerup", () => {
    window.setTimeout(normalHaleGetir, MENU_BUTON_GECIKMESI_MS);
  });
  buton.addEventListener("pointercancel", normalHaleGetir);
  buton.addEventListener("pointerleave", normalHaleGetir);
  buton.addEventListener("blur", normalHaleGetir);
});

document.querySelectorAll(".mod-gorsel-butonu[data-basilmis]").forEach((buton) => {
  const gorsel = buton.querySelector("img");
  const basilmisGorsel = new Image();
  basilmisGorsel.src = buton.dataset.basilmis;
  buton.addEventListener("pointerdown", () => { gorsel.src = buton.dataset.basilmis; });
  const normaleDon = () => window.setTimeout(() => { gorsel.src = buton.dataset.normal; }, MENU_BUTON_GECIKMESI_MS);
  buton.addEventListener("pointerup", normaleDon);
  buton.addEventListener("pointercancel", () => { gorsel.src = buton.dataset.normal; });
  buton.addEventListener("pointerleave", () => { gorsel.src = buton.dataset.normal; });
});

const butonTikSesi = new Audio("sounds/buton-tik.mp3");
butonTikSesi.preload = "auto";
const dogruSabunSesi = new Audio("sounds/dogru-sabuna-dokun.mp3");
dogruSabunSesi.preload = "auto";
dogruSabunSesi.volume = 0.9;
const spreyBulunduSesi = new Audio("sounds/sprey-bulundu.mp3");
spreyBulunduSesi.preload = "auto";
spreyBulunduSesi.volume = 0.9;
const anaMenuMuzigi = new Audio("sounds/ana-menu-muzik.mp3");
anaMenuMuzigi.preload = "auto";
anaMenuMuzigi.loop = true;
anaMenuMuzigi.volume = 0.45;
const OYUN_MUZIGI_SEVIYESI = 0.3;
const oyunMuzigi = new Audio("sounds/oyun-muzigi.mp3");
oyunMuzigi.preload = "auto";
oyunMuzigi.loop = true;
oyunMuzigi.volume = OYUN_MUZIGI_SEVIYESI;
let oyunMuzigiKismaZamanlayicisi = null;

function oyunMuziginiBaslat() {
  window.clearInterval(oyunMuzigiKismaZamanlayicisi);
  oyunMuzigi.pause();
  oyunMuzigi.currentTime = 0;
  oyunMuzigi.volume = OYUN_MUZIGI_SEVIYESI;
  oyunMuzigi.play().catch(() => {});
}

function oyunMuziginiDurdur() {
  window.clearInterval(oyunMuzigiKismaZamanlayicisi);
  oyunMuzigi.pause();
  oyunMuzigi.currentTime = 0;
  oyunMuzigi.volume = OYUN_MUZIGI_SEVIYESI;
}

function oyunMuziginiKisarakDurdur(sure = 1500) {
  window.clearInterval(oyunMuzigiKismaZamanlayicisi);
  if (oyunMuzigi.paused) return;
  const baslangicSeviyesi = oyunMuzigi.volume;
  const baslangicZamani = performance.now();
  oyunMuzigiKismaZamanlayicisi = window.setInterval(() => {
    const ilerleme = Math.min((performance.now() - baslangicZamani) / sure, 1);
    oyunMuzigi.volume = baslangicSeviyesi * (1 - ilerleme);
    if (ilerleme >= 1) oyunMuziginiDurdur();
  }, 40);
}

function anaMenuMuziginiBaslat() {
  if (!anaMenuMuzigi.paused) return;
  anaMenuMuzigi.currentTime = 0;
  anaMenuMuzigi.play().catch(() => {});
}

function anaMenuMuziginiDurdur() {
  anaMenuMuzigi.pause();
  anaMenuMuzigi.currentTime = 0;
}

function anaMenuyuGoster() {
  oyunMuziginiDurdur();
  elemanlar.kaybetmeSahnesi.hidden = true;
  elemanlar.kaybetmeSahnesi.classList.remove("tamamlandi", "kapaniyor");
  elemanlar.modPerdesi.hidden = true;
  elemanlar.karakterSecimPerdesi.hidden = true;
  elemanlar.anaMenuEkrani.inert = false;
  elemanlar.anaMenuEkrani.hidden = false;
  elemanlar.anaMenuEkrani.classList.remove("arka-planda");
  anaMenuMuziginiBaslat();
}

function menuBilgisiGoster(baslik, metin, gorsel = "") {
  elemanlar.menuBilgiBaslik.textContent = baslik;
  elemanlar.menuBilgiMetin.textContent = metin;
  elemanlar.menuBilgiBaslik.hidden = Boolean(gorsel);
  elemanlar.menuBilgiMetin.hidden = Boolean(gorsel);
  elemanlar.menuBilgiGorsel.hidden = !gorsel;
  if (gorsel) elemanlar.menuBilgiGorsel.src = gorsel;
  else elemanlar.menuBilgiGorsel.removeAttribute("src");
  elemanlar.menuBilgiGorsel.closest(".menu-bilgi-karti").classList.toggle("gorselli", Boolean(gorsel));
  elemanlar.menuBilgiPerdesi.hidden = false;
}

let tanitimKapatiliyorMu = false;
let tanitimIzlendiMi = false;

function tanitimVideosunuKapat() {
  if (tanitimKapatiliyorMu) return;
  tanitimKapatiliyorMu = true;
  tanitimIzlendiMi = true;
  elemanlar.tanitimVideosu.pause();
  anaMenuyuGoster();
  elemanlar.tanitimVideoEkrani.classList.add("kapaniyor");
  window.setTimeout(() => {
    elemanlar.tanitimVideoEkrani.hidden = true;
    elemanlar.tanitimVideoEkrani.classList.remove("kapaniyor");
  }, 600);
}

function tanitimVideosunuGoster() {
  tanitimKapatiliyorMu = false;
  elemanlar.tanitimVideoEkrani.classList.remove("kapaniyor");
  elemanlar.tanitimVideoEkrani.hidden = false;
  elemanlar.tanitimVideosu.currentTime = 0;
  elemanlar.tanitimVideosu.play().catch(() => {
    elemanlar.tanitimVideosu.controls = true;
  });
}

function oyunLogoEkraniniGoster() {
  elemanlar.oyunLogoEkrani.hidden = false;
  elemanlar.oyunLogoEkrani.classList.remove("kapaniyor");
  window.setTimeout(() => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => elemanlar.oyunLogoEkrani.classList.add("aktif"));
    });
  }, 900);

  window.setTimeout(() => {
    elemanlar.oyunLogoEkrani.classList.add("logo-gitti");
    window.setTimeout(() => {
      anaMenuyuGoster();
      elemanlar.oyunLogoEkrani.classList.add("kapaniyor");
      window.setTimeout(() => {
        elemanlar.oyunLogoEkrani.remove();
      }, 700);
    }, 1500);
  }, 6300);
}

function acilisEkraniniKapat() {
  if (!elemanlar.devamDokun.classList.contains("hazir")) return;
  elemanlar.devamDokun.disabled = true;
  anaMenuMuzigi.volume = 0;
  anaMenuMuzigi.play().then(() => {
    anaMenuMuzigi.pause();
    anaMenuMuzigi.currentTime = 0;
    anaMenuMuzigi.volume = 0.45;
  }).catch(() => {
    anaMenuMuzigi.volume = 0.45;
  });
  butonTikSesi.currentTime = 0;
  butonTikSesi.play().catch(() => {});
  oyunLogoEkraniniGoster();
  elemanlar.acilisEkrani.classList.add("kapaniyor");
  window.setTimeout(() => elemanlar.acilisEkrani.remove(), 600);
}

window.addEventListener("load", () => {
  window.setTimeout(() => elemanlar.devamDokun.classList.add("hazir"), 1900);
});

elemanlar.tanitimVideosu.addEventListener("ended", tanitimVideosunuKapat);
elemanlar.tanitimAtla.addEventListener("pointerup", (olay) => {
  olay.preventDefault();
  butonTikSesi.currentTime = 0;
  butonTikSesi.play().catch(() => {});
  tanitimVideosunuKapat();
});

elemanlar.devamDokun.addEventListener("pointerup", (olay) => {
  olay.preventDefault();
  acilisEkraniniKapat();
});

elemanlar.menuStart.addEventListener("pointerup", (olay) => {
  if (elemanlar.anaMenuEkrani.hidden || elemanlar.anaMenuEkrani.classList.contains("arka-planda")) return;
  olay.preventDefault();
  butonTikSesi.currentTime = 0;
  butonTikSesi.play().catch(() => {});
  window.setTimeout(() => {
    elemanlar.anaMenuEkrani.inert = true;
    elemanlar.anaMenuEkrani.classList.add("arka-planda");
    if (tanitimIzlendiMi) {
      modSeciminiAc();
    } else {
      anaMenuMuziginiDurdur();
      tanitimVideosunuGoster();
    }
  }, MENU_BUTON_GECIKMESI_MS);
});

elemanlar.menuNasil.addEventListener("pointerup", (olay) => {
  olay.preventDefault();
  butonTikSesi.currentTime = 0;
  butonTikSesi.play().catch(() => {});
  window.setTimeout(() => {
    menuBilgisiGoster("Nasıl Oynanır?", "", "images/nasil-oynanir.png");
  }, MENU_BUTON_GECIKMESI_MS);
});

elemanlar.menuCredits.addEventListener("pointerup", (olay) => {
  olay.preventDefault();
  butonTikSesi.currentTime = 0;
  butonTikSesi.play().catch(() => {});
  window.setTimeout(() => {
    menuBilgisiGoster("Credits", "Zıt Renk Oyunu\nEU Games");
  }, MENU_BUTON_GECIKMESI_MS);
});

elemanlar.menuBilgiKapat.addEventListener("pointerup", (olay) => {
  olay.preventDefault();
  elemanlar.menuBilgiPerdesi.hidden = true;
});

function rastgeleSayi(ustSinir) {
  return Math.floor(Math.random() * ustSinir);
}

function oyuncununKarakterAdi(oyuncu) {
  const secim = oyuncu === "erkek" ? secilenKarakterler.oyuncu1 : secilenKarakterler.oyuncu2;
  return secim?.ad || OYUNCU_ADLARI[oyuncu];
}

function karistir(dizi) {
  for (let i = dizi.length - 1; i > 0; i -= 1) {
    const j = rastgeleSayi(i + 1);
    [dizi[i], dizi[j]] = [dizi[j], dizi[i]];
  }
  return dizi;
}

function dengeliSabunlarOlustur() {
  const onBirAdetOlanlar = new Set(karistir([...RENKLER]).slice(0, 4));
  const yeniSabunlar = [];
  RENKLER.forEach((renk) => {
    const adet = onBirAdetOlanlar.has(renk) ? 11 : 10;
    for (let i = 0; i < adet; i += 1) yeniSabunlar.push(renk);
  });
  return karistir(yeniSabunlar);
}

function mikropOlustur() {
  const uygunRenkler = RENKLER.filter((renk) => renk !== aktifMikropRengi);
  aktifMikropRengi = uygunRenkler[rastgeleSayi(uygunRenkler.length)];
}

function gizliSpreyleriYerlestir() {
  gizliSpreyKonumlari = new Set();
  const dogruRenk = ZIT_RENKLER[aktifMikropRengi];
  const uygunKonumlar = sabunlar
    .map((renk, indeks) => (renk === dogruRenk ? indeks : -1))
    .filter((indeks) => indeks !== -1);
  karistir(uygunKonumlar)
    .slice(0, Math.min(GIZLI_SPREY_SAYISI, uygunKonumlar.length))
    .forEach((indeks) => gizliSpreyKonumlari.add(indeks));
}

function skorCiz(kapsayici, skor) {
  if (kapsayici.dataset.skor === String(skor)) return;

  kapsayici.replaceChildren();
  for (let i = 0; i < KAZANMA_SKORU; i += 1) {
    const simge = document.createElement("span");
    simge.className = `sprey-simgesi${i < skor ? " dolu" : ""}`;
    simge.setAttribute("aria-hidden", "true");
    if (i < skor) {
      const sise = document.createElement("img");
      sise.src = "images/sprey-sise.png";
      sise.alt = "";
      sise.draggable = false;
      simge.append(sise);
    }
    kapsayici.append(simge);
  }
  kapsayici.dataset.skor = String(skor);
  kapsayici.setAttribute("aria-label", `${skor} / ${KAZANMA_SKORU}`);
}

function spreyiSkoraUcur(sabunButonu, skorKapsayici, hedefSirasi) {
  const hedefYuva = skorKapsayici.querySelector(`.sprey-simgesi:nth-child(${hedefSirasi})`);
  const hedefSise = hedefYuva?.querySelector("img");
  if (!hedefYuva || !hedefSise) return;

  hedefYuva.classList.add("sprey-geliyor");
  const sabunKutusu = sabunButonu.getBoundingClientRect();
  const hedefKutusu = hedefYuva.getBoundingClientRect();
  const baslangicBoyutu = Math.max(sabunKutusu.width, sabunKutusu.height) * 2.15;
  const baslangicX = sabunKutusu.left + sabunKutusu.width / 2;
  const baslangicY = sabunKutusu.top + sabunKutusu.height / 2;
  const hedefX = hedefKutusu.left + hedefKutusu.width / 2;
  const hedefY = hedefKutusu.top + hedefKutusu.height / 2;
  const bitisOlcegi = hedefKutusu.height / baslangicBoyutu;

  const ucanSise = document.createElement("img");
  ucanSise.className = "ucan-sprey";
  ucanSise.src = "images/sprey-sise.png";
  ucanSise.alt = "";
  ucanSise.draggable = false;
  ucanSise.style.width = `${baslangicBoyutu}px`;
  ucanSise.style.height = `${baslangicBoyutu}px`;
  ucanSise.style.left = `${baslangicX - baslangicBoyutu / 2}px`;
  ucanSise.style.top = `${baslangicY - baslangicBoyutu / 2}px`;
  document.body.append(ucanSise);

  const ucus = ucanSise.animate([
    { opacity: 0, transform: "translate(0, 0) scale(.35)" },
    { opacity: 1, transform: "translate(0, 0) scale(1.08)", offset: .2 },
    { opacity: 1, transform: "translate(0, 0) scale(1)", offset: .38 },
    {
      opacity: 1,
      transform: `translate(${hedefX - baslangicX}px, ${hedefY - baslangicY}px) scale(${bitisOlcegi})`
    }
  ], {
    duration: TUR_GECIKMESI_MS,
    easing: "cubic-bezier(.22, .72, .24, 1)",
    fill: "forwards"
  });

  ucus.onfinish = () => {
    hedefYuva.classList.remove("sprey-geliyor");
    ucanSise.remove();
  };
}

function mikropCiz() {
  elemanlar.erkekMikrop.replaceChildren();
  elemanlar.kizMikrop.replaceChildren();
  elemanlar.kubbeMikrop.replaceChildren();
  const mikrop = document.createElement("img");
  mikrop.className = "mikrop";
  mikrop.src = MIKROP_GORSELLERI[aktifMikropRengi];
  mikrop.alt = `${RENK_ADLARI[aktifMikropRengi]} mikrop`;
  mikrop.draggable = false;
  elemanlar.kubbeMikrop.append(mikrop);
}

function gridCiz() {
  elemanlar.grid.replaceChildren();
  sabunlar.forEach((renk, indeks) => {
    const buton = document.createElement("button");
    buton.type = "button";
    buton.className = `sabun renk-${renk}`;
    buton.dataset.indeks = String(indeks);
    buton.setAttribute("aria-label", `${RENK_ADLARI[renk]} sabun`);
    const gorsel = document.createElement("img");
    gorsel.src = SABUN_GORSELLERI[renk];
    gorsel.alt = "";
    gorsel.draggable = false;
    buton.append(gorsel);
    elemanlar.grid.append(buton);
  });
}

function arayuzuGuncelle() {
  const erkekAktif = aktifOyuncu === "erkek";
  const robotSirasi = seciliMod === "bilgisayar" && aktifOyuncu === "kiz";
  elemanlar.erkekPanel.classList.toggle("aktif", erkekAktif);
  elemanlar.erkekPanel.classList.toggle("pasif", !erkekAktif);
  elemanlar.kizPanel.classList.toggle("aktif", !erkekAktif);
  elemanlar.kizPanel.classList.toggle("pasif", erkekAktif);
  elemanlar.turYazisi.textContent = `${OYUNCU_ADLARI[aktifOyuncu]}'in sırası`;
  elemanlar.gorevYazisi.textContent = `${RENK_ADLARI[aktifMikropRengi]} mikrobun zıt rengini bul!`;
  elemanlar.grid.classList.toggle("robot-sirasi", robotSirasi);
  elemanlar.grid.setAttribute("aria-disabled", String(robotSirasi));
  skorCiz(elemanlar.erkekSkor, erkekSkor);
  skorCiz(elemanlar.kizSkor, kizSkor);
  mikropCiz();
  gridCiz();
}

function yeniTurBaslat(gecisKilidi = false) {
  if (oyunBittiMi) return;
  hamleKilitliMi = gecisKilidi;
  elemanlar.bildirim.textContent = "";
  mikropOlustur();
  sabunlar = dengeliSabunlarOlustur();
  gizliSpreyleriYerlestir();
  arayuzuGuncelle();
  elemanlar.grid.classList.toggle("tur-kilitli", gecisKilidi);
  if (gecisKilidi) elemanlar.grid.setAttribute("aria-disabled", "true");

  if (gecisKilidi) {
    window.clearTimeout(turKilidiZamanlayicisi);
    turKilidiZamanlayicisi = window.setTimeout(() => {
      if (oyunBittiMi) return;
      hamleKilitliMi = false;
      elemanlar.grid.classList.remove("tur-kilitli");
      otomatikHamleyiPlanla();
      bilgisayarHamlesiniPlanla();
    }, 1000);
  } else {
    otomatikHamleyiPlanla();
    bilgisayarHamlesiniPlanla();
  }
}

function oyunuBitir(kazanan, baslik, aciklama, kaybeden = null) {
  oyunBittiMi = true;
  hamleKilitliMi = true;
  oyunMuziginiKisarakDurdur();
  window.clearTimeout(turKilidiZamanlayicisi);
  window.clearInterval(sureZamanlayicisi);
  elemanlar.sonucBaslik.textContent = baslik;
  let testOzeti = "";
  if (otomatikOynuyorMu) {
    const gecenSure = ((performance.now() - otomatikTestBaslangici) / 1000).toFixed(1);
    testOzeti = ` Otomatik test: ${otomatikHamleSayisi} hamle, ${gecenSure} saniye.`;
  }
  const kazananMetni = kazanan
    ? ` Kazanan: ${oyuncununKarakterAdi(kazanan)}.`
    : " Oyun beraberlikle tamamlandı.";
  elemanlar.sonucMetin.textContent = `${aciklama}${kazananMetni}${testOzeti}`;
  // Kaybeden varsa ileride KAYBETME_VIDEOLARI[kaybeden] ile video elementi kurulabilir.
  elemanlar.videoYeri.dataset.video = kaybeden ? KAYBETME_VIDEOLARI[kaybeden] : "";
  elemanlar.sonucPerdesi.hidden = false;
  otomatikOynatmayiDurdur();
}

function alpKaybetmeSahnesiniOynat(kaybeden, kazanan, secilenRenk, dogruRenk) {
  oyunBittiMi = true;
  hamleKilitliMi = true;
  window.clearTimeout(turZamanlayicisi);
  window.clearTimeout(turKilidiZamanlayicisi);
  window.clearTimeout(otomatikZamanlayici);
  window.clearTimeout(bilgisayarZamanlayicisi);
  window.clearInterval(sureZamanlayicisi);
  oyunMuziginiKisarakDurdur();
  elemanlar.kaybetmeSahnesi.classList.remove("tamamlandi", "kapaniyor");
  elemanlar.kaybetmeSahnesi.hidden = false;

  window.setTimeout(() => {
    elemanlar.kaybetmeSahnesi.classList.add("tamamlandi");
  }, 8100);
}

function sabunaBas(indeks, buton, bilgisayarHamlesi = false) {
  if (oyunBittiMi || hamleKilitliMi || !Number.isInteger(indeks)) return;
  if (seciliMod === "bilgisayar" && aktifOyuncu === "kiz" && !bilgisayarHamlesi && !otomatikOynuyorMu) return;
  hamleKilitliMi = true;
  const secilenRenk = sabunlar[indeks];
  const dogruRenk = ZIT_RENKLER[aktifMikropRengi];
  buton.classList.add("secildi");
  if (otomatikOynuyorMu) {
    otomatikHamleSayisi += 1;
    elemanlar.testDurumu.textContent = `${otomatikHamleSayisi} hamle yapıldı`;
  }

  if (secilenRenk !== dogruRenk) {
    const kaybeden = aktifOyuncu;
    const kazanan = kaybeden === "erkek" ? "kiz" : "erkek";
    const kaybedenKarakter = kaybeden === "erkek"
      ? secilenKarakterler.oyuncu1
      : secilenKarakterler.oyuncu2;
    if (kaybedenKarakter?.id === "erkek-01") {
      alpKaybetmeSahnesiniOynat(kaybeden, kazanan, secilenRenk, dogruRenk);
      return;
    }
    oyunuBitir(
      kazanan,
      "Yanlış renk!",
      `${OYUNCU_ADLARI[kaybeden]} ${RENK_ADLARI[secilenRenk]} sabuna bastı; doğru cevap ${RENK_ADLARI[dogruRenk]} idi.`,
      kaybeden
    );
    return;
  }

  const kopuk = document.createElement("img");
  kopuk.className = "sabun-kopugu";
  kopuk.src = "images/sabun-kopugu.png";
  kopuk.alt = "";
  kopuk.draggable = false;
  buton.replaceChildren(kopuk);
  buton.classList.add("kopuruyor");
  dogruSabunSesi.currentTime = 0;
  dogruSabunSesi.play().catch(() => {});

  const spreyBulundu = gizliSpreyKonumlari.has(indeks);
  const oncekiSkor = aktifOyuncu === "erkek" ? erkekSkor : kizSkor;
  if (spreyBulundu) {
    window.setTimeout(() => {
      spreyBulunduSesi.currentTime = 0;
      spreyBulunduSesi.play().catch(() => {});
    }, 260);
    if (aktifOyuncu === "erkek") erkekSkor += 1;
    else kizSkor += 1;
  }
  elemanlar.bildirim.textContent = "";

  const aktifSkor = aktifOyuncu === "erkek" ? erkekSkor : kizSkor;
  skorCiz(elemanlar.erkekSkor, erkekSkor);
  skorCiz(elemanlar.kizSkor, kizSkor);
  if (spreyBulundu) {
    spreyiSkoraUcur(
      buton,
      aktifOyuncu === "erkek" ? elemanlar.erkekSkor : elemanlar.kizSkor,
      oncekiSkor + 1
    );
  }
  const aktifMikropYuvasi = elemanlar.kubbeMikrop;
  const aktifMikropGorseli = aktifMikropYuvasi.querySelector(".mikrop");
  if (aktifMikropGorseli) {
    aktifMikropGorseli.classList.add("yok-oluyor");
    window.setTimeout(() => aktifMikropGorseli.remove(), 850);
  }

  if (aktifSkor >= KAZANMA_SKORU) {
    turZamanlayicisi = window.setTimeout(() => {
      oyunuBitir(aktifOyuncu, `${oyuncununKarakterAdi(aktifOyuncu)} kazandı!`, "Üç temizlik spreyi toplandı.");
    }, TUR_GECIKMESI_MS);
    return;
  }

  turZamanlayicisi = window.setTimeout(() => {
    aktifOyuncu = aktifOyuncu === "erkek" ? "kiz" : "erkek";
    yeniTurBaslat(true);
  }, TUR_GECIKMESI_MS);
}

function otomatikHamleyiPlanla() {
  if (!otomatikOynuyorMu || oyunBittiMi || hamleKilitliMi) return;
  window.clearTimeout(otomatikZamanlayici);
  otomatikZamanlayici = window.setTimeout(() => {
    if (!otomatikOynuyorMu || oyunBittiMi || hamleKilitliMi) return;
    const dogruRenk = ZIT_RENKLER[aktifMikropRengi];
    const uygunButonlar = [...elemanlar.grid.querySelectorAll(".sabun")]
      .filter((buton) => sabunlar[Number(buton.dataset.indeks)] === dogruRenk);
    const secilenButon = uygunButonlar[rastgeleSayi(uygunButonlar.length)];
    if (secilenButon) sabunaBas(Number(secilenButon.dataset.indeks), secilenButon);
  }, OTOMATIK_HAMLE_GECIKMESI_MS);
}

function bilgisayarHamlesiniPlanla() {
  window.clearTimeout(bilgisayarZamanlayicisi);
  if (seciliMod !== "bilgisayar" || aktifOyuncu !== "kiz" || otomatikOynuyorMu || oyunBittiMi || hamleKilitliMi) return;
  bilgisayarZamanlayicisi = window.setTimeout(() => {
    if (seciliMod !== "bilgisayar" || aktifOyuncu !== "kiz" || oyunBittiMi || hamleKilitliMi) return;
    const dogruRenk = ZIT_RENKLER[aktifMikropRengi];
    const uygunButonlar = [...elemanlar.grid.querySelectorAll(".sabun")]
      .filter((buton) => sabunlar[Number(buton.dataset.indeks)] === dogruRenk);
    const secilenButon = uygunButonlar[rastgeleSayi(uygunButonlar.length)];
    if (secilenButon) sabunaBas(Number(secilenButon.dataset.indeks), secilenButon, true);
  }, OTOMATIK_HAMLE_GECIKMESI_MS);
}

function otomatikOynatmayiDurdur() {
  otomatikOynuyorMu = false;
  window.clearTimeout(otomatikZamanlayici);
  window.clearTimeout(bilgisayarZamanlayicisi);
  elemanlar.otomatikOyna.textContent = "▶ Otomatik Oyna";
  elemanlar.otomatikOyna.classList.remove("calisiiyor");
}

function otomatikOynatmayiBaslat() {
  // Her otomatik ölçüm temiz skor ve tam süreyle başlar.
  oyunuSifirla();
  otomatikOynuyorMu = true;
  otomatikTestBaslangici = performance.now();
  otomatikHamleSayisi = 0;
  elemanlar.testDurumu.textContent = "Test başladı";
  elemanlar.otomatikOyna.textContent = "■ Testi Durdur";
  elemanlar.otomatikOyna.classList.add("calisiiyor");
  otomatikHamleyiPlanla();
}

function sureyiCiz() {
  if (oyunBittiMi) return;
  const kalanMilisaniye = Math.max(0, oyunBitisZamani - Date.now());
  const kalanToplamSaniye = Math.ceil(kalanMilisaniye / 1000);
  const dakika = Math.floor(kalanToplamSaniye / 60);
  const saniye = kalanToplamSaniye % 60;
  elemanlar.sureGostergesi.textContent = `${String(dakika).padStart(2, "0")}:${String(saniye).padStart(2, "0")}`;
  elemanlar.sureGostergesi.classList.toggle("azaldi", kalanToplamSaniye <= 30);

  if (kalanMilisaniye <= 0) {
    const kazanan = erkekSkor === kizSkor ? null : (erkekSkor > kizSkor ? "erkek" : "kiz");
    const baslik = kazanan ? `${oyuncununKarakterAdi(kazanan)} kazandı!` : "Süre doldu!";
    oyunuBitir(kazanan, baslik, `${OYUN_MODLARI[seciliMod].ad} süresi tamamlandı. Skor ${erkekSkor}–${kizSkor}.`);
  }
}

function oyunSayaciniBaslat() {
  window.clearInterval(sureZamanlayicisi);
  oyunBitisZamani = Date.now() + OYUN_MODLARI[seciliMod].sureSaniye * 1000;
  sureyiCiz();
  sureZamanlayicisi = window.setInterval(sureyiCiz, 250);
}

function oyunuSifirla() {
  if (!seciliMod || !secilenKarakterler.oyuncu1 || !secilenKarakterler.oyuncu2) return;
  anaMenuMuziginiDurdur();
  oyunMuziginiBaslat();
  window.clearTimeout(turZamanlayicisi);
  window.clearTimeout(turKilidiZamanlayicisi);
  window.clearTimeout(otomatikZamanlayici);
  window.clearTimeout(bilgisayarZamanlayicisi);
  window.clearInterval(sureZamanlayicisi);
  otomatikOynatmayiDurdur();
  aktifOyuncu = "erkek";
  erkekSkor = 0;
  kizSkor = 0;
  aktifMikropRengi = "";
  sabunlar = [];
  gizliSpreyKonumlari = new Set();
  oyunBittiMi = false;
  hamleKilitliMi = false;
  elemanlar.sonucPerdesi.hidden = true;
  elemanlar.modPerdesi.hidden = true;
  elemanlar.testDurumu.textContent = "";
  oyunSayaciniBaslat();
  yeniTurBaslat();
}

function karakterListesiniCiz() {
  const secilmisIdler = new Set([
    secilenKarakterler.oyuncu1?.id,
    secilenKarakterler.oyuncu2?.id
  ].filter(Boolean));
  elemanlar.karakterListesi.replaceChildren();

  KARAKTERLER.forEach((karakter) => {
    const buton = document.createElement("button");
    buton.type = "button";
    buton.className = "karakter-secim-butonu";
    buton.dataset.karakterId = karakter.id;
    if (secilmisIdler.has(karakter.id)) {
      buton.classList.add("secilmis");
      const oyuncuNo = karakter.id === secilenKarakterler.oyuncu1?.id ? 1 : 2;
      buton.setAttribute("aria-label", `${karakter.ad}, Oyuncu ${oyuncuNo} tarafından seçildi. Seçimi kaldırmak için dokun.`);
    }

    const gorsel = document.createElement("img");
    gorsel.src = karakter.secim;
    gorsel.alt = karakter.ad;
    gorsel.draggable = false;

    const ad = document.createElement("span");
    ad.textContent = karakter.ad;
    buton.append(gorsel, ad);
    elemanlar.karakterListesi.append(buton);
  });
}

function karakterSeciminiAc() {
  karakterSecimSirasi = 1;
  secilenKarakterler = { oyuncu1: null, oyuncu2: null };
  elemanlar.modPerdesi.hidden = true;
  elemanlar.karakterSecimBaslik.textContent = seciliMod === "bilgisayar" ? "KARAKTERİNİ SEÇ" : "OYUNCU 1 KARAKTERİNİ SEÇ";
  elemanlar.karakterSecimAciklama.textContent = seciliMod === "bilgisayar"
    ? "Bilgisayara karşı kullanmak istediğin karaktere dokun."
    : "Altı karakterden oyun boyunca kullanmak istediğin karaktere dokun.";
  elemanlar.karakterOyunaGec.hidden = true;
  karakterListesiniCiz();
  elemanlar.karakterSecimPerdesi.hidden = false;
}

function karakterSec(karakterId) {
  const karakter = KARAKTERLER.find((aday) => aday.id === karakterId);
  if (!karakter) return;

  if (karakter.id === secilenKarakterler.oyuncu1?.id) {
    secilenKarakterler.oyuncu1 = null;
    if (seciliMod === "bilgisayar") secilenKarakterler.oyuncu2 = null;
    karakterSecimSirasi = 1;
    elemanlar.karakterSecimBaslik.innerHTML = "OYUNCU 1<br>KARAKTERİNİ SEÇ";
    elemanlar.karakterSecimAciklama.textContent = "";
    elemanlar.karakterOyunaGec.hidden = true;
    karakterListesiniCiz();
    return;
  }

  if (karakter.id === secilenKarakterler.oyuncu2?.id) {
    if (seciliMod === "bilgisayar") return;
    secilenKarakterler.oyuncu2 = null;
    karakterSecimSirasi = secilenKarakterler.oyuncu1 ? 2 : 1;
    elemanlar.karakterSecimBaslik.innerHTML = karakterSecimSirasi === 2
      ? "OYUNCU 2<br>KARAKTERİNİ SEÇ"
      : "OYUNCU 1<br>KARAKTERİNİ SEÇ";
    elemanlar.karakterSecimAciklama.textContent = "";
    elemanlar.karakterOyunaGec.hidden = true;
    karakterListesiniCiz();
    return;
  }

  if (karakterSecimSirasi === 0) return;

  if (karakterSecimSirasi === 1) {
    secilenKarakterler.oyuncu1 = karakter;
    if (seciliMod === "bilgisayar") {
      secilenKarakterler.oyuncu2 = ROBOT_KARAKTER;
      karakterSecimSirasi = 0;
      elemanlar.oyuncu1Karakter.src = secilenKarakterler.oyuncu1.oyun;
      elemanlar.oyuncu1Karakter.dataset.karakterId = secilenKarakterler.oyuncu1.id;
      elemanlar.oyuncu1Karakter.alt = `${secilenKarakterler.oyuncu1.ad} — Oyuncu`;
      elemanlar.oyuncu2Karakter.src = secilenKarakterler.oyuncu2.oyun;
      elemanlar.oyuncu2Karakter.dataset.karakterId = secilenKarakterler.oyuncu2.id;
      elemanlar.oyuncu2Karakter.alt = `${secilenKarakterler.oyuncu2.ad} — Bilgisayar`;
      elemanlar.karakterSecimBaslik.textContent = "KARAKTER HAZIR!";
      elemanlar.karakterSecimAciklama.textContent = "Rakibin Robot hazır!";
      karakterListesiniCiz();
      elemanlar.karakterOyunaGec.hidden = false;
      return;
    }
    if (secilenKarakterler.oyuncu2) {
      karakterSecimSirasi = 0;
      elemanlar.karakterSecimBaslik.textContent = "KARAKTERLER HAZIR!";
      elemanlar.karakterSecimAciklama.textContent = "Seçimlerinizi kontrol edin ve oyuna geçin.";
      elemanlar.karakterOyunaGec.hidden = false;
      karakterListesiniCiz();
      return;
    }
    karakterSecimSirasi = 2;
    elemanlar.karakterSecimBaslik.innerHTML = "OYUNCU 2<br>KARAKTERİNİ SEÇ";
    elemanlar.karakterSecimAciklama.textContent = "";
    karakterListesiniCiz();
    return;
  }

  secilenKarakterler.oyuncu2 = karakter;
  karakterSecimSirasi = 0;
  elemanlar.oyuncu1Karakter.src = secilenKarakterler.oyuncu1.oyun;
  elemanlar.oyuncu1Karakter.dataset.karakterId = secilenKarakterler.oyuncu1.id;
  elemanlar.oyuncu1Karakter.alt = `${secilenKarakterler.oyuncu1.ad} — Oyuncu 1`;
  elemanlar.oyuncu2Karakter.src = secilenKarakterler.oyuncu2.oyun;
  elemanlar.oyuncu2Karakter.dataset.karakterId = secilenKarakterler.oyuncu2.id;
  elemanlar.oyuncu2Karakter.alt = `${secilenKarakterler.oyuncu2.ad} — Oyuncu 2`;
  elemanlar.karakterSecimBaslik.textContent = "KARAKTERLER HAZIR!";
  elemanlar.karakterSecimAciklama.textContent = "Seçimlerinizi kontrol edin ve oyuna geçin.";
  karakterListesiniCiz();
  elemanlar.karakterOyunaGec.hidden = false;
}

function modSec(mod) {
  if (!OYUN_MODLARI[mod]) return;
  seciliMod = mod;
  karakterSeciminiAc();
}

function modSeciminiAc() {
  oyunMuziginiDurdur();
  window.clearTimeout(turZamanlayicisi);
  window.clearTimeout(otomatikZamanlayici);
  window.clearInterval(sureZamanlayicisi);
  otomatikOynatmayiDurdur();
  oyunBittiMi = true;
  seciliMod = null;
  elemanlar.sonucPerdesi.hidden = true;
  elemanlar.modPerdesi.hidden = false;
  elemanlar.sureGostergesi.textContent = "--:--";
  anaMenuMuziginiBaslat();
}

elemanlar.grid.addEventListener("pointerup", (olay) => {
  const buton = olay.target.closest(".sabun");
  if (!buton) return;
  olay.preventDefault();
  sabunaBas(Number.parseInt(buton.dataset.indeks, 10), buton);
});

elemanlar.yenidenBaslat.addEventListener("pointerup", (olay) => {
  olay.preventDefault();
  oyunuSifirla();
});

elemanlar.modSecimineDon.addEventListener("pointerup", (olay) => {
  olay.preventDefault();
  modSeciminiAc();
});

elemanlar.anaMenuyeDon.addEventListener("pointerup", (olay) => {
  olay.preventDefault();
  elemanlar.sonucPerdesi.hidden = true;
  anaMenuyuGoster();
});

elemanlar.kaybetmeAnaMenu.addEventListener("pointerup", (olay) => {
  olay.preventDefault();
  anaMenuyuGoster();
});

elemanlar.modGeri.addEventListener("pointerup", (olay) => {
  olay.preventDefault();
  elemanlar.modPerdesi.hidden = true;
  anaMenuyuGoster();
});

elemanlar.modPerdesi.addEventListener("pointerup", (olay) => {
  const buton = olay.target.closest("[data-mod]");
  if (!buton) return;
  olay.preventDefault();
  butonTikSesi.currentTime = 0;
  butonTikSesi.play().catch(() => {});
  window.setTimeout(() => modSec(buton.dataset.mod), buton.dataset.basilmis ? MENU_BUTON_GECIKMESI_MS : 0);
});

elemanlar.karakterListesi.addEventListener("pointerup", (olay) => {
  const buton = olay.target.closest("[data-karakter-id]");
  if (!buton) return;
  olay.preventDefault();
  karakterSec(buton.dataset.karakterId);
});

elemanlar.karakterSecimGeri.addEventListener("pointerup", (olay) => {
  olay.preventDefault();
  elemanlar.karakterSecimPerdesi.hidden = true;
  modSeciminiAc();
});

elemanlar.karakterOyunaGec.addEventListener("pointerup", (olay) => {
  olay.preventDefault();
  if (!secilenKarakterler.oyuncu1 || !secilenKarakterler.oyuncu2) return;
  elemanlar.karakterOyunaGec.hidden = true;
  elemanlar.karakterSecimPerdesi.hidden = true;
  oyunuSifirla();
});

elemanlar.otomatikOyna.addEventListener("pointerup", (olay) => {
  olay.preventDefault();
  if (otomatikOynuyorMu) otomatikOynatmayiDurdur();
  else otomatikOynatmayiBaslat();
});

elemanlar.oyunAnaMenu.addEventListener("pointerup", (olay) => {
  olay.preventDefault();
  oyunBittiMi = true;
  hamleKilitliMi = true;
  window.clearTimeout(turZamanlayicisi);
  window.clearTimeout(otomatikZamanlayici);
  window.clearTimeout(bilgisayarZamanlayicisi);
  window.clearInterval(sureZamanlayicisi);
  otomatikOynatmayiDurdur();
  elemanlar.sonucPerdesi.hidden = true;
  anaMenuyuGoster();
});

elemanlar.oyunModEkrani.addEventListener("pointerup", (olay) => {
  olay.preventDefault();
  modSeciminiAc();
});

oyunBittiMi = true;
elemanlar.modPerdesi.hidden = true;
elemanlar.karakterSecimPerdesi.hidden = true;
elemanlar.sonucPerdesi.hidden = true;
elemanlar.sureGostergesi.textContent = "--:--";
