=> const { createCanvas, loadImage, GlobalFonts } = await import("@napi-rs/canvas");
try {
  const base = "https://raw.githubusercontent.com/aldii-gh/canvas-gen/main";
  const [t, a, o] = await Promise.all([
    fetch(`${base}/ektp.png`),
    fetch(`${base}/fonts/ArialNb.ttf`),
    fetch(`${base}/fonts/OCR%20A%20Extended.ttf`)
  ]);
  if (!t.ok || !a.ok || !o.ok) throw new Error("Gagal mengunduh template/font");
  const [tb, ab, ob] = await Promise.all([t.arrayBuffer(), a.arrayBuffer(), o.arrayBuffer()]);
  GlobalFonts.register(Buffer.from(ab), "ArialCustom");
  GlobalFonts.register(Buffer.from(ob), "OCRACustom");
  const template = await loadImage(Buffer.from(tb));
  const canvas = createCanvas(template.width, template.height);
  const ayam = canvas.getContext("2d");
  
  //generate
  ayam.drawImage(template, 0, 0);
  ayam.font = '130px "OCRACustom"';
  ayam.fillText("1234567890123456", 996, 715); //nik
  ayam.font = '100px "ArialCustom"';
  ayam.fillText("AYAM CUKURUKUK", 996, 846); //Nama
  
  const buffer = await canvas.encode("png");
  await sock.sendMessage(m.chat, { image: buffer, caption: "Tes rendering font dan template." }, { quoted: m });
} catch (e) {
  await ctx.reply(`Gagal membuat gambar: ${e.message}`);
}
