import React, { useState, useEffect } from 'react';
import { Book, ChevronLeft, ChevronRight, Globe, Layers, Database, Map, Server, Sparkles, PenTool, Code, Info, Landmark, FileText, Building2, Flag, FileCode, Settings, Search } from 'lucide-react';

const BookWebsite = () => {
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

  // Alfabe ve Sayfa Eşleştirme Mantığı
  // Hangi harf grubunun hangi sayfada (index) görüneceğini belirliyoruz.
  const alphabetMap = [
    { letters: ["A", "B", "C", "Ç", "D"], pageIndex: 1 },
    { letters: ["E", "F", "G", "H", "I"], pageIndex: 2 },
    { letters: ["İ", "J", "K", "L", "M"], pageIndex: 3 },
    { letters: ["N", "O", "Ö", "P", "R"], pageIndex: 4 },
    { letters: ["S", "Ş", "T", "U", "Ü"], pageIndex: 5 },
    { letters: ["V", "Y", "Z"], pageIndex: 6 },
    { letters: ["W"], pageIndex: 6, highlight: true } // W harfi özel ve belirgin
  ];

  // Sayfa Verileri - OGC ANSİKLOPEDİSİ
  const pages = [
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
    // SAYFA 1: Giriş ve Temel Kavramlar (A-D)
    {
      id: 1,
      type: 'content',
      tabGroup: 0, // A-D
      front: {
        title: "Birlikte Çalışabilirlik",
        text: "Coğrafi Bilgi Sistemleri'nde (CBS) en kritik kavram 'Interoperability' yani birlikte çalışabilirliktir. Farklı yazılımların (Netcad, ArcGIS, QGIS) ve sunucuların (GeoServer, MapServer) ortak bir dilde konuşmasını sağlar.",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000",
        caption: "Küresel Veri Ağı"
      },
      back: {
        title: "OGC Nedir?",
        text: "Open Geospatial Consortium (OGC), mekansal veriler için açık standartlar geliştiren uluslararası bir konsorsiyumdur. TKGM sistemleri (MEGSİS, TAKBİS) bu standartlara tam uyumludur.",
        items: [
            "Açıklık: Kodlar ve spekülasyonlar halka açıktır.",
            "Bağımsızlık: Platform ve dilden bağımsızdır.",
            "Genişletilebilirlik: Yeni ihtiyaçlara göre güncellenir."
        ]
      }
    },
    // SAYFA 2: Veri Formatları (E-I)
    {
      id: 2,
      type: 'content',
      tabGroup: 1, // E-I
      front: {
        title: "Veri Formatları: GML",
        text: "Geography Markup Language (GML), coğrafi verilerin depolanması ve transferi için geliştirilmiş XML tabanlı bir dildir. Tüm OGC servislerinin (WFS) temel çıktı formatıdır.",
        services: [
            { title: "GML (XML)", desc: "Veri kaybı olmadan transfer sağlar. Hacmi büyüktür." },
            { title: "GeoJSON", desc: "Web uygulamaları için hafif, JSON tabanlı format." },
            { title: "KML", desc: "Google Earth tabanlı görselleştirme formatı." }
        ]
      },
      back: {
        title: "GML Yapısı Örneği",
        isCode: true,
        codeTitle: "GML Parsel Gösterimi",
        code: `<gml:featureMember>
  <tkgm:Parsel gml:id="P.123">
    <tkgm:adaNo>101</tkgm:adaNo>
    <tkgm:parselNo>5</tkgm:parselNo>
    <tkgm:geom>
      <gml:Polygon>...</gml:Polygon>
    </tkgm:geom>
  </tkgm:Parsel>
</gml:featureMember>`,
        text: "GML, nesne tabanlıdır ve özniteliklerle geometriyi bir arada tutar."
      }
    },
    // SAYFA 3: Koordinat ve Kalite (İ-M)
    {
      id: 3,
      type: 'content',
      tabGroup: 2, // İ-M
      front: {
        title: "Koordinat Sistemleri (CRS)",
        text: "OGC servislerinde doğru projeksiyonun (SRS/CRS) belirtilmesi hayati önem taşır. TKGM verileri genellikle ITRF96 (EPSG:5254) veya WGS84 (EPSG:4326) datumunda sunulur.",
        image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000",
        caption: "Projeksiyon Sistemleri"
      },
      back: {
        title: "Metadata (ISO 19115)",
        text: "Verinin kimliği, kalitesi, kaynağı ve güncelliği hakkında bilgi veren 'veri hakkındaki veri'dir. Katalog servisleri (CSW) metadata üzerinden arama yapar.",
        items: [
            "EPSG:3857 -> Web Mercator (Google/Bing Maps)",
            "EPSG:4326 -> Coğrafi (Lat/Lon)",
            "EPSG:5254 -> TUREF / ITRF96 (Türkiye Ulusal)"
        ]
      }
    },
    // SAYFA 4: Katalog ve Stil (N-R)
    {
      id: 4,
      type: 'content',
      tabGroup: 3, // N-R
      front: {
        title: "SLD: Stil Katman Tanımlayıcı",
        text: "Styled Layer Descriptor (SLD), haritaların nasıl renklendirileceğini (semboloji) belirleyen XML standardıdır. WMS servislerinde istemci tarafında stil değiştirmek için kullanılır.",
        services: [
            { title: "SE (Symbology Encoding)", desc: "SLD'nin kullandığı semboloji dili." },
            { title: "Kural Bazlı Stil", desc: "Örn: Alanı > 1000m² olanları kırmızı göster." }
        ]
      },
      back: {
        title: "SLD XML Örneği",
        isCode: true,
        codeTitle: "Poligon Dolgu Stili",
        code: `<Rule>
  <Name>BuyukParsel</Name>
  <Filter>
    <PropertyIsGreaterThan>
       <PropertyName>alan</PropertyName>
       <Literal>1000</Literal>
    </PropertyIsGreaterThan>
  </Filter>
  <PolygonSymbolizer>
    <Fill><CssParameter name="fill">#FF0000</CssParameter></Fill>
  </PolygonSymbolizer>
</Rule>`,
        text: "Bu kural, alanı 1000'den büyük parselleri kırmızıya boyar."
      }
    },
    // SAYFA 5: Servis Mimarisi (S-Ü)
    {
      id: 5,
      type: 'content',
      tabGroup: 4, // S-Ü
      front: {
        title: "Servis Tabanlı Mimari (SOA)",
        text: "TKGM sistemleri, veriyi monolitik bir yapı yerine, birbirleriyle web servisleri aracılığıyla konuşan modüler servisler halinde sunar.",
        image: "https://images.unsplash.com/photo-1558494949-ef526b0042a0?auto=format&fit=crop&q=80&w=1000",
        caption: "Sunucu Altyapısı"
      },
      back: {
        title: "Servis Türleri Özeti",
        items: [
            "WMS -> Görüntü (Resim)",
            "WMTS -> Döşeme (Hızlı Görüntü)",
            "WFS -> Vektör (Veri İndirme/Analiz)",
            "WCS -> Raster (Yükseklik/Analiz)",
            "WPS -> İşlem (Buffer/Kesişim)"
        ],
        text: "Her servis türü farklı bir kullanım senaryosu için optimize edilmiştir."
      }
    },
    // SAYFA 6: WEB SERVİSLERİ (V-Z ve W) - EN ÖNEMLİ SAYFA
    {
      id: 6,
      type: 'content',
      tabGroup: 5, // V-Z + W
      front: {
        title: "Web Map Service (WMS)",
        text: "En yaygın kullanılan OGC servisidir. Veriyi sunucuda işler ve istemciye sadece o anki ekran görüntüsünü (PNG/JPG) gönderir.",
        services: [
            { title: "GetCapabilities", desc: "Servis künyesini ve katmanları listeler." },
            { title: "GetMap", desc: "Harita resmini üretir." },
            { title: "GetFeatureInfo", desc: "Piksel koordinatından öznitelik sorgular." }
        ]
      },
      back: {
        title: "Web Feature Service (WFS)",
        text: "Veriye doğrudan erişim sağlar. CBS analizleri için ham geometriyi (koordinatları) ve tablo verisini indirir.",
        isCode: true,
        codeTitle: "WFS GetFeature İsteği",
        code: `http://tkgm.gov.tr/geoserver/wfs?
service=WFS
&version=2.0.0
&request=GetFeature
&typeNames=tkgm:parsel
&count=50
&outputFormat=application/json`,
        items: ["WFS-T (Transactional): Veri düzenleme ve kaydetme imkanı sağlar.", "Filtreleme: CQL veya OGC Filter ile detaylı sorgu yapılır."]
      }
    },
    // YENİ SAYFA: OGC API (Gelecek)
    {
      id: 7,
      type: 'content',
      tabGroup: 5, // W grubuna dahil edebiliriz veya ayrı
      front: {
        title: "Yeni Nesil: OGC API",
        text: "Klasik XML tabanlı servislerin (WMS/WFS) yerini alan, modern, RESTful ve JSON odaklı yeni standartlar ailesidir.",
        services: [
            { title: "OGC API - Features", desc: "WFS'in modern halidir. Kaynak odaklıdır." },
            { title: "OGC API - Tiles", desc: "WMTS'in modern halidir." },
            { title: "OpenAPI (Swagger)", desc: "Dokümantasyon ve kullanım kolaylığı sağlar." }
        ]
      },
      back: {
        title: "WCS & WMTS",
        items: [
            "WCS (Web Coverage Service): Uydu görüntüleri, DEM gibi raster verilerin ham piksel değerlerini sunar.",
            "WMTS (Web Map Tile Service): Haritayı küçük karelere (tile) bölerek önbellekten çok hızlı sunar."
        ],
        text: "Altlık haritalar için WMTS, analiz için WCS tercih edilmelidir."
      }
    },
    // Gemini Sayfası
    {
      id: 8,
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
    {
      id: 9,
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

  const totalPages = pages.length;

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

  return (
    <div className="h-screen bg-slate-200 flex flex-col items-center justify-center p-2 overflow-hidden font-sans">
      
      {/* Arka Plan */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(45deg,#000_0,#000_1px,transparent_0,transparent_50%)] bg-[length:10px_10px]"></div>
      </div>

      <div className="mb-2 z-10 text-center relative shrink-0">
        <h1 className="text-xl md:text-2xl font-bold text-[#1e3a8a] flex items-center justify-center gap-3 uppercase tracking-wide">
          <Building2 className="w-6 h-6 md:w-8 md:h-8 text-red-700" /> Tapu ve Kadastro Genel Müdürlüğü
        </h1>
        <div className="w-1/2 h-1 bg-red-600 mx-auto my-1 rounded-full"></div>
        <p className="text-slate-600 text-[10px] md:text-xs font-semibold">BİLGİ TEKNOLOJİLERİ DAİRESİ BAŞKANLIĞI • OGC TEKNİK DOKÜMANTASYON</p>
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
            
            // Z-Index
            let zIndex;
            if (index < currentPage) zIndex = index; 
            else if (index === currentPage) zIndex = totalPages + 1; 
            else zIndex = totalPages - index; 

            const isFlipped = index < currentPage;

            return (
              <div
                key={page.id}
                onClick={() => {
                   if (page.type === 'magic' && currentPage === index) return; 
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
                  
                  {/* ALFABETİK FİHRİST (Sağ Tarafta) */}
                  {/* Sadece içerik sayfalarında ve sağdaki sayfalarda görünür */}
                  {index > 0 && index < pages.length - 1 && (
                    <div className="absolute right-0 top-0 h-full flex flex-col z-20 pointer-events-auto w-8 md:w-10">
                      {alphabetMap.map((group, i) => {
                        // Sekmelerin sayfaya göre dağılımı
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

                  {/* Özel Asistan Sekmesi */}
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
                  <div className="p-6 md:p-8 h-full flex flex-col relative z-10 overflow-y-auto mr-8 md:mr-10"> {/* Mr added for tabs */}
                    {page.type === 'cover' ? (
                      <div className="h-full flex flex-col items-center justify-center border-[6px] border-double border-yellow-500/30 rounded-lg p-4 relative">
                         {/* Kapak Tasarımı */}
                        <div className="w-24 h-24 mb-6 rounded-full bg-white flex items-center justify-center shadow-lg">
                          <Landmark size={48} className="text-[#1e3a8a]" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-center mb-2 font-serif text-white drop-shadow-md">{page.front.title}</h2>
                        <div className="h-1 w-24 bg-yellow-500 mb-6 rounded"></div>
                        <p className="text-blue-100 text-lg md:text-xl uppercase tracking-widest font-semibold text-center">{page.front.subtitle}</p>
                        <div className="mt-auto pt-6 border-t border-white/20 w-full text-center">
                          <p className="text-sm md:text-base font-medium text-blue-200 tracking-wider uppercase">{page.front.author}</p>
                        </div>
                      </div>
                    ) : page.type === 'magic' ? (
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
                                    {isGenerating ? (
                                        <>
                                            <Sparkles className="animate-spin" size={20} /> Sorgulanıyor...
                                        </>
                                    ) : (
                                        <>
                                            <PenTool size={20} /> Gönder
                                        </>
                                    )}
                                </span>
                             </button>
                        </div>
                    ) : (
                      <>
                        <div className="text-xs md:text-sm text-slate-500 font-bold mb-4 flex justify-between border-b-2 border-[#1e3a8a] pb-2 items-center">
                          <span className="uppercase tracking-widest text-[#1e3a8a] flex items-center gap-2">
                            <FileText size={14} /> BÖLÜM {index}
                          </span>
                          <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-[10px]">ISO-19100</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 font-serif">{page.front.title}</h2>
                        
                        {page.front.image && (
                          <div className="mb-4 p-1 border-2 border-slate-300 shadow-md bg-white w-full mx-auto transform -rotate-1">
                            <img src={page.front.image} alt="Content" className="w-full h-40 object-cover grayscale-[20%]" />
                            <p className="text-xs md:text-xs text-center text-slate-500 mt-1 flex items-center justify-center gap-1 font-mono">
                                <Info size={10}/> ŞEKİL {index}.1: {page.front.caption}
                            </p>
                          </div>
                        )}
                        
                        {page.front.text && <p className="text-slate-700 leading-relaxed text-sm md:text-base text-justify font-normal">{page.front.text}</p>}

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
                  
                  {/* İÇERİK - ARKA YÜZ */}
                  <div className="p-6 md:p-8 h-full flex flex-col relative z-10 overflow-y-auto">
                    {page.back.logo ? (
                       <div className="h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-2xl">
                                <Landmark size={48} className="text-[#1e3a8a]" />
                            </div>
                            <h3 className="text-xl font-bold font-serif mb-2 text-white">TKGM</h3>
                            <p className="tracking-widest text-xs font-medium text-blue-200 uppercase">Tapu ve Kadastro Genel Müdürlüğü</p>
                          </div>
                       </div>
                    ) : page.type === 'magic' ? (
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
                       <div className="h-full flex flex-col justify-center items-center text-center p-6 italic">
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

                        {/* Kod Bloğu Gösterimi */}
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