// Gemini API yapılandırması
const API_KEY = 'API KEY';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

// Oyun durumu
let gameState = {
    characters: [],
    culprit: null,
    selectedCharacter: null,
    conversations: {},
    gamePhase: 'start', // start, loading, playing, accusation, result
    caseInfo: {
        city: '',
        location: '',
        time: '',
        crime: null,
        victim: null
    }
};

// Duygu havuzu - İnsan duygularından oluşan karakteristikler
const emotionPool = [
    {
        emotion: 'Mutluluk',
        traits: ['iyimser', 'enerjik', 'sosyal', 'güler yüzlü'],
        emoji: '😊',
        tendencies: 'genellikle pozitif, yardımsever ama bazen naif olabilir'
    },
    {
        emotion: 'Öfke',
        traits: ['sinirli', 'agresif', 'kararlı', 'sert'],
        emoji: '😠',
        tendencies: 'hızlı kararlar verir, çatışmacı olabilir ama adaletli'
    },
    {
        emotion: 'Korku',
        traits: ['temkinli', 'endişeli', 'dikkatli', 'çekingen'],
        emoji: '😰',
        tendencies: 'güvenlik odaklı, şüpheci ama empati kurabilen'
    },
    {
        emotion: 'Üzüntü',
        traits: ['melankolik', 'derin düşünen', 'duygusal', 'içedönük'],
        emoji: '😢',
        tendencies: 'duygusal zeka yüksek, anlayışlı ama karamsar olabilir'
    },
    {
        emotion: 'Şaşkınlık',
        traits: ['meraklı', 'açık fikirli', 'esnek', 'uyumlu'],
        emoji: '😲',
        tendencies: 'yeni deneyimlere açık, adaptasyon yetisi yüksek'
    },
    {
        emotion: 'İğrenme',
        traits: ['titiz', 'seçici', 'eleştirel', 'mükemmeliyetçi'],
        emoji: '🤢',
        tendencies: 'yüksek standartları var, detaycı ama yargılayıcı olabilir'
    },
    {
        emotion: 'Kıskançlık',
        traits: ['rekabetçi', 'sahiplenici', 'tutkulu', 'gözlemci'],
        emoji: '😒',
        tendencies: 'başarı odaklı, karşılaştırma yapar, manipülatif olabilir'
    },
    {
        emotion: 'Gurur',
        traits: ['özgüvenli', 'lider', 'başarılı', 'karizma sahibi'],
        emoji: '😤',
        tendencies: 'yüksek benlik saygısı, ilham verici ama kibirli olabilir'
    },
    {
        emotion: 'Utanç',
        traits: ['alçakgönüllü', 'mütevazı', 'çekimser', 'özeleştirel'],
        emoji: '😳',
        tendencies: 'empatik, başkalarını düşünür ama özgüven eksikliği yaşar'
    },
    {
        emotion: 'Heyecan',
        traits: ['coşkulu', 'macera sever', 'spontan', 'yaratıcı'],
        emoji: '🤩',
        tendencies: 'yenilikçi, risk alır, ilham verici ama sabırsız olabilir'
    }
];

// Karakter isimleri havuzu
const namePool = [
    'Ayşe', 'Mehmet', 'Fatma', 'Ali', 'Zeynep', 'Mustafa', 
    'Emine', 'Ahmet', 'Hatice', 'Hüseyin', 'Elif', 'İbrahim',
    'Meryem', 'Yusuf', 'Şeyma', 'Ömer', 'Kübra', 'Burak',
    'Sena', 'Emre', 'Büşra', 'Cem', 'Nur', 'Barış'
];

// Karakter görselleri
const characterImages = {
    male: ['assets/erkek1.png', 'assets/erkek2.png', 'assets/erkek3.png', 'assets/erke4.png'],
    female: ['assets/kadın1.png', 'assets/kadın2.png', 'assets/kadın3.png']
};

// Erkek ve kadın isimleri
const maleNames = ['Mehmet', 'Ali', 'Mustafa', 'Ahmet', 'Hüseyin', 'İbrahim', 'Yusuf', 'Ömer', 'Burak', 'Emre', 'Cem', 'Barış'];
const femaleNames = ['Ayşe', 'Fatma', 'Zeynep', 'Emine', 'Hatice', 'Elif', 'Meryem', 'Şeyma', 'Kübra', 'Sena', 'Büşra', 'Nur'];

