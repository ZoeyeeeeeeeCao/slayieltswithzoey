const pen = (() => {
  const layers = new Map();
  const bars = [];
  const svgNS = "http://www.w3.org/2000/svg";
  let enabled = false;
  let manualEraser = false;
  let active = null;

  function eraseTo(layer, x, y) {
    const steps = Math.max(1, Math.ceil(Math.hypot(x - active.x, y - active.y) / 5));
    for (const path of Array.from(layer.children)) {
      // Widen only the hit area while checking this sweep.
      path.style.strokeWidth = "16";
      for (let i = 1; i <= steps; i++) {
        const point = new DOMPoint(active.x + (x - active.x) * i / steps, active.y + (y - active.y) * i / steps);
        if (path.isPointInStroke(point)) {
          path.remove();
          break;
        }
      }
      path.style.removeProperty("stroke-width");
    }
    active.x = x;
    active.y = y;
  }

  function finish(event) {
    if (active?.id === event.pointerId) active = null;
  }

  function attach(host, key) {
    host.classList.add("ink-surface");
    let layer = layers.get(key);
    if (!layer) {
      layer = document.createElementNS(svgNS, "svg");
      layer.classList.add("ink-layer");
      layer.setAttribute("aria-hidden", "true");
      layers.set(key, layer);
      layer.onpointerdown = event => {
        const penTail = event.pointerType === "pen" && (event.button === 5 || (event.buttons & 32) !== 0);
        if (!enabled || active || (!penTail && event.button !== 0)) return;
        event.preventDefault();
        const rect = layer.getBoundingClientRect();
        const x = event.clientX - rect.left, y = event.clientY - rect.top;
        layer.setPointerCapture(event.pointerId);
        if (penTail || manualEraser) {
          active = {id: event.pointerId, erasing: true, x, y};
          eraseTo(layer, x, y);
          return;
        }
        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", `M ${x} ${y} l 0.01 0`);
        layer.append(path);
        active = {id: event.pointerId, path};
      };
      layer.onpointermove = event => {
        if (active?.id !== event.pointerId) return;
        const rect = layer.getBoundingClientRect();
        const samples = event.getCoalescedEvents?.() || [];
        const points = samples.length ? samples : [event];
        if (active.erasing) {
          for (const p of points) eraseTo(layer, p.clientX - rect.left, p.clientY - rect.top);
          return;
        }
        const segment = points.map(p => ` L ${p.clientX - rect.left} ${p.clientY - rect.top}`).join("");
        active.path.setAttribute("d", active.path.getAttribute("d") + segment);
      };
      layer.onpointerup = layer.onpointercancel = layer.onlostpointercapture = finish;
    }
    host.append(layer);
  }

  function update() {
    document.body.classList.toggle("pen-on", enabled);
    for (const [toggle, eraser, clear] of bars) {
      toggle.textContent = enabled ? "退出手写" : "✎ 手写";
      toggle.setAttribute("aria-pressed", String(enabled));
      clear.hidden = !enabled;
      eraser.hidden = !enabled;
      eraser.setAttribute("aria-pressed", String(manualEraser));
    }
  }

  function toolbar(parent, region, before = null) {
    const bar = document.createElement("div");
    bar.className = "pen-tools";
    const toggle = document.createElement("button"), clear = document.createElement("button");
    clear.textContent = "清除本页笔迹";
    const eraser = document.createElement("button");
    eraser.textContent = "橡皮";
    eraser.title = "擦除碰到的整笔，再点一次恢复书写";
    eraser.onclick = () => { manualEraser = !manualEraser; update(); };
    toggle.onclick = () => { enabled = !enabled; manualEraser = false; active = null; update(); };
    clear.onclick = () => {
      for (const layer of region.querySelectorAll(".ink-layer")) {
        if (layer.getClientRects().length) layer.replaceChildren();
      }
    };
    bars.push([toggle, eraser, clear]);
    bar.append(toggle, eraser, clear);
    parent.insertBefore(bar, before);
    update();
  }
  return {attach, toolbar};
})();
