# 🔍 Duygu Dedektifi - Gizem Oyunu

## 📝 Oyun Hakkında

Duygu Dedektifi, insan duygularından oluşan karakterlerle oynanan interaktif bir gizem oyunudur. Google Gemini AI kullanarak her oyunda yeni karakterler oluşturulur ve bu karakterlerden biri suçlu olarak belirlenir. Oyuncunun görevi, karakterlere sorular sorarak gerçek suçluyu bulmaktır.

## 🎯 Oyun Özellikleri

### 1. **Duygu Havuzu**
- 10 farklı insan duygusundan karakterler: Mutluluk, Öfke, Korku, Üzüntü, Şaşkınlık, İğrenme, Kıskançlık, Gurur, Utanç, Heyecan
- Her duygu kendi özelliklerini ve davranış kalıplarını taşır

### 2. **Dinamik Karakter Oluşturma**
- Her oyunda 4 farklı karakter rastgele seçilir
- Google Gemini AI ile gerçekçi arka plan hikayeleri oluşturulur
- Karakterlerin yaşı, mesleği ve kişilik özellikleri otomatik belirlenir

### 3. **Akıllı Suçlu Sistemı**
- Karakterlerden biri rastgele suçlu olarak seçilir
- Suçlunun hikayesi çelişkiler içerecek şekilde düzenlenir
- Masum karakterler samimi cevaplar verirken, suçlu savunmaya geçer

### 4. **İnteraktif Soruşturma**
- Herhangi bir karaktere açık uçlu sorular sorabilirsiniz
- AI her karakterin duygusal durumuna göre farklı cevaplar verir
- Konuşma geçmişi kaydedilir ve takip edilebilir

### 5. **Sonuç ve Değerlendirme**
- Şüphelinizi seçin ve doğru mu yanlış mı öğrenin
- Gerçek suçlunun detaylı hikayesi ortaya çıkar

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Modern web tarayıcı (Chrome, Firefox, Safari, Edge)
- İnternet bağlantısı (Gemini API için)

### Çalıştırma
1. Projeyi bilgisayarınıza indirin
2. `index.html` dosyasını web tarayıcınızda açın
3. "Oyunu Başlat" butonuna tıklayın

**ÖNEMLİ:** Eğer CORS hatası alırsanız, dosyaları bir HTTP sunucusu üzerinden çalıştırmanız gerekebilir.

#### HTTP Sunucusu ile Çalıştırma (Opsiyonel)
```bash
# Python ile
python -m http.server 8000

# Node.js ile
npx http-server -p 8000
```
Sonra `http://localhost:8000` adresini ziyaret edin.

## 🎮 Nasıl Oynanır

1. **Oyunu Başlatın:** "Oyunu Başlat" butonuna tıklayın
2. **Karakterleri İnceleyin:** 4 karakter ve kısa hikayeleri gösterilir
3. **Karakter Seçin:** Soru sormak istediğiniz karaktere tıklayın
4. **Soru Sorun:** Metin kutusuna sorunuzu yazın ve "Soru Sor" butonuna tıklayın
5. **Cevapları Analiz Edin:** Karakterlerin verdiği cevaplardaki çelişkileri arayın
6. **Suçluyu Belirleyin:** "Suçluyu Seç" butonuna tıklayarak tahmin yapın
7. **Sonucu Görün:** Doğru mu yanlış mı öğrenin ve gerçek hikayeyi keşfedin

## 💡 Oyun İpuçları

- **Detaylı Sorular Sorun:** "O gün neredeydin?", "Kimle konuştun?", "Ne hissettin?" gibi
- **Çelişkileri Arayın:** Suçlu karakterler genellikle tutarsız cevaplar verir
- **Duygusal Tepkileri Gözleyin:** Savunmaya geçen, gergin olan karakterlere dikkat edin
- **Herkesle Konuşun:** Tüm karakterlerle konuşarak karşılaştırma yapın

## 🛠 Teknik Detaylar

### Kullanılan Teknolojiler
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **AI:** Google Gemini 2.0 Flash API
- **Responsive Design:** Mobil ve masaüstü uyumlu

### API Yapılandırması
Oyun, Google Gemini API kullanır. API anahtarı `script.js` dosyasında tanımlıdır:
```javascript
const API_KEY = 'AIzaSyCZAyW7JivjLd_Iie0sxlZNVoIEqO4IUK0';
```

### Dosya Yapısı
```
emotion-detective-game/
├── index.html          # Ana sayfa
├── style.css           # Stil dosyası
├── script.js           # Oyun mantığı
├── test.html           # API test sayfası
└── README.md           # Bu dosya
```

## 🎨 Özelleştirme

### Yeni Duygular Ekleme
`script.js` dosyasındaki `emotionPool` dizisine yeni duygular ekleyebilirsiniz:

```javascript
{
    emotion: 'Yeni Duygu',
    traits: ['özellik1', 'özellik2'],
    emoji: '😊',
    tendencies: 'davranış açıklaması'
}
```

### Karakter İsimleri
`namePool` dizisini düzenleyerek farklı isimler ekleyebilirsiniz.

## 🐛 Sorun Giderme

### Sık Karşılaşılan Sorunlar

1. **API Hatası**
   - İnternet bağlantınızı kontrol edin
   - API anahtarının doğru olduğundan emin olun

2. **CORS Hatası**
   - Dosyaları HTTP sunucusu üzerinden çalıştırın
   - `test.html` ile API bağlantısını test edin

3. **Karakterler Yüklenmiyor**
   - Tarayıcı konsolunu kontrol edin (F12)
   - Sayfa yenileyin ve tekrar deneyin

## 📄 Lisans

Bu proje eğitim amaçlı oluşturulmuştur. Gemini API kullanım koşullarına uygun şekilde kullanın.

## 🤝 Katkıda Bulunma

Oyunu geliştirmek için önerileriniz varsa:
1. Yeni duygu türleri
2. Farklı suç senaryoları
3. Gelişmiş UI/UX özellikleri
4. Çoklu dil desteği

---

**İyi Oyunlar! 🔍✨**