// Türkiye şehirleri havuzu
const cityPool = [
    'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 
    'Konya', 'Gaziantep', 'Mersin', 'Diyarbakır', 'Kayseri', 'Eskişehir',
    'Samsun', 'Denizli', 'Şanlıurfa', 'Adapazarı', 'Malatya', 'Erzurum',
    'Van', 'Batman', 'Elazığ', 'İzmit', 'Manisa', 'Sivas',
    'Gebze', 'Balıkesir', 'Tarsus', 'Kahramanmaraş', 'Erzincan', 'Ordu',
    'Trabzon', 'Aydın', 'Çorum', 'Isparta', 'Hatay', 'Tekirdağ',
    'Afyon', 'Edirne', 'Muğla', 'Yalova', 'Rize', 'Sinop'
];

// Suç türleri havuzu
const crimePool = [
    {
        type: 'cinayet',
        description: 'ölü bulunmuştur',
        severity: 'yüksek',
        motives: ['kıskançlık', 'para', 'intikam', 'gizli ilişki']
    },
    {
        type: 'hırsızlık',
        description: 'değerli eşyaları çalınmıştır',
        severity: 'orta',
        motives: ['para sıkıntısı', 'uyuşturucu bağımlılığı', 'kumar borcu']
    },
    {
        type: 'dolandırıcılık',
        description: 'dolandırılmıştır',
        severity: 'orta',
        motives: ['kolay para', 'borç', 'lüks yaşam arzusu']
    },
    {
        type: 'tehdit',
        description: 'tehdit edilmiştir',
        severity: 'düşük',
        motives: ['iş anlaşmazlığı', 'kişisel çatışma', 'mafya bağlantısı']
    },
    {
        type: 'saldırı',
        description: 'saldırıya uğramıştır',
        severity: 'orta',
        motives: ['tartışma', 'alkol etkisi', 'eski husumet']
    }
];

// Olay yerleri havuzu
const locationPool = [
    'fırın', 'kafe', 'park', 'market', 'eczane', 'kuaför', 'berber',
    'restoran', 'pastane', 'kitapçı', 'kırtasiye', 'butik', 'ayakkabı mağazası',
    'elektronik mağazası', 'tiyatro', 'sinema', 'spor salonu', 'internet kafe',
    'taksi durağı', 'otobüs durağı', 'hastane', 'okul', 'cami', 'kütüphane',
    'banka', 'posta', 'nalbur', 'terzi', 'optik', 'oto galeri'
];

// DOM elementleri
const startScreen = document.getElementById('startScreen');
const loadingScreen = document.getElementById('loadingScreen');
const gameScreen = document.getElementById('gameScreen');
const accusationScreen = document.getElementById('accusationScreen');
const resultScreen = document.getElementById('resultScreen');

const startGameBtn = document.getElementById('startGameBtn');
const charactersGrid = document.getElementById('charactersGrid');
const selectedCharacterDiv = document.getElementById('selectedCharacter');
const questionInput = document.getElementById('questionInput');
const askQuestionBtn = document.getElementById('askQuestionBtn');
const conversationHistory = document.getElementById('conversationHistory');
const makeAccusationBtn = document.getElementById('makeAccusationBtn');
const newGameBtn = document.getElementById('newGameBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const loadingText = document.getElementById('loadingText');
const caseScreen = document.getElementById('caseScreen');
const startInvestigationBtn = document.getElementById('startInvestigationBtn');

// Event listeners
startGameBtn.addEventListener('click', startNewGame);
askQuestionBtn.addEventListener('click', askQuestion);
makeAccusationBtn.addEventListener('click', showAccusationScreen);
newGameBtn.addEventListener('click', startNewGame);
playAgainBtn.addEventListener('click', startNewGame);
startInvestigationBtn.addEventListener('click', startInvestigation);

questionInput.addEventListener('input', function() {
    askQuestionBtn.disabled = !this.value.trim() || !gameState.selectedCharacter;
});

// Gemini API çağrısı
async function callGeminiAPI(prompt) {
    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.8,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1000,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API hatası: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Gemini API hatası:', error);
        throw error;
    }
}

