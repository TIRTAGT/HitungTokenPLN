/**
 * TIRTAGT/HitungTokenPLN
 * 
 * Aplikasi kalkulator penghitung jumlah kWh atau nilai token dari pembelian listrik PLN
 * @link https://github.com/TIRTAGT/HitungTokenPLN
 * @author Matthew Tirtawidjaja <matthew@tirtagt.xyz>
 * @copyright 2025 Matthew Tirtawidjaja <matthew@tirtagt.xyz>
 * @license MIT
 */
import Data from "../types/data";

document.addEventListener("DOMContentLoaded", () => {
	new Main();
});

class Main {
	private data?: Data;
	private InputGolonganTarif: HTMLSelectElement;
	private InputGolonganTarifHelp: HTMLElement;
	private InputBatasDaya: HTMLSelectElement;
	private InputBiayaPPJ: HTMLSelectElement;
	private InputBiayaPPJManual: HTMLInputElement;
	private InputBiayaPPJManualContainer: HTMLDivElement;
	private InputBiayaPPJManualHelp: HTMLDivElement;
	private InputJumlahPembelianToken: HTMLSelectElement;
	private OutputTarifPerKwh: HTMLSpanElement;
	private OutputBiayaPPJ: HTMLSpanElement;
	private OutputNilaiBersihToken: HTMLSpanElement;
	private OutputJumlahToken: HTMLDivElement;
	private OutputAdditionalInfo: HTMLDivElement;

	private ThemeToggle: HTMLAnchorElement;

	constructor() {
		//#region Inisialisasi objek dokumen
		let InputGolonganTarif = document.querySelector<HTMLSelectElement>("#input-golongan-tarif");
		if (!InputGolonganTarif) {
			throw new Error("Input Golongan Tarif not found!");
		}
		this.InputGolonganTarif = InputGolonganTarif;

		let InputGolonganTarifHelp = document.querySelector<HTMLDivElement>("#input-golongan-tarif-help");
		if (!InputGolonganTarifHelp) {
			throw new Error("Input Golongan Tarif Help not found!");
		}
		this.InputGolonganTarifHelp = InputGolonganTarifHelp;

		let InputBatasDaya = document.querySelector<HTMLSelectElement>("#input-batas-daya");
		if (!InputBatasDaya) {
			throw new Error("Input Batas Daya not found!");
		}
		this.InputBatasDaya = InputBatasDaya;

		let InputBiayaPPJ = document.querySelector<HTMLSelectElement>("#input-biaya-ppj");
		if (!InputBiayaPPJ) {
			throw new Error("Input Biaya PPJ not found!");
		}
		this.InputBiayaPPJ = InputBiayaPPJ;

		let InputBiayaPPJManual = document.querySelector<HTMLInputElement>("#input-biaya-ppj-manual");
		if (!InputBiayaPPJManual) {
			throw new Error("Input Biaya PPJ Manual not found!");
		}
		this.InputBiayaPPJManual = InputBiayaPPJManual;

		let InputBiayaPPJManualContainer = document.querySelector<HTMLDivElement>("#input-biaya-ppj-manual-container");
		if (!InputBiayaPPJManualContainer) {
			throw new Error("Input Biaya PPJ Manual Container not found!");
		}
		this.InputBiayaPPJManualContainer = InputBiayaPPJManualContainer;

		let InputBiayaPPJManualHelp = document.querySelector<HTMLDivElement>("#input-biaya-ppj-manual-help");
		if (!InputBiayaPPJManualHelp) {
			throw new Error("Input Biaya PPJ Manual Help not found!");
		}
		this.InputBiayaPPJManualHelp = InputBiayaPPJManualHelp;

		let InputJumlahPembelianToken = document.querySelector<HTMLSelectElement>("#input-jumlah-pembelian-token");
		if (!InputJumlahPembelianToken) {
			throw new Error("Input Jumlah Pembelian Token not found!");
		}
		this.InputJumlahPembelianToken = InputJumlahPembelianToken;

		let OutputTarifPerKwh = document.querySelector<HTMLSpanElement>("#output-tarif-per-kwh");
		if (!OutputTarifPerKwh) {
			throw new Error("Output Tarif per kWh not found!");
		}
		this.OutputTarifPerKwh = OutputTarifPerKwh;

		let OutputBiayaPPJ = document.querySelector<HTMLSpanElement>("#output-biaya-ppj");
		if (!OutputBiayaPPJ) {
			throw new Error("Output Biaya PPJ not found!");
		}
		this.OutputBiayaPPJ = OutputBiayaPPJ;

		let OutputNilaiBersihToken = document.querySelector<HTMLSpanElement>("#output-nilai-bersih-token");
		if (!OutputNilaiBersihToken) {
			throw new Error("Output Nilai Bersih Token not found!");
		}
		this.OutputNilaiBersihToken = OutputNilaiBersihToken;

		let OutputJumlahToken = document.querySelector<HTMLDivElement>("#output-jumlah-token");
		if (!OutputJumlahToken) {
			throw new Error("Output Jumlah Token not found!");
		}
		this.OutputJumlahToken = OutputJumlahToken;

		let OutputAdditionalInfo = document.querySelector<HTMLDivElement>("#output-additional-info");
		if (!OutputAdditionalInfo) {
			throw new Error("Output Additional Info not found!");
		}
		this.OutputAdditionalInfo = OutputAdditionalInfo;

		let ThemeToggle = document.querySelector<HTMLAnchorElement>("#theme-toggle");
		if (!ThemeToggle) {
			throw new Error("Theme Toggle not found!");
		}
		this.ThemeToggle = ThemeToggle;
		//#endregion

		this.ApplyTheme();

		this.ThemeToggle.addEventListener("click", () => {
			let HTML = document.querySelector("html");
			if (!HTML) {
				throw new Error("HTML element not found!");
			}

			let isCurrentlyDark = HTML.getAttribute("data-bs-theme") === "dark";
			this.ApplyTheme(!isCurrentlyDark);
		});

		this.FetchData().then(data => {
			this.PopulateGolonganTarif();
			this.AddInputListeners();
		});
	}

