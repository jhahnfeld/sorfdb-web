import pako from "pako";

/**
 * Detects if a file contains gzip content and decompresses it. If a file is not a gzip file, it is read without decompression.
 *
 * @param {*} file
 * @param {*} progressHandler An optional handler to obtains progress event (numbers from 0 to 1)
 * @returns A promise with the content as a Buffer.
 */
function readGzipFile(
  file: File,
  progressHandler: (progress: number) => void,
): Promise<ArrayBuffer> {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    let isGzip: boolean = false;
    const inflate: pako.Inflate = new pako.Inflate();
    const chunks: ArrayBuffer[] = [];
    const chunkSize: number = 1024 * 1000;
    let offset: number = 0;
    const reader = new FileReader();

    // process chunks
    reader.onload = function () {
      if (!isGzip) {
        const array = new Uint8Array(reader.result as ArrayBuffer).slice(0, 2);
        if (array[0] == 0x1f && array[1] == 0x8b) {
          isGzip = true;
        } else {
          isGzip = false;
        }
      }
      if (isGzip) {
        inflate.push(reader.result as ArrayBuffer);
      } else {
        chunks.push(reader.result as ArrayBuffer);
      }
      offset += chunkSize;
      progressHandler(Math.min(1, offset / file.size));
      seek();
    };

    reader.onerror = reject;
    seek();
    function seek() {
      if (offset >= file.size) {
        // read is complete. return the data.
        if (isGzip) {
          if (inflate.err) {
            reject(inflate.msg);
          } else {
            resolve(inflate.result as ArrayBuffer);
          }
        } else {
          // concatenate the read buffers
          const chunkSizes = chunks.map((x) => x.byteLength);
          const totalSize = chunkSizes.reduce((acc, cur) => acc + cur, 0);
          const totalBuffer = new Uint8Array(totalSize);
          chunks.reduce((acc, cur, i) => {
            totalBuffer.set(new Uint8Array(chunks[i]), acc);
            return acc + chunks[i].byteLength;
          }, 0);

          resolve(totalBuffer.buffer);
        }
      } else {
        // trigger read of next chunk
        const slice = file.slice(offset, offset + chunkSize);
        reader.readAsArrayBuffer(slice);
      }
    }
  });
}

export default readGzipFile;