// Yeni oyun başlatma
async function startNewGame() {
    try {
        gameState.gamePhase = 'loading';
        showScreen('loading');
        
        // Loading mesajları
        const loadingMessages = [
            'Türkiye\'den rastgele bir şehir seçiliyor...',
            'Olay yeri ve zamanı belirleniyor...',
            'Mağdur ve suç türü oluşturuluyor...',
            'Şüpheliler hazırlanıyor...',
            'Karakterlerin hikayelerini oluşturuyor...',
            'Suçluyu belirleniyor...',
            'Oyun hazırlanıyor...'
        ];
        
        for (let i = 0; i < loadingMessages.length; i++) {
            loadingText.textContent = loadingMessages[i];
            await new Promise(resolve => setTimeout(resolve, 800));
        }

        // Olay bilgilerini oluştur
        await generateCaseInfo();
        
        // Karakterleri oluştur
        await generateCharacters();
        
        gameState.gamePhase = 'case';
        showScreen('case');
        displayCaseInfo();
        
    } catch (error) {
        console.error('Oyun başlatma hatası:', error);
        alert('Oyun başlatılırken bir hata oluştu. Lütfen tekrar deneyin.');
        showScreen('start');
    }
}

// Olay bilgilerini oluşturma
async function generateCaseInfo() {
    try {
        // Rastgele şehir, konum ve zaman seç
        const city = cityPool[Math.floor(Math.random() * cityPool.length)];
        const location = locationPool[Math.floor(Math.random() * locationPool.length)];
        const crime = crimePool[Math.floor(Math.random() * crimePool.length)];
        
        // Rastgele saat oluştur (06:00 - 23:00 arası)
        const hour = Math.floor(Math.random() * 17) + 6; // 6-23 arası
        const minute = Math.floor(Math.random() * 4) * 15; // 00, 15, 30, 45
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Mağdur bilgilerini oluştur
        const victimPrompt = `
        ${city} şehrinde ${location} önünde/içinde ${crime.type} olayı için bir mağdur karakter oluştur.
        
        Lütfen şu formatta cevap ver (her bölüm kısa olsun):
        İsim: [Türk ismi]
        Yaş: [20-70 arası]
        Cinsiyet: [Erkek/Kadın]
        Meslek: [Mesleği]
        Özellikler: [Maksimum 2 kısa özellik]
        
        Karakter gerçekçi ve Türk kültürüne uygun olsun.
        Her bölümü kısa tut.
        `;
        
        const victimInfo = await callGeminiAPI(victimPrompt);
        
        gameState.caseInfo = {
            city: city,
            location: location,
            time: time,
            crime: crime,
            victim: victimInfo
        };
        
    } catch (error) {
        console.error('Olay oluşturma hatası:', error);
        throw error;
    }
}

// Olay bilgilerini gösterme
function displayCaseInfo() {
    const caseStory = document.getElementById('caseStory');
    const suspectsList = document.getElementById('suspectsList');
    
    // Mağdur bilgilerini parse et
    const victimLines = gameState.caseInfo.victim.split('\n').filter(line => line.trim());
    let victimName = '', victimAge = '', victimGender = '', victimJob = '', victimFeatures = '';
    
    victimLines.forEach(line => {
        if (line.includes('İsim:')) victimName = line.replace('İsim:', '').trim();
        if (line.includes('Yaş:')) victimAge = line.replace('Yaş:', '').trim();
        if (line.includes('Cinsiyet:')) victimGender = line.replace('Cinsiyet:', '').trim();
        if (line.includes('Meslek:')) victimJob = line.replace('Meslek:', '').trim();
        if (line.includes('Özellikler:')) victimFeatures = line.replace('Özellikler:', '').trim();
    });
    
    caseStory.innerHTML = `
        <div class="case-location">
            📍 ${gameState.caseInfo.city} - ${gameState.caseInfo.location}
        </div>
        <div class="case-details">
            <strong>Olay Zamanı:</strong> Bugün saat ${gameState.caseInfo.time} sularında
        </div>
        <div class="case-victim">
            <strong>${victimAge} yaşındaki ${victimName}</strong> (${victimGender}, ${victimJob}) ${gameState.caseInfo.crime.description}
            <br><br>
            <strong>Mağdur Özellikleri:</strong> ${victimFeatures}
        </div>
        <div class="case-details">
            Polis ekipleri olay yerine çağrıldı ve ilk incelemeler yapıldı. 
            Şüpheliler belirlendi ve ifadeleri alınmak üzere karakola götürüldü.
            <br><br>
            <strong>Göreviniz:</strong> Şüphelilerle konuşarak gerçek suçluyu bulun!
        </div>
    `;
    
    // Şüphelileri göster
    suspectsList.innerHTML = '';
    gameState.characters.forEach(character => {
        const suspectCard = document.createElement('div');
        suspectCard.className = 'suspect-card';
        
        suspectCard.innerHTML = `
            <div class="suspect-emoji">${character.emoji}</div>
            <div class="suspect-name">${character.name}</div>
            <div class="suspect-emotion">${character.emotion}</div>
        `;
        
        suspectsList.appendChild(suspectCard);
    });
}

