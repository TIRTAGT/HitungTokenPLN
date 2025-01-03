/**
 * TIRTAGT/HitungTokenPLN
 * 
 * Aplikasi kalkulator penghitung jumlah kWh atau nilai token dari pembelian listrik PLN
 * @link https://github.com/TIRTAGT/HitungTokenPLN
 * @author Matthew Tirtawidjaja <matthew@tirtagt.xyz>
 * @copyright 2025 Matthew Tirtawidjaja <matthew@tirtagt.xyz>
 * @license MIT
 */

type Data = {
	"tarif-listrik": {
		[id_golongan: string]: DayaGolongan<number>;
	},
	"tarif-ppj": {
		[nama_daerah: string]: {
			[id_golongan: string]: DayaGolongan<number>;
		} | number;
	}
}

type DayaGolongan<T> = {
	[batas_daya: string]: T;
} | T;

export default Data;