/**
BUILD BY OWNER YUSHINO-MD, RENAME IS OK AND DO NOT CHANGE THIS WATERMARK IF YOU RESPECT ME
github:Aldii-gh 
**/
const { createCanvas, loadImage, GlobalFonts } = await import("@napi-rs/canvas");

export async function ektpGen({ userImageBuffer, NIK = "1234567890123456", NAMA = "NAMA LENGKAP", TTL = "KOTA, 01-01-2000", GENDER = "LAKI-LAKI", DUSUN = "ALAMAT/DUSUN", RT_RW = "001/002", DESA = "NAMA DESA", KECAMATAN = "NAMA KECAMATAN", AGAMA = "ISLAM", STATUS = "BELUM KAWIN", PEKERJAAN = "PELAJAR/MAHASISWA", PROVINSI = "SUMATERA UTARA", KABUPATEN = "DELI SERDANG"}) {
  try { 
    if (!userImageBuffer) throw new Error("Buffer gambar tidak ditemukan!");

    const base = "https://raw.githubusercontent.com/aldii-gh/canvas-gen/main/ektpgen";
    const [t, a, o] = await Promise.all([
      fetch(`${base}/ektp.png`),
      fetch(`${base}/fonts/ArielNb.ttf`),
      fetch(`${base}/fonts/OCR%20A%20Extended.ttf`)
    ]);

    if (!t.ok || !a.ok || !o.ok) throw new Error("Gagal mengunduh template/font");
    const [tb, ab, ob] = await Promise.all([t.arrayBuffer(), a.arrayBuffer(), o.arrayBuffer()]);
    GlobalFonts.register(Buffer.from(ab), "ArialBoldCustom");
    GlobalFonts.register(Buffer.from(ob), "OCRACustom");
    
    const template = await loadImage(Buffer.from(tb));
    const canvas = createCanvas(template.width, template.height);
    const ayam = canvas.getContext("2d");

    // Directly load from userImageBuffer parameter
    const img = await loadImage(Buffer.from(userImageBuffer));

    // Inner shadow function
    function drawInnerShadow(ctx, img, x, y, w, h, blur = 5) {
      ctx.save();
      ctx.drawImage(img, x, y, w, h);
      ctx.globalCompositeOperation = "source-atop";
      const layers = 10;
      for (let i = layers; i >= 1; i--) {
        const inset = (blur / layers) * i;
        const alpha = 0.18 * (1 - i / layers);
        ctx.strokeStyle = `rgba(0,0,0,${alpha})`;
        ctx.lineWidth = blur / layers + 1;
        ctx.strokeRect(x + inset, y + inset, w - inset * 2, h - inset * 2);
      } 
      ctx.restore(); 
    }

    // GENERATE
    const provinsi = PROVINSI
    const kabupaten = KABUPATEN

    ayam.drawImage(template, 0, 0);
    drawInnerShadow(ayam, img, 2262, 666, 726, 967, 150);

    ayam.fillStyle = "#000";
    ayam.textAlign = "center";
    ayam.font = 'bold 130px "ArialBoldCustom"';
    ayam.fillText(provinsi, 1620, 360);
    ayam.fillText(kabupaten, 1620, 500);
    
    ayam.textAlign = "left";
    ayam.font = '130px "OCRACustom"';
    ayam.fillText(NIK, 900, 735);

    ayam.font = 'bold 70px "ArialBoldCustom"';
    ayam.letterSpacing = "-2px"; 
    ayam.fillText(NAMA, 960, 865); 
    ayam.fillText(TTL, 960, 955); 
    ayam.fillText(GENDER, 960, 1040);
    ayam.fillText(DUSUN, 960, 1130);
    ayam.fillText(RT_RW, 960, 1220);
    ayam.fillText(DESA, 960, 1304);
    ayam.fillText(KECAMATAN, 960, 1394);
    ayam.fillText(AGAMA, 960, 1484);
    ayam.fillText(STATUS, 960, 1574);
    ayam.fillText(PEKERJAAN, 960, 1664);
    ayam.fillText("WNI", 960, 1753);
    ayam.fillText("SEUMUR HIDUP", 960, 1843);

    ayam.textAlign = "center";
    ayam.fillText("YUSHINO-MD", 2601, 1725);
    
    const buffer = await canvas.encode("png");
    return buffer;
  } catch (e) {
    console.error("Gagal membuat gambar:", e.message);
    return null; 
  }
}
