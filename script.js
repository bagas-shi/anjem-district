// ===============================
// State kendaraan aktif
// ===============================
let activeVehicle = 'motor';

function setVehicle(type) {
    activeVehicle = type;

    // Update tampilan tombol
    document.getElementById('btn-motor').classList.toggle('active', type === 'motor');
    document.getElementById('btn-mobil').classList.toggle('active', type === 'mobil');

    const kondisiContainer = document.getElementById('kondisi-container');
    const kondisiMobilContainer = document.getElementById('kondisi-mobil-container');

    if (type === 'mobil') {
        // Sembunyikan kondisi motor, tampilkan kondisi mobil
        kondisiContainer.style.display = 'none';
        kondisiMobilContainer.style.display = '';
        document.getElementById('option-rain').checked = false;
        document.getElementById('option-night').checked = false;
    } else {
        // Tampilkan kondisi motor, sembunyikan kondisi mobil
        kondisiContainer.style.display = '';
        kondisiMobilContainer.style.display = 'none';
        document.getElementById('mobil-option-night').checked = false;
        document.getElementById('mobil-option-rain').checked = false;
        // Reset radio kos-type
        const checkedKos = document.querySelector('input[name="kos-type"]:checked');
        if (checkedKos) checkedKos.checked = false;
    }

    // Hitung ulang estimasi
    calculateEstimate();
}

// ===============================
// Format ke Rupiah
// ===============================
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);
}

// ===============================
// Hitung Tarif Motor (berjenjang)
// ===============================
function calcMotor(d) {
    let tariff = 5000; // 0 - 2 km flat

    if (d > 2) {
        let diff = Math.min(d, 5) - 2;
        tariff += diff * 2500;
    }
    if (d > 5) {
        let diff = Math.min(d, 10) - 5;
        tariff += diff * 2000;
    }
    if (d > 10) {
        tariff += (d - 10) * 1500;
    }

    return tariff;
}

// ===============================
// Hitung Tarif Mobil (berjenjang)
// ===============================
function calcMobil(d) {
    let tariff = 0;

    // 0 - 2 km: Rp7.000/km
    tariff += Math.min(d, 2) * 7000;

    if (d > 2) {
        // 2.1 - 5 km: Rp6.000/km
        let diff = Math.min(d, 5) - 2;
        tariff += diff * 6000;
    }
    if (d > 5) {
        // 5.1 - 10 km: Rp5.500/km
        let diff = Math.min(d, 10) - 5;
        tariff += diff * 5500;
    }
    if (d > 10) {
        // 10.1 - 15 km: Rp4.500/km
        let diff = Math.min(d, 15) - 10;
        tariff += diff * 4500;
    }
    if (d > 15) {
        // 15.1 - 40 km: Rp4.000/km
        let diff = Math.min(d, 40) - 15;
        tariff += diff * 4000;
    }
    if (d > 40) {
        // 40.1 - 60 km: Rp4.500/km
        let diff = Math.min(d, 60) - 40;
        tariff += diff * 4500;
    }
    if (d > 60) {
        // > 60 km: Rp4.000/km
        tariff += (d - 60) * 4000;
    }

    // Minimum argo mobil
    const MINIMUM_MOBIL = 15000;
    if (tariff < MINIMUM_MOBIL) tariff = MINIMUM_MOBIL;

    return tariff;
}

// ===============================
// Fungsi Pembulatan Harga
// ===============================
function bulatkan(total) {
    const ratusan = total % 1000;
    const ribuan = total - ratusan;

    if (ratusan >= 100 && ratusan <= 700) {
        return ribuan + 500;
    } else if (ratusan > 700) {
        return ribuan + 1000;
    } else {
        return ribuan;
    }
}

// ===============================
// Fungsi Utama Kalkulasi
// ===============================
function calculateEstimate() {
    const distanceInput = document.getElementById('distance');
    const distanceVal = parseFloat(distanceInput.value);
    const errorMsg = document.getElementById('distance-error');

    // Validasi input
    if (isNaN(distanceVal) || distanceVal <= 0) {
        distanceInput.style.borderColor = '#dc3545';
        errorMsg.style.display = 'block';
        document.getElementById('cost-total').textContent = 'Rp0';
        return;
    }

    // Reset error
    distanceInput.style.borderColor = '';
    errorMsg.style.display = 'none';

    // Hitung tarif dasar sesuai kendaraan
    let baseTariff = activeVehicle === 'motor'
        ? calcMotor(distanceVal)
        : calcMobil(distanceVal);

    // Biaya tambahan sesuai kendaraan
    let extraCost = 0;

    if (activeVehicle === 'motor') {
        const isRain = document.getElementById('option-rain').checked;
        if (isRain) extraCost += 2000;

        const isNight = document.getElementById('option-night').checked;
        if (isNight) extraCost += 1000;
    } else {
        const isMobilNight = document.getElementById('mobil-option-night').checked;
        if (isMobilNight) extraCost += 2000;

        const isMobilRain = document.getElementById('mobil-option-rain').checked;
        if (isMobilRain) extraCost += 3000;

        // Radio: hanya salah satu kos yang bisa terpilih
        const selectedKos = document.querySelector('input[name="kos-type"]:checked');
        if (selectedKos) extraCost += parseInt(selectedKos.value);
    }


    let totalTariff = bulatkan(baseTariff + extraCost);

    // Update UI
    document.getElementById('cost-total').textContent = formatRupiah(totalTariff);
}

// ===============================
// Event Listeners (real-time)
// ===============================
document.getElementById('distance').addEventListener('input', calculateEstimate);
document.getElementById('option-rain').addEventListener('change', calculateEstimate);
document.getElementById('option-night').addEventListener('change', calculateEstimate);
document.getElementById('mobil-option-night').addEventListener('change', calculateEstimate);
document.getElementById('mobil-option-rain').addEventListener('change', calculateEstimate);
document.getElementById('mobil-option-kos-ringan').addEventListener('change', calculateEstimate);
document.getElementById('mobil-option-kos-berat').addEventListener('change', calculateEstimate);