// Olay bilgilerini gösterme
function displayCaseInfo() {
    const caseStory = document.getElementById('caseStory');
    const suspectsList = document.getElementById('suspectsList');
    
    // Mağdur bilgilerini parse et
    const victimLines = gameState.caseInfo.victim.split('\n').filter(line => line.trim());
    let victimName = '', victimAge = '', victimGender = '', victimJob = '', victimFeatures = '';
    
    victimLines.forEach(line => {
        if (line.includes('İsim:')) victimName = line.replace('İsim:', '').trim();
        if (line.includes('Yaş:')) victimAge = line.replace('Yaş:', '').trim();
        if (line.includes('Cinsiyet:')) victimGender = line.replace('Cinsiyet:', '').trim();
        if (line.includes('Meslek:')) victimJob = line.replace('Meslek:', '').trim();
        if (line.includes('Özellikler:')) victimFeatures = line.replace('Özellikler:', '').trim();
    });
    
    caseStory.innerHTML = `
        <div class="case-location">
            📍 ${gameState.caseInfo.city} - ${gameState.caseInfo.location}
        </div>
        <div class="case-details">
            <strong>Olay Zamanı:</strong> Bugün saat ${gameState.caseInfo.time} sularında
        </div>
        <div class="case-victim">
            <strong>${victimAge} yaşındaki ${victimName}</strong> (${victimGender}, ${victimJob}) ${gameState.caseInfo.crime.description}
            <br><br>
            <strong>Mağdur Özellikleri:</strong> ${victimFeatures}
        </div>
        <div class="case-details">
            Polis ekipleri olay yerine çağrıldı ve ilk incelemeler yapıldı. 
            Şüpheliler belirlendi ve ifadeleri alınmak üzere karakola götürüldü.
            <br><br>
            <strong>Göreviniz:</strong> Şüphelilerle konuşarak gerçek suçluyu bulun!
        </div>
    `;
    
    // Şüphelileri göster
    suspectsList.innerHTML = '';
    gameState.characters.forEach(character => {
        const suspectCard = document.createElement('div');
        suspectCard.className = 'suspect-card';
        
        suspectCard.innerHTML = `
            <div class="suspect-image">
                <img src="${character.image}" alt="${character.name}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;" />
            </div>
            <div class="suspect-name">${character.name}</div>
        `;
        
        suspectsList.appendChild(suspectCard);
    });
}

// Soruşturmaya başlama
function startInvestigation() {
    gameState.gamePhase = 'playing';
    showScreen('game');
    displayCharacters();
}

