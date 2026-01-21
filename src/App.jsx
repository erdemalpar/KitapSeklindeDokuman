
import React, { useState, useEffect } from 'react';
import { Book, ChevronLeft, ChevronRight, Globe, Layers, Database, Map, Server, Sparkles, PenTool, Code, Info, Landmark, FileText, Building2, Flag, FileCode, Settings, Search, Cpu, Share2, Ruler, Lock, Radio, Box, FileSpreadsheet, Image as ImageIcon, MapPin, Library } from 'lucide-react';
import { tkgmBookData } from './data/tkgmBookData';

const BookWebsite = () => {
  const [activeBook, setActiveBook] = useState(null); // null (Library), 'ogc', 'tkgm'
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Gemini State'leri
  const [magicInput, setMagicInput] = useState('');
  const [magicOutput, setMagicOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const apiKey = "";

  // Responsive kontrolü
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Gemini API Çağrısı
  const generateDiaryEntry = async () => {
    if (!magicInput.trim()) return;
    setIsGenerating(true);
    setMagicOutput("");

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Sen Tapu ve Kadastro Genel Müdürlüğü (TKGM) Bilgi Teknolojileri Dairesi'nde çalışan uzman bir CBS mühendisisin. Kullanıcının OGC standartları (WMS, WFS, GML vb.) veya TKGM servisleri hakkındaki teknik sorusunu yanıtla. Cevap resmi, eğitici ve teknik açıdan detaylı olsun (Gerekirse XML/JSON snippet ver). Türkçe cevapla. Soru: "${magicInput}"`
              }]
            }]
          })
        }
      );
      const data = await response.json();
      setMagicOutput(data.candidates?.[0]?.content?.parts?.[0]?.text || "Servis yanıt vermedi.");
    } catch (error) {
      console.error(error);
      setMagicOutput("Bağlantı hatası.");
    } finally {
      setIsGenerating(false);
    }
  };

  // OGC Kitabı Verileri
  const ogcBookPages = [
    // SAYFA 0: KAPAK
    {
      id: 0,
      type: 'cover',
      front: {
        title: "OGC TEKNİK REHBERİ",
        subtitle: "Mekansal Veri Standartları ve Servisler",
        author: "TKGM Bilgi Teknolojileri Dairesi Bşk.",
        color: "bg-[#1e3a8a]"
      },
      back: {
        content: "Bu doküman, ISO 19100 serisi ve OGC (Open Geospatial Consortium) standartlarına uygun olarak, kurum içi ve kurumlar arası coğrafi veri paylaşımının teknik detaylarını içerir.",
        quote: "Standartlar, verinin evrensel dilidir."
      }
    },
    // SAYFA 1: Giriş ve Temel Kavramlar (A-C)
    {
      id: 1,
      type: 'content',
      tabGroup: 0,
      front: {
        title: "Interoperability (Birlikte Çalışabilirlik)",
        text: "Farklı coğrafi bilgi sistemlerinin (CBS), yazılımların ve cihazların veri kaybı olmadan birbirleriyle iletişim kurabilme yeteneğidir. OGC standartlarının temel amacı budur.",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000",
        caption: "Küresel Birlikte Çalışabilirlik Ağı"
      },
      back: {
        title: "OGC Hakkında",
        text: "Open Geospatial Consortium (OGC), 500'den fazla kurumun (NASA, Google, TKGM vb.) katılımıyla mekansal veri standartlarını belirleyen uluslararası bir kuruluştur.",
        items: [
          "Amaç: Mekansal veriyi 'FAIR' (Findable, Accessible, Interoperable, Reusable) yapmaktır.",
          "Kapsam: Sensörlerden haritalara, 3B modellerden veri işlemeye kadar geniş bir yelpaze."
        ]
      }
    },
    // SAYFA 2: WMS & WMTS (Haritalama Servisleri) (Ç-E)
    {
      id: 2,
      type: 'content',
      tabGroup: 1,
      front: {
        title: "WMS (Web Map Service)",
        text: "Coğrafi verilerin 'resim' (PNG, JPEG) formatında sunulmasını sağlayan standarttır. Veri analiz edilemez, sadece altlık görüntü olarak kullanılır. Dinamiktir, her istekte sunucu görüntüyü yeniden oluşturur.",
        image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000",
        caption: "WMS Katmanları ve Lejant"
      },
      back: {
        title: "WMTS (Web Map Tile Service)",
        text: "Haritaların önceden oluşturulmuş küçük kareler (tile) halinde sunulmasını sağlar. WMS'e göre çok daha hızlıdır çünkü görüntüler önbellekten (cache) gelir. Google Maps mantığıyla çalışır.",
        services: [
          { title: "Performans", desc: "WMTS statik olduğu için WMS'ten çok daha hızlıdır." },
          { title: "Yapı", desc: "Piramit yapısı (Zoom Level 0-20) kullanır." }
        ],
        isCode: true,
        codeTitle: "WMTS URL Yapısı",
        code: `http://tkgm.gov.tr/wmts?
SERVICE=WMTS
&REQUEST=GetTile
&VERSION=1.0.0
&LAYER=ortofoto
&STYLE=default
&TILEMATRIXSET=EPSG:3857
&TILEMATRIX=12
&TILEROW=1543
&TILECOL=2341`
      }
    },
    // SAYFA 3: WFS (Vektör Veri Servisleri) (F-H)
    {
      id: 3,
      type: 'content',
      tabGroup: 2,
      front: {
        title: "WFS (Web Feature Service)",
        text: "Vektör veriye (nokta, çizgi, poligon) doğrudan erişim sağlayan servistir. Kullanıcı veriyi ham formatta (GML, JSON) indirip kendi bilgisayarında analiz edebilir, stilini değiştirebilir.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
        caption: "Vektör Geometri Analizi"
      },
      back: {
        title: "WFS-T & Filtreleme",
        text: "WFS-T (Transactional), kullanıcıların web üzerinden veri eklemesine, silmesine veya güncellemesine olanak tanır. CQL (Common Query Language) ile detaylı sorgular yapılabilir.",
        items: [
          "GetCapabilities: Servis yetenekleri.",
          "DescribeFeatureType: Veri şeması (XSD).",
          "GetFeature: Veriyi indirme.",
          "Transaction: Veri düzenleme (Insert, Update, Delete)."
        ]
      }
    },
    // SAYFA 4: WCS & GML (Kapsama ve Kodlama) (I-J)
    {
      id: 4,
      type: 'content',
      tabGroup: 3,
      front: {
        title: "WCS (Web Coverage Service)",
        text: "Raster verilerin (uydu görüntüleri, DEM, sıcaklık haritaları) 'ham veri değerleri' ile sunulmasını sağlar. WMS gibi resim değil, her pikselin sayısal değerini (örn: yükseklik 1054m) döndürür.",
        image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1000",
        caption: "Dijital Yükseklik Modeli (DEM)"
      },
      back: {
        title: "GML (Geography Markup Language)",
        text: "OGC'nin temel veri değişim formatıdır. XML tabanlıdır. Mekansal özellikleri ve geometrileri tanımlamak için kullanılır.",
        isCode: true,
        codeTitle: "GML Nokta Örneği",
        code: `<gml:Point gml:id="p21" srsName="urn:ogc:def:crs:EPSG::4326">
  <gml:pos>45.234 32.123</gml:pos>
</gml:Point>
<!-- Karmaşık Özellik -->
<gml:featureMember>
  <tkgm:Parsel>
    <tkgm:alan>1250.45</tkgm:alan>
  </tkgm:Parsel>
</gml:featureMember>`
      }
    },
    // SAYFA 5: WPS & WCTS (İşlem ve Dönüşüm) (K-M)
    {
      id: 5,
      type: 'content',
      tabGroup: 4,
      front: {
        title: "WPS (Web Processing Service)",
        text: "Coğrafi analiz ve işlem fonksiyonlarını web üzerinden sunar. İstemci sadece veriyi gönderir, sunucu işlemi yapar (örn: Buffer, Kesişim, Rota Hesabı) ve sonucu döndürür.",
        image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=1000",
        caption: "Uzaktan Sunucu İşlemleri"
      },
      back: {
        title: "WCTS (Coord. Transformation)",
        text: "Farklı koordinat sistemleri arasında dönüşüm yapan servistir. Örneğin; ED50 (EPSG:23035) koordinatlarını ITRF96 (EPSG:5254) sistemine dönüştürmek için kullanılır.",
        services: [
          { title: "Dönüşüm", desc: "Projeksiyonlar arası matematiksel dönüşüm." },
          { title: "Doğruluk", desc: "Grid shift (gsb) dosyaları ile yüksek hassasiyet." }
        ]
      }
    },
    // SAYFA 6: CSW & TJS (Katalog ve Tablo) (N-Ö)
    {
      id: 6,
      type: 'content',
      tabGroup: 5,
      front: {
        title: "CSW (Catalogue Service for Web)",
        text: "Mekansal veri ve servislerin metadata (üst veri) bilgilerini yayınlamak ve aramak için kullanılır. 'Hangi kurumda, hangi veri var?' sorusunun cevabıdır.",
        services: [
          { title: "Metadata", desc: "ISO 19115 (Veri) ve ISO 19119 (Servis) standartları." },
          { title: "Sorgu", desc: "Anahtar kelime, tarih ve konuma göre arama." }
        ],
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000",
        caption: "Dijital Veri Kütüphanesi"
      },
      back: {
        title: "TJS (Table Joining Service)",
        text: "Konumsal olmayan tablo verilerini (örn: Nüfus, Vergi), ortak bir anahtar (örn: İl Kodu) üzerinden konumsal veriyle birleştirip haritalayan servistir.",
        items: [
          "Veri Zenginleştirme: Excel tablolarını haritaya dönüştürür.",
          "Dinamik: Veri kaynağı güncellendiğinde harita da güncellenir."
        ]
      }
    },
    // SAYFA 7: Sensörler ve Konum (SOS, SPS, OLS) (P-S)
    {
      id: 7,
      type: 'content',
      tabGroup: 6,
      front: {
        title: "SOS & SPS (Sensör Servisleri)",
        text: "Sensor Web Enablement (SWE) grubundadırlar. SOS (Sensor Observation Service) gerçek zamanlı ölçümleri (sıcaklık, su seviyesi) sunar. SPS (Sensor Planning Service) ise sensörlere görev atar (örn: Uyduya fotoğraf çek emri ver).",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000",
        caption: "IoT ve Nesnelerin İnterneti"
      },
      back: {
        title: "OLS (Open Location Services)",
        text: "Konum tabanlı hizmetler için standarttır. En bilinen bileşenleri:",
        items: [
          "Geocoding: Adresi koordinata çevirme.",
          "Reverse Geocoding: Koordinatı adrese çevirme.",
          "Routing: En kısa yol tarifi.",
          "Directory: Sarı sayfalar benzeri mekan arama."
        ]
      }
    },
    // SAYFA 8: GeoPackage & KML (Depolama & Sunum) (Ş-U)
    {
      id: 8,
      type: 'content',
      tabGroup: 7,
      front: {
        title: "GeoPackage (.gpkg)",
        text: "Shapefile'ın modern alternatifidir. SQLite tabanlıdır. Tek bir dosya içinde hem vektör, hem raster, hem de tile verilerini saklayabilir. Mobil cihazlar için optimize edilmiştir.",
        // isCustom: true,
        customContent: (
          <div className="w-full h-40 flex items-center justify-center p-2 mb-4 bg-slate-50 border-2 border-slate-200 rounded-lg relative overflow-hidden group">
            {/* Database Container */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-32 h-24 bg-blue-900 rounded-xl shadow-xl flex items-center justify-center relative border-b-8 border-blue-950">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded shadow">SQLite</span>
                <Database className="text-white w-12 h-12" />
              </div>
            </div>

            {/* Katmanlar - Animasyonlu */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -ml-8 flex flex-col gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded shadow border border-slate-200"><MapPin size={10} className="text-red-500" /> Vektör</div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded shadow border border-slate-200"><ImageIcon size={10} className="text-green-500" /> Raster</div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded shadow border border-slate-200"><Layers size={10} className="text-blue-500" /> Tile</div>
            </div>

            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 flex flex-col items-center justify-center -mr-6">
              <div className="text-[10px] font-bold text-slate-400 mb-1">TEK DOSYA</div>
              <FileSpreadsheet size={32} className="text-emerald-600" />
              <span className="text-[9px] font-mono text-emerald-800 font-bold bg-emerald-100 px-1 rounded mt-1">.gpkg</span>
            </div>

            {/* Oklar */}
            <div className="absolute w-full h-full pointer-events-none flex items-center justify-center">
              <div className="border-t-2 border-dashed border-slate-300 w-3/4 absolute top-1/2"></div>
            </div>
          </div>
        ),
        caption: "Modern Veri Konteyneri: Hepsi Bir Arada"
      },
      back: {
        title: "KML (Keyhole Markup Language)",
        text: "Google Earth tarafından popüler hale getirilen, XML tabanlı bir sunum formatıdır. Verinin sadece geometrisini değil, kamera açısını, stilini ve etiketlerini de içerir.",
        isCode: true,
        codeTitle: "KML Yer İmi",
        code: `<Placemark>
  <name>TKGM Genel Müd.</name>
  <description>Ankara</description>
  <Point>
    <coordinates>32.85,39.92,0</coordinates>
  </Point>
</Placemark>`
      }
    },
    // SAYFA 9: Gelecek ve API'lar (Ü-Y)
    {
      id: 9,
      type: 'content',
      tabGroup: 8,
      front: {
        title: "OGC API Ailesi (Yeni Nesil)",
        text: "Modern web geliştirme (REST/JSON) prensiplerine uygun yeni standartlar. Ağır XML yükleri yerine hafif JSON yapıları kullanır. OpenAPI (Swagger) ile tam uyumludur.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000",
        caption: "API Tabanlı Entegrasyon"
      },
      back: {
        title: "OGC API vs Klasik Servisler",
        items: [
          "WFS -> OGC API - Features",
          "WMS/WMTS -> OGC API - Tiles",
          "WCS -> OGC API - Coverages",
          "WPS -> OGC API - Processes"
        ],
        text: "Geliştiriciler için öğrenmesi ve kullanımı çok daha kolaydır."
      }
    },
    // SAYFA 10: Gemini Sayfası (Z-W)
    {
      id: 10,
      type: 'magic',
      front: {
        title: "OGC Asistanı",
        desc: "Standartlar karmaşık mı geldi? WMS parametrelerini unuttunuz mu? Yapay zeka uzmanımıza sorun."
      },
      back: {
        title: "Uzman Yanıtı",
        placeholder: "Soru bekleniyor..."
      }
    },
    // SAYFA 11: Arka Kapak
    {
      id: 11,
      type: 'cover',
      front: {
        title: "TKGM",
        subtitle: "177. Yıl",
        color: "bg-[#8B0000]"
      },
      back: {
        color: "bg-[#1e3a8a]",
        logo: true
      }
    }
  ];

  // Aktif kitaba göre sayfaları belirle
  const pages = activeBook === 'tkgm' ? tkgmBookData : ogcBookPages;
  const totalPages = pages.length;

  // Sayfa navigasyonu
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const jumpToPage = (index) => {
    setCurrentPage(index);
  };

  // OGC için alfabe haritası (Sadece OGC kitabında geçerli)
  const alphabetMap = activeBook === 'ogc' ? [
    { letters: ["A", "B", "C"], pageIndex: 1 },
    { letters: ["Ç", "D", "E"], pageIndex: 2 },
    { letters: ["F", "G", "H"], pageIndex: 3 },
    { letters: ["I", "İ", "J"], pageIndex: 4 },
    { letters: ["K", "L", "M"], pageIndex: 5 },
    { letters: ["N", "O", "Ö"], pageIndex: 6 },
    { letters: ["P", "R", "S"], pageIndex: 7 },
    { letters: ["Ş", "T", "U"], pageIndex: 8 },
    { letters: ["Ü", "V", "Y"], pageIndex: 9 },
    { letters: ["Z"], pageIndex: 10 },
    { letters: ["W"], pageIndex: 10, highlight: true }
  ] : [];

  // --------------------------------------------------------------------------------
  // KÜTÜPHANE GÖRÜNÜMÜ (Kitap Seçimi)
  // --------------------------------------------------------------------------------
  if (!activeBook) {
    return (
      <div className="h-screen bg-slate-900 flex flex-col items-center justify-center p-8 font-sans overflow-hidden">
        {/* Arka Plan Efekti */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black"></div>

        <div className="z-10 text-center mb-16">
          <h1 className="text-4xl md:text-6xl text-white font-serif mb-4 flex items-center justify-center gap-4 tracking-tight">
            <Library size={48} className="text-yellow-500" />
            <span>TKGM Dijital Kütüphane</span>
          </h1>
          <p className="text-slate-400 text-lg">Kurumsal Dokümantasyon ve Raporlar</p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 perspective-1000 z-10 w-full max-w-4xl justify-center items-center">

          {/* OGC Kitap Kartı */}
          <div
            onClick={() => { setActiveBook('ogc'); setCurrentPage(0); }}
            className="group relative w-64 h-96 cursor-pointer transform transition-all duration-500 hover:-translate-y-4 hover:rotate-y-12"
            style={{ perspective: '1000px' }}
          >
            <div className="absolute inset-0 bg-blue-900 rounded-lg shadow-2xl border-l-4 border-l-white/10 border-r-8 border-r-black/40 flex flex-col items-center justify-center p-6 text-center transform transition-transform group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/10 via-transparent to-black/30 rounded-lg pointer-events-none"></div>

              <Landmark size={56} className="text-white mb-6 opacity-90" />
              <h2 className="text-2xl font-bold text-white font-serif leading-tight mb-2">OGC TEKNİK REHBERİ</h2>
              <div className="w-12 h-1 bg-yellow-500 mx-auto my-4 rounded-full"></div>
              <p className="text-blue-200 text-xs uppercase tracking-wider font-semibold">Mekansal Standartlar</p>

              <div className="absolute bottom-4 text-[10px] text-blue-300 font-mono">2025 Sürümü</div>
            </div>
            {/* Kitap Sırtı Efekti */}
            <div className="absolute left-0 top-1 bottom-1 w-2 bg-blue-950 rounded-l blur-[1px]"></div>
          </div>

          {/* TKGM Faaliyet Kitap Kartı */}
          <div
            onClick={() => { setActiveBook('tkgm'); setCurrentPage(0); }}
            className="group relative w-64 h-96 cursor-pointer transform transition-all duration-500 hover:-translate-y-4 hover:rotate-y-12"
            style={{ perspective: '1000px' }}
          >
            <div className="absolute inset-0 bg-[#8B0000] rounded-lg shadow-2xl border-l-4 border-l-white/10 border-r-8 border-r-black/40 flex flex-col items-center justify-center p-6 text-center transform transition-transform group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/10 via-transparent to-black/30 rounded-lg pointer-events-none"></div>

              <Building2 size={56} className="text-white mb-6 opacity-90" />
              <h2 className="text-2xl font-bold text-white font-serif leading-tight mb-2">TKGM PROJELERİ</h2>
              <div className="w-12 h-1 bg-yellow-500 mx-auto my-4 rounded-full"></div>
              <p className="text-red-200 text-xs uppercase tracking-wider font-semibold">2025-2026 Vizyonu</p>

              <div className="absolute bottom-4 text-[10px] text-red-300 font-mono">Stratejik Plan</div>
            </div>
            {/* Kitap Sırtı Efekti */}
            <div className="absolute left-0 top-1 bottom-1 w-2 bg-red-950 rounded-l blur-[1px]"></div>
          </div>

        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------------
  // KİTAP OKUYUCU GÖRÜNÜMÜ
  // --------------------------------------------------------------------------------
  return (
    <div className="h-screen bg-slate-200 flex flex-col items-center justify-center p-2 overflow-hidden font-sans relative">

      {/* Geri Dön Butonu */}
      <button
        onClick={() => setActiveBook(null)}
        className="absolute top-4 left-4 z-50 bg-white p-3 rounded-full shadow-lg text-slate-700 hover:text-[#1e3a8a] hover:scale-110 transition-all border border-slate-200 group"
        title="Kütüphaneye Dön"
      >
        <Library size={24} />
      </button>

      {/* Arka Plan */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,#000_0,#000_1px,transparent_0,transparent_50%)] bg-[length:10px_10px]"></div>
      </div>

      <div className="mb-2 z-10 text-center relative shrink-0">
        <h1 className="text-xl md:text-2xl font-bold text-[#1e3a8a] flex items-center justify-center gap-3 uppercase tracking-wide">
          <Building2 className="w-6 h-6 md:w-8 md:h-8 text-red-700" /> Tapu ve Kadastro Genel Müdürlüğü
        </h1>
        <div className="w-1/2 h-1 bg-red-600 mx-auto my-1 rounded-full"></div>
        <p className="text-slate-600 text-[10px] md:text-xs font-semibold">BİLGİ TEKNOLOJİLERİ DAİRESİ BAŞKANLIĞI</p>
      </div>

      {/* Kitap Container */}
      <div
        className="relative perspective-2000 transition-all duration-500 ease-in-out shrink-0"
        style={{
          width: isMobile ? '90vw' : 'min(90vw, 120vh)',
          height: isMobile ? '70vh' : '80vh',
          perspective: '2500px'
        }}
      >
        {/* Sayfalar */}
        <div className={`relative w-full h-full preserve-3d duration-1000 ${isMobile ? '' : 'flex justify-center'}`}>

          {pages.map((page, index) => {

            // Z-Index hesaplama
            let zIndex;
            if (index < currentPage) zIndex = index;
            else if (index === currentPage) zIndex = totalPages + 1;
            else zIndex = totalPages - index;

            const isFlipped = index < currentPage;

            return (
              <div
                key={page.id}
                onClick={() => {
                  if (page.type === 'magic' && currentPage === index) return; // Magic sayfasında click engelle
                  if (currentPage === index) nextPage();
                  else if (currentPage === index + 1) prevPage();
                }}
                className={`absolute top-0 transition-all duration-700 ease-in-out origin-left shadow-2xl rounded-r-xl ${isMobile ? 'w-full' : 'w-1/2 left-1/2'}`}
                style={{
                  height: '100%',
                  zIndex: zIndex,
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)',
                  cursor: (page.type === 'magic' && currentPage === index) ? 'default' : 'pointer'
                }}
              >
                {/* ÖN YÜZ */}
                <div
                  className={`absolute w-full h-full backface-hidden flex flex-col overflow-hidden border-l border-slate-300
                    ${page.type === 'cover' ? page.front.color + ' text-white border-2 border-[#1e3a8a] rounded-r-xl shadow-inner' : 'bg-[#fffaf0] text-slate-800 rounded-r-lg'}
                  `}
                  style={{ backfaceVisibility: 'hidden' }}
                >

                  {/* ALFABETİK FİHRİST (Sadece OGC kitabında) */}
                  {alphabetMap.length > 0 && index > 0 && index < pages.length - 1 && (
                    <div className="absolute right-0 top-0 h-full flex flex-col z-20 pointer-events-auto w-8 md:w-10">
                      {alphabetMap.map((group, i) => {
                        const itemHeight = 100 / alphabetMap.length;
                        const isW = group.highlight;

                        return (
                          <div
                            key={i}
                            onClick={(e) => {
                              e.stopPropagation();
                              jumpToPage(group.pageIndex);
                            }}
                            className={`
                              flex flex-col items-center justify-center border-b border-white/50 cursor-pointer shadow-md transition-all
                              ${isW ? 'bg-[#1e3a8a] text-white font-bold w-10 md:w-12 -mr-2 rounded-l' : 'bg-red-50 text-red-900 hover:bg-red-100'}
                            `}
                            style={{
                              height: `${itemHeight}%`,
                              fontSize: isMobile ? '8px' : '10px',
                            }}
                          >
                            {group.letters.map(l => (
                              <span key={l} className={l === "W" ? "text-sm md:text-base text-yellow-400" : ""}>{l}</span>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Magic Butonu (Sadece Magic sayfasında) */}
                  {page.type === 'magic' && (
                    <div
                      onClick={(e) => { e.stopPropagation(); jumpToPage(index); }}
                      className="absolute right-[-36px] top-1/2 -translate-y-1/2 flex items-center justify-center bg-[#1e3a8a] border border-blue-900 text-white hover:bg-blue-800 hover:w-14 transition-all cursor-pointer shadow-md rounded-r z-30"
                      style={{ width: '36px', height: '60px', pointerEvents: 'auto' }}
                    >
                      <Server size={20} />
                    </div>
                  )}

                  {/* İÇERİK - ÖN YÜZ */}
                  <div className={`p-6 md:p-8 h-full flex flex-col relative z-10 overflow-y-auto ${alphabetMap.length > 0 ? 'mr-8 md:mr-10' : ''}`}>
                    {page.type === 'cover' ? (
                      <div className="h-full flex flex-col items-center justify-center border-[6px] border-double border-yellow-500/30 rounded-lg p-4 relative">
                        {/* Kapak Tasarımı */}
                        <div className="w-24 h-24 mb-6 rounded-full bg-white flex items-center justify-center shadow-lg">
                          {activeBook === 'tkgm' ? <Building2 size={48} className="text-[#8B0000]" /> : <Landmark size={48} className="text-[#1e3a8a]" />}
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-center mb-2 font-serif text-white drop-shadow-md">{page.front.title}</h2>
                        <div className="h-1 w-24 bg-yellow-500 mb-6 rounded"></div>
                        <p className="text-blue-100 text-lg md:text-xl uppercase tracking-widest font-semibold text-center">{page.front.subtitle}</p>
                        <div className="mt-auto pt-6 border-t border-white/20 w-full text-center">
                          <p className="text-sm md:text-base font-medium text-blue-200 tracking-wider uppercase">{page.front.author}</p>
                        </div>
                      </div>
                    ) : page.type === 'magic' ? (
                      // ... Magic Page Content (Same as before) ...
                      <div className="flex flex-col h-full justify-center">
                        <div className="text-sm text-[#1e3a8a] font-bold mb-4 flex justify-between border-b-2 border-red-600 pb-2">
                          <span>TEKNİK DESTEK ASİSTANI</span>
                          <Server size={18} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-4 font-serif">Uzmanına Danışın</h2>
                        <p className="text-slate-600 text-base mb-8">TKGM servisleri, veri standartları ve entegrasyon protokolleri hakkında kurumsal yapay zeka asistanımızdan destek alabilirsiniz.</p>

                        <div className="bg-white p-2 shadow-inner border border-slate-300 rounded-sm mb-6 relative">
                          <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] px-2 py-0.5 font-bold uppercase">Sorgu Paneli</div>
                          <textarea
                            value={magicInput}
                            onChange={(e) => setMagicInput(e.target.value)}
                            placeholder="Örn: WFS 2.0 ile 1.1.0 arasındaki farklar nelerdir? GML validasyonu nasıl yapılır?"
                            className="w-full h-40 p-4 mt-4 text-base bg-transparent outline-none resize-none text-slate-800 font-mono leading-relaxed"
                          />
                        </div>

                        <button
                          onClick={generateDiaryEntry}
                          disabled={isGenerating || !magicInput.trim()}
                          className="group relative w-full py-4 bg-[#1e3a8a] text-white hover:bg-blue-900 disabled:bg-slate-400 disabled:cursor-not-allowed rounded-sm shadow-md transition-all overflow-hidden text-lg font-bold uppercase tracking-wider"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            {isGenerating ? <><Sparkles className="animate-spin" size={20} /> Sorgulanıyor...</> : <><PenTool size={20} /> Gönder</>}
                          </span>
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="text-xs md:text-sm text-slate-500 font-bold mb-4 flex justify-between border-b-2 border-[#1e3a8a] pb-2 items-center">
                          <span className="uppercase tracking-widest text-[#1e3a8a] flex items-center gap-2">
                            <FileText size={14} /> BÖLÜM {index}
                          </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 font-serif">{page.front.title}</h2>

                        {page.front.image && !page.front.customContent && (
                          <div className="mb-4 p-1 border-2 border-slate-300 shadow-md bg-white w-full mx-auto transform -rotate-1">
                            <img src={page.front.image} alt="Content" className="w-full h-40 object-cover grayscale-[20%]" />
                            <p className="text-xs md:text-xs text-center text-slate-500 mt-1 flex items-center justify-center gap-1 font-mono">
                              <Info size={10} /> ŞEKİL {index}.1: {page.front.caption}
                            </p>
                          </div>
                        )}

                        {page.front.customContent && (
                          <div className="mb-4 w-full mx-auto">
                            {page.front.customContent}
                            <p className="text-xs md:text-xs text-center text-slate-500 mt-1 flex items-center justify-center gap-1 font-mono">
                              <Info size={10} /> ŞEKİL {index}.1: {page.front.caption}
                            </p>
                          </div>
                        )}

                        {page.front.text && <p className="text-slate-700 leading-relaxed text-sm md:text-base text-justify font-normal">{page.front.text}</p>}

                        {/* List Items on Front Page (New Feature) */}
                        {page.front.items && (
                          <ul className="space-y-2 mt-4">
                            {page.front.items.map((item, i) => (
                              <li key={i} className="text-sm md:text-base text-slate-700 flex items-start gap-3">
                                <div className="mt-1.5 w-1.5 h-1.5 bg-[#1e3a8a] shrink-0 rounded-full"></div>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {page.front.services && (
                          <div className="space-y-3 mt-4">
                            {page.front.services.map((s, i) => (
                              <div key={i} className="p-3 bg-white rounded border-l-4 border-[#1e3a8a] shadow-sm hover:shadow-md transition-all">
                                <h4 className="font-bold text-[#1e3a8a] text-sm md:text-base flex items-center gap-2">
                                  <Map size={14} />
                                  {s.title}
                                </h4>
                                <p className="text-xs md:text-sm text-slate-600 mt-1 pl-6">{s.desc}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Sayfa Numarası */}
                        <div className="absolute bottom-4 right-4 text-[#1e3a8a] font-mono text-[10px] opacity-60 font-bold border-t border-[#1e3a8a] pt-1">
                          {index * 2 - 1}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* ARKA YÜZ */}
                <div
                  className={`absolute w-full h-full backface-hidden flex flex-col overflow-hidden border-r border-slate-300
                    ${page.type === 'cover' && !page.back.logo ? page.front.color + ' text-white' : ''}
                    ${page.type === 'cover' && page.back.logo ? page.back.color + ' text-white border-2 border-[#1e3a8a] rounded-l-xl' : ''}
                    ${page.type !== 'cover' ? 'bg-[#fffaf0] text-slate-800 rounded-l-lg' : 'rounded-l-xl'}
                  `}
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <div className="p-6 md:p-8 h-full flex flex-col relative z-10 overflow-y-auto">
                    {page.back.logo ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-2xl">
                            <Landmark size={48} className="text-[#8B0000]" />
                          </div>
                          <h3 className="text-xl font-bold font-serif mb-2 text-white">TKGM</h3>
                          <p className="tracking-widest text-xs font-medium text-blue-200 uppercase mb-4">Tapu ve Kadastro Genel Müdürlüğü</p>
                        </div>
                      </div>
                    ) : page.type === 'magic' ? (
                      // ... Magic Back Content ...
                      <div className="flex flex-col h-full">
                        <div className="text-xs md:text-sm text-[#1e3a8a] font-bold mb-6 flex justify-between flex-row-reverse border-b-2 border-red-600 pb-2">
                          <span>UZMAN GÖRÜŞÜ</span>
                          <Sparkles size={16} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-right font-serif">{page.back.title}</h2>

                        <div className="flex-1 overflow-y-auto pr-2 font-medium text-slate-700 leading-loose text-sm md:text-base text-right bg-white p-6 rounded-sm border border-slate-200 shadow-inner relative">
                          <div className="absolute top-2 right-2 opacity-10 pointer-events-none">
                            <Landmark size={80} />
                          </div>
                          {magicOutput ? (
                            <div className="animate-pulse-once font-mono text-slate-800 whitespace-pre-wrap relative z-10">
                              {magicOutput}
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                              {page.back.placeholder}
                            </div>
                          )}
                        </div>
                        <div className="mt-4 pt-4 text-center">
                          <button onClick={() => setCurrentPage(index)} className="text-xs text-[#1e3a8a] hover:underline font-bold uppercase">Yeni Sorgu</button>
                        </div>
                      </div>
                    ) : page.type === 'cover' ? (
                      <div className="h-full flex flex-col justify-center items-center text-center p-6 italic relative">
                        <p className="text-xl md:text-2xl mb-6 font-serif text-white/90 font-bold">"{page.back.quote}"</p>
                        <hr className="w-24 border-yellow-500 opacity-50 my-6" />
                        <p className="text-sm md:text-base font-light leading-relaxed text-blue-100">{page.back.content}</p>
                      </div>
                    ) : (
                      <>
                        <div className="text-xs md:text-sm text-slate-500 font-bold mb-4 flex justify-between flex-row-reverse border-b-2 border-[#1e3a8a] pb-2">
                          <span className="uppercase tracking-widest text-[#1e3a8a]">DETAYLAR</span>
                          <span>EKLER</span>
                        </div>

                        {page.back.title && <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 text-right font-serif">{page.back.title}</h2>}

                        {page.back.text && <p className="text-slate-700 leading-relaxed text-sm md:text-base text-right font-normal mb-4">{page.back.text}</p>}

                        {page.back.isCode && (
                          <div className="mt-2 bg-[#0f172a] rounded-sm p-3 text-left shadow-lg overflow-x-auto border-l-4 border-yellow-500">
                            <div className="flex justify-between items-center mb-1 border-b border-slate-700 pb-1">
                              <span className="text-[10px] text-yellow-500 font-mono uppercase font-bold">{page.back.codeTitle}</span>
                              <Code size={12} className="text-slate-500" />
                            </div>
                            <pre className="font-mono text-[10px] md:text-xs text-blue-200 whitespace-pre-wrap leading-tight">
                              {page.back.code}
                            </pre>
                          </div>
                        )}

                        {page.back.items && (
                          <ul className="space-y-2 mt-4 text-right">
                            {page.back.items.map((item, i) => (
                              <li key={i} className="text-sm md:text-base text-slate-700 hover:text-[#1e3a8a] transition-colors flex items-center justify-end gap-3 group font-medium">
                                {item}
                                <div className="w-1.5 h-1.5 bg-red-600 rotate-45 group-hover:bg-[#1e3a8a] transition-colors"></div>
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Sayfa Numarası */}
                        <div className="absolute bottom-4 left-4 text-[#1e3a8a] font-mono text-[10px] opacity-60 font-bold border-t border-[#1e3a8a] pt-1">
                          {index * 2}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Kontrol Butonları */}
      <div className="flex gap-8 mt-4 z-20 shrink-0">
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className="p-3 bg-[#1e3a8a] text-white rounded-full shadow-lg disabled:opacity-30 hover:bg-blue-900 hover:scale-110 transition-all border-2 border-white/20"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="text-[#1e3a8a] font-bold font-mono flex items-center text-sm bg-white px-4 py-1 rounded-full shadow border border-blue-200">
          SAYFA {currentPage} / {totalPages}
        </div>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="p-3 bg-[#1e3a8a] text-white rounded-full shadow-lg disabled:opacity-30 hover:bg-blue-900 hover:scale-110 transition-all border-2 border-white/20"
        >
          <ChevronRight size={24} />
        </button>
      </div>

    </div>
  );
};

export default BookWebsite;