	ApplyTheme(isDarkOverride?: boolean) {
		let isDarkTheme = true;

		// Cek apakah kita ingin apply tema baru
		if (typeof isDarkOverride === "boolean") {
			isDarkTheme = isDarkOverride;

			// Jika bisa akses localStorage, simpan tema user
			if (localStorage) {
				localStorage.setItem("theme", isDarkTheme ? "dark" : "light");
			}
		}

		// Coba ambil tema dari simpanan localStorage
		else if (localStorage && localStorage.getItem("theme")) {
			isDarkTheme = localStorage.getItem("theme") === "dark";
		}

		// Jika tidak bisa ambil dari localStorage, coba ambil dari media query
		else if (window.matchMedia) {
			isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
		}

		else {
			console.warn("Cannot get any theme preference at all, will use default instead...");
		}

		let HTML = document.querySelector("html");
		if (!HTML) {
			throw new Error("HTML element not found!");
		}

		if (isDarkTheme) {
			HTML.setAttribute("data-bs-theme", "dark");
			this.ThemeToggle.innerText = "Ingin ganti ke tema terang? 🌞";
		}
		else {
			HTML.setAttribute("data-bs-theme", "light");
			this.ThemeToggle.innerText = "Ingin ganti ke tema gelap? 🌙";
		}
	}

	async FetchData() {
		const response = await fetch('data.json');

		if (!response.ok) {
			throw new Error(`Cannot GET data.json, HTTP status code: ${response.status}`);
		}

		const data = await response.json();

		if (!data["tarif-listrik"]) {
			throw new Error("Data golongan tarif not found!");
		}

		this.data = data;
		return this.data
	}

