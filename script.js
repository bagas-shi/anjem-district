function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);
}

function calculateEstimate() {
    const distanceInput = document.getElementById('distance');
    const distanceVal = parseFloat(distanceInput.value);
    const errorMsg = document.getElementById('distance-error');
    const resultContainer = document.getElementById('result-container');

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

    // Hitung Tarif Dasar Jarak (Berjenjang)
    let baseTariff = 5000; // 0 - 2 km flat

    if (distanceVal > 2) {
        // Rentang 2.1 - 5 km
        let diff2to5 = Math.min(distanceVal, 5) - 2;
        baseTariff += diff2to5 * 2500;
    }

    if (distanceVal > 5) {
        // Rentang 5.1 - 10 km
        let diff5to10 = Math.min(distanceVal, 10) - 5;
        baseTariff += diff5to10 * 2000;
    }

    if (distanceVal > 10) {
        // Di atas 10 km
        let diffAbove10 = distanceVal - 10;
        baseTariff += diffAbove10 * 1500;
    }

    // Cek Biaya Tambahan
    let extraCost = 0;
    const isRain = document.getElementById('option-rain').checked;
    const isNight = document.getElementById('option-night').checked;

    if (isRain) {
        extraCost += 2000;
    }

    if (isNight) {
        extraCost += 1000;
    }

    let totalTariff = baseTariff + extraCost;

    // Aturan pembulatan
    const ratusan = totalTariff % 1000;
    const ribuan = totalTariff - ratusan;

    if (ratusan >= 100 && ratusan <= 700) {
        totalTariff = ribuan + 500;
    } else if (ratusan > 700) {
        totalTariff = ribuan + 1000;
    } else {
        // 0 - 99 dibulatkan ke bawah (0)
        totalTariff = ribuan;
    }

    // Update UI
    document.getElementById('cost-total').textContent = formatRupiah(totalTariff);
}

// Event listeners untuk kalkulasi real-time
document.getElementById('distance').addEventListener('input', calculateEstimate);
document.getElementById('option-rain').addEventListener('change', calculateEstimate);
document.getElementById('option-night').addEventListener('change', calculateEstimate);
