async function getWeather() {
    const apiKey = 'fc7df0afe8a00adfad79a7d934a487b5';
    const lokasi = document.getElementById('cityInput').value.trim();
    const result = document.getElementById('weatherResult');
    const mapLoc = document.getElementById('map-location');

    if (!lokasi) {
        result.innerHTML = 'Masukkan nama lokasi.';
        if (mapLoc) mapLoc.textContent = '';
        return;
    }

    try {
        // Geo lokasi
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(lokasi)}`);
        const geoData = await geoRes.json();
        if (!geoData.length) throw new Error("Lokasi tidak ditemukan.");

        const { lat, lon, display_name } = geoData[0];

        // Data cuaca
        const cuacaRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=id`);
        const cuaca = await cuacaRes.json();

        // Icon cuaca
        const iconUrl = `https://openweathermap.org/img/wn/${cuaca.weather[0].icon}@2x.png`;

        result.innerHTML = `
            <div style="display:flex;flex-direction:row;gap:24px;align-items:center;">
                <img src="${iconUrl}" alt="icon" style="width:80px;height:80px;">
                <div>
                    <div style="font-size:2.8rem;font-weight:700;line-height:1;">${Math.round(cuaca.main.temp)}°C</div>
                    <div style="font-size:1.2rem;color:#666;">${cuaca.weather[0].description.charAt(0).toUpperCase() + cuaca.weather[0].description.slice(1)}</div>
                    <div style="margin-top:10px;font-size:1rem;color:#888;">Terasa seperti ${Math.round(cuaca.main.feels_like)}°C</div>
                </div>
            </div>
            <hr style="margin:18px 0;">
            <div style="font-size:1.1rem;font-weight:500;margin-bottom:10px;">${display_name}</div>
            <div style="display:flex;flex-direction:row;gap:32px;font-size:1rem;">
                <div>Angin<br><b>${cuaca.wind.speed} m/s</b></div>
                <div>Kelembapan<br><b>${cuaca.main.humidity}%</b></div>
                <div>Tekanan<br><b>${cuaca.main.pressure} hPa</b></div>
            </div>
        `;

        // Map
        if (window.myMap) window.myMap.remove();
        window.myMap = L.map('map').setView([lat, lon], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: ''
        }).addTo(window.myMap);
        L.marker([lat, lon]).addTo(window.myMap);

        // Map label
        if (mapLoc) mapLoc.textContent = display_name.split(',')[0].toUpperCase();
    } catch (e) {
        result.innerHTML = `❌ ${e.message}`;
        if (mapLoc) mapLoc.textContent = '';
    }
}