	AddInputListeners() {
		this.InputGolonganTarif.addEventListener("change", () => {
			this.PopulateInfoGolonganTarif(this.InputGolonganTarif.value);
			this.PopulateBatasDaya(this.InputGolonganTarif.value);
			this.PopulateBiayaPPJ(this.InputGolonganTarif.value, this.InputBatasDaya.value);
			this.HitungTarif();
		});

		this.InputBatasDaya.addEventListener("change", () => {
			this.PopulateBiayaPPJ(this.InputGolonganTarif.value, this.InputBatasDaya.value);
			this.HitungTarif();
		});

		this.InputBiayaPPJ.addEventListener("change", () => {
			let NilaiPPJ = Number.parseFloat(this.InputBiayaPPJ.value);

			if (Number.isNaN(NilaiPPJ)) {
				this.InputBiayaPPJ.value = this.InputBiayaPPJ.options[0].value;
				return;
			}

			if (NilaiPPJ < 0) {
				this.InputBiayaPPJManualContainer.classList.remove("d-none");
				this.InputBiayaPPJManual.removeAttribute("disabled");
				return;
			}
			this.InputBiayaPPJManualContainer.classList.add("d-none");
			this.InputBiayaPPJManual.setAttribute("disabled", "");

			this.HitungTarif();
		});

		// Ganti , jadi .0
		this.InputBiayaPPJManual.addEventListener("keypress", (e) => {
			if (e.key === ",") {
				e.preventDefault();

				// Jika di input field sudah ada simbol titik (.), jangan tambahkan lagi
				if (this.InputBiayaPPJManual.value.indexOf(".") !== -1) {
					return;
				}

				this.InputBiayaPPJManual.value += ".0";
			}
		});

		this.InputBiayaPPJManual.addEventListener("change", () => {
			let NilaiPPJManual = Number.parseFloat(this.InputBiayaPPJManual.value);

			if (Number.isNaN(NilaiPPJManual)) {
				this.InputBiayaPPJManual.classList.add("is-invalid");
				this.InputBiayaPPJManualHelp.innerText = "Biaya PPJ harus berupa angka!";
				return;
			}

			if (NilaiPPJManual < 0) {
				this.InputBiayaPPJManual.classList.add("is-invalid");
				this.InputBiayaPPJManualHelp.innerText = "Biaya PPJ tidak boleh kurang dari 0!";
				return;
			}

			this.InputBiayaPPJManual.classList.remove("is-invalid");

			this.HitungTarif();
		});

		this.InputJumlahPembelianToken.addEventListener("change", () => {
			this.HitungTarif();
		});
	}

	PopulateGolonganTarif() {
		if (!this.data) {
			throw new Error("Data not found!");
		}

		let Keys = Object.keys(this.data["tarif-listrik"]);

		const golonganTarif = Keys.map(key => {
			return `<option value="${key}">${key}</option>`;
		});

		this.InputGolonganTarif.innerHTML = `
			<option value="" selected>Pilih Golongan Tarif</option>
			${golonganTarif.join("")}
		`;
	}

	PopulateInfoGolonganTarif(KeyGolongan: string = "") {
		if (!this.data) {
			throw new Error("Data not found!");
		}

		if (!KeyGolongan) {
			this.InputGolonganTarifHelp.innerText = "";
			return;
		}

		let GolonganTerpilih = this.data["tarif-listrik"][KeyGolongan];

		if (!GolonganTerpilih) {
			this.InputGolonganTarifHelp.innerText = "Golongan Tarif tidak ditemukan!";
			return;
		}

		let help_text = "";

		//#region Cek kelas golongan
		let KelasGolongan = KeyGolongan.split("/")[0];
		if (KelasGolongan.includes("R-")) {
			help_text += `Rumah tangga tingkat-${KelasGolongan.split("-")[1]} `;
		}
		else if (KelasGolongan.includes("B-")) {
			help_text += `Bisnis tingkat-${KelasGolongan.split("-")[1]} `;
		}
		else if (KelasGolongan.includes("P-")) {
			help_text += `Pemerintah tingkat-${KelasGolongan.split("-")[1]} `;
		}
		else if (KelasGolongan.includes("L")) {
			help_text += "Lainnya ";
		}
		else {
			help_text += "Golongan Tidak Diketahui ";
		}
		//#endregion

		//#region Cek kelas tegangan
		const TextTegangan = [];

		if (KeyGolongan.indexOf("TR") !== -1) {
			TextTegangan.push("Teganan Rendah");
		}

		if (KeyGolongan.indexOf("TM") !== -1) {
			TextTegangan.push("Tegangan Menengah");
		}

		// Jika ada Tegangan Tinggi (TT)
		if (KeyGolongan.indexOf("TT") !== -1) {
			TextTegangan.push("Tegangan Tinggi");
		}

		if (TextTegangan.length > 0) {
			help_text += "(";

			help_text += TextTegangan.shift();

			for (let i = 0; i < TextTegangan.length - 1; i++) {
				help_text += `, ${TextTegangan[i]}`;
			}

			if (TextTegangan.length > 0) {
				help_text += ` dan ${TextTegangan.pop()}`;
			}

			help_text += ")";
		}
		//#endregion

		this.InputGolonganTarifHelp.innerText = help_text;
	}

