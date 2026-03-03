const generateBtn = document.getElementById("generateBtn");
const downloadAllBtn = document.getElementById("downloadAllBtn");
const qrContainer = document.getElementById("qrContainer");

generateBtn.addEventListener("click", generateQRCodes);
downloadAllBtn.addEventListener("click", downloadAllQRCodes);

function generateQRCodes() {
  qrContainer.innerHTML = "";

  const input = document.getElementById("qrInput").value;
  const lines = input.split("\n").filter(line => line.trim() !== "");

  lines.forEach((text, index) => {
    const qrItem = document.createElement("div");
    qrItem.className = "qr-item";

    const qrDiv = document.createElement("div");
    qrDiv.id = `qr-${index}`;

    new QRCode(qrDiv, {
      text: text,
      width: 150,
      height: 150,
    });

    const label = document.createElement("div");
    label.className = "qr-label";
    label.textContent = text;

    const downloadBtn = document.createElement("button");
    downloadBtn.textContent = "Download";
    downloadBtn.className = "download-btn";

    downloadBtn.addEventListener("click", () => {
      downloadSingleQR(qrDiv, text);
    });

    qrItem.appendChild(qrDiv);
    qrItem.appendChild(label);
    qrItem.appendChild(downloadBtn);
    qrContainer.appendChild(qrItem);
  });
}

function downloadSingleQR(qrDiv, text) {
  const canvas = qrDiv.querySelector("canvas");
  const link = document.createElement("a");

  link.href = canvas.toDataURL();
  link.download = formatFileName(text) + ".png";
  link.click();
}

async function downloadAllQRCodes() {
  const zip = new JSZip();
  const items = document.querySelectorAll(".qr-item");

  items.forEach((item) => {
    const qrDiv = item.querySelector("div[id^='qr-']");
    const text = item.querySelector(".qr-label").textContent;
    const canvas = qrDiv.querySelector("canvas");

    const base64 = canvas.toDataURL().split(",")[1];

    zip.file(formatFileName(text) + ".png", base64, { base64: true });
  });

  const content = await zip.generateAsync({ type: "blob" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(content);
  link.download = "batch-qrs.zip";
  link.click();
}

/* 🔥 Smart File Name Formatter */
function formatFileName(text) {
  return text
    .trim()
    .replace(/https?:\/\//, "")      // remove http/https
    .replace(/www\./, "")           // remove www
    .replace(/[^a-zA-Z0-9]/g, "-")  // replace special chars
    .replace(/-+/g, "-")            // remove duplicate dashes
    .substring(0, 50)               // limit length
    .toLowerCase();
}