// Karakterleri oluşturma
async function generateCharacters() {
    try {
        // 4 farklı duygu seç
        const selectedEmotions = [];
        const shuffledEmotions = [...emotionPool].sort(() => 0.5 - Math.random());
        
        for (let i = 0; i < 4; i++) {
            selectedEmotions.push(shuffledEmotions[i]);
        }

        // Kullanılmış görsel dosyalarını takip et
        const usedImages = [];
        
        // Her duygu için karakter oluştur
        gameState.characters = [];
        gameState.conversations = {};
        
        for (let i = 0; i < selectedEmotions.length; i++) {
            const emotion = selectedEmotions[i];
            
            // Rastgele cinsiyet belirle
            const gender = Math.random() < 0.5 ? 'male' : 'female';
            
            // Cinsiyete göre isim seç
            const availableNames = gender === 'male' ? 
                maleNames.filter(name => !gameState.characters.some(char => char.name === name)) :
                femaleNames.filter(name => !gameState.characters.some(char => char.name === name));
            
            const name = availableNames[Math.floor(Math.random() * availableNames.length)];
            
            // Cinsiyete göre görsel seç (kullanılmamış)
            const genderImages = characterImages[gender].filter(img => !usedImages.includes(img));
            const characterImage = genderImages[Math.floor(Math.random() * genderImages.length)];
            usedImages.push(characterImage);
            
            // Karakter hikayesi oluştur - olayla bağlantılı
            const characterPrompt = `
            ${gameState.caseInfo.city} şehrinde ${gameState.caseInfo.location} yakınlarında yaşayan/çalışan 
            "${name}" adlı bir karakter oluştur. (${gender === 'male' ? 'Erkek' : 'Kadın'})
            
            Olay: ${gameState.caseInfo.victim.split('\n')[0]} ${gameState.caseInfo.crime.description}
            Olay Yeri: ${gameState.caseInfo.location}
            Olay Zamanı: Bugün saat ${gameState.caseInfo.time}
            
            Bu karakter mağduru tanıyor olabilir veya olay günü o bölgede bulunmuş olabilir.
            
            Lütfen şu formatta cevap ver:
            Yaş: [20-60 arası bir yaş]
            Meslek: [Mesleği]
            Sabah 09:00: [O sabah ne yaptı, neredeydi]
            Öğle 12:00: [Öğle saatlerinde ne yaptı, neredeydi]
            Olay Saati ${gameState.caseInfo.time}: [Tam olay saatinde ne yaptı, neredeydi]
            Akşam 18:00: [Akşam ne yaptı, neredeydi]
            Olay Gördü: [Evet/Hayır - eğer evet ise neyi nasıl gördü]
            Mağdurla İlişki: [TAMAMEN 50-60 karakter arası, nokta ile biten tam cümle]
            Son Görüşme: [Mağdurla en son ne zaman nerede konuştu]
            O Gün Ruh Hali: [O gün özel bir durumu, problemi var mıydı]
            Genel Kişilik: [TAMAMEN 50-60 karakter arası, nokta ile biten tam cümle]
            
            ÖNEMLİ: "Mağdurla İlişki" ve "Genel Kişilik" bölümleri:
            - MUTLAKA 50-60 karakter arasında olsun
            - MUTLAKA nokta (.) ile bitsin
            - MUTLAKA tam bir cümle olsun
            - Örnek: "Komşusu olarak hep iyi geçinirlerdi." (42 karakter)
            - Örnek: "Sakin ve güvenilir bir kişilik sergilerdi." (45 karakter)
            
            Her bölümü detaylı ama kısa yaz. Hiçbir cümleyi yarıda bırakma.
            Karakter gerçekçi ve Türk kültürüne uygun olsun.
            `;
            
            const characterInfo = await callGeminiAPI(characterPrompt);
            
            const character = {
                id: i,
                name: name,
                gender: gender,
                emotion: emotion.emotion, // Gizli - sadece AI cevaplarında kullanılacak
                emoji: emotion.emoji, // Artık gösterilmeyecek
                traits: emotion.traits, // Gizli
                image: characterImage,
                info: characterInfo,
                isCulprit: false
            };
            
            gameState.characters.push(character);
            gameState.conversations[character.id] = [];
        }

        // Suçluyu seç ve hikayesini düzenle
        await selectAndModifyCulprit();
        
    } catch (error) {
        console.error('Karakter oluşturma hatası:', error);
        throw error;
    }
}

// Suçluyu belirleme ve hikayesini düzenleme
async function selectAndModifyCulprit() {
    try {
        // Rastgele bir karakteri suçlu olarak seç
        const culpritIndex = Math.floor(Math.random() * gameState.characters.length);
        gameState.culprit = gameState.characters[culpritIndex];
        gameState.culprit.isCulprit = true;

        // Suçlunun hikayesini düzenle - olayla bağlantılı
        const culpritModificationPrompt = `
        ${gameState.culprit.name} karakterini bu olayın suçlusu olarak düzenle.
        
        Olay Bilgileri:
        - Yer: ${gameState.caseInfo.city} - ${gameState.caseInfo.location}
        - Zaman: ${gameState.caseInfo.time}
        - Suç: ${gameState.caseInfo.crime.description}
        - Mağdur: ${gameState.caseInfo.victim.split('\n')[0]}
        
        Mevcut karakter bilgileri: ${gameState.culprit.info}
        Duygu durumu: ${gameState.culprit.emotion}
        Olası suç motivasyonu: ${gameState.caseInfo.crime.motives[Math.floor(Math.random() * gameState.caseInfo.crime.motives.length)]}
        
        Bu karakterin hikayesini, bu suçu işlemiş olacak şekilde düzenle.
        Önceden belirlenmiş tutarlı detayları olsun ama sorularda çelişkili cevaplar verecek.
        
        Aynı formatta cevap ver:
        Yaş: [yaş]
        Meslek: [meslek]
        Sabah 09:00: [O sabah ne yaptı - normal görünecek]
        Öğle 12:00: [Öğle saatlerinde ne yaptı - şüpheli ipuçları]
        Olay Saati ${gameState.caseInfo.time}: [Suçu işlerken ne yaptı ama gizleyecek]
        Akşam 18:00: [Akşam ne yaptı - suçu gizleme çabası]
        Olay Gördü: [Elbette gördü ama inkar edecek]
        Mağdurla İlişki: [TAMAMEN 50-60 karakter arası, nokta ile biten tam cümle - gerçek motivasyonu gizleyen]
        Son Görüşme: [Önemli ipucu - suç öncesi görüşme]
        O Gün Ruh Hali: [Suça yönelten özel durum]
        Genel Kişilik: [TAMAMEN 50-60 karakter arası, nokta ile biten tam cümle - suça yatkın ama gizli]
        
        ÖNEMLİ: "Mağdurla İlişki" ve "Genel Kişilik" bölümleri:
        - MUTLAKA 50-60 karakter arasında olsun
        - MUTLAKA nokta (.) ile bitsin
        - MUTLAKA tam bir cümle olsun
        - Gerçek motivasyonu gizlesin ama ipucu versin
        - Örnek: "İş ortağı olarak birlikte çalışıyorlardı." (44 karakter)
        - Örnek: "Genellikle sakin ama bazen sinirli olurdu." (46 karakter)
        
        Her bölümü detaylı yaz. Hiçbir cümleyi yarıda bırakma.
        Suçlu olduğu belli olmasın ama ipuçları gizli olsun.
        `;

        const modifiedInfo = await callGeminiAPI(culpritModificationPrompt);
        gameState.culprit.info = modifiedInfo;
        
    } catch (error) {
        console.error('Suçlu belirleme hatası:', error);
        throw error;
    }
}