	PopulateBatasDaya(KeyGolongan: string = "") {
		if (!this.data) {
			throw new Error("Data not found!");
		}

		this.InputBatasDaya.setAttribute("disabled", "");

		if (!KeyGolongan) {
			this.InputBatasDaya.innerHTML = "";
			this.InputGolonganTarifHelp.innerText = "";
			return;
		}

		let GolonganTerpilih = this.data["tarif-listrik"][KeyGolongan];

		if (!GolonganTerpilih) {
			return;
		}

		if (typeof GolonganTerpilih == "number") {
			this.InputBatasDaya.innerHTML = `
				<option value="0" selected>Golongan tidak memiliki batas daya</option>
			`;
			return;
		}

		let Keys = Object.keys(GolonganTerpilih);

		if (Keys.length == 0) {
			this.InputBatasDaya.innerHTML = `
				<option value="" selected>Tidak ada data batas daya</option>
			`;
			return;
		}

		if (Keys.length == 1) {
			this.InputBatasDaya.innerHTML = `
				<option value="0" selected>${Keys[0]}</option>
			`;
			return;
		}

		let KeyIncrement = 0;
		const batasDaya = Keys.map(key => {
			return `<option value="${KeyIncrement++}">${key}</option>`;
		});

		this.InputBatasDaya.innerHTML = `
			<option value="" selected>Pilih Batas Daya</option>
			${batasDaya.join("")}
		`;

		this.InputBatasDaya.removeAttribute("disabled");
	}

	PopulateBiayaPPJ(KeyGolongan: string = "", IndexBatasDaya: (string | number) = "") {
		const PPJOptions = [];
		PPJOptions.push(`<option value="" selected>Pilih Biaya PPj</option>`);
		PPJOptions.push(`<option value="0.0">Tidak ada PPj (0.0 %)</option>`);
		PPJOptions.push(`<option value="-1">Manual</option>`);

		if (!this.data) {
			throw new Error("Data not found!");
		}

		if (!KeyGolongan) {
			this.InputBiayaPPJ.innerHTML = "";
			this.InputBiayaPPJ.setAttribute("disabled", "");
			return;
		}

		if (typeof IndexBatasDaya === "string") {
			IndexBatasDaya = Number.parseInt(IndexBatasDaya);
		}

		if (isNaN(IndexBatasDaya) || IndexBatasDaya < 0) {
			this.InputBiayaPPJ.innerHTML = "";
			this.InputBiayaPPJ.setAttribute("disabled", "");
			return;
		}

		let DaerahKeys = Object.keys(this.data["tarif-ppj"]);

		for (const DaerahKey of DaerahKeys) {
			let DaerahTerpilih = this.data["tarif-ppj"][DaerahKey];

			// Jika daerah ini memiliki rate rata untuk semua golongan dan batas daya
			if (typeof DaerahTerpilih === "number") {
				PPJOptions.push(`<option value="${DaerahTerpilih}">${DaerahKey} (${DaerahTerpilih * 100} %)</option>`);
				continue;
			}

			let GolonganTerpilih = DaerahTerpilih[KeyGolongan];

			if (!GolonganTerpilih) {
				PPJOptions.push(`<option value="0.0">${DaerahKey} (Tidak ada data untuk golongan ini)</option>`);
				continue;
			}

			// Jika golongan ini memiliki rate rata untuk semua batas daya
			if (typeof GolonganTerpilih === "number") {
				PPJOptions.push(`<option value="${GolonganTerpilih}">${DaerahKey} (${GolonganTerpilih * 100} %)</option>`);
				continue;
			}

			let KeysBatasDaya = Object.keys(GolonganTerpilih);

			if (KeysBatasDaya.length == 0) {
				PPJOptions.push(`<option value="0.0">${DaerahKey} (Tidak ada data untuk golongan ini)</option>`);
				continue;
			}

			let RatePPj = GolonganTerpilih[KeysBatasDaya[IndexBatasDaya]];

			if (!RatePPj) {
				PPJOptions.push(`<option value="0.0">${DaerahKey} (Tidak ada data untuk batas daya ini)</option>`);
				continue;
			}

			PPJOptions.push(`<option value="${RatePPj}">${DaerahKey} (${RatePPj * 100} %)</option>`);
		}

		let PreviousIndex = this.InputBiayaPPJ.selectedIndex;

		this.InputBiayaPPJ.innerHTML = PPJOptions.join("");
		this.InputBiayaPPJ.removeAttribute("disabled");

		// Jika index sebelumnya tidak ada, maka set ke 0
		if (PreviousIndex !== -1) {
			this.InputBiayaPPJ.selectedIndex = PreviousIndex;
		}
	}

