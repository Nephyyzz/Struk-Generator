let products = [];

function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
    }).format(amount);
}

function addProduct() {
    const productName = document.getElementById('product-name').value;
    const productPrice = document.getElementById('product-price').value;

    if (productName && productPrice) {
        products.push({ name: productName, price: productPrice });
        renderProductList();
        document.getElementById('product-name').value = ''; 
        document.getElementById('product-price').value = '';
    }
}

function removeProduct(index) {
    products.splice(index, 1);
    renderProductList();
}

function clearProducts() {
    products = [];
    renderProductList();
    document.getElementById('receipt').style.display = 'none';
}

function generateReceipt() {
    const storeName = document.getElementById('store-name').value || 'Nama Toko';
    const transactionId = document.getElementById('transaction-id').value || 'ID Transaksi';
    const customerNumber = document.getElementById('customer-number').value || 'Nomor Pelanggan';
    const adminPrice = document.getElementById('admin-price').value || '0';

    if (!storeName || !transactionId || !customerNumber || !adminPrice) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Semua field harus diisi!',
        });
        return;
    }

    let total = 0;
    let productDetails = '';
    products.forEach((product) => {
        productDetails += `- ${product.name.padEnd(20, ' ')}${formatRupiah(product.price).padStart(10, ' ')}\n`;
        total += parseFloat(product.price);
    });

    const currentDate = new Date().toLocaleDateString('id-ID');

    const receiptHtml = `
============================
    ${storeName}
============================
ID Transaksi: ${transactionId}
Nomor Pelanggan: ${customerNumber}

Barang:
${productDetails}----------------------------
Biaya Admin: ${formatRupiah(adminPrice)}
Total Harga: ${formatRupiah(total + parseFloat(adminPrice))}

Tanggal Pembelian: ${currentDate}

============================
Terima Kasih telah berbelanja
   di ${storeName}!
============================
`;

    document.getElementById('receipt-content').innerText = receiptHtml;
    document.getElementById('receipt').style.display = 'block';

    Swal.fire({
        icon: 'success',
        title: 'Struk berhasil dicetak!',
        text: 'Anda dapat menyimpan struk ini atau melanjutkan transaksi lainnya.',
        confirmButtonText: 'OK'
    });
}

function downloadReceipt() {
    const receipt = document.getElementById('receipt');
    if (!receipt) {
        alert('Tidak ada struk untuk diunduh.');
        return;
    }

    html2canvas(receipt, { scale: 2 }).then(function(canvas) {
        const link = document.createElement('a');
        link.download = 'struk.jpg';
        link.href = canvas.toDataURL('image/jpeg');
        link.click();
    }).catch(function(error) {
        console.error('Terjadi kesalahan saat mengunduh struk:', error);
        alert('Terjadi kesalahan. Silakan coba lagi.');
    });
}

function renderProductList() {
    const productListContainer = document.getElementById('product-list');
    productListContainer.innerHTML = '';

    products.forEach((product, index) => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <span>${product.name}</span>
            <span>${formatRupiah(product.price)}</span>
            <button onclick="removeProduct(${index})">🗑️</button>
        `;
        productListContainer.appendChild(productItem);
    });
}