// Karakterleri ekranda gösterme
function displayCharacters() {
    charactersGrid.innerHTML = '';
    
    gameState.characters.forEach(character => {
        const characterCard = document.createElement('div');
        characterCard.className = 'character-card';
        characterCard.dataset.characterId = character.id;
        
        // Karakter bilgilerini parse et
        const lines = character.info.split('\n').filter(line => line.trim());
        let age = '', profession = '', relationship = '', personality = '';
        
        lines.forEach(line => {
            if (line.includes('Yaş:')) age = line.replace('Yaş:', '').trim();
            if (line.includes('Meslek:')) profession = line.replace('Meslek:', '').trim();
            if (line.includes('Mağdurla İlişki:')) relationship = line.replace('Mağdurla İlişki:', '').trim();
            if (line.includes('Genel Kişilik:')) personality = line.replace('Genel Kişilik:', '').trim();
        });
        
        // Gösterilecek metni seç (önce ilişki, yoksa kişilik)
        let displayText = relationship || personality;
        
        // Metin uzunluğunu kontrol et - artık AI 50-60 karakter arası tam cümle veriyor
        // Ama yine de kontrol edelim
        if (displayText.length < 30) {
            // Çok kısa ise her iki metni birleştir
            displayText = relationship && personality ? 
                `${relationship} ${personality}` : displayText;
        }
        
        // Maksimum 65 karakter ile sınırla ve nokta ile bitir
        if (displayText.length > 65) {
            // Son noktaya kadar al
            const lastDot = displayText.lastIndexOf('.', 65);
            if (lastDot > 30) {
                displayText = displayText.substring(0, lastDot + 1);
            } else {
                displayText = displayText.substring(0, 62) + '...';
            }
        } else if (!displayText.endsWith('.') && !displayText.endsWith('!') && !displayText.endsWith('?')) {
            // Noktalama yoksa ekle
            displayText += '.';
        }
        
        characterCard.innerHTML = `
            <div class="character-image">
                <img src="${character.image}" alt="${character.name}" />
            </div>
            <div class="character-name">${character.name}</div>
            <div class="character-details">${age} - ${profession}</div>
            <div class="character-story">${displayText}</div>
        `;
        
        characterCard.addEventListener('click', () => selectCharacter(character));
        charactersGrid.appendChild(characterCard);
    });
}

