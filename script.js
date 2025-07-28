function shortenUrl() {
  const input = document.getElementById("urlInput");
  const longUrl = input.value.trim();
  if (!longUrl) return alert("Please enter a URL");

  const code = Math.random().toString(36).substr(2, 5);
  const shortUrl = `${location.origin}/#${code}`;

  let data = JSON.parse(localStorage.getItem("urls") || "{}");
  data[code] = {
    longUrl: longUrl,
    clicks: 0
  };
  localStorage.setItem("urls", JSON.stringify(data));

  displayShortUrl(shortUrl, code);
  showAnalytics();
}

function displayShortUrl(shortUrl, code) {
  const result = document.getElementById("resultSection");
  result.innerHTML = `
    <p>Shortened URL:</p>
    <a href="${shortUrl}" onclick="trackClick('${code}')">${shortUrl}</a>
  `;
}

function trackClick(code) {
  let data = JSON.parse(localStorage.getItem("urls") || "{}");
  if (data[code]) {
    data[code].clicks += 1;
    localStorage.setItem("urls", JSON.stringify(data));
  }
}

function showAnalytics() {
  const container = document.getElementById("analyticsSection");
  container.innerHTML = "";
  let data = JSON.parse(localStorage.getItem("urls") || "{}");

  Object.keys(data).forEach(code => {
    const item = data[code];
    const div = document.createElement("div");
    div.className = "analytics-item";
    div.innerHTML = `
      <p>🔗 ${item.longUrl}</p>
      <p>Clicks: ${item.clicks}</p>
    `;
    container.appendChild(div);
  });
}

// Run on page load
window.onload = () => {
  // Check if user clicked a short URL
  const hash = location.hash.replace("#", "");
  if (hash) {
    let data = JSON.parse(localStorage.getItem("urls") || "{}");
    if (data[hash]) {
      data[hash].clicks += 1;
      localStorage.setItem("urls", JSON.stringify(data));
      location.href = data[hash].longUrl;
    }
  }

  showAnalytics();
};
