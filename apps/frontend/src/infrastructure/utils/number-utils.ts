// Format angka besar menjadi format yang mudah dibaca dengan suffix K, M, B, T
// Contoh: 1500 -> 1.5K, 2500000 -> 2.5M, 1000000000 -> 1B
export function formatNumber(num: number): string {
  if (num < 1000) {
    return num.toString();
  }

  const suffixes = ['', 'K', 'M', 'B', 'T'];
  let value = num;
  let suffixIndex = 0;

  while (value >= 1000 && suffixIndex < suffixes.length - 1) {
    value /= 1000;
    suffixIndex++;
  }

  const formatted = suffixIndex > 0
    ? (value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)).replace(/\.0$/, '')
    : value.toString();

  return `${formatted}${suffixes[suffixIndex]}`;
}

// Format ukuran file dengan unit yang sesuai (B, KB, MB, GB, TB)
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Format rentang hasil pencarian (contoh: "1-10 dari 1,234 hasil")
export function formatResultsRange(current: number, total: number): string {
  const formattedCurrent = formatNumber(current);
  const formattedTotal = formatNumber(total);

  if (total >= 1000) {
    return `${formattedCurrent} of ${formattedTotal} results`;
  }
  return `${formattedCurrent} of ${formattedTotal.toLocaleString()} results`;
}