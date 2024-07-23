# Rezervasyon Sistemi

Bu proje, bayilerin kendi rezervasyonlarını yönetebileceği, adminlerin bayileri yönetebileceği ve kullanıcıların rezervasyonlarını kontrol edebileceği bir rezervasyon sistemidir. Proje, Node.js, Prisma, MongoDB ve JWT kullanılarak geliştirilmiştir.

## Özellikler

- **Admin ve Bayi Kayıt ve Giriş:** Admin ve bayiler için JWT kullanarak kimlik doğrulama.
- **Rezervasyon Oluşturma:** Bayiler, kullanıcılar için rezervasyon oluşturabilir.
- **Rezervasyon Durum Güncellemeleri:** Geçmiş, yaklaşan ve iptal edilen rezervasyonları yönetme.
- **İstatistikler:** Adminler için toplam rezervasyon, toplam konuk ve toplam bayi bilgilerini gösterme.
- **Cron Job:** Belirli aralıklarla rezervasyon durumlarını otomatik olarak güncelleyerek geçmiş rezervasyonları belirleme.
- **API:** Bayiler ve adminler için çeşitli API endpointleri.
