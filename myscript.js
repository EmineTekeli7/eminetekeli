/* ===========================================
   myscript.js — Emine'nin Mağazası
   =========================================== */

/* -------------------------------------------
   HAMBURGER MENÜ
   ------------------------------------------- */

/* Hamburger butonuna tıklanınca nav-links açılır/kapanır */
var hamburger = document.getElementById("hamburger");
var navLinks = document.getElementById("navLinks");

if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
        navLinks.classList.toggle("acik");
    });
}

/* -------------------------------------------
   SEPET VERİSİ
   ------------------------------------------- */

/* Sayfa yüklenince localStorage'dan sepeti oku */
var sepet = JSON.parse(localStorage.getItem("sepetim")) || [];

/* -------------------------------------------
   SEPETE EKLE
   ------------------------------------------- */

/* Tüm "Sepete Ekle" butonlarını bul ve tıklama olayı ekle */
document.querySelectorAll(".btn-sepet-ekle").forEach(function (buton) {
    buton.addEventListener("click", function () {
        var id = this.getAttribute("data-id");
        var ad = this.getAttribute("data-ad");
        var fiyat = Number(this.getAttribute("data-fiyat"));

        /* Ürün sepette zaten varsa sadece adedini artır */
        var mevcutUrun = sepet.find(function (item) {
            return item.id === id;
        });

        if (mevcutUrun) {
            mevcutUrun.adet += 1;
        } else {
            sepet.push({ id: id, ad: ad, fiyat: fiyat, adet: 1 });
        }

        /* Güncel sepeti localStorage'a kaydet */
        localStorage.setItem("sepetim", JSON.stringify(sepet));
        alert(ad + " sepete eklendi.");
    });
});

/* -------------------------------------------
   SEPETİ GÖSTER (sepet.html)
   ------------------------------------------- */

var sepetListesi = document.getElementById("sepet-listesi");
var toplamFiyatSpan = document.getElementById("toplam-fiyat");

/* Bu eleman sadece sepet.html'de var, diğer sayfalarda çalışmaz */
if (sepetListesi) {
    sepetiGoster();
}

function sepetiGoster() {
    sepetListesi.innerHTML = "";
    var toplam = 0;

    if (sepet.length === 0) {
        /* Sepet boşsa mesaj göster */
        var bosLi = document.createElement("li");
        bosLi.className = "sepet-bos-mesaj";
        bosLi.textContent = "Sepetiniz şu anda boş.";
        sepetListesi.appendChild(bosLi);
        if (toplamFiyatSpan) {
            toplamFiyatSpan.textContent = "0";
        }
        return;
    }

    /* Sepetteki her ürün için bir satır oluştur */
    sepet.forEach(function (urun, index) {
        var urunToplam = urun.fiyat * urun.adet;
        toplam += urunToplam;

        var li = document.createElement("li");
        /* Stil CSS'deki .sepet-kalemi kuralıyla verilir, inline style yok */
        li.className = "sepet-kalemi";

        /* Ürün adı ve tutarı gösteren metin */
        var metin = document.createElement("span");
        metin.className = "sepet-kalemi-metin";
        metin.textContent = urun.ad + " (x" + urun.adet + ") — " + urunToplam + " TL";

        /* Ürünü sepetten kaldır butonu */
        var kaldir = document.createElement("button");
        kaldir.className = "btn-kaldir";
        kaldir.textContent = "Kaldır";
        kaldir.setAttribute("data-index", index);

        /* Kaldır butonuna tıklanınca o ürünü diziden çıkar */
        kaldir.addEventListener("click", function () {
            var idx = Number(this.getAttribute("data-index"));
            sepet.splice(idx, 1);
            localStorage.setItem("sepetim", JSON.stringify(sepet));
            sepetiGoster();
        });

        li.appendChild(metin);
        li.appendChild(kaldir);
        sepetListesi.appendChild(li);
    });

    /* Toplam fiyatı güncelle */
    if (toplamFiyatSpan) {
        toplamFiyatSpan.textContent = toplam;
    }
}

/* -------------------------------------------
   SEPETİ TEMİZLE
   ------------------------------------------- */

var btnTemizle = document.getElementById("btn-temizle");

if (btnTemizle) {
    btnTemizle.addEventListener("click", function () {
        sepet = [];
        localStorage.setItem("sepetim", JSON.stringify(sepet));
        sepetiGoster();
    });
}

/* -------------------------------------------
   SİPARİŞİ TAMAMLA → ÖDEME SAYFASINA YÖNLENDİR
   ------------------------------------------- */

var btnOnayla = document.getElementById("btn-onayla");

if (btnOnayla) {
    btnOnayla.addEventListener("click", function () {
        if (sepet.length === 0) {
            alert("Sepetiniz boşken sipariş veremezsiniz!");
        } else {
            window.location.href = "odeme.html";
        }
    });
}

/* -------------------------------------------
   ÖDEME FORMU (odeme.html)
   ------------------------------------------- */

var odemeFormu = document.getElementById("odemeFormu");

if (odemeFormu) {
    odemeFormu.addEventListener("submit", function (e) {
        e.preventDefault();
        alert("Ödemeniz alındı. Teşekkürler!");
        /* Sipariş tamamlandı, sepeti temizle */
        localStorage.removeItem("sepetim");
        window.location.href = "../index.html";
    });
}