// Olay bilgilerini gösterme
function displayCaseInfo() {
    const caseStory = document.getElementById('caseStory');
    const suspectsList = document.getElementById('suspectsList');
    
    // Mağdur bilgilerini parse et
    const victimLines = gameState.caseInfo.victim.split('\n').filter(line => line.trim());
    let victimName = '', victimAge = '', victimGender = '', victimJob = '', victimFeatures = '';
    
    victimLines.forEach(line => {
        if (line.includes('İsim:')) victimName = line.replace('İsim:', '').trim();
        if (line.includes('Yaş:')) victimAge = line.replace('Yaş:', '').trim();
        if (line.includes('Cinsiyet:')) victimGender = line.replace('Cinsiyet:', '').trim();
        if (line.includes('Meslek:')) victimJob = line.replace('Meslek:', '').trim();
        if (line.includes('Özellikler:')) victimFeatures = line.replace('Özellikler:', '').trim();
    });
    
    caseStory.innerHTML = `
        <div class="case-location">
            📍 ${gameState.caseInfo.city} - ${gameState.caseInfo.location}
        </div>
        <div class="case-details">
            <strong>Olay Zamanı:</strong> Bugün saat ${gameState.caseInfo.time} sularında
        </div>
        <div class="case-victim">
            <strong>${victimAge} yaşındaki ${victimName}</strong> (${victimGender}, ${victimJob}) ${gameState.caseInfo.crime.description}
            <br><br>
            <strong>Mağdur Özellikleri:</strong> ${victimFeatures}
        </div>
        <div class="case-details">
            Polis ekipleri olay yerine çağrıldı ve ilk incelemeler yapıldı. 
            Şüpheliler belirlendi ve ifadeleri alınmak üzere karakola götürüldü.
            <br><br>
            <strong>Göreviniz:</strong> Şüphelilerle konuşarak gerçek suçluyu bulun!
        </div>
    `;
    
    // Şüphelileri göster
    suspectsList.innerHTML = '';
    gameState.characters.forEach(character => {
        const suspectCard = document.createElement('div');
        suspectCard.className = 'suspect-card';
        
        suspectCard.innerHTML = `
            <div class="suspect-image">
                <img src="${character.image}" alt="${character.name}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;" />
            </div>
            <div class="suspect-name">${character.name}</div>
        `;
        
        suspectsList.appendChild(suspectCard);
    });
}

