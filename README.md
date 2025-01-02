### Closures | Inner Function

**Definisi Closure:**
- "Kombinasi antara function dan lexical scope di dalam function tersebut." - MDN
- "Sebuah function ketika memiliki akses ke parent scope-nya meskipun parent scope-nya sudah selesai dieksekusi." - W3School
- "Sebuah function dikembalikan oleh function yang lain yang memiliki akses ke lingkungan saat ia diciptakan." - Code Fellow
- "Sebuah function yang sudah memiliki data, hasil dari function yang lain." - Techsith

---

### Lexical Scope
Lexical scope merupakan cara penentuan scope variabel berdasarkan posisi penulisan kode di dalam file. Closure bekerja berdasarkan prinsip ini.

#### Contoh:
```javascript
function init() {
    let nama = 'David'; // Variabel lokal dalam scope function init
    return function () {
        console.log(nama); // Masih dapat mengakses variabel pada parent (closure)
    };
}
let panggilNama = init(); // init selesai dieksekusi, namun function hasil return-nya masih bisa mengakses 'nama'
panggilNama(); // Output: David
```

---

### Closure pada Fungsi `ucapkanSalam` di `main.js`

Closure di JavaScript memungkinkan fungsi dalam (*inner function*) untuk "mengingat" variabel dari lingkup induknya (*outer function*), bahkan setelah fungsi induknya selesai dieksekusi.

#### Contoh pada `main.js`:
```javascript
function ucapkanSalam(waktu) {
    return function(nama) {
        console.log(`Halo ${nama} Selamat ${waktu}!`);
    };
}
```

Ketika fungsi `ucapkanSalam` dipanggil, fungsi yang di-*return* menyimpan nilai `waktu` dalam lingkupnya sehingga dapat digunakan kemudian hari.

#### Urutan Eksekusi dan Closure:
Misalnya:
```javascript
let selamatPagi = ucapkanSalam('Pagi');
let selamatMalam = ucapkanSalam('Malam');
selamatPagi('David');  // Output: Halo David Selamat Pagi!
selamatMalam('David'); // Output: Halo David Selamat Malam!
```
- `selamatPagi` adalah fungsi yang "mengingat" `waktu` bernilai `'Pagi'`.
- `selamatMalam` adalah fungsi yang "mengingat" `waktu` bernilai `'Malam'`.

Closure ini memungkinkan fungsi seperti `selamatPagi` dan `selamatMalam` bekerja dengan data yang sudah "dikunci" saat `ucapkanSalam` dipanggil, meskipun eksekusi fungsi induknya selesai.

---

### Tujuan Membuat Closure

**1. Membuat Function Factories:**
Closure memungkinkan Anda menghasilkan fungsi baru dengan parameter berbeda.
Contoh:
```javascript
let selamatPagi = ucapkanSalam('Pagi');
selamatPagi('David'); // Halo David Selamat Pagi!
```

**2. Mengenkapsulasi Data:**
Closure dapat menjaga agar variabel tetap bersifat privat (tidak dapat diakses langsung dari luar fungsi).
```javascript
function counter() {
    let count = 0; // Variabel privat
    return function () {
        count++;
        console.log(count);
    };
}
let hitung = counter();
hitung(); // Output: 1
hitung(); // Output: 2
```

Dengan closure, Anda dapat menciptakan fungsi yang lebih fleksibel dan aman.