/* -------------------------------------------
   İLETİŞİM FORMU DOĞRULAMA (iletisim.html)
   ------------------------------------------- */

var iletisimFormu = document.getElementById("iletisimFormu");

if (iletisimFormu) {
    iletisimFormu.addEventListener("submit", function (e) {
        e.preventDefault();

        var adSoyad = document.getElementById("adSoyad").value.trim();
        var eposta = document.getElementById("eposta").value.trim();
        var mesaj = document.getElementById("mesaj").value.trim();
        var mesajKutu = document.getElementById("formMesaj");

        /* Boş alan kontrolü */
        if (!adSoyad || !eposta || !mesaj) {
            mesajKutu.className = "form-mesaj hata";
            mesajKutu.textContent = "Lütfen tüm alanları doldurun.";
            return;
        }

        /* E-posta biçim kontrolü */
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(eposta)) {
            mesajKutu.className = "form-mesaj hata";
            mesajKutu.textContent = "Geçerli bir e-posta adresi giriniz.";
            return;
        }

        /* Tüm kontroller geçildi, başarı mesajı göster */
        mesajKutu.className = "form-mesaj basari";
        mesajKutu.textContent = "Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.";
        iletisimFormu.reset();
    });
}

/* ===========================================
   SAYI TAHMİN OYUNU (oyun.html)
   1-100 arasında rastgele sayıyı 7 denemede bul
   =========================================== */

/* Oyun değişkenleri */
var hedefSayi = 0;
var kalanHak = 7;
var oyunBitti = false;

/* Sayfa oyun sayfasıysa oyunu başlat */
var oyunAlani = document.getElementById("oyunAlani");

if (oyunAlani) {
    oyunuBaslat();
}

function oyunuBaslat() {
    /* 1-100 arası rastgele hedef belirle */
    hedefSayi = Math.floor(Math.random() * 100) + 1;
    kalanHak = 7;
    oyunBitti = false;

    var mesajEl = document.getElementById("oyunMesaj");
    var denemeEl = document.getElementById("oyunDeneme");
    var girdiEl = document.getElementById("oyunGirdi");
    var tahminBtn = document.getElementById("tahminBtn");

    if (mesajEl) {
        mesajEl.className = "oyun-mesaj";
        mesajEl.textContent = "1 ile 100 arasında bir sayı tuttum. Tahmin et!";
    }
    if (denemeEl) {
        denemeEl.textContent = "Kalan hak: 7 / 7";
    }
    if (girdiEl) {
        girdiEl.value = "";
        girdiEl.disabled = false;
        girdiEl.focus();
    }
    if (tahminBtn) {
        tahminBtn.disabled = false;
    }
}

function tahminYap() {
    /* Oyun bittiyse hiçbir şey yapma */
    if (oyunBitti) return;

    var girdiEl = document.getElementById("oyunGirdi");
    var mesajEl = document.getElementById("oyunMesaj");
    var denemeEl = document.getElementById("oyunDeneme");
    var tahminBtn = document.getElementById("tahminBtn");

    var tahmin = parseInt(girdiEl.value);

    /* Geçersiz giriş kontrolü */
    if (isNaN(tahmin) || tahmin < 1 || tahmin > 100) {
        mesajEl.className = "oyun-mesaj yanlis";
        mesajEl.textContent = "Lütfen 1 ile 100 arasında bir sayı gir!";
        return;
    }

    kalanHak -= 1;
    girdiEl.value = "";

    if (tahmin === hedefSayi) {
        /* Doğru tahmin */
        mesajEl.className = "oyun-mesaj dogru";
        mesajEl.textContent = "Tebrikler! " + hedefSayi + " sayısını " + (7 - kalanHak) + ". denemede buldun! 🎉 Kupon kodunuz: SEPET100";
        oyunBitti = true;
        girdiEl.disabled = true;
        tahminBtn.disabled = true;
    } else if (kalanHak === 0) {
        /* Haklar bitti */
        mesajEl.className = "oyun-mesaj yanlis";
        mesajEl.textContent = "Hakların bitti! Doğru cevap: " + hedefSayi + ". Tekrar dene!";
        oyunBitti = true;
        girdiEl.disabled = true;
        tahminBtn.disabled = true;
    } else if (tahmin < hedefSayi) {
        /* Küçük tahmin */
        mesajEl.className = "oyun-mesaj yanlis";
        mesajEl.textContent = tahmin + " küçük, daha büyük bir sayı dene.";
    } else {
        /* Büyük tahmin */
        mesajEl.className = "oyun-mesaj yanlis";
        mesajEl.textContent = tahmin + " büyük, daha küçük bir sayı dene.";
    }

    /* Kalan hak sayısını güncelle */
    if (denemeEl) {
        denemeEl.textContent = "Kalan hak: " + kalanHak + " / 7";
    }
}

/* Enter tuşu ile tahmin yapma */
var oyunGirdiEl = document.getElementById("oyunGirdi");
if (oyunGirdiEl) {
    oyunGirdiEl.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            tahminYap();
        }
    });
}