// Karakter seçme
function selectCharacter(character) {
    // Önceki seçimi kaldır
    document.querySelectorAll('.character-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Yeni karakteri seç
    document.querySelector(`[data-character-id="${character.id}"]`).classList.add('selected');
    gameState.selectedCharacter = character;
    
    selectedCharacterDiv.innerHTML = `
        <strong>${character.name}</strong> seçildi
        <br><small>${character.emotion} - Soru sormaya hazır</small>
    `;
    
    askQuestionBtn.disabled = !questionInput.value.trim();
    
    // Bu karakterle olan konuşma geçmişini göster
    displayConversationHistory(character.id);
}

// Soru sorma
async function askQuestion() {
    const question = questionInput.value.trim();
    if (!question || !gameState.selectedCharacter) return;
    
    try {
        askQuestionBtn.disabled = true;
        askQuestionBtn.textContent = 'Cevap bekleniyor...';
        
        // Karakter profili ve konuşma geçmişi
        const character = gameState.selectedCharacter;
        const conversationContext = gameState.conversations[character.id]
            .map(conv => `S: ${conv.question}\nC: ${conv.answer}`)
            .join('\n\n');
        
        const questionPrompt = `
        Sen ${character.name} adlı bir karaktersin ve polis tarafından sorgulanıyorsun.
        
        Olay Bilgileri:
        - Yer: ${gameState.caseInfo.city} - ${gameState.caseInfo.location}
        - Zaman: ${gameState.caseInfo.time}
        - Mağdur: ${gameState.caseInfo.victim.split('\n')[0]} ${gameState.caseInfo.crime.description}
        
        Senin ÖNCEDENBELİRLENMİŞ bilgilerin: ${character.info}
        Duygu durumun: ${character.emotion}
        Karakteristiklerin: ${character.traits.join(', ')}
        
        ÖNEMLİ KURALLAR:
        ${character.isCulprit ? 
            `- Sen suçlusun ama bunu doğrudan belli etme
            - Yukarıdaki bilgilerde yazanlarla çelişkili cevaplar ver
            - Özellikle "Olay Gördü", "Son Görüşme", "O Gün Durumu" konularında tutarsız ol
            - Savunmacı davran, gergin ol
            - Detayları karıştır, zamanları yanlış söyle` : 
            `- Sen masumsun ve yukarıdaki bilgilere TAMAMEN sadık kal
            - "Olay Gördü", "Son Görüşme", "O Gün Durumu" bilgilerini doğru söyle
            - Samimi ve dürüst cevaplar ver
            - Hatırladığın her detayı doğru anlat`
        }
        
        Önceki konuşma:
        ${conversationContext}
        
        Yeni soru: ${question}
        
        Bu soruya ${character.emotion} duygusuna sahip ${character.name} olarak cevap ver.
        Yukarıdaki kuralları takip et. Maksimum 2-3 cümle olsun.
        `;
        
        const answer = await callGeminiAPI(questionPrompt);
        
        // Konuşmayı kaydet
        gameState.conversations[character.id].push({
            question: question,
            answer: answer.trim()
        });
        
        // Konuşma geçmişini güncelle
        displayConversationHistory(character.id);
        
        // Input'u temizle
        questionInput.value = '';
        askQuestionBtn.disabled = true;
        
    } catch (error) {
        console.error('Soru sorma hatası:', error);
        alert('Soru sorulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
        askQuestionBtn.disabled = false;
        askQuestionBtn.textContent = 'Soru Sor';
    }
}

// Konuşma geçmişini gösterme
function displayConversationHistory(characterId) {
    const conversations = gameState.conversations[characterId] || [];
    
    if (conversations.length === 0) {
        conversationHistory.innerHTML = '<p style="color: #666; font-style: italic;">Henüz soru sorulmadı.</p>';
        return;
    }
    
    conversationHistory.innerHTML = conversations.map(conv => `
        <div class="conversation-item">
            <div class="question">S: ${conv.question}</div>
            <div class="answer">C: ${conv.answer}</div>
        </div>
    `).join('');
    
    // En alta scroll
    conversationHistory.scrollTop = conversationHistory.scrollHeight;
}

// Suçlama ekranını gösterme
function showAccusationScreen() {
    gameState.gamePhase = 'accusation';
    showScreen('accusation');
    
    const accusationGrid = document.getElementById('accusationGrid');
    accusationGrid.innerHTML = '';
    
    gameState.characters.forEach(character => {
        const accusationCard = document.createElement('div');
        accusationCard.className = 'accusation-card';
        
        accusationCard.innerHTML = `
            <div class="character-image">
                <img src="${character.image}" alt="${character.name}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;" />
            </div>
            <h3>${character.name}</h3>
            <p>${character.gender === 'male' ? 'Erkek' : 'Kadın'}</p>
        `;
        
        accusationCard.addEventListener('click', () => makeAccusation(character));
        accusationGrid.appendChild(accusationCard);
    });
}

// Suçlama yapma
function makeAccusation(accusedCharacter) {
    gameState.gamePhase = 'result';
    showScreen('result');
    
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');
    const realCulpritInfo = document.getElementById('realCulpritInfo');
    
    const isCorrect = accusedCharacter.id === gameState.culprit.id;
    
    if (isCorrect) {
        resultTitle.textContent = '🎉 Tebrikler!';
        resultTitle.className = 'correct';
        resultMessage.innerHTML = `
            <p>Doğru tahminde bulundunuz! <strong>${accusedCharacter.name}</strong> gerçekten de suçluydu.</p>
            <p>Harika dedektiflik becerileri gösterdiniz!</p>
        `;
    } else {
        resultTitle.textContent = '❌ Yanlış Tahmin';
        resultTitle.className = 'incorrect';
        resultMessage.innerHTML = `
            <p><strong>${accusedCharacter.name}</strong> masum bir karakterdi.</p>
            <p>Gerçek suçlu <strong>${gameState.culprit.name}</strong> idi.</p>
        `;
    }
    
    // Gerçek suçlunun bilgilerini göster
    realCulpritInfo.innerHTML = `
        <h3>🔍 Gerçek Suçlu: ${gameState.culprit.name}</h3>
        <div style="display: flex; align-items: center; gap: 15px; margin: 15px 0;">
            <img src="${gameState.culprit.image}" alt="${gameState.culprit.name}" 
                 style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;" />
            <div>
                <p><strong>Duygu Durumu:</strong> ${gameState.culprit.emotion}</p>
                <p><strong>Cinsiyet:</strong> ${gameState.culprit.gender === 'male' ? 'Erkek' : 'Kadın'}</p>
            </div>
        </div>
        <div style="margin-top: 10px;">
            <strong>Hikayesi:</strong><br>
            ${gameState.culprit.info.replace(/\n/g, '<br>')}
        </div>
    `;
}

// Ekran değiştirme
function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    switch(screenName) {
        case 'start':
            startScreen.classList.add('active');
            break;
        case 'loading':
            loadingScreen.classList.add('active');
            break;
        case 'case':
            caseScreen.classList.add('active');
            break;
        case 'game':
            gameScreen.classList.add('active');
            break;
        case 'accusation':
            accusationScreen.classList.add('active');
            break;
        case 'result':
            resultScreen.classList.add('active');
            break;
    }
}

// Enter tuşu ile soru sorma
questionInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!askQuestionBtn.disabled) {
            askQuestion();
        }
    }
});

// Sayfa yüklendiğinde başlangıç ekranını göster
document.addEventListener('DOMContentLoaded', function() {
    showScreen('start');
});
