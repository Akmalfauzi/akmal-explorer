export class FileSize {
  private readonly bytes: number;

  constructor(bytes: number) {
    this.bytes = bytes;
    if (bytes < 0) {
      throw new Error('File size cannot be negative');
    }
  }

  get value(): number {
    return this.bytes;
  }

  get formatted(): string {
    if (this.bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(this.bytes) / Math.log(k));

    return parseFloat((this.bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  static fromBytes(bytes: number): FileSize {
    return new FileSize(bytes);
  }
}