	HitungTarif() {
		if (!this.data) {
			throw new Error("Data not found!");
		}

		this.ClearOutput();

		let KeyGolongan = this.InputGolonganTarif.value;

		if (!KeyGolongan) {
			return;
		}

		let GolonganTerpilih = this.data["tarif-listrik"][KeyGolongan];

		if (!GolonganTerpilih) {
			return;
		}

		let IndexBatasDaya = Number.parseInt(this.InputBatasDaya.value);

		if (Number.isNaN(IndexBatasDaya)) {
			return;
		}

		let RateKwh = 0;

		// Jika golongan tarif sudah fix tidak ada batas daya, maka langsung ambil tarif golongan tersebut
		if (typeof GolonganTerpilih == "number") {
			RateKwh = GolonganTerpilih;
		}
		else if (typeof GolonganTerpilih == "object") {
			let Keys = Object.keys(GolonganTerpilih);
			RateKwh = GolonganTerpilih[Keys[IndexBatasDaya]];
		}
		else {
			throw new Error("Invalid GolonganTerpilih type!");
		}

		this.OutputTarifPerKwh.innerText = `Rp. ${RateKwh.toLocaleString("id-ID")}`;

		const InputJumlahPembelianToken = Number.parseInt(this.InputJumlahPembelianToken.value);

		if (!Number.isInteger(InputJumlahPembelianToken)) {
			return;
		}

		let RatePPj = Number.parseFloat(this.InputBiayaPPJ.value);

		if (Number.isNaN(RatePPj)) {
			throw new Error("RatePPj is NaN!");
		}

		// Jika RatePPj adalah -1, maka ambil dari manual
		if (RatePPj == -1) {
			RatePPj = Number.parseFloat(this.InputBiayaPPJManual.value) / 100;
		}

		if (Number.isNaN(RatePPj)) {
			return;
		}

		let BiayaPPJ = InputJumlahPembelianToken * RatePPj;

		this.OutputBiayaPPJ.innerText = `Rp. ${BiayaPPJ.toLocaleString("id-ID")}`;

		const NilaiBerihToken = InputJumlahPembelianToken - BiayaPPJ;

		this.OutputNilaiBersihToken.innerText = `Rp. ${NilaiBerihToken.toLocaleString("id-ID")}`;

		const IsEligibleForDiskon = this.CheckIfEligibleForDiskonAwal2025(KeyGolongan);

		let JumlahToken = NilaiBerihToken / RateKwh;

		if (IsEligibleForDiskon) {
			JumlahToken *= 2;
		}

		this.OutputJumlahToken.innerText = `${JumlahToken.toLocaleString("id-ID")} kWh`;

		if (IsEligibleForDiskon) {
			this.OutputAdditionalInfo.classList.add("text-success");
			this.OutputAdditionalInfo.innerText = "Anda berpotensi mendapatkan diskon 50% untuk pembelian token hingga 28 Februari 2025, maka dari itu jumlah kWh token diatas sudah dikalikan 2";
		}
		else {
			this.OutputAdditionalInfo.classList.remove("text-success");
			this.OutputAdditionalInfo.innerText = "";
		}
	}

	ClearOutput() {
		this.OutputTarifPerKwh.innerText = "-";
		this.OutputBiayaPPJ.innerText = "-";
		this.OutputNilaiBersihToken.innerText = "-";
		this.OutputJumlahToken.innerText = "-";
		this.OutputAdditionalInfo.innerText = "";
	}

	CheckIfEligibleForDiskonAwal2025(KeyGolongan: string) {
		const UNIX_END_PROMO = 1740761999; // 2025-02-28 23:59:59

		const UNIX_NOW = Math.floor(Date.now() / 1000);

		if (UNIX_NOW > UNIX_END_PROMO) {
			return false;
		}

		// Hanya golongan R-1/TR saja yang mendapatkan diskon
		if (KeyGolongan !== "R-1/TR") {
			return false;
		}

		return true;
	}
}