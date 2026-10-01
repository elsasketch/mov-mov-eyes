// =========================
// 封面 → 眼睛頁
// =========================

const coverPage = document.querySelector("#cover-page");

const eyePage = document.querySelector("#eye-page");

const enterBtn = document.querySelector("#enter-btn");

enterBtn.addEventListener("click", () => {
  // 隱藏封面
  coverPage.style.display = "none";

  // 顯示眼睛頁
  eyePage.classList.add("active");
});
const container = document.querySelector("#svg-container");

fetch("./img/movingeyes.svg")
  .then((response) => {
    if (!response.ok) throw new Error(`SVG 載入失敗：${response.status}`);
    return response.text();
  })
  .then((svgText) => {
    container.innerHTML = svgText;

    const leftPupil = container.querySelector("#left-pupil");
    const rightPupil = container.querySelector("#right-pupil");

    if (!leftPupil || !rightPupil) {
      throw new Error("找不到 left-pupil 或 right-pupil");
    }

    // 瞳孔最大移動距離（SVG 座標）。想再大可提高這兩個數字。
    const MAX_X = 85;
    const MAX_Y = 80;

    function movePupils(clientX, clientY) {
      // 把滑鼠位置轉成 -1 ~ 1，讓上下左右都能有明顯幅度。
      const nx = Math.max(
        -1,
        Math.min(1, (clientX / window.innerWidth - 0.5) * 2),
      );
      const ny = Math.max(
        -1,
        Math.min(1, (clientY / window.innerHeight - 0.5) * 2),
      );

      // 橢圓限制：斜向移動時不會超過最大範圍。
      const len = Math.hypot(nx, ny);
      const scale = len > 1 ? 1 / len : 1;
      const x = nx * scale * MAX_X;
      const y = ny * scale * MAX_Y;

      leftPupil.setAttribute("transform", `translate(${x} ${y})`);
      rightPupil.setAttribute("transform", `translate(${x} ${y})`);
    }

    window.addEventListener("pointermove", (event) => {
      movePupils(event.clientX, event.clientY);
    });

    // 手機／平板觸控也可以測試。
    window.addEventListener("pointerdown", (event) => {
      movePupils(event.clientX, event.clientY);
    });
  })
  .catch((error) => {
    console.error(error);
    container.innerHTML = `<p style="font-family:sans-serif;padding:24px">${error.message}</p>`;
  });
